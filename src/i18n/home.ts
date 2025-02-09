// src/i18n/home.ts

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
    battleRoyale: string;
    gemGrab: string;
    heist: string;
    hotZone: string;
    brawlBall: string;
    brawlBall5v5: string;
    bounty: string;
    knockout: string;
    annihilation: string;
    duel: string;
    duelRotating: string;
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
    battleRoyale: 'バトルロワイヤル',
    gemGrab: 'エメラルドハント',
    heist: '強奪',
    hotZone: 'ホットゾーン',
    brawlBall: 'ブロストライカー',
    brawlBall5v5: '5vs5ブロストライカー',
    bounty: '賞金稼ぎ',
    knockout: 'ノックアウト',
    annihilation: '殲滅',
    duel: 'デュエル',
    duelRotating: 'デュエル＆殲滅＆賞金稼ぎ',
  },
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
    battleRoyale: 'Battle Royale',
    gemGrab: 'Gem Grab',
    heist: 'Heist',
    hotZone: 'Hot Zone',
    brawlBall: 'Brawl Ball',
    brawlBall5v5: '5v5 Brawl Ball',
    bounty: 'Bounty',
    knockout: 'Knockout',
    annihilation: 'Annihilation',
    duel: 'Duel',
    duelRotating: 'Duel & Annihilation & Bounty',
  },
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
    battleRoyale: '배틀로얄',
    gemGrab: '젬 그랩',
    heist: '하이스트',
    hotZone: '핫 존',
    brawlBall: '브롤 볼',
    brawlBall5v5: '5대5 브롤 볼',
    bounty: '바운티',
    knockout: '녹아웃',
    annihilation: '섬멸전',
    duel: '결투',
    duelRotating: '결투 & 섬멸전 & 바운티',
  },
};

// 翻訳オブジェクトをまとめたもの
export const homeTranslations = {
  ja,
  en,
  ko,
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