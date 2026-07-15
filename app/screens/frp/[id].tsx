// app/screens/frp/[id].tsx
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Pill } from '../../../components/atoms/Pill';
import { DetailSheet } from '../../../components/layout/DetailSheet';
import { SectionHeader } from '../../../components/molecules/SectionHeader';
import { appBg, card, colors, fontSize, layout, typography } from '../../../constants/theme';
import { useFrp } from '../../../hooks/useFrp';

export default function FrpDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { data: lookups } = useFrp();

    const composition = lookups?.compositions[id];
    // dependent frp rows sharing this composition — real data, not derived counts elsewhere
    const dependentFrp = lookups?.rawEntries.filter(e => e.composition_id === id) ?? [];
    // description lives on the nested composition object inside a raw entry, not in the lookup dict
    const description = dependentFrp[0]?.composition?.composition_description;

    if (!composition) return <View style={styles.screen} />;

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

                <SectionHeader title="Dependent Material Formulations" />
                <View style={{ gap: 10 }}>
                    {dependentFrp.map((entry) => (
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
    formRow: { backgroundColor: card.bg, borderRadius: card.radius, borderWidth: card.borderWidth, borderColor: card.border, padding: card.padding, gap: 6 },
    formTitle: { fontFamily: typography.bodyMed, fontSize: fontSize.sm, color: colors.black },
    formPills: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    empty: { fontFamily: typography.body, fontSize: fontSize.xs, color: colors.body },
});