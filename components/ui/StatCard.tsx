import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadows, spacing, typography } from '../../constants/theme';

interface StatCardProps {
  variant?: 'dark' | 'light';
  label: string;
  value: string;
  sub?: string;
  subPositive?: boolean;
  icon?: React.ReactNode;
}

export function StatCard({ variant = 'light', label, value, sub, subPositive, icon }: StatCardProps) {
  const isDark = variant === 'dark';
  return (
    <View style={[styles.card, isDark ? styles.dark : styles.light, shadows.cardMd]}>
      {icon ? <View style={styles.iconRow}>{icon}</View> : null}
      <Text style={[styles.value, { color: isDark ? colors.surfaceDarkForeground : colors.foreground }]}>
        {value}
      </Text>
      <Text style={[styles.label, { color: isDark ? 'rgba(255,255,255,0.6)' : colors.mutedForeground }]}>
        {label}
      </Text>
      {sub ? (
        <Text style={[styles.sub, { color: subPositive ? colors.success : colors.mutedForeground }]}>
          {sub}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: radius.xl,
    padding: spacing.cardPadding,
    minHeight: 110,
    justifyContent: 'flex-end',
  },
  dark: { backgroundColor: colors.surfaceDark },
  light: { backgroundColor: colors.card },
  iconRow: { marginBottom: spacing[2] },
  value: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.fontSize['4xl'] * 1.1,
  },
  label: {
    fontSize: typography.fontSize.sm,
    marginTop: 2,
  },
  sub: {
    fontSize: typography.fontSize.xs,
    marginTop: 4,
    fontWeight: typography.fontWeight.medium,
  },
});