import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, typography } from '../../constants/theme';

type BadgeVariant = 'listed' | 'pending' | 'recycled' | 'active' | 'full';

interface BadgeProps {
  variant: BadgeVariant;
  label?: string;
}

const LABELS: Record<BadgeVariant, string> = {
  listed: 'Listed',
  pending: 'Pending',
  recycled: 'Recycled',
  active: 'Active',
  full: 'Full',
};

export function Badge({ variant, label }: BadgeProps) {
  const bg = colors.badge[variant].bg;
  const text = colors.badge[variant].text;
  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <Text style={[styles.text, { color: text }]}>{label ?? LABELS[variant]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semiBold,
    letterSpacing: 0.3,
  },
});