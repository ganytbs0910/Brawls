// useBrawlStarsApi.ts
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://brawls-api-wrapper.onrender.com/api';

export interface Brawler {
  id: number;
  name: string;
  power: number;
  rank: number;
  trophies: number;
  highestTrophies: number;
}

export interface PlayerInfo {
  tag: string;
  name: string;
  nameColor: string;
  icon: {
    id: number;
  };
  trophies: number;
  highestTrophies: number;
  expLevel: number;
  '3vs3Victories': number;
  soloVictories: number;
  duoVictories: number;
  brawlers: Brawler[];
}

export interface RankingItem {
  tag: string;
  name: string;
  nameColor: string;
  icon: {
    id: number;
  };
  trophies: number;
  rank: number;
  club?: {
    name: string;
  };
}

export interface BattleLogItem {
  battleTime: string;
  event: {
    id: number;
    mode: string;
    map: string;
  };
  battle: {
    mode: string;
    type: string;
    result: string;
    duration: number;
    starPlayer: {
      tag: string;
      name: string;
      brawler: {
        id: number;
        name: string;
        power: number;
        trophies: number;
      }
    };
    teams: Array<Array<{
      tag: string;
      name: string;
      brawler: {
        id: number;
        name: string;
        power: number;
        trophies: number;
      }
    }>>;
  };
}

interface BrawlStarsState {
  brawlers: {
    loading: boolean;
    error: string | null;
    data: Brawler[] | null;
  };
  player: {
    loading: boolean;
    error: string | null;
    data: {
      playerInfo: PlayerInfo;
      battleLog: BattleLogItem[];
    } | null;
  };
  rankings: {
    loading: boolean;
    error: string | null;
    data: { [key: string]: RankingItem[] } | null;
  };
}

