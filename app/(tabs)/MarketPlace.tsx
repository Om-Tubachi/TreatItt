import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import IconCart from '../../components/assets/icons/cart.svg';
import IconSearch from '../../components/assets/icons/search.svg';
import { FilterSheet } from '../../components/organisms/FilterSheet';
import { ProductCard } from '../../components/organisms/ProductCard';
import { RecyclingCard } from '../../components/organisms/RecyclingCard';
import { RequirementCard } from '../../components/organisms/RequirementCard';
import { WasteCard } from '../../components/organisms/WasteCard';
import { appBg, card, colors, fontSize, layout, radius, typography } from '../../constants/theme';
import { EntityType, useFilters } from '../../context/filter';
import { useSearch } from '../../hooks/useSearch';

type Tab = 'products' | 'requirements' | 'waste' | 'recycling';

const TABS: { key: Tab; label: string }[] = [
  { key: 'products', label: 'Products' },
  { key: 'requirements', label: 'Requirements' },
  { key: 'waste', label: 'Waste' },
  { key: 'recycling', label: 'Recycling' },
];

const TAB_TO_ENTITY: Record<Tab, EntityType> = {
  products: 'product',
  requirements: 'requirement',
  waste: 'waste',
  recycling: 'recycling',
};

export default function MarketplaceScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('products');
  const [search, setSearch] = useState('');
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  const { filters, setEntityTypes, activeFilterCount } = useFilters();

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setEntityTypes([TAB_TO_ENTITY[tab]]);
  };

  const { data, isLoading } = useSearch(filters);

  // free-text search stays client-side over the current page's results for now —
  // lookup_entries has no text index yet, so this isn't part of the server filter
  const listData = (data?.results ?? []).filter((item: any) => {
    if (!search.trim()) return true;
    const haystack = JSON.stringify(item).toLowerCase();
    return haystack.includes(search.trim().toLowerCase());
  });

  const renderItem = ({ item }: { item: any }) => {
    switch (activeTab) {
      case 'products':
        return <ProductCard item={item} onPress={() => router.push(`/screens/product/${item.id}`)} />;
      case 'requirements':
        return <RequirementCard item={item} onPress={() => router.push(`/screens/requirement/${item.id}`)} />;
      case 'waste':
        return <WasteCard item={item} onPress={() => router.push(`/screens/waste/${item.id}`)} />;
      case 'recycling':
        return <RecyclingCard item={item} />;
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Market Place</Text>
        <TouchableOpacity>
          <IconCart width={22} height={22} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <IconSearch width={18} height={18} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search scrap rate"
          placeholderTextColor={colors.placeholder}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={styles.tabRow}>
        {TABS.map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tab, activeTab === t.key && styles.tabActive]}
            onPress={() => handleTabChange(t.key)}
          >
            <Text style={[styles.tabText, activeTab === t.key && styles.tabTextActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}

        {/* floating filter trigger — same row as tabs, opens the app-wide FilterSheet */}
        <TouchableOpacity style={styles.filterTrigger} onPress={() => setFilterSheetOpen(true)}>
          <Text style={styles.filterTriggerText}>
            Filter{activeFilterCount ? ` (${activeFilterCount})` : ''}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={listData}
        keyExtractor={(item, index) => (item.id ? String(item.id) : `market-${activeTab}-${index}`)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        extraData={activeTab}
        ListEmptyComponent={!isLoading ? <Text style={styles.empty}>No results match your filters</Text> : null}
      />

      <FilterSheet visible={filterSheetOpen} onClose={() => setFilterSheetOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: appBg },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: layout.screenPadH, paddingTop: 56, paddingBottom: 16 },
  back: { fontSize: 28, color: colors.black, marginRight: 8, lineHeight: 28 },
  title: { flex: 1, textAlign: 'center', fontFamily: typography.heading, fontSize: fontSize.xl, color: colors.black },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: radius.xl, marginHorizontal: layout.screenPadH, paddingHorizontal: 14, paddingVertical: 10, gap: 8, borderWidth: card.borderWidth, borderColor: card.border, marginBottom: 16 },
  searchInput: { flex: 1, fontFamily: typography.body, fontSize: fontSize.sm, color: colors.black },
  tabRow: { flexDirection: 'row', gap: 8, paddingHorizontal: layout.screenPadH, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' },
  tab: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.primary },
  tabActive: { backgroundColor: colors.primary },
  tabText: { fontFamily: typography.bodyMed, fontSize: fontSize.xs, color: colors.primaryDark },
  tabTextActive: { color: colors.white },
  filterTrigger: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.xl, backgroundColor: colors.primaryDark, marginLeft: 'auto' },
  filterTriggerText: { fontFamily: typography.bodyMed, fontSize: fontSize.xs, color: colors.white },
  list: { paddingHorizontal: layout.screenPadH, paddingBottom: 100 },
  empty: { textAlign: 'center', marginTop: 40, fontFamily: typography.body, fontSize: fontSize.sm, color: colors.body },
});