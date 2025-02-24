import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import type { BattleLogItem } from '../hooks/useBrawlStarsApi';
import { CHARACTER_IMAGES, isValidCharacterName } from '../data/characterImages';
import { useBattleLogTranslation } from '../i18n/battleLog';
import { getMapData, initializeMapData } from '../data/mapDataService';
import { getModeIcon, getLocalizedModeName, GAME_MODES } from '../data/modeData';

// ランクアイコン定義
const RANK_ICONS = {
  bronze: require('../../assets/GameModeIcons/rank_bronze.png'),
  silver: require('../../assets/GameModeIcons/rank_silver.png'),
  gold: require('../../assets/GameModeIcons/rank_gold.png'),
  diamond: require('../../assets/GameModeIcons/rank_diamond.png'),
  mythic: require('../../assets/GameModeIcons/rank_mythic.png'),
  legendary: require('../../assets/GameModeIcons/rank_legendary.png'),
  master: require('../../assets/GameModeIcons/rank_masters.png'),
};

// 定数定義
const INITIAL_DISPLAY_COUNT = 5;
const VICTORY_COLOR = '#4CAF50';
const DEFEAT_COLOR = '#F44336';
const DRAW_COLOR = '#FFD700';
const STAR_PLAYER_COLOR = '#FFD700';

interface BattleLogProps {
  battleLog: BattleLogItem[];
}

// マップ名のローカライズ処理
const getLocalizedBattleMapName = async (mapName: string | undefined, currentLanguage: string): Promise<string> => {
  if (!mapName) return '';
  
  try {
    await initializeMapData();
    const mapData = getMapData(mapName);

    if (!mapData) {
      console.warn(`No map data found for: ${mapName}`);
      const alternativeMap = Object.values(mapsDataCache).find(
        m => m.nameEn.toLowerCase() === mapName.toLowerCase()
      );
      if (alternativeMap) {
        console.log('Found alternative map:', alternativeMap);
        return alternativeMap.name;
      }
      return mapName;
    }

    switch (currentLanguage) {
      case 'en':
        return mapData.nameEn || mapName;
      case 'ko':
        return mapData.nameKo || mapName;
      case 'zhTw':
        return mapData.nameZhTw || mapName;
      case 'es':
        return mapData.nameEs || mapName;
      case 'fr':
        return mapData.nameFr || mapName;
      case 'ar':
        return mapData.nameAr || mapName;
      default:
        return mapData.name || mapName;
    }
  } catch (error) {
    console.error(`Error getting localized map name for ${mapName}:`, error);
    return mapName;
  }
};

// トロフィー数に応じたランクアイコンを取得
const getRankIcon = (trophies: number) => {
  if (trophies <= 3) return RANK_ICONS.bronze;
  if (trophies <= 6) return RANK_ICONS.silver;
  if (trophies <= 9) return RANK_ICONS.gold;
  if (trophies <= 12) return RANK_ICONS.diamond;
  if (trophies <= 15) return RANK_ICONS.mythic;
  if (trophies <= 18) return RANK_ICONS.legendary;
  return RANK_ICONS.master;
};

// ゲームモード名の正規化
const normalizeModeName = (modeName: string): keyof typeof GAME_MODES => {
  if (!modeName) return 'GEM_GRAB';

  // キャメルケースに変換
  const camelCaseName = modeName.replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => 
    index === 0 ? letter.toLowerCase() : letter.toUpperCase()
  ).replace(/\s+/g, '');

  // モード名のマッピング
  const modeNameToKey: { [key: string]: keyof typeof GAME_MODES } = {
    'gemGrab': 'GEM_GRAB',
    'brawlBall': 'BRAWL_BALL',
    'bounty': 'BOUNTY',
    'heist': 'HEIST',
    'hotZone': 'HOT_ZONE',
    'wipeOut': 'WIPEOUT',
    'knockout': 'KNOCKOUT',
    'duels': 'DUEL',
    'soloShowdown': 'SOLO_BATTLE_ROYALE',
    'duoShowdown': 'DUO_BATTLE_ROYALE',
    'showdown': 'BATTLE_ROYALE',
    'basketBrawl': 'BASKET_BRAWL',
    'payLoad': 'PAYLOAD',
    'friendly': 'FRIENDLY'
  };

  return modeNameToKey[camelCaseName] || 'GEM_GRAB';
};
// キャラクターの画像を取得
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

