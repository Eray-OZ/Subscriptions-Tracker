import { useState, useCallback, useMemo } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Link, useFocusEffect, useLocalSearchParams } from "expo-router";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { getSubscriptions } from "../src/db/database";
import { styles, colors } from "../src/styles/index.js";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { getTranslation, getCurrency, getCategoryTranslation } from '../src/translations';

// Configure Turkish locale for calendar
LocaleConfig.locales['tr'] = {
  monthNames: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
  monthNamesShort: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
  dayNames: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
  dayNamesShort: ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'],
  today: 'Bugün'
};

export default function CalendarScreen() {
  const { language: langParam } = useLocalSearchParams();
  const language = langParam || 'Turkish';
  
  const [subscriptions, setSubscriptions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const t = (key) => getTranslation(language, key);

  // Set locale
  LocaleConfig.defaultLocale = language === 'Turkish' ? 'tr' : '';

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const data = await getSubscriptions();
        setSubscriptions(data);
      };
      fetchData();
    }, [])
  );

  // Get payment dates - ONLY the actual next_payment_date, no projections
  const paymentDates = useMemo(() => {
    const dates = {};

    subscriptions.forEach(sub => {
      // Use the actual date from database - no recurring calculations
      const paymentDate = sub.isTrial && sub.trialEndDate 
        ? new Date(sub.trialEndDate) 
        : new Date(sub.next_payment_date);
      
      const dateStr = format(paymentDate, 'yyyy-MM-dd');
      
      if (!dates[dateStr]) {
        dates[dateStr] = { payments: [], total: 0 };
      }
      
      dates[dateStr].payments.push({
        name: sub.name,
        amount: sub.amount,
        category: sub.category_name,
        isTrial: sub.isTrial
      });
      dates[dateStr].total += sub.amount;
    });

    return dates;
  }, [subscriptions]);

  // Convert to react-native-calendars markedDates format
  const markedDates = useMemo(() => {
    const marked = {};
    
    Object.keys(paymentDates).forEach(dateStr => {
      const isSelected = selectedDate === dateStr;
      
      // Payment dates get a visible solid background
      marked[dateStr] = {
        selected: true, // Use selected styling for solid background
        selectedColor: isSelected ? colors.indigo500 : colors.emerald500,
        selectedTextColor: isSelected ? colors.white : '#000000', // Black text on green for contrast
      };
    });

    // Add selected date styling even if no payments
    if (selectedDate && !marked[selectedDate]) {
      marked[selectedDate] = {
        selected: true,
        selectedColor: colors.indigo500,
        selectedTextColor: colors.white,
      };
    }

    return marked;
  }, [paymentDates, selectedDate]);

  // Get payments for selected date
  const selectedDayPayments = selectedDate ? paymentDates[selectedDate] : null;

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    // Don't auto-open modal, just show details inline
  };

  return (
    <View style={[styles.container, { paddingTop: 16 }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Link href="/" asChild>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons name="arrow-left" size={24} color={colors.white} />
              <Text style={[styles.headerTitle, { marginLeft: 12 }]}>{t('calendar') || 'Calendar'}</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      {/* Calendar */}
      <Calendar
        style={{
          backgroundColor: colors.backgroundDark,
          borderRadius: 16,
          marginHorizontal: 16,
          marginTop: 16,
          paddingBottom: 16,
        }}
        theme={{
          backgroundColor: colors.backgroundDark,
          calendarBackground: colors.backgroundDark,
          textSectionTitleColor: colors.slate400,
          selectedDayBackgroundColor: colors.indigo500,
          selectedDayTextColor: colors.white,
          todayTextColor: colors.indigo400,
          dayTextColor: colors.white,
          textDisabledColor: colors.slate700,
          dotColor: colors.indigo400,
          selectedDotColor: colors.white,
          arrowColor: colors.indigo400,
          monthTextColor: colors.white,
          textDayFontWeight: '500',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '500',
          textDayFontSize: 16,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 12,
        }}
        markedDates={markedDates}
        onDayPress={handleDayPress}
        enableSwipeMonths={true}
      />



      {/* Selected Date Info */}
      {selectedDate && (
        <View style={{ 
          backgroundColor: colors.cardBackground, 
          marginHorizontal: 16, 
          marginTop: 24, 
          padding: 16, 
          borderRadius: 16,
          maxHeight: 280,
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ color: colors.slate400, fontSize: 12 }}>
              {format(new Date(selectedDate), 'd MMMM yyyy', language === 'Turkish' ? { locale: tr } : {})}
            </Text>
            {selectedDayPayments && (
              <Text style={{ color: colors.indigo400, fontSize: 16, fontWeight: 'bold' }}>
                {getCurrency(language)}{selectedDayPayments.total.toFixed(2)}
              </Text>
            )}
          </View>
          
          {selectedDayPayments ? (
            <ScrollView style={{ maxHeight: 200 }} showsVerticalScrollIndicator={false}>
              {selectedDayPayments.payments.map((payment, index) => (
                <View 
                  key={index} 
                  style={{ 
                    flexDirection: 'row', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    paddingVertical: 10,
                    borderBottomWidth: index < selectedDayPayments.payments.length - 1 ? 1 : 0,
                    borderBottomColor: colors.slate800,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <MaterialCommunityIcons 
                      name={payment.isTrial ? "gift" : "credit-card"} 
                      size={18} 
                      color={payment.isTrial ? colors.indigo400 : colors.emerald500} 
                    />
                    <View style={{ marginLeft: 12, flex: 1 }}>
                      <Text style={{ color: colors.white, fontSize: 14, fontWeight: '600' }}>
                        {payment.name}
                      </Text>
                      <Text style={{ color: colors.slate500, fontSize: 11 }}>
                        {getCategoryTranslation(language, payment.category)}
                      </Text>
                    </View>
                  </View>
                  <Text style={{ color: colors.white, fontSize: 14, fontWeight: 'bold' }}>
                    {getCurrency(language)}{payment.amount.toFixed(2)}
                  </Text>
                </View>
              ))}
            </ScrollView>
          ) : (
            <Text style={{ color: colors.slate500, fontSize: 14, textAlign: 'center', paddingVertical: 16 }}>
              {t('noPaymentsThisDay') || 'No payments scheduled'}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}
