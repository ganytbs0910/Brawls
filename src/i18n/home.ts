// src/i18n/home.ts
import { GAME_MODES, getLocalizedModeName, generateCombinedModeTranslation, Language as ModeLanguage } from '../data/modeData';

export type HomeTranslation = {
  header: {
    title: string;
  };
  dateSelector: {
    today: string;
    yesterday: string;
    tomorrow: string;
    monthDay: (month: number, day: number) => string;
  };
  updateTime: {
    timeUntilUpdate: (hours: number, minutes: number) => string;
  };
  modes: {
    getModeName: (modeName: keyof typeof GAME_MODES) => string;
    getCombinedModeName: (modes: (keyof typeof GAME_MODES)[]) => string;
  };
};

// 日本語翻訳
export const ja: HomeTranslation = {
  header: {
    title: 'ブロスタ マップ情報',
  },
  dateSelector: {
    today: '今日',
    yesterday: '昨日',
    tomorrow: '明日',
    monthDay: (month: number, day: number) => `${month}月${day}日`,
  },
  updateTime: {
    timeUntilUpdate: (hours: number, minutes: number) => `更新まで ${hours}時間${minutes}分`,
  },
  modes: {
    getModeName: (modeName) => getLocalizedModeName(modeName, 'ja'),
    getCombinedModeName: (modes) => generateCombinedModeTranslation(modes, 'ja')
  }
};

// 英語翻訳
export const en: HomeTranslation = {
  header: {
    title: 'Brawl Stars Maps',
  },
  dateSelector: {
    today: 'Today',
    yesterday: 'Yesterday',
    tomorrow: 'Tomorrow',
    monthDay: (month: number, day: number) => `${month}/${day}`,
  },
  updateTime: {
    timeUntilUpdate: (hours: number, minutes: number) => 
      `${hours}h ${minutes}m until update`,
  },
  modes: {
    getModeName: (modeName) => getLocalizedModeName(modeName, 'en'),
    getCombinedModeName: (modes) => generateCombinedModeTranslation(modes, 'en')
  }
};

// 韓国語翻訳
export const ko: HomeTranslation = {
  header: {
    title: '브롤스타즈 맵 정보',
  },
  dateSelector: {
    today: '오늘',
    yesterday: '어제',
    tomorrow: '내일',
    monthDay: (month: number, day: number) => `${month}월 ${day}일`,
  },
  updateTime: {
    timeUntilUpdate: (hours: number, minutes: number) => 
      `업데이트까지 ${hours}시간 ${minutes}분`,
  },
  modes: {
    getModeName: (modeName) => getLocalizedModeName(modeName, 'ko'),
    getCombinedModeName: (modes) => generateCombinedModeTranslation(modes, 'ko')
  }
};

export const es: HomeTranslation = {
  header: {
    title: 'Mapas de Brawl Stars',
  },
  dateSelector: {
    today: 'Hoy',
    yesterday: 'Ayer',
    tomorrow: 'Mañana',
    monthDay: (month: number, day: number) => `${day}/${month}`,
  },
  updateTime: {
    timeUntilUpdate: (hours: number, minutes: number) => 
      `${hours}h ${minutes}m hasta la actualización`,
  },
  modes: {
    getModeName: (modeName) => getLocalizedModeName(modeName, 'es'),
    getCombinedModeName: (modes) => generateCombinedModeTranslation(modes, 'es')
  }
};

// アラビア語翻訳
export const ar: HomeTranslation = {
  header: {
    title: 'خرائط براول ستارز',
  },
  dateSelector: {
    today: 'اليوم',
    yesterday: 'أمس',
    tomorrow: 'غداً',
    monthDay: (month: number, day: number) => `${day}/${month}`,
  },
  updateTime: {
    timeUntilUpdate: (hours: number, minutes: number) => 
      `${hours} ساعة ${minutes} دقيقة حتى التحديث`,
  },
  modes: {
    getModeName: (modeName) => getLocalizedModeName(modeName, 'ar'),
    getCombinedModeName: (modes) => generateCombinedModeTranslation(modes, 'ar')
  }
};

// フランス語翻訳
export const fr: HomeTranslation = {
  header: {
    title: 'Cartes Brawl Stars',
  },
  dateSelector: {
    today: 'Aujourd\'hui',
    yesterday: 'Hier',
    tomorrow: 'Demain',
    monthDay: (month: number, day: number) => `${day}/${month}`,
  },
  updateTime: {
    timeUntilUpdate: (hours: number, minutes: number) => 
      `${hours}h ${minutes}m avant la mise à jour`,
  },
  modes: {
    getModeName: (modeName) => getLocalizedModeName(modeName, 'fr'),
    getCombinedModeName: (modes) => generateCombinedModeTranslation(modes, 'fr')
  }
};

export const zhTw: HomeTranslation = {
  header: {
    title: '荒野亂鬥地圖資訊',
  },
  dateSelector: {
    today: '今天',
    yesterday: '昨天',
    tomorrow: '明天',
    monthDay: (month: number, day: number) => `${month}月${day}日`,
  },
  updateTime: {
    timeUntilUpdate: (hours: number, minutes: number) => 
      `距離更新還有 ${hours}小時${minutes}分鐘`,
  },
  modes: {
    getModeName: (modeName) => getLocalizedModeName(modeName, 'zh-tw'),
    getCombinedModeName: (modes) => generateCombinedModeTranslation(modes, 'zh-tw')
  }
};

// 翻訳オブジェクトをまとめたもの
export const homeTranslations = {
  ja,
  en,
  ko,
  es,
  ar,
  fr,
  zhTw
} as const;

// 言語タイプの定義
export type Language = keyof typeof homeTranslations;

// カスタムフック
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useHomeTranslation() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('ja');

  useEffect(() => {
    const getLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
        if (savedLanguage && (savedLanguage in homeTranslations)) {
          setCurrentLanguage(savedLanguage as Language);
        }
      } catch (error) {
        console.error('Failed to get language setting:', error);
      }
    };

    getLanguage();

    // 言語設定の変更を監視
    const watchLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
        if (savedLanguage && savedLanguage !== currentLanguage && (savedLanguage in homeTranslations)) {
          setCurrentLanguage(savedLanguage as Language);
        }
      } catch (error) {
        console.error('Failed to watch language setting:', error);
      }
    };

    const interval = setInterval(watchLanguage, 1000);
    return () => clearInterval(interval);
  }, [currentLanguage]);

  return {
    t: homeTranslations[currentLanguage],
    currentLanguage,
  };
}