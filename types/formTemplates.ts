export type MetricFieldType = 'number' | 'enum' | 'text';

export interface MetricFieldSchema {
    key: string;
    label: string;
    unit: string | null;
    type: MetricFieldType;
    required: boolean;
    filterable: boolean;
    filter_type: 'range' | 'exact' | null;
    options?: string[]; // present when type === 'enum'
}

export interface FormTemplate {
    id: string;
    form_name: string;
    applies_to: string[];
    metrics_schema: MetricFieldSchema[]; // parsed, never the raw string
    createdat?: string;
    updatedat?: string;
}

export type MetricsValue = Record<string, number | string>;
export type MetricsRangeValue = Record<string, { min?: number; max?: number }>;

export type MetricsMode = 'exact' | 'range';
