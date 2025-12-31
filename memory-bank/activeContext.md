# Active Context: SubTracker

## Current Focus

Preparing for APK build with new app icon.

## Recent Changes (2026-01-01)

### Notification System Overhaul

- Created centralized `utils/notifications.js`
- Added `expo-notifications` plugin to `app.json`
- Moved notification handler to `_layout.jsx`
- Added app launch notification rescheduling

### Build Configuration

- Added `eas.json` with APK preview profile
- Created `.easignore` to speed up builds
- Updated app icon to Gemini-generated image
- Added Android package: `com.erayoz.subtracker`

## Next Steps

1. Run APK build: `npx eas build -p android --profile preview`
2. Test notifications on physical device
3. Consider adding notification sound toggle
