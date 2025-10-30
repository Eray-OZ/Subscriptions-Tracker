
import { useState, useCallback } from "react";
import { FlatList, Text, View, TouchableOpacity, Modal, TextInput, Platform } from "react-native";
import { Link } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { getSubscriptions, deleteSubscription, addPaymentToHistory, updateSubscription, updateAmount } from "./db/database";
import { styles, colors } from "./styles/index.js";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { differenceInDays, isBefore, format, differenceInCalendarDays } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';


const gradients = [
    ['#a855f7', '#6366f1'],
    ['#ec4899', '#ef4444'],
    ['#22d3ee', '#0ea5e9'],
    ['#f59e0b', '#f97316'],
];

const getGradientForId = (id) => {
    return gradients[id % gradients.length];
};

const getIconForCategory = (category) => {
    switch (category) {
        case 'Bills': return 'receipt';
        case 'Movie Streaming': return 'movie';
        case 'Music': return 'music-note';
        case 'Gaming': return 'gamepad-variant';
        case 'Software': return 'code-braces';
        case 'Cloud': return 'cloud';
        case 'Reading': return 'book-open-page-variant';
        case 'Shopping': return 'cart';
        case 'Gym': return 'dumbbell';
        case 'Others': return 'shape-outline';
        default: return 'help-circle';
    }
}

const scheduleNotification = async (id, name, paymentDate) => {
    const triggerDate = new Date(paymentDate);
    triggerDate.setDate(triggerDate.getDate() - 1);
    triggerDate.setHours(22);
    triggerDate.setMinutes(55);
    triggerDate.setSeconds(0);

    console.log(`Scheduling notification for subscription ${id} at ${triggerDate}`);

                    await Notifications.scheduleNotificationAsync({

                        content: {

                            title: "Subscription Reminder",

                            body: `Your ${name} subscription is due tomorrow.`,

                        },

                        trigger: {

                            type: 'date',

                            date: triggerDate,

                        },

                        identifier: `subscription-${id}`

                    });};

