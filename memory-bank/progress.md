# Progress: SubTracker

## What Works ✅

- **Subscription CRUD**: Add, view, delete subscriptions
- **Payment Confirmation**: Confirm payments and set next date
- **Price Updates**: Edit subscription amount inline
- **Categories**: Predefined categories with icons
- **Local Storage**: SQLite persistence across sessions
- **Notifications**: Scheduled reminders 1 day before payment
- **App Launch Sync**: Notifications rescheduled on startup
- **Android Widget**: Native Kotlin widget fully implemented (UI, Data Flow, Resizing)
- **Component Architecture**: Modular design with extracted components (Card, Item, Modals)
- **Shared Utilities**: Centralized theme and translation logic

## Pending 🔄

- [ ] Implement Custom Hooks (useSubscriptions, useFilters)
- [ ] Verify installation on physical device
- [ ] Notification sound/vibration settings

## Known Issues ⚠️

- Notifications won't work in Expo Go (need dev build) ✅ Resolved
- Large icon file (5MB) - could be optimized
- Widget density varies by launcher (optimized for standard grids)

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
