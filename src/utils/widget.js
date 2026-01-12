import { NativeModules, Platform } from 'react-native';
import { getCurrency, getTranslation } from '../translations';

/**
 * Update the Android widget with the latest data
 * @param {Array} subscriptions - List of all subscriptions
 * @param {string} language - Current app language ('Turkish' or 'English')
 */
export const updateWidgetData = async (subscriptions, language = 'Turkish') => {
    if (Platform.OS !== 'android') return;

    const data = calculateWidgetData(subscriptions, language);
    
    try {
        if (NativeModules.WidgetModule) {
            await NativeModules.WidgetModule.updateWidgetData(JSON.stringify(data));
            console.log('[Widget] Updated successfully');
        } else {
            console.log('[Widget] WidgetModule not available - requires native build');
        }
    } catch (error) {
        console.warn('[Widget] Update failed:', error);
    }
};

/**
 * Calculate widget data from subscriptions array
 * @param {Array} subscriptions - Array of subscription objects
 * @param {string} language - Current app language
 * @returns {Object} Widget data object
 */
const calculateWidgetData = (subscriptions, language) => {
    const currencySymbol = getCurrency(language);
    
    // Get translations for widget
    const translations = {
        upcoming: getTranslation(language, 'widgetUpcoming'),
        noPayments: getTranslation(language, 'widgetNoPayments'),
        today: getTranslation(language, 'widgetToday'),
        dayChar: getTranslation(language, 'widgetDayChar'),
    };

    if (!subscriptions || subscriptions.length === 0) {
        return {
            currency: currencySymbol,
            translations,
            upcomingPayments: [],
        };
    }

    // Find upcoming payments
    const now = new Date();
    const upcomingPayments = subscriptions
        .map(sub => {
            const date = sub.isTrial && sub.trialEndDate ? new Date(sub.trialEndDate) : new Date(sub.next_payment_date);
            const diffTime = date - now;
            const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            return {
                name: sub.name,
                amount: sub.amount,
                daysLeft: daysLeft
            };
        })
        .filter(sub => sub.daysLeft >= 0)
        .sort((a, b) => a.daysLeft - b.daysLeft)
        .slice(0, 5); // Get closest 5

    return {
        currency: currencySymbol,
        translations,
        upcomingPayments
    };
};
