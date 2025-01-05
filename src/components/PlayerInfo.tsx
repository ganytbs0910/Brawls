import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import type { 
  PlayerInfo as PlayerInfoType,
  Brawler,
  RankingItem
} from '../hooks/useBrawlStarsApi';
import { CHARACTER_IMAGES, isValidCharacterName } from '../data/characterImages';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width + 42) / 3;

interface PlayerInfoProps {
  info: PlayerInfoType;
  rankings: { [key: string]: RankingItem[] };
  rankingsLoading: boolean;
}

const getPortraitSource = (brawlerName: string) => {
  try {
    const normalizedName = brawlerName
      .replace(/\s+/g, '')
      .replace(/^./, str => str.toLowerCase())
      .replace(/[A-Z]/g, str => str.toLowerCase())
      .replace(/(?:^|\s+)(\w)/g, (_, letter) => letter.toLowerCase());

    const nameMap: { [key: string]: string } = {
      '8bit': 'eightBit',
      'mr.p': 'mrp',
      'larryandlawrie': 'larryandLawrie',
    };

    const mappedName = nameMap[normalizedName] || normalizedName;

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

export const PlayerInfo: React.FC<PlayerInfoProps> = ({ 
  info, 
  rankings,
  rankingsLoading
}) => {
  // Split player info into pairs for better grouping
  const infoPairs = [
    [
      { 
        label: '名前', 
        value: info.name,
        icon: require('../../assets/OtherIcon/name_icon.png')
      },
      { 
        label: 'タグ', 
        value: info.tag,
        icon: require('../../assets/OtherIcon/Infor_Icon.png')
      }
    ],
    [
      { 
        label: '最高トロフィー', 
        value: info.highestTrophies.toLocaleString(),
        icon: require('../../assets/OtherIcon/trophy_Icon.png')
      },
      { 
        label: '現在トロフィー', 
        value: info.trophies.toLocaleString(),
        icon: require('../../assets/OtherIcon/trophy_Icon.png')
      }
    ],
    [
      { 
        label: 'レベル', 
        value: info.expLevel.toString(),
        icon: require('../../assets/OtherIcon/ranking_Icon.png')
      },
      { 
        label: '3vs3', 
        value: info['3vs3Victories'].toLocaleString(),
        icon: require('../../assets/GameModeIcons/gem_grab_icon.png')
      }
    ],
    [
      { 
        label: 'ソロ', 
        value: info.soloVictories.toLocaleString(),
        icon: require('../../assets/GameModeIcons/showdown_icon.png')
      },
      { 
        label: 'デュオ', 
        value: info.duoVictories.toLocaleString(),
        icon: require('../../assets/GameModeIcons/duo_showdown_icon.png')
      }
    ]
  ];

  // IDでソートしたブロウラーリスト
  const sortedBrawlers = [...info.brawlers].sort((a, b) => a.id - b.id);
  
  // 3列のグリッドを作成
  const numColumns = 3;
  const numRows = Math.ceil(sortedBrawlers.length / numColumns);
  const grid = [];
  
  // 縦方向に並べる
  for (let col = 0; col < numColumns; col++) {
    for (let row = 0; row < numRows; row++) {
      const index = row + (col * numRows);
      if (index < sortedBrawlers.length) {
        grid.push(sortedBrawlers[index]);
      }
    }
  }

  // 3つずつの行に分割
  const rows = [];
  for (let i = 0; i < grid.length; i += 3) {
    rows.push(grid.slice(i, i + 3));
  }

  return (
    <View style={styles.container}>
      {/* Player info grid with paired layout */}
      <View style={styles.infoGrid}>
        <View style={styles.infoPairContainer}>
          {/* First pair group */}
          <View style={styles.infoPair}>
            {infoPairs[0].map((item, index) => (
              <View key={index} style={styles.infoItem}>
                <View style={styles.infoItemHeader}>
                  <Image 
                    source={item.icon}
                    style={styles.infoIcon}
                    resizeMode="contain"
                  />
                  <Text style={styles.infoLabel}>{item.label}</Text>
                </View>
                <Text style={styles.infoValue} numberOfLines={1}>{item.value}</Text>
              </View>
            ))}
          </View>
          
          {/* Second pair group */}
          <View style={styles.infoPair}>
            {infoPairs[1].map((item, index) => (
              <View key={index} style={styles.infoItem}>
                <View style={styles.infoItemHeader}>
                  <Image 
                    source={item.icon}
                    style={styles.infoIcon}
                    resizeMode="contain"
                  />
                  <Text style={styles.infoLabel}>{item.label}</Text>
                </View>
                <Text style={styles.infoValue} numberOfLines={1}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.infoPairContainer}>
          {/* Third pair group */}
          <View style={styles.infoPair}>
            {infoPairs[2].map((item, index) => (
              <View key={index} style={styles.infoItem}>
                <View style={styles.infoItemHeader}>
                  <Image 
                    source={item.icon}
                    style={styles.infoIcon}
                    resizeMode="contain"
                  />
                  <Text style={styles.infoLabel}>{item.label}</Text>
                </View>
                <Text style={styles.infoValue} numberOfLines={1}>{item.value}</Text>
              </View>
            ))}
          </View>
          
          {/* Fourth pair group */}
          <View style={styles.infoPair}>
            {infoPairs[3].map((item, index) => (
              <View key={index} style={styles.infoItem}>
                <View style={styles.infoItemHeader}>
                  <Image 
                    source={item.icon}
                    style={styles.infoIcon}
                    resizeMode="contain"
                  />
                  <Text style={styles.infoLabel}>{item.label}</Text>
                </View>
                <Text style={styles.infoValue} numberOfLines={1}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* ブロウラーリスト */}
      <Text style={styles.sectionTitle}>キャラ一覧</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.brawlerContainer}
      >
        {rows.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.brawlerColumn}>
            {row.map((brawler) => {
              const globalTopTrophies = rankings[brawler.id]?.[0]?.trophies;
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
                    <Text style={styles.brawlerName} numberOfLines={1}>{brawler.name}</Text>
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
        {rankingsLoading && (
          <View style={styles.rankingsLoading}>
            <ActivityIndicator size="small" color="#2196F3" />
            <Text>ランキング取得中...</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  infoGrid: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  infoPairContainer: {
    marginBottom: 12, // Reduced spacing between pair groups
  },
  infoPair: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8, // Spacing between items within a pair
  },
  infoItem: {
    flex: 1,
    paddingHorizontal: 4,
  },
  infoItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  infoIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  brawlerContainer: {
    flexGrow: 0,
    paddingHorizontal: 8,
  },
  brawlerColumn: {
    width: CARD_WIDTH,
    marginRight: 8,
  },
  brawlerCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 6,
    height: 160,
  },
  brawlerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  brawlerPortrait: {
    width: 48,
    height: 48,
    marginRight: 8,
    borderRadius: 24,
  },
  brawlerName: {
    fontSize: 15,
    fontWeight: 'bold',
    flex: 1,
  },
  brawlerDetails: {
    gap: 4,
  },
  brawlerStat: {
    fontSize: 13,
  },
  globalTopTrophies: {
    color: '#2196F3',
    fontWeight: '500',
  },
  rankingsLoading: {
    width: CARD_WIDTH,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginRight: 8,
    gap: 8,
  },
});

export default PlayerInfo;