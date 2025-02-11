import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Language = 'en' | 'ja' | 'ko';

const SUPPORTED_LANGUAGES = {
  ja: '日本語',
  en: 'English',
  ko: '한국어',
} as const;

// デバイスのデフォルト言語を取得する関数
const getDeviceLanguage = (): Language => {
  try {
    // Platform.selectを使用してプラットフォーム固有の言語取得ロジックを実装
    const deviceLanguage = Platform.select({
      ios: () => {
        // iOSの場合
        const locale = 
          NativeModules.SettingsManager?.settings?.AppleLocale ||
          NativeModules.SettingsManager?.settings?.AppleLanguages?.[0];
        return locale?.split('_')[0] || 'en';
      },
      android: () => {
        // Androidの場合
        const locale = NativeModules.I18nManager?.localeIdentifier;
        return locale?.split('-')[0] || 'en';
      },
      default: () => 'en'
    })();

    console.log('Raw device language:', deviceLanguage); // デバッグ用

    // 言語コードを正規化
    const normalizedLanguage = deviceLanguage.toLowerCase().trim();

    // サポートされている言語かどうかを確認
    if (Object.keys(SUPPORTED_LANGUAGES).includes(normalizedLanguage)) {
      console.log('Using device language:', normalizedLanguage);
      return normalizedLanguage as Language;
    }

    console.log('Falling back to English');
    return 'en';
  } catch (error) {
    console.error('Error getting device language:', error);
    // エラーの詳細をログ出力
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    return 'en';
  }
};

interface LanguageSelectorProps {
  onClose: () => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onClose }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);  // 初期化フラグを追加

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