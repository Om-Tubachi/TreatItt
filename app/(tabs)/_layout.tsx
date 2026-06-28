import { Tabs } from 'expo-router';
import React from 'react';
import { TabBar } from '../../components/layout/TabBar';

export default function TabLayout() {
  return (
    <Tabs tabBar={props => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index"       options={{ title: 'Home' }} />
      <Tabs.Screen name="Discover"    options={{ title: 'Discover' }} />
      {/* <Tabs.Screen name="Sell"       options={{ title: 'Sell' }} /> */}
      <Tabs.Screen name="Recycle"     options={{ title: 'Recycle' }} />
      <Tabs.Screen name="MarketPlace" options={{ title: 'Marketplace' }} />
    </Tabs>
  );
}