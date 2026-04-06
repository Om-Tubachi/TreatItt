import { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import * as WebBrowser from 'expo-web-browser';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from '../context/auth';

// This is required for the browser-based OAuth flow to redirect back correctly
// Calling it in the root layout ensures it's initialized before any login attempt
WebBrowser.maybeCompleteAuthSession();

export const unstable_settings = {
  anchor: '(tabs)',
};

function InitialLayout() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (isLoading) return;
    if (!navigationState?.key) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      // Redirect to the login page
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      // Redirect away from login page to home
      router.replace('/(tabs)');
    }
  }, [user, isLoading, segments, navigationState]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  );
}
