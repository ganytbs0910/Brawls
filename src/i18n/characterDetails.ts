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

export const characterDetailsTranslations = {
  ja,
  en,
  ko,
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