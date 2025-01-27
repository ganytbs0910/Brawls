//TeamSection.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TeamSectionProps } from './PickPrediction';
import CharacterImage from './CharacterImage';

export const TeamSection: React.FC<TeamSectionProps> = ({
  gameState,
  team,
  onBanSelect,
  onCharacterSelect
}) => {
  const renderBanSection = () => {
    if (!gameState.isBanPhaseEnabled) return null;
    
    const banChars = team === 'A' ? gameState.bansA : gameState.bansB;
    
    return (
      <View style={styles.banContainer}>
        <Text style={styles.banTitle}>BAN</Text>
        <View style={styles.banSlotsContainer}>
          {[0, 1, 2].map((index) => (
            <View key={index} style={styles.banSlot}>
              {banChars[index] ? (
                <View style={styles.selectedBanCharacter}>
                  <CharacterImage characterName={banChars[index]} size={30} />
                  <View style={styles.banOverlay}>
                    <Text style={styles.banX}>×</Text>
                  </View>
                </View>
              ) : (
                <Text style={styles.emptyBanSlot}>未選択</Text>
              )}
            </View>
          ))}
        </View>
      </View>
    );
  };

  const teamChars = team === 'A' ? gameState.teamA : gameState.teamB;
  const slots = 3;

  return (
    <View style={[
      styles.teamContainer,
      gameState.currentTeam === team && 
        (team === 'A' ? styles.activeTeamContainerA : styles.activeTeamContainerB)
    ]}>
      <Text style={[
        styles.teamTitle,
        team === 'A' ? styles.teamTitleA : styles.teamTitleB,
        gameState.currentTeam === team && 
          (team === 'A' ? styles.activeTeamTitleA : styles.activeTeamTitleB)
      ]}>
        チーム{team}
      </Text>
      {renderBanSection()}
      <View style={styles.teamSlots}>
        {[...Array(slots)].map((_, index) => (
          <View key={index} style={[
            styles.teamSlot,
            gameState.currentTeam === team && 
              (team === 'A' ? styles.activeTeamSlotA : styles.activeTeamSlotB)
          ]}>
            {teamChars[index] ? (
              <View style={styles.selectedCharacter}>
                <CharacterImage characterName={teamChars[index]} size={40} />
              </View>
            ) : (
              <Text style={styles.emptySlot}>未選択</Text>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  teamContainer: {
    width: '42%',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
  },
  activeTeamContainerA: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  activeTeamContainerB: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  teamTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  teamTitleA: {
    color: '#FF3B30',
  },
  teamTitleB: {
    color: '#007AFF',
  },
  activeTeamTitleA: {
    color: '#FF3B30',
  },
  activeTeamTitleB: {
    color: '#007AFF',
  },
  teamSlots: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    gap: 4,
  },
  teamSlot: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
  },
  banContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  banTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 4,
  },
  banSlotsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 4,
  },
  banSlot: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: '#ff4444',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    marginHorizontal: 2,
  },
  selectedBanCharacter: {
    position: 'relative',
  },
  emptyBanSlot: {
    fontSize: 10,
    color: '#bdbdbd',
  },
  banOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  banX: {
    color: '#ff4444',
    fontSize: 24,
    fontWeight: 'bold',
  },
  activeTeamSlotA: {
    borderColor: '#FF3B30',
  },
  activeTeamSlotB: {
    borderColor: '#007AFF',
  },
  selectedCharacter: {
    alignItems: 'center',
  },
  emptySlot: {
    fontSize: 10,
    color: '#bdbdbd',
  },
});

