import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImUwYTllMGQ5LTgwOGItNDhiNC1hYmYwLWQ1NmI1MTI1ODA0MyIsImlhdCI6MTczNTkzMzEzOSwic3ViIjoiZGV2ZWxvcGVyL2RmZDI0NWMwLWY4ZTgtMDY4NC1hOWRjLWJlMzYyYzRkOTJmOSIsInNjb3BlcyI6WyJicmF3bHN0YXJzIl0sImxpbWl0cyI6W3sidGllciI6ImRldmVsb3Blci9zaWx2ZXIiLCJ0eXBlIjoidGhyb3R0bGluZyJ9LHsiY2lkcnMiOlsiMTI2LjIwNy4xOTUuMTcyIl0sInR5cGUiOiJjbGllbnQifV19.mcSzoW0kNN40kVY7uSN0MOSXpeQ1WejAqw2gDMzS5otqQBmjeyr9Uef8472UAlDgcc8_ZcZpS0hEcHTsbAGl4Q';

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

interface ApiResponse<T> {
  loading: boolean;
  error: string;
  data: T | null;
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

export const useBrawlersData = () => {
  const [state, setState] = useState<ApiResponse<Brawler[]>>({
    loading: false,
    error: '',
    data: null
  });

  const fetchBrawlers = async () => {
    setState(prev => ({ ...prev, loading: true, error: '' }));
    
    try {
      const response = await fetch(
        'https://api.brawlstars.com/v1/brawlers',
        {
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`ブロウラー情報の取得に失敗しました: ${response.status}`);
      }

      const data = await response.json();
      setState({ loading: false, error: '', data: data.items });
    } catch (err) {
      setState({
        loading: false,
        error: err instanceof Error ? err.message : 'ブロウラー情報の取得に失敗しました',
        data: null
      });
    }
  };

  return { ...state, fetchBrawlers };
};

export const usePlayerData = () => {
  const [state, setState] = useState<ApiResponse<{
    playerInfo: PlayerInfo;
    battleLog: BattleLogItem[];
  }>>({
    loading: false,
    error: '',
    data: null
  });

  const fetchPlayerData = async (tag: string) => {
    setState(prev => ({ ...prev, loading: true, error: '' }));

    try {
      const cleanTag = validatePlayerTag(tag);
      if (!cleanTag) {
        throw new Error('プレイヤータグが不正です');
      }

      const encodedTag = encodeURIComponent('#' + cleanTag);
      
      await AsyncStorage.setItem('brawlStarsPlayerTag', tag);
      
      const [playerResponse, battleLogResponse] = await Promise.all([
        fetch(`https://api.brawlstars.com/v1/players/${encodedTag}`, {
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Accept': 'application/json'
          }
        }),
        fetch(`https://api.brawlstars.com/v1/players/${encodedTag}/battlelog`, {
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Accept': 'application/json'
          }
        })
      ]);

      if (!playerResponse.ok || !battleLogResponse.ok) {
        throw new Error('プレイヤーデータの取得に失敗しました');
      }

      const [playerData, battleLogData] = await Promise.all([
        playerResponse.json(),
        battleLogResponse.json()
      ]);

      setState({
        loading: false,
        error: '',
        data: {
          playerInfo: playerData,
          battleLog: battleLogData.items
        }
      });
    } catch (err) {
      setState({
        loading: false,
        error: err instanceof Error ? err.message : 'プレイヤーデータの取得に失敗しました',
        data: null
      });
    }
  };

  const loadSavedTag = async () => {
    try {
      const savedTag = await AsyncStorage.getItem('brawlStarsPlayerTag');
      if (savedTag) {
        return savedTag;
      }
    } catch (err) {
      console.error('保存されたタグの読み込みに失敗:', err);
    }
    return null;
  };

  return { ...state, fetchPlayerData, loadSavedTag };
};

export const useGlobalRankings = () => {
  const [state, setState] = useState<ApiResponse<{ [key: string]: RankingItem[] }>>({
    loading: false,
    error: '',
    data: null
  });

  const fetchGlobalRankings = async (brawlers: Brawler[]) => {
    setState(prev => ({ ...prev, loading: true, error: '' }));

    try {
      const rankings = {};
      const brawlerIds = brawlers.map(b => b.id.toString());
      
      for (let i = 0; i < brawlerIds.length; i += 5) {
        const batch = brawlerIds.slice(i, i + 5);
        await Promise.all(
          batch.map(async (brawlerId) => {
            try {
              const response = await fetch(
                `https://api.brawlstars.com/v1/rankings/global/brawlers/${brawlerId}`,
                {
                  headers: {
                    'Authorization': `Bearer ${API_TOKEN}`,
                    'Accept': 'application/json'
                  }
                }
              );

              if (!response.ok) {
                console.warn(`ブロウラーID ${brawlerId} のランキング取得に失敗: ${response.status}`);
                return;
              }

              const data = await response.json();
              rankings[brawlerId] = data.items;
            } catch (err) {
              console.warn(`ブロウラーID ${brawlerId} のランキング取得でエラー:`, err);
            }
          })
        );

        // Rate limiting
        if (i + 2 < brawlerIds.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      setState({ loading: false, error: '', data: rankings });
    } catch (err) {
      setState({
        loading: false,
        error: err instanceof Error ? err.message : 'ランキングの取得に失敗しました',
        data: null
      });
    }
  };

  return { ...state, fetchGlobalRankings };
};