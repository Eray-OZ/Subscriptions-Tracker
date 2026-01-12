import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Platform, KeyboardAvoidingView, ScrollView, Switch, Modal } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { router, useLocalSearchParams } from "expo-router";
import { addSubscription, getCategories } from "../src/db/database.js";
import { styles, colors } from "../src/styles/add.js";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { scheduleSubscriptionNotification } from "../src/utils/notifications";
import { getTranslation, getCurrency, getCategoryTranslation } from "../src/translations";
import { LinearGradient } from 'expo-linear-gradient';
import { BrandIcon } from "../src/components/BrandIcon";
import { format } from 'date-fns';

export default function AddScreen() {
    const params = useLocalSearchParams();
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [frequency, setFrequency] = useState('Monthly');
    const [nextPaymentDate, setNextPaymentDate] = useState(new Date());
    const [isTrial, setIsTrial] = useState(false);
    const [trialEndDate, setTrialEndDate] = useState(new Date());
    const [showCategoryPicker, setShowCategoryPicker] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const language = params.language || 'Turkish';
    
    const [reminderDaysBefore, setReminderDaysBefore] = useState(1);
    const [cardName, setCardName] = useState('');
    const [reminderTime, setReminderTime] = useState(() => {
        const date = new Date();
        date.setHours(11, 30, 0, 0);
        return date;
    });    
    const t = (key) => getTranslation(language, key);

    const reminderOptions = [
        { label: t('sameDay'), value: 0 },
        { label: t('before1Day'), value: 1 },
        { label: t('before2Days'), value: 2 },
        { label: t('before3Days'), value: 3 },
        { label: t('before1Week'), value: 7 },
    ];

    useEffect(() => {
        const getCats = async () => {
            const cats = await getCategories();
            setCategories(cats);
            if (cats.length > 0) {
                setSelectedCategory(cats[0].id);
            }
        };
        getCats();
    }, []);

    const handleSave = async () => {
        if (!name.trim() || !amount) return;
        
        try {
            const dateToUse = isTrial ? trialEndDate : nextPaymentDate;
            const reminderHour = reminderTime.getHours();
            const reminderMinute = reminderTime.getMinutes();
            
            const newSubscriptionId = await addSubscription(
                name, 
                parseFloat(amount), 
                dateToUse.toISOString().split('T')[0], 
                selectedCategory,
                frequency,
                isTrial,
                isTrial ? dateToUse.toISOString().split('T')[0] : null,
                reminderDaysBefore,
                reminderHour,
                reminderMinute,
                cardName.trim() || null
            );
            
            await scheduleSubscriptionNotification(newSubscriptionId, name, dateToUse, reminderDaysBefore, reminderHour, reminderMinute);
            router.back();
        } catch (error) {
            console.error("Error adding subscription:", error);
        }
    };

    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            if (isTrial) {
                setTrialEndDate(selectedDate);
            } else {
                setNextPaymentDate(selectedDate);
            }
        }
    };

    const onTimeChange = (event, selectedTime) => {
        setShowTimePicker(false);
        if (selectedTime) {
            setReminderTime(selectedTime);
        }
    };

    const renderFrequencyOption = (option) => (
        <TouchableOpacity 
            style={[styles.billingCycleOption, frequency === option && styles.billingCycleOptionSelected]} 
            onPress={() => setFrequency(option)}
        >
            <Text style={[styles.billingCycleText, frequency === option && styles.billingCycleTextSelected]}>
                {t(option.toLowerCase())}
            </Text>
        </TouchableOpacity>
    );

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color={colors.white} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('addSubscription')}</Text>
            </View>

            <ScrollView style={styles.main} showsVerticalScrollIndicator={false}>
                {/* Live Card Preview */}
                <LinearGradient
                    colors={isTrial ? ['#8b5cf6', '#7c3aed'] : ['#3b82f6', '#2563eb']}
                    style={{
                        borderRadius: 24,
                        padding: 20,
                        marginBottom: 24,
                        minHeight: 180,
                        justifyContent: 'space-between'
                    }}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    {/* Top Row: Icon + Trial Badge + Amount */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                            <View style={{ 
                                backgroundColor: 'rgba(255,255,255,0.25)', 
                                borderRadius: 12, 
                                padding: 8
                            }}>
                                <BrandIcon name={name || 'subscription'} category={categories.find(c => c.id === selectedCategory)?.name || ''} size={28} color="white" />
                            </View>
                            {isTrial && (
                                <View style={{ backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
                                    <Text style={{ fontSize: 10, fontWeight: '800', color: '#7c3aed' }}>{t('trial').toUpperCase()}</Text>
                                </View>
                            )}
                        </View>
                        <Text style={{ fontSize: 24, fontWeight: '800', color: 'white', letterSpacing: -1 }}>
                            {getCurrency(language)}{amount || '0.00'}
                        </Text>
                    </View>

                    {/* Middle: Category + Name */}
                    <View style={{ flex: 1, justifyContent: 'center', paddingTop: 16 }}>
                        <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 }}>
                            {getCategoryTranslation(language, categories.find(c => c.id === selectedCategory)?.name) || t('category')}
                        </Text>
                        <Text style={{ fontSize: 22, fontWeight: '700', color: 'white', letterSpacing: 0.5 }}>
                            {name || t('subscriptionName')}
                        </Text>
                    </View>

                    {/* Bottom Row: Card Name + Date */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, letterSpacing: 1, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' }}>
                            {cardName || '•••• 0001'}
                        </Text>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 8, fontWeight: '600' }}>EXP</Text>
                            <Text style={{ fontSize: 12, fontWeight: '700', color: 'white' }}>
                                {format(isTrial ? trialEndDate : nextPaymentDate, 'dd/MM')}
                            </Text>
                        </View>
                    </View>
                </LinearGradient>

                <View style={styles.labelContainer}>
                    <Text style={styles.labelText}>{t('subscriptionName')}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder={t('namePlaceholder')}
                        placeholderTextColor={colors.slate500}
                        value={name}
                        onChangeText={setName}
                    />
                </View>

                 <View style={[styles.labelContainer, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }]}>
                    <Text style={[styles.labelText, { marginBottom: 0 }]}>{t('isFreeTrial')}</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: colors.primary }}
                        thumbColor={colors.white}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={setIsTrial}
                        value={isTrial}
                    />
                </View>

                <View style={styles.labelContainer}>
                <Text style={styles.labelText}>{t('amount')}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder={getCurrency(language) + "9.99"}
                        placeholderTextColor={colors.slate500}
                        value={amount}
                        onChangeText={setAmount}
                        keyboardType="decimal-pad"
                    />
                </View>

                <View style={styles.labelContainer}>
                    <Text style={styles.labelText}>{t('cardName')}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder={t('cardNamePlaceholder')}
                        placeholderTextColor={colors.slate500}
                        value={cardName}
                        onChangeText={setCardName}
                    />
                </View>


                
                <View style={styles.labelContainer}>
                    <Text style={styles.labelText}>{t('remindMe')}</Text>
                     <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                        {reminderOptions.map((option) => (
                            <TouchableOpacity
                                key={option.value}
                                onPress={() => setReminderDaysBefore(option.value)}
                                style={[
                                    styles.billingCycleOption, 
                                    { paddingHorizontal: 16, minWidth: 80 },
                                    reminderDaysBefore === option.value && styles.billingCycleOptionSelected
                                ]}
                            >
                                <Text style={[
                                    styles.billingCycleText, 
                                    reminderDaysBefore === option.value && styles.billingCycleTextSelected
                                ]}>
                                    {option.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                <View style={styles.labelContainer}>
                    <Text style={styles.labelText}>{t('notificationTime')}</Text>
                    <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.dateInputContainer}>
                        <TextInput
                            style={styles.input}
                            value={reminderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            editable={false}
                            pointerEvents="none"
                        />
                        <MaterialCommunityIcons name="clock-outline" size={24} style={styles.dateIcon} />
                    </TouchableOpacity>
                </View>

                <View style={styles.labelContainer}>
                    <Text style={styles.labelText}>{isTrial ? t('trialEndDate') : t('nextPaymentDate')}</Text>
                    <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateInputContainer}>
                        <TextInput
                            style={styles.input}
                            value={(isTrial ? trialEndDate : nextPaymentDate).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            })}
                            editable={false}
                            pointerEvents="none"
                        />
                        <MaterialCommunityIcons name="calendar" size={24} style={styles.dateIcon} />
                    </TouchableOpacity>
                </View>
                
                {showDatePicker && Platform.OS === 'ios' ? (
                    <Modal transparent animationType="slide">
                        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                            <View style={{ backgroundColor: colors.cardBackground, padding: 16, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                                        <Text style={{ color: colors.red500, fontSize: 16 }}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                                        <Text style={{ color: colors.indigo400, fontSize: 16, fontWeight: 'bold' }}>Done</Text>
                                    </TouchableOpacity>
                                </View>
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={isTrial ? trialEndDate : nextPaymentDate}
                                    mode={'date'}
                                    display="spinner"
                                    onChange={onDateChange}
                                    minimumDate={new Date()}
                                    textColor={colors.white}
                                />
                            </View>
                        </View>
                    </Modal>
                ) : showDatePicker && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={isTrial ? trialEndDate : nextPaymentDate}
                        mode={'date'}
                        display="default"
                        onChange={onDateChange}
                        minimumDate={new Date()}
                    />
                )}

                {showTimePicker && Platform.OS === 'ios' ? (
                    <Modal transparent animationType="slide">
                        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                            <View style={{ backgroundColor: colors.cardBackground, padding: 16, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                                        <Text style={{ color: colors.red500, fontSize: 16 }}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                                        <Text style={{ color: colors.indigo400, fontSize: 16, fontWeight: 'bold' }}>Done</Text>
                                    </TouchableOpacity>
                                </View>
                                <DateTimePicker
                                    testID="timePicker"
                                    value={reminderTime}
                                    mode={'time'}
                                    display="spinner"
                                    onChange={onTimeChange}
                                    textColor={colors.white}
                                />
                            </View>
                        </View>
                    </Modal>
                ) : showTimePicker && (
                    <DateTimePicker
                        testID="timePicker"
                        value={reminderTime}
                        mode={'time'}
                        display="default"
                        onChange={onTimeChange}
                    />
                )}

                <View style={styles.labelContainer}>
                    <Text style={styles.labelText}>{t('category')}</Text>
                    {Platform.OS === 'ios' ? (
                        <>
                            <TouchableOpacity 
                                style={[styles.input, { justifyContent: 'center' }]} 
                                onPress={() => setShowCategoryPicker(true)}
                            >
                                <Text style={{ color: colors.white, fontSize: 16 }}>
                                    {selectedCategory 
                                        ? getCategoryTranslation(language, categories.find(c => c.id === selectedCategory)?.name) 
                                        : t('selectCategory')}
                                </Text>
                                <MaterialCommunityIcons name="chevron-down" size={24} style={styles.pickerIcon} />
                            </TouchableOpacity>

                            {showCategoryPicker && (
                                <Modal transparent animationType="slide">
                                    <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                                        <View style={{ backgroundColor: colors.cardBackground || '#1e1e24', padding: 16, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                                                <TouchableOpacity onPress={() => setShowCategoryPicker(false)}>
                                                    <Text style={{ color: colors.red500, fontSize: 16 }}>{t('cancel')}</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => setShowCategoryPicker(false)}>
                                                    <Text style={{ color: colors.indigo400, fontSize: 16, fontWeight: 'bold' }}>{t('confirm')}</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <Picker
                                                selectedValue={selectedCategory}
                                                onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                                                style={{ color: colors.white }}
                                                dropdownIconColor={colors.primary}
                                            >
                                                {categories.map((category) => (
                                                    <Picker.Item
                                                        key={category.id}
                                                        label={getCategoryTranslation(language, category.name)}
                                                        value={category.id}
                                                        color={colors.white}
                                                    />
                                                ))}
                                            </Picker>
                                        </View>
                                    </View>
                                </Modal>
                            )}
                        </>
                    ) : (
                        <View style={styles.picker}>
                            <Picker
                                selectedValue={selectedCategory}
                                onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                                style={{ color: colors.white }}
                                dropdownIconColor={colors.primary}
                            >
                                {categories.map((category) => (
                                    <Picker.Item
                                        key={category.id}
                                        label={getCategoryTranslation(language, category.name)}
                                        value={category.id}
                                        color={colors.backgroundDark}
                                    />
                                ))}
                            </Picker>
                        </View>
                    )}
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity 
                    style={[styles.addButton, (!name.trim() || !amount) && { opacity: 0.5 }]} 
                    onPress={handleSave}
                    disabled={!name.trim() || !amount}
                >
                    <Text style={styles.addButtonText}>{t('addSubscription')}</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}