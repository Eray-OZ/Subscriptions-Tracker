import { NativeModules, Platform } from "react-native";
import { getCurrency, getTranslation } from "../translations";

/**
 * Updates the iOS widget with subscription data
 * Uses App Groups to share data between main app and widget extension
 * 
 * @param {Object} data - Widget data object
 */
export const updateiOSWidget = async (data) => {
  // Only run on iOS
  if (Platform.OS !== "ios") {
    return;
  }

  try {
    // Check if the native module exists (only available in native builds)
    if (NativeModules.WidgetModule) {
      await NativeModules.WidgetModule.updateWidgetData(JSON.stringify(data));
    }
  } catch (error) {
    console.error("iOS widget update failed:", error);
  }
};

/**
 * Calculates widget data from subscriptions array
 * 
 * @param {Array} subscriptions - Array of subscription objects
 * @param {string} language - Current app language
 * @returns {Object} Widget data object
 */
export const calculateWidgetData = (subscriptions, language) => {
  const currency = getCurrency(language);
  
  // Get translations for widget
  const translations = {
    upcoming: getTranslation(language, 'widgetUpcoming'),
    noPayments: getTranslation(language, 'widgetNoPayments'),
    today: getTranslation(language, 'widgetToday'),
    dayChar: getTranslation(language, 'widgetDayChar'),
  };

  if (!subscriptions || subscriptions.length === 0) {
    return {
      currency,
      translations,
      upcomingPayments: [],
    };
  }

  // Calculate upcoming payments (closest 5)
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
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 5); // Get closest 5

  return {
    currency,
    translations, // Pass translations to native side
    upcomingPayments: upcomingSubs.map(sub => ({
      name: sub.name,
      amount: sub.amount,
      daysLeft: sub.daysLeft,
    })),
  };
};
