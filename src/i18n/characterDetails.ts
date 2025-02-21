export type CharacterDetailsTranslation = {
  tabs: {
    info: string;
    compatibility: string;
    maps: string;  // 追加
  };
  maps: {
    recommendedTitle: string;
    powerLevel: string;
    noRecommendedMaps: string;
    modes: {
      gemGrab: string;
      brawlBall: string;
      heist: string;
      knockout: string;
      bounty: string;
      hotZone: string;
      wipeout: string;
      brawlBall5v5: string;
      wipeout5v5: string;
      duels: string;
      showdown: string;
      rankFront: string;
    };
  };
  basicInfo: {
    title: string;
    role: string;
    rarity: string;
  };
  powers: {
    starPower: string;
    gadget: string;
    recommended: string;
    recommendationReason: string;
  };
  recommendation: {
    highest: string;
    recommended: string;
    medium: string;
    low: string;
    optional: string;
    unrated: string;
  };
  gears: {
    title: string;
    recommended: string;
    types: {
      superrare: string;
      epic: string;
      mythic: string;
      plus: string;
      gear: string;
    };
  };
  compatibility: {
    toggles: {
      good: string;
      bad: string;
    };
    categories: {
      bestMatch: string;
      goodMatch: string;
      badMatch: string;
      normalMatch: string;
    };
  };
  errors: {
    characterNotFound: string;
  };
};

export const ja: CharacterDetailsTranslation = {
  tabs: {
    info: 'キャラ情報',
    compatibility: '相性表',
    maps: '推奨マップ',
  },
   maps: {
    recommendedTitle: "推奨マップ",
    powerLevel: "パワーレベル",
    noRecommendedMaps: "このキャラクターに推奨されるマップはありません",
    modes: {
      gemGrab: "エメラルドハント",
      brawlBall: "ブロストライカー",
      heist: "強奪",
      knockout: "ノックアウト",
      bounty: "賞金稼ぎ",
      hotZone: "ホットゾーン",
      wipeout: "殲滅",
      brawlBall5v5: "5vs5ブロストライカー",
      wipeout5v5: "5vs5殲滅",
      duels: "デュエル",
      showdown: "バトルロイヤル",
      rankFront: "ガチバトル"
    }
  },
  basicInfo: {
    title: '基本情報',
    role: '役割',
    rarity: 'レアリティ',
  },
  powers: {
    starPower: 'スターパワー',
    gadget: 'ガジェット',
    recommended: 'おすすめ',
    recommendationReason: 'おすすめの理由',
  },
  recommendation: {
    highest: '最優先 (5/5)',
    recommended: 'おすすめ (4/5)',
    medium: '優先度中 (3/5)',
    low: '優先度低 (2/5)',
    optional: '後回しOK (1/5)',
    unrated: '未評価',
  },
  gears: {
    title: 'ギア',
    recommended: 'おすすめ',
    types: {
      superrare: 'スーパーレア',
      epic: 'エピック',
      mythic: 'ミシック',
      plus: 'プラス',
      gear: 'ギア',
    },
  },
  compatibility: {
    toggles: {
      good: '得意',
      bad: '苦手',
    },
    categories: {
      bestMatch: '最高の相性',
      goodMatch: '良い相性',
      badMatch: '相性が悪い',
      normalMatch: '普通の相性',
    },
  },
  errors: {
    characterNotFound: 'キャラクターが見つかりませんでした。',
  },
};

