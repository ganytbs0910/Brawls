import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import type { BattleLogItem } from '../hooks/useBrawlStarsApi';
import { CHARACTER_IMAGES, isValidCharacterName } from '../data/characterImages';

// モードのアイコンマッピング
const GAME_MODE_ICONS: { [key: string]: any } = {
  'gemGrab': require('../../assets/GameModeIcons/gem_grab_icon.png'),
  'brawlBall': require('../../assets/GameModeIcons/brawl_ball_icon.png'),
  'bounty': require('../../assets/GameModeIcons/bounty_icon.png'),
  'heist': require('../../assets/GameModeIcons/heist_icon.png'),
  'hotZone': require('../../assets/GameModeIcons/hot_zone_icon.png'),
  'wipeOut': require('../../assets/GameModeIcons/wipeout_icon.png'),
  'knockout': require('../../assets/GameModeIcons/knock_out_icon.png'),
  'duels': require('../../assets/GameModeIcons/duels_icon.png'),
  'soloShowdown': require('../../assets/GameModeIcons/showdown_icon.png'),
  'duoShowdown': require('../../assets/GameModeIcons/showdown_icon.png'),
  'showdown': require('../../assets/GameModeIcons/showdown_icon.png'),
  'basketBrawl': require('../../assets/GameModeIcons/basket_brawl_icon.png'),
};

interface BattleLogProps {
  battleLog: BattleLogItem[];
}

const INITIAL_DISPLAY_COUNT = 5;
const VICTORY_COLOR = '#4CAF50';
const DEFEAT_COLOR = '#F44336';
const STAR_PLAYER_COLOR = '#FFD700';

// BattleOverviewコンポーネント - 勝敗の概要を表示
const BattleOverview: React.FC<{ battleLog: BattleLogItem[] }> = ({ battleLog }) => {
  if (!battleLog || !Array.isArray(battleLog)) return null;

  const victories = battleLog.filter(b => 
    (b.battle?.result || '').toLowerCase() === 'victory'
  ).length;
  const winRate = Math.round((victories / battleLog.length) * 100);

  const renderResultIcon = (battle, index) => {
    const isVictory = (battle.battle?.result || '').toLowerCase() === 'victory';
    const modeIcon = getModeIcon(battle.battle?.mode);
    return (
      <View 
        key={index}
        style={[
          styles.resultIconContainer,
          { backgroundColor: isVictory ? VICTORY_COLOR + '30' : DEFEAT_COLOR + '30' }
        ]}
      >
        {modeIcon && (
          <Image 
            source={modeIcon} 
            style={[
              styles.resultModeIcon,
              { opacity: isVictory ? 1 : 0.7 }
            ]} 
            resizeMode="contain"
          />
        )}
      </View>
    );
  };

  return (
    <View style={styles.overviewContainer}>
      <Text style={styles.overviewTitle}>試合結果サマリー</Text>
      <View style={styles.resultsRow}>
        {battleLog.map((battle, index) => renderResultIcon(battle, index))}
      </View>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>勝率</Text>
          <Text style={styles.statValue}>{winRate}%</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>勝利</Text>
          <Text style={[styles.statValue, { color: VICTORY_COLOR }]}>{victories}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>敗北</Text>
          <Text style={[styles.statValue, { color: DEFEAT_COLOR }]}>
            {battleLog.length - victories}
          </Text>
        </View>
      </View>
    </View>
  );
};

// モード名の正規化関数
const normalizeModeName = (modeName: string): string => {
  if (!modeName) return '';

  if (GAME_MODE_ICONS.hasOwnProperty(modeName)) {
    return modeName;
  }
  
  const modeNameMapping: { [key: string]: string } = {
    'gemGrab': 'gemGrab',
    'brawlBall': 'brawlBall',
    'bounty': 'bounty',
    'heist': 'heist',
    'hotZone': 'hotZone',
    'wipeOut': 'wipeOut',
    'knockout': 'knockout',
    'duels': 'duels',
    'soloShowdown': 'soloShowdown',
    'duoShowdown': 'duoShowdown',
    'showdown': 'showdown',
    'basketBrawl': 'basketBrawl'
  };

  // キャメルケースに変換
  const camelCaseName = modeName.replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => 
    index === 0 ? letter.toLowerCase() : letter.toUpperCase()
  ).replace(/\s+/g, '');

  const mappedName = modeNameMapping[camelCaseName] || camelCaseName;
  
  const existingKey = Object.keys(GAME_MODE_ICONS).find(key => 
    key.toLowerCase() === mappedName.toLowerCase()
  );

  return existingKey || mappedName;
};

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

const getModeIcon = (modeName: string) => {
  if (!modeName) return null;
  const normalizedName = normalizeModeName(modeName);
  return GAME_MODE_ICONS[normalizedName];
};

