import { MetricFieldSchema } from '../types/formTemplates';

export interface FormattedDetail {
    label: string;
    value: string;
}

/**
 * Resolves raw dynamic process parameters against validation schema definitions
 * to output structurally formatted labels and context-appropriate units.
 */
export const formatProcessDetails = (
    processDetails: Record<string, any> | null | undefined,
    schema: MetricFieldSchema[] | null | undefined
): FormattedDetail[] => {
    if (!processDetails) return [];
    
    // Fallback if schemas haven't loaded yet or aren't assigned to the process
    if (!schema || !Array.isArray(schema)) {
        return Object.entries(processDetails).map(([key, val]) => ({
            label: key.replace(/_/g, ' ').toUpperCase(),
            value: String(val)
        }));
    }

    return schema
        .map((field) => {
            const val = processDetails[field.key];
            if (val === undefined || val === null) return null;

            const unitSuffix = field.unit ? ` ${field.unit}` : '';
            return {
                label: field.label,
                value: `${val}${unitSuffix}`
            };
        })
        .filter((item): item is FormattedDetail => item !== null);
};