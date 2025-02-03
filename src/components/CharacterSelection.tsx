import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { CHARACTER_MAP } from '../data/characterCompatibility';
import CharacterImage from './CharacterImage';
import { SelectionState, Team } from './PickPrediction';
import { usePickPredictionTranslation } from '../i18n/pickPrediction';
import { CharacterSelectionTranslation } from '../i18n/characterSelection';
import { pickPredictionTranslations } from '../i18n/pickPrediction';

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

// Character Selection用の翻訳を取得する関数
const getCharacterSelectionTranslation = (language: string): CharacterSelectionTranslation => {
  const translations = require('../i18n/characterSelection');
  return translations[language];
};

export const CharacterSelection: React.FC<CharacterSelectionProps> = ({
  gameState,
  onBanSelect,
  onCharacterSelect,
  calculateTeamAdvantage
}) => {
  const { t, currentLanguage } = usePickPredictionTranslation();
  const ct = getCharacterSelectionTranslation(currentLanguage);
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
      
      // チーム間のスコア差を正規化して勝率を計算
      const maxPossibleScore = 100; // 理論上の最大スコア差
      const normalizedDiff = (advantage.teamBScore - advantage.teamAScore) / maxPossibleScore;
      
      // スコア差を勝率に変換（ロジスティック関数を使用）
      const amplifier = 2.0;
      const baseWinRate = 50; // 基準勝率（スコアが同じ場合）
      const maxEffect = 45;   // スコア差による最大の勝率変動
      
      const winningPercentage = Math.round(
        baseWinRate + (maxEffect * Math.tanh(amplifier * normalizedDiff))
      );
      
      return (
        <View style={styles.advantageContainer}>
          <Text style={styles.advantageTitle}>{ct.advantage.title}</Text>
          <View style={styles.scoreComparisonContainer}>
            <Text style={styles.teamScore}>
              {ct.advantage.teamScore('A')}{advantage.teamAScore.toFixed(1)}pt
            </Text>
            <Text style={styles.teamScore}>
              {ct.advantage.teamScore('B')}{advantage.teamBScore.toFixed(1)}pt
            </Text>
          </View>
          <Text style={[
            styles.advantageText,
            { 
              color: advantage.teamBScore > advantage.teamAScore ? '#007AFF' : '#FF3B30'
            }
          ]}>
            {ct.advantage.winningProbability(advantage.teamBScore > advantage.teamAScore ? 'B' : 'A')}
            {winningPercentage}%
          </Text>
        </View>
      );
    }
    return null;
  };

  const renderRecommendation = (rec: CharacterRecommendation, index: number) => {
    const isSelectable = !gameState.teamA.includes(rec.character) && 
                        !gameState.teamB.includes(rec.character);

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
            <Text style={styles.rankText}>{ct.recommendations.rank(index)}</Text>
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
          <Text style={styles.recommendationsTitle}>{ct.recommendations.title}</Text>
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
                {ct.recommendations.showMore(gameState.recommendations.length - 3)}
              </Text>
            </TouchableOpacity>
          )}
          {expandedRecommendations && (
            <TouchableOpacity 
              style={styles.expandButton}
              onPress={() => setExpandedRecommendations(false)}
            >
              <Text style={styles.expandButtonText}>{ct.recommendations.close}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <View style={styles.characterGrid}>
        {Object.values(CHARACTER_MAP).map((character) => {
          const isBannedByTeamA = gameState.bansA.includes(character);
          const isBannedByTeamB = gameState.bansB.includes(character);
          const isSelected = gameState.teamA.includes(character) || gameState.teamB.includes(character);
          
          const isDisabled = isSelected || (
            !gameState.isBanPhaseEnabled && (isBannedByTeamA || isBannedByTeamB)
          );
          
          return (
            <TouchableOpacity
              key={character}
              style={[
                styles.characterButton,
                (isBannedByTeamA || isBannedByTeamB) && styles.bannedCharacterButton,
                isSelected && styles.selectedCharacterButton
              ]}
              onPress={() => {
                if (gameState.isBanPhaseEnabled && (
                  (gameState.bansA.length < 3 && gameState.currentTeam === 'A') ||
                  (gameState.bansB.length < 3 && gameState.currentTeam === 'B')
                )) {
                  onBanSelect(character);
                } else if (!isSelected) {
                  onCharacterSelect(character);
                }
              }}
              disabled={isDisabled}
            >
              <CharacterImage characterName={character} size={40} />
              {(isBannedByTeamA || isBannedByTeamB) && (
                <View style={styles.banOverlay}>
                  <Text style={styles.banX}>×</Text>
                  <Text style={styles.banTeam}>
                    {isBannedByTeamA && isBannedByTeamB ? 'A,B' :
                     isBannedByTeamA ? 'A' : 'B'}
                  </Text>
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
  banTeam: {
    position: 'absolute',
    bottom: 2,
    fontSize: 10,
    color: '#ff4444',
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