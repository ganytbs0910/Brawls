// i18n/mapDetail.ts
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type MapDetailTranslation = {
  error: {
    mapNotFound: string;
  };
  sections: {
    mapDescription: string;
    recommendedBrawlers: string;
  };
  powerLevels: {
    optimal: string;
    suitable: string;
    usable: string;
  };
  brawler: {
    powerRating: string;
  };
};

export const ja: MapDetailTranslation = {
  error: {
    mapNotFound: 'マップ情報が見つかりませんでした',
  },
  sections: {
    mapDescription: 'マップ説明',
    recommendedBrawlers: 'おすすめキャラ',
  },
  powerLevels: {
    optimal: '最適性 (4-5点)',
    suitable: '適正 (2-3点)',
    usable: '使える (1点)',
  },
  brawler: {
    powerRating: '{power}/5',
  },
};

export const en: MapDetailTranslation = {
  error: {
    mapNotFound: 'Map information not found',
  },
  sections: {
    mapDescription: 'Map Description',
    recommendedBrawlers: 'Recommended Brawlers',
  },
  powerLevels: {
    optimal: 'Optimal (4-5 points)',
    suitable: 'Suitable (2-3 points)',
    usable: 'Usable (1 point)',
  },
  brawler: {
    powerRating: '{power}/5',
  },
};

export const ko: MapDetailTranslation = {
  error: {
    mapNotFound: '맵 정보를 찾을 수 없습니다',
  },
  sections: {
    mapDescription: '맵 설명',
    recommendedBrawlers: '추천 캐릭터',
  },
  powerLevels: {
    optimal: '최적 (4-5점)',
    suitable: '적합 (2-3점)',
    usable: '사용 가능 (1점)',
  },
  brawler: {
    powerRating: '{power}/5',
  },
};

export const mapDetailTranslations = {
  ja,
  en,
  ko,
} as const;

export type Language = keyof typeof mapDetailTranslations;

export function useMapDetailTranslation() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('ja');

  useEffect(() => {
    const getLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
        if (savedLanguage && (savedLanguage in mapDetailTranslations)) {
          setCurrentLanguage(savedLanguage as Language);
        }
      } catch (error) {
        console.error('Failed to get language setting:', error);
      }
    };

    getLanguage();

    const watchLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
        if (savedLanguage && savedLanguage !== currentLanguage && (savedLanguage in mapDetailTranslations)) {
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
    t: mapDetailTranslations[currentLanguage],
    currentLanguage,
  };
}