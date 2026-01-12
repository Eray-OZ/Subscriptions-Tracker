# Release Fixes & Improvements

## 🚨 Critical Bugs

### 1. Widget Missing in APK

**Issue:** User reports the Android widget is not appearing in the widget picker after installing the Release APK.
**Potential Causes:**

- `AndroidManifest.xml` issues (exported="false", missing intent filters).
- ProGuard/R8 obfuscation stripping widget classes.
- Launcher cache issues.

**Action Plan:**

- [ ] Check `AndroidManifest.xml` for `<receiver>` configuration.
- [ ] Check `proguard-rules.pro` to ensure widget classes are kept.
- [ ] Verify `exported="true"`.

---

## 🛠 Feature Requests

### 2. Sort Subscriptions by Date

**Req:** Subscriptions should be sorted by "closest payment date" first (Top of list = Next to pay).
**Current Behavior:** Likely sorted by ID or creation order.
**Action Plan:**

- [ ] Update `app/index.jsx` or `useSubscriptions` hook to sort the list by `next_payment_date`.
- [ ] Ensure `daysLeft` calculation is used for sorting.

### 3. Redesign Summary Card

**Req:** "Change summary card feature but dont know what are we gonna do".
**Current State:**

- Shows Total/Monthly/Yearly toggle.
- Shows a "Total Expenses" gradient card.
  **Brainstorming Needed:**
- Maybe show "Safe to Spend"?
- Breakdown by Category?
- Comparison to last month?
  **Action Plan:**
- [ ] Propose 3 alternative designs to the user.

---

### 4. Fix Default Expo Splash Screen

**Issue:** User reports the default Expo loading animation is visible on startup in the release build.
**Goal:** Ensure a seamless splash screen experience (custom icon/color only, no generic "Expo" spinner).
**Action Plan:**

- [ ] Check `app.json` splash configuration.
- [ ] Verify `SplashScreen.preventAutoHideAsync()` usage in `_layout.jsx`.
- [ ] Ensure `SplashScreen.hideAsync()` is called only when resources are ready.

---

---

### 5. Fix Notification Icon

**Issue:** User reports the notification icon is the "old icon".
**Cause:** Likely `app.json` pointing to an old asset or Android using the default fallback.
**Action Plan:**

- [ ] Check `app.json` `notification.icon` path.
- [ ] Verify the image at `./assets/images/notification-icon.png` is the _new_ one.
- [ ] If needed, separate "monochrome" icon for Android requirements.

---

## 📝 Documentation

- [ ] Update `plans/PLANS.md` with this new file.
