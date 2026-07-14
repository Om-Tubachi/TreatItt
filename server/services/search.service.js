import { Prisma } from '@prisma/client';
import { prisma } from '../db/prisma.js';
import { ApiError } from '../utils/ApiError.js';

const ENTITY_TYPES = ['product', 'waste', 'requirement', 'recycling'];

// what each entity type includes when hydrating full records after the lookup query
const HYDRATE_INCLUDE = {
    product: {
        frp: { include: { composition: true, category: true, grade: true, resin: true } },
        form_templates: true,
        users: { select: { id: true, username: true } },
    },
    waste: {
        frp: { include: { composition: true, category: true, grade: true, resin: true } },
        form_templates: true,
        users: { select: { id: true, username: true } },
        collectors: true,
        manufacturing_processes: true,
    },
    requirement: {
        frp: { include: { composition: true, category: true, grade: true, resin: true } },
        form_templates: true,
        users: { select: { id: true, username: true } },
    },
    recycling: {
        treatments: {
            include: {
                frp: { include: { composition: true, category: true, grade: true, resin: true } },
                treatment_processes: { include: { treatment_methods: true } },
            },
        },
        recyclers: { include: { users: { select: { id: true, username: true } } } },
    },
};

const HYDRATE_MODEL = {
    product: 'products',
    waste: 'frp_wastes',
    requirement: 'frp_requirements',
    recycling: 'recycler_processes',
};

/**
 * Single field-level range clause that works regardless of whether the entity
 * stores this metric as one exact value (product/waste/recycling -> `key`) or
 * as a true min/max pair (requirement -> `key_min`/`key_max`). See
 * lookupSync.service.js for the write-side convention this mirrors.
 */
function metricRangeClause(key, min, max) {
    const exactCond =
        min != null && max != null
            ? Prisma.sql`(extra_filters ->> ${key}::text)::numeric BETWEEN ${min} AND ${max}`
            : min != null
                ? Prisma.sql`(extra_filters ->> ${key}::text)::numeric >= ${min}`
                : Prisma.sql`(extra_filters ->> ${key}::text)::numeric <= ${max}`;

    // overlap test against a stored min/max pair
    const rangeCond = Prisma.join(
        [
            min != null
                ? Prisma.sql`(extra_filters ->> ${key + '_max'}::text)::numeric >= ${min}`
                : Prisma.sql`TRUE`,
            max != null
                ? Prisma.sql`(extra_filters ->> ${key + '_min'}::text)::numeric <= ${max}`
                : Prisma.sql`TRUE`,
        ],
        ' AND '
    );

    return Prisma.sql`(${exactCond} OR (${rangeCond}))`;
}

/**
 * Rough bounding-box prefilter — good enough at this scale. Exact distance +
 * sort happens client-side on the (small) resulting set, no PostGIS needed yet.
 */
function nearClause(near) {
    if (!near?.lat || !near?.lng || !near?.radiusKm) return null;
    const latDelta = near.radiusKm / 111;
    const lngDelta = near.radiusKm / (111 * Math.cos((near.lat * Math.PI) / 180));
    return Prisma.sql`
        latitude BETWEEN ${near.lat - latDelta} AND ${near.lat + latDelta}
        AND longitude BETWEEN ${near.lng - lngDelta} AND ${near.lng + lngDelta}
    `;
}

function buildLayer2Clauses(filters) {
    const clauses = [];
    if (filters.categoryId?.length) clauses.push(Prisma.sql`category_id = ANY(${filters.categoryId}::uuid[])`);
    if (filters.compositionId?.length) clauses.push(Prisma.sql`composition_id = ANY(${filters.compositionId}::uuid[])`);
    if (filters.gradeId?.length) clauses.push(Prisma.sql`grade_id = ANY(${filters.gradeId}::uuid[])`);
    if (filters.resinId?.length) clauses.push(Prisma.sql`resin_id = ANY(${filters.resinId}::uuid[])`);
    if (filters.formTemplateId?.length) clauses.push(Prisma.sql`form_template_id = ANY(${filters.formTemplateId}::uuid[])`);
    return clauses;
}

class SearchService {
    constructor(prisma) {
        this.prisma = prisma;
    }