export default function Index() {
    const [subscriptions, setSubscriptions] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedSubscription, setSelectedSubscription] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [newPaymentDate, setNewPaymentDate] = useState(new Date())
    const [isEditing, setIsEditing] = useState(false)
    const [newPrice, setNewPrice] = useState('')


    const fetchSubscriptions = async () => {
        try {
            const data = await getSubscriptions();
            setSubscriptions(data);
        } catch (error) {
            console.error("Error fetching subscriptions", error);
        }
    };


    useFocusEffect(
        useCallback(() => {
            fetchSubscriptions();
        }, [])
    );

    const handleDelete = async (id) => {
        try {
            await deleteSubscription(id);
            await Notifications.cancelScheduledNotificationAsync(`subscription-${id}`);
            fetchSubscriptions();
        } catch (error) {
            console.error("Error deleting subscription", error);
        }
    };

    const openModal = (subscription) => {
        setSelectedSubscription(subscription);
        setModalVisible(true);
    };


    const handlePrice = async (id) => {
        await updateAmount(id, newPrice)
        setIsEditing(false)
        fetchSubscriptions()
    }

    const handleConfirmPayment = async () => {
        if (!selectedSubscription) {
            return;
        }
        try {
            const today = new Date();

            await Promise.all([
                addPaymentToHistory(
                    selectedSubscription.id,
                    selectedSubscription.name,
                    selectedSubscription.amount,
                    format(today, 'yyyy-MM-dd'),
                    selectedSubscription.categoryId
                ),
                updateSubscription(selectedSubscription.id, format(newPaymentDate, 'yyyy-MM-dd'))
            ]);

            await scheduleNotification(selectedSubscription.id, selectedSubscription.name, newPaymentDate);

            setModalVisible(false);
            fetchSubscriptions();
        } catch (error) {
            console.error("Error confirming payment", error);
        }
    };


    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || newPaymentDate;
        setShowDatePicker(Platform.OS === 'ios');
        setNewPaymentDate(currentDate);
    };

    const renderItem = ({ item }) => {
        const today = new Date();
        const nextPaymentDate = new Date(item.next_payment_date);
        const remainingDays = differenceInCalendarDays(nextPaymentDate, today);

        const isPast = isBefore(nextPaymentDate, today);

        return (
            <View style={styles.subscriptionItem}>
                <View style={styles.itemRow}>
                    <LinearGradient
                        colors={getGradientForId(item.id)}
                        style={styles.subscriptionIconContainer}
                    >
                        <MaterialCommunityIcons name={getIconForCategory(item.category_name)} size={24} color="white" />
                    </LinearGradient>
                    <View style={styles.subscriptionInfo}>
                        <Text style={styles.subscriptionName}>{item.name}</Text>
                        <Text style={styles.subscriptionNextPayment}>Next: {nextPaymentDate.toLocaleDateString()}</Text>
                    </View>
                    {!isEditing ? <Text style={styles.subscriptionAmount}>${item.amount.toFixed(2)}</Text>
                        : <TextInput
                            style={styles.subscriptionAmountInput}
                            placeholder="$ New Price"
                            placeholderTextColor={colors.primary}
                            value={newPrice}
                            onChangeText={setNewPrice}
                            keyboardType="numeric"
                        />}

                </View>
                <View style={styles.itemFooter}>
                    {isPast ? (
                        <TouchableOpacity style={styles.confirmPaymentButton} onPress={() => openModal(item)}>
                            <MaterialCommunityIcons name="check" size={16} color={'#FFA500'} />
                            <Text style={styles.confirmPaymentButtonText}>Confirm</Text>
                        </TouchableOpacity>
                    ) : (
                        <Text style={styles.paymentStatusText}>{remainingDays} days left</Text>
                    )}
                    <View style={{ flexDirection: 'row', gap: 8 }}>

                        {!isEditing ?
                            <TouchableOpacity style={styles.updateButton} onPress={() => { setIsEditing(true) }}>
                                <MaterialCommunityIcons name="pencil" size={16} color={colors.primary} />
                                <Text style={styles.updateButtonText}>Price</Text>
                            </TouchableOpacity> :
                            <TouchableOpacity style={styles.updateButton} onPress={() => handlePrice(item.id)}>
                                <MaterialCommunityIcons name="pencil" size={16} color={colors.primary} />
                                <Text style={styles.updateButtonText}>Confirm</Text>
                            </TouchableOpacity>}

                        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                            <MaterialCommunityIcons name="delete" size={16} color={colors.red400} />
                            <Text style={styles.deleteButtonText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => {
                    setModalVisible(!isModalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Mark {selectedSubscription?.name} as paid?</Text>

                        <View style={styles.datePickerContainer}>
                            <Text style={styles.datePickerLabel}>Next Payment Date</Text>
                            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerInputContainer}>
                                <Text style={styles.datePickerInput}>{format(newPaymentDate, 'yyyy-MM-dd')}</Text>
                            </TouchableOpacity>
                            {showDatePicker && (
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={newPaymentDate}
                                    mode={"date"}
                                    is24Hour={true}
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={onDateChange}
                                />
                            )}
                        </View>

                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.confirmButton]}
                                onPress={handleConfirmPayment}
                            >
                                <Text style={styles.confirmButtonText}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Subscriptions</Text>
                <TouchableOpacity style={styles.searchButton}>
                    <MaterialCommunityIcons name="magnify" size={20} color={colors.slate100} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={subscriptions}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                style={styles.main}
                contentContainerStyle={{ paddingBottom: 100 }}
            />

            <View style={styles.footer}>
                <Link href="/add" asChild>
                    <TouchableOpacity style={styles.addButton}>
                        <MaterialCommunityIcons name="plus" size={20} color={colors.backgroundDark} />
                        <Text style={styles.addButtonText}>Add Subscription</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </View>
    );
}
