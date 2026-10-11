import React from 'react';
import { StyleSheet } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';
import * as Haptics from 'expo-haptics';
import { useFavorites } from '@/src/hooks/useFavorites';
export function FavoriteButton({ destinationId, size = 22 }: { destinationId: string; size?: number }) {
  const theme = useTheme(); const { isFavorite, toggleFavorite } = useFavorites(); const favorite = isFavorite(destinationId);
  const handlePress = async () => { await Haptics.selectionAsync(); await toggleFavorite(destinationId); };
  return <IconButton testID={'favorite-' + destinationId} accessibilityRole="button" accessibilityLabel={favorite ? 'Remove from favorites' : 'Save to favorites'} icon={favorite ? 'heart' : 'heart-outline'} iconColor={favorite ? theme.colors.primary : theme.colors.onSurface} size={size} onPress={handlePress} style={styles.button} mode="contained-tonal" containerColor={theme.colors.surface} />;
}
const styles = StyleSheet.create({ button: { margin: 0 } });
