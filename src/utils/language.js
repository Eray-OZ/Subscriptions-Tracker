// In-memory storage fallback when native modules aren't available (Expo Go)
let cachedLanguage = 'Turkish';

// Try to use SecureStore if available, otherwise use memory
let SecureStore = null;
try {
  SecureStore = require('expo-secure-store');
} catch (e) {
  // SecureStore not available (Expo Go without dev build)
}

const LANGUAGE_KEY = 'subtracker_language';

export const saveLanguage = async (language) => {
  cachedLanguage = language;
  if (SecureStore) {
    try {
      await SecureStore.setItemAsync(LANGUAGE_KEY, language);
    } catch (error) {
      // Silently fail - will use memory cache
    }
  }
};

export const loadLanguage = async () => {
  if (SecureStore) {
    try {
      const language = await SecureStore.getItemAsync(LANGUAGE_KEY);
      if (language) {
        cachedLanguage = language;
        return language;
      }
    } catch (error) {
      // Silently fail - will use cached value
    }
  }
  return cachedLanguage;
};
