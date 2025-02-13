// src/components/LanguageSelector.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language, SUPPORTED_LANGUAGES, getDeviceLanguage } from '../utils/languageUtils';

interface LanguageSelectorProps {
  onClose: () => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onClose }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
        if (savedLanguage && Object.keys(SUPPORTED_LANGUAGES).includes(savedLanguage)) {
          setCurrentLanguage(savedLanguage as Language);
        }
      } catch (error) {
        console.error('Failed to initialize language:', error);
        const deviceLang = getDeviceLanguage();
        setCurrentLanguage(deviceLang);
      } finally {
        setIsInitialized(true);
      }
    };

    initLanguage();
  }, []);

  if (!isInitialized) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Loading...</Text>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const handleLanguageSelect = async (language: Language) => {
    if (language === currentLanguage) {
      return; // 同じ言語を選択した場合は何もしない
    }

    try {
      await AsyncStorage.setItem('selectedLanguage', language);
      setCurrentLanguage(language);
      // 選択後すぐには閉じない
      // 必要に応じて確認ダイアログを表示するなど
    } catch (error) {
      console.error('Failed to save language:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>言語設定</Text>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.languageList}>
        {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
          <TouchableOpacity
            key={code}
            style={[
              styles.languageItem,
              currentLanguage === code && styles.selectedLanguageItem
            ]}
            onPress={() => handleLanguageSelect(code as Language)}
          >
            <Text style={[
              styles.languageText,
              currentLanguage === code && styles.selectedLanguageText
            ]}>
              {name}
            </Text>
            {currentLanguage === code && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 60,
    backgroundColor: '#21A0DB',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: '#fff',
  },
  languageList: {
    padding: 16,
  },
  languageItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedLanguageItem: {
    backgroundColor: '#f0f9ff',
  },
  languageText: {
    fontSize: 16,
    color: '#333',
  },
  selectedLanguageText: {
    color: '#21A0DB',
    fontWeight: 'bold',
  },
  checkmark: {
    fontSize: 18,
    color: '#21A0DB',
  },
});

export default LanguageSelector;