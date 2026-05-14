import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { colors, radius, shadows, spacing, typography } from '../../constants/theme';

interface ProductCardProps {
  data: {
    frp: {
      composition: { composition_name: string };
      category: { category_name: string };
      grade: { grade_name: string };
      resin: { resin_name: string };
    };
    description: string | null;
    quantity: number | null;
    price: number | null;
    form: string | null;
    latitude: number | null;
    longitude: number | null;
    users: { username: string } | null;
  };
  onPress: () => void;
}

export default function ProductCard({ data, onPress }: ProductCardProps) {
  const [showCoords, setShowCoords] = useState(false);
  const hasLocation = data.latitude != null && data.longitude != null;
  const frp = data.frp;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.username}>by: @{data.users?.username ?? '—'}</Text>

      <View style={styles.row}>
        <View style={styles.iconBox}>
          <Text style={styles.iconEmoji}>🏭</Text>
        </View>

        <View style={styles.rightContent}>
          <View style={styles.pillRow}>
            <Pill label={frp.category.category_name} />
            <Pill label={frp.composition.composition_name} />
            <Pill label={frp.grade.grade_name} />
            <Pill label={frp.resin.resin_name} />
          </View>

          {data.form && (
            <View style={styles.formPill}>
              <Text style={styles.formPillText}>{data.form}</Text>
            </View>
          )}

          {data.description && (
            <Text style={styles.description} numberOfLines={1}>
              {data.description}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.bottomRow}>
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

        <View style={styles.rightMeta}>
          {data.price != null && (
            <Text style={styles.price}>₹{data.price}/kg</Text>
          )}
          {data.quantity != null && (
            <Text style={styles.quantity}>{data.quantity} kg</Text>
          )}
        </View>
      </View>
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
  formPill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingHorizontal: spacing[3],
    paddingVertical: 4,
  },
  formPillText: {
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
    justifyContent: 'space-between',
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
  rightMeta: {
    alignItems: 'flex-end',
    gap: 2,
  },
  price: {
    fontSize: typography.fontSize.sm,
    color: colors.mutedForeground,
  },
  quantity: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
});