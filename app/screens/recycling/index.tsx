import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FilterSheet } from '../../../components/organisms/FilterSheet';
import { RecyclingCard } from '../../../components/organisms/RecyclingCard';
import { appBg, colors, fontSize, layout, typography } from '../../../constants/theme';
import { useFilters } from '../../../context/filter';
import { useAllRecyclerProcesses } from '../../../hooks/useRecyclerProcesses';
import { useSearch } from '../../../hooks/useSearch';

export default function RecyclingIndexScreen() {
    const router = useRouter();
    const { filters, setEntityTypes, activeFilterCount } = useFilters();
    const [filterVisible, setFilterVisible] = useState(false);

    // §3.3 — recycling IS a valid search entityType (search.service.js HYDRATE_MODEL
    // includes it), so lock the filter sheet's entity scope to 'recycling' on mount.
    // setEntityTypes (not setActorTypes) — this is a card listing, not the map ribbon.
    useEffect(() => {
        setEntityTypes(['recycling']);
    }, []);

    const hasActiveFilters = activeFilterCount > 0;
    const { data: searchResult, isLoading: searchLoading } = useSearch(filters, { enabled: hasActiveFilters });
    const { data: allProcesses, isLoading: allLoading, isError } = useAllRecyclerProcesses({ enabled: !hasActiveFilters });

    const processes = hasActiveFilters ? (searchResult?.results ?? []) : (allProcesses ?? []);
    const isLoading = hasActiveFilters ? searchLoading : allLoading;

    return (
        <View style={styles.screen}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.back}>‹</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Recycling Services</Text>
                <TouchableOpacity onPress={() => setFilterVisible(true)}>
                    <Text style={styles.filterIcon}>⚙︎</Text>
                </TouchableOpacity>
            </View>

            {isLoading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : isError && !hasActiveFilters ? (
                <View style={styles.centerContainer}>
                    <Text style={styles.errorText}>Failed to load recycling services.</Text>
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                    {processes.length > 0 ? (
                        processes.map((process: any) => (
                            <RecyclingCard
                                key={process.id}
                                item={process}
                                onPress={() => router.push({ pathname: '/screens/recycling/[id]', params: { id: process.id } })}
                            />
                        ))
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No recycling services match the current filters.</Text>
                        </View>
                    )}
                </ScrollView>
            )}

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
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: layout.screenPadH, paddingTop: 56, paddingBottom: 16 },
    backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
    back: { fontSize: 32, color: colors.black, fontWeight: '300' },
    title: { flex: 1, textAlign: 'center', fontFamily: typography.heading, fontSize: fontSize.xl, color: colors.black },
    filterIcon: { fontSize: 20, color: colors.primaryDark, width: 40, textAlign: 'right' },
    scrollContainer: { paddingHorizontal: layout.screenPadH, paddingBottom: 40, gap: 12 },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: layout.screenPadH },
    errorText: { fontFamily: typography.bodyMed, fontSize: fontSize.sm, color: '#D9383A', textAlign: 'center' },
    emptyContainer: { paddingTop: 60, alignItems: 'center' },
    emptyText: { fontFamily: typography.body, fontSize: fontSize.sm, color: colors.body, textAlign: 'center' },
});
