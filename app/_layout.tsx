import React, { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { FavoritesProvider } from '@/src/hooks/useFavorites';
import { darkTheme, lightTheme } from '@/src/theme/theme';
import { PaperProvider } from 'react-native-paper';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, useFonts } from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient();
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded, fontError] = useFonts({ Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold });
  useEffect(() => { if (fontsLoaded || fontError) void SplashScreen.hideAsync(); }, [fontsLoaded, fontError]);
  if (!fontsLoaded && !fontError) return null;
  return <SafeAreaProvider><ErrorBoundary><QueryClientProvider client={queryClient}><PaperProvider theme={colorScheme === 'dark' ? darkTheme : lightTheme}><FavoritesProvider><GestureHandlerRootView style={{ flex: 1 }}><KeyboardProvider><Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}><Stack.Screen name="(tabs)" /><Stack.Screen name="destination/[id]" /></Stack></KeyboardProvider></GestureHandlerRootView></FavoritesProvider></PaperProvider></QueryClientProvider></ErrorBoundary></SafeAreaProvider>;
}
