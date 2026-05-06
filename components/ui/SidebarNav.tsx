import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../constants/theme';

interface SidebarNavProps<T extends string> {
  tabs: T[];
  active: T;
  onChange: (tab: T) => void;
}

export function SidebarNav<T extends string>({ tabs, active, onChange }: SidebarNavProps<T>) {
  return (
    <View style={styles.sidebar}>
      {tabs.map(tab => {
        const isActive = tab === active;
        return (
          <TouchableOpacity
            key={tab}
            style={[styles.item, isActive && styles.itemActive]}
            onPress={() => onChange(tab)}
          >
            <Text style={[styles.label, isActive && styles.labelActive]} numberOfLines={2}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
            {isActive && <View style={styles.indicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    backgroundColor: colors.background,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    paddingTop: spacing[2],
  },
  item: {
    paddingVertical: spacing[2], // Reduced
    paddingHorizontal: spacing[1], // Reduced
    marginHorizontal: spacing[1], // Uniform margin
    position: 'relative',
  },
  itemActive: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
  },
  label: {
    fontSize: typography.fontSize.sm,
    color: colors.mutedForeground,
    fontWeight: typography.fontWeight.medium,
    textAlign: 'center',
  },
  labelActive: {
    color: colors.primary,
    fontWeight: typography.fontWeight.semiBold,
  },
  indicator: {
    position: 'absolute',
    right: 0,
    top: '25%',
    width: 3,
    height: '50%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
});