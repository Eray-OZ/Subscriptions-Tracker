import { useState, useCallback, useEffect } from 'react';
import { format } from 'date-fns';
import { 
    getSubscriptions, 
    getCategories, 
    deleteSubscription, 
    addPaymentToHistory, 
    updateSubscription, 
    updateAmount,
    executeTransaction
} from '../db/database';
import { 
    scheduleSubscriptionNotification, 
    cancelSubscriptionNotification 
} from '../utils/notifications';
import { updateWidgetData } from '../utils/widget';
import { updateiOSWidget, calculateWidgetData } from '../utils/iosWidget';

// Hook to manage subscription data and actions
export const useSubscriptions = (language) => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [allCategories, setAllCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSubscriptions = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getSubscriptions();
            setSubscriptions(data);
            
            const cats = await getCategories();
            setAllCategories(cats);
        } catch (error) {
            console.error("Error fetching subscriptions", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Update widgets when subscriptions or language changes
    useEffect(() => {
        if (!loading) {
            updateWidgetData(subscriptions, language);
            const iosData = calculateWidgetData(subscriptions, language);
            updateiOSWidget(iosData);
        }
    }, [subscriptions, language, loading]);

    const handleDelete = async (id) => {
        try {
            await deleteSubscription(id);
            await cancelSubscriptionNotification(id);
            await fetchSubscriptions();
            return true;
        } catch (error) {
            console.error("Error deleting subscription", error);
            return false;
        }
    };

    const handleConfirmPayment = async (subscription, newPaymentDate) => {
        try {
            const today = new Date();
            
            await executeTransaction(async () => {
                await Promise.all([
                    addPaymentToHistory(
                        subscription.id,
                        subscription.name,
                        subscription.amount,
                        format(today, 'yyyy-MM-dd'),
                        subscription.categoryId
                    ),
                    updateSubscription(subscription.id, format(newPaymentDate, 'yyyy-MM-dd'))
                ]);
            });

            await scheduleSubscriptionNotification(
                subscription.id, 
                subscription.name, 
                newPaymentDate,
                subscription.reminderDaysBefore,
                subscription.reminderHour,
                subscription.reminderMinute
            );

            await fetchSubscriptions();
            return true;
        } catch (error) {
            console.error("Error confirming payment", error);
            return false;
        }
    };

    const handleUpdatePrice = async (id, newPrice) => {
        try {
            await updateAmount(id, newPrice);
            await fetchSubscriptions();
            return true;
        } catch (error) {
            console.error("Error updating price", error);
            return false;
        }
    };

    return {
        subscriptions,
        allCategories,
        loading,
        fetchSubscriptions,
        handleDelete,
        handleConfirmPayment,
        handleUpdatePrice
    };
};
