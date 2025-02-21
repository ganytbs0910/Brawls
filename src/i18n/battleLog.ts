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
      gemGrab: 'エメラルドハント',
      brawlBall: 'ブロストライカー',
      bounty: '賞金稼ぎ',
      heist: '強奪',
      hotZone: 'ホットゾーン',
      wipeOut: '殲滅',
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
    showMore: (count: number) => `Mostrar ${count} registros más`,
  },
  battle: {
    results: {
      victory: 'VICTORIA',
      defeat: 'DERROTA',
      draw: 'EMPATE',
      unknown: 'Desconocido',
    },
    mode: {
      friendly: 'Batalla Amistosa',
      gemGrab: 'Atrapagemas',
      brawlBall: 'Brawl Ball',
      bounty: 'Recompensa',
      heist: 'Atraco',
      hotZone: 'Zona Candente',
      wipeOut: 'Aniquilación',
      knockout: 'Knockout',
      duels: 'Duelos',
      soloShowdown: 'Showdown Solo',
      duoShowdown: 'Showdown Dúo',
      showdown: 'Showdown',
      basketBrawl: 'Baloncesto Brawl',
      payLoad: 'Carga',
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
    showMore: (count: number) => `عرض ${count} سجلات إضافية`,
  },
  battle: {
    results: {
      victory: 'فوز',
      defeat: 'هزيمة',
      draw: 'تعادل',
      unknown: 'غير معروف',
    },
    mode: {
      friendly: 'معركة ودية',
      gemGrab: 'جمع الجواهر',
      brawlBall: 'كرة براول',
      bounty: 'المكافأة',
      heist: 'السطو',
      hotZone: 'المنطقة الساخنة',
      wipeOut: 'الإبادة',
      knockout: 'الإقصاء',
      duels: 'المبارزة',
      soloShowdown: 'شوداون فردي',
      duoShowdown: 'شوداون ثنائي',
      showdown: 'شوداون',
      basketBrawl: 'سلة براول',
      payLoad: 'الحمولة',
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
    showMore: (count: number) => `Afficher ${count} enregistrements supplémentaires`,
  },
  battle: {
    results: {
      victory: 'VICTOIRE',
      defeat: 'DÉFAITE',
      draw: 'ÉGALITÉ',
      unknown: 'Inconnu',
    },
    mode: {
      friendly: 'Bataille Amicale',
      gemGrab: 'Chasse aux Gemmes',
      brawlBall: 'Foot Brawl',
      bounty: 'Prime',
      heist: 'Braquage',
      hotZone: 'Zone Chaude',
      wipeOut: 'Annihilation',
      knockout: 'Knockout',
      duels: 'Duels',
      soloShowdown: 'Showdown Solo',
      duoShowdown: 'Showdown Duo',
      showdown: 'Showdown',
      basketBrawl: 'Basket Brawl',
      payLoad: 'Convoi',
    },
    mapPrefix: ' - ',
    vs: 'VS',
  },
};

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
    showMore: (count: number) => `顯示${count}筆更多記錄`,
  },
  battle: {
    results: {
      victory: '勝利',
      defeat: '失敗',
      draw: '平手',
      unknown: '未知',
    },
    mode: {
      friendly: '友誼賽',
      gemGrab: '寶石爭奪',
      brawlBall: '荒野足球',
      bounty: '賞金獵人',
      heist: '保險箱保衛',
      hotZone: '熱區爭奪',
      wipeOut: '殲滅模式',
      knockout: '淘汰賽',
      duels: '決鬥',
      soloShowdown: '單人生存',
      duoShowdown: '雙人生存',
      showdown: '生存模式',
      basketBrawl: '荒野籃球',
      payLoad: '推車護送',
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
  'zh-tw': zhTw,
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