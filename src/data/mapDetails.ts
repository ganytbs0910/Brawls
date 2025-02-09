//mapDetails.ts
import { MapDetail, GameMode } from '../types/types';
import { getMapData, getAllMaps, getMapsByGameMode } from './mapDataService';

export const getMapDetails = (mapName: string): MapDetail | undefined => {
  const mapData = getMapData(mapName);
  if (!mapData) return undefined;

  return {
    name: mapData.name,
    mode: mapData.gameMode as GameMode,
    description: mapData.description,
    difficulty: 'normal',
    recommendedBrawlers: mapData.recommendedBrawlers
  };
};

export const getMapsByMode = (mode: GameMode): string[] => {
  const mapsForMode = getMapsByGameMode(mode);
  return mapsForMode.map(map => map.name);
};

export const getMapsByDifficulty = (difficulty: MapDetail['difficulty']): string[] => {
  const allMaps = getAllMaps();
  return allMaps
    .filter(map => difficulty === 'normal')
    .map(map => map.name);
};

export const getRecommendedMapsForBrawler = (brawlerName: string): string[] => {
  const allMaps = getAllMaps();
  return allMaps
    .filter(map => 
      map.recommendedBrawlers.some(b => 
        b.name === brawlerName && b.power >= 4
      )
    )
    .map(map => map.name);
};