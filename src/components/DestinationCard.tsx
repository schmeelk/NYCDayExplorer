import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { getDestinationImage } from '@/src/data/destinations';
import { FavoriteButton } from '@/src/components/FavoriteButton';
import type { Destination } from '@/src/types/destination';
export function DestinationCard({ destination, onPress }: { destination: Destination; onPress: () => void }) {
  const theme = useTheme();
  return (
    <View style={styles.pressable}>
      <Card mode="contained" style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <View>
          <Pressable onPress={onPress} accessibilityLabel={'Open ' + destination.name} style={({ pressed }) => pressed && styles.pressed}>
            <Image source={getDestinationImage(destination.imageUrl)} style={styles.image} resizeMode="cover" />
          </Pressable>
          <View style={styles.favorite}><FavoriteButton destinationId={destination.id} size={20} /></View>
          <View style={[styles.category, { backgroundColor: theme.colors.surface }]}><Text variant="labelSmall" style={{ color: theme.colors.primary }}>{destination.category.toUpperCase()}</Text></View>
        </View>
        <Pressable onPress={onPress} accessibilityLabel={'Open ' + destination.name} style={({ pressed }) => [styles.contentPressable, pressed && styles.pressed]}>
          <Card.Content style={styles.content}>
            <Text variant="titleMedium" numberOfLines={1} style={styles.name}>{destination.name}</Text>
            <View style={styles.metaRow}>
              <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>{destination.travelTimeMinutes} min</Text>
              <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>{'From $' + destination.estimatedCost}</Text>
            </View>
          </Card.Content>
        </Pressable>
      </Card>
    </View>
  );
}
const styles = StyleSheet.create({ pressable: { flex: 1, marginBottom: 14 }, contentPressable: { flex: 1 }, pressed: { opacity: 0.88 }, card: { borderRadius: 18, overflow: 'hidden', elevation: 1 }, image: { width: '100%', height: 148 }, favorite: { position: 'absolute', right: 12, top: 12, zIndex: 2 }, category: { position: 'absolute', left: 12, bottom: -11, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 }, content: { paddingTop: 19, paddingBottom: 14 }, name: { fontWeight: '700' }, metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 } });