export const en: CharacterDetailsTranslation = {
  tabs: {
    info: 'Info',
    compatibility: 'Compatibility',
    maps: 'Maps', 
  },
  maps: {
    recommendedTitle: "Recommended Maps",
    powerLevel: "Power Level",
    noRecommendedMaps: "No recommended maps for this character.",
    modes: {
      gemGrab: "Gem Grab",
      brawlBall: "Brawl Ball",
      heist: "Heist",
      knockout: "Knockout",
      bounty: "Bounty",
      hotZone: "Hot Zone",
      wipeout: "Wipeout",
      brawlBall5v5: "5v5 Brawl Ball",
      wipeout5v5: "5v5 Wipeout",
      duels: "Duels",
      showdown: "Showdown",
      rankFront: "Rank Front"
    }
  },
  basicInfo: {
    title: 'Basic Info',
    role: 'Role',
    rarity: 'Rarity',
  },
  powers: {
    starPower: 'Star Power',
    gadget: 'Gadget',
    recommended: 'Recommended',
    recommendationReason: 'Reason',
  },
  recommendation: {
    highest: 'Priority (5/5)',
    recommended: 'Recommended (4/5)',
    medium: 'Medium (3/5)',
    low: 'Low (2/5)',
    optional: 'Optional (1/5)',
    unrated: 'Unrated',
  },
  gears: {
    title: 'Gears',
    recommended: 'Recommended',
    types: {
      superrare: 'Super Rare',
      epic: 'Epic',
      mythic: 'Mythic',
      plus: 'Plus',
      gear: 'Gear',
    },
  },
  compatibility: {
    toggles: {
      good: 'Good',
      bad: 'Bad',
    },
    categories: {
      bestMatch: 'Best Match',
      goodMatch: 'Good Match',
      badMatch: 'Bad Match',
      normalMatch: 'Normal Match',
    },
  },
  errors: {
    characterNotFound: 'Character not found.',
  },
};

export const ko: CharacterDetailsTranslation = {
  tabs: {
    info: '정보',
    compatibility: '상성표',
    maps: '추천 맵',  // 追加
  },
   maps: {
    recommendedTitle: "추천 맵",
    powerLevel: "파워 레벨",
    noRecommendedMaps: "이 캐릭터에 대한 추천 맵이 없습니다.",
    modes: {
      gemGrab: "젬 그랩",
      brawlBall: "브롤 볼",
      heist: "하이스트",
      knockout: "녹아웃",
      bounty: "바운티",
      hotZone: "핫 존",
      wipeout: "와이프아웃",
      brawlBall5v5: "5대5 브롤 볼",
      wipeout5v5: "5대5 와이프아웃",
      duels: "듀얼",
      showdown: "쇼다운",
      rankFront: "랭크 프론트"
    }
  },
  basicInfo: {
    title: '기본 정보',
    role: '역할',
    rarity: '레어도',
  },
  powers: {
    starPower: '스타 파워',
    gadget: '가젯',
    recommended: '추천',
    recommendationReason: '추천 이유',
  },
  recommendation: {
    highest: '최우선 (5/5)',
    recommended: '추천 (4/5)',
    medium: '보통 (3/5)',
    low: '낮음 (2/5)',
    optional: '선택 (1/5)',
    unrated: '미평가',
  },
  gears: {
    title: '기어',
    recommended: '추천',
    types: {
      superrare: '슈퍼레어',
      epic: '에픽',
      mythic: '신화',
      plus: '플러스',
      gear: '기어',
    },
  },
  compatibility: {
    toggles: {
      good: '좋음',
      bad: '나쁨',
    },
    categories: {
      bestMatch: '최고의 상성',
      goodMatch: '좋은 상성',
      badMatch: '나쁜 상성',
      normalMatch: '보통 상성',
    },
  },
  errors: {
    characterNotFound: '캐릭터를 찾을 수 없습니다.',
  },
};

