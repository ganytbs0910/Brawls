// src/i18n/characterRoles.ts

// 翻訳の型定義
export type CharacterRolesTranslation = {
  roles: {
    all: string;
    tank: string;
    assassin: string;
    support: string;
    controller: string;
    attacker: string;
    sniper: string;
    grenadier: string;
  };
};

// 日本語翻訳
export const ja: CharacterRolesTranslation = {
  roles: {
    all: "すべて",
    tank: "タンク",
    assassin: "アサシン",
    support: "サポート",
    controller: "コントローラー",
    attacker: "アタッカー",
    sniper: "スナイパー",
    grenadier: "グレネーディア"
  }
};

// 英語翻訳
export const en: CharacterRolesTranslation = {
  roles: {
    all: "All",
    tank: "Tank",
    assassin: "Assassin",
    support: "Support",
    controller: "Controller",
    attacker: "Damage Dealer",
    sniper: "Marksman",
    grenadier: "Artillery"
  }
};

// 韓国語翻訳
export const ko: CharacterRolesTranslation = {
  roles: {
    all: "전체",
    tank: "탱커",
    assassin: "암살자",
    support: "서포터",
    controller: "컨트롤러",
    attacker: "공격수",
    sniper: "스나이퍼",
    grenadier: "폭격수"
  }
};

// アラビア語翻訳
export const ar: CharacterRolesTranslation = {
  roles: {
    all: "الكل",
    tank: "دبابة",
    assassin: "قاتل",
    support: "دعم",
    controller: "متحكم",
    attacker: "مهاجم",
    sniper: "قناص",
    grenadier: "قاذف قنابل"
  }
};

// フランス語翻訳
export const fr: CharacterRolesTranslation = {
  roles: {
    all: "Tous",
    tank: "Tank",
    assassin: "Assassin",
    support: "Support",
    controller: "Contrôleur",
    attacker: "Attaquant",
    sniper: "Tireur d'élite",
    grenadier: "Grenadier"
  }
};

// スペイン語翻訳
export const es: CharacterRolesTranslation = {
  roles: {
    all: "Todos",
    tank: "Tanque",
    assassin: "Asesino",
    support: "Apoyo",
    controller: "Controlador",
    attacker: "Atacante",
    sniper: "Francotirador",
    grenadier: "Granadero"
  }
};

export const zhTw: CharacterRolesTranslation = {
  roles: {
    all: "全部",
    tank: "坦克",
    assassin: "刺客",
    support: "輔助",
    controller: "控制者",
    attacker: "攻擊手",
    sniper: "狙擊手",
    grenadier: "榴彈兵"
  }
};

// 翻訳オブジェクトをまとめたもの
export const characterRolesTranslations = {
  ja,
  en,
  ko,
  ar,
  fr,
  es,
  zhTw // 台湾語を追加
} as const;

// 言語タイプの定義
export type Language = keyof typeof characterRolesTranslations;

// カスタムフック
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useCharacterRolesTranslation() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('ja');

  useEffect(() => {
    const getLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
        if (savedLanguage && (savedLanguage in characterRolesTranslations)) {
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
        if (savedLanguage && savedLanguage !== currentLanguage && (savedLanguage in characterRolesTranslations)) {
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
    t: characterRolesTranslations[currentLanguage],
    currentLanguage
  };
}