    // layer 3 schema resolution: collect the union of filterable metric keys
    // allowed for the selected entity types, so client-sent metric filters can
    // be whitelisted before touching raw JSONB keys in SQL.
    async resolveAllowedMetricKeys(entityTypes, formTemplateIds) {
        const keys = new Set();

        const nonRecycling = entityTypes.filter((t) => t !== 'recycling');
        if (nonRecycling.length) {
            const templates = await this.prisma.form_templates.findMany({
                where: {
                    applies_to: { hasSome: nonRecycling },
                    ...(formTemplateIds?.length ? { id: { in: formTemplateIds } } : {}),
                },
            });
            templates.forEach((t) => {
                const schema = typeof t.metrics_schema === 'string' ? JSON.parse(t.metrics_schema) : t.metrics_schema;
                (schema || []).forEach((f) => f.filterable && keys.add(f.key));
            });
        }

        if (entityTypes.includes('recycling')) {
            const methods = await this.prisma.treatment_methods.findMany();
            methods.forEach((m) => {
                const schema =
                    typeof m.process_parameter_schema === 'string'
                        ? JSON.parse(m.process_parameter_schema)
                        : m.process_parameter_schema;
                (schema || []).forEach((f) => f.filterable && keys.add(f.key));
            });
        }

        return keys;
    }

    async search(req) {
        const filters = req.body ?? {};
        const page = Math.max(1, parseInt(filters.page) || 1);
        const pageSize = Math.min(100, Math.max(1, parseInt(filters.pageSize) || 20));
        const offset = (page - 1) * pageSize;

        const entityTypes = (filters.entityTypes ?? []).filter((t) => ENTITY_TYPES.includes(t));
        if (!entityTypes.length) throw new ApiError(400, 'At least one valid entityType is required');

        const allowedKeys = await this.resolveAllowedMetricKeys(entityTypes, filters.formTemplateId);

        const clauses = [Prisma.sql`entity_type = ANY(${entityTypes}::text[])`, ...buildLayer2Clauses(filters)];

        for (const [key, range] of Object.entries(filters.metrics ?? {})) {
            if (!allowedKeys.has(key)) continue; // drop anything not in the resolved schema
            if (range?.min != null || range?.max != null) {
                clauses.push(metricRangeClause(key, range.min ?? null, range.max ?? null));
            } else if (range?.eq != null) {
                clauses.push(Prisma.sql`extra_filters ->> ${key}::text = ${String(range.eq)}`);
            } else if (Array.isArray(range?.in) && range.in.length) {
                clauses.push(Prisma.sql`extra_filters ->> ${key}::text = ANY(${range.in.map(String)})`);
            }
        }

        if (filters.recency?.withinHours != null) {
            clauses.push(Prisma.sql`createdat >= now() - (${filters.recency.withinHours}::text || ' hours')::interval`);
        }

        const where = Prisma.join(clauses, ' AND ');
        const orderBy = filters.recency?.sort === 'oldest' ? Prisma.sql`createdat ASC` : Prisma.sql`createdat DESC`;

        const [rows, countRows] = await Promise.all([
            this.prisma.$queryRaw`
                SELECT entity_type, entity_id, latitude, longitude
                FROM lookup_entries
                WHERE ${where}
                ORDER BY ${orderBy}
                LIMIT ${pageSize} OFFSET ${offset}
            `,
            this.prisma.$queryRaw`SELECT COUNT(*)::int AS count FROM lookup_entries WHERE ${where}`,
        ]);

        const total = countRows[0]?.count ?? 0;
        if (!rows.length) return { results: [], pins: [], page, pageSize, total };

        const results = await this.hydrate(rows);

        return {
            results,
            pins: rows.map((r) => ({
                entityType: r.entity_type,
                entityId: r.entity_id,
                latitude: r.latitude,
                longitude: r.longitude,
            })),
            page,
            pageSize,
            total,
        };
    }

    async hydrate(rows) {
        const idsByType = {};
        rows.forEach((r) => {
            (idsByType[r.entity_type] ??= []).push(r.entity_id);
        });

        const grouped = await Promise.all(
            Object.entries(idsByType).map(async ([entityType, ids]) => {
                const model = HYDRATE_MODEL[entityType];
                const records = await this.prisma[model].findMany({
                    where: { id: { in: ids } },
                    include: HYDRATE_INCLUDE[entityType],
                });
                return records.map((r) => ({ ...r, __entityType: entityType }));
            })
        );

        const byId = new Map();
        grouped.flat().forEach((r) => byId.set(r.id, r));

        // preserve the order/relevance returned by the lookup query — `in` doesn't
        return rows.map((r) => byId.get(r.entity_id)).filter(Boolean);
    }

