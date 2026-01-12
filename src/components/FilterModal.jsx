import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, TextInput } from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { styles, colors } from '../styles/index.js';
import { getTranslation, getCategoryTranslation } from '../translations';

export const FilterModal = ({ 
    visible, 
    onClose, 
    language, 
    setLanguage, 
    searchQuery, 
    setSearchQuery, 
    selectedCategories, 
    setSelectedCategories, 
    selectedFrequencies, 
    setSelectedFrequencies, 
    allCategories 
}) => {
    const t = (key) => getTranslation(language, key);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.filterModalOverlay}>
                <View style={styles.filterModalContainer}>
                    <View style={styles.filterModalHeader}>
                        <Text style={styles.filterModalTitle}>{t('filtersSettings')}</Text>
                        <TouchableOpacity onPress={onClose}>
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
    );
};
