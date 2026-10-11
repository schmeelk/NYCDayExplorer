import React from 'react';
import { StyleSheet } from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';
export function SearchBar({ value, onChangeText }: { value: string; onChangeText: (value: string) => void }) { const theme = useTheme(); return <TextInput testID="destination-search" mode="outlined" value={value} onChangeText={onChangeText} placeholder="Search destinations" placeholderTextColor={theme.colors.onSurfaceVariant} left={<TextInput.Icon icon="magnify" />} right={value ? <TextInput.Icon icon="close" onPress={() => onChangeText('')} /> : undefined} style={styles.input} accessibilityLabel="Search destinations" />; }
const styles = StyleSheet.create({ input: { backgroundColor: 'transparent' } });
