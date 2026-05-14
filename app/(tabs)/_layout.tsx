// import { Tabs, router } from 'expo-router';
// import { useState } from 'react';
// import {
//     Modal,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View
// } from 'react-native';
// import { colors, layout, radius, shadows, spacing, typography } from '../../constants/theme';

// function TabIcon({ emoji, label, focused }: { emoji: string; label: string; focused: boolean }) {
//   return (
//     <View style={tabIconStyles.wrap}>
//       <Text style={tabIconStyles.emoji}>{emoji}</Text>
//       <Text style={[tabIconStyles.label, focused && tabIconStyles.labelActive]}>{label}</Text>
//     </View>
//   );
// }

// const tabIconStyles = StyleSheet.create({
//   wrap: { alignItems: 'center', gap: 2 },
//   emoji: { fontSize: 20 },
//   label: { fontSize: 10, color: colors.tabBarForeground },
//   labelActive: { color: colors.tabBarActive },
// });

// interface FABAction {
//   label: string;
//   emoji: string;
//   route: string;
// }

// const FAB_ACTIONS: FABAction[] = [
//   { label: 'Log Waste', emoji: '♻️', route: '/waste/create' },
//   { label: 'Log Requirement', emoji: '📋', route: '/requirement/create' },
//   { label: 'Register as Recycler', emoji: '🏭', route: '/recycler/create' },
// ];

// function FABMenu({ onClose }: { onClose: () => void }) {
//   return (
//     <Modal transparent animationType="fade" onRequestClose={onClose}>
//       <TouchableOpacity style={fabStyles.backdrop} activeOpacity={1} onPress={onClose} />
//       <View style={fabStyles.menu}>
//         {FAB_ACTIONS.map(action => (
//           <TouchableOpacity
//             key={action.route}
//             style={fabStyles.action}
//             onPress={() => { onClose(); router.push(action.route as any); }}
//             activeOpacity={0.8}
//           >
//             <View style={fabStyles.actionIcon}>
//               <Text style={fabStyles.actionEmoji}>{action.emoji}</Text>
//             </View>
//             <Text style={fabStyles.actionLabel}>{action.label}</Text>
//           </TouchableOpacity>
//         ))}
//       </View>
//     </Modal>
//   );
// }

// const fabStyles = StyleSheet.create({
//   backdrop: {
//     position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   menu: {
//     position: 'absolute',
//     bottom: layout.tabBarHeight + layout.fabSize / 2 + spacing[4],
//     left: spacing.screenPadding,
//     right: spacing.screenPadding,
//     backgroundColor: colors.card,
//     borderRadius: radius['2xl'],
//     padding: spacing[3],
//     ...shadows.cardLg,
//   },
//   action: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: spacing[3],
//     paddingVertical: spacing[3],
//     paddingHorizontal: spacing[3],
//     borderRadius: radius.lg,
//   },
//   actionIcon: {
//     width: 40, height: 40,
//     borderRadius: radius.lg,
//     backgroundColor: colors.accent,
//     alignItems: 'center', justifyContent: 'center',
//   },
//   actionEmoji: { fontSize: 18 },
//   actionLabel: {
//     fontSize: typography.fontSize.base,
//     fontWeight: typography.fontWeight.medium,
//     color: colors.foreground,
//   },
// });

// export default function TabsLayout() {
//   const [fabOpen, setFabOpen] = useState(false);

