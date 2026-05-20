import React from 'react';
import {
    ActivityIndicator, StyleSheet, Text,
    TouchableOpacity, ViewStyle,
} from 'react-native';
import { colors, layout, radius, typography } from '../../constants/theme';

type Variant = 'primary' | 'outlined';

interface Props {
  label: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<Props> = ({
  label, onPress, variant = 'primary',
  loading = false, disabled = false, style,
}) => {
  const isPrimary = variant === 'primary';

  return (
    <TouchableOpacity
      style={[
        styles.base,
        isPrimary ? styles.primary : styles.outlined,
        (disabled || loading) && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading
        ? <ActivityIndicator color={isPrimary ? colors.white : colors.primaryDark} />
        : <Text style={[styles.label, isPrimary ? styles.labelPrimary : styles.labelOutlined]}>
            {label}
          </Text>
      }
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    width:          layout.buttonWidth,
    height:         layout.buttonHeight,
    borderRadius:   radius.md,
    justifyContent: 'center',
    alignItems:     'center',
  },
  primary:       { backgroundColor: colors.primary },
  outlined:      { borderWidth: 1, borderColor: colors.primaryDark },
  disabled:      { opacity: 0.5 },
  label:         { fontFamily: typography.bodyMed, fontSize: 16 },
  labelPrimary:  { color: colors.white },
  labelOutlined: { color: colors.primaryDark },
});