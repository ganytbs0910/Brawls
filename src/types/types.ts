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

export type CharacterRole = 'タンク' | 'グレネーディア' | 'アサシン' | 'スナイパー' | 'アタッカー' | 'サポート' | 'コントローラー';
export type CharacterRarity = 'ノーマル' | 'レア' | 'スーパーレア' | 'エピック' | 'ミシック' | 'レジェンダリー' | 'クロマティック' | 'スターター';

export interface CharacterSkill {
  name: string;
  description: string;
  recommendationLevel?: number;
  recommendationReason?: string;
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
  starPowers: CharacterSkill[];
  gadgets: CharacterSkill[];
  recommendations: {
    bestModes: string[];
    bestMaps: string[];
    goodPartners: string[];
    counters: string[];
  };
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