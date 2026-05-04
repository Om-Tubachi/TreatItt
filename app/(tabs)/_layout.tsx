import { Tabs } from "expo-router";

export default function RootLayout() {
    return (
        <Tabs>
            <Tabs.Screen name="index" options={{ headerShown: true, title: 'Home' }} />
            {/* <Tabs.Screen name="/screens/MarketPlace" options={{ headerShown: true, title: 'Marketplace' }} /> */}
            {/* <Tabs.Screen name="/screens/CollectionPoint" options={{ headerShown: true, title: 'Collection Points' }} /> */}
            <Tabs.Screen name="me/index" options={{ headerShown: true, title: 'Profile' }} />
        </Tabs>
    );
}