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

export type CharacterRole = 'タンク' | 'アタッカー' | 'サポート' | 'アサシン' | 'シューター';

export type CharacterRarity = 'レア' | 'スーパーレア' | 'エピック' | 'クロマティック' | 'レジェンダリー';

export interface CharacterSkill {
  name: string;
  description: string;
  damage?: number;
  range?: number;
  cooldown?: number;
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
  releaseDate: string;
  stats: CharacterStats;
  normalAttack: {
    name: string;
    description: string;
    damage: number;
    range: number;
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
  compatibility?: CharacterCompatibility; // 既存の相性データとの連携用（必要に応じて）
}

// 型定義の再エクスポート
export type { 
  CharacterCompatibility,
  CharacterRole,
  CharacterRarity,
  CharacterSkill,
  CharacterStats,
  CharacterData
};