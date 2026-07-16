// app/screens/frp/index.tsx
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import IconFilter from '../../../components/assets/icons/Filter.svg';
import { Badge } from '../../../components/atoms/Badge';
import { FilterSheet } from '../../../components/organisms/FilterSheet';
import { appBg, card, colors, fontSize, layout, spacing, typography } from '../../../constants/theme';
import { useFilters } from '../../../context/filter';
import { useSearch } from '../../../hooks/useSearch';
import { aggregateByComposition, CompositionAggregate } from '../../../utils/aggregateByComposition';

const RATIO_VARIANT: Record<CompositionAggregate['ratioLabel'], 'available' | 'urgent' | 'outlined'> = {
    Balanced: 'available',
    'High demand': 'urgent',
    Oversupplied: 'outlined',
    'No data': 'outlined',
};

export default function FrpIndexScreen() {
    const router = useRouter();
    const { filters, setEntityTypes } = useFilters();
    const [filterVisible, setFilterVisible] = useState(false);

    useEffect(() => {
        setEntityTypes(['product', 'waste', 'requirement']);
    }, []);

    const { data: searchResult, isLoading } = useSearch(filters);
    const aggregates = aggregateByComposition(searchResult?.results ?? []);

    return (
        <View style={styles.screen}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>‹</Text></TouchableOpacity>
                <Text style={styles.title}>FRP Materials</Text>
                <TouchableOpacity style={styles.filterBtn} onPress={() => setFilterVisible(true)}>
                    <IconFilter width={25} height={25} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={aggregates}
                keyExtractor={(item) => item.compositionId}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => router.push({ pathname: '/screens/frp/[id]', params: { id: item.compositionId } })}
                    >
                        <View style={styles.topRow}>
                            <Text style={styles.itemName}>{item.compositionName}</Text>
                            <Badge label={item.ratioLabel} variant={RATIO_VARIANT[item.ratioLabel]} />
                        </View>

                        <View style={styles.statsRow}>
                            <Text style={styles.statText}>{item.supplyCount} supply listing{item.supplyCount === 1 ? '' : 's'} · {item.supplyQuantity} kg</Text>
                            {item.demandCount > 0 && <Text style={styles.statText}>{item.demandCount} buyer{item.demandCount === 1 ? '' : 's'}</Text>}
                        </View>

                        {item.supplyMinPrice != null && item.supplyMaxPrice != null && (
                            <Text style={styles.price}>₹{item.supplyMinPrice}–₹{item.supplyMaxPrice}/kg</Text>
                        )}
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    !isLoading ? <Text style={styles.empty}>No FRP listings match the current filters.</Text> : null
                }
            />

            <FilterSheet
                visible={filterVisible}
                onClose={() => setFilterVisible(false)}
                showActorLayer={false}
                showDistanceSlider={true}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: appBg },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: layout.screenPadH, paddingTop: 56, paddingBottom: 16 },
    back: { fontSize: 28, color: colors.black, marginRight: 8 },
    title: { flex: 1, textAlign: 'center', fontFamily: typography.heading, fontSize: fontSize.xl, color: colors.black },
    filterBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', borderWidth: card.borderWidth, borderColor: card.border },
    list: { padding: layout.screenPadH, gap: 12 },
    card: { backgroundColor: card.bg, borderRadius: card.radius, borderWidth: card.borderWidth, borderColor: card.border, padding: card.padding, gap: 6 },
    topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    itemName: { fontFamily: typography.heading, fontSize: fontSize.sm, color: colors.black, flex: 1, marginRight: 8 },
    statsRow: { flexDirection: 'row', gap: spacing.md },
    statText: { fontFamily: typography.body, fontSize: fontSize.xs, color: colors.body },
    price: { fontFamily: typography.bodyMed, fontSize: fontSize.sm, color: colors.primaryDark },
    empty: { fontFamily: typography.body, fontSize: fontSize.sm, color: colors.body, textAlign: 'center', marginTop: 40 },
});