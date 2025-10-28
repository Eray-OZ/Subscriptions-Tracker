import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import { addSubscription, getCategories } from "./db/database.js";
import { styles, colors } from "./styles/add.js";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AddScreen() {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [nextPaymentDate, setNextPaymentDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

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
        try {
            await addSubscription(name, parseFloat(amount), nextPaymentDate.toISOString().split('T')[0], selectedCategory);
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

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color={colors.slate200} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add Subscription</Text>
            </View>

            <View style={styles.main}>
                <View style={styles.labelContainer}>
                    <Text style={styles.labelText}>Subscription Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g., Spotify"
                        placeholderTextColor={colors.slate500}
                        value={name}
                        onChangeText={setName}
                    />
                </View>

                <View style={styles.labelContainer}>
                    <Text style={styles.labelText}>Amount</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="$10.99"
                        placeholderTextColor={colors.slate500}
                        value={amount}
                        onChangeText={setAmount}
                        keyboardType="numeric"
                    />
                </View>


                <View style={styles.grid}>
                    <View style={[styles.gridColumn, { marginRight: 12 }]}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.labelText}>Next Payment</Text>
                            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateInputContainer}>
                                <TextInput
                                    style={styles.input}
                                    value={nextPaymentDate.toLocaleDateString()}
                                    editable={false}
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
                            />
                        )}
                    </View>
                    <View style={styles.gridColumn}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.labelText}>Category</Text>
                            <View style={styles.picker}>
                                <Picker
                                    selectedValue={selectedCategory}
                                    onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                                    style={{ color: 'white' }}
                                    dropdownIconColor={colors.primary}
                                >
                                    {categories.map((category) => (
                                        <Picker.Item
                                            key={category.id}
                                            label={category.name}
                                            value={category.id}
                                        />
                                    ))}
                                </Picker>
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.addButton} onPress={handleSave}>
                    <Text style={styles.addButtonText}>Add Subscription</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}