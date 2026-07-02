import { prisma } from '../db/prisma.js';
import { ApiError } from '../utils/ApiError.js';

const ENTITY_CONFIG = {
    waste: {
        model: 'frp_wastes',
        metricsField: 'metrics'
    },
    product: {
        model: 'products',
        metricsField: 'metrics'
    },
    requirement: {
        model: 'frp_requirements',
        metricsField: 'metrics_range'
    }
};

function extractFilterable(metricsSchema, metricsValues) {
    if (!metricsSchema || !metricsValues) return {};
    const out = {};
    for (const field of metricsSchema) {
        if (field.filterable && metricsValues[field.key] !== undefined) {
            out[field.key] = metricsValues[field.key];
        }
    }
    return out;
}

async function syncLookupEntry(entityType, entityId) {
    const config = ENTITY_CONFIG[entityType];
    if (!config) throw new ApiError(408, `Unknown entity_type: ${entityType}`,)

    const row = await prisma[config.model].findUnique({
        where: { id: entityId },
        include: {
            frp: true,
            form_templates: true
        }
    });

    if (!row) {
        // row was deleted between trigger and sync — clean up any stale lookup entry
        await prisma.lookup_entries.deleteMany({ where: { entity_type: entityType, entity_id: entityId } });
        return null;
    }

    const metricsValues = row[config.metricsField] || {};
    const extraFilters = extractFilterable(row.form_templates?.metrics_schema, metricsValues);

    const data = {
        entity_type: entityType,
        entity_id: entityId,
        u_id: row.u_id ?? null,
        frp_id: row.frp_id ?? null,
        composition_id: row.frp?.composition_id ?? null,
        category_id: row.frp?.category_id ?? null,
        grade_id: row.frp?.grade_id ?? null,
        resin_id: row.frp?.resin_id ?? null,
        form_template_id: row.form_template_id ?? null,
        extra_filters: extraFilters,
        price: row.price_per_kg ?? row.price ?? null,
        status: row.status ?? null,
        latitude: row.latitude ?? null,
        longitude: row.longitude ?? null,
        updatedat: new Date()
    };

    return prisma.lookup_entries.upsert({
        where: { entity_type_entity_id: { entity_type: entityType, entity_id: entityId } },
        create: data,
        update: data
    });
}

async function deleteLookupEntry(entityType, entityId) {
    await prisma.lookup_entries.deleteMany({
        where: { entity_type: entityType, entity_id: entityId }
    });
}

export const lookupSyncService = { syncLookupEntry, deleteLookupEntry };