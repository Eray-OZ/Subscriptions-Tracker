# SubTracker Optimization Plans

## Current State Analysis

| File                  | Lines  | Notes                           |
| --------------------- | ------ | ------------------------------- |
| `app/index.jsx`       | 821    | Largest file, needs refactoring |
| `src/styles/index.js` | 793    | Style definitions               |
| `app/add.jsx`         | 236    | Add subscription screen         |
| `app/calendar.jsx`    | 221    | Calendar view                   |
| `src/db/database.js`  | 130    | SQLite operations               |
| **Total**             | ~2,200 |                                 |

---

## 1. Code Structure Improvements

### Extract Components from index.jsx

**SubscriptionCard Component:**

- Currently inline in `renderItem` function
- Should be extracted to `src/components/SubscriptionCard.jsx`
- Benefits: Cleaner code, reusable, easier to test

**FilterModal Component:**

- Filter by category and frequency
- Extract to `src/components/FilterModal.jsx`

**HistoryModal Component:**

- Payment history display
- Extract to `src/components/PaymentHistoryModal.jsx`

**ConfirmPaymentModal Component:**

- Date picker for confirming payments
- Extract to `src/components/ConfirmPaymentModal.jsx`

---

## 2. Performance Optimizations

### FlatList Optimizations

```jsx
<FlatList
  initialNumToRender={10} // Render fewer items initially
  maxToRenderPerBatch={10} // Limit batch size
  windowSize={5} // Reduce offscreen render distance
  removeClippedSubviews={true} // Unmount offscreen views (Android)
  getItemLayout={(data, index) => ({
    // Optimize scroll performance
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>
```

### Memoization

- Wrap `renderItem` with `useCallback`
- Use `React.memo` on extracted components
- Ensure `SummaryCard` dependencies are minimal

---

## 3. Bundle Size Reduction

### Unused Imports to Remove

### Unused Imports to Remove

- [x] `BrandIcon` import in index.jsx (not used since we reverted)
- [x] `react-native-svg` - Verified as USED by BrandIcon

### Check Commands

```bash
# Find unused exports
npx depcheck

# Check bundle size
npx expo export --platform android
```

---

## 4. Database Optimizations

### Add Indexes

```sql
CREATE INDEX idx_subscriptions_next_payment
ON subscriptions(next_payment_date);

CREATE INDEX idx_payment_history_sub_id
ON payment_history(subscription_id);
```

### Batch Operations

- Batch multiple updates into single transaction
- Use prepared statements for repeated queries

---

## Priority Order

1. **High Priority**
   - [x] Remove unused imports
   - [x] Add FlatList performance props
2. **Medium Priority**
   - [x] Extract SubscriptionCard component
   - [x] Extract modal components
3. **Low Priority**
   - [x] Database indexes
   - [x] Full component memoization
   - [x] Batch Operations (Implemented via `executeTransaction`)
   - [x] Bundle Analysis (Verified `react-native-svg` is used)

---

## Notes

- Always test performance changes on real device
- Use React DevTools Profiler to measure improvements
- Don't over-optimize prematurely
