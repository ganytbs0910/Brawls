import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  SectionList
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PlayerInfo {
  tag: string;
  name: string;
  trophies: number;
  highestTrophies: number;
  expLevel: number;
  expPoints: number;
  isQualifiedFromChampionshipChallenge: boolean;
  '3vs3Victories': number;
  soloVictories: number;
  duoVictories: number;
  bestRoboRumbleTime: number;
  bestTimeAsBigBrawler: number;
  club?: {
    tag: string;
    name: string;
  };
  brawlers: Array<{
    id: number;
    name: string;
    power: number;
    rank: number;
    trophies: number;
    highestTrophies: number;
    gears?: Array<{
      id: number;
      name: string;
      level: number;
    }>;
    starPowers?: Array<{
      id: number;
      name: string;
    }>;
    gadgets?: Array<{
      id: number;
      name: string;
    }>;
  }>;
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

const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImUwYTllMGQ5LTgwOGItNDhiNC1hYmYwLWQ1NmI1MTI1ODA0MyIsImlhdCI6MTczNTkzMzEzOSwic3ViIjoiZGV2ZWxvcGVyL2RmZDI0NWMwLWY4ZTgtMDY4NC1hOWRjLWJlMzYyYzRkOTJmOSIsInNjb3BlcyI6WyJicmF3bHN0YXJzIl0sImxpbWl0cyI6W3sidGllciI6ImRldmVsb3Blci9zaWx2ZXIiLCJ0eXBlIjoidGhyb3R0bGluZyJ9LHsiY2lkcnMiOlsiMTI2LjIwNy4xOTUuMTcyIl0sInR5cGUiOiJjbGllbnQifV19.mcSzoW0kNN40kVY7uSN0MOSXpeQ1WejAqw2gDMzS5otqQBmjeyr9Uef8472UAlDgcc8_ZcZpS0hEcHTsbAGl4Q';

export default function BrawlStarsApp() {
  const [battleLog, setBattleLog] = useState<BattleLogItem[]>([]);
  const [playerInfo, setPlayerInfo] = useState<PlayerInfo | null>(null);
  const [playerTag, setPlayerTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSavedTag = async () => {
      try {
        const savedTag = await AsyncStorage.getItem('brawlStarsPlayerTag');
        if (savedTag) {
          setPlayerTag(savedTag);
          fetchPlayerData(savedTag);
        }
      } catch (err) {
        console.error('Error loading saved tag:', err);
      }
    };

    loadSavedTag();
  }, []);

  const validatePlayerTag = (tag: string): string => {
    let cleanTag = tag.replace(/^#/, '');
    cleanTag = cleanTag.replace(/[^A-Z0-9]/gi, '');
    cleanTag = cleanTag.toUpperCase();
    return cleanTag;
  };

  const fetchPlayerData = async (tag: string) => {
    setLoading(true);
    setError('');
    setBattleLog([]);
    setPlayerInfo(null);

    try {
      const cleanTag = validatePlayerTag(tag);
      if (!cleanTag) {
        throw new Error('プレイヤータグを入力してください');
      }

      const encodedTag = encodeURIComponent('#' + cleanTag);
      
      try {
        await AsyncStorage.setItem('brawlStarsPlayerTag', tag);
      } catch (storageErr) {
        console.error('Error saving tag:', storageErr);
      }

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
          errorData?.message || 
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

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const renderSearchSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>バトルログ</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          value={playerTag}
          onChangeText={setPlayerTag}
          placeholder="#C9LC0LP"
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => fetchPlayerData(playerTag)}
          disabled={loading}
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
          <Text style={styles.infoLabel}>トロフィー</Text>
          <Text style={styles.infoValue}>{playerInfo?.trophies.toLocaleString()}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>最高トロフィー</Text>
          <Text style={styles.infoValue}>{playerInfo?.highestTrophies.toLocaleString()}</Text>
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
          <Text style={styles.infoLabel}>クラブ</Text>
          <Text style={styles.infoValue}>{playerInfo?.club?.name || 'なし'}</Text>
        </View>
      </View>
    </View>
  );

  const renderBrawlerItem = ({ item: brawler }) => (
    <View style={styles.brawlerCard}>
      <Text style={styles.brawlerName}>{brawler.name}</Text>
      <View style={styles.brawlerDetails}>
        <Text style={styles.brawlerStat}>
          トロフィー: {brawler.trophies.toLocaleString()}
        </Text>
        <Text style={styles.brawlerStat}>
          ランク: {brawler.rank}
        </Text>
        <Text style={styles.brawlerStat}>
          パワー: {brawler.power}
        </Text>
      </View>
      {brawler.starPowers && brawler.starPowers.length > 0 && (
        <View style={styles.powerSection}>
          <Text style={styles.powerTitle}>スターパワー:</Text>
          {brawler.starPowers.map((sp) => (
            <Text key={sp.id} style={styles.powerItem}>
              • {sp.name}
            </Text>
          ))}
        </View>
      )}
      {brawler.gadgets && brawler.gadgets.length > 0 && (
        <View style={styles.powerSection}>
          <Text style={styles.powerTitle}>ガジェット:</Text>
          {brawler.gadgets.map((gadget) => (
            <Text key={gadget.id} style={styles.powerItem}>
              • {gadget.name}
            </Text>
          ))}
        </View>
      )}
    </View>
  );

  const renderBattleItem = ({ item: battle }) => (
    <View style={styles.battleCard}>
      <View style={styles.battleHeader}>
        <View>
          <Text style={styles.battleMode}>
            {battle.event.mode} - {battle.event.map}
          </Text>
          <Text style={styles.battleTime}>
            {new Date(battle.battleTime).toLocaleString()}
          </Text>
        </View>
        <Text 
          style={[
            styles.battleResult,
            { color: battle.battle.result === 'victory' ? '#4CAF50' : '#F44336' }
          ]}
        >
          {battle.battle.result.toUpperCase()}
        </Text>
      </View>

      <Text style={styles.starPlayer}>
        Star Player: {battle.battle.starPlayer.name}
        ({battle.battle.starPlayer.brawler.name})
      </Text>

      <View style={styles.teamsContainer}>
        {battle.battle.teams.map((team, teamIndex) => (
          <View key={teamIndex} style={styles.teamCard}>
            <Text style={styles.teamTitle}>Team {teamIndex + 1}</Text>
            {team.map((player, playerIndex) => (
              <View key={playerIndex} style={styles.playerInfo}>
                <Text style={styles.playerName}>{player.name}</Text>
                <Text style={styles.playerBrawler}>
                  {player.brawler.name} - Power {player.brawler.power}
                  ({player.brawler.trophies.toLocaleString()} トロフィー)
                </Text>
              </View>
            ))}
          </View>
        ))}
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
        title: 'ブロウラー（トップ10）',
        data: playerInfo.brawlers
          .sort((a, b) => b.trophies - a.trophies)
          .slice(0, 10)
      }
    ] : []),
    ...(battleLog.length > 0 ? [{
      type: 'battles',
      title: '直近の対戦',
      data: battleLog
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
        return renderBrawlerItem({ item });
      case 'battles':
        return renderBattleItem({ item });
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
  brawlerCard: {
    width: '48%',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    marginRight: '4%',
  },
  brawlerCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  brawlerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  brawlerDetails: {
    gap: 4,
  },
  brawlerStat: {
    fontSize: 14,
  },
  powerSection: {
    marginTop: 8,
  },
  powerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  powerItem: {
    fontSize: 14,
    marginLeft: 8,
    color: '#666',
  },
  battleCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  battleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  battleMode: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  battleTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  battleResult: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  starPlayer: {
    fontSize: 14,
    marginBottom: 16,
  },
  teamsContainer: {
    gap: 12,
  },
  teamCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
  },
  teamTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  playerInfo: {
    marginBottom: 8,
  },
  playerName: {
    fontSize: 14,
    fontWeight: '500',
  },
  playerBrawler: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
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