// バトル結果を取得
const getBattleResult = (battle: BattleLogItem, t: BattleLogTranslation) => {
  const isSoloMode = battle.battle.mode === 'soloShowdown';
  const isDuoMode = battle.battle.mode === 'duoShowdown';
  
  if (isSoloMode && battle.battle.rank) {
    if (battle.battle.rank <= 4) return t.battle.results.victory;
    if (battle.battle.rank === 5) return t.battle.results.draw;
    return t.battle.results.defeat;
  }
  
  if (isDuoMode && battle.battle.rank) {
    if (battle.battle.rank <= 2) return t.battle.results.victory;
    if (battle.battle.rank === 3) return t.battle.results.draw;
    return t.battle.results.defeat;
  }
  
  const result = battle.battle.result;
  if (result) {
    return result.toUpperCase();
  }
  
  return t.battle.results.unknown;
};

// バトル概要コンポーネント
const BattleOverview: React.FC<{ battleLog: BattleLogItem[] }> = ({ battleLog }) => {
  const { t, currentLanguage } = useBattleLogTranslation();
  
  if (!battleLog || !Array.isArray(battleLog)) return null;

  const nonFriendlyBattles = battleLog.filter(b => b.battle.type !== 'friendly');

  const victories = nonFriendlyBattles.filter(b => {
    const result = getBattleResult(b, t);
    return result === t.battle.results.victory;
  }).length;
  
  const draws = nonFriendlyBattles.filter(b => {
    const result = getBattleResult(b, t);
    return result === t.battle.results.draw;
  }).length;

  const defeats = nonFriendlyBattles.length - victories - draws;
  const winRate = nonFriendlyBattles.length > 0 
    ? Math.round((victories / nonFriendlyBattles.length) * 100)
    : 0;

  const renderResultIcon = (battle: BattleLogItem, index: number) => {
    if (battle.battle.type === 'friendly') return null;

    const result = getBattleResult(battle, t);
    const isVictory = result === t.battle.results.victory;
    const isDraw = result === t.battle.results.draw;
    const resultColor = isDraw ? DRAW_COLOR : isVictory ? VICTORY_COLOR : DEFEAT_COLOR;
    const modeIcon = getModeIcon(normalizeModeName(battle.battle?.mode));
    
    return (
      <View 
        key={index}
        style={[
          styles.resultIconContainer,
          { backgroundColor: resultColor + '30' }
        ]}
      >
        {modeIcon && (
          <Image 
            source={modeIcon} 
            style={[
              styles.resultModeIcon,
              { opacity: isDraw ? 0.85 : isVictory ? 1 : 0.7 }
            ]} 
            resizeMode="contain"
          />
        )}
      </View>
    );
  };

  return (
    <View style={styles.overviewContainer}>
      <Text style={styles.overviewTitle}>{t.overview.title}</Text>
      <View style={styles.resultsRow}>
        {battleLog.map((battle, index) => renderResultIcon(battle, index)).filter(icon => icon !== null)}
      </View>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>{t.overview.stats.winRate}</Text>
          <Text style={styles.statValue}>{winRate}%</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>{t.overview.stats.victories}</Text>
          <Text style={[styles.statValue, { color: VICTORY_COLOR }]}>{victories}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>{t.overview.stats.draws}</Text>
          <Text style={[styles.statValue, { color: DRAW_COLOR }]}>{draws}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>{t.overview.stats.defeats}</Text>
          <Text style={[styles.statValue, { color: DEFEAT_COLOR }]}>{defeats}</Text>
        </View>
      </View>
    </View>
  );
};

