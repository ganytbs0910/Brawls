//mapData.ts
import { MapData } from '../types/types';
import mapData from '../data/mapAPI.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LocalizedText {
  ja: string;
  en: string;
  ko: string;
}

interface BrawlifyMap {
  name: LocalizedText;
  gameMode: string;
  image: string;
  description: string;
  recommendedBrawlers: RecommendedBrawler[];
}

let mapsDataCache: Record<string, MapData> = {};

const getCurrentLanguage = async (): Promise<'en' | 'ja' | 'ko'> => {
  try {
    const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
    return (savedLanguage as 'en' | 'ja' | 'ko') || 'en';
  } catch (error) {
    console.error('Error getting language:', error);
    return 'en';
  }
};

const processMapsData = async (
  maps: BrawlifyMap[]
): Promise<Record<string, MapData>> => {
  const processedData: Record<string, MapData> = {};
  const currentLang = await getCurrentLanguage();

  for (const map of maps) {
    const mapName = map.name.ja;
    
    if (!mapName) {
      console.warn('Missing map name for map:', map);
      continue;
    }
    
    processedData[mapName] = {
      name: mapName,
      nameEn: map.name.en,
      nameKo: map.name.ko,
      gameMode: map.gameMode,
      image: map.image,
      description: map.description,
      recommendedBrawlers: map.recommendedBrawlers.map(brawler => ({
        name: brawler.name,
        reason: brawler.reason || '',
        power: brawler.power
      }))
    };
  }

  return processedData;
};

export const fetchAndProcessMapsData = async (): Promise<Record<string, MapData>> => {
  try {
    const maps = mapData.list;
    const processedData = await processMapsData(maps);
    mapsDataCache = processedData;
    return processedData;
  } catch (error) {
    console.error('Error processing map data:', error);
    throw error;
  }
};

export const initializeMapData = async (): Promise<Record<string, MapData>> => {
  const maps = mapData.list;
  const processedData = await processMapsData(maps);
  
  mapsDataCache = processedData;
  console.log('Initialized maps:', Object.keys(mapsDataCache));
  return processedData;
};

export const refreshMapDataWithNewLanguage = async (): Promise<void> => {
  try {
    mapsDataCache = await fetchAndProcessMapsData();
  } catch (error) {
    console.error('Error refreshing map data:', error);
  }
};

export const getMapData = (mapId: string): MapData | undefined => {
  try {
    const map = mapsDataCache[mapId];
    if (map) return map;

    const mapFromOtherLang = Object.values(mapsDataCache).find(
      m => m.name === mapId || m.nameEn === mapId || m.nameKo === mapId
    );
    return mapFromOtherLang;
  } catch (error) {
    console.error('Error getting map data:', error);
    return undefined;
  }
};

export const getAllMaps = (): MapData[] => {
  return Object.values(mapsDataCache);
};

export const getMapsByGameMode = (gameMode: string): MapData[] => {
  return Object.values(mapsDataCache).filter(map => map.gameMode === gameMode);
};