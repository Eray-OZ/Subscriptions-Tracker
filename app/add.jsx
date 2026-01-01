import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Platform, KeyboardAvoidingView, ScrollView, Switch } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { router, useLocalSearchParams } from "expo-router";
import { addSubscription, getCategories } from "../src/db/database.js";
import { styles, colors } from "../src/styles/add.js";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { scheduleSubscriptionNotification } from "../src/utils/notifications";
import { getTranslation, getCurrency, getCategoryTranslation } from "../src/translations";

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
    const [showDatePicker, setShowDatePicker] = useState(false);
    const language = params.language || 'Turkish';
    
    const [reminderDaysBefore, setReminderDaysBefore] = useState(1);
    
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
            
            const newSubscriptionId = await addSubscription(
                name, 
                parseFloat(amount), 
                dateToUse.toISOString().split('T')[0], 
                selectedCategory,
                frequency,
                isTrial,
                isTrial ? dateToUse.toISOString().split('T')[0] : null,
                reminderDaysBefore
            );
            
            await scheduleSubscriptionNotification(newSubscriptionId, name, dateToUse, reminderDaysBefore);
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
                    <Text style={styles.labelText}>{t('amount')} ({t(frequency.toLowerCase())})</Text>
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
                    <Text style={styles.labelText}>{t('billingCycle')}</Text>
                    <View style={styles.billingCycleContainer}>
                        {renderFrequencyOption('Weekly')}
                        {renderFrequencyOption('Monthly')}
                        {renderFrequencyOption('Yearly')}
                    </View>
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
                
                {showDatePicker && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={isTrial ? trialEndDate : nextPaymentDate}
                        mode={'date'}
                        is24Hour={true}
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={onDateChange}
                        minimumDate={new Date()}
                    />
                )}

                <View style={styles.labelContainer}>
                    <Text style={styles.labelText}>{t('category')}</Text>
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
                                    color={Platform.OS === 'ios' ? colors.white : colors.backgroundDark}
                                />
                            ))}
                        </Picker>
                    </View>
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