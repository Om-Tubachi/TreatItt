import { useAllRecyclerProccesses } from '@/hooks/useRecyclers';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import IconFilter from '../../components/assets/icons/Filter.svg';
import IconSearch from '../../components/assets/icons/search.svg';
import { FilterSheet } from '../../components/organisms/FilterSheet';
import { ProductCard } from '../../components/organisms/ProductCard';
import { RecyclingCard } from '../../components/organisms/RecyclingCard';
import { RequirementCard } from '../../components/organisms/RequirementCard';
import { WasteCard } from '../../components/organisms/WasteCard';
import { appBg, card, colors, fontSize, layout, radius, typography } from '../../constants/theme';
import { useAllProducts } from '../../hooks/useProducts';
import { useAllRequirements } from '../../hooks/useRequirements';
import { useAllWaste } from '../../hooks/useWastes';

type Tab = 'products' | 'requirements' | 'waste' | 'recycling';

const TABS: { key: Tab; label: string }[] = [
  { key: 'products', label: 'Products' },
  { key: 'requirements', label: 'Requirements' },
  { key: 'waste', label: 'Waste' },
  { key: 'recycling', label: 'Recycling' },
];

export default function MarketplaceScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('products');
  const [search, setSearch] = useState('');
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  const { data: products = [] } = useAllProducts();
  const { data: wastes = [] } = useAllWaste();
  const { data: requirements = [] } = useAllRequirements();
  const { data: recyclingServices = [] } = useAllRecyclerProccesses();

  const listData = () => {
    switch (activeTab) {
      case 'products': return products;
      case 'requirements': return requirements;
      case 'waste': return wastes;
      case 'recycling': return recyclingServices;
    }
  };

  const goToProfile = (userId?: string) => {
    if (userId) router.push(`/screens/profile/${userId}` as any);
  };

  const renderItem = ({ item }: { item: any }) => {
    switch (activeTab) {
      case 'products':
        return (
          <ProductCard
            item={item}
            onPress={() => router.push(`/screens/product/${item.id}`)}
            onUserPress={() => goToProfile(item.users?.id)}
          />
        );
      case 'requirements':
        return (
          <RequirementCard
            item={item}
            onPress={() => router.push(`/screens/requirement/${item.id}`)}
            onUserPress={() => goToProfile(item.users?.id)}
          />
        );
      case 'waste':
        return (
          <WasteCard
            item={item}
            onPress={() => router.push(`/screens/waste/${item.id}`)}
            onUserPress={() => goToProfile(item.users?.id)}
          />
        );
      case 'recycling':
        return (
          <RecyclingCard
            item={item}
            onPress={() => router.push(`/screens/recycling/${item.id}` as any)}
            onUserPress={() => goToProfile(item.recyclers?.users?.id)}
          />
        );
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Market Place</Text>

      </View>

      <View style={styles.searchRow}>
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
        <TouchableOpacity style={styles.filterBtn} onPress={() => setFilterSheetOpen(true)}>
          <IconFilter width={25} height={25} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabRow}>
        {TABS.map(t => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tab, activeTab === t.key && styles.tabActive]}
            onPress={() => setActiveTab(t.key)}
          >
            <Text style={[styles.tabText, activeTab === t.key && styles.tabTextActive]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={listData()}
        keyExtractor={(item, index) => item.id ? String(item.id) : `market-${activeTab}-${index}`}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        extraData={activeTab}
      />

      <FilterSheet
        visible={filterSheetOpen}
        onClose={() => setFilterSheetOpen(false)}
        showActorLayer={false}
        showDistanceSlider={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: appBg },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: layout.screenPadH, paddingTop: 56, paddingBottom: 16 },
  back: { fontSize: 28, color: colors.black, marginRight: 8, lineHeight: 28 },
  title: { flex: 1, textAlign: 'center', fontFamily: typography.heading, fontSize: fontSize.xl, color: colors.black },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: layout.screenPadH, marginBottom: 16 },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: radius.xl, paddingHorizontal: 14, paddingVertical: 10, gap: 8, borderWidth: card.borderWidth, borderColor: card.border },
  searchInput: { flex: 1, fontFamily: typography.body, fontSize: fontSize.sm, color: colors.black },
  filterBtn: { width: 40, height: 40, borderRadius: radius.xl, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', borderWidth: card.borderWidth, borderColor: card.border },
  tabRow: { flexDirection: 'row', gap: 8, paddingHorizontal: layout.screenPadH, marginBottom: 16, flexWrap: 'wrap' },
  tab: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.primary },
  tabActive: { backgroundColor: colors.primary },
  tabText: { fontFamily: typography.bodyMed, fontSize: fontSize.xs, color: colors.primaryDark },
  tabTextActive: { color: colors.white },
  list: { paddingHorizontal: layout.screenPadH, paddingBottom: 100 },
});