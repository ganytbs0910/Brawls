// src/i18n/characterRouletteScreen.ts
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type CharacterRouletteTranslation = {
  header: {
    title: string;
  };
  content: {
    loading: string;
    placeholder: string;
    resultTagline: string;
    totalCharacters: string;
  };
  buttons: {
    start: string;
    spinAgain: string;
    spinning: string;
  };
};

export const ja: CharacterRouletteTranslation = {
  header: {
    title: 'キャラクタールーレット',
  },
  content: {
    loading: 'キャラクターをロード中...',
    placeholder: 'ボタンを押して、ランダムなキャラクターを選択してください',
    resultTagline: 'ルーレットの結果はこのキャラクター！',
    totalCharacters: '合計キャラクター数: {count}',
  },
  buttons: {
    start: 'ルーレットスタート！',
    spinAgain: 'もう一度選択',
    spinning: '選択中...',
  },
};

export const en: CharacterRouletteTranslation = {
  header: {
    title: 'Character Roulette',
  },
  content: {
    loading: 'Loading characters...',
    placeholder: 'Press the button to select a random character',
    resultTagline: 'Your roulette result is this character!',
    totalCharacters: 'Total characters: {count}',
  },
  buttons: {
    start: 'Spin the Roulette!',
    spinAgain: 'Spin Again',
    spinning: 'Spinning...',
  },
};

export const ko: CharacterRouletteTranslation = {
  header: {
    title: '캐릭터 룰렛',
  },
  content: {
    loading: '캐릭터 로딩 중...',
    placeholder: '버튼을 눌러 랜덤 캐릭터를 선택하세요',
    resultTagline: '룰렛 결과는 이 캐릭터입니다!',
    totalCharacters: '총 캐릭터 수: {count}',
  },
  buttons: {
    start: '룰렛 시작!',
    spinAgain: '다시 돌리기',
    spinning: '선택 중...',
  },
};

export const es: CharacterRouletteTranslation = {
  header: {
    title: 'Ruleta de Personajes',
  },
  content: {
    loading: 'Cargando personajes...',
    placeholder: 'Presiona el botón para seleccionar un personaje aleatorio',
    resultTagline: '¡El resultado de la ruleta es este personaje!',
    totalCharacters: 'Total de personajes: {count}',
  },
  buttons: {
    start: '¡Girar la Ruleta!',
    spinAgain: 'Girar de Nuevo',
    spinning: 'Girando...',
  },
};

export const ar: CharacterRouletteTranslation = {
  header: {
    title: 'عجلة الشخصيات',
  },
  content: {
    loading: 'جاري تحميل الشخصيات...',
    placeholder: 'اضغط على الزر لاختيار شخصية عشوائية',
    resultTagline: 'نتيجة العجلة هي هذه الشخصية!',
    totalCharacters: 'إجمالي الشخصيات: {count}',
  },
  buttons: {
    start: 'تدوير العجلة!',
    spinAgain: 'تدوير مرة أخرى',
    spinning: 'جاري التدوير...',
  },
};

export const fr: CharacterRouletteTranslation = {
  header: {
    title: 'Roulette des Personnages',
  },
  content: {
    loading: 'Chargement des personnages...',
    placeholder: 'Appuyez sur le bouton pour sélectionner un personnage aléatoire',
    resultTagline: 'Le résultat de la roulette est ce personnage !',
    totalCharacters: 'Nombre total de personnages : {count}',
  },
  buttons: {
    start: 'Faire Tourner la Roulette !',
    spinAgain: 'Tourner à Nouveau',
    spinning: 'En rotation...',
  },
};

export const zhTw: CharacterRouletteTranslation = {
  header: {
    title: '角色輪盤',
  },
  content: {
    loading: '正在加載角色...',
    placeholder: '按下按鈕選擇隨機角色',
    resultTagline: '輪盤結果是這個角色！',
    totalCharacters: '總角色數：{count}',
  },
  buttons: {
    start: '轉動輪盤！',
    spinAgain: '再次轉動',
    spinning: '轉動中...',
  },
};

export const characterRouletteTranslations = {
  ja,
  en,
  ko,
  es,
  ar,
  fr,
  zhTw,
} as const;

export type Language = keyof typeof characterRouletteTranslations;

export function useCharacterRouletteTranslation() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('ja');

  useEffect(() => {
    const getLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
        if (savedLanguage && (savedLanguage in characterRouletteTranslations)) {
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
        if (savedLanguage && savedLanguage !== currentLanguage && (savedLanguage in characterRouletteTranslations)) {
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
    t: characterRouletteTranslations[currentLanguage],
    currentLanguage,
  };
}