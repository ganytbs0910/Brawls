//types.ts
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

export interface GameMode {
  name: string;
  icon: any;
}

export interface RotatingMode {
  modes: GameMode[];
}

export interface RotatingModes {
  [key: string]: RotatingMode;
}

export interface MapImages {
  [key: string]: any;
}

export interface GameMaps {
  [key: string]: string[];
}

interface MapDetail {
  id: string;
  name: string;
  description: string;
  recommendedBrawlers: Array<{
    name: string;
    reason: string;
  }>;
  tactics: Array<{
    title: string;
    description: string;
  }>;
  tips: string[];
}

type ScreenType = 'settings' | 'privacy' | 'terms' | 'allTips' | 'punishmentGame' | 'language';

interface ScreenState {
  type: ScreenType;
  translateX: Animated.Value;
  zIndex: number;
}

interface MapDetailScreenProps {
  mapName: string;
  modeName: string;
  modeColor: string;
  modeIcon: any;
  mapImage: any;
  onClose: () => void;
}

// マップデータの型定義
export interface MapData {
  name: string;        // 日本語名
  nameEn: string;      // 英語名
  nameKo: string;      // 韓国語名
  nameEs: string;      // スペイン語名
  nameFr: string;      // フランス語名
  nameAr: string;      // アラビア語名
  nameZhTw: string;    // 中国語（繁体字）名
  
  gameMode: string;    // ゲームモード (Bounty, Gem Grab, etc.)
  image: string;       // マップ画像のパス
  description: string; // マップの説明
  recommendedBrawlers: RecommendedBrawler[]; // 推奨ブローラーのリスト
}

// マップの推奨ブローラーの情報
export interface RecommendedBrawler {
  name: string;
  reason: string;
  power: number;  // 推奨度（1-5）
}