// メインのバトルログコンポーネント
export const BattleLog: React.FC<BattleLogProps> = ({ battleLog }) => {
  const [showAllBattles, setShowAllBattles] = useState(false);
  const [isMapDataReady, setIsMapDataReady] = useState(false);
  const [localizedMapNames, setLocalizedMapNames] = useState<Record<string, string>>({});
  const { t, currentLanguage } = useBattleLogTranslation();

  // マップデータの初期化
  useEffect(() => {
    const initData = async () => {
      try {
        await initializeMapData();
        setIsMapDataReady(true);
      } catch (error) {
        console.error('Failed to initialize map data:', error);
      }
    };
    
    initData();
  }, []);

  // マップ名の変換
  useEffect(() => {
    const localizeMapNames = async () => {
      if (!isMapDataReady || !battleLog) return;

      const newLocalizedNames: Record<string, string> = {};
      for (const battle of battleLog) {
        if (battle.event?.map) {
          newLocalizedNames[battle.event.map] = await getLocalizedBattleMapName(
            battle.event.map,
            currentLanguage
          );
        }
      }
      setLocalizedMapNames(newLocalizedNames);
    };

    localizeMapNames();
  }, [battleLog, currentLanguage, isMapDataReady]);

  const renderPlayer = (player: any, battle: BattleLogItem, isTeamMode: boolean = true) => {
    const portraitSource = getPortraitSource(player.brawler.name);
    const isStarPlayer = battle.battle.starPlayer?.tag === player.tag;
    const isSoloRanked = battle.battle.type === 'soloRanked';
    const rankIcon = getRankIcon(player.brawler.trophies);
    
    return (
      <View style={styles.playerContainer} key={player.tag}>
        <View style={[
          styles.portraitContainer,
          isStarPlayer && styles.starPlayerPortraitContainer
        ]}>
          {portraitSource && (
            <Image
              source={portraitSource}
              style={[
                styles.portrait,
                isStarPlayer && styles.starPlayerPortrait
              ]}
              resizeMode="contain"
            />
          )}
          <View style={styles.trophyContainer}>
            {isSoloRanked ? (
              <Image 
                source={rankIcon}
                style={styles.trophyIcon}
                resizeMode="contain"
              />
            ) : (
              <Image 
                source={require('../../assets/OtherIcon/trophy_Icon.png')}
                style={styles.trophyIcon}
                resizeMode="contain"
              />
            )}
            <Text style={[
              styles.trophies,
              isSoloRanked && styles.rankedTrophies
            ]}>
              {player.brawler.trophies}
            </Text>
          </View>
          {!isTeamMode && player.rank && (
            <View style={styles.rankBadge}>
              <Text style={styles.rankText}>#{player.rank}</Text>
            </View>
          )}
          {isStarPlayer && (
            <View style={styles.starBadge}>
              <Image 
                source={require('../../assets/OtherIcon/starPlayer.png')}
                style={styles.starIcon}
                resizeMode="contain"
              />
            </View>
          )}
        </View>
        <Text style={[
          styles.playerName,
          isStarPlayer && styles.starPlayerName
        ]} numberOfLines={1}>
          {player.name}
        </Text>
      </View>
    );
  };

  const renderSoloShowdown = (battle: BattleLogItem) => {
    const players = battle.battle.players;
    if (!players || !Array.isArray(players)) return null;

    return (
      <View style={styles.soloShowdownContainer}>
        {players.map(player => renderPlayer(player, battle, false))}
      </View>
    );
  };

  const renderDuoShowdown = (battle: BattleLogItem) => {
    if (!battle?.battle?.teams || !Array.isArray(battle.battle.teams)) return null;

    const renderRow = (rowIndex: number) => {
      return battle.battle.teams.map((team, teamIndex) => {
        if (!team[rowIndex]) return null;
        const player = team[rowIndex];
        return (
          <View key={player.tag} style={[styles.playerContainer, { flex: 1 }]}>
            {renderPlayer(player, battle, false)}
            {rowIndex === 0 && (
              <View style={styles.rankBadge}>
                <Text style={styles.rankText}>#{teamIndex + 1}</Text>
              </View>
            )}
          </View>
        );
      });
    };

    return (
      <View style={styles.duoShowdownContainer}>
        <View style={styles.duoTeamRow}>
          {renderRow(0)}
        </View>
        <View style={styles.duoTeamRow}>
          {renderRow(1)}
        </View>
      </View>
    );
  };

  const renderBattleItem = (battle: BattleLogItem) => {
    const isSoloMode = battle.battle.mode === 'soloShowdown';
    const isDuoMode = battle.battle.mode === 'duoShowdown';
    
    if (!isSoloMode && !isDuoMode && (!battle?.battle?.teams || battle.battle.teams.length < 2)) {
      return null;
    }
    
    const result = getBattleResult(battle, t);
    const isVictory = result === t.battle.results.victory;
    const isDraw = result === t.battle.results.draw;
    const resultColor = isDraw ? DRAW_COLOR : isVictory ? VICTORY_COLOR : DEFEAT_COLOR;
    const modeIcon = getModeIcon(normalizeModeName(battle.battle.mode));
    const isSoloRanked = battle.battle.type === 'soloRanked';
    const isFriendly = battle.battle.type === 'friendly';

    const mapName = battle.event?.map ? localizedMapNames[battle.event.map] || battle.event.map : '';
    const modeName = battle.battle.mode ? getLocalizedModeName(normalizeModeName(battle.battle.mode), currentLanguage) : '';

    return (
      <View 
        style={[
          styles.battleCard,
          { backgroundColor: resultColor + '15' },
          isSoloRanked && styles.rankedBattleCard
        ]} 
        key={battle.battleTime}
      >
        <View style={styles.battleHeader}>
          <View style={styles.battleInfo}>
            <View style={styles.modeContainer}>
              <View style={[styles.resultIndicator, { backgroundColor: resultColor }]} />
              {modeIcon && (
                <Image 
                  source={modeIcon} 
                  style={styles.modeIcon} 
                  resizeMode="contain"
                />
              )}
              <Text style={styles.battleMode}>
  {isFriendly ? getLocalizedModeName('FRIENDLY', currentLanguage) : modeName}
  {mapName ? `${t.battle.mapPrefix}${mapName}` : ''}
</Text>
            </View>
            <Text style={styles.battleTime}>
              {new Date(battle.battleTime).toLocaleString()}
            </Text>
          </View>
          <Text style={[styles.battleResult, { color: resultColor }]}>
            {result}
          </Text>
        </View>

        {isSoloMode ? (
          renderSoloShowdown(battle)
        ) : isDuoMode ? (
          renderDuoShowdown(battle)
        ) : (
          <View style={styles.teamsContainer}>
            <View style={styles.teamRow}>
              {battle.battle.teams[0].map(player => renderPlayer(player, battle))}
            </View>
            <View style={styles.vsContainer}>
              <Text style={styles.vsText}>{t.battle.vs}</Text>
            </View>
            <View style={styles.teamRow}>
              {battle.battle.teams[1].map(player => renderPlayer(player, battle))}
            </View>
          </View>
        )}
      </View>
    );
  };

  if (!isMapDataReady) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>{t.details.loading}</Text>
      </View>
    );
  }

  if (!battleLog || battleLog.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>{t.details.noData}</Text>
      </View>
    );
  }

  const validBattles = battleLog.filter(battle => {
    if (battle?.battle?.mode === 'soloShowdown') {
      return battle?.battle?.players && Array.isArray(battle.battle.players);
    }
    if (battle?.battle?.mode === 'duoShowdown') {
      return battle?.battle?.teams && Array.isArray(battle.battle.teams);
    }
    return battle?.battle?.teams && 
           Array.isArray(battle.battle.teams) && 
           battle.battle.teams.length >= 2;
  });

  const displayBattles = showAllBattles 
    ? validBattles 
    : validBattles.slice(0, INITIAL_DISPLAY_COUNT);

  const remainingBattlesCount = validBattles.length - INITIAL_DISPLAY_COUNT;

  return (
    <View style={styles.container}>
      <BattleOverview battleLog={battleLog} />
      <Text style={styles.detailsTitle}>{t.details.title}</Text>
      {displayBattles.map(renderBattleItem)}
      
      {!showAllBattles && remainingBattlesCount > 0 && (
        <TouchableOpacity 
          style={styles.showMoreButton}
          onPress={() => setShowAllBattles(true)}
        >
          <Text style={styles.showMoreText}>
            {t.details.showMore(remainingBattlesCount)}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  battleCard: {
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  rankedBattleCard: {
    borderColor: '#FFD700',
    borderWidth: 1,
  },
  battleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  battleInfo: {
    flex: 1,
  },
  modeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modeIcon: {
    width: 18,
    height: 18,
  },
  resultIndicator: {
    width: 8,
    height: 8,
    borderRadius: 2,
  },
  battleMode: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  battleTime: {
    fontSize: 10,
    color: '#666',
    marginTop: 1,
  },
  battleResult: {
    fontWeight: 'bold',
    fontSize: 12,
    marginLeft: 6,
  },
  teamsContainer: {
    marginVertical: 4,
  },
  teamRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flexWrap: 'nowrap',
    paddingHorizontal: 4,
    marginVertical: 1,
  },
  vsContainer: {
    alignItems: 'center',
    marginVertical: 1,
  },
  vsText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  playerContainer: {
    alignItems: 'center',
    width: '18%',
    minWidth: 48,
  },
  portraitContainer: {
    position: 'relative',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  starPlayerPortraitContainer: {
    padding: 2,
    backgroundColor: STAR_PLAYER_COLOR,
    shadowColor: STAR_PLAYER_COLOR,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  portrait: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  starPlayerPortrait: {
    borderWidth: 1,
    borderColor: STAR_PLAYER_COLOR,
  },
  trophyContainer: {
    position: 'absolute',
    top: -4,
    left: -4,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    padding: 2,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  trophyIcon: {
    width: 12,
    height: 12,
    marginRight: 1,
  },
  trophies: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  rankedTrophies: {
    color: '#000',
    fontWeight: 'bold',
  },
  starIcon: {
    width: 12,
    height: 12,
  },
  starBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: STAR_PLAYER_COLOR,
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
  },
  rankBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#FFD700',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
    paddingHorizontal: 2,
  },
  rankText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#000',
  },
  playerName: {
    fontSize: 10,
    marginTop: 2,
    textAlign: 'center',
  },
  starPlayerName: {
    fontWeight: 'bold',
    color: '#000',
  },
  noDataText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    marginVertical: 20,
  },
  loadingText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    marginVertical: 20,
  },
  overviewContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    padding: 8,
    marginBottom: 10,
  },
  overviewTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  resultsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 12,
  },
  resultIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
    marginRight: 2,
  },
  resultModeIcon: {
    width: '100%',
    height: '100%',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 6,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#ddd',
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  showMoreButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  showMoreText: {
    color: '#2196F3',
    fontWeight: 'bold',
    fontSize: 14,
  },
  soloShowdownContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 8,
  },
  duoShowdownContainer: {
    padding: 8,
  },
  duoTeamRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
});

export default BattleLog;