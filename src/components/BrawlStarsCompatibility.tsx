import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  SectionList,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BattleLog } from '../components/BattleLog';
import { CHARACTER_IMAGES, isValidCharacterName } from '../data/characterImages';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 3;

interface Brawler {
  id: number;
  name: string;
  power: number;
  rank: number;
  trophies: number;
  highestTrophies: number;
}

interface PlayerInfo {
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

interface RankingItem {
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

interface BattleLogItem {
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

const BrawlerList: React.FC<{ brawlers: Brawler[], globalRankings: any }> = ({ brawlers, globalRankings }) => {
  const sortedBrawlers = [...brawlers].sort((a, b) => b.trophies - a.trophies);
  const rows = [];
  
  for (let i = 0; i < sortedBrawlers.length; i += 3) {
    rows.push(sortedBrawlers.slice(i, i + 3));
  }

  const getPortraitSource = (brawlerName: string) => {
    try {
      // キャラクター名を正規化
      // スペースを削除し、最初の文字を小文字に、その後の単語の最初の文字を大文字に
      const normalizedName = brawlerName
        .replace(/\s+/g, '')
        .replace(/^./, str => str.toLowerCase())
        .replace(/[A-Z]/g, str => str.toLowerCase())
        .replace(/(?:^|\s+)(\w)/g, (_, letter) => letter.toLowerCase());

      // 特殊なケースの処理
      const nameMap: { [key: string]: string } = {
        '8bit': 'eightBit',
        'mr.p': 'mrp',
        'larryandlawrie': 'larryandLawrie',
        // 他の特殊なケースがあればここに追加
      };

      const mappedName = nameMap[normalizedName] || normalizedName;

      // 型チェックと画像の取得
      if (isValidCharacterName(mappedName)) {
        return CHARACTER_IMAGES[mappedName];
      }
      
      console.warn(`No image found for character: ${brawlerName} (normalized: ${mappedName})`);
      return null;
    } catch (error) {
      console.error(`Error loading portrait for ${brawlerName}:`, error);
      return null;
    }
  };

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.brawlerContainer}
    >
      {rows.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.brawlerColumn}>
          {row.map((brawler) => {
            const globalTopTrophies = globalRankings[brawler.id]?.[0]?.trophies;
            const portraitSource = getPortraitSource(brawler.name);
            
            return (
              <View key={brawler.id} style={styles.brawlerCard}>
                <View style={styles.brawlerHeader}>
                  {portraitSource && (
                    <Image
                      source={portraitSource}
                      style={styles.brawlerPortrait}
                      resizeMode="contain"
                    />
                  )}
                  <Text style={styles.brawlerName}>{brawler.name}</Text>
                </View>
                <View style={styles.brawlerDetails}>
                  <Text style={styles.brawlerStat}>
                    現在: {brawler.trophies.toLocaleString()}🏆
                  </Text>
                  <Text style={styles.brawlerStat}>
                    最高: {brawler.highestTrophies.toLocaleString()}🏆
                  </Text>
                  {globalTopTrophies && (
                    <Text style={[styles.brawlerStat, styles.globalTopTrophies]}>
                      世界Top: {globalTopTrophies.toLocaleString()}🏆
                    </Text>
                  )}
                  <Text style={styles.brawlerStat}>
                    Rank {brawler.rank} / Pow {brawler.power}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      ))}
    </ScrollView>
  );
};

const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImUwYTllMGQ5LTgwOGItNDhiNC1hYmYwLWQ1NmI1MTI1ODA0MyIsImlhdCI6MTczNTkzMzEzOSwic3ViIjoiZGV2ZWxvcGVyL2RmZDI0NWMwLWY4ZTgtMDY4NC1hOWRjLWJlMzYyYzRkOTJmOSIsInNjb3BlcyI6WyJicmF3bHN0YXJzIl0sImxpbWl0cyI6W3sidGllciI6ImRldmVsb3Blci9zaWx2ZXIiLCJ0eXBlIjoidGhyb3R0bGluZyJ9LHsiY2lkcnMiOlsiMTI2LjIwNy4xOTUuMTcyIl0sInR5cGUiOiJjbGllbnQifV19.mcSzoW0kNN40kVY7uSN0MOSXpeQ1WejAqw2gDMzS5otqQBmjeyr9Uef8472UAlDgcc8_ZcZpS0hEcHTsbAGl4Q';

export default function BrawlStarsApp() {
  const [battleLog, setBattleLog] = useState<BattleLogItem[]>([]);
  const [playerInfo, setPlayerInfo] = useState<PlayerInfo | null>(null);
  const [playerTag, setPlayerTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [globalRankings, setGlobalRankings] = useState<{ [key: string]: RankingItem[] }>({});
  const [rankingsLoading, setRankingsLoading] = useState(false);
  const [rankingsError, setRankingsError] = useState('');
  const [brawlers, setBrawlers] = useState<Brawler[]>([]);
  const [brawlersLoading, setBrawlersLoading] = useState(false);
  const [brawlersError, setBrawlersError] = useState('');

  const fetchBrawlers = async () => {
    setBrawlersLoading(true);
    setBrawlersError('');
    
    try {
      const response = await fetch(
        'https://api.brawlstars.com/v1/brawlers',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`ブロウラー情報の取得に失敗しました: ${response.status}`);
      }

      const data = await response.json();
      setBrawlers(data.items);
      
      await fetchGlobalRankings(data.items);
    } catch (err) {
      console.error('Brawlers error:', err);
      setBrawlersError(err instanceof Error ? err.message : 'ブロウラー情報の取得に失敗しました');
    } finally {
      setBrawlersLoading(false);
    }
  };

  useEffect(() => {
    fetchBrawlers();
    
    // 保存されたタグを読み込むが、自動検索はしない
    const loadSavedTag = async () => {
      try {
        const savedTag = await AsyncStorage.getItem('brawlStarsPlayerTag');
        if (savedTag) {
          setPlayerTag(savedTag);
        }
      } catch (err) {
        console.error('Error loading saved tag:', err);
      }
    };

    loadSavedTag();
  }, []);

  const fetchGlobalRankings = async (availableBrawlers: Brawler[]) => {
    setRankingsLoading(true);
    setRankingsError('');

    try {
      const rankings = {};
      const brawlerIds = availableBrawlers.map(b => b.id.toString());
      
      for (let i = 0; i < brawlerIds.length; i += 5) {
        const batch = brawlerIds.slice(i, i + 5);
        await Promise.all(
          batch.map(async (brawlerId) => {
            try {
              const response = await fetch(
                `https://api.brawlstars.com/v1/rankings/global/brawlers/${brawlerId}`,
                {
                  headers: {
                    'Authorization': `Bearer ${token}`,
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

        if (i + 2 < brawlerIds.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      setGlobalRankings(rankings);
    } catch (err) {
      console.error('Rankings error:', err);
      setRankingsError(err instanceof Error ? err.message : 'ランキングの取得に失敗しました');
    } finally {
      setRankingsLoading(false);
    }
  };

  const validatePlayerTag = (tag: string | undefined): string => {
    if (!tag || typeof tag !== 'string') return '';
    
    try {
      let cleanTag = tag.replace(/^#/, '');
      cleanTag = cleanTag.replace(/[^A-Z0-9]/gi, '');
      cleanTag = cleanTag.toUpperCase();
      console.log('Validating tag:', tag, '-> cleaned:', cleanTag);
      return cleanTag;
    } catch (err) {
      console.error('Error in validatePlayerTag:', err);
      return '';
    }
  };

  const fetchPlayerData = async (tag: string | undefined) => {
    setLoading(true);
    setError('');
    setBattleLog([]);
    setPlayerInfo(null);

    try {
      if (!tag || !tag.trim()) {
        throw new Error('プレイヤータグを入力してください');
      }

      const cleanTag = validatePlayerTag(tag);
      if (!cleanTag) {
        throw new Error('プレイヤータグが不正です');
      }

      const encodedTag = encodeURIComponent('#' + cleanTag);
      
      // タグは検索時に保存
      try {
        await AsyncStorage.setItem('brawlStarsPlayerTag', tag);
      } catch (storageErr) {
        console.error('Error saving tag:', storageErr);
      }
      
      // 以下のAPIリクエスト処理は変更なし
      const playerResponse = await fetch(
        `https://api.brawlstars.com/v1/players/${encodedTag}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        }
      );

      if (!playerResponse.ok) {
        const errorData = await playerResponse.json().catch(() => null);
        throw new Error(
          errorData?.reason || errorData?.message || 
          `APIエラー: ${playerResponse.status} ${playerResponse.statusText}`
        );
      }

      const playerData = await playerResponse.json();
      setPlayerInfo(playerData);

      const battleLogResponse = await fetch(
        `https://api.brawlstars.com/v1/players/${encodedTag}/battlelog`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        }
      );

      if (!battleLogResponse.ok) {
        throw new Error(`バトルログの取得に失敗しました: ${battleLogResponse.status}`);
      }

      const battleLogData = await battleLogResponse.json();
      setBattleLog(battleLogData.items);
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const renderSearchSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>バトルログ</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          value={playerTag}
          onChangeText={setPlayerTag}
          placeholder="#XXXXXXXXX"
          autoCapitalize="characters"
          autoCorrect={false}
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => fetchPlayerData(playerTag)}
          disabled={loading || !playerTag.trim()}
        >
          <Text style={styles.searchButtonText}>
            {loading ? '読み込み中...' : '取得'}
          </Text>
        </TouchableOpacity>
      </View>
      {error !== '' && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

  const renderPlayerInfo = () => (
<View style={styles.infoSection}>
      <View style={styles.infoGrid}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>名前</Text>
          <Text style={styles.infoValue}>{playerInfo?.name}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>タグ</Text>
          <Text style={styles.infoValue}>{playerInfo?.tag}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>最高トロフィー</Text>
          <Text style={styles.infoValue}>{playerInfo?.highestTrophies.toLocaleString()}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>現在トロフィー</Text>
          <Text style={styles.infoValue}>{playerInfo?.trophies.toLocaleString()}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>レベル</Text>
          <Text style={styles.infoValue}>{playerInfo?.expLevel}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>3vs3 勝利数</Text>
          <Text style={styles.infoValue}>{playerInfo?.['3vs3Victories'].toLocaleString()}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>ソロ勝利数</Text>
          <Text style={styles.infoValue}>{playerInfo?.soloVictories.toLocaleString()}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>デュオ勝利数</Text>
          <Text style={styles.infoValue}>{playerInfo?.duoVictories.toLocaleString()}</Text>
        </View>
      </View>
    </View>
  );

  const sections = [
    {
      type: 'search',
      data: [null]
    },
    ...(playerInfo ? [
      {
        type: 'player',
        title: 'プレイヤー情報',
        data: [playerInfo]
      },
      {
        type: 'brawlers',
        title: 'ブロウラー一覧',
        data: [{ brawlers: playerInfo.brawlers, globalRankings }]
      }
    ] : []),
    ...(battleLog.length > 0 ? [{
      type: 'battles',
      title: '直近の対戦（最新3件）',
      data: battleLog.slice(0, 3)
    }] : [])
  ];

  const renderSectionHeader = ({ section }) => {
    if (section.type === 'search') return null;
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
      </View>
    );
  };

  const renderItem = ({ item, section }) => {
    switch (section.type) {
      case 'search':
        return renderSearchSection();
      case 'player':
        return renderPlayerInfo();
      case 'brawlers':
        return <BrawlerList brawlers={item.brawlers} globalRankings={item.globalRankings} />;
      case 'battles':
        return <BattleLog battleLog={section.data} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Brawl Stars Analyzer</Text>
      </View>

      <SectionList
        sections={sections}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.content}
        stickySectionHeadersEnabled={false}
      />

      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2196F3" />
            <Text style={styles.loadingText}>データを取得中...</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    backgroundColor: '#2196F3',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    backgroundColor: '#fff',
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#f44336',
    marginBottom: 16,
  },
  infoSection: {
    marginBottom: 16,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  infoItem: {
    width: '45%',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  brawlerContainer: {
    flexGrow: 0,
    paddingHorizontal: 16,
  },
  brawlerColumn: {
    width: CARD_WIDTH,
    marginRight: 8,
  },
  brawlerCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    height: 160,
  },
  brawlerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  brawlerPortrait: {
    width: 40,
    height: 40,
    marginRight: 8,
    borderRadius: 20,
  },
  brawlerName: {
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
  },
  brawlerDetails: {
    gap: 4,
  },
  brawlerStat: {
    fontSize: 12,
  },
  globalTopTrophies: {
    color: '#2196F3',
    fontWeight: '500',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    minWidth: 150,
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
  }
});