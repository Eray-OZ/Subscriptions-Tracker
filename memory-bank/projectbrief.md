# Project Brief: SubTracker

## Project Overview

A subscription tracking mobile application built with **Expo (React Native)** that helps users manage recurring payments. Features local push notifications to remind users one day before each subscription payment is due.

## Core Requirements

### Functional Requirements

1. **Subscription Management**

   - Add subscriptions with name, amount, category, and next payment date
   - View all subscriptions with payment countdown
   - Delete subscriptions
   - Update subscription price

2. **Payment Tracking**

   - Confirm payments when due
   - Set next payment date on confirmation
   - Store payment history

3. **Notifications**

   - Local push notifications 1 day before payment
   - Automatic rescheduling on app launch
   - Cancel notifications on subscription deletion

4. **Categories**
   - Pre-defined categories (Bills, Streaming, Music, Gaming, etc.)
   - Category icons and visual grouping

### Non-Functional Requirements

- Cross-platform (iOS + Android)
- Dark theme UI with gradient accents
- Local SQLite storage (offline-first)
- No authentication required (personal device)

## Project Scope

### In Scope

- Subscription CRUD operations
- Local push notifications
- Payment history tracking
- Category organization

### Out of Scope

- Cloud sync / backup
- User authentication
- Shared/family subscriptions
- Analytics dashboards

## Success Criteria

- Users can add and track multiple subscriptions
- Users receive timely payment reminders
- Subscriptions persist across app restarts
- App works fully offline
