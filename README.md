# Subscription Tracker

Subscription Tracker is a mobile application built with React Native and Expo that helps you keep track of your subscriptions. Never miss a payment again with scheduled notifications for upcoming due dates.

## Features

- **Add and Manage Subscriptions:** Easily add new subscriptions with details like name, amount, next payment date, and category.
- **Subscription Overview:** View all your subscriptions in a clean, organized list.
- **Days Remaining:** See at a glance how many days are left until the next payment for each subscription.
- **Payment Confirmation:** Mark subscriptions as paid and set the next payment date.
- **Price Updates:** Update the price of a subscription if it changes.
- **Deletion:** Remove subscriptions you no longer need.
- **Scheduled Notifications:** Automatically receive a notification one day before a subscription payment is due.
- **Categorization:** Assign categories to your subscriptions for better organization.

## Technologies Used

- [React Native](https://reactnative.dev/) - A framework for building native apps using React.
- [Expo](https://expo.dev/) - A platform for making universal React applications.
- [Expo Router](https://expo.github.io/router/) - A file-based router for React Native and web applications.
- [Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/) - A library for using a SQLite database.
- [date-fns](https://date-fns.org/) - A modern JavaScript date utility library.
- [Expo Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/) - A library for scheduling and handling notifications.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js
- npm or yarn

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/Eray-OZ/Subscriptions-Tracker.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```

### Running the App

1. Start the Metro bundler
   ```sh
   npx expo start
   ```
2. Follow the instructions in the terminal to run the app on an Android emulator, an iOS simulator, or on your physical device using the Expo Go app.

## Project Structure

```
.
├── app/              # Main application code
│   ├── db/           # Database setup and queries
│   ├── styles/       # Styles for the screens
│   ├── add.jsx       # Screen for adding new subscriptions
│   └── index.jsx     # Main screen with the list of subscriptions
├── assets/           # Images and other static assets
└── app.json          # Expo configuration file
```