import { MetricFieldSchema, MetricsMode, MetricsRangeValue, MetricsValue } from '../types/formTemplates';

export type MetricsErrors = Record<string, string>;

/**
 * Validates a metrics object (exact mode) or metrics_range object (range mode)
 * against a template's metrics_schema. All schema fields are treated as required
 * to submit, regardless of the schema's own `required` flag (per product decision).
 * Returns an empty object when valid.
 */
export function validateMetrics(
    schema: MetricFieldSchema[],
    values: MetricsValue | MetricsRangeValue | undefined,
    mode: MetricsMode
): MetricsErrors {
    const errors: MetricsErrors = {};
    const v: any = values ?? {};

    for (const field of schema) {
        const raw = v[field.key];

        if (mode === 'range') {
            const rangeVal = raw as { min?: number; max?: number } | undefined;
            const min = rangeVal?.min;
            const max = rangeVal?.max;

            if (min === undefined || min === null || min === '' ||
                max === undefined || max === null || max === '') {
                errors[field.key] = `${field.label} (min & max) is required`;
                continue;
            }
            if (field.type === 'number') {
                const minNum = Number(min);
                const maxNum = Number(max);
                if (Number.isNaN(minNum) || Number.isNaN(maxNum)) {
                    errors[field.key] = `${field.label} must be a valid number`;
                    continue;
                }
                if (minNum > maxNum) {
                    errors[field.key] = `${field.label}: min cannot exceed max`;
                    continue;
                }
            }
            continue;
        }

        // exact mode
        if (raw === undefined || raw === null || raw === '') {
            errors[field.key] = `${field.label} is required`;
            continue;
        }

        if (field.type === 'number') {
            const num = Number(raw);
            if (Number.isNaN(num)) {
                errors[field.key] = `${field.label} must be a valid number`;
            }
        } else if (field.type === 'enum') {
            if (!field.options?.includes(String(raw))) {
                errors[field.key] = `${field.label} must be one of the listed options`;
            }
        }
        // type === 'text' — presence check above is enough
    }

    return errors;
}

export const hasErrors = (errors: MetricsErrors) => Object.keys(errors).length > 0;
