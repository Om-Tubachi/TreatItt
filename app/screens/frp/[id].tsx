import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Badge } from '../../../components/atoms/Badge';
import { Pill } from '../../../components/atoms/Pill';
import { DetailSheet } from '../../../components/layout/DetailSheet';
import { SectionHeader } from '../../../components/molecules/SectionHeader';
import { StatBox } from '../../../components/molecules/StatBox';
import { appBg, card, colors, fontSize, layout, spacing, typography } from '../../../constants/theme';
import { EntityType, useFilters } from '../../../context/filter';
import { useFrp } from '../../../hooks/useFrp';
import { useSearch } from '../../../hooks/useSearch';
import { aggregateByComposition } from '../../../utils/aggregateByComposition';

export default function FrpDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { data: lookups } = useFrp();
    const { filters } = useFilters();

    // Existing composition/dependent-formulations section — built last session, unchanged.
    const composition = lookups?.compositions[id];
    const dependentFrp = lookups?.rawEntries.filter(e => e.composition_id === id) ?? [];
    const description = dependentFrp[0]?.composition?.composition_description;

    // §3.2 — stats section: scope a search to this composition specifically rather
    // than reusing the (possibly differently-filtered) index-page result set.
    const scopedFilters = useMemo(() => ({
        ...filters,
        entityTypes: ['product', 'waste', 'requirement'] as EntityType[],
        compositionId: [id],
    }), [filters, id]);
    const { data: scopedSearch } = useSearch(scopedFilters, { enabled: !!id });
    const compositionStats = aggregateByComposition(scopedSearch?.results ?? []).find(a => a.compositionId === id);

    // §3.2 — available treatment methods, derived from frp.treatments included via
    // the frp.service.js getFrp() extension (no new endpoint needed).
    const treatmentMethods = useMemo(() => {
        const methods = new Set<string>();
        dependentFrp.forEach((entry: any) => {
            (entry.treatments ?? []).forEach((t: any) => {
                const method = t.treatment_processes?.treatment_methods?.method;
                if (method) methods.add(method);
            });
        });
        return Array.from(methods);
    }, [dependentFrp]);

    if (!composition) return <View style={styles.screen} />;

    const statBoxes: { label: string; value: string }[] = [];
    if (compositionStats?.supplyQuantity) statBoxes.push({ label: 'SUPPLY QTY', value: `${compositionStats.supplyQuantity} kg` });
    if (compositionStats?.supplyCount) statBoxes.push({ label: 'LISTINGS', value: String(compositionStats.supplyCount) });
    if (compositionStats?.demandCount) statBoxes.push({ label: 'BUYERS', value: String(compositionStats.demandCount) });

    return (
        <View style={styles.screen}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>‹</Text></TouchableOpacity>
                <Text style={styles.title}>FRP Detail</Text>
                <View style={{ width: 24 }} />
            </View>
            <DetailSheet>
                <Text style={styles.eyebrow}>REINFORCEMENT COMPOSITION</Text>
                <Text style={styles.compositionName}>{composition.label}</Text>

                {description && <Text style={styles.description}>{description}</Text>}

                {dependentFrp.length > 0 && (
                    <View style={styles.activePill}>
                        <Text style={styles.activePillText}>
                            Active in {dependentFrp.length} unique formulation{dependentFrp.length === 1 ? '' : 's'}
                        </Text>
                    </View>
                )}

                {statBoxes.length > 0 && (
                    <View>
                        <SectionHeader title="Supply & Demand" />
                        <View style={styles.statsRow}>
                            {statBoxes.map((b, i) => (
                                <React.Fragment key={b.label}>
                                    {i > 0 && <View style={{ width: 8 }} />}
                                    <StatBox label={b.label} value={b.value} />
                                </React.Fragment>
                            ))}
                        </View>
                        {compositionStats && Object.keys(compositionStats.urgencyBreakdown).length > 0 && (
                            <View style={styles.chipRow}>
                                {Object.entries(compositionStats.urgencyBreakdown).map(([urgency, count]) => (
                                    <Badge key={urgency} label={`${urgency} · ${count}`} variant={urgency.toLowerCase() === 'urgent' ? 'urgent' : 'outlined'} />
                                ))}
                            </View>
                        )}
                    </View>
                )}

                {treatmentMethods.length > 0 && (
                    <View>
                        <SectionHeader title="Available Treatment Methods" />
                        <View style={styles.chipRow}>
                            {treatmentMethods.map((m) => <Pill key={m} label={m} />)}
                        </View>
                    </View>
                )}

                <SectionHeader title="Dependent Material Formulations" />
                <View style={{ gap: 10 }}>
                    {dependentFrp.map((entry: any) => (
                        <View key={entry.id} style={styles.formRow}>
                            <Text style={styles.formTitle}>
                                {entry.category?.category_name ?? 'Unclassified'}
                            </Text>
                            <View style={styles.formPills}>
                                {entry.grade?.grade_name && <Pill label={entry.grade.grade_name} />}
                                {entry.resin?.resin_name && <Pill label={entry.resin.resin_name} />}
                            </View>
                        </View>
                    ))}
                    {dependentFrp.length === 0 && (
                        <Text style={styles.empty}>No formulations recorded for this composition yet.</Text>
                    )}
                </View>
            </DetailSheet>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: appBg },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: layout.screenPadH, paddingTop: 56, paddingBottom: 16 },
    back: { fontSize: 28, color: colors.black, marginRight: 8 },
    title: { flex: 1, textAlign: 'center', fontFamily: typography.heading, fontSize: fontSize.xl, color: colors.black },
    eyebrow: { fontFamily: typography.body, fontSize: fontSize.xs, color: colors.primaryDark, letterSpacing: 1, marginTop: 4 },
    compositionName: { fontFamily: typography.heading, fontSize: fontSize.xl, color: colors.black, marginTop: 2 },
    description: { fontFamily: typography.body, fontSize: fontSize.sm, color: colors.body, marginTop: 6, lineHeight: 20 },
    activePill: { backgroundColor: card.greenBg, borderRadius: card.greenRadius, paddingHorizontal: 12, paddingVertical: 6, alignSelf: 'flex-start', marginTop: 10 },
    activePillText: { fontFamily: typography.bodyMed, fontSize: fontSize.xs, color: colors.brandDeep },
    statsRow: { flexDirection: 'row', marginBottom: spacing.sm },
    chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
    formRow: { backgroundColor: card.bg, borderRadius: card.radius, borderWidth: card.borderWidth, borderColor: card.border, padding: card.padding, gap: 6 },
    formTitle: { fontFamily: typography.bodyMed, fontSize: fontSize.sm, color: colors.black },
    formPills: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    empty: { fontFamily: typography.body, fontSize: fontSize.xs, color: colors.body },
});
