import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { CHARACTER_MAP } from '../data/characterCompatibility';
import CharacterImage from './CharacterImage';
import { SelectionState, Team } from './PickPrediction';

interface CharacterSelectionProps {
  gameState: SelectionState;
  onBanSelect: (character: string) => void;
  onCharacterSelect: (character: string) => void;
  calculateTeamAdvantage: (teamAChars: string[], teamBChars: string[]) => {
    teamAScore: number;
    teamBScore: number;
    advantageTeam: Team | null;
    difference: number;
  };
}

interface CharacterRecommendation {
  character: string;
  score: number;
  maxScore: number;
  reason: string;
}

export const CharacterSelection: React.FC<CharacterSelectionProps> = ({
  gameState,
  onBanSelect,
  onCharacterSelect,
  calculateTeamAdvantage
}) => {
  const [expandedRecommendations, setExpandedRecommendations] = useState(false);

  const getScoreColor = (score: number): string => {
    if (score >= 72) return '#4CAF50';
    if (score >= 63) return '#2196F3';
    if (score >= 54) return '#FFC107';
    return '#F44336';
  };

  const renderAdvantageMessage = () => {
    if (gameState.teamA.length === 3 && gameState.teamB.length === 3) {
      const advantage = calculateTeamAdvantage(gameState.teamA, gameState.teamB);
      
      // Calculate winning percentage using sigmoid function
      const amplifier = 0.5;
      const scoreDiff = advantage.teamAScore - advantage.teamBScore;
      const winningPercentage = Math.round(100 / (1 + Math.exp(-amplifier * scoreDiff)));
      
      return (
        <View style={styles.advantageContainer}>
          <Text style={styles.advantageTitle}>チーム相性分析</Text>
          <View style={styles.scoreComparisonContainer}>
            <Text style={styles.teamScore}>
              チームA編成得点: {advantage.teamAScore.toFixed(1)}pt
            </Text>
            <Text style={styles.teamScore}>
              チームB編成得点: {advantage.teamBScore.toFixed(1)}pt
            </Text>
          </View>
          <Text style={[
            styles.advantageText,
            { 
              color: advantage.teamAScore > advantage.teamBScore ? '#FF3B30' : '#007AFF'
            }
          ]}>
            チーム{advantage.teamAScore > advantage.teamBScore ? 'A' : 'B'}の勝利確率: {winningPercentage}%
          </Text>
        </View>
      );
    }
    return null;
  };

  const renderRecommendation = (rec: CharacterRecommendation, index: number) => {
  const isSelectable = !(
    gameState.teamA.includes(rec.character) || 
    gameState.teamB.includes(rec.character) ||
    gameState.bansA.includes(rec.character) ||
    gameState.bansB.includes(rec.character)
  );

  return (
    <TouchableOpacity
      key={index}
      style={[
        styles.recommendationRow,
        isSelectable && styles.selectableRecommendation,
        !isSelectable && styles.disabledRecommendation
      ]}
      onPress={() => isSelectable && onCharacterSelect(rec.character)}
      disabled={!isSelectable}
    >
      <View style={styles.recommendationContent}>
        <View style={styles.characterInfo}>
          <Text style={styles.rankText}>#{index + 1}</Text>
          <CharacterImage characterName={rec.character} size={25} />
          <Text style={styles.characterName}>{rec.character}</Text>
        </View>
        <View style={styles.scoreInfo}>
          <Text style={styles.score}>{rec.score.toFixed(1)}pt</Text>
          <Text style={styles.reasonText}>{rec.reason}</Text>
        </View>
      </View>
      <View style={styles.scoreBarContainer}>
        <View
          style={[
            styles.scoreBar,
            { 
              width: `${(rec.score / rec.maxScore) * 100}%`,
              backgroundColor: getScoreColor(rec.score)
            }
          ]}
        />
      </View>
    </TouchableOpacity>
  );
};

  return (
    <ScrollView style={styles.scrollContent}>
      {renderAdvantageMessage()}
      {gameState.recommendations.length > 0 && (
        <View style={styles.recommendationsContainer}>
          <Text style={styles.recommendationsTitle}>おすすめキャラクター</Text>
          {(expandedRecommendations 
            ? gameState.recommendations 
            : gameState.recommendations.slice(0, 3)
          ).map((rec, index) => renderRecommendation(rec, index))}
          {gameState.recommendations.length > 3 && !expandedRecommendations && (
            <TouchableOpacity 
              style={styles.expandButton}
              onPress={() => setExpandedRecommendations(true)}
            >
              <Text style={styles.expandButtonText}>
                さらに表示 ({gameState.recommendations.length - 3}体)
              </Text>
            </TouchableOpacity>
          )}
          {expandedRecommendations && (
            <TouchableOpacity 
              style={styles.expandButton}
              onPress={() => setExpandedRecommendations(false)}
            >
              <Text style={styles.expandButtonText}>閉じる</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <View style={styles.characterGrid}>
        {Object.values(CHARACTER_MAP).map((character) => {
          const isBanned = gameState.bansA.includes(character) || gameState.bansB.includes(character);
          const isSelected = gameState.teamA.includes(character) || gameState.teamB.includes(character);
          
          return (
            <TouchableOpacity
              key={character}
              style={[
                styles.characterButton,
                isBanned && styles.bannedCharacterButton,
                isSelected && styles.selectedCharacterButton
              ]}
              onPress={() => {
                if (gameState.isBanPhaseEnabled && (
                  (gameState.bansA.length < 3 && gameState.currentTeam === 'A') ||
                  (gameState.bansB.length < 3 && gameState.currentTeam === 'B')
                )) {
                  onBanSelect(character);
                } else {
                  onCharacterSelect(character);
                }
              }}
              disabled={isBanned || isSelected}
            >
              <CharacterImage characterName={character} size={40} />
              {isBanned && (
                <View style={styles.banOverlay}>
                  <Text style={styles.banX}>×</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flex: 1,
  },
  advantageContainer: {
    backgroundColor: '#f5f5f5',
    margin: 10,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  advantageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  scoreComparisonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 12,
  },
  teamScore: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginBottom: 4,
  },
  advantageText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  recommendationsContainer: {
    padding: 8,
    backgroundColor: '#f5f5f5',
    margin: 10,
    borderRadius: 10,
  },
  recommendationsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  recommendationRow: {
    marginVertical: 3,
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 6,
  },
  selectableRecommendation: {
    cursor: 'pointer',
  },
  disabledRecommendation: {
    opacity: 0.6,
  },
  recommendationContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  characterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
  },
  scoreInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  rankText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 8,
    width: 20,
    color: '#666',
  },
  characterName: {
    marginLeft: 8,
    fontSize: 12,
    color: '#333',
  },
  score: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 6,
    color: '#333',
  },
  reasonText: {
    fontSize: 10,
    color: '#666',
  },
  scoreBarContainer: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 4,
  },
  scoreBar: {
    height: '100%',
    borderRadius: 2,
  },
  characterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 2,
    marginTop: 10,
    paddingBottom: 20,
  },
  characterButton: {
    padding: 6,
    margin: 2,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCharacterButton: {
    backgroundColor: '#e0e0e0',
    opacity: 0.5,
  },
  bannedCharacterButton: {
    backgroundColor: '#ffebee',
    opacity: 0.7,
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
  expandButton: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 5,
    marginTop: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  expandButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
});

export default CharacterSelection;