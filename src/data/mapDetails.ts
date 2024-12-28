import { MapDetail, GameMode } from '../types';

export const mapDetails: Record<string, MapDetail> = {
  "クリスタルアーケード": {
    id: "eh_crystal_arcade",
    name: "クリスタルアーケード",
    mode: "emeraldHunt",
    description: "中央にエメラルドが出現し、両サイドに隠れ場所となるブッシュが配置されています。エメラルドの確保と敵の妨害のバランスが重要です。",
    characteristics: ["左右対称", "エメラルド集中", "カバー多め"],
    difficulty: "Hard",
    recommendedBrawlers: [
      {
        name: "ローサ",
        reason: "高い耐久力でエメラルドを保持しやすい",
        power: 5
      },
      {
        name: "タラ",
        reason: "広範囲攻撃で敵を牽制しやすい",
        power: 4
      },
      {
        name: "ジーン",
        reason: "敵を引き寄せる能力で陣地の崩壊が可能",
        power: 5
      }
    ],
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "最初のエメラルド確保を目指しつつ、相手の動きを観察する",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "エメラルドの保持数に応じて攻撃的か防御的か立ち回りを変える",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "カウントダウン時の最後の一個を確実に確保する",
        phase: "Late"
      }
    ],
    tips: [
      "エメラルドを持っている時は無理な進出を避ける",
      "味方のカバーを意識した位置取りを心がける",
      "相手のスーパースキルのタイミングを把握して行動する"
    ]
  }
};

// マップ情報を取得するユーティリティ関数
export const getMapDetails = (mapName: string): MapDetail | undefined => {
  return mapDetails[mapName];
};

export const getMapsByMode = (mode: GameMode): string[] => {
  return Object.entries(mapDetails)
    .filter(([_, detail]) => detail.mode === mode)
    .map(([mapName]) => mapName);
};

export const getMapsByDifficulty = (difficulty: MapDetail['difficulty']): string[] => {
  return Object.entries(mapDetails)
    .filter(([_, detail]) => detail.difficulty === difficulty)
    .map(([mapName]) => mapName);
};

export const getRecommendedMapsForBrawler = (brawlerName: string): string[] => {
  return Object.entries(mapDetails)
    .filter(([_, detail]) => 
      detail.recommendedBrawlers.some(b => 
        b.name === brawlerName && (b.power || 0) >= 4
      )
    )
    .map(([mapName]) => mapName);
};