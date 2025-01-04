import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

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

export const BattleLog: React.FC<BattleLogProps> = ({ battleLog }) => {
  // 最新3件のみ表示
  const recentBattles = battleLog.slice(0, 3);

  const renderBattleItem = (battle: BattleLogItem) => (
    <View style={styles.battleCard} key={battle.battleTime}>
      <View style={styles.battleHeader}>
        <View>
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

      <Text style={styles.starPlayer}>
        Star Player: {battle.battle.starPlayer.name}
        ({battle.battle.starPlayer.brawler.name})
      </Text>

      <View style={styles.teamsContainer}>
        {battle.battle.teams.map((team, teamIndex) => (
          <View key={teamIndex} style={styles.teamCard}>
            <Text style={styles.teamTitle}>Team {teamIndex + 1}</Text>
            {team.map((player, playerIndex) => (
              <View key={playerIndex} style={styles.playerInfo}>
                <Text style={styles.playerName}>{player.name}</Text>
                <Text style={styles.playerBrawler}>
                  {player.brawler.name} - Power {player.brawler.power}
                  ({player.brawler.trophies.toLocaleString()} トロフィー)
                </Text>
              </View>
            ))}
          </View>
        ))}
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
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  battleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  battleMode: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  battleTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  battleResult: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  starPlayer: {
    fontSize: 14,
    marginBottom: 16,
  },
  teamsContainer: {
    gap: 12,
  },
  teamCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
  },
  teamTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  playerInfo: {
    marginBottom: 8,
  },
  playerName: {
    fontSize: 14,
    fontWeight: '500',
  },
  playerBrawler: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});

export default BattleLog;