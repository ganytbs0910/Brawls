export interface CharacterCompatibility {
  id: number;
  name: string;
  compatibilityScores: {
    [characterName: string]: number;
  };
  explanation?: {
    [characterName: string]: string;
  };
}

export type CharacterRole = 'タンク' | '投擲' | '暗殺者' | 'スナイパー' | 'アタッカー' | 'サポート' | 'コントローラー';
export type CharacterRarity = 'ノーマル' | 'レア' | 'スーパーレア' | 'エピック' | 'ミシック' | 'レジェンダリー' | 'クロマティック' | 'スターター';


export interface CharacterSkill {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  recommendationScore: number;
}

export interface CharacterStats {
  health: number;
  speed: number;
  attack: number;
  defense: number;
}

export interface CharacterData {
  id: string;
  name: string;
  description: string;
  role: CharacterRole;
  rarity: CharacterRarity;
  images: {
    default: string;
    borderless: string;
    emoji: string;
  };
  releaseDate: string;
  stats: CharacterStats;
  normalAttack: {
    name: string;
    description: string;
    damage: number;
    range: number;
  };
  skills: {
    starPowers: CharacterSkill[];
    gadgets: CharacterSkill[];
  };
  superSkill: CharacterSkill;
  gadget1?: CharacterSkill;
  gadget2?: CharacterSkill;
  starPower1?: CharacterSkill;
  starPower2?: CharacterSkill;
  recommendations: {
    bestModes: string[];
    bestMaps: string[];
    goodPartners: string[];
    counters: string[];
  };
  compatibility?: CharacterCompatibility;
}

export interface RankingItem {
  rank: number;
  characterName: string;
  description: string;
}

export type { 
  CharacterCompatibility,
  CharacterRole,
  CharacterRarity,
  CharacterSkill,
  CharacterStats,
  CharacterData
};