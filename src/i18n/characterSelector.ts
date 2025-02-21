// src/i18n/characterSelector.ts

// 翻訳の型定義
export type CharacterSelectorTranslation = {
  modalTitle: string;
  selectCharacter: string;
  maxSelectionsInfo: string;
  cancel: string;
  confirm: string;
  errors: {
    required: string;
    maxSelection: string;
  };
};

// 日本語翻訳
export const ja: CharacterSelectorTranslation = {
  modalTitle: 'キャラクター選択',
  selectCharacter: 'キャラクターを選択',
  maxSelectionsInfo: '(最大{count}体)',
  cancel: 'キャンセル',
  confirm: '確定',
  errors: {
    required: 'このキャラクター選択は必須です',
    maxSelection: '最大{count}体まで選択できます'
  }
};

// 英語翻訳
export const en: CharacterSelectorTranslation = {
  modalTitle: 'Select Character',
  selectCharacter: 'Select Character',
  maxSelectionsInfo: '(Max {count})',
  cancel: 'Cancel',
  confirm: 'Confirm',
  errors: {
    required: 'Character selection is required',
    maxSelection: 'You can select up to {count} characters'
  }
};

// 韓国語翻訳
export const ko: CharacterSelectorTranslation = {
  modalTitle: '캐릭터 선택',
  selectCharacter: '캐릭터 선택',
  maxSelectionsInfo: '(최대 {count}개)',
  cancel: '취소',
  confirm: '확인',
  errors: {
    required: '캐릭터 선택은 필수입니다',
    maxSelection: '최대 {count}개까지 선택할 수 있습니다'
  }
};

// アラビア語翻訳
export const ar: CharacterSelectorTranslation = {
  modalTitle: 'اختيار الشخصية',
  selectCharacter: 'اختر الشخصية',
  maxSelectionsInfo: '(الحد الأقصى {count})',
  cancel: 'إلغاء',
  confirm: 'تأكيد',
  errors: {
    required: 'اختيار الشخصية مطلوب',
    maxSelection: 'يمكنك اختيار حتى {count} شخصيات'
  }
};

// フランス語翻訳
export const fr: CharacterSelectorTranslation = {
  modalTitle: 'Sélection du Personnage',
  selectCharacter: 'Sélectionner un Personnage',
  maxSelectionsInfo: '(Maximum {count})',
  cancel: 'Annuler',
  confirm: 'Confirmer',
  errors: {
    required: 'La sélection du personnage est requise',
    maxSelection: 'Vous pouvez sélectionner jusqu\'à {count} personnages'
  }
};

// スペイン語翻訳
export const es: CharacterSelectorTranslation = {
  modalTitle: 'Seleccionar Personaje',
  selectCharacter: 'Seleccionar Personaje',
  maxSelectionsInfo: '(Máximo {count})',
  cancel: 'Cancelar',
  confirm: 'Confirmar',
  errors: {
    required: 'La selección de personaje es obligatoria',
    maxSelection: 'Puedes seleccionar hasta {count} personajes'
  }
};

export const zhTw: CharacterSelectorTranslation = {
  modalTitle: '選擇角色',
  selectCharacter: '選擇角色',
  maxSelectionsInfo: '(最多{count}個)',
  cancel: '取消',
  confirm: '確認',
  errors: {
    required: '必須選擇角色',
    maxSelection: '最多只能選擇{count}個角色'
  }
};

// 翻訳オブジェクトをまとめたもの
export const characterSelectorTranslations = {
  ja,
  en,
  ko,
  ar,
  fr,
  es,
  zhTw // 台湾語を追加
} as const;

// 言語タイプの定義
export type Language = keyof typeof characterSelectorTranslations;

// カスタムフック
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useCharacterSelectorTranslation() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('ja');

  useEffect(() => {
    const getLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
        if (savedLanguage && (savedLanguage in characterSelectorTranslations)) {
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
        if (savedLanguage && savedLanguage !== currentLanguage && (savedLanguage in characterSelectorTranslations)) {
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
    t: characterSelectorTranslations[currentLanguage],
    currentLanguage
  };
}