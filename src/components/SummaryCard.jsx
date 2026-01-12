import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { styles } from '../styles/index.js';
import { getTranslation, getCurrency } from '../translations';

export const SummaryCard = ({ subscriptions, language }) => {
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
