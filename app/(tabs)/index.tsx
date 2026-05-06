import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Badge } from '../../components/ui/Badge';
import { SectionTabs } from '../../components/ui/SectionTabs';
import { StatCard } from '../../components/ui/StatCard';
import { colors, radius, shadows, spacing, typography } from '../../constants/theme';
import { useAuth } from '../../context/auth';
import { useProductsByUser } from '../../hooks/useProducts';
import { useRequirementsByUser } from '../../hooks/useRequirements';
import { useTreatmentsByRecycler } from '../../hooks/useTreatments';
import { useWasteEntriesOfUser } from '../../hooks/useWastes';

type Tab = 'products' | 'requirements' | 'wastes' | 'services';
const TABS: Tab[] = ['products', 'requirements', 'wastes', 'services'];

function useTabData(tab: Tab, userId: string) {
  const waste = useWasteEntriesOfUser(userId, { enabled: tab === 'wastes' });
  const products = useProductsByUser(userId, { enabled: tab === 'products' });
  const requirements = useRequirementsByUser(userId, { enabled: tab === 'requirements' });
  const services = useTreatmentsByRecycler(userId, { enabled: tab === 'services' });
  const map = { wastes: waste, products, requirements, services };
  return map[tab];
}

function getWasteRoute(item: any) { return `/waste/${item.id}`; }
function getProductRoute(item: any) { return `/product/${item.id}`; }

