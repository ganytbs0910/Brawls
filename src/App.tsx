import React, { useState } from 'react';
import { SafeAreaView, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import BrawlStarsCompatibility from './components/BrawlStarsCompatibility';
import TeamCompatibility from './components/TeamCompatibility';
import BrawlStarsRankings from './components/BrawlStarsRankings';
import Home from './components/Home';

const App = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'single' | 'team' | 'rankings'>('home');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {activeTab === 'home' ? (
          <Home />
        ) : activeTab === 'single' ? (
          <BrawlStarsCompatibility />
        ) : activeTab === 'team' ? (
          <TeamCompatibility />
        ) : (
          <BrawlStarsRankings />
        )}
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'home' && styles.activeTab]}
          onPress={() => setActiveTab('home')}
        >
          <Text style={[styles.tabText, activeTab === 'home' && styles.activeTabText]}>
            ホーム
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'single' && styles.activeTab]}
          onPress={() => setActiveTab('single')}
        >
          <Text style={[styles.tabText, activeTab === 'single' && styles.activeTabText]}>
            キャラクター相性
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'team' && styles.activeTab]}
          onPress={() => setActiveTab('team')}
        >
          <Text style={[styles.tabText, activeTab === 'team' && styles.activeTabText]}>
            3vs3チーム分析
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'rankings' && styles.activeTab]}
          onPress={() => setActiveTab('rankings')}
        >
          <Text style={[styles.tabText, activeTab === 'rankings' && styles.activeTabText]}>
            最強ランキング
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderTopWidth: 2,
    borderTopColor: '#2196F3',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
});

export default App;