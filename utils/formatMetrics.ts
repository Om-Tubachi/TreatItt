import { MetricFieldSchema } from '../types/formTemplates';

export interface FormattedDetail {
    label: string;
    value: string;
}

export const formatExactMetrics = (
    metrics: Record<string, any> | null | undefined,
    schema: MetricFieldSchema[] | null | undefined
): FormattedDetail[] => {
    if (!metrics || !Object.keys(metrics).length) return [];

    if (!schema || !Array.isArray(schema)) {
        return Object.entries(metrics).map(([key, val]) => ({
            label: key.replace(/_/g, ' ').toUpperCase(),
            value: String(val)
        }));
    }

    return schema
        .map((field) => {
            const val = metrics[field.key];
            if (val === undefined || val === null || val === '') return null;
            const unitSuffix = field.unit ? ` ${field.unit}` : '';
            return { label: field.label, value: `${val}${unitSuffix}` };
        })
        .filter((item): item is FormattedDetail => item !== null);
};

export const formatRangeMetrics = (
    metricsRange: Record<string, { min?: number; max?: number }> | null | undefined,
    schema: MetricFieldSchema[] | null | undefined
): FormattedDetail[] => {
    if (!metricsRange || !Object.keys(metricsRange).length) return [];

    if (!schema || !Array.isArray(schema)) {
        return Object.entries(metricsRange).map(([key, range]) => ({
            label: key.replace(/_/g, ' ').toUpperCase(),
            value: `${range?.min ?? '—'}–${range?.max ?? '—'}`
        }));
    }

    return schema
        .map((field) => {
            const range = metricsRange[field.key];
            if (!range || (range.min == null && range.max == null)) return null;
            const unitSuffix = field.unit ? ` ${field.unit}` : '';
            return { label: field.label, value: `${range.min ?? '—'}–${range.max ?? '—'}${unitSuffix}` };
        })
        .filter((item): item is FormattedDetail => item !== null);
};