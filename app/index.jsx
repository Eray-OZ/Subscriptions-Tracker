import { useState, useCallback, useMemo } from "react";
import { FlatList, Text, View, TouchableOpacity, Modal, TextInput, Platform, ScrollView } from "react-native";
import { Link } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { getSubscriptions, getCategories, deleteSubscription, addPaymentToHistory, updateSubscription, updateAmount } from "../src/db/database";
import { styles, colors } from "../src/styles/index.js";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { isBefore, format, differenceInCalendarDays } from 'date-fns';
import { tr } from 'date-fns/locale';
import DateTimePicker from '@react-native-community/datetimepicker';
import { scheduleSubscriptionNotification, cancelSubscriptionNotification } from '../src/utils/notifications';
import { getTranslation, getCurrency, getCategoryTranslation, getFrequencyAbbr } from '../src/translations';


const gradients = [
    ['#a855f7', '#6366f1'],
    ['#ec4899', '#ef4444'],
    ['#22d3ee', '#0ea5e9'],
    ['#f59e0b', '#f97316'],
    ['#10b981', '#14b8a6'],
    ['#6366f1', '#8b5cf6'],
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

        if (viewMode === 'Total') {
            // Normalize all amounts to Monthly, then display
            const normalizedSubs = subscriptions.map(sub => {
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
            filteredSubs = subscriptions.filter(sub => sub.frequency === viewMode);
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
                            <View style={styles.summaryBadgeDot} />
                            <Text style={styles.summaryBadgeText}>{currentMonth}</Text>
                        </View>
                        <View style={styles.summaryAmount}>
                            <Text style={styles.summaryAmountMain}>{getCurrency(language)}{stats.dollars}</Text>
                            <Text style={styles.summaryAmountDecimal}>.{stats.cents}</Text>
                        </View>
                        <Text style={styles.summaryLabel}>{t('totalSpend')} {stats.displayLabel}</Text>
                    </View>
                    
                    <View style={styles.summaryTrend}>
                        <View style={styles.summaryTrendIcon}>
                            <MaterialCommunityIcons name="trending-up" size={20} color={colors.indigo400} />
                        </View>
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
        }, [])
    );

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

            await scheduleSubscriptionNotification(selectedSubscription.id, selectedSubscription.name, newPaymentDate);

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
        const statusStyle = getStatusStyle(remainingDays, isPast);
        const isEditingThis = isEditing && editingId === item.id;

        return (
            <View style={styles.subscriptionItem}>
                {/* Status indicator line at bottom */}
                <View 
                    style={[
                        styles.subscriptionItemIndicator, 
                        { 
                            backgroundColor: statusStyle.color,
                            width: isPast ? '90%' : `${Math.max(10, Math.min(90, (30 - remainingDays) / 30 * 100))}%`,
                            opacity: 0.5,
                        }
                    ]} 
                />
                
                <View style={styles.itemRow}>
                    <LinearGradient
                        colors={getGradientForId(item.id)}
                        style={styles.subscriptionIconContainer}
                    >
                        <MaterialCommunityIcons name={getIconForCategory(item.category_name)} size={26} color="white" />
                    </LinearGradient>
                    
                    <View style={styles.subscriptionInfo}>
                        <View style={styles.subscriptionHeader}>
                            <Text style={styles.subscriptionName}>{item.name}</Text>
                            {!isEditingThis ? (
                                <Text style={styles.subscriptionAmount}>
                                    {getCurrency(language)}{item.amount.toFixed(2)}
                                    <Text style={styles.subscriptionFrequency}>
                                        /{getFrequencyAbbr(language, item.frequency || 'Monthly')}
                                    </Text>
                                </Text>
                            ) : (
                                <TextInput
                                    style={styles.subscriptionAmountInput}
                                    placeholder="$0.00"
                                    placeholderTextColor={colors.slate500}
                                    value={newPrice}
                                    onChangeText={setNewPrice}
                                    keyboardType="numeric"
                                    autoFocus
                                />
                            )}
                        </View>
                        
                        <Text style={styles.subscriptionMeta}>{getCategoryTranslation(language, item.category_name)} • {item.frequency ? t(item.frequency.toLowerCase()) : t('monthly')}</Text>
                        
                        <View style={styles.statusBadge}>
                            <View style={[styles.statusDot, statusStyle.dot]} />
                            <Text style={[styles.statusText, statusStyle.text]}>
                                {isPast ? t('overdue') : `${remainingDays} ${t('daysLeft')}`}
                            </Text>
                        </View>
                    </View>
                </View>
                
                <View style={styles.itemFooter}>
                    {isPast ? (
                        <TouchableOpacity style={styles.confirmPaymentButton} onPress={() => openModal(item)}>
                            <MaterialCommunityIcons name="check" size={14} color={'#fbbf24'} />
                            <Text style={styles.confirmPaymentButtonText}>{t('confirmPayment')}</Text>
                        </TouchableOpacity>
                    ) : (
                        <View />
                    )}
                    
                    <View style={styles.actionButtons}>
                        {!isEditingThis ? (
                            <TouchableOpacity 
                                style={styles.actionButton} 
                                onPress={() => { 
                                    setIsEditing(true);
                                    setEditingId(item.id);
                                    setNewPrice(item.amount.toString());
                                }}
                            >
                                <MaterialCommunityIcons name="pencil" size={14} color={colors.slate300} />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity 
                                style={[styles.actionButton, { backgroundColor: 'rgba(99, 102, 241, 0.2)' }]} 
                                onPress={() => handlePrice(item.id)}
                            >
                                <MaterialCommunityIcons name="check" size={14} color={colors.indigo400} />
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity 
                            style={styles.actionButton} 
                            onPress={() => handleDelete(item.id)}
                        >
                            <MaterialCommunityIcons name="delete" size={14} color={colors.red400} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

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

            {/* Filter Modal */}
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
                <TouchableOpacity style={styles.searchButton} onPress={() => setFilterModalVisible(true)}>
                    <MaterialCommunityIcons name="filter-variant" size={22} color={colors.white} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={filteredSubscriptions}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                style={styles.main}
                contentContainerStyle={{ paddingBottom: 120 }}
                ListHeaderComponent={<SummaryCard subscriptions={filteredSubscriptions} language={language} />}
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
