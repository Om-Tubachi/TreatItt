import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { tabBar } from '../../constants/theme';
import { TabIcon } from '../atoms/TabIcon';

import IconHome from '../assets/TabIcons/Home.svg';
import LocationPin from '../assets/TabIcons/LocationPin.svg';
import IconMarketplace from '../assets/TabIcons/MarketPlace.svg';
import IconRecycle from '../assets/TabIcons/Recycle.svg';
import Sell from '../assets/TabIcons/Sell.svg';

const Placeholder: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <View style={{ width: size, height: size, borderRadius: 4, backgroundColor: color, opacity: 0.5 }} />
);

const ICONS: Record<string, (size: number, color: string) => React.ReactNode> = {
  index: (s, c) => <IconHome width={s} height={s} fill="none" stroke={c} />,
  Discover: (s, c) => <LocationPin width={s} height={s} fill="none" stroke={c} />,
  Sell: (s, c) => <Sell width={s} height={s} fill="none" stroke={c} />, // Keep fill="none" here too
  Recycle: (s, c) => <IconRecycle width={37} height={37} fill="none" stroke={c} />,
  MarketPlace: (s, c) => <IconMarketplace width={s} height={s} fill="none" stroke={c} />,
};

export const TabBar: React.FC<BottomTabBarProps> = ({ state, navigation }) => {
  const go = (route: typeof state.routes[0], idx: number) => {
    const focused = state.index === idx;
    const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
    if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
  };

  const renderTab = (route: typeof state.routes[0], idx: number) => {
    const focused = state.index === idx;
    const renderIcon = ICONS[route.name] ?? ((s, c) => <Placeholder size={s} color={c} />);

    return (
      <TouchableOpacity
        key={route.key}
        style={styles.tabBtn}
        onPress={() => go(route, idx)}
        activeOpacity={0.7}
      >
        <TabIcon focused={focused} icon={renderIcon(tabBar.iconSize, tabBar.inactiveColor)} />
      </TouchableOpacity>
    );
  };

  const centerRoute = state.routes[2];
  const centerFocused = state.index === 2;
  const renderCenter = ICONS[centerRoute.name] ?? ((s, c) => <Placeholder size={s} color={c} />);

  return (
    <View style={styles.outer}>
      <View style={styles.centerAnchor}>
        <TouchableOpacity
          style={[styles.centerBtn, centerFocused && styles.centerBtnActive]}
          onPress={() => go(centerRoute, 2)}
          activeOpacity={0.85}
        >
          {renderCenter(tabBar.centerIconSize, tabBar.centerColor)}
        </TouchableOpacity>
      </View>

      <View style={styles.bar}>
        {/* Left Side Tabs */}
        <View style={styles.side}>
          {state.routes.slice(0, 2).map((route, index) => renderTab(route, index))}
        </View>

        {/* Center Spacer */}
        <View style={styles.centerSpace} />

        {/* Right Side Tabs */}
        <View style={styles.side}>
          {state.routes.slice(3).map((route, localIndex) => {
            const absoluteIndex = localIndex + 3; // Safely compute absolute tracking index
            return renderTab(route, absoluteIndex);
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    position: 'relative',
    width: '100%',
  },
  centerAnchor: {
    position: 'absolute',
    alignSelf: 'center',
    top: -tabBar.centerLift,
    zIndex: 10,
  },
  centerBtn: {
    width: tabBar.centerSize,
    height: tabBar.centerSize,
    borderRadius: tabBar.centerSize / 2,
    backgroundColor: tabBar.centerBg,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  centerBtnActive: {
    backgroundColor: tabBar.centerBg,
    shadowOpacity: 0.2,
  },
  bar: {
    width: '100%',
    height: tabBar.height,
    backgroundColor: tabBar.bg,
    borderTopLeftRadius: tabBar.borderRadius,
    borderTopRightRadius: tabBar.borderRadius,
    // borderRadius: tabBar.borderRadius, // Rounds all 4 corners evenly
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    // Optional: Add bottom margin if you want it completely floating
    // marginBottom:       16, 
  },
  side: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  centerSpace: { width: tabBar.centerSize + 8 },
  tabBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});