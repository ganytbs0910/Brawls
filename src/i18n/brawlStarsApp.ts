// src/i18n/brawlStarsApp.ts

export type BrawlStarsAppTranslation = {
  header: {
    title: string;
  };
  search: {
    playerTag: string;
    placeholder: string;
    button: {
      default: string;
      loading: string;
    };
    history: {
      title: string;
    };
  };
  sections: {
    playerInfo: string;
    recentBattles: string;
  };
  loading: {
    text: string;
  };
};

export const ja: BrawlStarsAppTranslation = {
  header: {
    title: 'プレイヤー分析',
  },
  search: {
    playerTag: 'プレイヤータグ',
    placeholder: '#XXXXXXXXX',
    button: {
      default: '取得',
      loading: '読み込み中...',
    },
    history: {
      title: '検索履歴',
    },
  },
  sections: {
    playerInfo: 'プレイヤー情報',
    recentBattles: '直近の対戦',
  },
  loading: {
    text: 'データを取得中...',
  },
};

export const en: BrawlStarsAppTranslation = {
  header: {
    title: 'Player Analysis',
  },
  search: {
    playerTag: 'Player Tag',
    placeholder: '#XXXXXXXXX',
    button: {
      default: 'Search',
      loading: 'Loading...',
    },
    history: {
      title: 'Search History',
    },
  },
  sections: {
    playerInfo: 'Player Info',
    recentBattles: 'Recent Battles',
  },
  loading: {
    text: 'Fetching data...',
  },
};

export const ko: BrawlStarsAppTranslation = {
  header: {
    title: '플레이어 분석',
  },
  search: {
    playerTag: '플레이어 태그',
    placeholder: '#XXXXXXXXX',
    button: {
      default: '검색',
      loading: '로딩 중...',
    },
    history: {
      title: '검색 기록',
    },
  },
  sections: {
    playerInfo: '플레이어 정보',
    recentBattles: '최근 전투',
  },
  loading: {
    text: '데이터를 가져오는 중...',
  },
};

export const es: BrawlStarsAppTranslation = {
  header: {
    title: 'Análisis de Jugador',
  },
  search: {
    playerTag: 'Etiqueta de Jugador',
    placeholder: '#XXXXXXXXX',
    button: {
      default: 'Buscar',
      loading: 'Cargando...',
    },
    history: {
      title: 'Historial de Búsqueda',
    },
  },
  sections: {
    playerInfo: 'Información del Jugador',
    recentBattles: 'Batallas Recientes',
  },
  loading: {
    text: 'Obteniendo datos...',
  },
};

// アラビア語翻訳
export const ar: BrawlStarsAppTranslation = {
  header: {
    title: 'تحليل اللاعب',
  },
  search: {
    playerTag: 'رمز اللاعب',
    placeholder: '#XXXXXXXXX',
    button: {
      default: 'بحث',
      loading: 'جارٍ التحميل...',
    },
    history: {
      title: 'سجل البحث',
    },
  },
  sections: {
    playerInfo: 'معلومات اللاعب',
    recentBattles: 'المعارك الأخيرة',
  },
  loading: {
    text: 'جارٍ جلب البيانات...',
  },
};

// フランス語翻訳
export const fr: BrawlStarsAppTranslation = {
  header: {
    title: 'Analyse du Joueur',
  },
  search: {
    playerTag: 'Tag du Joueur',
    placeholder: '#XXXXXXXXX',
    button: {
      default: 'Rechercher',
      loading: 'Chargement...',
    },
    history: {
      title: 'Historique de Recherche',
    },
  },
  sections: {
    playerInfo: 'Informations du Joueur',
    recentBattles: 'Batailles Récentes',
  },
  loading: {
    text: 'Récupération des données...',
  },
};

// 台湾語（繁体中文）翻訳
export const zhTw: BrawlStarsAppTranslation = {
  header: {
    title: '玩家分析',
  },
  search: {
    playerTag: '玩家標籤',
    placeholder: '#XXXXXXXXX',
    button: {
      default: '搜尋',
      loading: '載入中...',
    },
    history: {
      title: '搜尋記錄',
    },
  },
  sections: {
    playerInfo: '玩家資訊',
    recentBattles: '最近對戰',
  },
  loading: {
    text: '正在獲取資料...',
  },
};

// 翻訳オブジェクトを更新
export const brawlStarsAppTranslations = {
  ja,
  en,
  ko,
  es,
  ar,
  fr,
  zhTw,
} as const;

export type Language = keyof typeof brawlStarsAppTranslations;

// カスタムフック
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useBrawlStarsAppTranslation() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('ja');

  useEffect(() => {
    const getLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
        if (savedLanguage && (savedLanguage in brawlStarsAppTranslations)) {
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
        if (savedLanguage && savedLanguage !== currentLanguage && (savedLanguage in brawlStarsAppTranslations)) {
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
    t: brawlStarsAppTranslations[currentLanguage],
    currentLanguage,
  };
}