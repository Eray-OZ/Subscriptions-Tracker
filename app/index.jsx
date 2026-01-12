import { useState, useCallback, useMemo, useEffect } from "react";
import { FlatList, Text, View, TouchableOpacity, Modal, TextInput, Platform, ScrollView } from "react-native";
import { Link, router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { getSubscriptions, getCategories, deleteSubscription, addPaymentToHistory, updateSubscription, updateAmount, getPaymentHistoryBySubscription, getPaymentHistory } from "../src/db/database";
import { styles, colors } from "../src/styles/index.js";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { isBefore, format, differenceInCalendarDays } from 'date-fns';
import { tr } from 'date-fns/locale';
import DateTimePicker from '@react-native-community/datetimepicker';
import { scheduleSubscriptionNotification, cancelSubscriptionNotification } from '../src/utils/notifications';
import { updateWidgetData } from "../src/utils/widget";
import { updateiOSWidget, calculateWidgetData } from "../src/utils/iosWidget";
import { getTranslation, getCurrency, getCategoryTranslation, getFrequencyAbbr } from '../src/translations';
import { BrandIcon } from '../src/components/BrandIcon';
import { saveLanguage, loadLanguage } from '../src/utils/language';



// Medium-dark, muted colors for cards
const gradients = [
    ['#2563eb', '#1d4ed8'], // Medium Blue
    ['#dc2626', '#b91c1c'], // Medium Red
    ['#059669', '#047857'], // Medium Emerald
    ['#d97706', '#b45309'], // Medium Amber
    ['#7c3aed', '#6d28d9'], // Medium Violet
    ['#475569', '#334155'], // Medium Slate
    ['#db2777', '#be123c'], // Medium Pink
    ['#0891b2', '#0e7490'], // Medium Cyan
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

const getStatusStyle = (remainingDays, isPast) => {
    if (isPast || remainingDays <= 2) {
        return { dot: styles.statusDotUrgent, text: styles.statusTextUrgent, color: colors.red500 };
    } else if (remainingDays <= 7) {
        return { dot: styles.statusDotWarning, text: styles.statusTextWarning, color: '#f59e0b' };
    } else if (remainingDays <= 14) {
        return { dot: styles.statusDotGood, text: styles.statusTextGood, color: colors.emerald500 };
    }
    return { dot: styles.statusDotNeutral, text: styles.statusTextNeutral, color: colors.slate500 };
};

// Summary Card Component
const SummaryCard = ({ subscriptions, language }) => {
    const [viewMode, setViewMode] = useState('Total'); // 'Weekly', 'Monthly', 'Yearly', 'Total'
    const t = (key) => getTranslation(language, key);

    const stats = useMemo(() => {
        let displayTotal = 0;
        let displayLabel = 'spend';
        let filteredSubs = [];

        // Filter out free trials from calculations
        const paidSubscriptions = subscriptions.filter(sub => !sub.isTrial);

        if (viewMode === 'Total') {
            // Normalize all amounts to Monthly, then display
            const normalizedSubs = paidSubscriptions.map(sub => {
                let monthlyAmount = sub.amount;
                if (sub.frequency === 'Weekly') monthlyAmount = sub.amount * 4.33;
                else if (sub.frequency === 'Yearly') monthlyAmount = sub.amount / 12;
                return {
                    ...sub,
                    normalizedAmount: monthlyAmount
                };
            });
            displayTotal = normalizedSubs.reduce((sum, sub) => sum + sub.normalizedAmount, 0);
            filteredSubs = normalizedSubs;
            displayLabel = t('monthlySpendTotal');
        } else {
            // Filter by frequency and show raw amounts
            filteredSubs = paidSubscriptions.filter(sub => sub.frequency === viewMode);
            displayTotal = filteredSubs.reduce((sum, sub) => sum + sub.amount, 0);
            displayLabel = viewMode === 'Weekly' ? t('weeklySpend') : viewMode === 'Monthly' ? t('monthlySpend') : t('yearlySpend');
        }

        const count = filteredSubs.length;
        const avg = count > 0 ? displayTotal / count : 0;
        
        // Calculate highest in the filtered set
        let highestSub = null;
        let highestAmount = 0;
        
        filteredSubs.forEach(sub => {
            const amount = viewMode === 'Total' ? sub.normalizedAmount : sub.amount;
            if (amount > highestAmount) {
                highestAmount = amount;
                highestSub = sub;
            }
        });

        const [dollars, cents] = displayTotal.toFixed(2).split('.');
        
        return { total: displayTotal, dollars, cents, count, avg, highest: highestSub, highestAmount, displayLabel };

    }, [subscriptions, viewMode, language]);




    const currentMonth = language === 'Turkish' 
        ? format(new Date(), 'MMMM yyyy', { locale: tr })
        : format(new Date(), 'MMMM yyyy');

    const renderToggle = (modeKey, displayText) => (
        <TouchableOpacity 
            style={[styles.summaryToggleBtn, viewMode === modeKey && styles.summaryToggleBtnActive]} 
            onPress={() => setViewMode(modeKey)}
        >
            <Text style={[styles.summaryToggleText, viewMode === modeKey && styles.summaryToggleTextActive]}>
                {displayText}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.summaryCardContainer}>
            <View style={styles.summaryCard}>
                {/* Gradient glow effect */}
                <View style={styles.summaryCardGradient} />
                
                <View style={styles.summaryToggleContainer}>
                    {renderToggle('Weekly', t('weekly'))}
                    {renderToggle('Monthly', t('monthly'))}
                    {renderToggle('Yearly', t('yearly'))}
                    {renderToggle('Total', t('total'))}
                </View>

                <View style={styles.summaryCardHeader}>
                    <View>
                        <View style={styles.summaryBadge}>
                            <View style={[styles.summaryBadgeDot, { backgroundColor: 'white' }]} />
                            <Text style={styles.summaryBadgeText}>{currentMonth}</Text>
                        </View>
                        <View style={styles.summaryAmount}>
                            <Text style={styles.summaryAmountMain}>{getCurrency(language)}{stats.dollars}</Text>
                            <Text style={styles.summaryAmountDecimal}>.{stats.cents}</Text>
                        </View>
                        <Text style={styles.summaryLabel}>{t('totalSpend')} {stats.displayLabel}</Text>
                    </View>
                </View>

                <View style={styles.summaryStats}>
                    <View style={styles.summaryStat}>
                        <Text style={styles.summaryStatLabel}>{t('active')}</Text>
                        <Text style={styles.summaryStatValue}>{stats.count} {t('subs')}</Text>
                    </View>
                    <View style={[styles.summaryStat, styles.summaryStatBorder]}>
                        <Text style={styles.summaryStatLabel}>{t('avg')}</Text>
                        <Text style={styles.summaryStatValue}>{getCurrency(language)}{stats.avg.toFixed(2)}</Text>
                    </View>
                    <View style={[styles.summaryStat, styles.summaryStatBorder]}>
                        <Text style={styles.summaryStatLabel}>{t('highest')}</Text>
                        <Text style={styles.summaryStatValue}>{stats.highest?.name || '-'}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};


export default function Index() {
    const [subscriptions, setSubscriptions] = useState([]);
    const [allCategories, setAllCategories] = useState([]);
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
    
    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedFrequencies, setSelectedFrequencies] = useState([]);
    const [language, setLanguage] = useState('Turkish');
    
    // Translation helper
    const t = (key) => getTranslation(language, key);


    const fetchSubscriptions = async () => {
        try {
            const data = await getSubscriptions();
            setSubscriptions(data);
            
            // Get unique categories
            const cats = await getCategories();
            setAllCategories(cats);
        } catch (error) {
            console.error("Error fetching subscriptions", error);
        }
    };
    
    // Filtered subscriptions based on search and filters
    const filteredSubscriptions = useMemo(() => {
        return subscriptions.filter(sub => {
            // Search filter
            if (searchQuery && !sub.name.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }
            
            // Category filter
            if (selectedCategories.length > 0 && !selectedCategories.includes(sub.category_name)) {
                return false;
            }
            
            // Frequency filter
            if (selectedFrequencies.length > 0 && !selectedFrequencies.includes(sub.frequency || 'Monthly')) {
                return false;
            }
            
            return true;
        });
    }, [subscriptions, searchQuery, selectedCategories, selectedFrequencies]);


    useFocusEffect(
        useCallback(() => {
            fetchSubscriptions();
            // Load saved language preference
            loadLanguage().then(savedLang => {
                if (savedLang) setLanguage(savedLang);
            });
        }, [])
    );

    // Update widget data when subscriptions list or language changes
    useEffect(() => {
        // Always upate widget to ensure language/empty state is synced
        // Android widget
        updateWidgetData(subscriptions, language);
        // iOS widget
        const iosData = calculateWidgetData(subscriptions, language);
        updateiOSWidget(iosData);
    }, [subscriptions, language]);

    // Save language when it changes
    useEffect(() => {
        saveLanguage(language);
    }, [language]);

    const handleDelete = async (id) => {
        try {
            await deleteSubscription(id);
            await cancelSubscriptionNotification(id);
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
        setEditingId(null)
        setNewPrice('')
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

            await scheduleSubscriptionNotification(
                selectedSubscription.id, 
                selectedSubscription.name, 
                newPaymentDate,
                selectedSubscription.reminderDaysBefore,
                selectedSubscription.reminderHour,
                selectedSubscription.reminderMinute
            );

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

    const renderItem = ({ item }) => {
        const today = new Date();
        const dateToCheck = item.isTrial && item.trialEndDate ? new Date(item.trialEndDate) : new Date(item.next_payment_date);
        const remainingDays = differenceInCalendarDays(dateToCheck, today);
        const isPast = isBefore(dateToCheck, today);
        const isEditingThis = isEditing && editingId === item.id;
        
        return (
            <TouchableOpacity 
                style={styles.subscriptionItem}
                activeOpacity={0.9}
                onLongPress={() => handleLongPress(item)}
                delayLongPress={200}
                onPress={() => handleLongPress(item)} // Single tap now shows menu too
            >
                <LinearGradient
                    colors={getGradientForId(item.id)}
                    style={styles.subscriptionItemGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    {/* Top Row: Icon + Trial Badge + Amount */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                         <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                             <View style={{ 
                                 backgroundColor: 'rgba(255,255,255,0.25)', 
                                 borderRadius: 12, 
                                 padding: 8,
                                 backdropFilter: 'blur(10px)' 
                             }}>
                                <BrandIcon name={item.name} category={item.category_name} size={28} color="white" />
                             </View>
                             {item.isTrial ? (
                                <View style={{ backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
                                    <Text style={{ fontSize: 10, fontWeight: '800', color: '#7c3aed' }}>{t('trial').toUpperCase()}</Text>
                                </View>
                             ) : null}
                         </View>
                         
                         {!isEditingThis ? (
                             <Text style={{ fontSize: 24, fontWeight: '800', color: 'white', letterSpacing: -1 }}>
                                {getCurrency(language)}{item.amount.toFixed(2)}
                             </Text>
                         ) : (
                            <TextInput
                                style={styles.subscriptionAmountInput}
                                value={newPrice}
                                onChangeText={setNewPrice}
                                keyboardType="numeric"
                                autoFocus
                            />
                         )}
                    </View>

                    {/* Middle: Name and Category (Moved here) */}
                    <View style={{ flex: 1, justifyContent: 'center', paddingTop: 24 }}>
                         <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 }}>
                            {getCategoryTranslation(language, item.category_name)}
                        </Text>
                        <Text style={{ fontSize: 22, fontWeight: '700', color: 'white', letterSpacing: 0.5, textShadowColor: 'rgba(0,0,0,0.2)', textShadowRadius: 4 }}>
                            {item.name}
                        </Text>
                    </View>

                    {/* Bottom Row: Card Name + ID + Date */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                         {/* Card Name or ID */}
                        <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, letterSpacing: item.cardName ? 1 : 3, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' }}>
                            {item.cardName 
                                ? `${item.cardName} ${item.id ? item.id.toString().padStart(4, '0').slice(-4) : '0000'}` 
                                : `•••• ${item.id ? item.id.toString().padStart(4, '0').slice(-4) : '0000'}`}
                        </Text>

                        <View style={{ alignItems: 'flex-end' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
                                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 8, fontWeight: '600' }}>
                                    {isPast ? 'OVERDUE' : 'EXP'}
                                </Text>
                                <Text style={{ fontSize: 12, fontWeight: '700', color: 'white' }}>
                                    {format(dateToCheck, 'dd/MM')}
                                </Text>
                            </View>

                            {/* Days Left Badge */}
                            <View style={{ 
                                backgroundColor: isPast ? 'rgba(239, 68, 68, 0.9)' : 'rgba(255,255,255,0.2)', 
                                paddingHorizontal: 8, 
                                paddingVertical: 2, 
                                borderRadius: 8, 
                                marginTop: 4 
                            }}>
                                <Text style={{ fontSize: 10, fontWeight: 'bold', color: 'white' }}>
                                    {remainingDays < 0 
                                        ? `${Math.abs(remainingDays)} ${t('daysOverdue').toUpperCase()}`
                                        : `${remainingDays} ${t('daysLeft').toUpperCase()}`
                                    }
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Progress Bar (Payment Proximity) */}
                    <View style={{ 
                        height: 4, 
                        backgroundColor: 'rgba(255,255,255,0.2)', 
                        borderRadius: 2, 
                        marginTop: 16, 
                        overflow: 'hidden' 
                    }}>
                        <View style={{ 
                            height: '100%', 
                            width: `${Math.max(5, Math.min(100, ((30 - remainingDays) / 30) * 100))}%`, 
                            backgroundColor: (() => {
                                if (item.isTrial) return '#ffffff';
                                const gradient = getGradientForId(item.id);
                                const isRedCard = gradient[0] === '#dc2626';
                                const isAmberCard = gradient[0] === '#d97706';
                                
                                if (remainingDays <= 3) {
                                    // Urgent (Red): Use White on Red cards, Red otherwise
                                    return isRedCard ? '#ffffff' : '#ef4444';
                                } else if (remainingDays <= 7) {
                                    // Warning (Orange): Use White on Amber cards, Orange otherwise
                                    return isAmberCard ? '#ffffff' : '#f59e0b';
                                }
                                return '#ffffff';
                            })(),
                            borderRadius: 2
                        }} />
                    </View>
                </LinearGradient>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <Modal
                animationType="fade"
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

            {/* Menu Modal (Long Press) */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={isMenuVisible}
                onRequestClose={() => setMenuVisible(false)}
            >
                <TouchableOpacity 
                    style={styles.modalOverlay} 
                    activeOpacity={1} 
                    onPress={() => setMenuVisible(false)}
                >
                    <View style={styles.menuModalContent}>
                        <Text style={styles.menuModalTitle}>{selectedSubscription?.name}</Text>
                        
                        <TouchableOpacity style={styles.menuOption} onPress={fetchHistory}>
                            <MaterialCommunityIcons name="history" size={24} color={colors.primary} />
                            <Text style={styles.menuOptionText}>{t('viewHistory')}</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={styles.menuOption} 
                            onPress={() => { 
                                setMenuVisible(false); 
                                if (selectedSubscription) {
                                    openModal(selectedSubscription); 
                                }
                            }}
                        >
                            <MaterialCommunityIcons name="check-circle-outline" size={24} color={colors.emerald500} />
                            <Text style={styles.menuOptionText}>{t('markAsPaid')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.menuOption} 
                            onPress={() => { 
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
                        >
                            <MaterialCommunityIcons name="pencil" size={24} color={colors.slate400} />
                            <Text style={styles.menuOptionText}>{t('edit')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={[styles.menuOption, { borderBottomWidth: 0 }]} 
                            onPress={() => { 
                                if (selectedSubscription) {
                                    setMenuVisible(false); 
                                    handleDelete(selectedSubscription.id); 
                                }
                            }}
                        >
                            <MaterialCommunityIcons name="delete" size={24} color={colors.red500} />
                            <Text style={[styles.menuOptionText, { color: colors.red500 }]}>{t('delete')}</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Payment History Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isHistoryVisible}
                onRequestClose={() => setHistoryVisible(false)}
            >
                <View style={styles.historyModalOverlay}>
                    <View style={styles.historyModalContainer}>
                        <View style={styles.historyModalHeader}>
                            <Text style={styles.historyModalTitle}>
                                {isGlobalHistory ? t('paymentHistory') : t('paymentHistory')}
                            </Text>
                            <TouchableOpacity onPress={() => setHistoryVisible(false)}>
                                <MaterialCommunityIcons name="close" size={24} color={colors.white} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.historySubHeader}>
                            <Text style={styles.historySubName}>
                                {isGlobalHistory ? t('allSubscriptions') : selectedSubscription?.name}
                            </Text>
                        </View>

                        <ScrollView style={styles.historyList} showsVerticalScrollIndicator={false}>
                            {paymentHistory.length === 0 ? (
                                <View style={styles.emptyHistoryContainer}>
                                    <MaterialCommunityIcons name="history" size={48} color={colors.slate700} />
                                    <Text style={styles.emptyHistoryText}>{t('noPaymentHistory')}</Text>
                                </View>
                            ) : (
                                paymentHistory.map((payment, index) => (
                                    <View key={index} style={styles.historyItem}>
                                        <View style={styles.historyItemLeft}>
                                            <MaterialCommunityIcons name="calendar-check" size={20} color={colors.emerald500} />
                                            <View style={{ marginLeft: 12 }}>
                                                {isGlobalHistory && (
                                                    <Text style={{ color: colors.white, fontWeight: 'bold', fontSize: 16, marginBottom: 4 }}>
                                                        {payment.name}
                                                    </Text>
                                                )}
                                                <Text style={[styles.historyDate, { marginLeft: 0 }]}>
                                                    {format(new Date(payment.paymentDate), 'd MMMM yyyy', language === 'Turkish' ? { locale: tr } : {})}
                                                </Text>
                                            </View>
                                        </View>
                                        <Text style={styles.historyAmount}>{getCurrency(language)}{payment.amount.toFixed(2)}</Text>
                                    </View>
                                ))
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={isFilterModalVisible}
                onRequestClose={() => setFilterModalVisible(false)}
            >
                <View style={styles.filterModalOverlay}>
                    <View style={styles.filterModalContainer}>
                        <View style={styles.filterModalHeader}>
                            <Text style={styles.filterModalTitle}>{t('filtersSettings')}</Text>
                            <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                                <MaterialCommunityIcons name="close" size={24} color={colors.white} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.filterModalContent} showsVerticalScrollIndicator={false}>
                            {/* Language Toggle */}
                            <View style={styles.filterSection}>
                                <Text style={styles.filterSectionTitle}>{t('language')}</Text>
                                <View style={styles.languageToggleContainer}>
                                    <TouchableOpacity 
                                        style={[styles.languageToggleBtn, language === 'English' && styles.languageToggleBtnActive]}
                                        onPress={() => setLanguage('English')}
                                    >
                                        <Text style={[styles.languageToggleText, language === 'English' && styles.languageToggleTextActive]}>
                                            English
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={[styles.languageToggleBtn, language === 'Turkish' && styles.languageToggleBtnActive]}
                                        onPress={() => setLanguage('Turkish')}
                                    >
                                        <Text style={[styles.languageToggleText, language === 'Turkish' && styles.languageToggleTextActive]}>
                                            Türkçe
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Search */}
                            <View style={styles.filterSection}>
                                <Text style={styles.filterSectionTitle}>{t('search')}</Text>
                                <View style={styles.filterSearchContainer}>
                                    <MaterialCommunityIcons name="magnify" size={20} color={colors.slate400} style={styles.filterSearchIcon} />
                                    <TextInput
                                        style={styles.filterSearchInput}
                                        placeholder={t('searchPlaceholder')}
                                        placeholderTextColor={colors.slate500}
                                        value={searchQuery}
                                        onChangeText={setSearchQuery}
                                    />
                                    {searchQuery.length > 0 && (
                                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                                            <MaterialCommunityIcons name="close-circle" size={18} color={colors.slate400} />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>

                            {/* Category Filter */}
                            <View style={styles.filterSection}>
                                <Text style={styles.filterSectionTitle}>{t('categories')}</Text>
                                <View style={styles.filterChipsContainer}>
                                    {allCategories.map(category => {
                                        const isSelected = selectedCategories.includes(category.name);
                                        return (
                                            <TouchableOpacity
                                                key={category.id}
                                                style={[styles.filterChip, isSelected && styles.filterChipActive]}
                                                onPress={() => {
                                                    if (isSelected) {
                                                        setSelectedCategories(selectedCategories.filter(c => c !== category.name));
                                                    } else {
                                                        setSelectedCategories([...selectedCategories, category.name]);
                                                    }
                                                }}
                                            >
                                                <Text style={[styles.filterChipText, isSelected && styles.filterChipTextActive]}>
                                                    {getCategoryTranslation(language, category.name)}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </View>

                            {/* Frequency Filter */}
                            <View style={styles.filterSection}>
                                <Text style={styles.filterSectionTitle}>{t('billingCycle')}</Text>
                                <View style={styles.filterChipsContainer}>
                                    {['Weekly', 'Monthly', 'Yearly'].map(freq => {
                                        const isSelected = selectedFrequencies.includes(freq);
                                        return (
                                            <TouchableOpacity
                                                key={freq}
                                                style={[styles.filterChip, isSelected && styles.filterChipActive]}
                                                onPress={() => {
                                                    if (isSelected) {
                                                        setSelectedFrequencies(selectedFrequencies.filter(f => f !== freq));
                                                    } else {
                                                        setSelectedFrequencies([...selectedFrequencies, freq]);
                                                    }
                                                }}
                                            >
                                                <Text style={[styles.filterChipText, isSelected && styles.filterChipTextActive]}>
                                                    {t(freq.toLowerCase())}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </View>
                        </ScrollView>

                        {/* Clear Filters Button */}
                        <View style={styles.filterModalFooter}>
                            <TouchableOpacity 
                                style={styles.clearFiltersBtn}
                                onPress={() => {
                                    setSearchQuery('');
                                    setSelectedCategories([]);
                                    setSelectedFrequencies([]);
                                }}
                            >
                                <Text style={styles.clearFiltersText}>{t('clearAllFilters')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

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
