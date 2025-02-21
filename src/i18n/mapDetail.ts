import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type MapDetailTranslation = {
  error: {
    mapNotFound: string;
  };
  sections: {
    mapDescription: string;
    recommendedBrawlers: string;
  };
  powerLevels: {
    optimal: string;
    suitable: string;
    usable: string;
  };
  brawler: {
    powerRating: string;
  };
};

export const ja: MapDetailTranslation = {
  error: {
    mapNotFound: 'マップ情報が見つかりませんでした',
  },
  sections: {
    mapDescription: 'マップ説明',
    recommendedBrawlers: 'おすすめキャラ',
  },
  powerLevels: {
    optimal: '最適性 (4-5点)',
    suitable: '適正 (2-3点)',
    usable: '使える (1点)',
  },
  brawler: {
    powerRating: '{power}/5',
  },
};

export const en: MapDetailTranslation = {
  error: {
    mapNotFound: 'Map information not found',
  },
  sections: {
    mapDescription: 'Map Description',
    recommendedBrawlers: 'Recommended Brawlers',
  },
  powerLevels: {
    optimal: 'Optimal (4-5 points)',
    suitable: 'Suitable (2-3 points)',
    usable: 'Usable (1 point)',
  },
  brawler: {
    powerRating: '{power}/5',
  },
};

export const ko: MapDetailTranslation = {
  error: {
    mapNotFound: '맵 정보를 찾을 수 없습니다',
  },
  sections: {
    mapDescription: '맵 설명',
    recommendedBrawlers: '추천 캐릭터',
  },
  powerLevels: {
    optimal: '최적 (4-5점)',
    suitable: '적합 (2-3점)',
    usable: '사용 가능 (1점)',
  },
  brawler: {
    powerRating: '{power}/5',
  },
};

// アラビア語翻訳
export const ar: MapDetailTranslation = {
  error: {
    mapNotFound: 'لم يتم العثور على معلومات الخريطة',
  },
  sections: {
    mapDescription: 'وصف الخريطة',
    recommendedBrawlers: 'الشخصيات الموصى بها',
  },
  powerLevels: {
    optimal: 'مثالي (4-5 نقاط)',
    suitable: 'مناسب (2-3 نقاط)',
    usable: 'قابل للاستخدام (نقطة واحدة)',
  },
  brawler: {
    powerRating: '{power}/5',
  },
};

// フランス語翻訳
export const fr: MapDetailTranslation = {
  error: {
    mapNotFound: 'Information de carte non trouvée',
  },
  sections: {
    mapDescription: 'Description de la Carte',
    recommendedBrawlers: 'Personnages Recommandés',
  },
  powerLevels: {
    optimal: 'Optimal (4-5 points)',
    suitable: 'Convenable (2-3 points)',
    usable: 'Utilisable (1 point)',
  },
  brawler: {
    powerRating: '{power}/5',
  },
};

// スペイン語翻訳
export const es: MapDetailTranslation = {
  error: {
    mapNotFound: 'Información del mapa no encontrada',
  },
  sections: {
    mapDescription: 'Descripción del Mapa',
    recommendedBrawlers: 'Personajes Recomendados',
  },
  powerLevels: {
    optimal: 'Óptimo (4-5 puntos)',
    suitable: 'Adecuado (2-3 puntos)',
    usable: 'Utilizable (1 punto)',
  },
  brawler: {
    powerRating: '{power}/5',
  },
};

export const zhTw: MapDetailTranslation = {
  error: {
    mapNotFound: '找不到地圖資訊',
  },
  sections: {
    mapDescription: '地圖說明',
    recommendedBrawlers: '推薦角色',
  },
  powerLevels: {
    optimal: '最佳 (4-5分)',
    suitable: '適合 (2-3分)',
    usable: '可用 (1分)',
  },
  brawler: {
    powerRating: '{power}/5',
  },
};

// 翻訳オブジェクトをまとめたもの
export const mapDetailTranslations = {
  ja,
  en,
  ko,
  ar,
  fr,
  es,
  zhTw // 台湾語を追加
} as const;

export type Language = keyof typeof mapDetailTranslations;

export function useMapDetailTranslation() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('ja');

  useEffect(() => {
    const getLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
        if (savedLanguage && (savedLanguage in mapDetailTranslations)) {
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
        if (savedLanguage && savedLanguage !== currentLanguage && (savedLanguage in mapDetailTranslations)) {
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
    t: mapDetailTranslations[currentLanguage],
    currentLanguage,
  };
}