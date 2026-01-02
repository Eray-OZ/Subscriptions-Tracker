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

### Language Support

- Turkish and English
- Language preference persists across app restarts (SecureStore)

### UI Polish

- Empty state with indigo inbox icon when no subscriptions
- Payment date shown on each subscription card
- Free trials excluded from summary card totals
- Improved touch feedback on cards
