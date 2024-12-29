// mapDetails.ts
import { MapDetail, GameMode } from '../types/types';
import { battleRoyaleMaps } from './modes/battleRoyale';
import { knockoutMaps } from './modes/knockout';
import { heistMaps } from './modes/heist';
import { brawlBallMaps } from './modes/brawlBall';
import { brawlBall5v5Maps } from './modes/brawlBall5v5';
import { duelMaps } from './modes/duel';
import { emeraldHuntMaps } from './modes/emeraldHunt';

export const mapDetails: Record<string, MapDetail> = {
  ...battleRoyaleMaps,
  ...knockoutMaps,
  ...heistMaps,
  ...brawlBallMaps,
  ...brawlBall5v5Maps,
  ...duelMaps,
  ...emeraldHuntMaps,
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