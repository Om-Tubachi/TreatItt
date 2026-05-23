import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import IconCart from '../../components/assets/icons/cart.svg';
import IconSearch from '../../components/assets/icons/search.svg';
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

  const { data: products = [] } = useAllProducts();
  const { data: wastes = [] } = useAllWaste();
  const { data: requirements = [] } = useAllRequirements();
  const recyclingServices: any[] = []; // wire up when useAllRecycleProcesses hook is created

  const listData = () => {
    switch (activeTab) {
      case 'products': return products;
      case 'requirements': return requirements;
      case 'waste': return wastes;
      case 'recycling': return recyclingServices;
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    switch (activeTab) {
      case 'products': return <ProductCard item={item} />;
      case 'requirements': return <RequirementCard item={item} />;
      case 'waste': return <WasteCard item={item} />;
      case 'recycling': return <RecyclingCard item={item} />;
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Market Place</Text>
        <TouchableOpacity><Text style={{ fontSize: 20 }}>
          <IconCart   width={22} height={22} />
          </Text></TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <Text>
           <IconSearch width={18} height={18} />
        </Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search scrap rate"
          placeholderTextColor={colors.placeholder}
          value={search}
          onChangeText={setSearch}
        />
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
        keyExtractor={i => i.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
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

  tabRow: { flexDirection: 'row', gap: 8, paddingHorizontal: layout.screenPadH, marginBottom: 16, flexWrap: 'wrap' },
  tab: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.primary },
  tabActive: { backgroundColor: colors.primary },
  tabText: { fontFamily: typography.bodyMed, fontSize: fontSize.xs, color: colors.primaryDark },
  tabTextActive: { color: colors.white },

  list: { paddingHorizontal: layout.screenPadH, paddingBottom: 100 },
});