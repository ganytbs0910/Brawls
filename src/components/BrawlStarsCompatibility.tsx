import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
} from 'react-native';

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

const BrawlStarsApp: React.FC = () => {
  const [battleLog, setBattleLog] = useState<BattleLogItem[]>([]);
  const [playerTag, setPlayerTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validatePlayerTag = (tag: string): string => {
    // Remove any existing # from the beginning
    let cleanTag = tag.replace(/^#/, '');
    
    // Remove any special characters and spaces
    cleanTag = cleanTag.replace(/[^A-Z0-9]/gi, '');
    
    // Convert to uppercase
    cleanTag = cleanTag.toUpperCase();
    
    return cleanTag;
  };

  const fetchBattleLog = async () => {
    setLoading(true);
    setError('');

    try {
      const cleanTag = validatePlayerTag(playerTag);
      
      if (!cleanTag) {
        throw new Error('プレイヤータグを入力してください');
      }

      // URLエンコードされた#（%23）を使用
      const encodedTag = encodeURIComponent('#' + cleanTag);
      
      console.log('Fetching:', `https://api.brawlstars.com/v1/players/${encodedTag}/battlelog`);
      
      const response = await fetch(
        `https://api.brawlstars.com/v1/players/${encodedTag}/battlelog`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || 
          `APIエラー: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      
      if (!data.items || !Array.isArray(data.items)) {
        throw new Error('バトルログのデータ形式が不正です');
      }

      setBattleLog(data.items);
    } catch (err) {
      console.error('Error details:', err);
      setError(err instanceof Error ? err.message : 'バトルログの取得に失敗しました');
      setBattleLog([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Brawl Stars Analyzer</Text>
      </View>

      <ScrollView style={styles.content}>
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
              onPress={fetchBattleLog}
              disabled={loading}
            >
              <Text style={styles.searchButtonText}>
                {loading ? '読み込み中...' : '取得'}
              </Text>
            </TouchableOpacity>
          </View>

          {error !== '' && (
            <Text style={styles.errorText}>{error}</Text>
          )}

          {loading ? (
            <ActivityIndicator size="large" color="#2196F3" />
          ) : (
            <View style={styles.battleLogContainer}>
              {battleLog.map((battle, index) => (
                <View key={index} style={styles.battleCard}>
                  <Text style={styles.battleMode}>
                    {battle.event.mode} - {battle.event.map}
                  </Text>
                  <Text style={styles.battleTime}>
                    {new Date(battle.battleTime).toLocaleString()}
                  </Text>
                  <Text style={[
                    styles.battleResult,
                    { color: battle.battle.result === 'victory' ? '#4CAF50' : '#F44336' }
                  ]}>
                    {battle.battle.result.toUpperCase()}
                  </Text>
                  <Text style={styles.starPlayer}>
                    Star Player: {battle.battle.starPlayer.name}
                    ({battle.battle.starPlayer.brawler.name})
                  </Text>
                  
                  <View style={styles.teamsContainer}>
                    {battle.battle.teams.map((team, teamIndex) => (
                      <View key={teamIndex} style={styles.teamCard}>
                        <Text style={styles.teamTitle}>Team {teamIndex + 1}</Text>
                        {team.map((player, playerIndex) => (
                          <Text key={playerIndex} style={styles.playerInfo}>
                            {player.name} - {player.brawler.name}
                            (Power {player.brawler.power})
                          </Text>
                        ))}
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#2196F3',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
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
    color: '#F44336',
    marginBottom: 8,
  },
  battleLogContainer: {
    marginTop: 8,
  },
  battleCard: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
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
    marginTop: 8,
  },
  starPlayer: {
    marginTop: 8,
  },
  teamsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginHorizontal: -4,
  },
  teamCard: {
    flex: 1,
    margin: 4,
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  teamTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  playerInfo: {
    fontSize: 12,
    marginBottom: 2,
  },
});

export default BrawlStarsApp;