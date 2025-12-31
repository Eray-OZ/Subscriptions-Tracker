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

- Notifications fire at **9:00 AM**, one day before payment
- Each subscription has a unique notification ID (`subscription-{id}`)
- On app launch, all notifications are rescheduled to stay in sync
