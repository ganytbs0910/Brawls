// src/i18n/home.ts
import { GAME_MODES, getLocalizedModeName, generateCombinedModeTranslation, Language as ModeLanguage } from '../data/modeData';

export type HomeTranslation = {
  header: {
    title: string;
  };
  dateSelector: {
    today: string;
    yesterday: string;
    tomorrow: string;
    monthDay: (month: number, day: number) => string;
  };
  updateTime: {
    timeUntilUpdate: (hours: number, minutes: number) => string;
  };
  modes: {
    getModeName: (modeName: keyof typeof GAME_MODES) => string;
    getCombinedModeName: (modes: (keyof typeof GAME_MODES)[]) => string;
  };
  viewToggle: {
    list: string;
    grid: string;
  };
  // 検索・フィルター関連の翻訳を追加
  searchFilter: {
    searchPlaceholder: string;
    filterByMode: string;
    clearFilters: string;
    resultsFound: string;
    noResults: string;
  };
};

// 日本語翻訳
export const ja: HomeTranslation = {
  header: {
    title: 'ブロスタ マップ情報',
  },
  dateSelector: {
    today: '今日',
    yesterday: '昨日',
    tomorrow: '明日',
    monthDay: (month: number, day: number) => `${month}月${day}日`,
  },
  updateTime: {
    timeUntilUpdate: (hours: number, minutes: number) => `更新まで ${hours}時間${minutes}分`,
  },
  modes: {
    getModeName: (modeName) => getLocalizedModeName(modeName, 'ja'),
    getCombinedModeName: (modes) => generateCombinedModeTranslation(modes, 'ja')
  },
  viewToggle: {
    list: '一覧',
    grid: '本日'  // 「グリッド」から「本日」に変更
  },
  // 検索・フィルター翻訳を追加
  searchFilter: {
    searchPlaceholder: 'マップを検索...',
    filterByMode: 'モードでフィルター',
    clearFilters: 'フィルターをクリア',
    resultsFound: '件のマップが見つかりました',
    noResults: '該当するマップがありません'
  }
};

// 英語翻訳
export const en: HomeTranslation = {
  header: {
    title: 'Brawl Stars Maps',
  },
  dateSelector: {
    today: 'Today',
    yesterday: 'Yesterday',
    tomorrow: 'Tomorrow',
    monthDay: (month: number, day: number) => `${month}/${day}`,
  },
  updateTime: {
    timeUntilUpdate: (hours: number, minutes: number) => 
      `${hours}h ${minutes}m until update`,
  },
  modes: {
    getModeName: (modeName) => getLocalizedModeName(modeName, 'en'),
    getCombinedModeName: (modes) => generateCombinedModeTranslation(modes, 'en')
  },
  viewToggle: {
    list: 'List',
    grid: 'Today'  // 「Grid」から「Today」に変更
  },
  // 検索・フィルター翻訳を追加
  searchFilter: {
    searchPlaceholder: 'Search maps...',
    filterByMode: 'Filter by mode',
    clearFilters: 'Clear filters',
    resultsFound: 'maps found',
    noResults: 'No maps found with current filters'
  }
};

// 韓国語翻訳
export const ko: HomeTranslation = {
  header: {
    title: '브롤스타즈 맵 정보',
  },
  dateSelector: {
    today: '오늘',
    yesterday: '어제',
    tomorrow: '내일',
    monthDay: (month: number, day: number) => `${month}월 ${day}일`,
  },
  updateTime: {
    timeUntilUpdate: (hours: number, minutes: number) => 
      `업데이트까지 ${hours}시간 ${minutes}분`,
  },
  modes: {
    getModeName: (modeName) => getLocalizedModeName(modeName, 'ko'),
    getCombinedModeName: (modes) => generateCombinedModeTranslation(modes, 'ko')
  },
  viewToggle: {
    list: '목록',
    grid: '오늘'  // 「그리드」から「오늘」に変更
  },
  // 検索・フィルター翻訳を追加
  searchFilter: {
    searchPlaceholder: '맵 검색...',
    filterByMode: '모드별 필터',
    clearFilters: '필터 지우기',
    resultsFound: '개의 맵 발견',
    noResults: '현재 필터로 맵을 찾을 수 없습니다'
  }
};

