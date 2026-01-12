import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { format, differenceInCalendarDays, isBefore } from 'date-fns';
import { styles } from '../styles/index.js';
import { getTranslation, getCurrency, getCategoryTranslation } from '../translations';
import { BrandIcon } from './BrandIcon';
import { getGradientForId, getStatusStyle } from '../utils/theme';

export const SubscriptionItem = ({ 
    item, 
    language, 
    onLongPress, 
    isEditing, 
    editingId, 
    newPrice, 
    setNewPrice 
}) => {
    const t = (key) => getTranslation(language, key);
    const today = new Date();
    const dateToCheck = item.isTrial && item.trialEndDate ? new Date(item.trialEndDate) : new Date(item.next_payment_date);
    const remainingDays = differenceInCalendarDays(dateToCheck, today);
    const isPast = isBefore(dateToCheck, today);
    const isEditingThis = isEditing && editingId === item.id;
    
    return (
        <TouchableOpacity 
            style={styles.subscriptionItem}
            activeOpacity={0.9}
            onLongPress={() => onLongPress(item)}
            delayLongPress={200}
            onPress={() => onLongPress(item)} // Single tap now shows menu too
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
