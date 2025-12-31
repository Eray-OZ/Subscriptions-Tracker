import * as Notifications from 'expo-notifications';

/**
 * Configure how notifications are handled when the app is in the foreground
 */
export const setupNotificationHandler = () => {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
        }),
    });
};

/**
 * Request notification permissions from the user
 * @returns {Promise<boolean>} Whether permissions were granted
 */
export const requestNotificationPermissions = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    return finalStatus === 'granted';
};

/**
 * Schedule a notification for a subscription payment reminder
 * @param {number} id - Subscription ID
 * @param {string} name - Subscription name
 * @param {Date|string} paymentDate - Next payment date
 */
export const scheduleSubscriptionNotification = async (id, name, paymentDate) => {
    const triggerDate = new Date(paymentDate);
    triggerDate.setDate(triggerDate.getDate() - 1);
    triggerDate.setHours(9);
    triggerDate.setMinutes(0);
    triggerDate.setSeconds(0);

    // Don't schedule if the trigger date is in the past
    if (triggerDate <= new Date()) {
        return null;
    }

    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Subscription Reminder 💳",
            body: `Your ${name} subscription is due tomorrow.`,
        },
        trigger: {
            type: 'date',
            date: triggerDate,
        },
        identifier: `subscription-${id}`
    });

    return `subscription-${id}`;
};

/**
 * Cancel a scheduled notification for a subscription
 * @param {number} id - Subscription ID
 */
export const cancelSubscriptionNotification = async (id) => {
    await Notifications.cancelScheduledNotificationAsync(`subscription-${id}`);
};

/**
 * Reschedule notifications for all subscriptions
 * Call this on app launch to ensure notifications are up to date
 * @param {Array} subscriptions - Array of subscription objects with id, name, and next_payment_date
 */
export const rescheduleAllNotifications = async (subscriptions) => {
    // Cancel all existing scheduled notifications first
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Schedule notifications for each subscription
    for (const sub of subscriptions) {
        try {
            await scheduleSubscriptionNotification(sub.id, sub.name, sub.next_payment_date);
        } catch (error) {
            console.error(`Failed to schedule notification for ${sub.name}:`, error);
        }
    }
};
