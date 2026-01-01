import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Platform, KeyboardAvoidingView, ScrollView } from "react-native";
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
    const [showDatePicker, setShowDatePicker] = useState(false);
    const language = params.language || 'Turkish';
    
    const t = (key) => getTranslation(language, key);

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
            const newSubscriptionId = await addSubscription(
                name, 
                parseFloat(amount), 
                nextPaymentDate.toISOString().split('T')[0], 
                selectedCategory,
                frequency
            );
            await scheduleSubscriptionNotification(newSubscriptionId, name, nextPaymentDate);
            router.back();
        } catch (error) {
            console.error("Error adding subscription:", error);
        }
    };

    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setNextPaymentDate(selectedDate);
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
                    <Text style={styles.labelText}>{t('nextPaymentDate')}</Text>
                    <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateInputContainer}>
                        <TextInput
                            style={styles.input}
                            value={nextPaymentDate.toLocaleDateString('en-US', { 
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
                        value={nextPaymentDate}
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