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
    battleRoyale: 'Battle Royale',
    gemGrab: 'Atrapagemas',
    heist: 'Atraco',
    hotZone: 'Zona Candente',
    brawlBall: 'Brawl Ball',
    brawlBall5v5: 'Brawl Ball 5v5',
    bounty: 'Recompensa',
    knockout: 'Knockout',
    annihilation: 'Aniquilación',
    duel: 'Duelo',
    duelRotating: 'Duelo & Aniquilación & Recompensa',
  },
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
    battleRoyale: 'باتل رويال',
    gemGrab: 'جمع الجواهر',
    heist: 'السطو',
    hotZone: 'المنطقة الساخنة',
    brawlBall: 'كرة براول',
    brawlBall5v5: 'كرة براول 5 ضد 5',
    bounty: 'المكافأة',
    knockout: 'الإقصاء',
    annihilation: 'الإبادة',
    duel: 'المبارزة',
    duelRotating: 'مبارزة وإبادة ومكافأة',
  },
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
    battleRoyale: 'Battle Royale',
    gemGrab: 'Chasse aux Gemmes',
    heist: 'Braquage',
    hotZone: 'Zone Chaude',
    brawlBall: 'Foot Brawl',
    brawlBall5v5: 'Foot Brawl 5v5',
    bounty: 'Prime',
    knockout: 'Knockout',
    annihilation: 'Annihilation',
    duel: 'Duel',
    duelRotating: 'Duel & Annihilation & Prime',
  },
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
    battleRoyale: '大逃殺',
    gemGrab: '寶石爭奪',
    heist: '金庫搶奪',
    hotZone: '熱區爭奪',
    brawlBall: '荒野足球',
    brawlBall5v5: '5對5荒野足球',
    bounty: '賞金獵人',
    knockout: '淘汰賽',
    annihilation: '殲滅戰',
    duel: '決鬥',
    duelRotating: '決鬥 & 殲滅戰 & 賞金獵人',
  },
};

// 翻訳オブジェクトをまとめたもの
export const homeTranslations = {
  ja,
  en,
  ko,
  es,
  ar,
  fr,
  zhTw // 台湾語を追加
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