import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Badge } from '../../../components/ui/Badge';
import { ScreenHeader } from '../../../components/ui/ScreenHeader';
import { colors, radius, shadows, spacing, typography } from '../../../constants/theme';
import { useRequirementById } from '../../../hooks/useRequirements';

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value ?? '—'}</Text>
    </View>
  );
}

export default function RequirementDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, error } = useRequirementById(id);

  if (isLoading) return <ActivityIndicator style={styles.centered} color={colors.primary} />;
  if (error) return <Text style={styles.error}>{error.message}</Text>;

  const statusMap: Record<string, any> = { Listed: 'listed', Recycled: 'recycled', Pending: 'pending' };
  const badgeVariant = statusMap[data?.status] ?? 'pending';

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Requirement Detail" showBack />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.card, shadows.card]}>
          <DetailRow label="FRP COMPOSITION" value={data?.frp?.composition?.composition_name} />
          <DetailRow label="CATEGORY" value={data?.frp?.category?.category_name} />
          <DetailRow label="GRADE" value={data?.frp?.grade?.grade_name} />
          <DetailRow label="EST. REQ / MONTH" value={data?.est_req_per_month ? `${data.est_req_per_month} kg` : null} />
          <DetailRow label="ACTUAL REQ / MONTH" value={data?.act_req_per_month ? `${data.act_req_per_month} kg` : null} />
          <View style={styles.statusRow}>
            <Text style={styles.rowLabel}>STATUS</Text>
            {data?.status ? <Badge variant={badgeVariant} label={data.status} /> : <Text style={styles.rowValue}>—</Text>}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, marginTop: 40 },
  content: { padding: spacing.screenPadding, gap: spacing[3], paddingBottom: 60 },
  card: { backgroundColor: colors.card, borderRadius: radius.xl, paddingHorizontal: spacing[4] },
  row: { paddingVertical: spacing[4], borderBottomWidth: 1, borderBottomColor: colors.border, gap: spacing[1] },
  statusRow: { paddingVertical: spacing[4], gap: spacing[2] },
  rowLabel: { fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.semiBold, color: colors.mutedForeground, letterSpacing: 0.8, textTransform: 'uppercase' },
  rowValue: { fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.medium, color: colors.foreground },
  error: { color: colors.destructive, padding: spacing[4] },
});