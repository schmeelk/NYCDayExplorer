import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, useTheme } from 'react-native-paper';
import { CategoryFilter } from '@/src/components/CategoryFilter';
import { DestinationCard } from '@/src/components/DestinationCard';
import { EmptyState } from '@/src/components/EmptyState';
import { SearchBar } from '@/src/components/SearchBar';
import { destinations } from '@/src/data/destinations';
import type { Category } from '@/src/types/destination';
export default function ExploreScreen() {
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Category | 'All'>('All');
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return destinations.filter((destination) => {
      const categoryMatch = category === 'All' || destination.category === category;
      const searchMatch =
        !query ||
        [destination.name, destination.category, destination.address].some((value) =>
          value.toLowerCase().includes(query),
        );
      return categoryMatch && searchMatch;
    });
  }, [category, search]);

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columns}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <View style={styles.heading}>
              <Text variant="labelLarge" style={{ color: theme.colors.primary, letterSpacing: 1.3 }}>
                NYC DAY TRIP EXPLORER
              </Text>
              <Text variant="headlineLarge" style={styles.title}>
                Find your next escape.
              </Text>
              <Text
                variant="bodyLarge"
                style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
              >
                Fresh air, small towns, and memorable days — all within reach.
              </Text>
            </View>
            <SearchBar value={search} onChangeText={setSearch} />
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Browse by mood
            </Text>
            <CategoryFilter selected={category} onSelect={setCategory} includeAll />
            <View style={styles.resultsRow}>
              <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant }}>
                {filtered.length} {filtered.length === 1 ? 'destination' : 'destinations'}
              </Text>
              <Text variant="labelMedium" style={{ color: theme.colors.primary }}>
                From NYC
              </Text>
            </View>
          </View>
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
            title="No destinations found"
            message="Try another search or browse every category."
            actionLabel="Clear filters"
            onAction={() => {
              setSearch('');
              setCategory('All');
            }}
          />
        }
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({ safe: { flex: 1 }, list: { paddingHorizontal: 18, paddingBottom: 28 }, heading: { paddingTop: 20, paddingBottom: 18 }, title: { fontWeight: '700', marginTop: 8, letterSpacing: -0.6 }, subtitle: { marginTop: 8, lineHeight: 23 }, sectionTitle: { marginTop: 22, marginBottom: 8, fontWeight: '700' }, resultsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 22, marginBottom: 10 }, columns: { gap: 12 } });
