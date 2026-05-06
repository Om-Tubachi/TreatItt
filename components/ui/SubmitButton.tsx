import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { colors, radius, typography } from '../../constants/theme';

interface SubmitButtonProps extends TouchableOpacityProps {
  label: string;
  loading?: boolean;
  variant?: 'primary' | 'outline';
}

export function SubmitButton({ label, loading, variant = 'primary', style, ...props }: SubmitButtonProps) {
  const isPrimary = variant === 'primary';
  return (
    <TouchableOpacity
      style={[styles.btn, isPrimary ? styles.primary : styles.outline, style]}
      activeOpacity={0.85}
      disabled={loading}
      {...props}
    >
      {loading
        ? <ActivityIndicator color={isPrimary ? colors.primaryForeground : colors.primary} />
        : <Text style={[styles.label, !isPrimary && styles.labelOutline]}>{label}</Text>
      }
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: radius.xl,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: { backgroundColor: colors.primary },
  outline: {
    backgroundColor: colors.transparent,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  label: {
    color: colors.primaryForeground,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semiBold,
  },
  labelOutline: { color: colors.primary },
});