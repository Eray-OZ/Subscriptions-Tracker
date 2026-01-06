# Active Context: SubTracker

## Active Context

**Current Focus:** Finalizing iOS Widget Implementation
**Recent Changes:**

- **iOS Widget:**
  - Implemented sleek, minimal dark theme.
  - Added Turkish language support involving JS-to-Native bridge updates.
  - Optimized layout for Small/Medium widgets (hiding amount on small, using fixed-width alignment).
  - Fixed initial sync reliability by forcing updates on app launch.
  - Resolved `xcodeproj` compatibility issues for CocoaPods.
- **Build Configuration:**
  - Added `eas.json` with APK preview profile
  - Created `.easignore` to speed up builds
  - Updated app icon to Gemini-generated image
  - Added Android package: `com.erayoz.subtracker`
    **Next Steps:**
- Complete final manual verification.
- Cleanup unused code/assets if any.
- Release preparation.

## Next Steps

1. Run APK build: `npx eas build -p android --profile preview`
2. Test notifications on physical device
3. Consider adding notification sound toggle
