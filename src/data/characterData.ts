//characterData.ts
import { CharacterData } from '../types/types';
import characterData from '../data/characterAPI.json';
import { generateCustomRankings } from './customRankings';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

// 現在の言語設定を取得する関数
const getCurrentLanguage = async (): Promise<'en' | 'ja' | 'ko'> => {
  try {
    const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
    return (savedLanguage as 'en' | 'ja' | 'ko') || 'en';
  } catch (error) {
    console.error('Error getting language:', error);
    return 'en';
  }
};

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

const updateCharacterTypes = async (brawlers: BrawlifyCharacter[]) => {
  const currentLang = await getCurrentLanguage();
  characterTypes.all = brawlers.map(brawler => brawler.name[currentLang]);
  
  brawlers.forEach(brawler => {
    const type = getCharacterType(brawler.class.name);
    
    if (characterTypes[type]) {
      characterTypes[type].push(brawler.name[currentLang]);
    }
  });
};

const processCharactersData = async (
  brawlers: BrawlifyCharacter[]
): Promise<Record<string, CharacterData>> => {
  const processedData: Record<string, CharacterData> = {};
  const currentLang = await getCurrentLanguage();

  for (const brawler of brawlers) {
    const characterName = brawler.name.ja;
    
    if (!characterName) {
      console.warn('Missing character name for brawler:', brawler);
      continue;
    }
    
    processedData[characterName] = {
      id: brawler.id.toString(),
      name: characterName,
      description: brawler.description[currentLang],
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
      starPowers: brawler.starPowers.map(sp => ({
        name: sp.name[currentLang],
        description: sp.description[currentLang],
        recommendationLevel: sp.recommendation?.level || 0,
        recommendationReason: sp.recommendation?.reason?.[currentLang] || ''
      })),
      gadgets: brawler.gadgets.map(gadget => ({
        name: gadget.name[currentLang],
        description: gadget.description[currentLang],
        recommendationLevel: gadget.recommendation?.level || 0,
        recommendationReason: gadget.recommendation?.reason?.[currentLang] || ''
      })),
      gears: brawler.gears,
      recommendations: {
        bestModes: [],
        bestMaps: [],
        goodPartners: [],
        counters: []
      }
    };
  }

  return processedData;
};

export const fetchAndProcessCharactersData = async (): Promise<Record<string, CharacterData>> => {
  try {
    const brawlers = characterData.list;
    const processedData = await processCharactersData(brawlers);
    await updateCharacterTypes(brawlers);
    charactersDataCache = processedData;
    return processedData;
  } catch (error) {
    console.error('Error processing character data:', error);
    throw error;
  }
};

export const initializeCharacterData = async (): Promise<Record<string, CharacterData>> => {
  const brawlers = characterData.list;
  const processedData = await processCharactersData(brawlers);
  await updateCharacterTypes(brawlers);
  
  charactersDataCache = processedData;
  console.log('Initialized characters:', Object.keys(charactersDataCache));
  return processedData;
};

export const refreshCharacterDataWithNewLanguage = async (): Promise<void> => {
  try {
    charactersDataCache = await fetchAndProcessCharactersData();
  } catch (error) {
    console.error('Error refreshing character data:', error);
  }
};

export const getCharacterData = (characterId: string): CharacterData | undefined => {
  try {
    const character = charactersDataCache[characterId];
    if (character) return character;

    const characterFromOtherLang = Object.values(charactersDataCache).find(
      char => char.name === characterId
    );
    return characterFromOtherLang;
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

// アプリ起動時に初期化を実行
initializeCharacterData().catch(error => {
  console.error('Failed to initialize character data:', error);
});

export type { CharacterData, BrawlifyCharacter };