export const BattleLog: React.FC<BattleLogProps> = ({ battleLog }) => {
  const [showAllBattles, setShowAllBattles] = useState(false);

  if (!battleLog || !Array.isArray(battleLog)) {
    return null;
  }

  const validBattles = battleLog.filter(battle => 
    battle?.battle?.teams && 
    Array.isArray(battle.battle.teams) && 
    battle.battle.teams.length >= 2
  );

  const displayBattles = showAllBattles 
    ? validBattles 
    : validBattles.slice(0, INITIAL_DISPLAY_COUNT);

  const remainingBattlesCount = validBattles.length - INITIAL_DISPLAY_COUNT;

  const renderPlayer = (player: BattleLogItem['battle']['teams'][0][0], battle: BattleLogItem) => {
    const portraitSource = getPortraitSource(player.brawler.name);
    const isStarPlayer = battle.battle.starPlayer?.tag === player.tag;
    const isSoloRanked = battle.battle.type === 'soloRanked';
    
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
          <Text style={[
            styles.trophies,
            isSoloRanked && styles.rankedTrophies
          ]}>
            {isSoloRanked ? `${player.brawler.trophies}⭐` : `${player.brawler.trophies}🏆`}
          </Text>
          {isStarPlayer && (
            <View style={styles.starBadge}>
              <Text style={styles.starBadgeText}>⭐</Text>
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

  const renderBattleItem = (battle: BattleLogItem) => {
    if (!battle?.battle?.teams || battle.battle.teams.length < 2) {
      return null;
    }
    
    const isVictory = (battle.battle.result || '').toLowerCase() === 'victory';
    const resultColor = isVictory ? VICTORY_COLOR : DEFEAT_COLOR;
    const modeIcon = getModeIcon(battle.battle.mode);
    const isSoloRanked = battle.battle.type === 'soloRanked';
    
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
                {battle.battle.mode} - {battle.event?.map}
                {isSoloRanked && ' (Ranked)'}
              </Text>
            </View>
            <Text style={styles.battleTime}>
              {new Date(battle.battleTime).toLocaleString()}
            </Text>
          </View>
          <Text style={[styles.battleResult, { color: resultColor }]}>
            {(battle.battle.result || 'Unknown').toUpperCase()}
          </Text>
        </View>

        <View style={styles.teamsContainer}>
          <View style={styles.teamRow}>
            {battle.battle.teams[0].map(player => renderPlayer(player, battle))}
          </View>
          <View style={styles.vsContainer}>
            <Text style={styles.vsText}>VS</Text>
          </View>
          <View style={styles.teamRow}>
            {battle.battle.teams[1].map(player => renderPlayer(player, battle))}
          </View>
        </View>
      </View>
    );
  };

  if (validBattles.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>表示できる対戦記録がありません</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BattleOverview battleLog={battleLog} />
      <Text style={styles.detailsTitle}>詳細な試合情報</Text>
      {displayBattles.map(renderBattleItem)}
      
      {!showAllBattles && remainingBattlesCount > 0 && (
        <TouchableOpacity 
          style={styles.showMoreButton}
          onPress={() => setShowAllBattles(true)}
        >
          <Text style={styles.showMoreText}>
            さらに{remainingBattlesCount}件の記録を見る
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // メインコンテナ
  container: {
    flex: 1,
  },

  // 対戦カード関連
  battleCard: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  rankedBattleCard: {
    borderColor: '#FFD700',
    borderWidth: 2,
  },
  battleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
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
    width: 24,
    height: 24,
  },
  resultIndicator: {
    width: 8,
    height: 8,
    borderRadius: 2,
  },
  battleMode: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  battleTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  battleResult: {
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 8,
  },

  // チーム表示関連
  teamsContainer: {
    marginVertical: 8,
  },
  teamRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 4,
  },
  vsContainer: {
    alignItems: 'center',
    marginVertical: 4,
  },
  vsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },

  // プレイヤー表示関連
  playerContainer: {
    alignItems: 'center',
    width: '30%',
  },
  portraitContainer: {
    position: 'relative',
    width: 60,
    height: 60,
    borderRadius: 30,
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
    borderRadius: 30,
    backgroundColor: '#f5f5f5',
  },
  starPlayerPortrait: {
    borderWidth: 2,
    borderColor: STAR_PLAYER_COLOR,
  },
  trophies: {
    position: 'absolute',
    top: -5,
    left: -5,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 2,
    fontSize: 10,
    fontWeight: 'bold',
  },
  rankedTrophies: {
    backgroundColor: 'rgba(255, 215, 0, 0.9)',
    color: '#000',
    fontWeight: 'bold',
  },
  starBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: STAR_PLAYER_COLOR,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  starBadgeText: {
    fontSize: 12,
    color: 'white',
  },
  playerName: {
    fontSize: 12,
    marginTop: 4,
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

  // 概要セクション
  overviewContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  overviewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  resultsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  resultIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    marginRight: 4,
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
    borderRadius: 8,
    padding: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#ddd',
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  // さらに見るボタン
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
  }
});

export default BattleLog;