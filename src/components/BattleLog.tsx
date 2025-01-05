import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import type { BattleLogItem } from './hooks/useBrawlStarsApi';
import { CHARACTER_IMAGES, isValidCharacterName } from '../data/characterImages';

// モードのアイコンマッピング
const GAME_MODE_ICONS = {
  'Gem Grab': require('../../assets/GameModeIcons/gem_grab_icon.png'),
  'Brawl Ball': require('../../assets/GameModeIcons/brawl_ball_icon.png'),
  'Bounty': require('../../assets/GameModeIcons/bounty_icon.png'),
  'Heist': require('../../assets/GameModeIcons/heist_icon.png'),
  'Hot Zone': require('../../assets/GameModeIcons/hot_zone_icon.png'),
  'Wipe Out': require('../../assets/GameModeIcons/wipeout_icon.png'),
  'Knockout': require('../../assets/GameModeIcons/knock_out_icon.png'),
  'Duels': require('../../assets/GameModeIcons/duels_icon.png'),
  'Showdown': require('../../assets/GameModeIcons/showdown_icon.png'),
};

interface BattleLogProps {
  battleLog: BattleLogItem[];
}

const VICTORY_COLOR = '#4CAF50';
const DEFEAT_COLOR = '#F44336';
const STAR_PLAYER_COLOR = '#FFD700';

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
  return GAME_MODE_ICONS[modeName];
};

export const BattleLog: React.FC<BattleLogProps> = ({ battleLog }) => {
  if (!battleLog || !Array.isArray(battleLog)) {
    return null;
  }

  const recentBattles = battleLog.slice(0, 3);
  const validBattles = recentBattles.filter(battle => 
    battle?.battle?.teams && 
    Array.isArray(battle.battle.teams) && 
    battle.battle.teams.length >= 2
  );

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
    const modeIcon = getModeIcon(battle.event?.mode);
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
              <Image source={modeIcon} style={styles.modeIcon} />
              <Text style={styles.battleMode}>
                {battle.event?.mode} - {battle.event?.map}
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
      {validBattles.map(renderBattleItem)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
    resizeMode: 'contain',
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
});

export default BattleLog;