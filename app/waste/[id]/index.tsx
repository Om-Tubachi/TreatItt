import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Badge } from '../../../components/ui/Badge';
import { ScreenHeader } from '../../../components/ui/ScreenHeader';
import { colors, radius, shadows, spacing, typography } from '../../../constants/theme';
import { useWasteById } from '../../../hooks/useWastes';

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value ?? '—'}</Text>
    </View>
  );
}

export default function WasteDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, error } = useWasteById(id);

  if (isLoading) return <ActivityIndicator style={styles.centered} color={colors.primary} />;
  if (error) return <Text style={styles.error}>{error.message}</Text>;

  const statusMap: Record<string, any> = { Listed: 'listed', Recycled: 'recycled', Pending: 'pending' };
  const badgeVariant = statusMap[data?.status] ?? 'pending';

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Waste Detail" showBack />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.card, shadows.card]}>
          <DetailRow label="FRP COMPOSITION" value={data?.frp?.composition?.composition_name} />
          <DetailRow label="MANUFACTURING PROCESS" value={data?.manufacturing_processes?.manufacturing_process_name} />
          <DetailRow label="COLLECTOR" value={data?.collectors?.name} />
          <DetailRow label="QUANTITY" value={data?.quantity ? `${data.quantity} kg` : null} />
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