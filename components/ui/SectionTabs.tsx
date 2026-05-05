import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors, radius, spacing, typography } from '../../constants/theme';

interface SectionTabsProps<T extends string> {
  tabs: T[];
  active: T;
  onChange: (tab: T) => void;
}

export function SectionTabs<T extends string>({ tabs, active, onChange }: SectionTabsProps<T>) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {tabs.map(tab => {
        const isActive = tab === active;
        return (
          <TouchableOpacity
            key={tab}
            style={[styles.pill, isActive && styles.pillActive]}
            onPress={() => onChange(tab)}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: spacing.screenPadding,
    gap: spacing[2],
    paddingVertical: spacing[2],
  },
  pill: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  pillActive: {
    backgroundColor: colors.foreground,
    borderColor: colors.foreground,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.mutedForeground,
  },
  labelActive: {
    color: colors.card,
  },
});