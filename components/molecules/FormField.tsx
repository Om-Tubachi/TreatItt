import React from 'react';
import { StyleSheet, TextInputProps, View } from 'react-native';
import { colors } from '../../constants/theme';
import { AppText } from '../atoms/AppText';
import { Input } from '../atoms/Input';

interface Props extends TextInputProps {
  label: string;
  error?: string;
  secureToggle?: boolean;
}

export const FormField: React.FC<Props> = ({ label, error, secureToggle, ...inputProps }) => (
  <View style={styles.container}>
    <AppText variant="label">{label}</AppText>
    <Input secureToggle={secureToggle} {...inputProps} />
    {error ? <AppText variant="caption" style={styles.error}>{error}</AppText> : null}
  </View>
);

const styles = StyleSheet.create({
  container: { gap: 6 },
  error: { color: colors.error },
});