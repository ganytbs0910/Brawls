import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import { CHARACTER_IMAGES, isValidCharacterName } from '../data/characterImages';

interface BattleLogProps {
  battleLog: BattleLogItem[];
}

interface BattleLogItem {
  battleTime: string;
  event: {
    id: number;
    mode: string;
    map: string;
  };
  battle: {
    mode: string;
    type: string;
    result: string;
    duration: number;
    starPlayer: {
      tag: string;
      name: string;
      brawler: {
        id: number;
        name: string;
        power: number;
        trophies: number;
      }
    };
    teams: Array<Array<{
      tag: string;
      name: string;
      brawler: {
        id: number;
        name: string;
        power: number;
        trophies: number;
      }
    }>>;
  };
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

export const BattleLog: React.FC<BattleLogProps> = ({ battleLog }) => {
  const recentBattles = battleLog.slice(0, 3);

  const renderPlayer = (player: BattleLogItem['battle']['teams'][0][0]) => {
    const portraitSource = getPortraitSource(player.brawler.name);
    
    return (
      <View style={styles.playerContainer} key={player.tag}>
        <View style={styles.portraitContainer}>
          {portraitSource && (
            <Image
              source={portraitSource}
              style={styles.portrait}
              resizeMode="contain"
            />
          )}
          <Text style={styles.trophies}>
            {player.brawler.trophies}🏆
          </Text>
        </View>
        <Text style={styles.playerName} numberOfLines={1}>
          {player.name}
        </Text>
      </View>
    );
  };

  const renderBattleItem = (battle: BattleLogItem) => (
    <View style={styles.battleCard} key={battle.battleTime}>
      <View style={styles.battleHeader}>
        <View style={styles.battleInfo}>
          <Text style={styles.battleMode}>
            {battle.event.mode} - {battle.event.map}
          </Text>
          <Text style={styles.battleTime}>
            {new Date(battle.battleTime).toLocaleString()}
          </Text>
        </View>
        <Text 
          style={[
            styles.battleResult,
            { color: battle.battle.result === 'victory' ? '#4CAF50' : '#F44336' }
          ]}
        >
          {battle.battle.result.toUpperCase()}
        </Text>
      </View>

      <View style={styles.teamsContainer}>
        <View style={styles.teamRow}>
          {battle.battle.teams[0].map(player => renderPlayer(player))}
        </View>
        <View style={styles.vsContainer}>
          <Text style={styles.vsText}>VS</Text>
        </View>
        <View style={styles.teamRow}>
          {battle.battle.teams[1].map(player => renderPlayer(player))}
        </View>
      </View>

      <View style={styles.starPlayerContainer}>
        <Text style={styles.starPlayerText}>
          ⭐ Star Player: {battle.battle.starPlayer.name}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {recentBattles.map((battle) => renderBattleItem(battle))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  battleCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
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
  },
  portrait: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    backgroundColor: '#f5f5f5',
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
  playerName: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  starPlayerContainer: {
    marginTop: 4,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  starPlayerText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default BattleLog;