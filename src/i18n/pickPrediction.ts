// src/i18n/pickPrediction.ts

export type PickPredictionTranslation = {
  header: {
    banToggle: string;
    modeSelect: string;
    selectMode: string;
    reset: string;
  };
  turnAnnouncement: {
    teamTurn: (team: string) => string;
    selectBan: string;
    selectCharacter: string;
    skipTap: string;
  };
  recommendations: {
    excellent: string;
    veryGood: string;
    good: string;
    average: string;
    needsConsideration: string;
  };
  modes: {
    gemGrab: string;
    brawlBall: string;
    heist: string;
    knockout: string;
    bounty: string;
    hotZone: string;
  };
  mapSelection: {
    title: string;
    selectStage: string;
  };
};

// 日本語翻訳
export const ja: PickPredictionTranslation = {
  header: {
    banToggle: 'バン選択',
    modeSelect: 'モードを選択',
    selectMode: 'モードを選択',
    reset: 'リセット',
  },
  turnAnnouncement: {
    teamTurn: (team: string) => `チーム${team}の番！`,
    selectBan: 'バンするキャラクターを選択してください',
    selectCharacter: 'キャラクターを選択してください',
    skipTap: 'タップでスキップ',
  },
  recommendations: {
    excellent: '最高の選択',
    veryGood: '非常に良い選択',
    good: '良い選択',
    average: '標準的な選択',
    needsConsideration: '要検討',
  },
  modes: {
    gemGrab: 'エメラルドハント',
    brawlBall: 'ブロストライカー',
    heist: '強奪',
    knockout: 'ノックアウト',
    bounty: '賞金稼ぎ',
    hotZone: 'ホットゾーン',
  },
  mapSelection: {
    title: 'ステージを選択',
    selectStage: 'ステージを選択',
  },
};

// 英語翻訳
export const en: PickPredictionTranslation = {
  header: {
    banToggle: 'Enable Bans',
    modeSelect: 'Select Mode',
    selectMode: 'Select Mode',
    reset: 'Reset',
  },
  turnAnnouncement: {
    teamTurn: (team: string) => `Team ${team}'s Turn!`,
    selectBan: 'Select a character to ban',
    selectCharacter: 'Select a character',
    skipTap: 'Tap to skip',
  },
  recommendations: {
    excellent: 'Excellent Choice',
    veryGood: 'Very Good Choice',
    good: 'Good Choice',
    average: 'Average Choice',
    needsConsideration: 'Needs Consideration',
  },
  modes: {
    gemGrab: 'Gem Grab',
    brawlBall: 'Brawl Ball',
    heist: 'Heist',
    knockout: 'Knockout',
    bounty: 'Bounty',
    hotZone: 'Hot Zone',
  },
  mapSelection: {
    title: 'Select Stage',
    selectStage: 'Select Stage',
  },
};

// 韓国語翻訳
export const ko: PickPredictionTranslation = {
  header: {
    banToggle: '밴 선택',
    modeSelect: '모드 선택',
    selectMode: '모드 선택',
    reset: '리셋',
  },
  turnAnnouncement: {
    teamTurn: (team: string) => `팀 ${team} 차례!`,
    selectBan: '밴할 캐릭터를 선택하세요',
    selectCharacter: '캐릭터를 선택하세요',
    skipTap: '탭하여 건너뛰기',
  },
  recommendations: {
    excellent: '최고의 선택',
    veryGood: '매우 좋은 선택',
    good: '좋은 선택',
    average: '평균적인 선택',
    needsConsideration: '재고려 필요',
  },
  modes: {
    gemGrab: '젬 그랩',
    brawlBall: '브롤 볼',
    heist: '하이스트',
    knockout: '녹아웃',
    bounty: '바운티',
    hotZone: '핫 존',
  },
  mapSelection: {
    title: '스테이지 선택',
    selectStage: '스테이지 선택',
  },
};

// アラビア語翻訳
export const ar: PickPredictionTranslation = {
  header: {
    banToggle: 'تفعيل الحظر',
    modeSelect: 'اختيار الوضع',
    selectMode: 'اختيار الوضع',
    reset: 'إعادة تعيين',
  },
  turnAnnouncement: {
    teamTurn: (team: string) => `دور الفريق ${team}!`,
    selectBan: 'اختر شخصية لحظرها',
    selectCharacter: 'اختر شخصية',
    skipTap: 'انقر للتخطي',
  },
  recommendations: {
    excellent: 'اختيار ممتاز',
    veryGood: 'اختيار جيد جداً',
    good: 'اختيار جيد',
    average: 'اختيار متوسط',
    needsConsideration: 'يحتاج إلى دراسة',
  },
  modes: {
    gemGrab: 'جمع الجواهر',
    brawlBall: 'كرة المعركة',
    heist: 'السطو',
    knockout: 'الإقصاء',
    bounty: 'المكافأة',
    hotZone: 'المنطقة الساخنة',
  },
  mapSelection: {
    title: 'اختيار المرحلة',
    selectStage: 'اختيار المرحلة',
  },
};