//   return (
//     <>
//       <Tabs
//         screenOptions={{
//           headerShown: false,
//           tabBarStyle: styles.tabBar,
//           tabBarActiveTintColor: colors.tabBarActive,
//           tabBarInactiveTintColor: colors.tabBarForeground,
//           tabBarShowLabel: false,
//         }}
//       >
//         <Tabs.Screen
//           name="index"
//           options={{
//             tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" label="Home" focused={focused} />,
//           }}
//         />
//         <Tabs.Screen
//           name="MarketPlace"
//           options={{
//             tabBarIcon: ({ focused }) => <TabIcon emoji="🏪" label="Market" focused={focused} />,
//           }}
//         />
//         {/* Center slot for FAB — invisible tab */}
//         <Tabs.Screen
//           name="__fab__"
//           options={{
//             tabBarButton: () => (
//               <View style={styles.fabWrapper}>
//                 <TouchableOpacity
//                   style={[styles.fab, shadows.fab]}
//                   onPress={() => setFabOpen(true)}
//                   activeOpacity={0.85}
//                 >
//                   <Text style={styles.fabIcon}>{fabOpen ? '✕' : '+'}</Text>
//                 </TouchableOpacity>
//               </View>
//             ),
//           }}
//           listeners={{ tabPress: e => e.preventDefault() }}
//         />
//         <Tabs.Screen
//           name="CollectionPoint"
//           options={{
//             tabBarIcon: ({ focused }) => <TabIcon emoji="📍" label="Map" focused={focused} />,
//           }}
//         />
//         <Tabs.Screen
//           name="me"
//           options={{
//             tabBarIcon: ({ focused }) => <TabIcon emoji="👤" label="Profile" focused={focused} />,
//           }}
//         />
//       </Tabs>
//       {fabOpen && <FABMenu onClose={() => setFabOpen(false)} />}
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   tabBar: {
//     height: layout.tabBarHeight,
//     backgroundColor: colors.tabBar,
//     borderTopWidth: 1,
//     borderTopColor: colors.border,
//     paddingBottom: 8,
//     paddingTop: 6,
//   },
//   fabWrapper: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     top: -20,
//     flex: 1,
//   },
//   fab: {
//     width: layout.fabSize,
//     height: layout.fabSize,
//     borderRadius: layout.fabSize / 2,
//     backgroundColor: colors.fab,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   fabIcon: {
//     fontSize: 28,
//     color: colors.fabForeground,
//     lineHeight: 32,
//   },
// });


import { Tabs, router } from 'expo-router';
import { useState } from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { colors, layout, radius, shadows, spacing, typography } from '../../constants/theme';

function TabIcon({ emoji, label, focused }: { emoji: string; label: string; focused: boolean }) {
    return (
        <View style={tabIconStyles.wrap}>
            <Text style={tabIconStyles.emoji}>{emoji}</Text>
            <Text style={[tabIconStyles.label, focused && tabIconStyles.labelActive]}>{label}</Text>
        </View>
    );
}

const tabIconStyles = StyleSheet.create({
    wrap: { alignItems: 'center', gap: 2 },
    emoji: { fontSize: 20 },
    label: { fontSize: 10, color: colors.tabBarForeground },
    labelActive: { color: colors.tabBarActive },
});

const FAB_ACTIONS = [
    { label: 'Sell Waste', emoji: '♻️', route: '/waste/create' },
    { label: 'Sell Requirement', emoji: '📋', route: '/requirement/create' },
    { label: 'Sell Product', emoji: '📋', route: '/product/create' },
    
];

export default function TabsLayout() {
    const [fabOpen, setFabOpen] = useState(false);

    return (
        <View style={{ flex: 1 }}>
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: styles.tabBar,
                    tabBarActiveTintColor: colors.tabBarActive,
                    tabBarInactiveTintColor: colors.tabBarForeground,
                    tabBarShowLabel: false,
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" label="Home" focused={focused} />,
                    }}
                />
                <Tabs.Screen
                    name="MarketPlace"
                    options={{
                        tabBarIcon: ({ focused }) => <TabIcon emoji="🏪" label="Market" focused={focused} />,
                    }}
                />
                <Tabs.Screen
                    name="CollectionPoint"
                    options={{
                        tabBarIcon: ({ focused }) => <TabIcon emoji="📍" label="Map" focused={focused} />,
                    }}
                />
                <Tabs.Screen
                    name="me"
                    options={{
                        tabBarIcon: ({ focused }) => <TabIcon emoji="👤" label="Profile" focused={focused} />,
                    }}
                />
            </Tabs>

            {/* FAB sits above tab bar, outside Tabs */}
            <View style={styles.fabWrapper} pointerEvents="box-none">
                <TouchableOpacity
                    style={[styles.fab, shadows.fab]}
                    onPress={() => setFabOpen(v => !v)}
                    activeOpacity={0.85}
                >
                    <Text style={styles.fabIcon}>{fabOpen ? '✕' : '+'}</Text>
                </TouchableOpacity>
            </View>

            <Modal visible={fabOpen} transparent animationType="fade" onRequestClose={() => setFabOpen(false)}>
                <TouchableOpacity style={fabStyles.backdrop} activeOpacity={1} onPress={() => setFabOpen(false)} />
                <View style={fabStyles.menu}>
                    {FAB_ACTIONS.map(action => (
                        <TouchableOpacity
                            key={action.route}
                            style={fabStyles.action}
                            onPress={() => { setFabOpen(false); router.push(action.route as any); }}
                            activeOpacity={0.8}
                        >
                            <View style={fabStyles.actionIcon}>
                                <Text style={fabStyles.actionEmoji}>{action.emoji}</Text>
                            </View>
                            <Text style={fabStyles.actionLabel}>{action.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        height: layout.tabBarHeight,
        backgroundColor: colors.tabBar,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingBottom: 8,
        paddingTop: 6,
    },
    fabWrapper: {
        position: 'absolute',
        bottom: layout.tabBarHeight - layout.fabSize / 2,
        alignSelf: 'center',
        zIndex: 99,
    },
    fab: {
        width: layout.fabSize,
        height: layout.fabSize,
        borderRadius: layout.fabSize / 2,
        backgroundColor: colors.fab,
        alignItems: 'center',
        justifyContent: 'center',
    },
    fabIcon: {
        fontSize: 28,
        color: colors.fabForeground,
        lineHeight: 32,
    },
});

const fabStyles = StyleSheet.create({
    backdrop: {
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    menu: {
        position: 'absolute',
        bottom: layout.tabBarHeight + layout.fabSize / 2 + spacing[4],
        left: spacing.screenPadding,
        right: spacing.screenPadding,
        backgroundColor: colors.card,
        borderRadius: radius['2xl'],
        padding: spacing[3],
        ...shadows.cardLg,
    },
    action: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[3],
        paddingVertical: spacing[3],
        paddingHorizontal: spacing[3],
        borderRadius: radius.lg,
    },
    actionIcon: {
        width: 40, height: 40,
        borderRadius: radius.lg,
        backgroundColor: colors.accent,
        alignItems: 'center', justifyContent: 'center',
    },
    actionEmoji: { fontSize: 18 },
    actionLabel: {
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.medium,
        color: colors.foreground,
    },
});