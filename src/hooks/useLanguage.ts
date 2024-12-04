import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Language = 'ja' | 'en' | 'ko' | 'zh';

export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('ja');

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('language');
        if (savedLanguage) {
          setCurrentLanguage(savedLanguage as Language);
        }
      } catch (error) {
        console.error('Failed to load language setting:', error);
      }
    };
    loadLanguage();
  }, []);

  const changeLanguage = useCallback(async (language: Language) => {
    try {
      await AsyncStorage.setItem('language', language);
      setCurrentLanguage(language);
    } catch (error) {
      console.error('Failed to save language setting:', error);
    }
  }, []);

  return { currentLanguage, changeLanguage };
};