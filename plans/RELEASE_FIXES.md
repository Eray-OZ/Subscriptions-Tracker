# Release Fixes & Improvements

## 🚨 Critical Bugs

### 1. Widget Missing in APK ✅ FIXED

**Issue:** User reports the Android widget is not appearing in the widget picker after installing the Release APK.
**Solution:** Added `<receiver>` tag to `AndroidManifest.xml` with correct intent filters and exported=true.

---

## 🛠 Feature Requests

### 2. Sort Subscriptions by Date ✅ FIXED

**Req:** Subscriptions should be sorted by "closest payment date" first (Top of list = Next to pay).
**Solution:** Implemented sorting in `useSubscriptions.js` by `next_payment_date`.

### 3. Redesign Summary Card ✅ FIXED

**Req:** Simplify Summary Card to show only essential info.
**Solution:** Removed Weekly/Monthly/Yearly toggle. Now shows: Active Subs count, Highest Sub, Total monthly spend.

---

### 4. Fix Default Expo Splash Screen ✅ FIXED

**Issue:** User reports the default Expo loading animation is visible on startup in the release build.
**Solution:** Changed `backgroundColor` from `#ffffff` (white) to `#050505` (dark) to match app theme.

---

---

### 5. Fix Notification Icon ✅ FIXED

**Issue:** User reports the notification icon is the "old icon".
**Solution:** Changed `app.json` notification.icon path from `./assets/images/notification-icon.png` to `./assets/app-icon.png`.

---

## 📝 Documentation

- [ ] Update `plans/PLANS.md` with this new file.
