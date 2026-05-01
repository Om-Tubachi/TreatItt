import { Tabs } from "expo-router";
const RootLayout = () => {
    return <>
        <Tabs>
            <Tabs.Screen
                name = "index"
                options = {{ headerShown: true, title: 'Home' }}
            />
            <Tabs.Screen
                name = "Me"
                options = {{ headerShown: true, title: 'Profile' }}
            />
        </Tabs>
    </>
}


export default RootLayout;