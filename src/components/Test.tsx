import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();
const PLAYER_TAG_KEY = 'brawlstars_player_tag';

const HomeScreen = () => {
  const [playerTag, setPlayerTag] = useState('');
  const [playerInfo, setPlayerInfo] = useState(null);
  const [battleLog, setBattleLog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPlayerTag();
  }, []);

  const loadPlayerTag = async () => {
    try {
      const savedTag = await AsyncStorage.getItem(PLAYER_TAG_KEY);
      if (savedTag) {
        setPlayerTag(savedTag);
        fetchPlayerData(savedTag);
      }
    } catch (error) {
      console.error('Error loading player tag:', error);
    }
  };

  const fetchPlayerData = async (tag) => {
    setLoading(true);
    setError(null);
    try {
      // デモデータ
      const playerData = {
        "tag": "#C9LCOLP",
        "name": "がん",
        "nameColor": "0xfff9c908",
        "icon": { "id": 28000647 },
        "trophies": 74528,
        "highestTrophies": 74245,
        "expLevel": 328,
        "expPoints": 549109,
        "isQualifiedFromChampionshipChallenge": false,
        "3vs3Victories": 35996,
        "soloVictories": 1303,
        "duoVictories": 739,
        "bestRoboRumbleTime": 20,
        "bestTimeAsBigBrawler": 0,
        "club": {
          "tag": "#VL2YUU0",
          "name": "Desires"
        }
      };

      const battleLogData = {
        "items": [
          {
            "battleTime": "20241231T130551.000Z",
            "event": {
              "id": 15000548,
              "mode": "knockout",
              "map": "Out in the Open"
            },
            "battle": {
              "mode": "knockout",
              "type": "soloRanked",
              "result": "defeat",
              "duration": 79,
              "starPlayer": {
                "tag": "#2LP9RCGV",
                "name": "GUE | NIFY🍥",
                "brawler": {
                  "id": 16000015,
                  "name": "PIPER",
                  "power": 11,
                  "trophies": 18
                }
              },
              "teams": [
                [
                  {
                    "tag": "#YR00YLY2R",
                    "name": "消費者",
                    "brawler": {
                      "id": 16000022,
                      "name": "TICK",
                      "power": 11,
                      "trophies": 19
                    }
                  }
                ]
              ]
            }
          }
        ]
      };

      setPlayerInfo(playerData);
      setBattleLog(battleLogData);
    } catch (error) {
      setError('エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      await AsyncStorage.setItem(PLAYER_TAG_KEY, playerTag);
      fetchPlayerData(playerTag);
    } catch (error) {
      console.error('Error saving player tag:', error);
    }
  };

  const renderPlayerInfo = () => {
    if (!playerInfo) return null;

    return (
      <View style={styles.playerCard}>
        <View style={styles.playerHeader}>
          <Text style={styles.playerName}>{playerInfo.name}</Text>
          <Text style={styles.playerTag}>{playerInfo.tag}</Text>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>トロフィー</Text>
            <Text style={styles.statValue}>{playerInfo.trophies}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>最高トロフィー</Text>
            <Text style={styles.statValue}>{playerInfo.highestTrophies}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>レベル</Text>
            <Text style={styles.statValue}>{playerInfo.expLevel}</Text>
          </View>
        </View>

        <View style={styles.victoriesContainer}>
          <Text style={styles.victoriesTitle}>勝利数</Text>
          <View style={styles.victoriesStats}>
            <Text>3vs3: {playerInfo['3vs3Victories']}</Text>
            <Text>ソロ: {playerInfo.soloVictories}</Text>
            <Text>デュオ: {playerInfo.duoVictories}</Text>
          </View>
        </View>

        {playerInfo.club && (
          <View style={styles.clubInfo}>
            <Text style={styles.clubTitle}>クラブ</Text>
            <Text style={styles.clubName}>{playerInfo.club.name}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderBattleResult = (battle) => {
    const getResultColor = (result) => {
      switch (result) {
        case 'victory': return '#4CAF50';
        case 'defeat': return '#F44336';
        default: return '#9E9E9E';
      }
    };

    return (
      <View style={[styles.battleCard, { borderLeftColor: getResultColor(battle.battle.result) }]}>
        <Text style={styles.battleMode}>
          {battle.event.mode.toUpperCase()} - {battle.battle.type}
        </Text>
        <Text style={styles.battleMap}>{battle.event.map}</Text>
        
        <View style={styles.battleDetails}>
          <Text style={[styles.battleResult, { color: getResultColor(battle.battle.result) }]}>
            {battle.battle.result.toUpperCase()}
          </Text>
          <Text style={styles.duration}>{battle.battle.duration}秒</Text>
        </View>

        {battle.battle.starPlayer && (
          <View style={styles.starPlayerContainer}>
            <Text style={styles.starPlayerLabel}>Star Player</Text>
            <Text style={styles.starPlayerName}>
              {battle.battle.starPlayer.name} ({battle.battle.starPlayer.brawler.name})
            </Text>
          </View>
        )}

        <View style={styles.teamsContainer}>
          {battle.battle.teams.map((team, teamIndex) => (
            <View key={teamIndex} style={styles.teamContainer}>
              <Text style={styles.teamLabel}>Team {teamIndex + 1}</Text>
              {team.map((player, playerIndex) => (
                <View key={playerIndex} style={styles.playerContainer}>
                  <Text style={styles.playerName}>{player.name}</Text>
                  <Text style={styles.brawlerInfo}>
                    {player.brawler.name} (P{player.brawler.power} / T{player.brawler.trophies})
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        <Text style={styles.battleTime}>
          {new Date(battle.battleTime).toLocaleString()}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>バトルログ検索</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>プレイヤータグ</Text>
          <TextInput
            style={styles.input}
            value={playerTag}
            onChangeText={setPlayerTag}
            placeholder="#から始まるタグを入力"
            placeholderTextColor="#999"
            autoCapitalize="characters"
          />
          <TouchableOpacity 
            style={styles.button}
            onPress={handleSearch}
          >
            <Text style={styles.buttonText}>検索</Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <ActivityIndicator size="large" color="#21A0DB" style={styles.loading} />
        )}

        {error && (
          <Text style={styles.error}>{error}</Text>
        )}

        <ScrollView style={styles.scrollContainer}>
          {renderPlayerInfo()}
          {battleLog && battleLog.items.map((battle, index) => (
            <View key={index}>
              {renderBattleResult(battle)}
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 60,
    backgroundColor: '#21A0DB',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#4FA8D6',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  scrollContainer: {
    flex: 1,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#21A0DB',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loading: {
    marginTop: 20,
  },
  error: {
    color: '#F44336',
    marginTop: 20,
    textAlign: 'center',
  },
  playerCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  playerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  playerName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  playerTag: {
    fontSize: 14,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  victoriesContainer: {
    marginBottom: 16,
  },
  victoriesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  victoriesStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  clubInfo: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
  },
  clubTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  clubName: {
    fontSize: 14,
    color: '#666',
  },
  battleCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  battleMode: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  battleMap: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  battleDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  battleResult: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  duration: {
    fontSize: 14,
    color: '#666',
  },
  starPlayerContainer: {
    backgroundColor: '#FFF9C4',
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  starPlayerLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  starPlayerName: {
    fontSize: 14,
  },
  teamsContainer: {
    marginTop: 8,
  },
  teamContainer: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
  },
  teamLabel: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  playerContainer: {
    marginVertical: 4,
  },
  playerName: {
    fontSize: 14,
  },
  brawlerInfo: {
    fontSize: 12,
    color: '#666',
  },
  battleTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
});

export default App;