import React, { useState } from 'react';
import { SafeAreaView, View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import BrawlStarsCompatibility from './components/BrawlStarsCompatibility';
import TeamCompatibility from './components/TeamCompatibility';
import BrawlStarsRankings from './components/BrawlStarsRankings';
import Home from './components/Home';

const App = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'single' | 'team' | 'rankings'>('home');

  const tabs = [
    {
      key: 'home',
      label: 'ホーム',
      icon: require('../assets/AppIcon/home.png'),
    },
    {
      key: 'single',
      label: 'キャラ相性',
      icon: require('../assets/AppIcon/compatibility.png'),
    },
    {
      key: 'team',
      label: 'チーム分析',
      icon: require('../assets/AppIcon/analysis.png'),
    },
    {
      key: 'rankings',
      label: 'ランキング',
      icon: require('../assets/AppIcon/ranking.png'),
    },
  ];

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
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
            onPress={() => setActiveTab(tab.key as typeof activeTab)}
          >
            <Image
              source={tab.icon}
              style={[styles.tabIcon, activeTab === tab.key && styles.activeTabIcon]}
            />
            <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
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
    paddingVertical: 8,
    alignItems: 'center',
  },
  activeTab: {
    borderTopWidth: 2,
    borderTopColor: '#2196F3',
  },
  tabIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
    tintColor: '#666',
  },
  activeTabIcon: {
    tintColor: '#2196F3',
  },
  tabText: {
    fontSize: 12,
    color: '#666',
  },
  activeTabText: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
});

export default App;