# NYC Day Trip Explorer

A complete local-first Expo mobile app for discovering day trips from New York City.

## Features

- Explore 13 NYC-area destinations with local sample data
- Search by destination, category, or address
- Filter by Nature, Beach, History, Family, and Small Town
- View travel time, cost, family friendliness, address, and best season
- Save and remove favorites with AsyncStorage persistence
- Build recommendations from budget, available hours, and category
- Native share action on destination details
- Light and dark Material 3 themes that follow device appearance
- Responsive layouts and accessible labels

## Run locally

1. Install dependencies with npm install or pnpm install.
2. Start Expo with npx expo start.
3. Open the QR code in Expo Go, or use an Android emulator.

## Project structure

- app/ — Expo Router screens and tab navigation
- src/components/ — reusable destination, search, filter, favorite, and empty-state UI
- src/data/ — local destination dataset and image assets
- src/hooks/ — AsyncStorage-backed favorites state
- src/theme/ — React Native Paper Material 3 themes
- src/types/ — TypeScript domain types
