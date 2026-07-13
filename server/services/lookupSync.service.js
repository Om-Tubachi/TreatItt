import { prisma } from '../db/prisma.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * Per-entity-type config for building a lookup_entries row.
 *
 * getSchema / getMetricsValues let each entity source its filter schema and raw
 * metric values from wherever they actually live (form_templates for product/waste/
 * requirement, treatment_methods for recycling — these are structurally different
 * so they don't share a single field mapping).
 *
 * map() produces everything else that goes on the lookup row.
 */
const ENTITY_CONFIG = {
    waste: {
        model: 'frp_wastes',
        metricsField: 'metrics', // exact single-value storage
        include: { frp: true, form_templates: true },
        getSchema: (row) => row.form_templates?.metrics_schema,
        getMetricsValues: (row) => row.metrics,
        map: (row) => ({
            u_id: row.u_id ?? null,
            frp_id: row.frp_id ?? null,
            composition_id: row.frp?.composition_id ?? null,
            category_id: row.frp?.category_id ?? null,
            grade_id: row.frp?.grade_id ?? null,
            resin_id: row.frp?.resin_id ?? null,
            form_template_id: row.form_template_id ?? null,
            price: row.price_per_kg ?? null,
            status: row.status ?? null,
            latitude: row.latitude ?? null,
            longitude: row.longitude ?? null,
        }),
    },
    product: {
        model: 'products',
        metricsField: 'metrics', // exact single-value storage
        include: { frp: true, form_templates: true },
        getSchema: (row) => row.form_templates?.metrics_schema,
        getMetricsValues: (row) => row.metrics,
        map: (row) => ({
            u_id: row.u_id ?? null,
            frp_id: row.frp_id ?? null,
            composition_id: row.frp?.composition_id ?? null,
            category_id: row.frp?.category_id ?? null,
            grade_id: row.frp?.grade_id ?? null,
            resin_id: row.frp?.resin_id ?? null,
            form_template_id: row.form_template_id ?? null,
            price: row.price ?? null,
            status: row.status ?? null, // products has no status column today — resolves to null, harmless
            latitude: row.latitude ?? null,
            longitude: row.longitude ?? null,
        }),
    },
    requirement: {
        model: 'frp_requirements',
        metricsField: 'metrics_range', // true min/max storage
        include: { frp: true, form_templates: true },
        getSchema: (row) => row.form_templates?.metrics_schema,
        getMetricsValues: (row) => row.metrics_range,
        map: (row) => ({
            u_id: row.u_id ?? null,
            frp_id: row.frp_id ?? null,
            composition_id: row.frp?.composition_id ?? null,
            category_id: row.frp?.category_id ?? null,
            grade_id: row.frp?.grade_id ?? null,
            resin_id: row.frp?.resin_id ?? null,
            form_template_id: row.form_template_id ?? null,
            price: row.price_per_kg ?? null,
            status: row.status ?? null,
            latitude: row.latitude ?? null,
            longitude: row.longitude ?? null,
        }),
    },
    recycling: {
        model: 'recycler_processes',
        metricsField: 'capability_metrics', // exact single-value storage
        include: {
            treatments: {
                include: {
                    frp: true,
                    treatment_processes: { include: { treatment_methods: true } },
                },
            },
        },
        getSchema: (row) => row.treatments?.treatment_processes?.treatment_methods?.process_parameter_schema,
        getMetricsValues: (row) => row.capability_metrics,
        map: (row) => ({
            u_id: row.recycler_id ?? null, // recycler_id is actually a users.id (FK -> recyclers.u_id)
            frp_id: row.treatments?.frp_id ?? null,
            composition_id: row.treatments?.frp?.composition_id ?? null,
            category_id: row.treatments?.frp?.category_id ?? null,
            grade_id: row.treatments?.frp?.grade_id ?? null,
            resin_id: row.treatments?.frp?.resin_id ?? null,
            form_template_id: null, // recycling uses accepted_form_ids[] capability array, not a single template
            price: null, // no price field on recycler_processes yet
            status: null, // no status column on recycler_processes yet
            latitude: null, // recyclers has no lat/long yet — TODO once geocoding lands, see recyclers table
            longitude: null,
        }),
    },
};

function parseSchema(schema) {
    if (!schema) return [];
    return typeof schema === 'string' ? JSON.parse(schema) : schema;
}

/**
 * Normalizes filterable metric values into extra_filters.
 *
 * - Numeric fields on exact-storage entities (product/waste/recycling) are written
 *   as a single key: { length_mm: 450 }
 * - Numeric fields on range-storage entities (requirement) are written as a pair:
 *   { length_mm_min: 400, length_mm_max: 500 }
 * - Enum/exact-match fields are always written as a single key regardless of entity.
 *
 * This lets the search query builder handle both shapes with one consistent
 * field-key convention instead of having to know the source table.
 */
function extractFilterable(metricsSchema, metricsValues, storesRange) {
    const schema = parseSchema(metricsSchema);
    if (!schema.length || !metricsValues) return {};

    const out = {};
    for (const field of schema) {
        if (!field.filterable) continue;

        if (field.filterType === 'range' && storesRange) {
            const minKey = `${field.key}_min`;
            const maxKey = `${field.key}_max`;
            if (metricsValues[minKey] !== undefined) out[minKey] = metricsValues[minKey];
            if (metricsValues[maxKey] !== undefined) out[maxKey] = metricsValues[maxKey];
        } else if (metricsValues[field.key] !== undefined) {
            out[field.key] = metricsValues[field.key];
        }
    }
    return out;
}

async function syncLookupEntry(entityType, entityId) {
    const config = ENTITY_CONFIG[entityType];
    if (!config) throw new ApiError(408, `Unknown entity_type: ${entityType}`);

    const row = await prisma[config.model].findUnique({
        where: { id: entityId },
        include: config.include,
    });

    if (!row) {
        // row was deleted between trigger and sync — clean up any stale lookup entry
        await prisma.lookup_entries.deleteMany({ where: { entity_type: entityType, entity_id: entityId } });
        return null;
    }

    const storesRange = config.metricsField === 'metrics_range';
    const metricsSchema = config.getSchema(row);
    const metricsValues = config.getMetricsValues(row) || {};
    const extraFilters = extractFilterable(metricsSchema, metricsValues, storesRange);

    const data = {
        entity_type: entityType,
        entity_id: entityId,
        ...config.map(row),
        extra_filters: extraFilters,
        updatedat: new Date(),
    };

    return prisma.lookup_entries.upsert({
        where: { entity_type_entity_id: { entity_type: entityType, entity_id: entityId } },
        create: data,
        update: data,
    });
}

async function deleteLookupEntry(entityType, entityId) {
    await prisma.lookup_entries.deleteMany({
        where: { entity_type: entityType, entity_id: entityId },
    });
}

export const lookupSyncService = { syncLookupEntry, deleteLookupEntry, ENTITY_CONFIG };