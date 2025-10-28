import { useState, useCallback } from "react";
import { FlatList, Text, View, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { getSubscriptions, deleteSubscription } from "./db/database";
import { styles, colors } from "./styles/index.js";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { differenceInDays, isBefore } from 'date-fns';

// Helper function to get a deterministic gradient for the icons
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
        case 'Entertainment': return 'movie';
        case 'Bills': return 'receipt';
        case 'Gym': return 'dumbbell';
        case 'Others': return 'shape-outline';
        default: return 'help-circle';
    }
}

export default function Index() {
    const [subscriptions, setSubscriptions] = useState([]);

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
            fetchSubscriptions(); // Refetch subscriptions after deleting
        } catch (error) {
            console.error("Error deleting subscription", error);
        }
    };

    const renderItem = ({ item }) => {
        const today = new Date();
        const nextPaymentDate = new Date(item.next_payment_date);
        const remainingDays = differenceInDays(nextPaymentDate, today);

        let paymentStatusText = '';
        if (isBefore(nextPaymentDate, today)) {
            paymentStatusText = 'Paid?';
        } else {
            paymentStatusText = `${remainingDays} days left`;
        }

        return (
            <View style={styles.subscriptionItem}>
                <LinearGradient
                    colors={getGradientForId(item.id)}
                    style={styles.subscriptionIconContainer}
                >
                    <MaterialCommunityIcons name={getIconForCategory(item.category_name)} size={24} color="white" />
                </LinearGradient>
                <View style={styles.subscriptionInfo}>
                    <Text style={styles.subscriptionName}>{item.name}</Text>
                    <Text style={styles.subscriptionNextPayment}>Next payment: {nextPaymentDate.toLocaleDateString()}</Text>
                </View>
                <Text style={styles.subscriptionAmount}>${item.amount.toFixed(2)}</Text>
                <TouchableOpacity onPress={() => handleDelete(item.id)}><Text style={{ color: 'red' }}>Delete</Text></TouchableOpacity>
                <TouchableOpacity><Text style={{ color: 'green' }}>{paymentStatusText}</Text></TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
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
                contentContainerStyle={{ paddingBottom: 100 }} // To avoid footer overlap
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