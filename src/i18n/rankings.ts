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

// アラビア語翻訳
export const ar: RankingsTranslation = {
  title: "تصنيف الشخصيات",
  rankLabel: "",  // アラビア語では順位の後ろに何もつけない
  loading: "جاري التحميل..."
};

// フランス語翻訳
export const fr: RankingsTranslation = {
  title: "Classement des Personnages",
  rankLabel: "e",  // フランス語では1er, 2e, 3eのように表記
  loading: "Chargement..."
};

// スペイン語翻訳
export const es: RankingsTranslation = {
  title: "Clasificación de Personajes",
  rankLabel: "º",  // スペイン語では1º, 2º, 3ºのように表記
  loading: "Cargando..."
};

// 台湾語（繁体中文）翻訳
export const zhTw: RankingsTranslation = {
  title: "角色排名",
  rankLabel: "名",  // 台湾語では順位の後ろに「名」をつける
  loading: "載入中..."
};

// 翻訳オブジェクトをまとめたもの
export const rankingsTranslations = {
  ja,
  en,
  ko,
  ar,
  fr,
  es,
  zhTw
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