export const es: HomeTranslation = {
  header: {
    title: 'Mapas de Brawl Stars',
  },
  dateSelector: {
    today: 'Hoy',
    yesterday: 'Ayer',
    tomorrow: 'Mañana',
    monthDay: (month: number, day: number) => `${day}/${month}`,
  },
  updateTime: {
    timeUntilUpdate: (hours: number, minutes: number) => 
      `${hours}h ${minutes}m hasta la actualización`,
  },
  modes: {
    getModeName: (modeName) => getLocalizedModeName(modeName, 'es'),
    getCombinedModeName: (modes) => generateCombinedModeTranslation(modes, 'es')
  },
  viewToggle: {
    list: 'Lista',
    grid: 'Hoy'  // 「Cuadrícula」から「Hoy」に変更
  },
  // 検索・フィルター翻訳を追加
  searchFilter: {
    searchPlaceholder: 'Buscar mapas...',
    filterByMode: 'Filtrar por modo',
    clearFilters: 'Borrar filtros',
    resultsFound: 'mapas encontrados',
    noResults: 'No se encontraron mapas con los filtros actuales'
  }
};

// アラビア語翻訳
export const ar: HomeTranslation = {
  header: {
    title: 'خرائط براول ستارز',
  },
  dateSelector: {
    today: 'اليوم',
    yesterday: 'أمس',
    tomorrow: 'غداً',
    monthDay: (month: number, day: number) => `${day}/${month}`,
  },
  updateTime: {
    timeUntilUpdate: (hours: number, minutes: number) => 
      `${hours} ساعة ${minutes} دقيقة حتى التحديث`,
  },
  modes: {
    getModeName: (modeName) => getLocalizedModeName(modeName, 'ar'),
    getCombinedModeName: (modes) => generateCombinedModeTranslation(modes, 'ar')
  },
  viewToggle: {
    list: 'قائمة',
    grid: 'اليوم'  // 「شبكة」から「اليوم」に変更
  },
  // 検索・フィルター翻訳を追加
  searchFilter: {
    searchPlaceholder: 'البحث عن الخرائط...',
    filterByMode: 'تصفية حسب الوضع',
    clearFilters: 'مسح التصفية',
    resultsFound: 'خرائط وجدت',
    noResults: 'لم يتم العثور على خرائط بالمرشحات الحالية'
  }
};

// フランス語翻訳
export const fr: HomeTranslation = {
  header: {
    title: 'Cartes Brawl Stars',
  },
  dateSelector: {
    today: 'Aujourd\'hui',
    yesterday: 'Hier',
    tomorrow: 'Demain',
    monthDay: (month: number, day: number) => `${day}/${month}`,
  },
  updateTime: {
    timeUntilUpdate: (hours: number, minutes: number) => 
      `${hours}h ${minutes}m avant la mise à jour`,
  },
  modes: {
    getModeName: (modeName) => getLocalizedModeName(modeName, 'fr'),
    getCombinedModeName: (modes) => generateCombinedModeTranslation(modes, 'fr')
  },
  viewToggle: {
    list: 'Liste',
    grid: 'Aujourd\'hui'  // 「Grille」から「Aujourd'hui」に変更
  },
  // 検索・フィルター翻訳を追加
  searchFilter: {
    searchPlaceholder: 'Rechercher des cartes...',
    filterByMode: 'Filtrer par mode',
    clearFilters: 'Effacer les filtres',
    resultsFound: 'cartes trouvées',
    noResults: 'Aucune carte trouvée avec les filtres actuels'
  }
};

export const zhTw: HomeTranslation = {
  header: {
    title: '荒野亂鬥地圖資訊',
  },
  dateSelector: {
    today: '今天',
    yesterday: '昨天',
    tomorrow: '明天',
    monthDay: (month: number, day: number) => `${month}月${day}日`,
  },
  updateTime: {
    timeUntilUpdate: (hours: number, minutes: number) => 
      `距離更新還有 ${hours}小時${minutes}分鐘`,
  },
  modes: {
    getModeName: (modeName) => getLocalizedModeName(modeName, 'zhTw'),
    getCombinedModeName: (modes) => generateCombinedModeTranslation(modes, 'zhTw')
  },
  viewToggle: {
    list: '列表',
    grid: '今天'  // 「網格」から「今天」に変更
  },
  // 検索・フィルター翻訳を追加
  searchFilter: {
    searchPlaceholder: '搜索地圖...',
    filterByMode: '按模式過濾',
    clearFilters: '清除過濾',
    resultsFound: '個地圖找到',
    noResults: '沒有符合當前過濾條件的地圖'
  }
};

// 翻訳オブジェクトをまとめたもの
export const homeTranslations = {
  ja,
  en,
  ko,
  es,
  ar,
  fr,
  zhTw
} as const;

// 言語タイプの定義
export type Language = keyof typeof homeTranslations;

// カスタムフック
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useHomeTranslation() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('ja');

  useEffect(() => {
    const getLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
        if (savedLanguage && (savedLanguage in homeTranslations)) {
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
        if (savedLanguage && savedLanguage !== currentLanguage && (savedLanguage in homeTranslations)) {
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
    t: homeTranslations[currentLanguage],
    currentLanguage,
  };
}