export const es: CharacterDetailsTranslation = {
  tabs: {
    info: 'Información',
    compatibility: 'Compatibilidad',
    maps: 'Mapas',
  },
  maps: {
    recommendedTitle: "Mapas Recomendados",
    powerLevel: "Nivel de Poder",
    noRecommendedMaps: "No hay mapas recomendados para este personaje.",
    modes: {
      gemGrab: "Atrapagemas",
      brawlBall: "Brawl Ball",
      heist: "Atraco",
      knockout: "Knockout",
      bounty: "Recompensa",
      hotZone: "Zona Candente",
      wipeout: "Aniquilación",
      brawlBall5v5: "Brawl Ball 5v5",
      wipeout5v5: "Aniquilación 5v5",
      duels: "Duelos",
      showdown: "Showdown",
      rankFront: "Frente de Rango"
    }
  },
  basicInfo: {
    title: 'Información Básica',
    role: 'Rol',
    rarity: 'Rareza',
  },
  powers: {
    starPower: 'Poder Estelar',
    gadget: 'Gadget',
    recommended: 'Recomendado',
    recommendationReason: 'Razón',
  },
  recommendation: {
    highest: 'Prioritario (5/5)',
    recommended: 'Recomendado (4/5)',
    medium: 'Medio (3/5)',
    low: 'Bajo (2/5)',
    optional: 'Opcional (1/5)',
    unrated: 'Sin Calificar',
  },
  gears: {
    title: 'Engranajes',
    recommended: 'Recomendado',
    types: {
      superrare: 'Superraro',
      epic: 'Épico',
      mythic: 'Mítico',
      plus: 'Plus',
      gear: 'Engranaje',
    },
  },
  compatibility: {
    toggles: {
      good: 'Bueno',
      bad: 'Malo',
    },
    categories: {
      bestMatch: 'Mejor Combinación',
      goodMatch: 'Buena Combinación',
      badMatch: 'Mala Combinación',
      normalMatch: 'Combinación Normal',
    },
  },
  errors: {
    characterNotFound: 'Personaje no encontrado.',
  },
};

// アラビア語翻訳
export const ar: CharacterDetailsTranslation = {
  tabs: {
    info: 'معلومات',
    compatibility: 'التوافق',
    maps: 'الخرائط',
  },
  maps: {
    recommendedTitle: "الخرائط الموصى بها",
    powerLevel: "مستوى القوة",
    noRecommendedMaps: "لا توجد خرائط موصى بها لهذه الشخصية.",
    modes: {
      gemGrab: "جمع الجواهر",
      brawlBall: "كرة براول",
      heist: "السطو",
      knockout: "الإقصاء",
      bounty: "المكافأة",
      hotZone: "المنطقة الساخنة",
      wipeout: "الإبادة",
      brawlBall5v5: "كرة براول 5 ضد 5",
      wipeout5v5: "الإبادة 5 ضد 5",
      duels: "المبارزة",
      showdown: "المواجهة",
      rankFront: "جبهة الرتبة"
    }
  },
  basicInfo: {
    title: 'المعلومات الأساسية',
    role: 'الدور',
    rarity: 'الندرة',
  },
  powers: {
    starPower: 'قوة النجمة',
    gadget: 'الأداة',
    recommended: 'موصى به',
    recommendationReason: 'السبب',
  },
  recommendation: {
    highest: 'أولوية قصوى (5/5)',
    recommended: 'موصى به (4/5)',
    medium: 'متوسط (3/5)',
    low: 'منخفض (2/5)',
    optional: 'اختياري (1/5)',
    unrated: 'غير مصنف',
  },
  gears: {
    title: 'التروس',
    recommended: 'موصى به',
    types: {
      superrare: 'نادر جداً',
      epic: 'ملحمي',
      mythic: 'أسطوري',
      plus: 'بلس',
      gear: 'الترس',
    },
  },
  compatibility: {
    toggles: {
      good: 'جيد',
      bad: 'سيء',
    },
    categories: {
      bestMatch: 'أفضل توافق',
      goodMatch: 'توافق جيد',
      badMatch: 'توافق سيء',
      normalMatch: 'توافق عادي',
    },
  },
  errors: {
    characterNotFound: 'الشخصية غير موجودة.',
  },
};

