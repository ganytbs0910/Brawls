import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Language = 'en' | 'ja' | 'ko';

const SUPPORTED_LANGUAGES = {
  en: 'English',
  ja: '日本語',
  ko: '한국어',
} as const;

// デバイスのデフォルト言語を取得する関数
const getDeviceLanguage = (): Language => {
  let deviceLanguage = 'en';
  
  if (Platform.OS === 'ios') {
    deviceLanguage = NativeModules.SettingsManager.settings.AppleLocale ||
                    NativeModules.SettingsManager.settings.AppleLanguages[0];
  } else {
    deviceLanguage = NativeModules.I18nManager.localeIdentifier;
  }

  // 言語コードを抽出 (例: "ja_JP" → "ja")
  const languageCode = deviceLanguage.split('_')[0];

  // サポートされている言語かチェック、なければ英語を返す
  return Object.keys(SUPPORTED_LANGUAGES).includes(languageCode) 
    ? languageCode as Language 
    : 'en';
};

interface LanguageSelectorProps {
  onClose: () => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onClose }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  useEffect(() => {
    // 初期言語の設定
    const initLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
        if (savedLanguage && Object.keys(SUPPORTED_LANGUAGES).includes(savedLanguage)) {
          setCurrentLanguage(savedLanguage as Language);
        } else {
          const deviceLang = getDeviceLanguage();
          setCurrentLanguage(deviceLang);
          await AsyncStorage.setItem('selectedLanguage', deviceLang);
        }
      } catch (error) {
        console.error('Failed to initialize language:', error);
        setCurrentLanguage('en');
      }
    };

    initLanguage();
  }, []);

  const handleLanguageSelect = async (language: Language) => {
    try {
      await AsyncStorage.setItem('selectedLanguage', language);
      setCurrentLanguage(language);
      // TODO: 必要に応じて言語変更後の処理を追加
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