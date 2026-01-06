import { requestWidgetUpdate } from 'react-native-android-widget';
import { getCurrency, getTranslation } from '../translations';
import { Platform } from 'react-native';

/**
 * Update the subscription widget with the latest data
 * @param {Array} subscriptions - List of all subscriptions
 * @param {string} language - Current app language ('Turkish' or 'English')
 */
export const updateWidgetData = async (subscriptions, language = 'Turkish') => {
    if (Platform.OS !== 'android') return;

    try {
        const currencySymbol = getCurrency(language);
        
        // Get translations for widget
        const translations = {
            upcoming: getTranslation(language, 'widgetUpcoming'),
            noPayments: getTranslation(language, 'widgetNoPayments'),
            today: getTranslation(language, 'widgetToday'),
            dayChar: getTranslation(language, 'widgetDayChar'),
        };

        // Find upcoming payments
        const now = new Date();
        const upcomingPayments = subscriptions
            .map(sub => {
                const date = sub.isTrial && sub.trialEndDate ? new Date(sub.trialEndDate) : new Date(sub.next_payment_date);
                // Calculate days left
                const diffTime = date - now;
                const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                return {
                    name: sub.name,
                    amount: sub.amount,
                    daysLeft: daysLeft,
                    date: date
                };
            })
            .filter(sub => sub.daysLeft >= 0)
            .sort((a, b) => a.daysLeft - b.daysLeft)
            .slice(0, 5) // Get closest 5
            .map(sub => ({
                name: sub.name,
                amount: sub.amount,
                daysLeft: sub.daysLeft
            }));

        await requestWidgetUpdate({
            widgetName: 'SubscriptionWidget',
            renderWidgetRequest: {
                upcomingPayments,
                translations,
                currencySymbol
            },
        });
        
        // console.log('Widget update requested successfully');
    } catch (error) {
        console.warn('Failed to update widget data:', error);
    }
};