    /**
     * Map pins — deliberately separate from search() rather than a flag on it:
     * actor mode queries `users` (one pin per person), entity mode queries
     * `lookup_entries` (one pin per listing). Different shape, no hydration
     * either way, so it doesn't belong behind the same code path as search().
     */
    async searchPins(req) {
        const filters = req.body ?? {};
        const entityTypes = (filters.entityTypes ?? []).filter((t) => ENTITY_TYPES.includes(t));
        if (!entityTypes.length) throw new ApiError(400, 'At least one valid entityType is required');

        const allowedKeys = await this.resolveAllowedMetricKeys(entityTypes, filters.formTemplateId);
        const clauses = [Prisma.sql`entity_type = ANY(${entityTypes}::text[])`, ...buildLayer2Clauses(filters)];

        for (const [key, range] of Object.entries(filters.metrics ?? {})) {
            if (!allowedKeys.has(key)) continue;
            if (range?.min != null || range?.max != null) {
                clauses.push(metricRangeClause(key, range.min ?? null, range.max ?? null));
            } else if (range?.eq != null) {
                clauses.push(Prisma.sql`extra_filters ->> ${key}::text = ${String(range.eq)}`);
            } else if (Array.isArray(range?.in) && range.in.length) {
                clauses.push(Prisma.sql`extra_filters ->> ${key}::text = ANY(${range.in.map(String)})`);
            }
        }

        if (filters.mode === 'actor') {
            // one pin per user: find distinct u_ids matching the entity/layer2/metric
            // filters, then fetch their own lat/long from `users` (not the listing's)
            const lookupWhere = Prisma.join(clauses, ' AND ');
            const uidRows = await this.prisma.$queryRaw`
                SELECT DISTINCT u_id FROM lookup_entries WHERE ${lookupWhere} AND u_id IS NOT NULL
            `;
            const uids = uidRows.map((r) => r.u_id);
            if (!uids.length) return { pins: [] };

            const userClauses = [
                Prisma.sql`id = ANY(${uids}::uuid[])`,
                Prisma.sql`latitude IS NOT NULL AND longitude IS NOT NULL`,
            ];
            const near = nearClause(filters.near);
            if (near) userClauses.push(near);
            const userWhere = Prisma.join(userClauses, ' AND ');

            const users = await this.prisma.$queryRaw`
                SELECT id, username, first_name, last_name, company_name, latitude, longitude
                FROM users WHERE ${userWhere}
            `;

            return {
                pins: users.map((u) => ({
                    kind: 'actor',
                    userId: u.id,
                    username: u.username,
                    displayName: [u.first_name, u.last_name].filter(Boolean).join(' ') || u.username,
                    company: u.company_name,
                    latitude: u.latitude,
                    longitude: u.longitude,
                })),
            };
        }

        // entity mode — one pin per listing, straight off lookup_entries
        clauses.push(Prisma.sql`latitude IS NOT NULL AND longitude IS NOT NULL`);
        const near = nearClause(filters.near);
        if (near) clauses.push(near);
        const where = Prisma.join(clauses, ' AND ');

        const rows = await this.prisma.$queryRaw`
            SELECT entity_type, entity_id, latitude, longitude
            FROM lookup_entries WHERE ${where}
        `;

        return {
            pins: rows.map((r) => ({
                kind: 'entity',
                entityType: r.entity_type,
                entityId: r.entity_id,
                latitude: r.latitude,
                longitude: r.longitude,
            })),
        };
    }

    // layer-2 cascading options: given the current filter state, which category/
    // composition/grade/resin values still have matching rows. Simple version —
    // computed against the full current filter state rather than excluding each
    // dimension from itself, which is the one refinement worth adding later if
    // dead-end combinations turn out to be common in practice.
    async getFacetOptions(req) {
        const filters = req.body ?? {};
        const entityTypes = (filters.entityTypes ?? []).filter((t) => ENTITY_TYPES.includes(t));
        if (!entityTypes.length) throw new ApiError(400, 'At least one valid entityType is required');

        const clauses = [Prisma.sql`entity_type = ANY(${entityTypes}::text[])`, ...buildLayer2Clauses(filters)];
        const where = Prisma.join(clauses, ' AND ');

        const [categories, compositions, grades, resins] = await Promise.all([
            this.prisma.$queryRaw`SELECT DISTINCT category_id FROM lookup_entries WHERE ${where} AND category_id IS NOT NULL`,
            this.prisma.$queryRaw`SELECT DISTINCT composition_id FROM lookup_entries WHERE ${where} AND composition_id IS NOT NULL`,
            this.prisma.$queryRaw`SELECT DISTINCT grade_id FROM lookup_entries WHERE ${where} AND grade_id IS NOT NULL`,
            this.prisma.$queryRaw`SELECT DISTINCT resin_id FROM lookup_entries WHERE ${where} AND resin_id IS NOT NULL`,
        ]);

        return {
            categoryIds: categories.map((r) => r.category_id),
            compositionIds: compositions.map((r) => r.composition_id),
            gradeIds: grades.map((r) => r.grade_id),
            resinIds: resins.map((r) => r.resin_id),
        };
    }
}

export const searchService = new SearchService(prisma);