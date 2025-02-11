// src/i18n/rankings.ts

// 翻訳の型定義
export type RankingsTranslation = {
  title: string;
  rankLabel: string;
  loading: string;
};

// 日本語翻訳
export const ja: RankingsTranslation = {
  title: "キャラクターランキング",
  rankLabel: "位",
  loading: "読み込み中..."
};

// 英語翻訳
export const en: RankingsTranslation = {
  title: "Character Rankings",
  rankLabel: "",  // 英語では順位の後ろに何もつけない
  loading: "Loading..."
};

// 韓国語翻訳
export const ko: RankingsTranslation = {
  title: "캐릭터 랭킹",
  rankLabel: "위",
  loading: "로딩 중..."
};

// 翻訳オブジェクトをまとめたもの
export const rankingsTranslations = {
  ja,
  en,
  ko
} as const;

// 言語タイプの定義
export type Language = keyof typeof rankingsTranslations;

// カスタムフック
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useRankingsTranslation() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('ja');

  useEffect(() => {
    const getLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
        if (savedLanguage && (savedLanguage in rankingsTranslations)) {
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
        if (savedLanguage && savedLanguage !== currentLanguage && (savedLanguage in rankingsTranslations)) {
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
    t: rankingsTranslations[currentLanguage],
    currentLanguage
  };
}