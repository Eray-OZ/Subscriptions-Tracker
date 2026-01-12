import { useState, useMemo } from 'react';
import { getTranslation } from '../translations';

export const useFilters = (subscriptions, language) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedFrequencies, setSelectedFrequencies] = useState([]);

    const filteredSubscriptions = useMemo(() => {
        return subscriptions.filter(sub => {
            // Search filter
            if (searchQuery && !sub.name.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }
            
            // Category filter
            if (selectedCategories.length > 0 && !selectedCategories.includes(sub.category_name)) {
                return false;
            }
            
            // Frequency filter
            if (selectedFrequencies.length > 0 && !selectedFrequencies.includes(sub.frequency || 'Monthly')) {
                return false;
            }
            
            return true;
        });
    }, [subscriptions, searchQuery, selectedCategories, selectedFrequencies]);

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCategories([]);
        setSelectedFrequencies([]);
    };

    return {
        searchQuery,
        setSearchQuery,
        selectedCategories,
        setSelectedCategories,
        selectedFrequencies,
        setSelectedFrequencies,
        filteredSubscriptions,
        clearFilters
    };
};
