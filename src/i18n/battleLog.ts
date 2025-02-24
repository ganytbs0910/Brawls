// src/i18n/battleLog.ts
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language } from '../data/modeData';

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
    loading: string;
    showMore: (count: number) => string;
  };
  battle: {
    results: {
      victory: string;
      defeat: string;
      draw: string;
      unknown: string;
    };
    mapPrefix: string;
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
    loading: '読み込み中...',
    showMore: (count: number) => `さらに${count}件の記録を見る`,
  },
  battle: {
    results: {
      victory: 'VICTORY',
      defeat: 'DEFEAT',
      draw: 'DRAW',
      unknown: 'Unknown',
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
    loading: 'Loading...',
    showMore: (count: number) => `Show ${count} more records`,
  },
  battle: {
    results: {
      victory: 'VICTORY',
      defeat: 'DEFEAT',
      draw: 'DRAW',
      unknown: 'Unknown',
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
    loading: '로딩 중...',
    showMore: (count: number) => `${count}개 더 보기`,
  },
  battle: {
    results: {
      victory: 'VICTORY',
      defeat: 'DEFEAT',
      draw: 'DRAW',
      unknown: 'Unknown',
    },
    mapPrefix: ' - ',
    vs: 'VS',
  },
};

// スペイン語翻訳
export const es: BattleLogTranslation = {
  overview: {
    title: 'Resumen de Batalla',
    stats: {
      winRate: 'Tasa de Victoria',
      victories: 'Victorias',
      draws: 'Empates',
      defeats: 'Derrotas',
    },
  },
  details: {
    title: 'Detalles de Batalla',
    noData: 'No hay registros de batalla disponibles',
    loading: 'Cargando...',
    showMore: (count: number) => `Mostrar ${count} registros más`,
  },
  battle: {
    results: {
      victory: 'VICTORIA',
      defeat: 'DERROTA',
      draw: 'EMPATE',
      unknown: 'Desconocido',
    },
    mapPrefix: ' - ',
    vs: 'VS',
  },
};

// アラビア語翻訳
export const ar: BattleLogTranslation = {
  overview: {
    title: 'نظرة عامة على المعركة',
    stats: {
      winRate: 'معدل الفوز',
      victories: 'انتصارات',
      draws: 'تعادلات',
      defeats: 'هزائم',
    },
  },
  details: {
    title: 'تفاصيل المعركة',
    noData: 'لا توجد سجلات معارك متاحة',
    loading: 'جار التحميل...',
    showMore: (count: number) => `عرض ${count} سجلات إضافية`,
  },
  battle: {
    results: {
      victory: 'فوز',
      defeat: 'هزيمة',
      draw: 'تعادل',
      unknown: 'غير معروف',
    },
    mapPrefix: ' - ',
    vs: 'ضد',
  },
};

// フランス語翻訳
export const fr: BattleLogTranslation = {
  overview: {
    title: 'Aperçu des Batailles',
    stats: {
      winRate: 'Taux de Victoire',
      victories: 'Victoires',
      draws: 'Égalités',
      defeats: 'Défaites',
    },
  },
  details: {
    title: 'Détails des Batailles',
    noData: 'Aucun enregistrement de bataille disponible',
    loading: 'Chargement...',
    showMore: (count: number) => `Afficher ${count} enregistrements supplémentaires`,
  },
  battle: {
    results: {
      victory: 'VICTOIRE',
      defeat: 'DÉFAITE',
      draw: 'ÉGALITÉ',
      unknown: 'Inconnu',
    },
    mapPrefix: ' - ',
    vs: 'VS',
  },
};

// 中国語（繁体字）翻訳
export const zhTw: BattleLogTranslation = {
  overview: {
    title: '對戰概覽',
    stats: {
      winRate: '勝率',
      victories: '勝利',
      draws: '平手',
      defeats: '敗北',
    },
  },
  details: {
    title: '對戰詳情',
    noData: '沒有可顯示的對戰記錄',
    loading: '載入中...',
    showMore: (count: number) => `顯示${count}筆更多記錄`,
  },
  battle: {
    results: {
      victory: '勝利',
      defeat: '失敗',
      draw: '平手',
      unknown: '未知',
    },
    mapPrefix: ' - ',
    vs: 'VS',
  },
};

// 翻訳オブジェクトを更新
export const battleLogTranslations = {
  ja,
  en,
  ko,
  es,
  ar,
  fr,
  zhTw,
} as const;

// カスタムフック
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