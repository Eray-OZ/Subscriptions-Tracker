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

- [ ] Fix Android widget display issue
- [ ] APK build and physical device testing
- [ ] Notification sound/vibration settings
- [ ] Payment history screen

## Known Issues ⚠️

- Notifications won't work in Expo Go (need dev build) ✅ Resolved
- Large icon file (5MB) - could be optimized
- Android widget appears empty (under investigation)

## Evolution History

| Date       | Milestone                              |
| ---------- | -------------------------------------- |
| 2026-01-12 | Android environment setup completed    |
| 2026-01-12 | First successful Android build         |
| 2026-01-12 | Kotlin updated to 2.0.20               |
| 2026-01-12 | New Architecture enabled               |
| 2026-01-01 | Notification system refactored         |
| 2026-01-01 | EAS build configuration added          |
| 2026-01-01 | Memory bank created                    |
| Initial    | Core subscription tracking implemented |
