import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
const FAVORITES_KEY = '@nyc-day-trip-explorer/favorites';
type FavoritesContextValue = { favoriteIds: string[]; hydrated: boolean; isFavorite: (id: string) => boolean; toggleFavorite: (id: string) => Promise<void>; removeFavorite: (id: string) => Promise<void> };
const FavoritesContext = createContext<FavoritesContextValue | null>(null);
export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { const restore = async () => { try { const saved = await AsyncStorage.getItem(FAVORITES_KEY); if (saved) { const parsed: unknown = JSON.parse(saved); if (Array.isArray(parsed) && parsed.every((value) => typeof value === 'string')) setFavoriteIds(parsed); } } finally { setHydrated(true); } }; void restore(); }, []);
  const persist = useCallback(async (nextIds: string[]) => { setFavoriteIds(nextIds); await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(nextIds)); }, []);
  const toggleFavorite = useCallback(async (id: string) => { const nextIds = favoriteIds.includes(id) ? favoriteIds.filter((favoriteId) => favoriteId !== id) : [...favoriteIds, id]; await persist(nextIds); }, [favoriteIds, persist]);
  const removeFavorite = useCallback(async (id: string) => { await persist(favoriteIds.filter((favoriteId) => favoriteId !== id)); }, [favoriteIds, persist]);
  const value = useMemo(() => ({ favoriteIds, hydrated, isFavorite: (id: string) => favoriteIds.includes(id), toggleFavorite, removeFavorite }), [favoriteIds, hydrated, removeFavorite, toggleFavorite]);
  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}
export function useFavorites() { const context = useContext(FavoritesContext); if (!context) throw new Error('useFavorites must be used inside FavoritesProvider'); return context; }
