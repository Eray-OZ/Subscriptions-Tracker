import AsyncStorage from '@react-native-async-storage/async-storage';

const LANGUAGE_KEY = '@subtracker_language';

export const saveLanguage = async (language) => {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, language);
  } catch (error) {
    console.warn('Failed to save language:', error);
  }
};

export const loadLanguage = async () => {
  try {
    const language = await AsyncStorage.getItem(LANGUAGE_KEY);
    return language || 'Turkish'; // Default to Turkish
  } catch (error) {
    console.warn('Failed to load language:', error);
    return 'Turkish';
  }
};
