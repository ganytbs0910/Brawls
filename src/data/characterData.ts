import { CharacterData } from '../types/types';
import characterData from '../data/characterAPI.json';

interface BrawlifyCharacter {
  id: number;
  name: string;
  description: string;
  class: {
    name: string;
  };
  rarity: {
    name: string;
  };
  starPowers: Array<{
    id: number;
    name: string;
    description: string;
  }>;
  gadgets: Array<{
    id: number;
    name: string;
    description: string;
  }>;
}

export interface RankingItem {
  rank: number;
  characterName: string;
  description: string;
}

export const nameMap: Record<string, string> = {
  'Shelly': 'シェリー',
  'Nita': 'ニタ',
  'Colt': 'コルト',
  'Bull': 'ブル',
  'Jessie': 'ジェシー',
  'Brock': 'ブロック',
  'Dynamike': 'ダイナマイク',
  'Bo': 'ボウ',
  'Tick': 'ティック',
  '8-Bit': '8ビット',
  'Emz': 'Emz',
  'El Primo': 'エルプリモ',
  'Barley': 'バーリー',
  'Poco': 'ポコ',
  'Rosa': 'ローサ',
  'Rico': 'リコ',
  'Darryl': 'ダリル',
  'Penny': 'ペニー',
  'Carl': 'カール',
  'Jacky': 'ジャッキー',
  'Piper': 'パイパー',
  'Pam': 'パム',
  'Frank': 'フランケン',
  'Bibi': 'ビビ',
  'Bea': 'ビー',
  'Nani': 'ナーニ',
  'Edgar': 'エドガー',
  'Griff': 'グリフ',
  'Grom': 'グロム',
  'Bonnie': 'ボニー',
  'Mortis': 'モーティス',
  'Tara': 'タラ',
  'Gene': 'ジーン',
  'Max': 'MAX',
  'Mr. P': 'Mr.P',
  'Sprout': 'スプラウト',
  'Byron': 'バイロン',
  'Squeak': 'スクウィーク',
  'Gray': 'グレイ',
  'Pearl': 'パール',
  'Crow': 'クロウ',
  'Spike': 'スパイク',
  'Leon': 'レオン',
  'Sandy': 'サンディ',
  'Amber': 'アンバー',
  'Meg': 'メグ',
  'Chester': 'チェスター',
  'Willow': 'ウィロー',
  'Cordelius': 'コーデリアス',
  'Gus': 'ガス',
  'Buster': 'バスター',
  'Sam': 'サム',
  'Otis': 'オーティス',
  'Lou': 'ルー',
  'Ruffs': 'ラフス',
  'Belle': 'ベル',
  'Buzz': 'バズ',
  'Ash': 'アッシュ',
  'Lola': 'ローラ',
  'Fang': 'ファング',
  'Eve': 'イヴ',
  'Janet': 'ジャネット',
  'Chuck': 'チャック',
  'Charlie': 'チャーリー',
  'Elizabeth': 'エリザベス',
  'Mandy': 'マンディ',
  'Doug': 'ダグ',
  'R-T': 'R-T',
  'Hank': 'ハンク',
  'Maisie': 'メイジー',
  'Kit': 'キット',
  'Melody': 'メロディー',
  'Larry & Lawrie': 'ラリー&ローリー',
  'Clancy': 'クランシー',
  'Angelo': 'アンジェロ',
  'Draco': 'ドラコ',
  'Lily': 'リリー',
  'Berry': 'ベリー',
  'Kenji': 'ケンジ',
  'Shade': 'シェイド',
  'Juju': 'ジュジュ',
  'Block': 'ブロック',
  'Mico': 'ミコ',
  'Surge': 'サージ',
  'Colette': 'コレット',
  'Moe': 'モー',
  'Melodie': 'メロディー',
  'Stu': 'スチュー',
  'Gale': 'ゲイル'
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

export const rarityMap: Record<string, string> = {
  'Common': 'ノーマル',
  'Rare': 'レア',
  'Super Rare': 'スーパーレア',
  'Epic': 'ハイパーレア',
  'Mythic': 'ウルトラレア',
  'Legendary': 'レジェンダリー',
  'Starting': 'スターター',
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

let characterRankings: RankingItem[] = [];
let charactersDataCache: Record<string, CharacterData> = {};

const getCharacterType = (className: string): string => {
  const typeMap: Record<string, string> = {
     'Tank': 'tank',
  'タンク': 'tank',
  'Artillery': 'thrower',
  'アーティラリー': 'thrower',
  'Assassin': 'assassin',
  'アサシン': 'assassin',
  'Marksman': 'sniper',
  'マークスマン': 'sniper',
  'Damage Dealer': 'attacker',
  'ダメージディーラー': 'attacker',
  'Support': 'support',
  'サポート': 'support',
  'Controller': 'controller',
  'コントローラー': 'controller'
  };
  return typeMap[className] || 'all';
};

const updateCharacterTypes = (brawlers: any[]) => {
  characterTypes.all = brawlers.map(brawler => brawler.name);
  
  brawlers.forEach(brawler => {
    const type = getCharacterType(brawler.class.name).toLowerCase();
    
    if (characterTypes[type]) {
      characterTypes[type].push(brawler.name);
    }
  });
};

const processCharactersData = (brawlers: BrawlifyCharacter[]): Record<string, CharacterData> => {
  const processedData: Record<string, CharacterData> = {};

  brawlers.forEach((brawler) => {
    const characterName = brawler.name;
    
    if (!characterName) {
      console.warn(`Missing character name for brawler:`, brawler);
      return;
    }
    
    processedData[characterName] = {
      id: brawler.id.toString(),
      name: characterName,
      description: brawler.description,
      role: roleMap[brawler.class.name] || brawler.class.name,
      rarity: rarityMap[brawler.rarity.name] || brawler.rarity.name,
      stats: {
        health: 3600,
        speed: 720,
        attack: 1000,
        defense: 3
      },
      normalAttack: {
        name: '通常攻撃',
        description: '基本的な攻撃を行う',
        damage: 1000,
        range: 6.67
      },
      superSkill: {
        name: 'スーパースキル',
        description: '特殊な攻撃を行う',
        damage: 1500,
        range: 8,
        cooldown: 0
      },
      starPowers: brawler.starPowers.map(sp => ({
        name: sp.name,
        description: sp.description
      })),
      gadgets: brawler.gadgets.map(gadget => ({
        name: gadget.name,
        description: gadget.description,
        cooldown: 3
      })),
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

const generateCharacterRankings = (brawlers: BrawlifyCharacter[]) => {
  characterRankings = brawlers.map((brawler, index) => ({
    rank: index + 1,
    characterName: brawler.name,
    description: brawler.description
  }));
};

export const initializeCharacterData = (): Record<string, CharacterData> => {
  const brawlers = characterData.list;
  const processedData = processCharactersData(brawlers);
  updateCharacterTypes(brawlers);
  generateCharacterRankings(brawlers);
  
  charactersDataCache = processedData;
  return processedData;
};

// Backwards compatibility function
export const fetchAndProcessCharactersData = async (): Promise<Record<string, CharacterData>> => {
  return initializeCharacterData();
};

export const getCharacterData = (characterId: string): CharacterData | undefined => {
  return charactersDataCache[characterId];
};

export const getAllCharacters = (): CharacterData[] => {
  return Object.values(charactersDataCache);
};

export const getCharactersByRole = (role: string): CharacterData[] => {
  return Object.values(charactersDataCache).filter(char => char.role === role);
};

export const getCharacterRanking = (characterName: string): number => {
  const ranking = characterRankings.find(item => item.characterName === characterName);
  return ranking ? ranking.rank : -1;
};

export const getCharactersByType = (type: string): CharacterData[] => {
  const characterNames = characterTypes[type] || [];
  return characterNames
    .map(name => charactersDataCache[name])
    .filter((char): char is CharacterData => char !== undefined);
};

export const getCharacterRankings = (): RankingItem[] => {
  return characterRankings;
};

// Initialize data when module is loaded
initializeCharacterData();

export type { CharacterData, BrawlifyCharacter };