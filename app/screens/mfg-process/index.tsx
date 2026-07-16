import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Badge } from '../../../components/atoms/Badge';
import { FilterSheet } from '../../../components/organisms/FilterSheet';
import { appBg, card, colors, fontSize, layout, spacing, typography } from '../../../constants/theme';
import { useFilters } from '../../../context/filter';
import {
    useFilteredManufacturingProcesses,
    useManufacturingProcessStats,
    useSystemDefaultProcesses,
} from '../../../hooks/useManufacturingProcesses';

// One card per process. Stats are fetched per-card via useManufacturingProcessStats —
// React Query dedupes/caches these, and this is a small dataset so N calls is fine.
// Any stat that comes back null is simply omitted rather than shown as "0" (§3.1).
function ProcessCard({ item, onPress }: { item: any; onPress: () => void }) {
    const { data: stats } = useManufacturingProcessStats(item.id);

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
            <Text style={styles.itemName}>{item.manufacturing_process_name}</Text>
            {item.manufacturing_process_desc ? (
                <Text style={styles.itemDesc} numberOfLines={2}>{item.manufacturing_process_desc}</Text>
            ) : null}

            {stats && (stats.totalQuantity > 0 || stats.listingCount > 0 || stats.minPrice != null) ? (
                <View style={styles.statsRow}>
                    {stats.totalQuantity > 0 && <Badge label={`${stats.totalQuantity} kg total`} variant="outlined" />}
                    {stats.listingCount > 0 && <Badge label={`${stats.listingCount} listings`} variant="outlined" />}
                    {stats.minPrice != null && stats.maxPrice != null && (
                        <Badge label={`₹${stats.minPrice}–₹${stats.maxPrice}/kg`} variant="available" />
                    )}
                </View>
            ) : null}
        </TouchableOpacity>
    );
}

export default function MfgProcessIndexScreen() {
    const router = useRouter();
    const { filters } = useFilters();
    const [filterVisible, setFilterVisible] = useState(false);

    // §3.1 — read layer-2 filters directly off global filter state and pass as
    // query params to the dedicated /manufacturing-processes/search endpoint,
    // rather than going through useSearch (§0 decision 1: not a lookup_entries type).
    const hasActiveLayer2 =
        filters.compositionId.length > 0 ||
        filters.categoryId.length > 0 ||
        filters.gradeId.length > 0 ||
        filters.resinId.length > 0;

    const searchParams = useMemo(() => {
        const p: Record<string, string> = {};
        const composition = filters.compositionId[0];
        const category = filters.categoryId[0];
        const grade = filters.gradeId[0];
        const resin = filters.resinId[0];
        if (composition) p.compositionId = composition;
        if (category) p.categoryId = category;
        if (grade) p.gradeId = grade;
        if (resin) p.resinId = resin;
        return p;
    }, [filters.compositionId, filters.categoryId, filters.gradeId, filters.resinId]);

    const { data: filteredProcesses } = useFilteredManufacturingProcesses(searchParams, { enabled: hasActiveLayer2 });
    const { data: defaultProcesses = [] } = useSystemDefaultProcesses({ enabled: !hasActiveLayer2 });

    const processes = hasActiveLayer2 ? (filteredProcesses ?? []) : defaultProcesses;

    return (
        <View style={styles.screen}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>‹</Text></TouchableOpacity>
                <Text style={styles.title}>Manufacturing Processes</Text>
                <TouchableOpacity onPress={() => setFilterVisible(true)}>
                    <Text style={styles.filterIcon}>⚙︎</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={processes}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <ProcessCard
                        item={item}
                        onPress={() => router.push(`/screens/mfg-process/${item.id}` as any)}
                    />
                )}
                ListEmptyComponent={<Text style={styles.empty}>No manufacturing processes match the current filters.</Text>}
            />

            <FilterSheet
                visible={filterVisible}
                onClose={() => setFilterVisible(false)}
                showActorLayer={false}
                showDistanceSlider={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: appBg },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: layout.screenPadH, paddingTop: 56, paddingBottom: 16 },
    back: { fontSize: 28, color: colors.black, marginRight: 8 },
    title: { flex: 1, textAlign: 'center', fontFamily: typography.heading, fontSize: fontSize.xl, color: colors.black },
    filterIcon: { fontSize: 20, color: colors.primaryDark },
    list: { padding: layout.screenPadH, gap: 12 },
    card: { backgroundColor: card.bg, borderRadius: card.radius, borderWidth: card.borderWidth, borderColor: card.border, padding: card.padding, gap: 8 },
    itemName: { fontFamily: typography.heading, fontSize: fontSize.sm, color: colors.black },
    itemDesc: { fontFamily: typography.body, fontSize: fontSize.xs, color: colors.body },
    statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: 2 },
    empty: { fontFamily: typography.body, fontSize: fontSize.sm, color: colors.body, textAlign: 'center', marginTop: 40 },
});
