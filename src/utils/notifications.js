import * as Notifications from 'expo-notifications';
import Constants, { ExecutionEnvironment } from 'expo-constants';

// Check if running in Expo Go (notifications won't work there since SDK 53)
const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

/**
 * Configure how notifications are handled when the app is in the foreground
 */
export const setupNotificationHandler = () => {
    try {
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: false,
            }),
        });
    } catch (error) {
        if (!isExpoGo) {
            console.warn('Failed to setup notification handler:', error);
        }
    }
};

/**
 * Request notification permissions from the user
 * @returns {Promise<boolean>} Whether permissions were granted
 */
export const requestNotificationPermissions = async () => {
    if (isExpoGo) {
        return false;
    }

    try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        return finalStatus === 'granted';
    } catch (error) {
        console.warn('Failed to request notification permissions:', error);
        return false;
    }
};

/**
 * Schedule a notification for a subscription payment reminder
 * @param {number} id - Subscription ID
 * @param {string} name - Subscription name
 * @param {Date|string} paymentDate - Next payment date
 */
export const scheduleSubscriptionNotification = async (id, name, paymentDate, daysBefore = 1, hour = 11, minute = 30) => {
    if (isExpoGo) return null;

    try {
        const triggerDate = new Date(paymentDate);
        triggerDate.setDate(triggerDate.getDate() - daysBefore);
        triggerDate.setHours(hour);
        triggerDate.setMinutes(minute);
        triggerDate.setSeconds(0);

        // Don't schedule if the trigger date is in the past
        if (triggerDate <= new Date()) {
            return null;
        }

        // Dynamic message based on daysBefore
        let timeMessage;
        if (daysBefore === 0) {
            timeMessage = 'is due today';
        } else if (daysBefore === 1) {
            timeMessage = 'is due tomorrow';
        } else if (daysBefore === 7) {
            timeMessage = 'is due in one week';
        } else {
            timeMessage = `is due in ${daysBefore} days`;
        }

        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Subscription Reminder 💳",
                body: `Your ${name} subscription ${timeMessage}.`,
            },
            trigger: {
                type: 'date',
                date: triggerDate,
            },
            identifier: `subscription-${id}`
        });

        return `subscription-${id}`;
    } catch (error) {
        console.warn(`Failed to schedule notification for ${name}:`, error);
        return null;
    }
};

/**
 * Cancel a scheduled notification for a subscription
 * @param {number} id - Subscription ID
 */
export const cancelSubscriptionNotification = async (id) => {
    if (isExpoGo) return;

    try {
        await Notifications.cancelScheduledNotificationAsync(`subscription-${id}`);
    } catch (error) {
        console.warn(`Failed to cancel notification for subscription ${id}:`, error);
    }
};

/**
 * Reschedule notifications for all subscriptions
 * Call this on app launch to ensure notifications are up to date
 * @param {Array} subscriptions - Array of subscription objects with id, name, and next_payment_date
 */
export const rescheduleAllNotifications = async (subscriptions) => {
    if (isExpoGo) {
        return;
    }

    try {
        // Cancel all existing scheduled notifications first
        await Notifications.cancelAllScheduledNotificationsAsync();

        // Schedule notifications for each subscription
        for (const sub of subscriptions) {
            await scheduleSubscriptionNotification(
                sub.id, 
                sub.name, 
                sub.next_payment_date, 
                sub.reminderDaysBefore ?? 1,
                sub.reminderHour ?? 11,
                sub.reminderMinute ?? 30
            );
        }
    } catch (error) {
        console.warn('Failed to reschedule notifications:', error);
    }
};
