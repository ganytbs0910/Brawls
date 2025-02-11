import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TeamSectionProps } from './PickPrediction';
import CharacterImage from './CharacterImage';
import { useTeamSectionTranslation } from '../i18n/teamSection';

export const TeamSection: React.FC<TeamSectionProps> = ({
  gameState,
  team,
  onBanSelect,
  onCharacterSelect
}) => {
  const { t } = useTeamSectionTranslation();

  const renderSlot = (type: 'ban' | 'team', index: number) => {
    const characters = type === 'ban' 
      ? (team === 'A' ? gameState.bansA : gameState.bansB)
      : (team === 'A' ? gameState.teamA : gameState.teamB);
    
    const character = characters[index];
    const isActive = gameState.currentTeam === team;
    
    const slotStyle = [
      styles.slot,
      type === 'ban' && styles.banSlot,
      type === 'team' && styles.teamSlot,
      isActive && type === 'team' && 
        (team === 'A' ? styles.activeTeamSlotA : styles.activeTeamSlotB)
    ];

    return (
      <View key={index} style={slotStyle}>
        {character ? (
          <View style={styles.selectedCharacter}>
            <CharacterImage 
              characterName={character} 
              size={type === 'ban' ? 30 : 36} 
            />
            {type === 'ban' && (
              <View style={styles.banOverlay}>
                <Text style={styles.banX}>×</Text>
              </View>
            )}
          </View>
        ) : (
          <Text style={styles.emptySlot}>{t.emptySlot}</Text>
        )}
      </View>
    );
  };

  const renderSection = (type: 'ban' | 'team') => {
    const count = type === 'ban' ? 3 : 3;
    
    return (
      <View style={styles.section}>
        {type === 'ban' && (
          <Text style={styles.sectionTitle}>{t.ban}</Text>
        )}
        <View style={styles.slotsContainer}>
          {[...Array(count)].map((_, index) => renderSlot(type, index))}
        </View>
      </View>
    );
  };

  return (
    <View style={[
      styles.container,
      gameState.currentTeam === team && 
        (team === 'A' ? styles.activeContainerA : styles.activeContainerB)
    ]}>
      <Text style={[
        styles.teamTitle,
        team === 'A' ? styles.teamTitleA : styles.teamTitleB,
        gameState.currentTeam === team && 
          (team === 'A' ? styles.activeTeamTitleA : styles.activeTeamTitleB)
      ]}>
        {t.teamLabel}{team}
      </Text>
      {gameState.isBanPhaseEnabled && renderSection('ban')}
      {renderSection('team')}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '34%',        // 38%から42%に変更
    alignItems: 'center',
    padding: 4,
    borderRadius: 10,
  },
  activeContainerA: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  activeContainerB: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  teamTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
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
  section: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 4,
  },
  slotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '96%',
    gap: 2,
  },
  slot: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  banSlot: {
    borderColor: '#ff4444',
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
  },
  teamSlot: {
    borderColor: '#e0e0e0',
  },
  activeTeamSlotA: {
    borderColor: '#FF3B30',
  },
  activeTeamSlotB: {
    borderColor: '#007AFF',
  },
  selectedCharacter: {
    position: 'relative',
    alignItems: 'center',
  },
  emptySlot: {
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
});