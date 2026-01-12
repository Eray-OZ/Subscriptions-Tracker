import { useState, useCallback, useMemo, useEffect } from "react";
import { FlatList, Text, View, TouchableOpacity, Platform } from "react-native";
import { Link, router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { getPaymentHistoryBySubscription, getPaymentHistory } from "../src/db/database";
import { styles, colors } from "../src/styles/index.js";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { isBefore, format, differenceInCalendarDays } from 'date-fns';
import { tr } from 'date-fns/locale';
import { getTranslation, getCurrency, getCategoryTranslation } from '../src/translations';
import { SubscriptionItem } from '../src/components/SubscriptionItem';
import { PaymentModal, MenuModal, HistoryModal } from '../src/components/SubscriptionModals';
import { FilterModal } from '../src/components/FilterModal';
import { SummaryCard } from '../src/components/SummaryCard';
import { useSubscriptions } from '../src/hooks/useSubscriptions';
import { useFilters } from '../src/hooks/useFilters';
import { saveLanguage, loadLanguage } from '../src/utils/language';
// So I can remove lines 15 and 24 completely.


export default function Index() {
    const [language, setLanguage] = useState('Turkish');
    
    // Data & Actions Hooks
    const { 
        subscriptions, 
        allCategories, 
        loading, 
        fetchSubscriptions, 
        handleDelete: deleteSub, 
        handleConfirmPayment: confirmPayment, 
        handleUpdatePrice: updatePrice 
    } = useSubscriptions(language);

    // Filter Hook
    const { 
        searchQuery, 
        setSearchQuery, 
        selectedCategories, 
        setSelectedCategories, 
        selectedFrequencies, 
        setSelectedFrequencies, 
        filteredSubscriptions 
    } = useFilters(subscriptions, language);

    // UI State
    const [isModalVisible, setModalVisible] = useState(false);
    const [isFilterModalVisible, setFilterModalVisible] = useState(false);
    const [selectedSubscription, setSelectedSubscription] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [newPaymentDate, setNewPaymentDate] = useState(new Date())
    const [isEditing, setIsEditing] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [newPrice, setNewPrice] = useState('')
    
    // Menu & History states
    const [isMenuVisible, setMenuVisible] = useState(false);
    const [isHistoryVisible, setHistoryVisible] = useState(false);
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [isGlobalHistory, setIsGlobalHistory] = useState(false);
    
    // Translation helper
    const t = (key) => getTranslation(language, key);


    useFocusEffect(
        useCallback(() => {
            fetchSubscriptions();
            // Load saved language preference
            loadLanguage().then(savedLang => {
                if (savedLang) setLanguage(savedLang);
            });
        }, [fetchSubscriptions])
    );

    // Save language when it changes
    useEffect(() => {
        saveLanguage(language);
    }, [language]);

    const handleDelete = async (id) => {
        await deleteSub(id);
    };

    const openModal = (subscription) => {
        setSelectedSubscription(subscription);
        setModalVisible(true);
    };


    const handlePrice = async (id) => {
        await updatePrice(id, newPrice);
        setIsEditing(false);
        setEditingId(null);
        setNewPrice('');
    }

    const handleConfirmPayment = async () => {
        if (!selectedSubscription) return;
        
        const success = await confirmPayment(selectedSubscription, newPaymentDate);
        if (success) {
            setModalVisible(false);
        }
    };


    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || newPaymentDate;
        setShowDatePicker(Platform.OS === 'ios');
        setNewPaymentDate(currentDate);
    };

    const handleLongPress = (item) => {
        setSelectedSubscription(item);
        setMenuVisible(true);
    };

    const fetchHistory = async () => {
        if (!selectedSubscription) return;
        setIsGlobalHistory(false);
        const history = await getPaymentHistoryBySubscription(selectedSubscription.id);
        setPaymentHistory(history);
        setMenuVisible(false);
        setHistoryVisible(true);
    };

    const fetchAllHistory = async () => {
        setIsGlobalHistory(true);
        const history = await getPaymentHistory();
        setPaymentHistory(history);
        setHistoryVisible(true);
    };

    const renderItem = useCallback(({ item }) => (
        <SubscriptionItem 
            item={item}
            language={language}
            onLongPress={handleLongPress}
            isEditing={isEditing}
            editingId={editingId}
            newPrice={newPrice}
            setNewPrice={setNewPrice}
            onSave={() => handlePrice(item.id)}
            onCancel={() => {
                setIsEditing(false);
                setEditingId(null);
                setNewPrice('');
            }}
        />
    ), [language, handleLongPress, isEditing, editingId, newPrice, handlePrice, setIsEditing, setEditingId, setNewPrice]);

    return (
        <View style={styles.container}>
            <PaymentModal
                visible={isModalVisible}
                onClose={() => setModalVisible(false)}
                selectedSubscription={selectedSubscription}
                newPaymentDate={newPaymentDate}
                showDatePicker={showDatePicker}
                setShowDatePicker={setShowDatePicker}
                onDateChange={onDateChange}
                onConfirm={handleConfirmPayment}
                language={language}
            />

            <MenuModal 
                visible={isMenuVisible}
                onClose={() => setMenuVisible(false)}
                selectedSubscription={selectedSubscription}
                onViewHistory={fetchHistory}
                onMarkAsPaid={() => {
                     setMenuVisible(false);
                     if (selectedSubscription) {
                         openModal(selectedSubscription);
                     }
                }}
                onEdit={() => {
                     if (selectedSubscription) {
                         setMenuVisible(false);
                         const sub = selectedSubscription;
                         router.push({
                             pathname: '/edit',
                             params: {
                                 id: sub.id,
                                 name: sub.name,
                                 amount: sub.amount,
                                 frequency: sub.frequency,
                                 nextPaymentDate: sub.next_payment_date,
                                 isTrial: sub.isTrial,
                                 trialEndDate: sub.trialEndDate,
                                 categoryId: sub.categoryId,
                                 reminderDaysBefore: sub.reminderDaysBefore,
                                 reminderHour: sub.reminderHour,
                                 reminderMinute: sub.reminderMinute,
                                 cardName: sub.cardName,
                                 language: language
                             }
                         });
                     }
                }}
                onDelete={() => {
                     if (selectedSubscription) {
                         setMenuVisible(false);
                         handleDelete(selectedSubscription.id);
                     }
                }}
                language={language}
            />

            <HistoryModal 
                visible={isHistoryVisible}
                onClose={() => setHistoryVisible(false)}
                isGlobalHistory={isGlobalHistory}
                selectedSubscription={selectedSubscription}
                paymentHistory={paymentHistory}
                language={language}
            />

            <FilterModal 
                visible={isFilterModalVisible}
                onClose={() => setFilterModalVisible(false)}
                language={language}
                setLanguage={setLanguage}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                selectedFrequencies={selectedFrequencies}
                setSelectedFrequencies={setSelectedFrequencies}
                allCategories={allCategories}
            />

            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Text style={styles.headerLabel}>{t('dashboard')}</Text>
                    <Text style={styles.headerTitle}>{t('appName')}</Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                    <Link href={{ pathname: "/calendar", params: { language } }} asChild>
                        <TouchableOpacity style={styles.searchButton}>
                            <MaterialCommunityIcons name="calendar-month" size={22} color={colors.white} />
                        </TouchableOpacity>
                    </Link>
                    <TouchableOpacity style={styles.searchButton} onPress={fetchAllHistory}>
                        <MaterialCommunityIcons name="history" size={24} color={colors.white} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.searchButton} onPress={() => setFilterModalVisible(true)}>
                        <MaterialCommunityIcons name="filter-variant" size={22} color={colors.white} />
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={filteredSubscriptions}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={5}
                removeClippedSubviews={true}
                style={styles.main}
                contentContainerStyle={{ paddingBottom: 120, flexGrow: 1 }}
                ListHeaderComponent={<SummaryCard subscriptions={filteredSubscriptions} language={language} />}
                ListEmptyComponent={
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 }}>
                        <MaterialCommunityIcons name="inbox-outline" size={80} color={colors.indigo400} />
                        <Text style={{ color: colors.slate400, fontSize: 18, marginTop: 16, fontWeight: '600' }}>
                            {t('noSubscriptions') || 'No subscriptions yet'}
                        </Text>
                        <Text style={{ color: colors.slate500, fontSize: 14, marginTop: 8, textAlign: 'center', paddingHorizontal: 40 }}>
                            {t('addFirstSubscription') || 'Tap the + button to track your first subscription'}
                        </Text>
                    </View>
                }
            />

            {/* FAB Button */}
            <View style={styles.fabContainer}>
                <Link href={{ pathname: "/add", params: { language } }} asChild>
                    <TouchableOpacity style={styles.fabButton}>
                        <MaterialCommunityIcons name="plus" size={32} color={colors.backgroundDark} />
                    </TouchableOpacity>
                </Link>
            </View>
        </View>
    );
}
