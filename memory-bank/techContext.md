# Tech Context: SubTracker

## Technology Stack

| Layer         | Technology                  | Version |
| ------------- | --------------------------- | ------- |
| Framework     | Expo (React Native)         | SDK ~54 |
| Navigation    | Expo Router                 | ~6.0    |
| Database      | Expo SQLite                 | ~16.0   |
| Notifications | Expo Notifications          | ~0.32   |
| Animations    | Reanimated                  | ~4.1    |
| Date Handling | date-fns                    | ^4.1    |
| Calendar      | react-native-calendars      | latest  |
| Storage       | expo-secure-store           | latest  |
| Widget        | react-native-android-widget | ^0.17   |
| Build         | EAS Build                   | Managed |

## Dependencies

### Core

```json
{
  "expo": "~54.0.20",
  "react": "19.1.0",
  "react-native": "0.81.5",
  "expo-sqlite": "~16.0.8",
  "expo-notifications": "~0.32.12",
  "expo-router": "~6.0.13",
  "date-fns": "^4.1.0"
}
```

### UI/Navigation

- `expo-linear-gradient` - Gradient backgrounds
- `@expo/vector-icons` - Material Community Icons
- `@react-native-community/datetimepicker` - Date picker
- `@react-native-picker/picker` - Category dropdown

## Development Setup

### Requirements

- Node.js v18+
- npm or yarn
- Expo CLI (`npx expo`)
- iOS Simulator (macOS) or Android Emulator

### Commands

```bash
npm install                          # Install dependencies
npx expo start --port 8082           # Start dev server
npx expo run:ios                     # Run on iOS simulator
npx expo run:android                 # Run on Android emulator
npx eas build -p android --profile preview  # Build APK
```

## File Structure

```
Subscriptions-Tracker/
├── app/
│   ├── _layout.jsx      # Root layout, notification setup
│   ├── index.jsx        # Home screen (subscription list)
│   ├── add.jsx          # Add subscription screen
│   ├── calendar.jsx     # Calendar view screen
├── src/
│   ├── db/
│   │   └── database.js  # SQLite database operations
│   ├── utils/
│   │   ├── notifications.js  # Notification utilities
│   │   ├── widget.js         # Widget data sync
│   │   └── language.js       # Language persistence
│   ├── translations/    # i18n strings (TR/EN)
│   ├── styles/          # Component styles
│   └── components/      # Reusable components
├── widget/              # Android widget components
├── assets/              # Images, icons
├── memory-bank/         # Project documentation
├── app.json             # Expo config
├── eas.json             # EAS Build config
└── package.json
```

## Database Schema

```sql
Categories (id, name)
Subscriptions (id, name, amount, nextPaymentDate, categoryId)
PaymentHistory (id, subscriptionId, name, amount, paymentDate, categoryId)
```

## Constraints

- Expo managed workflow (no native code modifications)
- iOS 13+ and Android API 21+ support
- Local storage only (no cloud sync)
- Push notifications limited in Expo Go (use dev build)
