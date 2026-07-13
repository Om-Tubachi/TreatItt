import { FilterProvider } from '@/context/filter';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '../context/auth';
import { useAppFonts } from '../hooks/useFonts';
import { queryClient } from '../lib/queryClient';

SplashScreen.preventAutoHideAsync();

function AuthGate() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    // ONLY restrict if they are explicitly sitting inside the auth group pages while already logged in
    if (user && inAuthGroup) {
      router.replace('/(tabs)');
    }
    // if(!user) router.replace('/(tabs)')
  }, [user, isLoading, segments]);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="screens" options={{ headerShown: false }} />
        <Stack.Screen
          name="Sell"
          options={{
            presentation: 'modal',
            headerShown: false
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}

export default function RootLayout() {
  const fontsLoaded = useAppFonts();

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <FilterProvider>
        <AuthProvider>
          <AuthGate />
        </AuthProvider>
      </FilterProvider>
    </QueryClientProvider>
  );
}