import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { styles } from '../styles/index.js';
import { getTranslation, getCurrency } from '../translations';

export const SummaryCard = React.memo(({ subscriptions, language }) => {
    const t = (key) => getTranslation(language, key);

    const stats = useMemo(() => {
        // Filter out free trials from calculations
        const paidSubscriptions = subscriptions.filter(sub => !sub.isTrial);
        
        // Count active subscriptions
        const activeCount = paidSubscriptions.length;
        
        // Calculate total (normalized to monthly)
        let total = 0;
        let highestSub = null;
        let highestAmount = 0;
        
        paidSubscriptions.forEach(sub => {
            // Normalize to monthly
            let monthlyAmount = sub.amount;
            if (sub.frequency === 'Weekly') monthlyAmount = sub.amount * 4.33;
            else if (sub.frequency === 'Yearly') monthlyAmount = sub.amount / 12;
            
            total += monthlyAmount;
            
            // Track highest
            if (monthlyAmount > highestAmount) {
                highestAmount = monthlyAmount;
                highestSub = sub;
            }
        });

        const [dollars, cents] = total.toFixed(2).split('.');
        
        return { 
            activeCount, 
            total, 
            dollars, 
            cents, 
            highest: highestSub,
            highestAmount
        };
    }, [subscriptions]);

    const currentMonth = language === 'Turkish' 
        ? format(new Date(), 'MMMM yyyy', { locale: tr })
        : format(new Date(), 'MMMM yyyy');

    return (
        <View style={styles.summaryCardContainer}>
            <View style={styles.summaryCard}>
                {/* Gradient glow effect */}
                <View style={styles.summaryCardGradient} />
                
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
                        <Text style={styles.summaryLabel}>{t('totalSpend')}</Text>
                    </View>
                </View>

                <View style={styles.summaryStats}>
                    <View style={styles.summaryStat}>
                        <Text style={styles.summaryStatLabel}>{t('active')}</Text>
                        <Text style={styles.summaryStatValue}>{stats.activeCount} {t('subs')}</Text>
                    </View>
                    <View style={[styles.summaryStat, styles.summaryStatBorder]}>
                        <Text style={styles.summaryStatLabel}>{t('highest')}</Text>
                        <Text style={styles.summaryStatValue}>{stats.highest?.name || '-'}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
});
