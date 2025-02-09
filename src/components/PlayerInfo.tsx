import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  ActivityIndicator,
  NativeModules,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { 
  PlayerInfo as PlayerInfoType,
  RankingItem
} from '../hooks/useBrawlStarsApi';
import { CHARACTER_IMAGES, isValidCharacterName } from '../data/characterImages';
import { usePlayerInfoTranslation, Language } from '../i18n/playerInfo';
import { CHARACTER_NAMES, JAPANESE_TO_ENGLISH_MAP } from '../data/characterCompatibility';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 32) / 3;

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
      'meeple': 'meep',
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

const getLocalizedCharacterName = (characterName: string, currentLanguage: Language): string => {
  const englishKey = JAPANESE_TO_ENGLISH_MAP[characterName] || characterName.toLowerCase();
  const characterData = CHARACTER_NAMES[englishKey as keyof typeof CHARACTER_NAMES];
  return characterData ? characterData[currentLanguage] : characterName;
};

export const PlayerInfo: React.FC<PlayerInfoProps> = ({ 
  info, 
  rankings,
  rankingsLoading
}) => {
  const { t, currentLanguage } = usePlayerInfoTranslation();
  
  const validBrawlers = info.brawlers.filter(brawler => brawler.id !== 16000088);
  const currentTrophies = validBrawlers.reduce((sum, brawler) => sum + brawler.trophies, 0);

  const infoPairs = [
    [
      { 
        label: t.labels.name, 
        value: info.name,
        icon: require('../../assets/OtherIcon/name_icon.png')
      },
      { 
        label: t.labels.tag, 
        value: info.tag,
        icon: require('../../assets/OtherIcon/Infor_Icon.png')
      }
    ],
    [
      { 
        label: t.labels.highestTrophies, 
        value: info.highestTrophies.toLocaleString(),
        icon: require('../../assets/OtherIcon/trophy_Icon.png')
      },
      { 
        label: t.labels.currentTrophies, 
        value: currentTrophies.toLocaleString(),
        icon: require('../../assets/OtherIcon/trophy_Icon.png')
      }
    ],
    [
      { 
        label: t.labels.level, 
        value: info.expLevel.toString(),
        icon: require('../../assets/OtherIcon/ranking_Icon.png')
      },
      { 
        label: t.labels.threeVsThree, 
        value: `${info['3vs3Victories'].toLocaleString()}${t.labels.wins}`,
        icon: require('../../assets/GameModeIcons/gem_grab_icon.png')
      }
    ],
    [
      { 
        label: t.labels.solo, 
        value: `${info.soloVictories.toLocaleString()}${t.labels.wins}`,
        icon: require('../../assets/GameModeIcons/showdown_icon.png')
      },
      { 
        label: t.labels.duo, 
        value: `${info.duoVictories.toLocaleString()}${t.labels.wins}`,
        icon: require('../../assets/GameModeIcons/duo_showdown_icon.png')
      }
    ]
  ];

  const sortedBrawlers = [...validBrawlers].sort((a, b) => a.id - b.id);
    
  const numColumns = 3;
  const numRows = Math.ceil(sortedBrawlers.length / numColumns);
  const grid = [];
  
  for (let col = 0; col < numColumns; col++) {
    for (let row = 0; row < numRows; row++) {
      const index = row + (col * numRows);
      if (index < sortedBrawlers.length) {
        grid.push(sortedBrawlers[index]);
      }
    }
  }

  const rows = [];
  for (let i = 0; i < grid.length; i += 3) {
    rows.push(grid.slice(i, i + 3));
  }

  return (
    <View style={styles.container}>
      <View style={styles.infoGrid}>
        <View style={styles.infoPairContainer}>
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

      <Text style={styles.sectionTitle}>{t.labels.characterList}</Text>
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
              const localizedName = getLocalizedCharacterName(brawler.name, currentLanguage);
              
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
                    <Text style={styles.brawlerName} numberOfLines={1}>
                      {localizedName}
                    </Text>
                  </View>
                  <View style={styles.brawlerDetails}>
                    <View style={styles.statContainer}>
                      <Image 
                        source={require('../../assets/OtherIcon/trophy_Icon.png')}
                        style={styles.trophyIcon}
                        resizeMode="contain"
                      />
                      <Text style={styles.brawlerStat}>
                        {`${t.labels.current}: ${brawler.trophies.toLocaleString()}`}
                      </Text>
                    </View>
                    <View style={styles.statContainer}>
                      <Image 
                        source={require('../../assets/OtherIcon/trophy_Icon.png')}
                        style={styles.trophyIcon}
                        resizeMode="contain"
                      />
                      <Text style={styles.brawlerStat}>
                        {`${t.labels.highest}: ${brawler.highestTrophies.toLocaleString()}`}
                      </Text>
                    </View>
                    {globalTopTrophies && (
                      <View style={styles.statContainer}>
                        <Image 
                          source={require('../../assets/OtherIcon/trophy_Icon.png')}
                          style={styles.trophyIcon}
                          resizeMode="contain"
                        />
                        <Text style={[styles.brawlerStat, styles.globalTopTrophies]}>
                          {`${t.labels.worldTop}: ${globalTopTrophies.toLocaleString()}`}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        ))}
        {rankingsLoading && (
          <View style={styles.rankingsLoading}>
            <ActivityIndicator size="small" color="#2196F3" />
            <Text>{t.labels.loadingRankings}</Text>
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
    padding: 12,
    marginBottom: 16,
  },
  infoPairContainer: {
    marginBottom: 8,
  },
  infoPair: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  infoItem: {
    flex: 1,
    paddingHorizontal: 3,
  },
  infoItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 1,
  },
  infoIcon: {
    width: 20,
    height: 20,
    marginRight: 6,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 26,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  brawlerContainer: {
    flexGrow: 0,
    paddingHorizontal: 6,
  },
  brawlerColumn: {
    width: CARD_WIDTH,
    marginRight: 6,
  },
  brawlerCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    padding: 8,
    marginBottom: 4,
    height: 120,
  },
  brawlerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  brawlerPortrait: {
    width: 40,
    height: 40,
    marginRight: 6,
    borderRadius: 20,
  },
  brawlerName: {
    fontSize: 13,
    fontWeight: 'bold',
    flex: 1,
  },
  brawlerDetails: {
    gap: 3,
  },
  statContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brawlerStat: {
    fontSize: 11,
  },
  globalTopTrophies: {
    color: '#2196F3',
    fontWeight: '500',
  },
  trophyIcon: {
    width: 14,
    height: 14,
    marginRight: 3,
    marginBottom: 1,
  },
  rankingsLoading: {
    width: CARD_WIDTH,
    height: 120, 
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    marginRight: 6,
    gap: 6,
  },
});

export default PlayerInfo;