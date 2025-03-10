import { Platform, NativeModules } from 'react-native';

export type Language = 'en' | 'ja' | 'ko' | 'es' | 'ar' | 'fr' | 'zhTw';

export const SUPPORTED_LANGUAGES = {
  ja: '日本語',
  en: 'English',
  ko: '한국어',
  es: 'Español',
  ar: 'العربية',
  fr: 'Français',
  zhTw: '繁體中文',
} as const;

export const getDeviceLanguage = (): Language => {
  try {
    // iOS の場合のデバッグ情報
    if (Platform.OS === 'ios') {
      console.log('iOS Settings:', {
        AppleLocale: NativeModules.SettingsManager?.settings?.AppleLocale,
        AppleLanguages: NativeModules.SettingsManager?.settings?.AppleLanguages,
      });
    }
    
    // Android の場合のデバッグ情報
    if (Platform.OS === 'android') {
      console.log('Android Settings:', {
        localeIdentifier: NativeModules.I18nManager?.localeIdentifier,
        locale: NativeModules.I18nManager?.locale,
      });
    }

    const deviceLanguage = Platform.select({
      ios: () => {
        const locale = 
          NativeModules.SettingsManager?.settings?.AppleLocale ||
          NativeModules.SettingsManager?.settings?.AppleLanguages?.[0];
        console.log('iOS raw locale:', locale);
        
        // 台湾語の場合の特別処理
        if (locale?.toLowerCase().includes('zhTw') || 
            locale?.toLowerCase().includes('zh-hant')) {
          return 'zhTw';
        }
        return locale?.split('_')[0] || 'en';
      },
      android: () => {
        const locale = NativeModules.I18nManager?.localeIdentifier ||
                      NativeModules.I18nManager?.locale;
        console.log('Android raw locale:', locale);
        
        // 台湾語の場合の特別処理
        if (locale?.toLowerCase().includes('zhTw') || 
            locale?.toLowerCase().includes('zh-hant')) {
          return 'zhTw';
        }
        return locale?.split(/[-_]/)[0] || 'en';
      },
      default: () => 'en'
    })();

    console.log('Raw device language:', deviceLanguage);
    const normalizedLanguage = deviceLanguage.toLowerCase().trim();
    console.log('Normalized language:', normalizedLanguage);

    if (Object.keys(SUPPORTED_LANGUAGES).includes(normalizedLanguage)) {
      console.log('Using device language:', normalizedLanguage);
      return normalizedLanguage as Language;
    }

    console.log('Falling back to English, language not supported:', normalizedLanguage);
    return 'en';
  } catch (error) {
    console.error('Error getting device language:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    return 'en';
  }
};