// src/i18n/battleLog.ts

export type BattleLogTranslation = {
  overview: {
    title: string;
    stats: {
      winRate: string;
      victories: string;
      draws: string;
      defeats: string;
    };
  };
  details: {
    title: string;
    noData: string;
    showMore: (count: number) => string;
  };
  battle: {
    results: {
      victory: string;
      defeat: string;
      draw: string;
      unknown: string;
    };
    mode: {
      friendly: string;
      gemGrab: string;
      brawlBall: string;
      bounty: string;
      heist: string;
      hotZone: string;
      wipeOut: string;
      knockout: string;
      duels: string;
      soloShowdown: string;
      duoShowdown: string;
      showdown: string;
      basketBrawl: string;
      payLoad: string;
    };
    mapPrefix: string; // " - " のような接頭辞
    vs: string;
  };
};

// 日本語翻訳
export const ja: BattleLogTranslation = {
  overview: {
    title: 'バトル概要',
    stats: {
      winRate: '勝率',
      victories: '勝利',
      draws: '引き分け',
      defeats: '敗北',
    },
  },
  details: {
    title: 'バトルの詳細',
    noData: '表示できる対戦記録がありません',
    showMore: (count: number) => `さらに${count}件の記録を見る`,
  },
  battle: {
    results: {
      victory: 'VICTORY',
      defeat: 'DEFEAT',
      draw: 'DRAW',
      unknown: 'Unknown',
    },
    mode: {
      friendly: 'フレンドバトル',
      gemGrab: 'ジェムグラブ',
      brawlBall: 'ブロストライカー',
      bounty: '賞金稼ぎ',
      heist: '強奪',
      hotZone: 'ホットゾーン',
      wipeOut: 'ワイプアウト',
      knockout: 'ノックアウト',
      duels: 'デュエル',
      soloShowdown: 'ソロバトルロワイヤル',
      duoShowdown: 'デュオバトルロワイヤル',
      showdown: 'バトルロワイヤル',
      basketBrawl: 'バスケブロール',
      payLoad: 'ペイロード',
    },
    mapPrefix: ' - ',
    vs: 'VS',
  },
};

// 英語翻訳
export const en: BattleLogTranslation = {
  overview: {
    title: 'Battle Overview',
    stats: {
      winRate: 'Win Rate',
      victories: 'Victories',
      draws: 'Draws',
      defeats: 'Defeats',
    },
  },
  details: {
    title: 'Battle Details',
    noData: 'No battle records available',
    showMore: (count: number) => `Show ${count} more records`,
  },
  battle: {
    results: {
      victory: 'VICTORY',
      defeat: 'DEFEAT',
      draw: 'DRAW',
      unknown: 'Unknown',
    },
    mode: {
      friendly: 'Friendly Battle',
      gemGrab: 'Gem Grab',
      brawlBall: 'Brawl Ball',
      bounty: 'Bounty',
      heist: 'Heist',
      hotZone: 'Hot Zone',
      wipeOut: 'Wipe Out',
      knockout: 'Knockout',
      duels: 'Duels',
      soloShowdown: 'Solo Showdown',
      duoShowdown: 'Duo Showdown',
      showdown: 'Showdown',
      basketBrawl: 'Basket Brawl',
      payLoad: 'Payload',
    },
    mapPrefix: ' - ',
    vs: 'VS',
  },
};

// 韓国語翻訳
export const ko: BattleLogTranslation = {
  overview: {
    title: '배틀 개요',
    stats: {
      winRate: '승률',
      victories: '승리',
      draws: '무승부',
      defeats: '패배',
    },
  },
  details: {
    title: '배틀 상세',
    noData: '표시할 전투 기록이 없습니다',
    showMore: (count: number) => `${count}개 더 보기`,
  },
  battle: {
    results: {
      victory: 'VICTORY',
      defeat: 'DEFEAT',
      draw: 'DRAW',
      unknown: 'Unknown',
    },
    mode: {
      friendly: '친선전',
      gemGrab: '젬 그랩',
      brawlBall: '브롤 볼',
      bounty: '바운티',
      heist: '하이스트',
      hotZone: '핫 존',
      wipeOut: '와이프 아웃',
      knockout: '녹아웃',
      duels: '결투',
      soloShowdown: '솔로 쇼다운',
      duoShowdown: '듀오 쇼다운',
      showdown: '쇼다운',
      basketBrawl: '농구 브롤',
      payLoad: '페이로드',
    },
    mapPrefix: ' - ',
    vs: 'VS',
  },
};

// 翻訳オブジェクトをまとめたもの
export const battleLogTranslations = {
  ja,
  en,
  ko,
} as const;

// 言語タイプの定義
export type Language = keyof typeof battleLogTranslations;

// カスタムフック
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useBattleLogTranslation() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('ja');

  useEffect(() => {
    const getLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
        if (savedLanguage && (savedLanguage in battleLogTranslations)) {
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
        if (savedLanguage && savedLanguage !== currentLanguage && (savedLanguage in battleLogTranslations)) {
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
    t: battleLogTranslations[currentLanguage],
    currentLanguage,
  };
}