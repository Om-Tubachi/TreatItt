import { MetricFieldSchema, MetricsMode, MetricsRangeValue, MetricsValue } from '../types/formTemplates';

/**
 * Strips any keys not in the schema and coerces number-type fields to actual numbers.
 * Use right before submit — never let stale/mismatched keys reach the backend.
 */
export function buildMetricsPayload(
    schema: MetricFieldSchema[],
    values: MetricsValue | MetricsRangeValue,
    mode: MetricsMode
): MetricsValue | MetricsRangeValue {
    const out: any = {};

    for (const field of schema) {
        const raw = (values as any)[field.key];
        if (raw === undefined || raw === null || raw === '') continue;

        if (mode === 'range') {
            const r = raw as { min?: any; max?: any };
            if (r.min === undefined || r.min === '' || r.max === undefined || r.max === '') continue;
            out[field.key] = {
                min: field.type === 'number' ? Number(r.min) : r.min,
                max: field.type === 'number' ? Number(r.max) : r.max,
            };
            continue;
        }

        out[field.key] = field.type === 'number' ? Number(raw) : raw;
    }

    return out;
}

/**
 * Reverse direction — turns a stored metrics/metrics_range object (from an existing
 * entity) back into the string-friendly shape DynamicMetricsFields expects for editing.
 */
export function hydrateMetrics(
    schema: MetricFieldSchema[],
    stored: MetricsValue | MetricsRangeValue | undefined,
    mode: MetricsMode
): MetricsValue | MetricsRangeValue {
    const out: any = {};
    if (!stored) return out;

    for (const field of schema) {
        const raw = (stored as any)[field.key];
        if (raw === undefined || raw === null) continue;

        if (mode === 'range') {
            const r = raw as { min?: any; max?: any };
            out[field.key] = { min: r?.min, max: r?.max };
        } else {
            out[field.key] = raw;
        }
    }

    return out;
}
