import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useCharacterDetailsTranslation } from '../i18n/characterDetails';
import { useCharacterLocalization } from '../hooks/useCharacterLocalization';
import { getMapData, getMapInfo, initializeMapData } from '../data/mapDataService';
import { CHARACTER_NAMES, JAPANESE_TO_ENGLISH_MAP } from '../data/characterCompatibility';

const gameModeIcons = {
  gemGrab: require('../../assets/GameModeIcons/gem_grab_icon.png'),
  brawlBall: require('../../assets/GameModeIcons/brawl_ball_icon.png'),
  heist: require('../../assets/GameModeIcons/heist_icon.png'),
  knockout: require('../../assets/GameModeIcons/knock_out_icon.png'),
  bounty: require('../../assets/GameModeIcons/bounty_icon.png'),
  hotZone: require('../../assets/GameModeIcons/hot_zone_icon.png'),
  wipeout: require('../../assets/GameModeIcons/wipeout_icon.png'),
  brawlBall5v5: require('../../assets/GameModeIcons/5v5brawl_ball_icon.png'),
  wipeout5v5: require('../../assets/GameModeIcons/5v5wipeout_icon.png'),
  knockout5v5: require('../../assets/GameModeIcons/knock_out_icon.png'),
  duels: require('../../assets/GameModeIcons/duels_icon.png'),
  showdown: require('../../assets/GameModeIcons/showdown_icon.png'),
  duoShowdown: require('../../assets/GameModeIcons/duo_showdown_icon.png'),
  rankFront: require('../../assets/GameModeIcons/rank_front.png'),
};

const normalizeGameMode = (mode) => {
  const modeMap = {
    'エメラルドハント': 'gemgrab',
    'ブロストライカー': 'brawlball',
    '強奪': 'heist',
    'ノックアウト': 'knockout',
    '賞金稼ぎ': 'bounty',
    'ホットゾーン': 'hotzone',
    '殲滅': 'wipeout',
    'ワイプアウト': 'wipeout',
    '5v5ブロストライカー': 'brawlball5v5',
    '5v5殲滅': 'wipeout5v5',
    '5v5ノックアウト': 'knockout5v5',
    '5v5ワイプアウト': 'wipeout5v5',
    'デュエル': 'duels',
    'バトルロイヤル': 'showdown',
    'デュオバトルロワイヤル': 'duoshowdown',
    'ガチバトル': 'rankfront'
  };

  return modeMap[mode.trim()] || mode.toLowerCase().replace(/\s+/g, '');
};

