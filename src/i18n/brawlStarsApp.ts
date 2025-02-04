// src/i18n/brawlStarsApp.ts

export type BrawlStarsAppTranslation = {
  header: {
    title: string;
  };
  search: {
    playerTag: string;
    placeholder: string;
    button: {
      default: string;
      loading: string;
    };
    history: {
      title: string;
    };
  };
  sections: {
    playerInfo: string;
    recentBattles: string;
  };
  loading: {
    text: string;
  };
};

export const ja: BrawlStarsAppTranslation = {
  header: {
    title: 'プレイヤー分析',
  },
  search: {
    playerTag: 'プレイヤータグ',
    placeholder: '#XXXXXXXXX',
    button: {
      default: '取得',
      loading: '読み込み中...',
    },
    history: {
      title: '検索履歴',
    },
  },
  sections: {
    playerInfo: 'プレイヤー情報',
    recentBattles: '直近の対戦',
  },
  loading: {
    text: 'データを取得中...',
  },
};

export const en: BrawlStarsAppTranslation = {
  header: {
    title: 'Player Analysis',
  },
  search: {
    playerTag: 'Player Tag',
    placeholder: '#XXXXXXXXX',
    button: {
      default: 'Search',
      loading: 'Loading...',
    },
    history: {
      title: 'Search History',
    },
  },
  sections: {
    playerInfo: 'Player Info',
    recentBattles: 'Recent Battles',
  },
  loading: {
    text: 'Fetching data...',
  },
};

export const ko: BrawlStarsAppTranslation = {
  header: {
    title: '플레이어 분석',
  },
  search: {
    playerTag: '플레이어 태그',
    placeholder: '#XXXXXXXXX',
    button: {
      default: '검색',
      loading: '로딩 중...',
    },
    history: {
      title: '검색 기록',
    },
  },
  sections: {
    playerInfo: '플레이어 정보',
    recentBattles: '최근 전투',
  },
  loading: {
    text: '데이터를 가져오는 중...',
  },
};

export const brawlStarsAppTranslations = {
  ja,
  en,
  ko,
} as const;

export type Language = keyof typeof brawlStarsAppTranslations;

// カスタムフック
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useBrawlStarsAppTranslation() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('ja');

  useEffect(() => {
    const getLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
        if (savedLanguage && (savedLanguage in brawlStarsAppTranslations)) {
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
        if (savedLanguage && savedLanguage !== currentLanguage && (savedLanguage in brawlStarsAppTranslations)) {
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
    t: brawlStarsAppTranslations[currentLanguage],
    currentLanguage,
  };
}