import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type PlayerInfoTranslation = {
  labels: {
    name: string;
    tag: string;
    highestTrophies: string;
    currentTrophies: string;
    level: string;
    threeVsThree: string;
    solo: string;
    duo: string;
    wins: string;
    characterList: string;
    current: string;
    highest: string;
    worldTop: string;
    loadingRankings: string;
  };
};

export const ja: PlayerInfoTranslation = {
  labels: {
    name: '名前',
    tag: 'タグ',
    highestTrophies: '最高トロフィー',
    currentTrophies: '現在トロフィー',
    level: 'レベル',
    threeVsThree: '3vs3',
    solo: 'ソロ',
    duo: 'デュオ',
    wins: '勝',
    characterList: 'キャラ一覧',
    current: '現在',
    highest: '最高',
    worldTop: '世界Top',
    loadingRankings: 'ランキング取得中...'
  }
};

export const en: PlayerInfoTranslation = {
  labels: {
    name: 'Name',
    tag: 'Tag',
    highestTrophies: 'Highest Trophies',
    currentTrophies: 'Current Trophies',
    level: 'Level',
    threeVsThree: '3vs3',
    solo: 'Solo',
    duo: 'Duo',
    wins: 'wins',
    characterList: 'Characters',
    current: 'Current',
    highest: 'Highest',
    worldTop: 'World Top',
    loadingRankings: 'Loading rankings...'
  }
};

export const ko: PlayerInfoTranslation = {
  labels: {
    name: '이름',
    tag: '태그',
    highestTrophies: '최고 트로피',
    currentTrophies: '현재 트로피',
    level: '레벨',
    threeVsThree: '3vs3',
    solo: '솔로',
    duo: '듀오',
    wins: '승',
    characterList: '캐릭터 목록',
    current: '현재',
    highest: '최고',
    worldTop: '세계 상위',
    loadingRankings: '랭킹 로딩 중...'
  }
};

// アラビア語翻訳
export const ar: PlayerInfoTranslation = {
  labels: {
    name: 'الاسم',
    tag: 'العلامة',
    highestTrophies: 'أعلى الكؤوس',
    currentTrophies: 'الكؤوس الحالية',
    level: 'المستوى',
    threeVsThree: '3vs3',
    solo: 'فردي',
    duo: 'ثنائي',
    wins: 'انتصارات',
    characterList: 'الشخصيات',
    current: 'الحالي',
    highest: 'الأعلى',
    worldTop: 'الأفضل عالمياً',
    loadingRankings: 'جاري تحميل التصنيفات...'
  }
};

// フランス語翻訳
export const fr: PlayerInfoTranslation = {
  labels: {
    name: 'Nom',
    tag: 'Tag',
    highestTrophies: 'Trophées Maximum',
    currentTrophies: 'Trophées Actuels',
    level: 'Niveau',
    threeVsThree: '3vs3',
    solo: 'Solo',
    duo: 'Duo',
    wins: 'victoires',
    characterList: 'Personnages',
    current: 'Actuel',
    highest: 'Maximum',
    worldTop: 'Top Mondial',
    loadingRankings: 'Chargement des classements...'
  }
};

// スペイン語翻訳
export const es: PlayerInfoTranslation = {
  labels: {
    name: 'Nombre',
    tag: 'Etiqueta',
    highestTrophies: 'Trofeos Máximos',
    currentTrophies: 'Trofeos Actuales',
    level: 'Nivel',
    threeVsThree: '3vs3',
    solo: 'Individual',
    duo: 'Dúo',
    wins: 'victorias',
    characterList: 'Personajes',
    current: 'Actual',
    highest: 'Máximo',
    worldTop: 'Top Mundial',
    loadingRankings: 'Cargando clasificaciones...'
  }
};

export const zhTw: PlayerInfoTranslation = {
  labels: {
    name: '名稱',
    tag: '標籤',
    highestTrophies: '最高獎盃',
    currentTrophies: '目前獎盃',
    level: '等級',
    threeVsThree: '3對3',
    solo: '單人',
    duo: '雙人',
    wins: '勝',
    characterList: '角色列表',
    current: '目前',
    highest: '最高',
    worldTop: '世界排名',
    loadingRankings: '載入排名中...'
  }
};

// 翻訳オブジェクトをまとめたもの
export const playerInfoTranslations = {
  ja,
  en,
  ko,
  ar,
  fr,
  es,
  zhTw // 台湾語を追加
} as const;

export type Language = keyof typeof playerInfoTranslations;

export function usePlayerInfoTranslation() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('ja');

  useEffect(() => {
    const getLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
        if (savedLanguage && (savedLanguage in playerInfoTranslations)) {
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
        if (savedLanguage && savedLanguage !== currentLanguage && (savedLanguage in playerInfoTranslations)) {
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
    t: playerInfoTranslations[currentLanguage],
    currentLanguage,
  };
}