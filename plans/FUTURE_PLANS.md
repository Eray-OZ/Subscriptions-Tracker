# SubTracker - Future Features

## Planned Features

### 1. 📊 Payment History

**Priority: High**

Track actual payment dates and build spending history.

**Features:**

- Record when payments are actually made
- View payment timeline per subscription
- Monthly spending reports
- Identify missed/late payments
- Compare scheduled vs actual spending

**Database Changes:**

- Create `payment_history` table
- Fields: `id`, `subscription_id`, `payment_date`, `amount`, `created_at`

**UI Changes:**

- "Payment History" tab in subscription detail view
- Timeline/calendar view
- Monthly report screen

---

### 2. 🎁 Free Trial Tracker

**Priority: High**

Help users avoid unwanted charges from trial conversions.

**Features:**

- Mark subscription as "Free Trial"
- Set trial end date
- Countdown display (e.g., "5 days left in trial")
- Notification before trial ends
- One-tap "Cancel Reminder" button
- Auto-convert to paid after trial

**Database Changes:**

- Add `is_trial` boolean to subscriptions table
- Add `trial_end_date` field

**UI Changes:**

- Trial badge on subscription cards
- Trial countdown prominently displayed
- Special styling for trial subscriptions
- Trial filter option

---

### 3. ⏰ Custom Reminder Times

**Priority: Medium**

Let users choose when they want payment reminders.

**Features:**

- Choose days before payment (1, 3, 7, 14 days)
- Multiple reminders per subscription
- Custom reminder messages
- Snooze notifications
- Different times for different subscriptions

**Database Changes:**

- Create `reminder_settings` table
- Fields: `subscription_id`, `days_before`, `custom_message`, `enabled`

**UI Changes:**

- Reminder settings in add/edit screen
- Toggle for enabling/disabling
- Custom message input

---

### 4. ⚡ Quick Actions

**Priority: Medium**

Speed up common operations with gestures.

**Features:**

- Swipe right: Edit subscription
- Swipe left: Delete subscription
- Long-press: Quick menu (Edit, Delete, Mark Paid)
- Batch selection mode
- Multi-delete
- Bulk category change

**UI Changes:**

- Swipeable subscription cards
- Action buttons revealed on swipe
- Long-press menu overlay
- Checkbox selection mode

---

### 5. 📱 Home Screen Widget

**Priority: Medium**

Quick glance at subscription info without opening app.

**Widget Types:**

- **Small**: Monthly total
- **Medium**: Monthly total + upcoming payments (next 3)
- **Large**: Full monthly breakdown by category

**Features:**

- Auto-refresh
- Tap to open app
- Dark/light theme support
- Localized (Turkish/English)

**Technical:**

- iOS: WidgetKit
- Android: App Widgets
- Requires Expo EAS build

---

### 6. 📅 Calendar View

**Priority: High**

Visual overview of upcoming payments.

**Features:**

- Month view with payment dots
- Click day to see payments
- Total spend for selected day
- Swipe between months

**UI Changes:**

- New tab or dedicated screen
- `react-native-calendars` integration

---

## Implementation Order

1. **Phase 1** (Essential)

   - [x] Payment History
   - [x] Free Trial Tracker

2. **Phase 2** (Enhanced UX)

   - [x] Custom Reminder Times
   - [x] Quick Actions

3. **Phase 3** (Ecosystem)
   - [x] Home Screen Widget

---

## Future Considerations

- Export/Backup (CSV, PDF, Cloud)
- Charts & Analytics (spending graphs)
- Price change tracking
- Shared subscription management
- Smart suggestions (cancel unused)
