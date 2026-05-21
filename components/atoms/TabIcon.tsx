import React from 'react';
import { StyleSheet, View } from 'react-native';
import { tabBar } from '../../constants/theme';

interface Props {
  icon: React.ReactNode;
  focused: boolean;
}

export const TabIcon: React.FC<Props> = ({ icon, focused }) => (
  <View style={[styles.wrap, focused && styles.active]}>
    {icon}
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    width:          tabBar.iconSize + 16,
    height:         tabBar.iconSize + 16,
    borderRadius:   tabBar.borderRadius,
    alignItems:     'center',
    justifyContent: 'center',
  },
  active: {
    backgroundColor: tabBar.activeIconBg,
  },
});