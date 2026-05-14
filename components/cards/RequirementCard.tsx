import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { colors, radius, shadows, spacing, typography } from '../../constants/theme';

interface RequirementCardProps {
  data: {
    frp: {
      composition: { composition_name: string };
      category: { category_name: string };
      grade: { grade_name: string };
      resin: { resin_name: string };
    };
    est_req_per_month: number | null;
    act_req_per_month: number | null;
    urgency: string | null;
    status: string | null;
    price_per_kg: number | null;
    latitude: number | null;
    longitude: number | null;
    users: { username: string } | null;
  };
  onPress: () => void;
}

export default function RequirementCard({ data, onPress }: RequirementCardProps) {
  const [showCoords, setShowCoords] = useState(false);
  const hasLocation = data.latitude != null && data.longitude != null;
  const frp = data.frp;

  const urgencyColor = () => {
    switch (data.urgency?.toLowerCase()) {
      case 'immediate': return { bg: '#FAE0DB', text: '#8C2A18' };
      case 'within month': return { bg: '#FDF0CE', text: '#7A5C00' };
      default: return { bg: colors.accent, text: colors.accentForeground };
    }
  };

  const uc = urgencyColor();

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.topRow}>
        <Text style={styles.username}>by: @{data.users?.username ?? '—'}</Text>
        {data.status && (
          <View style={styles.statusPill}>
            <Text style={styles.statusText}>{data.status.toUpperCase()}</Text>
          </View>
        )}
      </View>

      <View style={styles.row}>
        <View style={styles.iconBox}>
          <Text style={styles.iconEmoji}>♻️</Text>
        </View>

        <View style={styles.rightContent}>
          <View style={styles.pillRow}>
            <Pill label={frp.category.category_name} />
            <Pill label={frp.composition.composition_name} />
            <Pill label={frp.grade.grade_name} />
            <Pill label={frp.resin.resin_name} />
          </View>
          <Text style={styles.description} numberOfLines={1}>
            FRP material requirement listing
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.bottomRow}>
        {data.urgency && (
          <View style={[styles.urgencyPill, { backgroundColor: uc.bg }]}>
            <Text style={[styles.urgencyText, { color: uc.text }]}>
              {data.urgency.toLowerCase() === 'immediate' ? '! ' : '⏱ '}
              {data.urgency.charAt(0).toUpperCase() + data.urgency.slice(1)}
            </Text>
          </View>
        )}

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
      </View>

      {data.est_req_per_month != null && (
        <Text style={styles.reqText}>
          Req: <Text style={styles.reqBold}>{data.est_req_per_month}kg/mo</Text>
        </Text>
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
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  username: {
    fontSize: typography.fontSize.xs,
    color: colors.mutedForeground,
  },
  statusPill: {
    backgroundColor: colors.badge.active.bg,
    borderRadius: radius.full,
    paddingHorizontal: spacing[3],
    paddingVertical: 3,
  },
  statusText: {
    fontSize: typography.fontSize.xs,
    color: colors.badge.active.text,
    fontWeight: typography.fontWeight.semiBold,
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
    justifyContent: 'center',
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
  urgencyPill: {
    borderRadius: radius.full,
    paddingHorizontal: spacing[3],
    paddingVertical: 4,
  },
  urgencyText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semiBold,
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
  reqText: {
    fontSize: typography.fontSize.sm,
    color: colors.mutedForeground,
    marginTop: spacing[2],
  },
  reqBold: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
});