import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, radius, shadows, spacing, typography } from '../../constants/theme';

interface WasteCardProps {
  data: {
    frp: {
      composition: { composition_name: string };
      category: { category_name: string };
      grade: { grade_name: string };
      resin: { resin_name: string };
    };
    manufacturing_processes: { manufacturing_process_name: string } | null;
    quantity: number | null;
    lifecycle_stage: string | null;
    status: string | null;
    price_per_kg: number | null;
    latitude: number | null;
    longitude: number | null;
    users: { username: string } | null;
  };
  onPress: () => void;
}

export default function WasteCard({ data, onPress }: WasteCardProps) {
  const [showCoords, setShowCoords] = useState(false);
  const hasLocation = data.latitude != null && data.longitude != null;

  const frp = data.frp;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {/* Top row — username */}
      <Text style={styles.username}>by: @{data.users?.username ?? '—'}</Text>

      {/* Main content row */}
      <View style={styles.row}>
        {/* Icon box */}
        <View style={styles.iconBox}>
          <Text style={styles.iconEmoji}>♻️</Text>
        </View>

        {/* Right content */}
        <View style={styles.rightContent}>
          {/* FRP pills */}
          <View style={styles.pillRow}>
            <Pill label={frp.category.category_name} />
            <Pill label={frp.composition.composition_name} />
            <Pill label={frp.grade.grade_name} />
            <Pill label={frp.resin.resin_name} />
          </View>

          {/* Mfg process — filled pill */}
          {data.manufacturing_processes && (
            <View style={styles.mfgPill}>
              <Text style={styles.mfgPillText}>
                {data.manufacturing_processes.manufacturing_process_name}
              </Text>
            </View>
          )}

          {/* Description placeholder */}
          <Text style={styles.description} numberOfLines={1}>
            {data.lifecycle_stage ?? 'FRP waste listing'}
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Bottom row */}
      <View style={styles.bottomRow}>
        {/* Lifecycle tag */}
        {data.lifecycle_stage && (
          <View style={styles.lifecyclePill}>
            <Text style={styles.lifecycleText}>{data.lifecycle_stage}</Text>
          </View>
        )}

        {/* Location toggle */}
        <TouchableOpacity
          style={styles.locationPill}
          onPress={() => hasLocation && setShowCoords(v => !v)}
          activeOpacity={hasLocation ? 0.7 : 1}
        >
          <Text style={styles.locationText}>
            {!hasLocation
              ? '📍 No location'
              : showCoords
              ? `${Number(data.latitude).toFixed(4)}°, ${Number(data.longitude?.toFixed(4))}°`
              : '📍 Location'}
          </Text>
        </TouchableOpacity>

        {/* Quantity */}
        {data.quantity != null && (
          <Text style={styles.quantity}>{data.quantity} kg</Text>
        )}
      </View>

      {/* Price */}
      {data.price_per_kg != null && (
        <Text style={styles.price}>₹{data.price_per_kg}/kg</Text>
      )}
    </TouchableOpacity>
  );
}

function Pill({ label }: { label: string }) {
  return (
    <View style={styles.pill}>
      <Text style={styles.pillText} numberOfLines={1}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.cardPadding,
    marginBottom: spacing.sectionGap,
    ...shadows.card,
  },
  username: {
    fontSize: typography.fontSize.xs,
    color: colors.mutedForeground,
    textAlign: 'right',
    marginBottom: spacing[2],
  },
  row: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  iconBox: {
    width: 72,
    height: 72,
    borderRadius: radius.lg,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: {
    fontSize: 28,
  },
  rightContent: {
    flex: 1,
    gap: spacing[2],
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[1],
  },
  pill: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: spacing[2],
    paddingVertical: 3,
  },
  pillText: {
    fontSize: typography.fontSize.xs,
    color: colors.mutedForeground,
    fontWeight: typography.fontWeight.medium,
  },
  mfgPill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingHorizontal: spacing[3],
    paddingVertical: 4,
  },
  mfgPillText: {
    fontSize: typography.fontSize.xs,
    color: colors.primaryForeground,
    fontWeight: typography.fontWeight.semiBold,
  },
  description: {
    fontSize: typography.fontSize.sm,
    color: colors.mutedForeground,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing[3],
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  lifecyclePill: {
    backgroundColor: colors.accent,
    borderRadius: radius.full,
    paddingHorizontal: spacing[3],
    paddingVertical: 4,
  },
  lifecycleText: {
    fontSize: typography.fontSize.xs,
    color: colors.accentForeground,
    fontWeight: typography.fontWeight.medium,
  },
  locationPill: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: spacing[3],
    paddingVertical: 4,
  },
  locationText: {
    fontSize: typography.fontSize.xs,
    color: colors.mutedForeground,
  },
  quantity: {
    marginLeft: 'auto',
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  price: {
    fontSize: typography.fontSize.sm,
    color: colors.mutedForeground,
    marginTop: spacing[1],
  },
});