// フランス語翻訳
export const fr: PickPredictionTranslation = {
  header: {
    banToggle: 'Activer les Bannissements',
    modeSelect: 'Sélection du Mode',
    selectMode: 'Sélectionner le Mode',
    reset: 'Réinitialiser',
  },
  turnAnnouncement: {
    teamTurn: (team: string) => `Tour de l'équipe ${team} !`,
    selectBan: 'Sélectionnez un personnage à bannir',
    selectCharacter: 'Sélectionnez un personnage',
    skipTap: 'Tapez pour passer',
  },
  recommendations: {
    excellent: 'Excellent Choix',
    veryGood: 'Très Bon Choix',
    good: 'Bon Choix',
    average: 'Choix Moyen',
    needsConsideration: 'À Reconsidérer',
  },
  modes: {
    gemGrab: 'Prise de Gemmes',
    brawlBall: 'Brawl Ball',
    heist: 'Braquage',
    knockout: 'Knockout',
    bounty: 'Prime',
    hotZone: 'Zone Chaude',
  },
  mapSelection: {
    title: 'Sélection du Terrain',
    selectStage: 'Sélectionner le Terrain',
  },
};

// スペイン語翻訳
export const es: PickPredictionTranslation = {
  header: {
    banToggle: 'Activar Bloqueos',
    modeSelect: 'Seleccionar Modo',
    selectMode: 'Seleccionar Modo',
    reset: 'Reiniciar',
  },
  turnAnnouncement: {
    teamTurn: (team: string) => `¡Turno del Equipo ${team}!`,
    selectBan: 'Selecciona un personaje para bloquear',
    selectCharacter: 'Selecciona un personaje',
    skipTap: 'Toca para saltar',
  },
  recommendations: {
    excellent: 'Excelente Elección',
    veryGood: 'Muy Buena Elección',
    good: 'Buena Elección',
    average: 'Elección Promedio',
    needsConsideration: 'Necesita Consideración',
  },
  modes: {
    gemGrab: 'Atrapagemas',
    brawlBall: 'Brawl Ball',
    heist: 'Atraco',
    knockout: 'Knockout',
    bounty: 'Recompensa',
    hotZone: 'Zona Caliente',
  },
  mapSelection: {
    title: 'Seleccionar Escenario',
    selectStage: 'Seleccionar Escenario',
  },
};

// 台湾語翻訳
export const zhTw: PickPredictionTranslation = {
  header: {
    banToggle: '啟用禁用',
    modeSelect: '選擇模式',
    selectMode: '選擇模式',
    reset: '重置',
  },
  turnAnnouncement: {
    teamTurn: (team: string) => `${team}隊伍回合！`,
    selectBan: '選擇要禁用的角色',
    selectCharacter: '選擇角色',
    skipTap: '點擊跳過',
  },
  recommendations: {
    excellent: '極佳選擇',
    veryGood: '非常好的選擇',
    good: '好選擇',
    average: '普通選擇',
    needsConsideration: '需要考慮',
  },
  modes: {
    gemGrab: '寶石爭奪',
    brawlBall: '荒野足球',
    heist: '金庫搶奪',
    knockout: '淘汰賽',
    bounty: '賞金獵人',
    hotZone: '熱區爭奪',
  },
  mapSelection: {
    title: '選擇地圖',
    selectStage: '選擇地圖',
  },
};

// 翻訳オブジェクトをまとめたもの
export const pickPredictionTranslations = {
  ja,
  en,
  ko,
  ar,
  fr,
  es,
  zhTw // 台湾語を追加
} as const;

// 言語タイプの定義
export type Language = keyof typeof pickPredictionTranslations;

// カスタムフック
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function usePickPredictionTranslation() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('ja');

  useEffect(() => {
    const getLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
        if (savedLanguage && (savedLanguage in pickPredictionTranslations)) {
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
        if (savedLanguage && savedLanguage !== currentLanguage && (savedLanguage in pickPredictionTranslations)) {
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
    t: pickPredictionTranslations[currentLanguage],
    currentLanguage,
  };
}