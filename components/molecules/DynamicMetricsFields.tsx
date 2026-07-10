import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MetricFieldSchema, MetricsMode, MetricsRangeValue, MetricsValue } from '../../types/formTemplates';
import { MetricsErrors } from '../../utils/metricsValidation';
import { FormField } from './FormField';
import { SectionHeader } from './SectionHeader';
import { SelectField } from './SelectField';

interface Props {
    schema: MetricFieldSchema[];
    mode: MetricsMode;
    values: MetricsValue | MetricsRangeValue;
    errors?: MetricsErrors;
    onChange: (key: string, value: any) => void;
}

export const DynamicMetricsFields: React.FC<Props> = ({ schema, mode, values, errors = {}, onChange }) => {
    if (!schema.length) return null;

    return (
        <View style={styles.container}>
            <SectionHeader title="Specifications" />
            {schema.map(field => {
                const unitSuffix = field.unit ? ` (${field.unit})` : '';

                if (field.type === 'enum') {
                    const opts = (field.options ?? []).map(o => ({ id: o, label: o }));
                    const current = values[field.key] as string | undefined;
                    const selected = current ? { id: current, label: current } : undefined;
                    return (
                        <SelectField
                            key={field.key}
                            label={field.label}
                            options={opts}
                            selected={selected}
                            onSelect={(o) => onChange(field.key, o.id)}
                        />
                    );
                }

                if (mode === 'range' && field.type === 'number') {
                    const rangeVal = (values as MetricsRangeValue)[field.key] ?? {};
                    return (
                        <View key={field.key} style={styles.rangeRow}>
                            <View style={styles.rangeInput}>
                                <FormField
                                    label={`${field.label} min${unitSuffix}`}
                                    placeholder="min"
                                    keyboardType="numeric"
                                    value={rangeVal.min !== undefined ? String(rangeVal.min) : ''}
                                    onChangeText={(t) => onChange(field.key, { ...rangeVal, min: t })}
                                    error={errors[field.key]}
                                />
                            </View>
                            <View style={styles.rangeInput}>
                                <FormField
                                    label={`${field.label} max${unitSuffix}`}
                                    placeholder="max"
                                    keyboardType="numeric"
                                    value={rangeVal.max !== undefined ? String(rangeVal.max) : ''}
                                    onChangeText={(t) => onChange(field.key, { ...rangeVal, max: t })}
                                />
                            </View>
                        </View>
                    );
                }

                // exact mode, number or text
                const current = (values as MetricsValue)[field.key];
                return (
                    <FormField
                        key={field.key}
                        label={`${field.label}${unitSuffix}`}
                        placeholder={field.type === 'number' ? 'e.g. 100' : 'Enter value'}
                        keyboardType={field.type === 'number' ? 'numeric' : 'default'}
                        value={current !== undefined ? String(current) : ''}
                        onChangeText={(t) => onChange(field.key, t)}
                        error={errors[field.key]}
                    />
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { gap: 16 },
    rangeRow: { flexDirection: 'row', gap: 12 },
    rangeInput: { flex: 1 },
});