export const validatePlayerTag = (tag: string | undefined): string => {
  if (!tag || typeof tag !== 'string') return '';
  
  try {
    let cleanTag = tag.replace(/^#/, '');
    cleanTag = cleanTag.replace(/[^A-Z0-9]/gi, '');
    cleanTag = cleanTag.toUpperCase();
    return cleanTag;
  } catch (err) {
    console.error('Error in validatePlayerTag:', err);
    return '';
  }
};

export const useBrawlStarsApi = () => {
  const [state, setState] = useState<BrawlStarsState>({
    brawlers: {
      loading: false,
      error: null,
      data: null
    },
    player: {
      loading: false,
      error: null,
      data: null
    },
    rankings: {
      loading: false,
      error: null,
      data: null
    }
  });

  const resetErrors = () => {
    setState(prev => ({
      ...prev,
      brawlers: { ...prev.brawlers, error: null },
      player: { ...prev.player, error: null },
      rankings: { ...prev.rankings, error: null }
    }));
  };

  const fetchBrawlers = async () => {
    setState(prev => ({
      ...prev,
      brawlers: { ...prev.brawlers, loading: true, error: null }
    }));
    
    try {
      const response = await fetch(`${API_BASE_URL}/brawlers`);

      if (!response.ok) {
        throw new Error(`キャラ情報の取得に失敗しました: ${response.status}`);
      }

      const data = await response.json();
      setState(prev => ({
        ...prev,
        brawlers: { loading: false, error: null, data: data.items }
      }));

      return data.items;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'キャラ情報の取得に失敗しました';
      setState(prev => ({
        ...prev,
        brawlers: { loading: false, error, data: null }
      }));
      return null;
    }
  };

  const fetchPlayerData = async (tag: string) => {
    resetErrors();

    setState(prev => ({
      ...prev,
      player: { ...prev.player, loading: true, error: null }
    }));

    try {
      const cleanTag = validatePlayerTag(tag);
      if (!cleanTag) {
        throw new Error('プレイヤータグが不正です');
      }

      const encodedTag = encodeURIComponent('#' + cleanTag);
      
      const [playerResponse, battleLogResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/players/${encodedTag}`),
        fetch(`${API_BASE_URL}/battlelog/${encodedTag}`)
      ]);

      if (!playerResponse.ok || !battleLogResponse.ok) {
        throw new Error('プレイヤーが見つかりませんでした');
      }

      const [playerData, battleLogData] = await Promise.all([
        playerResponse.json(),
        battleLogResponse.json()
      ]).catch(err => {
        throw new Error('データの解析に失敗しました');
      });

      if (playerData.error) {
        throw new Error(playerData.error);
      }

      const responseTag = validatePlayerTag(playerData.tag);
      if (responseTag !== cleanTag) {
        throw new Error('プレイヤーデータの検証に失敗しました');
      }

      const result = {
        playerInfo: playerData,
        battleLog: battleLogData.items || []
      };

      setState(prev => ({
        ...prev,
        player: {
          loading: false,
          error: null,
          data: result
        }
      }));

      const brawlers = await fetchBrawlers();
      if (brawlers) {
        await fetchGlobalRankings(brawlers);
      }

      return result;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'プレイヤーデータの取得に失敗しました';
      setState(prev => ({
        ...prev,
        player: { loading: false, error, data: null }
      }));
      return null;
    }
  };

  const fetchGlobalRankings = async (brawlers: Brawler[]) => {
    setState(prev => ({
      ...prev,
      rankings: { ...prev.rankings, loading: true, error: null }
    }));

    try {
      const rankings: { [key: string]: RankingItem[] } = {};
      const batchSize = 10;
      const totalBatches = Math.ceil(brawlers.length / batchSize);
      
      for (let i = 0; i < brawlers.length; i += batchSize) {
        const batch = brawlers.slice(i, i + batchSize);
        const currentBatch = Math.floor(i / batchSize) + 1;

        const batchResults = await Promise.all(
          batch.map(async (brawler) => {
            try {
              const brawlerId = brawler.id.toString();
              const response = await fetch(
                `${API_BASE_URL}/rankings/global/brawlers/${brawlerId}`
              );

              if (!response.ok) {
                console.error(`Rankings fetch failed for brawler ${brawlerId}: ${response.status}`);
                return { brawlerId, rankings: [] };
              }

              const data = await response.json();
              return { brawlerId, rankings: data.items };
            } catch (err) {
              console.error(`Error fetching rankings for brawler ${brawler.id}:`, err);
              return { brawlerId: brawler.id.toString(), rankings: [] };
            }
          })
        );

        batchResults.forEach(result => {
          if (result) {
            rankings[result.brawlerId] = result.rankings;
          }
        });

        setState(prev => ({
          ...prev,
          rankings: {
            ...prev.rankings,
            loading: currentBatch < totalBatches,
            data: { ...rankings }
          }
        }));

        if (currentBatch < totalBatches) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      setState(prev => ({
        ...prev,
        rankings: { loading: false, error: null, data: rankings }
      }));

      return rankings;
    } catch (err) {
      console.error('Global rankings fetch error:', err);
      const error = err instanceof Error ? err.message : 'ランキングの取得に失敗しました';
      setState(prev => ({
        ...prev,
        rankings: { loading: false, error, data: null }
      }));
      return null;
    }
  };

  const loadSavedTag = async () => {
    try {
      const savedTag = await AsyncStorage.getItem('brawlStarsPlayerTag');
      return savedTag;
    } catch (err) {
      console.error('保存されたタグの読み込みに失敗:', err);
      return null;
    }
  };

  const savePlayerTag = async (tag: string) => {
    try {
      await AsyncStorage.setItem('brawlStarsPlayerTag', tag);
      return true;
    } catch (err) {
      console.error('タグの保存に失敗:', err);
      return false;
    }
  };

  return {
    state,
    fetchBrawlers,
    fetchPlayerData,
    fetchGlobalRankings,
    loadSavedTag,
    savePlayerTag,
    validatePlayerTag,
    resetErrors
  };
};

// 後方互換性のための個別フック
export const useBrawlersData = () => {
  const { state: { brawlers }, fetchBrawlers } = useBrawlStarsApi();
  return { ...brawlers, fetchBrawlers };
};

export const usePlayerData = () => {
  const { 
    state: { player }, 
    fetchPlayerData, 
    loadSavedTag, 
    savePlayerTag,
    resetErrors 
  } = useBrawlStarsApi();
  
  return { 
    ...player, 
    fetchPlayerData, 
    loadSavedTag,
    savePlayerTag,
    resetErrors
  };
};

export const useGlobalRankings = () => {
  const { state: { rankings }, fetchGlobalRankings } = useBrawlStarsApi();
  return { ...rankings, fetchGlobalRankings };
};