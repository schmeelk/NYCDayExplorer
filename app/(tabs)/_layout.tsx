import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
export default function TabLayout() {
  const theme = useTheme();
  return <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: theme.colors.primary, tabBarInactiveTintColor: theme.colors.onSurfaceVariant, tabBarStyle: { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.outlineVariant, height: 68, paddingTop: 6, paddingBottom: 8 }, tabBarLabelStyle: { fontSize: 11, fontWeight: '600' } }}><Tabs.Screen name="index" options={{ title: 'Explore', tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="compass-outline" size={size} color={color} /> }} /><Tabs.Screen name="planner" options={{ title: 'Planner', tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="calendar-check-outline" size={size} color={color} /> }} /><Tabs.Screen name="favorites" options={{ title: 'Favorites', tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="heart-outline" size={size} color={color} /> }} /></Tabs>;
}