function WasteCard({ item }: { item: any }) {
  const statusMap: Record<string, any> = {
    Listed: 'listed', Recycled: 'recycled', Pending: 'pending',
  };
  const variant = statusMap[item.status] ?? 'pending';
  const date = item.created_at
    ? new Date(item.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
    : '—';

  return (
    <TouchableOpacity style={[styles.itemCard, shadows.card]} onPress={() => router.push(getWasteRoute(item) as any)} activeOpacity={0.75}>
      <View style={styles.itemIcon}>
        <Text style={styles.itemIconText}>♻</Text>
      </View>
      <View style={styles.itemBody}>
        <Text style={styles.itemTitle}>{item.frp?.category?.category_name ?? 'Waste'}</Text>
        <Text style={styles.itemMeta}>{item.quantity ?? '—'} kg · {item.manufacturing_process ?? '—'}</Text>
        <View style={styles.itemFooter}>
          <Badge variant={variant} />
          <Text style={styles.itemDate}>{date}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function GenericCard({ item, route, title, sub }: { item: any; route: string; title: string; sub: string }) {
  return (
    <TouchableOpacity style={[styles.itemCard, shadows.card]} onPress={() => router.push(route as any)} activeOpacity={0.75}>
      <View style={styles.itemBody}>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text style={styles.itemMeta}>{sub}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('wastes');
  const { data = [], isLoading } = useTabData(activeTab, user?.id ?? '');

  const renderItem = ({ item }: { item: any }) => {
    if (activeTab === 'wastes') return <WasteCard item={item} />;
    if (activeTab === 'products') return (
      <GenericCard
        item={item}
        route={getProductRoute(item)}
        title={`${item.frp?.composition?.composition_name ?? 'Product'} | ${item.frp?.category?.category_name ?? ''}`}
        sub={item.frp?.grade?.grade_name ?? '—'}
      />
    );
    if (activeTab === 'requirements') return (
      <GenericCard
        item={item}
        route={`/requirement/${item.id}`}
        title={`Est. ${item.est_req_per_month ?? '—'} kg/mo`}
        sub={item.status ?? '—'}
      />
    );
    if (activeTab === 'services') return (
      <GenericCard
        item={item}
        route={`/treatment/${item.id}`}
        title={item.treatment_processes?.process ?? 'Service'}
        sub={item.treatment_processes?.treatment_methods?.method ?? '—'}
      />
    );
    return null;
  };

  return (
    <View style={styles.screen}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.userName}>{user?.username}</Text>
          <Text style={styles.userSubtitle}>
            {user?.designation} • {user?.company_name ?? 'Your Company'}
          </Text>
        </View>
        <View style={styles.topActions}>
          <TouchableOpacity style={styles.iconBtn} hitSlop={8}>
            <Text style={styles.iconText}>🔍</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} hitSlop={8}>
            <View style={styles.bellWrap}>
              <Text style={styles.iconText}>🔔</Text>
              <View style={styles.badge}><Text style={styles.badgeText}>3</Text></View>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Stats */}
        <View style={styles.statsRow}>
          <StatCard
            variant="dark"
            label="Total Recycled"
            value="—"
            sub="Data coming soon"
          />
          <StatCard
            variant="light"
            label="Active Listings"
            value="—"
            sub="Data will show up here soon"
          />
        </View>

        {/* Tab selector */}
        <SectionTabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

        {/* List */}
        {isLoading
          ? <ActivityIndicator style={{ marginTop: 24 }} color={colors.primary} />
          : (
            <FlatList
              data={data}
              keyExtractor={item => item.id}
              renderItem={renderItem}
              scrollEnabled={false}
              contentContainerStyle={styles.list}
              ListEmptyComponent={
                <View style={styles.empty}>
                  <Text style={styles.emptyText}>No {activeTab} found.</Text>
                </View>
              }
            />
          )
        }

        {/* Sustainability banner */}
        <View style={styles.banner}>
          <View style={styles.bannerText}>
            <Text style={styles.bannerTitle}>Sustainability Report</Text>
            <Text style={styles.bannerSub}>Download your monthly compliance & recycling certificate.</Text>
            <TouchableOpacity style={styles.bannerBtn}>
              <Text style={styles.bannerBtnText}>⚡ Generate Now</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.bannerIcon}>🛡</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: 120 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing[5],
    paddingBottom: spacing[3],
  },
  userName: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.foreground,
  },
  userSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.mutedForeground, // This keeps it secondary and readable
    marginTop: 2,
  },
  topActions: { flexDirection: 'row', gap: spacing[3] },
  iconBtn: { padding: spacing[1] },
  iconText: { fontSize: 20 },
  bellWrap: { position: 'relative' },
  badge: {
    position: 'absolute', top: -4, right: -4,
    backgroundColor: colors.destructive,
    borderRadius: radius.full,
    width: 16, height: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  badgeText: { color: colors.white, fontSize: 9, fontWeight: '700' },
  statsRow: {
    flexDirection: 'row',
    gap: spacing[3],
    paddingHorizontal: spacing.screenPadding,
    marginBottom: spacing[2],
  },
  list: { paddingHorizontal: spacing.screenPadding, gap: spacing[2] },
  itemCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.cardPadding,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[3],
    marginBottom: spacing[2],
  },
  itemIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.lg,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemIconText: { fontSize: 16 },
  itemBody: { flex: 1 },
  itemTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.foreground,
  },
  itemMeta: {
    fontSize: typography.fontSize.sm,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing[2],
  },
  itemDate: { fontSize: typography.fontSize.xs, color: colors.mutedForeground },
  chevron: { fontSize: 20, color: colors.mutedForeground },
  empty: { alignItems: 'center', paddingVertical: spacing[8] },
  emptyText: { color: colors.mutedForeground, fontSize: typography.fontSize.sm },
  banner: {
    margin: spacing.screenPadding,
    marginTop: spacing[4],
    backgroundColor: colors.surfaceDark,
    borderRadius: radius.xl,
    padding: spacing[5],
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerText: { flex: 1 },
  bannerTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.surfaceDarkForeground,
  },
  bannerSub: {
    fontSize: typography.fontSize.sm,
    color: 'rgba(255,255,255,0.6)',
    marginTop: spacing[1],
    lineHeight: 18,
  },
  bannerBtn: {
    marginTop: spacing[3],
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
    borderRadius: radius.full,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    alignSelf: 'flex-start',
  },
  bannerBtnText: {
    color: colors.surfaceDarkForeground,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  bannerIcon: { fontSize: 48, opacity: 0.3 },
});