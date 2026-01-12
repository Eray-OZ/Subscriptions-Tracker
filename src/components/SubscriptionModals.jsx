import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Platform } from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from "expo-router";
import { styles, colors } from '../styles/index.js';
import { getTranslation, getCurrency } from '../translations';

export const PaymentModal = ({ 
    visible, 
    onClose, 
    selectedSubscription, 
    newPaymentDate, 
    showDatePicker, 
    setShowDatePicker, 
    onDateChange, 
    onConfirm, 
    language 
}) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
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
                            onPress={onClose}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.confirmButton]}
                            onPress={onConfirm}
                        >
                            <Text style={styles.confirmButtonText}>Confirm</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export const MenuModal = ({ 
    visible, 
    onClose, 
    selectedSubscription, 
    onViewHistory, 
    onMarkAsPaid, 
    onEdit, 
    onDelete, 
    language 
}) => {
    const t = (key) => getTranslation(language, key);
    
    // Explicitly handle null selectedSubscription to prevent crashes
    if (!selectedSubscription) return null;

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableOpacity 
                style={styles.modalOverlay} 
                activeOpacity={1} 
                onPress={onClose}
            >
                <View style={styles.menuModalContent}>
                    <Text style={styles.menuModalTitle}>{selectedSubscription.name}</Text>
                    
                    <TouchableOpacity style={styles.menuOption} onPress={onViewHistory}>
                        <MaterialCommunityIcons name="history" size={24} color={colors.primary} />
                        <Text style={styles.menuOptionText}>{t('viewHistory')}</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.menuOption} onPress={onMarkAsPaid}>
                        <MaterialCommunityIcons name="check-circle-outline" size={24} color={colors.emerald500} />
                        <Text style={styles.menuOptionText}>{t('markAsPaid')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuOption} onPress={onEdit}>
                        <MaterialCommunityIcons name="pencil" size={24} color={colors.slate400} />
                        <Text style={styles.menuOptionText}>{t('edit')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.menuOption, { borderBottomWidth: 0 }]} 
                        onPress={onDelete}
                    >
                        <MaterialCommunityIcons name="delete" size={24} color={colors.red500} />
                        <Text style={[styles.menuOptionText, { color: colors.red500 }]}>{t('delete')}</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

export const HistoryModal = ({ 
    visible, 
    onClose, 
    isGlobalHistory, 
    selectedSubscription, 
    paymentHistory, 
    language 
}) => {
    const t = (key) => getTranslation(language, key);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.historyModalOverlay}>
                <View style={styles.historyModalContainer}>
                    <View style={styles.historyModalHeader}>
                        <Text style={styles.historyModalTitle}>
                            {isGlobalHistory ? t('paymentHistory') : t('paymentHistory')}
                        </Text>
                        <TouchableOpacity onPress={onClose}>
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
    );
};
