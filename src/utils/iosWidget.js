import { NativeModules, Platform } from "react-native";

/**
 * Updates the iOS widget with subscription data
 * Uses App Groups to share data between main app and widget extension
 * 
 * @param {Object} data - Widget data object
 * @param {number} data.totalMonthly - Total monthly subscription spend
 * @param {string} data.currency - Currency symbol ($ or ₺)
 * @param {Object|null} data.nextPayment - Next upcoming payment info
 * @param {string} data.nextPayment.name - Subscription name
 * @param {number} data.nextPayment.amount - Payment amount
 * @param {number} data.nextPayment.daysLeft - Days until payment
 */
export const updateiOSWidget = async (data) => {
  // Only run on iOS
  if (Platform.OS !== "ios") return;

  try {
    // Check if the native module exists (only available in native builds)
    if (NativeModules.WidgetModule) {
      await NativeModules.WidgetModule.updateWidgetData(JSON.stringify(data));
      console.log("iOS widget updated successfully");
    } else {
      // Native module not available (running in Expo Go or module not linked)
      console.log("iOS WidgetModule not available - requires native build");
    }
  } catch (error) {
    console.log("iOS widget update failed:", error);
  }
};

/**
 * Calculates widget data from subscriptions array
 * 
 * @param {Array} subscriptions - Array of subscription objects
 * @param {string} currency - Currency symbol
 * @returns {Object} Widget data object
 */
export const calculateWidgetData = (subscriptions, currency) => {
  if (!subscriptions || subscriptions.length === 0) {
    return {
      totalMonthly: 0,
      currency: currency,
      nextPayment: null,
    };
  }

  // Calculate total monthly spend (normalize to monthly)
  const normalizedSubs = subscriptions
    .filter((sub) => !sub.isTrial) // Exclude trials
    .map((sub) => {
      let monthlyAmount = sub.amount;
      if (sub.frequency === "Weekly") {
        monthlyAmount = sub.amount * 4;
      } else if (sub.frequency === "Yearly") {
        monthlyAmount = sub.amount / 12;
      }
      return { ...sub, monthlyAmount };
    });

  const totalMonthly = normalizedSubs.reduce(
    (sum, sub) => sum + sub.monthlyAmount,
    0
  );

  // Find next upcoming payment
  const today = new Date();
  const upcomingSubs = subscriptions
    .map((sub) => {
      const paymentDate = sub.isTrial && sub.trialEndDate
        ? new Date(sub.trialEndDate)
        : new Date(sub.next_payment_date);
      const daysLeft = Math.ceil(
        (paymentDate - today) / (1000 * 60 * 60 * 24)
      );
      return { ...sub, paymentDate, daysLeft };
    })
    .filter((sub) => sub.daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  const nextSub = upcomingSubs[0];

  return {
    totalMonthly: Math.round(totalMonthly * 100) / 100,
    currency: currency,
    nextPayment: nextSub
      ? {
          name: nextSub.name,
          amount: nextSub.amount,
          daysLeft: nextSub.daysLeft,
        }
      : null,
  };
};
