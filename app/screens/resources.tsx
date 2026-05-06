import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { SidebarNav } from '../../components/ui/SidebarNav';
import { colors, radius, shadows, spacing, typography } from '../../constants/theme';
import { useAuth } from '../../context/auth';
import { useProductsByUser } from '../../hooks/useProducts';
import { useRequirementsByUser } from '../../hooks/useRequirements';
import { useTreatmentsByRecycler } from '../../hooks/useTreatments';
import { useWasteEntriesOfUser } from '../../hooks/useWastes';

type Category = 'products' | 'waste' | 'services' | 'requirements';
const CATEGORIES: Category[] = ['products', 'waste', 'services', 'requirements'];

function useUserData(category: Category, userId: string) {
  const products = useProductsByUser(userId, { enabled: category === 'products' });
  const waste = useWasteEntriesOfUser(userId, { enabled: category === 'waste' });
  const services = useTreatmentsByRecycler(userId, { enabled: category === 'services' });
  const requirements = useRequirementsByUser(userId, { enabled: category === 'requirements' });
  const map: Record<Category, { data: any; isLoading: boolean; error: any }> = { products, waste, services, requirements };
  return map[category];
}

export default function ResourcesScreen() {
  const { user } = useAuth();
  const [active, setActive] = useState<Category>('products');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data = [], isLoading, error } = useUserData(active, user?.id ?? '');

  const handleNavChange = (cat: Category) => {
    setActive(cat);
    setIsMenuOpen(false);
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Resources" showBack />
      
      {/* Trigger for Mobile */}
      <TouchableOpacity onPress={() => setIsMenuOpen(!isMenuOpen)} style={styles.hamburger}>
         <Text>☰ Menu</Text>
      </TouchableOpacity>

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
              keyExtractor={item => item.id}
              contentContainerStyle={styles.list}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.card, shadows.card]}
                  onPress={() => router.push(getRoute(active, item) as any)}
                  activeOpacity={0.75}
                >
                  <Text style={styles.cardTitle} numberOfLines={2}>{getLabel(active, item)}</Text>
                  <Text style={styles.cardSub}>{getSub(active, item)}</Text>
                  <Text style={styles.chevron}>›</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </View>
    </View>
  );
}

// Helpers
function getLabel(c: Category, i: any): string {
    return c === 'products' ? `${i.frp?.composition?.composition_name ?? 'N/A'} | ${i.frp?.category?.category_name ?? 'N/A'}` : 'Item';
}
function getSub(c: Category, i: any): string { return ''; }
function getRoute(c: Category, i: any): string { return `/${c}/${i.id}`; }

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  hamburger: { padding: spacing[3], borderBottomWidth: 1, borderBottomColor: colors.border },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 10 },
  sidebarDrawer: { position: 'absolute', top: 0, left: 0, bottom: 0, width: '70%', backgroundColor: colors.background, zIndex: 20, padding: spacing[4], borderRightWidth: 1, borderRightColor: colors.border },
  body: { flex: 1, flexDirection: 'row' },
  panel: { flex: 1, paddingTop: spacing[2] },
  list: { padding: spacing[3], gap: spacing[2] },
  card: { backgroundColor: colors.card, borderRadius: radius.xl, padding: spacing.cardPadding, marginBottom: spacing[2] },
  cardTitle: { fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semiBold, color: colors.foreground, paddingRight: spacing[6] },
  cardSub: { fontSize: typography.fontSize.sm, color: colors.mutedForeground, marginTop: spacing[1] },
  chevron: { position: 'absolute', right: spacing[4], top: spacing[4], fontSize: 20, color: colors.mutedForeground },
  error: { color: colors.destructive, padding: spacing[4] },
});