const RecommendedMaps = ({ characterName }) => {
  const { t, currentLanguage } = useCharacterDetailsTranslation();
  const { getLocalizedName } = useCharacterLocalization();
  const [groupedMaps, setGroupedMaps] = useState({});

  const japaneseCharacterName = CHARACTER_NAMES[JAPANESE_TO_ENGLISH_MAP[characterName] || characterName.toLowerCase()]?.ja || characterName;

  const modeInfo = {
    'gemgrab': { 
      color: "#DA70D6", 
      label: t.maps?.modes.gemGrab || "エメラルドハント",
      icon: gameModeIcons.gemGrab
    },
    'brawlball': { 
      color: "#4169E1", 
      label: t.maps?.modes.brawlBall || "ブロストライカー",
      icon: gameModeIcons.brawlBall
    },
    'heist': { 
      color: "#FF4500", 
      label: t.maps?.modes.heist || "強奪",
      icon: gameModeIcons.heist
    },
    'knockout': { 
      color: "#FFA500", 
      label: t.maps?.modes.knockout || "ノックアウト",
      icon: gameModeIcons.knockout
    },
    'bounty': { 
      color: "#DA70D6", 
      label: t.maps?.modes.bounty || "賞金稼ぎ",
      icon: gameModeIcons.bounty
    },
    'hotzone': { 
      color: "#FF69B4", 
      label: t.maps?.modes.hotZone || "ホットゾーン",
      icon: gameModeIcons.hotZone
    },
    'wipeout': {
      color: "#8A2BE2",
      label: t.maps?.modes.wipeout || "殲滅",
      icon: gameModeIcons.wipeout
    },
    'brawlball5v5': {
      color: "#4169E1",
      label: t.maps?.modes.brawlBall5v5 || "5vs5ブロストライカー",
      icon: gameModeIcons.brawlBall5v5
    },
    'knockout5v5': {
      color: "#4169E1",
      label: t.maps?.modes.knockout5v5 || "5vs5ノックアウト",
      icon: gameModeIcons.knockout5v5
    },
    'wipeout5v5': {
      color: "#8A2BE2",
      label: t.maps?.modes.wipeout5v5 || "5vs5殲滅",
      icon: gameModeIcons.wipeout5v5
    },
    'duels': {
      color: "#DC143C",
      label: t.maps?.modes.duels || "デュエル",
      icon: gameModeIcons.duels
    },
    'showdown': {
      color: "#32CD32",
      label: t.maps?.modes.showdown || "バトルロイヤル",
      icon: gameModeIcons.showdown
    },
    'rankfront': {
      color: "#99ff66",
      label: t.maps?.modes.rankFront || "ガチバトル",
      icon: gameModeIcons.rankFront
    }
  };

  useEffect(() => {
    const loadMaps = async () => {
      try {
        const initializedData = await initializeMapData();
        if (!initializedData) {
          console.warn('Failed to initialize map data');
          return;
        }

        const allMaps = Object.values(initializedData);
        
        const filteredMaps = allMaps
          .filter(map => {
            return map?.recommendedBrawlers?.some(
              brawler => brawler.name === japaneseCharacterName && brawler.power >= 4
            );
          })
          .map(map => {
            if (!map) return null;

            const normalizedGameMode = normalizeGameMode(map.gameMode);
            const mode = modeInfo[normalizedGameMode] || { 
              color: "#cccccc", 
              label: map.gameMode,
              icon: null
            };

            const recommendedBrawler = map.recommendedBrawlers.find(
              b => b.name === japaneseCharacterName
            );

            // Get localized map name based on current language
            const localizedMapName = currentLanguage === 'en' ? map.nameEn : 
                                   currentLanguage === 'ko' ? map.nameKo : 
                                   map.name;

            return {
              name: localizedMapName,
              mode: mode.label,
              gameMode: normalizedGameMode,
              power: recommendedBrawler?.power || 0,
              modeColor: mode.color,
              modeIcon: mode.icon,
              mapImage: map.image
            };
          })
          .filter(Boolean);

        const grouped = filteredMaps.reduce((acc, map) => {
          if (!acc[map.gameMode]) {
            acc[map.gameMode] = [];
          }
          acc[map.gameMode].push(map);
          return acc;
        }, {});

        setGroupedMaps(grouped);
      } catch (error) {
        console.error('Error loading maps:', error);
      }
    };

    loadMaps();
  }, [japaneseCharacterName, currentLanguage, t.maps?.modes]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t.maps?.recommendedTitle || "推奨マップ"}</Text>
      </View>
      
      {Object.entries(groupedMaps).map(([mode, maps]) => (
        <View key={mode} style={styles.modeSection}>
          <View style={styles.modeHeader}>
            {modeInfo[mode]?.icon && (
              <Image 
                source={modeInfo[mode].icon}
                style={styles.modeSectionIcon}
                resizeMode="contain"
              />
            )}
            <Text style={[styles.modeName, { color: modeInfo[mode]?.color }]}>
              {modeInfo[mode]?.label}
            </Text>
          </View>

          <View style={styles.mapGrid}>
            {maps.map((map, index) => (
              <View key={index} style={styles.mapCard}>
                <Text style={styles.mapName} numberOfLines={2}>
                  {map.name}
                </Text>
                
                {map.mapImage && (
                  <Image
                    source={map.mapImage}
                    style={styles.mapImage}
                    resizeMode="cover"
                  />
                )}
                
                <View style={styles.powerLevelContainer}>
                  <Text style={styles.powerLevelLabel}>
                    {t.maps?.powerLevel || "パワーレベル"}:
                  </Text>
                  <Text style={[styles.powerLevelValue, { color: map.modeColor }]}>
                    {map.power}/5
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      ))}
      
      {Object.keys(groupedMaps).length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            {t.maps?.noRecommendedMaps || "このキャラクターに推奨されるマップはありません"}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  modeSection: {
    marginBottom: 16,
  },
  modeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingLeft: 4,
  },
  modeSectionIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  modeName: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  mapGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  mapCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 10,
    marginHorizontal: '1%',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  mapName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  mapImage: {
    width: '100%',
    height: 120,
    borderRadius: 4,
    marginBottom: 8,
    backgroundColor: '#f0f0f0',
  },
  powerLevelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  powerLevelLabel: {
    fontSize: 13,
    color: '#666666',
    marginRight: 4,
  },
  powerLevelValue: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  emptyState: {
    padding: 16,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
});

export default RecommendedMaps;