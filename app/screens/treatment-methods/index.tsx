import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { LayoutAnimation, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, UIManager, View } from 'react-native';
import { AvatarRow } from '../../../components/molecules/AvatarRow';
import { appBg, card, colors, fontSize, layout, spacing, typography } from '../../../constants/theme';
import { useTreatmentMethodAggregates } from '../../../hooks/useTreatmentMethods';
import { useAllTreatmentProcesses } from '../../../hooks/useTreatmentProcesses';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

// §3.4 — REPLACES the contents of your existing app/screens/treatment-methods/index.tsx
// (which only rendered a bare method-name list via useAllTreatmentMethods). This is a
// strict superset of that — same list, plus real recycler/process counts, charges
// range, avg capacity (via the new /treatment-methods/aggregates endpoint), and
// expand-in-place to see which recyclers offer each method. No new route needed —
// same nesting depth, so all ../../../ import paths already match.
//
// Informational-only: no "match %" (no algorithm exists), no dedicated detail route
// (instances live under specific recyclers). Tapping a method card expands in place.
function MethodCard({ method }: { method: any }) {
    const [expanded, setExpanded] = useState(false);
    const { data: allProcesses } = useAllTreatmentProcesses({ enabled: expanded });
    const router = useRouter();

    const matchingProcesses = (allProcesses ?? []).filter((p: any) => p.method_id === method.id);

    const toggle = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded((e) => !e);
    };

    return (
        <TouchableOpacity style={styles.card} onPress={toggle} activeOpacity={0.85}>
            <Text style={styles.methodName}>{method.method}</Text>

            <View style={styles.statsRow}>
                <Text style={styles.statText}>{method.recyclerCount} recycler{method.recyclerCount === 1 ? '' : 's'}</Text>
                <Text style={styles.statText}>{method.processCount} process{method.processCount === 1 ? '' : 'es'}</Text>
            </View>

            {(method.minCharges != null || method.avgCapacityKg != null) && (
                <View style={styles.statsRow}>
                    {method.minCharges != null && method.maxCharges != null && (
                        <Text style={styles.statValue}>₹{method.minCharges}–₹{method.maxCharges}/kg</Text>
                    )}
                    {method.avgCapacityKg != null && (
                        <Text style={styles.statValue}>~{Math.round(method.avgCapacityKg)} kg avg capacity</Text>
                    )}
                </View>
            )}

            {expanded && (
                <View style={styles.expandedContent}>
                    {matchingProcesses.length ? matchingProcesses.map((p: any) => (
                        <TouchableOpacity
                            key={p.id}
                            style={styles.recyclerRow}
                            onPress={() => router.push({ pathname: '/screens/profile/[id]', params: { id: p.recycler_id } })}
                        >
                            <AvatarRow firstName={p.process ?? 'Recycler'} lastName="" />
                        </TouchableOpacity>
                    )) : (
                        <Text style={styles.empty}>No process instances recorded for this method yet.</Text>
                    )}
                </View>
            )}
        </TouchableOpacity>
    );
}

export default function TreatmentsBrowseScreen() {
    const router = useRouter();
    const { data: methods = [], isLoading } = useTreatmentMethodAggregates();

    return (
        <View style={styles.screen}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>‹</Text></TouchableOpacity>
                <Text style={styles.title}>Standardized Treatments</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
                {!isLoading && methods.length === 0 && (
                    <Text style={styles.empty}>No treatment methods available yet.</Text>
                )}
                {methods.map((m: any) => <MethodCard key={m.id} method={m} />)}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: appBg },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: layout.screenPadH, paddingTop: 56, paddingBottom: 16 },
    back: { fontSize: 28, color: colors.black, marginRight: 8 },
    title: { flex: 1, textAlign: 'center', fontFamily: typography.heading, fontSize: fontSize.xl, color: colors.black },
    list: { padding: layout.screenPadH, gap: 12, paddingBottom: 40 },
    card: { backgroundColor: card.bg, borderRadius: card.radius, borderWidth: card.borderWidth, borderColor: card.border, padding: card.padding, gap: 8 },
    methodName: { fontFamily: typography.heading, fontSize: fontSize.sm, color: colors.black },
    statsRow: { flexDirection: 'row', gap: spacing.md },
    statText: { fontFamily: typography.body, fontSize: fontSize.xs, color: colors.body },
    statValue: { fontFamily: typography.bodyMed, fontSize: fontSize.xs, color: colors.primaryDark },
    expandedContent: { marginTop: spacing.sm, borderTopWidth: 0.5, borderTopColor: card.border, paddingTop: spacing.sm, gap: spacing.sm },
    recyclerRow: { paddingVertical: 4 },
    empty: { fontFamily: typography.body, fontSize: fontSize.sm, color: colors.body, textAlign: 'center', marginTop: 20 },
});