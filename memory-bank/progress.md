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
- **Custom Hooks**: Refactored logic into `useSubscriptions` and `useFilters`
- **Performance**: Database indexing and memoized components

- **Calendar View**: Monthly overview with payment dots and daily details
- **Notification Reliability**: Reschedule-on-launch strategy implemented
- **Reliability Plans**: Documented in `plans/NOTIFICATION_RELIABILITY_PLANS.md`
- **Plans Index**: Master index created at `plans/PLANS.md`
- **Release Build**: Successful Production APK build (New Arch enabled)
- **Repo Health**: Optimized `.gitignore` to exclude heavy build artifacts

## Pending 🔄

- [ ] Verify installation on physical device
- [ ] Customizable Icons & Colors (Future)

## Known Issues ⚠️

- Notifications won't work in Expo Go (need dev build) ✅ Resolved
- Large icon file (5MB) - could be optimized
- Widget density varies by launcher (optimized for standard grids)

## Evolution History

| Date       | Milestone                              |
| ---------- | -------------------------------------- |
| 2026-01-12 | Android environment setup completed    |
| 2026-01-12 | Release APK built successfully         |
| 2026-01-12 | Repository size optimized              |
| 2026-01-12 | First successful Android build         |
| 2026-01-12 | Kotlin updated to 2.0.20               |
| 2026-01-12 | New Architecture enabled               |
| 2026-01-01 | Notification system refactored         |
| 2026-01-01 | EAS build configuration added          |
| 2026-01-01 | Memory bank created                    |
| Initial    | Core subscription tracking implemented |
