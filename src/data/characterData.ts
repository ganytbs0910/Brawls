import { CharacterData } from '../types/types';
import characterData from '../data/characterAPI.json';
import { generateCustomRankings } from './customRankings';

// 多言語テキスト用のインターフェース
interface LocalizedText {
  ja: string;
  en: string;
  ko: string;
}

// 新しいJSONの構造に合わせたインターフェース
interface BrawlifyStarPower {
  id: number;
  name: LocalizedText;
  description: LocalizedText;
  recommendation: {
    level: number;
    reason: LocalizedText;
  };
}

interface BrawlifyGadget {
  id: number;
  name: LocalizedText;
  description: LocalizedText;
  recommendation: {
    level: number;
    reason: LocalizedText;
  };
}

interface BrawlifyCharacter {
  id: number;
  name: LocalizedText;
  image: string;
  description: LocalizedText;
  class: {
    id: number;
    name: LocalizedText;
  };
  rarity: {
    id: number;
    name: LocalizedText;
    color: string;
  };
  starPowers: BrawlifyStarPower[];
  gadgets: BrawlifyGadget[];
  gears: number[];
}

export interface RankingItem {
  rank: number;
  characterName: string;
  description: string;
}

export const roleMap: Record<string, string> = {
  all: '全体',
  tank: 'タンク',
  thrower: 'グレネーディア',
  assassin: 'アサシン',
  sniper: 'スナイパー',
  attacker: 'アタッカー',
  support: 'サポート',
  controller: 'コントローラー'
};

export const rankingTypes = [
  { id: 'all', nameKey: 'rankings.types.all' },
  { id: 'tank', nameKey: 'rankings.types.tank' },
  { id: 'thrower', nameKey: 'rankings.types.thrower' },
  { id: 'assassin', nameKey: 'rankings.types.assassin' },
  { id: 'sniper', nameKey: 'rankings.types.sniper' },
  { id: 'attacker', nameKey: 'rankings.types.attacker' },
  { id: 'support', nameKey: 'rankings.types.support' },
  { id: 'controller', nameKey: 'rankings.types.controller' }
];

export const characterTypes: { [key: string]: string[] } = {
  all: [],
  tank: [],
  thrower: [],
  assassin: [],
  sniper: [],
  attacker: [],
  support: [],
  controller: []
};

let charactersDataCache: Record<string, CharacterData> = {};

const getCharacterType = (className: LocalizedText): string => {
  const typeMap: Record<string, string> = {
    'タンク': 'tank',
    'アサシン': 'assassin',
    'サポート': 'support',
    'コントローラー': 'controller',
    'グレネーディア': 'thrower',
    'スナイパー': 'sniper',
    'アタッカー': 'attacker',
  };
  return typeMap[className.ja] || 'all';
};

const updateCharacterTypes = (brawlers: BrawlifyCharacter[]) => {
  // 全キャラクター名を日本語で登録
  characterTypes.all = brawlers.map(brawler => brawler.name.ja);
  
  brawlers.forEach(brawler => {
    const type = getCharacterType(brawler.class.name).toLowerCase();
    
    if (characterTypes[type]) {
      characterTypes[type].push(brawler.name.ja);
    }
  });
};

const processCharactersData = (brawlers: BrawlifyCharacter[]): Record<string, CharacterData> => {
  const processedData: Record<string, CharacterData> = {};

  brawlers.forEach((brawler) => {
    const characterName = brawler.name.ja;
    
    if (!characterName) {
      console.warn('Missing character name for brawler:', brawler);
      return;
    }
    
    processedData[characterName] = {
      id: brawler.id.toString(),
      name: characterName,
      description: brawler.description.ja,
      class: {
        id: brawler.class.id,
        name: brawler.class.name.ja
      },
      role: roleMap[brawler.class.name.ja] || brawler.class.name.ja,
      rarity: {
        id: brawler.rarity.id,
        name: brawler.rarity.name.ja,
        color: brawler.rarity.color
      },
      // recommendationLevelとreasonの取得方法を修正
      starPowers: brawler.starPowers.map(sp => ({
        name: sp.name.ja,
        description: sp.description.ja,
        recommendationLevel: sp.recommendation?.level || 0,
        recommendationReason: sp.recommendation?.reason?.ja || ''
      })),
      gadgets: brawler.gadgets.map(gadget => ({
        name: gadget.name.ja,
        description: gadget.description.ja,
        recommendationLevel: gadget.recommendation?.level || 0,
        recommendationReason: gadget.recommendation?.reason?.ja || ''
      })),
      gears: brawler.gears,
      recommendations: {
        bestModes: [],
        bestMaps: [],
        goodPartners: [],
        counters: []
      }
    };
  });

  return processedData;
};

// fetchAndProcessCharactersDataの実装を追加
export const fetchAndProcessCharactersData = async (): Promise<Record<string, CharacterData>> => {
  try {
    const brawlers = characterData.list;
    const processedData = processCharactersData(brawlers);
    updateCharacterTypes(brawlers);
    charactersDataCache = processedData;
    return processedData;
  } catch (error) {
    console.error('Error processing character data:', error);
    throw error;
  }
};

export const initializeCharacterData = (): Record<string, CharacterData> => {
  const brawlers = characterData.list;
  const processedData = processCharactersData(brawlers);
  updateCharacterTypes(brawlers);
  
  charactersDataCache = processedData;
  // デバッグ用ログ
  console.log('Initialized characters:', Object.keys(charactersDataCache));
  return processedData;
};

export const getCharacterData = (characterId: string): CharacterData | undefined => {
  try {
    // 日本語名でのルックアップを試みる
    const character = charactersDataCache[characterId];
    if (character) return character;

    // 英語名からの変換を試みる
    const characterFromEnglish = Object.values(charactersDataCache).find(
      char => char.name === characterId
    );
    return characterFromEnglish;
  } catch (error) {
    console.error('Error getting character data:', error);
    return undefined;
  }
};

export const getAllCharacters = (): CharacterData[] => {
  return Object.values(charactersDataCache);
};

export const getCharactersByRole = (role: string): CharacterData[] => {
  return Object.values(charactersDataCache).filter(char => char.role === role);
};

export const getCharacterRanking = (characterName: string, rankingType: string = 'all'): number => {
  const rankings = generateCustomRankings(charactersDataCache, rankingType);
  const ranking = rankings.find(item => item.characterName === characterName);
  return ranking ? ranking.rank : -1;
};

export const getCharactersByType = (type: string): CharacterData[] => {
  const characterNames = characterTypes[type] || [];
  return characterNames
    .map(name => charactersDataCache[name])
    .filter((char): char is CharacterData => char !== undefined);
};

export const getCharacterRankings = (rankingType: string = 'all'): RankingItem[] => {
  return generateCustomRankings(charactersDataCache, rankingType);
};

// 初期化を実行
initializeCharacterData();

export type { CharacterData, BrawlifyCharacter };