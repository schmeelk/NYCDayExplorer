import React, { useState } from 'react';
import { Image, Platform, ScrollView, Share, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Divider, IconButton, Snackbar, Surface, Text, useTheme } from 'react-native-paper';
import * as Haptics from 'expo-haptics';
import { FavoriteButton } from '@/src/components/FavoriteButton';
import { getDestinationById, getDestinationImage } from '@/src/data/destinations';
import { useFavorites } from '@/src/hooks/useFavorites';

type BrowserEnvironment = {
  navigator?: {
    share?: (data: { title: string; text: string }) => Promise<void>;
    clipboard?: { writeText: (text: string) => Promise<void> };
  };
  document?: {
    body?: {
      appendChild: (element: unknown) => void;
      removeChild: (element: unknown) => void;
    };
    createElement: (tag: 'textarea') => {
      value: string;
      style: { position: string; opacity: string };
      focus: () => void;
      select: () => void;
      setSelectionRange: (start: number, end: number) => void;
    };
    execCommand?: (command: string) => boolean;
  };
};

async function copyTextInBrowser(message: string) {
  const browser = globalThis as unknown as BrowserEnvironment;
  if (browser.navigator?.clipboard?.writeText) {
    try {
      await browser.navigator.clipboard.writeText(message);
      return true;
    } catch {
      // Fall through to the older browser copy method when clipboard permission is denied.
    }
  }

  const document = browser.document;
  if (!document?.body || !document.execCommand) return false;

  const textArea = document.createElement('textarea');
  textArea.value = message;
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  textArea.setSelectionRange(0, message.length);

  const copied = document.execCommand('copy');
  document.body.removeChild(textArea);
  return copied;
}

