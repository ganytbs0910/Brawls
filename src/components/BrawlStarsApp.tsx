import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  SectionList,
} from 'react-native';
import { BattleLog } from './BattleLog';
import { PlayerInfo } from './PlayerInfo';
import { 
  useBrawlersData, 
  usePlayerData, 
  useGlobalRankings
} from '../hooks/useBrawlStarsApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BrawlStarsApp() {
  const [playerTag, setPlayerTag] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const brawlersData = useBrawlersData();
  const playerData = usePlayerData();
  const rankingsData = useGlobalRankings();

  const handleSearch = useCallback(async () => {
    if (!playerTag.trim()) return;

    try {
      const cleanTag = playerTag.replace('#', '');
      
      // 検索前に既存のデータをクリア
      playerData.data = null;
      rankingsData.data = null;
      
      // 検索履歴の更新
      const newHistory = [cleanTag, ...searchHistory.filter(tag => tag !== cleanTag)].slice(0, 3);
      setSearchHistory(newHistory);
      
      // 履歴の保存
      await Promise.all([
        AsyncStorage.setItem('searchHistory', JSON.stringify(newHistory)),
        AsyncStorage.setItem('lastPlayerTag', cleanTag)
      ]);

      // プレイヤーデータの取得
      await playerData.fetchPlayerData(playerTag);
    } catch (error) {
      console.error('Search error:', error);
    }
  }, [playerTag, searchHistory, playerData]);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsInitialized(false);
        
        // 保存データの読み込みを先に行う
        const [savedTag, savedHistoryStr] = await Promise.all([
          AsyncStorage.getItem('lastPlayerTag'),
          AsyncStorage.getItem('searchHistory'),
        ]);

        if (savedTag) {
          setPlayerTag(savedTag);
        }

        const savedHistory = savedHistoryStr ? JSON.parse(savedHistoryStr) : [];
        setSearchHistory(savedHistory.slice(0, 3));

        // Brawlersデータの取得
        await brawlersData.fetchBrawlers();
      } catch (error) {
        console.error('Initialization error:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeApp();
  }, []);

  useEffect(() => {
    if (isInitialized && playerData.data?.playerInfo) {
      const playerBrawlers = playerData.data.playerInfo.brawlers;
      rankingsData.fetchGlobalRankings(playerBrawlers);
    }
  }, [isInitialized, playerData.data?.playerInfo]);

  const handleHistorySelect = useCallback((tag: string) => {
    setPlayerTag(tag);
  }, []);

  const sections = [
    {
      type: 'search',
      data: [null]
    },
    ...(playerData.data?.playerInfo ? [
      {
        type: 'player',
        title: 'プレイヤー情報',
        data: [{
          info: playerData.data.playerInfo,
          rankings: rankingsData.data || {},
          rankingsLoading: rankingsData.loading
        }]
      },
      {
        type: 'battles',
        title: '直近の対戦',
        data: [playerData.data.battleLog]
      }
    ] : [])
  ];

  const renderSearchSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>プレイヤータグ</Text>
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
          onPress={handleSearch}
          disabled={playerData.loading || !playerTag.trim()}
        >
          <Text style={styles.searchButtonText}>
            {playerData.loading ? '読み込み中...' : '取得'}
          </Text>
        </TouchableOpacity>
      </View>

      {playerData.error && <Text style={styles.errorText}>{playerData.error}</Text>}

      {searchHistory.length > 0 && (
        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>検索履歴</Text>
          {searchHistory.map((tag, index) => (
            <View key={index} style={styles.historyItemContainer}>
              <TouchableOpacity 
                style={{ flex: 1 }} 
                onPress={() => handleHistorySelect(tag)}
              >
                <Text style={styles.historyItem}>{tag}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={async () => {
                  const newHistory = searchHistory.filter(t => t !== tag);
                  setSearchHistory(newHistory);
                  await AsyncStorage.setItem('searchHistory', JSON.stringify(newHistory));
                }}
              >
                <Text style={styles.deleteText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  const renderItem = ({ item, section }) => {
    switch (section.type) {
      case 'search':
        return renderSearchSection();
      case 'player':
        return (
          <PlayerInfo
            info={item.info}
            rankings={item.rankings}
            rankingsLoading={item.rankingsLoading}
          />
        );
      case 'battles':
        return <BattleLog battleLog={item} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>プレイヤー分析</Text>
      </View>

      <SectionList
        sections={sections}
        renderItem={renderItem}
        renderSectionHeader={({ section }) => (
          section.type !== 'search' ? (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
          ) : null
        )}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.content}
        stickySectionHeadersEnabled={false}
      />

      {playerData.loading && (
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
    padding: 8,
  },
  section: {
    marginBottom: 8,
  },
  sectionHeader: {
    backgroundColor: '#fff',
    paddingVertical: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
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
    marginBottom: 12,
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
  },
  historyContainer: {
    marginTop: 16,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  historyItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    marginBottom: 4,
    paddingLeft: 12,
  },
  historyItem: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 8,
    color: '#2196F3',
  },
  deleteButton: {
    padding: 8,
  },
  deleteText: {
    color: '#f44336',
    fontSize: 16,
  },
});