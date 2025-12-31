# Progress: SubTracker

## What Works ✅

- **Subscription CRUD**: Add, view, delete subscriptions
- **Payment Confirmation**: Confirm payments and set next date
- **Price Updates**: Edit subscription amount inline
- **Categories**: Predefined categories with icons
- **Local Storage**: SQLite persistence across sessions
- **Notifications**: Scheduled reminders 1 day before payment
- **App Launch Sync**: Notifications rescheduled on startup

## Pending 🔄

- [ ] APK build and physical device testing
- [ ] Notification sound/vibration settings
- [ ] Payment history screen

## Known Issues ⚠️

- Notifications won't work in Expo Go (need dev build)
- Large icon file (5MB) - could be optimized

## Evolution History

| Date       | Milestone                              |
| ---------- | -------------------------------------- |
| 2026-01-01 | Notification system refactored         |
| 2026-01-01 | EAS build configuration added          |
| 2026-01-01 | Memory bank created                    |
| Initial    | Core subscription tracking implemented |
