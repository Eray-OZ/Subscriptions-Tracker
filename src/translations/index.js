// Translation strings for SubTracker app
export const translations = {
  en: {
    // Dashboard
    dashboard: 'Dashboard',
    appName: 'SubTracker',
    
    // Summary Card
    totalSpend: 'Total',
    monthlySpendTotal: 'monthly spend (total)',
    weeklySpend: 'weekly spend',
    monthlySpend: 'monthly spend',
    yearlySpend: 'yearly spend',
    active: 'Active',
    subs: 'Subs',
    avg: 'Avg',
    highest: 'Highest',
    
    // Frequencies
    weekly: 'Weekly',
    monthly: 'Monthly',
    yearly: 'Yearly',
    total: 'Total',
    
    // Subscription Card
    daysLeft: 'days left',
    overdue: 'Overdue',
    confirmPayment: 'Confirm Payment',
    
    // Filter Modal
    filtersSettings: 'Filters & Settings',
    language: 'Language',
    search: 'Search',
    searchPlaceholder: 'Search subscriptions...',
    categories: 'Categories',
    billingCycle: 'Billing Cycle',
    clearAllFilters: 'Clear All Filters',
    
    // Add Screen
    addSubscription: 'Add Subscription',
    subscriptionName: 'Subscription Name',
    namePlaceholder: 'e.g., Netflix, Spotify',
    amount: 'Amount',
    amountPlaceholder: '$9.99',
    nextPaymentDate: 'Next Payment Date',
    category: 'Category',
    remindMe: 'Remind Me',
    sameDay: 'Same Day',
    before1Day: '1 Day Before',
    before2Days: '2 Days Before',
    before3Days: '3 Days Before',
    before1Week: '1 Week Before',
    
    // Payment Modal
    markAsPaid: 'Mark',
    asPaid: 'as paid?',
    nextPayment: 'Next Payment Date',
    cancel: 'Cancel',
    confirm: 'Confirm',
    edit: 'Edit',
    delete: 'Delete',
    freeTrial: 'Free Trial',
    trialEnds: 'Trial Ends',
    paymentHistory: 'Payment History',
    allSubscriptions: 'All Subscriptions',
    noPaymentHistory: 'No payment history',
    daysLeft: 'days left',
    trial: 'Trial',
    viewHistory: 'View History',
    isFreeTrial: 'Is this a free trial?',
    trialEndDate: 'Trial End Date',
  },
  tr: {
    // Dashboard
    appName: 'SubTracker',
    dashboard: 'Kontrol Paneli',
    
    // Summary Card
    totalSpend: 'Toplam',
    monthlySpendTotal: 'aylık harcama (toplam)',
    weeklySpend: 'haftalık harcama',
    monthlySpend: 'aylık harcama',
    yearlySpend: 'yıllık harcama',
    active: 'Aktif',
    subs: 'Abone',
    avg: 'Ort',
    highest: 'En Yüksek',
    
    // Frequencies
    weekly: 'Haftalık',
    monthly: 'Aylık',
    yearly: 'Yıllık',
    total: 'Toplam',
    
    // Subscription Card
    daysLeft: 'gün kaldı',
    overdue: 'Gecikmiş',
    confirmPayment: 'Ödemeyi Onayla',
    
    // Filter Modal
    filtersSettings: 'Filtreler ve Ayarlar',
    language: 'Dil',
    search: 'Ara',
    searchPlaceholder: 'Abonelik ara...',
    categories: 'Kategoriler',
    billingCycle: 'Ödeme Sıklığı',
    clearAllFilters: 'Tüm Filtreleri Temizle',
    
    // Add Screen
    addSubscription: 'Abonelik Ekle',
    subscriptionName: 'Abonelik Adı',
    namePlaceholder: 'örn., Netflix, Spotify',
    amount: 'Tutar',
    amountPlaceholder: '₺99.99',
    nextPaymentDate: 'Sonraki Ödeme Tarihi',
    category: 'Kategori',
    remindMe: 'Hatırlat',
    sameDay: 'Aynı Gün',
    before1Day: '1 Gün Önce',
    before2Days: '2 Gün Önce',
    before3Days: '3 Gün Önce',
    before1Week: '1 Hafta Önce',
    
    // Payment Modal
    markAsPaid: 'İşaretle',
    asPaid: 'ödendi olarak?',
    nextPayment: 'Sonraki Ödeme Tarihi',
    cancel: 'İptal',
    confirm: 'Onayla',
    edit: 'Düzenle',
    delete: 'Sil',
    freeTrial: 'Ücretsiz Deneme',
    trialEnds: 'Deneme Bitiyor',
    paymentHistory: 'Ödeme Geçmişi',
    allSubscriptions: 'Tüm Abonelikler',
    noPaymentHistory: 'Ödeme geçmişi yok',
    trial: 'Deneme',
    viewHistory: 'Geçmişi Görüntüle',
    isFreeTrial: 'Bu ücretsiz deneme mi?',
    trialEndDate: 'Deneme Bitiş Tarihi',
  },
};

export const getTranslation = (language, key) => {
  const lang = language === 'Turkish' ? 'tr' : 'en';
  return translations[lang][key] || key;
};

export const getCurrency = (language) => {
  return language === 'Turkish' ? '₺' : '$';
};

// Category translations
export const categoryTranslations = {
  en: {
    'Bills': 'Bills',
    'Movie Streaming': 'Movie Streaming',
    'Music': 'Music',
    'Gaming': 'Gaming',
    'Software': 'Software',
    'Cloud': 'Cloud',
    'Reading': 'Reading',
    'Shopping': 'Shopping',
    'Gym': 'Gym',
    'Others': 'Others',
  },
  tr: {
    'Bills': 'Faturalar',
    'Movie Streaming': 'Dijital Yayın',
    'Music': 'Müzik',
    'Gaming': 'Oyun',
    'Software': 'Yazılım',
    'Cloud': 'Bulut',
    'Reading': 'Okuma',
    'Shopping': 'Alışveriş',
    'Gym': 'Spor Salonu',
    'Others': 'Diğer',
  },
};

export const getCategoryTranslation = (language, categoryName) => {
  const lang = language === 'Turkish' ? 'tr' : 'en';
  return categoryTranslations[lang][categoryName] || categoryName;
};

export const getFrequencyAbbr = (language, frequency) => {
  const abbr = {
    en: {
      'Weekly': 'wk',
      'Monthly': 'mo',
      'Yearly': 'yr',
    },
    tr: {
      'Weekly': 'hf',
      'Monthly': 'ay',
      'Yearly': 'yıl',
    },
  };
  const lang = language === 'Turkish' ? 'tr' : 'en';
  return abbr[lang][frequency] || frequency;
};
