// src/i18n/teamSection.ts

// 翻訳の型定義
export type TeamSectionTranslation = {
  teamLabel: string;
  ban: string;
  emptySlot: string;
};

// 日本語翻訳
export const ja: TeamSectionTranslation = {
  teamLabel: 'チーム',
  ban: 'BAN',
  emptySlot: '未選択',
};

// 英語翻訳
export const en: TeamSectionTranslation = {
  teamLabel: 'Team',
  ban: 'BAN',
  emptySlot: 'Empty',
};

// 韓国語翻訳
export const ko: TeamSectionTranslation = {
  teamLabel: '팀',
  ban: '밴',
  emptySlot: '미선택',
};

export const ar: TeamSectionTranslation = {
  teamLabel: 'الفريق',
  ban: 'حظر',
  emptySlot: 'فارغ',
};

export const fr: TeamSectionTranslation = {
  teamLabel: 'Équipe',
  ban: 'BAN',
  emptySlot: 'Vide',
};

export const es: TeamSectionTranslation = {
  teamLabel: 'Equipo',
  ban: 'BAN',
  emptySlot: 'Vacío',
};

export const zhTw: TeamSectionTranslation = {
  teamLabel: '隊伍',
  ban: '禁用',
  emptySlot: '未選擇',
};

// Update translations object
export const teamSectionTranslations = {
  ja,
  en,
  ko,
  ar,
  fr,
  es,
  zhTw
} as const;

// 言語タイプの定義
export type Language = keyof typeof teamSectionTranslations;

// カスタムフック
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useTeamSectionTranslation() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('ja');

  useEffect(() => {
    const getLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
        if (savedLanguage && (savedLanguage in teamSectionTranslations)) {
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
        if (savedLanguage && savedLanguage !== currentLanguage && (savedLanguage in teamSectionTranslations)) {
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
    t: teamSectionTranslations[currentLanguage],
    currentLanguage
  };
}