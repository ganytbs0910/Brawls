import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useCharacterDetailsTranslation } from '../i18n/characterDetails';
import { useCharacterLocalization } from '../hooks/useCharacterLocalization';
import { getMapData, getMapInfo, initializeMapData } from '../data/mapDataService';
import { CHARACTER_NAMES, JAPANESE_TO_ENGLISH_MAP } from '../data/characterCompatibility';
// モードデータをインポート
import { getLocalizedModeName, GAME_MODES } from '../data/modeData';

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

// モードキーのマッピング
const MODE_MAPPING = {
  'gemgrab': 'GEM_GRAB',
  'brawlball': 'BRAWL_BALL',
  'heist': 'HEIST',
  'knockout': 'KNOCKOUT',
  'bounty': 'BOUNTY',
  'hotzone': 'HOT_ZONE',
  'wipeout': 'WIPEOUT',
  'brawlball5v5': 'BRAWL_BALL_5V5',
  'wipeout5v5': 'WIPEOUT_5V5', 
  'knockout5v5': 'KNOCKOUT', // 近いものを使用
  'duels': 'DUEL',
  'showdown': 'SOLO_BATTLE_ROYALE',
  'duoshowdown': 'DUO_BATTLE_ROYALE',
  'rankfront': 'RANK_FRONT'
};

// モードカラーの定義
const MODE_COLORS = {
  'gemgrab': "#DA70D6",
  'brawlball': "#4169E1",
  'heist': "#FF4500",
  'knockout': "#FFA500",
  'bounty': "#DA70D6",
  'hotzone': "#FF69B4",
  'wipeout': "#8A2BE2",
  'brawlball5v5': "#4169E1",
  'knockout5v5': "#FFA500",
  'wipeout5v5': "#8A2BE2",
  'duels': "#DC143C",
  'showdown': "#32CD32",
  'duoshowdown': "#32CD32",
  'rankfront': "#99ff66"
};

// モードアイコンのマッピング
const MODE_ICONS = {
  'gemgrab': 'gemGrab',
  'brawlball': 'brawlBall',
  'heist': 'heist',
  'knockout': 'knockout',
  'bounty': 'bounty',
  'hotzone': 'hotZone',
  'wipeout': 'wipeout',
  'brawlball5v5': 'brawlBall5v5',
  'knockout5v5': 'knockout5v5',
  'wipeout5v5': 'wipeout5v5',
  'duels': 'duels',
  'showdown': 'showdown',
  'duoshowdown': 'duoShowdown',
  'rankfront': 'rankFront'
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
            const gameModesKey = MODE_MAPPING[normalizedGameMode];
            
            // modeData.tsからローカライズされたモード名を取得
            const localizedModeName = gameModesKey 
              ? getLocalizedModeName(gameModesKey, currentLanguage as any) 
              : map.gameMode;

            const modeColor = MODE_COLORS[normalizedGameMode] || "#cccccc";
            const iconKey = MODE_ICONS[normalizedGameMode];
            const modeIcon = iconKey ? gameModeIcons[iconKey] : null;

            const recommendedBrawler = map.recommendedBrawlers.find(
              b => b.name === japaneseCharacterName
            );

            // 現在の言語に基づいてローカライズされたマップ名を取得
            const localizedMapName = currentLanguage === 'en' ? map.nameEn : 
                                   currentLanguage === 'ko' ? map.nameKo : 
                                    currentLanguage === 'es' ? map.nameEs :
                                    currentLanguage === 'ar' ? map.nameAr :
                                    currentLanguage === 'fr' ? map.nameFr :
                                    currentLanguage === 'zhTw' ? map.nameZhTw :
                                   map.name;

            return {
              name: localizedMapName,
              mode: localizedModeName,
              gameMode: normalizedGameMode,
              power: recommendedBrawler?.power || 0,
              modeColor: modeColor,
              modeIcon: modeIcon,
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
  }, [japaneseCharacterName, currentLanguage]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t.maps?.recommendedTitle || "推奨マップ"}</Text>
      </View>
      
      {Object.entries(groupedMaps).map(([mode, maps]) => (
        <View key={mode} style={styles.modeSection}>
          <View style={styles.modeHeader}>
            {maps[0].modeIcon && (
              <Image 
                source={maps[0].modeIcon}
                style={styles.modeSectionIcon}
                resizeMode="contain"
              />
            )}
            <Text style={[styles.modeName, { color: maps[0].modeColor }]}>
              {maps[0].mode}
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