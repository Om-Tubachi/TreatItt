import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors, componentTokens, spacing, typography } from '../../constants/theme';

interface FormInputProps extends TextInputProps {
  label?: string;
  required?: boolean;
  optional?: boolean;
}

export function FormInput({ label, required, optional, ...props }: FormInputProps) {
  return (
    <View style={styles.wrapper}>
      {label ? (
        <Text style={styles.label}>
          {label}
          {required ? <Text style={styles.required}> *</Text> : null}
          {optional ? <Text style={styles.optionalTag}> (optional)</Text> : null}
        </Text>
      ) : null}
      <TextInput
        style={styles.input}
        placeholderTextColor={colors.mutedForeground}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: spacing[1] },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.mutedForeground,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  required: { color: colors.destructive },
  optionalTag: {
    color: colors.mutedForeground,
    fontWeight: typography.fontWeight.regular,
    textTransform: 'none',
    letterSpacing: 0,
    fontSize: typography.fontSize.xs,
  },
  input: {
    ...componentTokens.input,
    fontFamily: 'System',
  },
});