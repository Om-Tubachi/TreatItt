import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { LayoutAnimation, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, UIManager, View } from 'react-native';
import { OwnershipTabs } from '../../../components/molecules/OwnershipTabs';
import { appBg, card, colors, fontSize, layout, radius, spacing, typography } from '../../../constants/theme';
import { usePicker } from '../../../context/picker';
import { useFrp } from '../../../hooks/useFrp';
import { useOwnershipTabs } from '../../../hooks/useOwnershipTabs';
import { useAllTreatments } from '../../../hooks/useTreatments';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function PickTreatmentScreen() {
    const router = useRouter();
    const { setTreatmentSelection } = usePicker();
    const { data: treatments = [], isLoading } = useAllTreatments();
    const { data: frpLookups } = useFrp();
    const { tab, setTab, filtered: ownershipFiltered } = useOwnershipTabs(treatments);
    const [compositionFilter, setCompositionFilter] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const compositionOptions = frpLookups ? Object.values(frpLookups.compositions) : [];

    const list = useMemo(() => {
        if (!compositionFilter) return ownershipFiltered;
        const compName = compositionOptions.find((c: any) => c.id === compositionFilter)?.label;
        return ownershipFiltered.filter((t: any) => t.frp?.composition?.composition_name === compName);
    }, [ownershipFiltered, compositionFilter, compositionOptions]);

    const toggleExpand = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedId((e) => (e === id ? null : id));
    };

    const handleSelect = (item: any) => {
        setTreatmentSelection(item);
        router.back();
    };

    return (
        <View style={styles.screen}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>‹</Text></TouchableOpacity>
                <Text style={styles.title}>Select Treatment</Text>
                <View style={{ width: 24 }} />
            </View>

            <OwnershipTabs tab={tab} onChange={setTab} allLabel="All Treatments" mineLabel="My Treatments" />

            {compositionOptions.length > 0 && (
                <View style={styles.chipScroll}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
                        <TouchableOpacity style={[styles.chip, !compositionFilter && styles.chipActive]} onPress={() => setCompositionFilter(null)}>
                            <Text style={[styles.chipText, !compositionFilter && styles.chipTextActive]}>All Compositions</Text>
                        </TouchableOpacity>
                        {compositionOptions.map((c: any) => (
                            <TouchableOpacity
                                key={c.id}
                                style={[styles.chip, compositionFilter === c.id && styles.chipActive]}
                                onPress={() => setCompositionFilter(compositionFilter === c.id ? null : c.id)}
                            >
                                <Text style={[styles.chipText, compositionFilter === c.id && styles.chipTextActive]}>{c.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

            <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
                {isLoading && <Text style={styles.empty}>Loading…</Text>}
                {!isLoading && list.length === 0 && <Text style={styles.empty}>No treatments found.</Text>}
                {list.map((item: any) => {
                    const expanded = expandedId === item.id;
                    const owner = item.users;
                    const title = [item.frp?.composition?.composition_name, item.frp?.category?.category_name].filter(Boolean).join(' · ') || 'FRP Batch';
                    return (
                        <TouchableOpacity key={item.id} style={styles.card} onPress={() => toggleExpand(item.id)} activeOpacity={0.8}>
                            <Text style={styles.title2}>{title}</Text>
                            <Text style={styles.methodName}>{item.treatment_processes?.treatment_methods?.method ?? 'Unspecified method'}</Text>
                            {expanded && item.treatment_processes?.process && (
                                <Text style={styles.processText}>{item.treatment_processes.process}</Text>
                            )}
                            {expanded && item.frp?.description && (
                                <Text style={styles.processText}>{item.frp.description}</Text>
                            )}
                            {owner && (
                                <Text style={styles.owner}>
                                    By {owner.company_name || `${owner.first_name ?? ''} ${owner.last_name ?? ''}`.trim() || owner.username}
                                </Text>
                            )}
                            {expanded && (
                                <TouchableOpacity style={styles.selectBtn} onPress={() => handleSelect(item)}>
                                    <Text style={styles.selectBtnText}>Select this treatment</Text>
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
    title2: { fontFamily: typography.heading, fontSize: fontSize.sm, color: colors.black },
    methodName: { fontFamily: typography.bodyMed, fontSize: fontSize.xs, color: colors.primaryDark },
    processText: { fontFamily: typography.body, fontSize: fontSize.xs, color: colors.body },
    owner: { fontFamily: typography.body, fontSize: 10, color: colors.placeholder, marginTop: 2 },
    selectBtn: { backgroundColor: colors.primaryDark, borderRadius: radius.md, paddingVertical: 10, alignItems: 'center', marginTop: 10 },
    selectBtnText: { fontFamily: typography.bodyMed, fontSize: fontSize.xs, color: colors.white },
});