// フランス語翻訳
export const fr: CharacterDetailsTranslation = {
  tabs: {
    info: 'Infos',
    compatibility: 'Compatibilité',
    maps: 'Cartes',
  },
  maps: {
    recommendedTitle: "Cartes Recommandées",
    powerLevel: "Niveau de Puissance",
    noRecommendedMaps: "Aucune carte recommandée pour ce personnage.",
    modes: {
      gemGrab: "Chasse aux Gemmes",
      brawlBall: "Foot Brawl",
      heist: "Braquage",
      knockout: "Knockout",
      bounty: "Prime",
      hotZone: "Zone Chaude",
      wipeout: "Annihilation",
      brawlBall5v5: "Foot Brawl 5v5",
      wipeout5v5: "Annihilation 5v5",
      duels: "Duels",
      showdown: "Showdown",
      rankFront: "Front de Rang"
    }
  },
  basicInfo: {
    title: 'Informations de Base',
    role: 'Rôle',
    rarity: 'Rareté',
  },
  powers: {
    starPower: 'Pouvoir Stellaire',
    gadget: 'Gadget',
    recommended: 'Recommandé',
    recommendationReason: 'Raison',
  },
  recommendation: {
    highest: 'Prioritaire (5/5)',
    recommended: 'Recommandé (4/5)',
    medium: 'Moyen (3/5)',
    low: 'Faible (2/5)',
    optional: 'Optionnel (1/5)',
    unrated: 'Non Évalué',
  },
  gears: {
    title: 'Équipements',
    recommended: 'Recommandé',
    types: {
      superrare: 'Super Rare',
      epic: 'Épique',
      mythic: 'Mythique',
      plus: 'Plus',
      gear: 'Équipement',
    },
  },
  compatibility: {
    toggles: {
      good: 'Bon',
      bad: 'Mauvais',
    },
    categories: {
      bestMatch: 'Meilleure Compatibilité',
      goodMatch: 'Bonne Compatibilité',
      badMatch: 'Mauvaise Compatibilité',
      normalMatch: 'Compatibilité Normale',
    },
  },
  errors: {
    characterNotFound: 'Personnage non trouvé.',
  },
};

// 台湾語（繁体中文）翻訳を追加
export const zhTw: CharacterDetailsTranslation = {
  tabs: {
    info: '資訊',
    compatibility: '相性表',
    maps: '推薦地圖',
  },
  maps: {
    recommendedTitle: "推薦地圖",
    powerLevel: "能力等級",
    noRecommendedMaps: "此角色沒有推薦地圖",
    modes: {
      gemGrab: "寶石爭奪",
      brawlBall: "鬥球",
      heist: "搶險",
      knockout: "淘汰賽",
      bounty: "賞金獵人",
      hotZone: "熱區",
      wipeout: "殲滅戰",
      brawlBall5v5: "5對5鬥球",
      wipeout5v5: "5對5殲滅戰",
      duels: "決鬥",
      showdown: "生存模式",
      rankFront: "排位戰線"
    }
  },
  basicInfo: {
    title: '基本資訊',
    role: '角色定位',
    rarity: '稀有度',
  },
  powers: {
    starPower: '星力',
    gadget: '道具',
    recommended: '推薦',
    recommendationReason: '推薦原因',
  },
  recommendation: {
    highest: '最優先 (5/5)',
    recommended: '推薦 (4/5)',
    medium: '中等 (3/5)',
    low: '低優先 (2/5)',
    optional: '可選 (1/5)',
    unrated: '未評分',
  },
  gears: {
    title: '裝備',
    recommended: '推薦',
    types: {
      superrare: '超級稀有',
      epic: '史詩',
      mythic: '神話',
      plus: '強化',
      gear: '裝備',
    },
  },
  compatibility: {
    toggles: {
      good: '優勢',
      bad: '劣勢',
    },
    categories: {
      bestMatch: '最佳相性',
      goodMatch: '良好相性',
      badMatch: '不良相性',
      normalMatch: '一般相性',
    },
  },
  errors: {
    characterNotFound: '找不到該角色',
  },
};

// characterDetailsTranslations オブジェクトに台湾語を追加
export const characterDetailsTranslations = {
  ja,
  en,
  ko,
  es,
  ar,
  fr,
  zhTw, // 台湾語を追加
} as const;

export type Language = keyof typeof characterDetailsTranslations;

import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useCharacterDetailsTranslation() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('ja');

  useEffect(() => {
    const getLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
        if (savedLanguage && savedLanguage in characterDetailsTranslations) {
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
        if (savedLanguage && savedLanguage !== currentLanguage && (savedLanguage in characterDetailsTranslations)) {
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
    t: characterDetailsTranslations[currentLanguage],
    currentLanguage,
  };
}