export default function DestinationDetailsScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const destination = getDestinationById(id ?? '');
  const { isFavorite, toggleFavorite } = useFavorites();
  const [shareFeedback, setShareFeedback] = useState('');

  if (!destination) return <SafeAreaView style={[styles.center, { backgroundColor: theme.colors.background }]}><Text variant="titleLarge">Destination not found</Text><Button onPress={() => router.back()} style={styles.backButton}>Go back</Button></SafeAreaView>;
  const favorite = isFavorite(destination.id);
  const shareMessage = destination.name + ' — ' + destination.description + ' Find it in NYC Day Trip Explorer.';

  const shareDestination = async () => {
    if (Platform.OS === 'web') {
      const browser = globalThis as unknown as BrowserEnvironment;
      try {
        if (browser.navigator?.share) {
          await browser.navigator.share({ title: destination.name, text: shareMessage });
          return;
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return;
      }

      try {
        const copied = await copyTextInBrowser(shareMessage);
        setShareFeedback(copied ? 'Destination details copied to clipboard.' : 'Sharing and clipboard access are not available in this browser.');
      } catch {
        setShareFeedback('Could not copy destination details. Please try again.');
      }
      return;
    }

    try {
      await Share.share({ title: destination.name, message: shareMessage });
    } catch {
      setShareFeedback('Could not share this destination. Please try again.');
    }
  };

  const saveFromDetails = async () => {
    await Haptics.selectionAsync();
    await toggleFavorite(destination.id);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.heroWrap}>
          <Image source={getDestinationImage(destination.imageUrl)} style={styles.hero} resizeMode="cover" />
          <View style={styles.heroActions}>
            <IconButton icon="arrow-left" iconColor={theme.colors.onSurface} containerColor={theme.colors.surface} onPress={() => router.back()} accessibilityLabel="Go back" />
            <IconButton icon="share-variant" iconColor={theme.colors.onSurface} containerColor={theme.colors.surface} onPress={shareDestination} accessibilityLabel="Share destination" />
          </View>
        </View>
        <View style={styles.body}>
          <View style={styles.titleRow}>
            <View style={styles.titleCopy}>
              <Text variant="labelLarge" style={{ color: theme.colors.primary, letterSpacing: 1 }}>{destination.category.toUpperCase()}</Text>
              <Text variant="headlineLarge" style={styles.title}>{destination.name}</Text>
            </View>
            <FavoriteButton destinationId={destination.id} size={23} />
          </View>
          <Text variant="bodyLarge" style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>{destination.description}</Text>
          <Surface style={[styles.quickFacts, { backgroundColor: theme.colors.secondaryContainer }]} elevation={0}>
            <View style={styles.fact}>
              <Text variant="labelMedium" style={{ color: theme.colors.onSecondaryContainer }}>TRAVEL TIME</Text>
              <Text variant="titleMedium" style={{ color: theme.colors.onSecondaryContainer, fontWeight: '700' }}>{destination.travelTimeMinutes} min</Text>
            </View>
            <View style={[styles.fact, styles.factDivider, { borderColor: theme.colors.onSecondaryContainer + '33' }]}>
              <Text variant="labelMedium" style={{ color: theme.colors.onSecondaryContainer }}>EST. COST</Text>
              <Text variant="titleMedium" style={{ color: theme.colors.onSecondaryContainer, fontWeight: '700' }}>{'From $' + destination.estimatedCost}</Text>
            </View>
            <View style={styles.fact}>
              <Text variant="labelMedium" style={{ color: theme.colors.onSecondaryContainer }}>FAMILY FIT</Text>
              <Text variant="titleMedium" style={{ color: theme.colors.onSecondaryContainer, fontWeight: '700' }}>{destination.familyFriendlyScore}/5</Text>
            </View>
          </Surface>
          <View style={styles.details}>
            <View style={styles.detailRow}>
              <Text variant="labelLarge" style={styles.detailLabel}>Best season</Text>
              <Text variant="bodyLarge" style={styles.detailValue}>{destination.bestSeason}</Text>
            </View>
            <Divider />
            <View style={styles.detailRow}>
              <Text variant="labelLarge" style={styles.detailLabel}>Address</Text>
              <Text variant="bodyLarge" style={styles.detailValue}>{destination.address}</Text>
            </View>
          </View>
          <Button mode={favorite ? 'outlined' : 'contained'} icon={favorite ? 'heart' : 'heart-outline'} onPress={saveFromDetails} contentStyle={styles.saveButton}>{favorite ? 'Remove from favorites' : 'Save to favorites'}</Button>
          <Text variant="bodySmall" style={[styles.saveHint, { color: theme.colors.onSurfaceVariant }]}>Your saved trips stay on this device.</Text>
        </View>
      </ScrollView>
      <Snackbar visible={Boolean(shareFeedback)} onDismiss={() => setShareFeedback('')} duration={3000}>{shareFeedback}</Snackbar>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({ safe: { flex: 1 }, scroll: { paddingBottom: 30 }, center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }, backButton: { marginTop: 16 }, heroWrap: { position: 'relative' }, hero: { width: '100%', height: 265 }, heroActions: { position: 'absolute', top: 12, left: 14, right: 14, flexDirection: 'row', justifyContent: 'space-between' }, body: { padding: 20 }, titleRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }, titleCopy: { flex: 1, paddingRight: 12 }, title: { fontWeight: '700', marginTop: 7, letterSpacing: -0.6 }, description: { fontSize: 16, lineHeight: 25, marginTop: 18 }, quickFacts: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderRadius: 18, marginTop: 24 }, fact: { flex: 1, gap: 5 }, factDivider: { borderLeftWidth: 1, borderRightWidth: 1, paddingHorizontal: 12, marginHorizontal: 8 }, details: { marginTop: 22 }, detailRow: { paddingVertical: 16, gap: 6 }, detailLabel: { fontWeight: '700' }, detailValue: { lineHeight: 23 }, saveButton: { paddingVertical: 2 }, saveHint: { textAlign: 'center', marginTop: 9 } });
