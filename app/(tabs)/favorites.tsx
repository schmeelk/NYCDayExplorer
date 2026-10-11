import React, { useMemo } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { ActivityIndicator, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DestinationCard } from '@/src/components/DestinationCard';
import { EmptyState } from '@/src/components/EmptyState';
import { destinations } from '@/src/data/destinations';
import { useFavorites } from '@/src/hooks/useFavorites';
export default function FavoritesScreen() {
  const theme = useTheme();
  const { favoriteIds, hydrated } = useFavorites();
  const favoriteDestinations = useMemo(
    () =>
      favoriteIds
        .map((id) => destinations.find((destination) => destination.id === id))
        .filter((destination) => destination !== undefined),
    [favoriteIds],
  );

  if (!hydrated) {
    return (
      <SafeAreaView style={[styles.loading, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator animating size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      <FlatList
        data={favoriteDestinations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <Text variant="labelLarge" style={{ color: theme.colors.primary, letterSpacing: 1.3 }}>
              YOUR COLLECTION
            </Text>
            <Text variant="headlineLarge" style={styles.title}>
              Saved for later.
            </Text>
            <Text
              variant="bodyLarge"
              style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
            >
              Keep the places you want to make time for.
            </Text>
          </>
        }
        renderItem={({ item }) => (
          <DestinationCard
            destination={item}
            onPress={() =>
              router.push({
                pathname: '/destination/[id]',
                params: { id: item.id },
              })
            }
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title="Nothing saved yet"
            message="Tap the heart on any destination to build your personal day-trip list."
          />
        }
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({ safe: { flex: 1 }, loading: { flex: 1, alignItems: 'center', justifyContent: 'center' }, list: { padding: 18, paddingBottom: 28 }, title: { fontWeight: '700', marginTop: 8, letterSpacing: -0.6 }, subtitle: { marginTop: 8, lineHeight: 23, marginBottom: 24 } });
