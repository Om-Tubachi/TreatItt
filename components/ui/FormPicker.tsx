import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radius, shadows, spacing, typography } from '../../constants/theme';

interface FormPickerProps {
  label?: string;
  required?: boolean;
  placeholder?: string;
  value?: string | null;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
}

export function FormPicker({ label, required, placeholder = 'Select...', value, options, onChange }: FormPickerProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find(o => o.value === value);

  return (
    <View style={styles.wrapper}>
      {label ? (
        <Text style={styles.label}>
          {label}
          {required ? <Text style={styles.required}> *</Text> : null}
        </Text>
      ) : null}
      <TouchableOpacity style={styles.trigger} onPress={() => setOpen(true)} activeOpacity={0.7}>
        <Text style={[styles.triggerText, !selected && styles.placeholder]}>
          {selected ? selected.label : placeholder}
        </Text>
        <Text style={styles.chevron}>▾</Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => setOpen(false)} />
        <View style={styles.sheet}>
          <Text style={styles.sheetTitle}>{label ?? 'Select'}</Text>
          <FlatList
            data={options}
            keyExtractor={item => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.option, item.value === value && styles.optionActive]}
                onPress={() => { onChange(item.value); setOpen(false); }}
              >
                <Text style={[styles.optionText, item.value === value && styles.optionTextActive]}>
                  {item.label}
                </Text>
                {item.value === value ? <Text style={styles.check}>✓</Text> : null}
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
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
  trigger: {
    backgroundColor: colors.input,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  triggerText: {
    fontSize: typography.fontSize.base,
    color: colors.foreground,
  },
  placeholder: { color: colors.mutedForeground },
  chevron: { color: colors.mutedForeground, fontSize: 14 },
  backdrop: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: colors.card,
    borderTopLeftRadius: radius['3xl'],
    borderTopRightRadius: radius['3xl'],
    padding: spacing[6],
    maxHeight: '60%',
    ...shadows.cardLg,
  },
  sheetTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.foreground,
    marginBottom: spacing[4],
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  optionActive: { backgroundColor: colors.accent, borderRadius: radius.md, paddingHorizontal: spacing[2] },
  optionText: { fontSize: typography.fontSize.base, color: colors.foreground },
  optionTextActive: { color: colors.primary, fontWeight: typography.fontWeight.semiBold },
  check: { color: colors.primary, fontWeight: '700' },
});