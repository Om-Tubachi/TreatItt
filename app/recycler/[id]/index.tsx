import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ScreenHeader } from '../../../components/ui/ScreenHeader';
import { colors, radius, shadows, spacing, typography } from '../../../constants/theme';
import { useRecyclerById } from '../../../hooks/useRecyclers';

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value ?? '—'}</Text>
    </View>
  );
}

export default function RecyclerDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, error } = useRecyclerById(id);

  if (isLoading) return <ActivityIndicator style={styles.centered} color={colors.primary} />;
  if (error) return <Text style={styles.error}>{error.message}</Text>;

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Recycler Detail" showBack />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.card, shadows.card]}>
          <DetailRow label="ADDRESS" value={data?.address} />
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
  rowLabel: { fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.semiBold, color: colors.mutedForeground, letterSpacing: 0.8, textTransform: 'uppercase' },
  rowValue: { fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.medium, color: colors.foreground },
  error: { color: colors.destructive, padding: spacing[4] },
});