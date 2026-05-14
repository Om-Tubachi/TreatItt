import RequirementCard from '@/components/cards/RequirementCard';
import WasteCard from '@/components/cards/WasteCard';
import { SidebarNav } from '@/components/ui/SidebarNav';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ProductCard from '../../components/cards/ProductCard';
import { colors, radius, shadows, spacing, typography } from '../../constants/theme';
import { useAllProducts } from '../../hooks/useProducts';
import { useAllRecyclers } from '../../hooks/useRecyclers';
import { useAllRequirements } from '../../hooks/useRequirements';
import { useAllTreatments } from '../../hooks/useTreatments';
import { useAllWaste } from '../../hooks/useWastes';

type Category = 'products' | 'waste sources' | 'recycler' | 'treatments' | 'requirements';
const CATEGORIES: Category[] = ['products', 'waste sources', 'recycler', 'treatments', 'requirements'];

function useActiveData(category: Category) {
  const products = useAllProducts({ enabled: category === 'products' });
  const wastes = useAllWaste({ enabled: category === 'waste sources' });
  const recyclers = useAllRecyclers({ enabled: category === 'recycler' });
  const treatments = useAllTreatments({ enabled: category === 'treatments' });
  const requirements = useAllRequirements({ enabled: category === 'requirements' });
  const map: Record<Category, { data: any[]; isLoading: boolean; error: any }> = {
    products, 'waste sources': wastes, recycler: recyclers, treatments, requirements,
  };
  return map[category];
}

// Simple card for recyclers and treatments (unchanged)
function getTitle(category: Category, item: any): string {
  switch (category) {
    case 'recycler': return `Recycler — ${item.address ?? 'No address'}`;
    case 'treatments': return item.treatment_processes?.process ?? 'Treatment';
    default: return '';
  }
}

function getSub(category: Category, item: any): string {
  switch (category) {
    case 'recycler': return item.treatment_processes?.process ?? '';
    case 'treatments': return item.treatment_processes?.treatment_methods?.method ?? '—';
    default: return '';
  }
}

function getRoute(category: Category, item: any): string {
  switch (category) {
    case 'products': return `/product/${item.id}`;
    case 'waste sources': return `/waste/${item.id}`;
    case 'recycler': return `/recycler/${item.u_id ?? item.id}`;
    case 'treatments': return `/treatment/${item.id}`;
    case 'requirements': return `/requirement/${item.id}`;
  }
}

export default function MarketplaceScreen() {
  const [active, setActive] = useState<Category>('products');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data = [], isLoading, error } = useActiveData(active);

  const handleNavChange = (cat: Category) => {
    setActive(cat);
    setIsMenuOpen(false);
  };

  const renderItem = ({ item }: { item: any }) => {
    const route = getRoute(active, item);

    if (active === 'waste sources') {
      return (
        <WasteCard
          data={item}
          onPress={() => router.push(route as any)}
        />
      );
    }

    if (active === 'products') {
      return (
        <ProductCard
          data={item}
          onPress={() => router.push(route as any)}
        />
      );
    }

    if (active === 'requirements') {
      return (
        <RequirementCard
          data={item}
          onPress={() => router.push(route as any)}
        />
      );
    }

    // Simple card for recycler and treatments
    return (
      <TouchableOpacity
        style={[styles.card, shadows.card]}
        onPress={() => router.push(route as any)}
        activeOpacity={0.75}
      >
        <View style={styles.cardInner}>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle} numberOfLines={2}>{getTitle(active, item)}</Text>
            <Text style={styles.cardSub}>{getSub(active, item)}</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setIsMenuOpen(!isMenuOpen)} style={styles.hamburger}>
          <Text style={styles.hamburgerText}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>MarketPlace</Text>
      </View>

      <View style={styles.body}>
        {isMenuOpen && (
          <>
            <TouchableOpacity style={styles.backdrop} onPress={() => setIsMenuOpen(false)} />
            <View style={styles.sidebarDrawer}>
              <SidebarNav tabs={CATEGORIES} active={active} onChange={handleNavChange} />
            </View>
          </>
        )}

        <View style={styles.panel}>
          {isLoading && <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />}
          {!!error && <Text style={styles.error}>{error.message}</Text>}
          {!isLoading && !error && (
            <FlatList
              data={data}
              keyExtractor={item => item.id ?? item.u_id}
              contentContainerStyle={styles.list}
              renderItem={renderItem}
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing[4],
    paddingBottom: spacing[3],
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.foreground,
    marginLeft: spacing[2],
  },
  hamburger: { padding: spacing[1] },
  hamburgerText: { fontSize: 24, color: colors.foreground },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 10,
  },
  sidebarDrawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '70%',
    backgroundColor: colors.background,
    zIndex: 20,
    padding: spacing[4],
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  body: { flex: 1 },
  panel: { flex: 1, paddingTop: spacing[2] },
  list: {
    padding: spacing[3],
    paddingBottom: 100,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.cardPadding,
    marginBottom: spacing[2],
  },
  cardInner: { flexDirection: 'row', alignItems: 'center' },
  cardText: { flex: 1 },
  cardTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.foreground,
  },
  cardSub: {
    fontSize: typography.fontSize.sm,
    color: colors.mutedForeground,
    marginTop: spacing[1],
  },
  chevron: { fontSize: 20, color: colors.mutedForeground, marginLeft: spacing[2] },
  error: { color: colors.destructive, padding: spacing[4] },
});