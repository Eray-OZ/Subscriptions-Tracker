import { requestWidgetUpdate } from 'react-native-android-widget';
import { getCurrency } from '../translations';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Platform } from 'react-native';

/**
 * Update the subscription widget with the latest data
 * @param {Array} subscriptions - List of all subscriptions
 * @param {string} language - Current app language ('Turkish' or 'English')
 */
export const updateWidgetData = async (subscriptions, language = 'Turkish') => {
    if (Platform.OS !== 'android') return;

    try {
        // Calculate total monthly spend (approximate)
        let totalMonthly = 0;
        subscriptions.forEach(sub => {
            let monthlyAmount = sub.amount;
            if (sub.frequency === 'Weekly') monthlyAmount *= 4;
            if (sub.frequency === 'Yearly') monthlyAmount /= 12;
            totalMonthly += monthlyAmount;
        });

        // Find next upcoming payment
        const now = new Date();
        const futureSubs = subscriptions
            .filter(sub => {
               const date = sub.isTrial && sub.trialEndDate ? new Date(sub.trialEndDate) : new Date(sub.next_payment_date);
               return date >= now;
            })
            .sort((a, b) => {
                const dateA = a.isTrial && a.trialEndDate ? new Date(a.trialEndDate) : new Date(a.next_payment_date);
                const dateB = b.isTrial && b.trialEndDate ? new Date(b.trialEndDate) : new Date(b.next_payment_date);
                return dateA - dateB;
            });

        const nextSub = futureSubs.length > 0 ? futureSubs[0] : null;
        
        let nextPaymentName = null;
        let nextPaymentDate = null;

        if (nextSub) {
            nextPaymentName = nextSub.name;
            const date = nextSub.isTrial && nextSub.trialEndDate ? new Date(nextSub.trialEndDate) : new Date(nextSub.next_payment_date);
            nextPaymentDate = format(date, 'd MMMM', language === 'Turkish' ? { locale: tr } : {});
        }

        const currencySymbol = getCurrency(language);

        await requestWidgetUpdate({
            widgetName: 'SubscriptionWidget',
            renderWidgetRequest: {
                totalMonthly: totalMonthly.toFixed(2),
                nextPaymentName,
                nextPaymentDate,
                currencySymbol
            },
        });
        
        console.log('Widget update requested successfully');
    } catch (error) {
        console.warn('Failed to update widget data:', error);
    }
};
