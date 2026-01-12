# Test Strategy & Plans

## Goal

Establish a robust testing pipeline to ensure app stability, focusing on core logic (calculations) and critical user flows (add/edit subscription).

## 1. Unit Testing (Jest)

**Focus:** Pure logic, hooks, and utility functions.

- [ ] **Setup Jest**

  - Install `jest-expo`, `jest`, `@testing-library/react-native`.
  - Configure `jest.config.js`.

- [ ] **Test Utilities**

  - `src/utils/calculations.js` (if extracted): Verify annual/monthly cost logic.
  - `src/utils/notifications.js`: Verify scheduling logic (mocking `expo-notifications`).

- [ ] **Test Hooks**
  - `useSubscriptions`: Mock DB and verify state updates (CRUD).
  - `useFilters`: Verify filtering sorting logic (especially the new "Closest Date" sort).

## 2. Integration Testing (RNTL)

**Focus:** Component interactions and rendering.

- [ ] **Subscription Item**

  - Verify "Price" display matches inputs.
  - Verify "Save/Cancel" buttons work in edit mode.

- [ ] **Summary Card**

  - Verify "Total" vs "Monthly" toggle updates the displayed numbers.

- [ ] **Modals**
  - Verify `FilterModal` applies filters when "Apply" is pressed.

## 3. E2E Testing (Maestro / Detox)

**Focus:** Full user flows on simulator/device.

- [ ] **Flow: Create Subscription**

  1. Open App -> Tap FAB (+).
  2. Fill form (Netflix, $15.99).
  3. Save.
  4. Verify "Netflix" appears in list.

- [ ] **Flow: Edit Subscription**
  1. Long press item -> Edit.
  2. Change price.
  3. Save.
  4. Verify change is persisted.

## Recommended Tooling

- **Unit/Integration:** `jest` + `@testing-library/react-native` (Standard for RN).
- **E2E:** `Maestro` (Simpler setup, generic YAML flows) OR `Detox` (Grey box, faster but harder setup). **Recommendation: Maestro.**
