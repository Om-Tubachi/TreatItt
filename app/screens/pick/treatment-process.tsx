import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { LayoutAnimation, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, UIManager, View } from 'react-native';
import { OwnershipTabs } from '../../../components/molecules/OwnershipTabs';
import { appBg, card, colors, fontSize, layout, radius, spacing, typography } from '../../../constants/theme';
import { usePicker } from '../../../context/picker';
import { useOwnershipTabs } from '../../../hooks/useOwnershipTabs';
import { useAllTreatmentMethods } from '../../../hooks/useTreatmentMethods';
import { useAllTreatmentProcesses } from '../../../hooks/useTreatmentProcesses';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function PickTreatmentProcessScreen() {
    const router = useRouter();
    const { setTreatmentProcessSelection } = usePicker();
    const { data: processes = [], isLoading } = useAllTreatmentProcesses();
    const { data: methods = [] } = useAllTreatmentMethods();
    const { tab, setTab, filtered: ownershipFiltered } = useOwnershipTabs(processes);
    const [methodFilter, setMethodFilter] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const list = useMemo(
        () => (methodFilter ? ownershipFiltered.filter((p: any) => p.method_id === methodFilter) : ownershipFiltered),
        [ownershipFiltered, methodFilter]
    );

    const toggleExpand = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedId((e) => (e === id ? null : id));
    };

    const handleSelect = (item: any) => {
        setTreatmentProcessSelection(item);
        router.back();
    };

    return (
        <View style={styles.screen}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>‹</Text></TouchableOpacity>
                <Text style={styles.title}>Select Treatment Process</Text>
                <View style={{ width: 24 }} />
            </View>

            <OwnershipTabs tab={tab} onChange={setTab} allLabel="All Processes" mineLabel="My Processes" />

            {methods.length > 0 && (
                <View style={styles.chipScroll}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
                        <TouchableOpacity style={[styles.chip, !methodFilter && styles.chipActive]} onPress={() => setMethodFilter(null)}>
                            <Text style={[styles.chipText, !methodFilter && styles.chipTextActive]}>All Methods</Text>
                        </TouchableOpacity>
                        {methods.map((m: any) => (
                            <TouchableOpacity
                                key={m.id}
                                style={[styles.chip, methodFilter === m.id && styles.chipActive]}
                                onPress={() => setMethodFilter(methodFilter === m.id ? null : m.id)}
                            >
                                <Text style={[styles.chipText, methodFilter === m.id && styles.chipTextActive]}>{m.method}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

            <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
                {isLoading && <Text style={styles.empty}>Loading…</Text>}
                {!isLoading && list.length === 0 && <Text style={styles.empty}>No treatment processes found.</Text>}
                {list.map((item: any) => {
                    const expanded = expandedId === item.id;
                    const owner = item.users;
                    return (
                        <TouchableOpacity key={item.id} style={styles.card} onPress={() => toggleExpand(item.id)} activeOpacity={0.8}>
                            <Text style={styles.methodName}>{item.treatment_methods?.method ?? 'Unspecified method'}</Text>
                            <Text style={styles.processText} numberOfLines={expanded ? undefined : 2}>{item.process}</Text>
                            {owner && (
                                <Text style={styles.owner}>
                                    By {owner.company_name || `${owner.first_name ?? ''} ${owner.last_name ?? ''}`.trim() || owner.username}
                                </Text>
                            )}
                            {expanded && (
                                <TouchableOpacity style={styles.selectBtn} onPress={() => handleSelect(item)}>
                                    <Text style={styles.selectBtnText}>Select this process</Text>
                                </TouchableOpacity>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: appBg },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: layout.screenPadH, paddingTop: 56, paddingBottom: 16 },
    back: { fontSize: 28, color: colors.black, marginRight: 8 },
    title: { flex: 1, textAlign: 'center', fontFamily: typography.heading, fontSize: fontSize.lg, color: colors.black },
    chipScroll: { height: 44, marginBottom: spacing.md },
    chipRow: { paddingHorizontal: 20, gap: spacing.sm, alignItems: 'center' },
    chip: { height: 40, paddingHorizontal: 14, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.primary, backgroundColor: card.bg, justifyContent: 'center', alignItems: 'center' },
    chipActive: { backgroundColor: colors.primary },
    chipText: { fontFamily: typography.bodyMed, fontSize: fontSize.xs, color: colors.primaryDark },
    chipTextActive: { color: colors.white },
    list: { paddingHorizontal: layout.screenPadH, paddingBottom: 60, gap: 12 },
    empty: { fontFamily: typography.body, fontSize: fontSize.sm, color: colors.body, textAlign: 'center', marginTop: 40 },
    card: { backgroundColor: card.bg, borderRadius: card.radius, borderWidth: card.borderWidth, borderColor: card.border, padding: card.padding, gap: 4 },
    methodName: { fontFamily: typography.heading, fontSize: fontSize.sm, color: colors.black },
    processText: { fontFamily: typography.body, fontSize: fontSize.xs, color: colors.body },
    owner: { fontFamily: typography.body, fontSize: 10, color: colors.placeholder, marginTop: 2 },
    selectBtn: { backgroundColor: colors.primaryDark, borderRadius: radius.md, paddingVertical: 10, alignItems: 'center', marginTop: 10 },
    selectBtnText: { fontFamily: typography.bodyMed, fontSize: fontSize.xs, color: colors.white },
});