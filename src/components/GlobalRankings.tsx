import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface RankingItem {
  tag: string;
  name: string;
  nameColor: string;
  icon: {
    id: number;
  };
  trophies: number;
  rank: number;
}

interface GlobalRankingsProps {
  rankings: { [key: string]: RankingItem[] };
  loading: boolean;
  error: string;
}

export const GlobalRankings: React.FC<GlobalRankingsProps> = ({ rankings, loading, error }) => {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#2196F3" />
        <Text style={styles.loadingText}>ランキングデータを取得中...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {Object.values(rankings).map((rankingItems) => (
        rankingItems.slice(0, 3).map((item, index) => (
          <View key={item.tag} style={styles.rankingItem}>
            <Text style={styles.rank}>#{index + 1}</Text>
            <View style={styles.playerInfo}>
              <Text style={styles.playerName}>{item.name}</Text>
              <Text style={styles.trophies}>{item.trophies.toLocaleString()} トロフィー</Text>
            </View>
          </View>
        ))
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    padding: 8,
  },
  rank: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 12,
    color: '#2196F3',
    minWidth: 40,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  trophies: {
    fontSize: 14,
    color: '#666',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: '#666',
  },
  errorContainer: {
    padding: 20,
  },
  errorText: {
    color: '#f44336',
  },
});

export default GlobalRankings;