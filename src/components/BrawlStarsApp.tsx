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
} from 'react-native';
import { BattleLog } from './BattleLog';
import { PlayerInfo } from './PlayerInfo';
import { 
  useBrawlersData, 
  usePlayerData, 
  useGlobalRankings
} from '../hooks/useBrawlStarsApi';

export default function BrawlStarsApp() {
  const [playerTag, setPlayerTag] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const brawlersData = useBrawlersData();
  const playerData = usePlayerData();
  const rankingsData = useGlobalRankings();

  // アプリの初期化処理
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const brawlersPromise = brawlersData.fetchBrawlers();
        const savedTag = await playerData.loadSavedTag();
        if (savedTag) {
          setPlayerTag(savedTag);
          const playerPromise = playerData.fetchPlayerData(savedTag);
          await Promise.all([brawlersPromise, playerPromise]);
        } else {
          await brawlersPromise;
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Initialization error:', error);
        setIsInitialized(true);
      }
    };
    initializeApp();
  }, []);

  // rankingsデータの取得を最適化
  useEffect(() => {
    if (isInitialized && brawlersData.data) {
      // チャンク単位でrankingsを取得
      const fetchRankingsInChunks = async () => {
        const CHUNK_SIZE = 5; // 一度に取得するbrawler数
        const brawlers = [...brawlersData.data];
        
        for (let i = 0; i < brawlers.length; i += CHUNK_SIZE) {
          const chunk = brawlers.slice(i, i + CHUNK_SIZE);
          await rankingsData.fetchGlobalRankings(chunk);
          
          // ユーザーが画面を見ているときのみ次のチャンクを取得
          if (document.visibilityState === 'visible') {
            // 次のチャンクまでの短い待機時間
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
      };

      fetchRankingsInChunks();
    }
  }, [isInitialized, brawlersData.data]);

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
          onPress={() => playerData.fetchPlayerData(playerTag)}
          disabled={playerData.loading || !playerTag.trim()}
        >
          <Text style={styles.searchButtonText}>
            {playerData.loading ? '読み込み中...' : '取得'}
          </Text>
        </TouchableOpacity>
      </View>
      {playerData.error && <Text style={styles.errorText}>{playerData.error}</Text>}
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
});