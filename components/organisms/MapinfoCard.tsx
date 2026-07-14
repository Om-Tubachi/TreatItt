import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { card, colors, fontSize, radius, spacing, typography } from '../../constants/theme';
import { MapPin } from '../../services/search';

interface Props {
  pin: MapPin;
  distanceMeters?: number;
  onPress: () => void;
  onDismiss: () => void;
}

function formatDistance(meters?: number) {
  if (meters == null) return null;
  return meters >= 1000 ? `${(meters / 1000).toFixed(1)} km` : `${Math.round(meters)} m`;
}

export function MapInfoCard({ pin, distanceMeters, onPress, onDismiss }: Props) {
  const title = pin.kind === 'actor' ? pin.displayName || pin.username : (pin.entityType?.toUpperCase() ?? 'Listing');
  const subtitle = pin.kind === 'actor' ? pin.company ?? '' : `Entity: ${pin.entityType}`;

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onPress}>
      <TouchableOpacity style={styles.dismiss} onPress={onDismiss}>
        <Text style={styles.dismissText}>×</Text>
      </TouchableOpacity>

      <View style={styles.thumb} />

      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.metaRow}>
          {distanceMeters != null && <Text style={styles.distance}>{formatDistance(distanceMeters)}</Text>}
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    bottom: 24,
    left: spacing.xl,
    right: spacing.xl,
    flexDirection: 'row',
    backgroundColor: card.bg,
    borderRadius: radius.lg,
    borderWidth: card.borderWidth,
    borderColor: card.border,
    padding: spacing.md,
    gap: spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  dismiss: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  dismissText: { color: colors.white, fontSize: 14, lineHeight: 14 },
  thumb: { width: 56, height: 56, borderRadius: radius.md, backgroundColor: colors.tabsBackground },
  body: { flex: 1, justifyContent: 'center', gap: 4 },
  title: { fontFamily: typography.bodyMed, fontSize: fontSize.sm, color: colors.black },
  metaRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  distance: { fontFamily: typography.bodyMed, fontSize: fontSize.xs, color: colors.primaryDark },
  subtitle: { fontFamily: typography.body, fontSize: fontSize.xs, color: colors.body, flexShrink: 1 },
});