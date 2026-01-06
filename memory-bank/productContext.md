# Product Context: SubTracker

## Problem Statement

Users often forget about recurring subscriptions until they see unexpected charges on their bank statements. This leads to:

- Unwanted charges for unused services
- Difficulty budgeting monthly expenses
- No single view of all active subscriptions

## Solution

SubTracker provides a simple, local-first mobile app to:

1. **Track all subscriptions** in one place
2. **Get reminded** before each payment is due
3. **Confirm payments** and automatically schedule the next one

## User Experience Goals

### Primary Goals

- **Simplicity**: Add a subscription in under 30 seconds
- **Reliability**: Never miss a notification for upcoming payments
- **Privacy**: All data stays on device, no account needed

### User Flow

```
Add Subscription → Set Payment Date → Receive Notification → Confirm Payment → Repeat
```

## Feature Logic

### Payment Confirmation Flow

When a subscription is past due:

1. "Confirm" button appears on the subscription card
2. User taps confirm and selects next payment date
3. Payment is recorded in history
4. New notification is scheduled for next payment

### Notification Logic

- Notifications fire based on user preference (same day, 1/2/3 days, or 1 week before)
- **Time Selection**: Users can choose a custom notification time (default: 11:30 AM)
- Each subscription has a unique notification ID (`subscription-{id}`)
- Each subscription has a unique notification ID (`subscription-{id}`)
- On app launch, all notifications are rescheduled to stay in sync

### Calendar View

- Month calendar with payment date highlights
- Tap any day to see scheduled payments
- Only shows actual next payment dates (not recurring projections)

### Android Widget

- Shows total monthly spend
- Displays next upcoming payment
- Updates automatically when app data changes

### iOS Widget

- **Status:** Completed ✅
- **Features:**
  - Displays up to 5 closest upcoming payments.
  - Minimal dark theme design for premium look.
  - Localized in English and Turkish.
  - Optimized layouts for Small (3 items) and Medium (5 items) sizes.
  - Shows name, days left (badge), and amount (Medium/Large only).
  - Deep linking to app (opens main screen).(not available in Expo Go)

### Language Support

- Turkish and English
- Language preference persists across app restarts (SecureStore)

### UI/UX Improvements

- **iOS Picker:** Replaced inline wheel with clean Modal Picker for Categories to prevent overlap.
- **Date/Time Pickers:** Standardized on Modal display for iOS.
- **Localization:** Turkish language support fully implemented across app and widgets.

### UI Polish

- Empty state with indigo inbox icon when no subscriptions
- Payment date shown on each subscription card
- Free trials excluded from summary card totals
- Improved touch feedback on cards
- Credit card style subscription cards with solid color backgrounds
- Payment proximity progress bar (white/orange/red based on days left)

### Payment Card Tracking

- Users can assign a card name (e.g., "Garanti", "Akbank") to each subscription
- Card name displays on subscription card as "CardName 0001"
- Falls back to "•••• 0001" if no card name is set
