import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  Animated,
} from 'react-native';
import { CHARACTER_MAP, allCharacterData, getCharacterId } from '../data/characterCompatibility';
import CharacterImage from './CharacterImage';

type Team = 'A' | 'B';
type GamePhase = 1 | 2 | 3 | 4;

interface SelectionState {
  teamA: string[];
  teamB: string[];
  currentPhase: GamePhase;
  currentTeam: Team;
  recommendations: CharacterRecommendation[];
}

interface CharacterRecommendation {
  character: string;
  score: number;
  reason: string;
}

const PickPrediction: React.FC = () => {
  const [gameState, setGameState] = useState<SelectionState>({
    teamA: [],
    teamB: [],
    currentPhase: 1,
    currentTeam: 'A',
    recommendations: [],
  });

  const [showTurnModal, setShowTurnModal] = useState(false);
  const [turnMessage, setTurnMessage] = useState('');
  const [turnSubMessage, setTurnSubMessage] = useState('');
  const [expandedRecommendations, setExpandedRecommendations] = useState<boolean>(false);
  const scaleAnim = React.useRef(new Animated.Value(0)).current;

  const handleModalClose = () => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowTurnModal(false);
      scaleAnim.setValue(0);
    });
  };

  const resetGame = () => {
    setGameState({
      teamA: [],
      teamB: [],
      currentPhase: 1,
      currentTeam: 'A',
      recommendations: [],
    });
    setExpandedRecommendations(false);
    showTurnAnnouncement('A', 1);
  };

  useEffect(() => {
    if (showTurnModal) {
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),
        Animated.delay(1500),
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start(() => {
        setShowTurnModal(false);
        scaleAnim.setValue(0);
      });
    }
  }, [showTurnModal]);

  const getPhaseInstructions = (phase: GamePhase, team: Team): string => {
    switch (phase) {
      case 1: return 'チームAが1体目を選択';
      case 2: return 'チームBが1,2体目を選択';
      case 3: return 'チームAが2,3体目を選択';
      case 4: return 'チームBが3体目を選択';
      default: return '';
    }
  };

  const showTurnAnnouncement = (team: Team, phase: GamePhase) => {
    let message = `チーム${team}の番！`;
    let subMessage = '';
    
    switch (phase) {
      case 1:
        subMessage = '1体目を選択してください';
        break;
      case 2:
        subMessage = '1,2体目を選択してください';
        break;
      case 3:
        subMessage = '2,3体目を選択してください';
        break;
      case 4:
        subMessage = '最後の1体を選択してください';
        break;
    }

    setTurnMessage(message);
    setTurnSubMessage(subMessage);
    setShowTurnModal(true);
  };

  const calculateRecommendations = (
    currentTeam: Team,
    opposingTeamChars: string[],
    ownTeamChars: string[]
  ): CharacterRecommendation[] => {
    const recommendations: CharacterRecommendation[] = [];
    
    Object.values(CHARACTER_MAP).forEach(character => {
      if (!opposingTeamChars.includes(character) && !ownTeamChars.includes(character)) {
        let totalScore = 0;
        
        opposingTeamChars.forEach(opposingChar => {
          const characterId = getCharacterId(character);
          const opposingId = getCharacterId(opposingChar);
          
          if (characterId && opposingId && allCharacterData[characterId]) {
            const score = allCharacterData[characterId].compatibilityScores[opposingChar] || 0;
            totalScore += score;
          }
        });

        ownTeamChars.forEach(ownChar => {
          const characterId = getCharacterId(character);
          const ownId = getCharacterId(ownChar);
          
          if (characterId && ownId && allCharacterData[characterId]) {
            const score = allCharacterData[characterId].compatibilityScores[ownChar] || 0;
            totalScore += score * 0.5;
          }
        });

        const averageScore = opposingTeamChars.length + ownTeamChars.length > 0 
          ? totalScore / (opposingTeamChars.length + (ownTeamChars.length * 0.5))
          : 0;

        recommendations.push({
          character,
          score: averageScore,
          reason: getRecommendationReason(averageScore)
        });
      }
    });

    return recommendations.sort((a, b) => b.score - a.score).slice(0, 10);
  };

  const getRecommendationReason = (score: number): string => {
    if (score >= 24) return '最高の選択';
    if (score >= 21) return '非常に良い選択';
    if (score >= 18) return '良い選択';
    if (score >= 15) return '標準的な選択';
    return '要検討';
  };

  const getScoreColor = (score: number): string => {
    if (score >= 24) return '#4CAF50';
    if (score >= 21) return '#2196F3';
    if (score >= 18) return '#FFC107';
    return '#F44336';
  };

  const handleCharacterSelect = (character: string) => {
    const { currentPhase, currentTeam, teamA, teamB } = gameState;
    
    if (currentTeam === 'A' && teamA.includes(character)) return;
    if (currentTeam === 'B' && teamB.includes(character)) return;
    
    const newState = { ...gameState };
    setExpandedRecommendations(false);

    switch (currentPhase) {
      case 1:
        if (currentTeam === 'A') {
          newState.teamA = [character];
          newState.currentTeam = 'B';
          newState.currentPhase = 2;
          newState.recommendations = calculateRecommendations('B', [character], []);
          showTurnAnnouncement('B', 2);
        }
        break;
      
      case 2:
        if (currentTeam === 'B' && teamB.length < 2) {
          const newTeamB = [...teamB, character];
          newState.teamB = newTeamB;
          newState.recommendations = calculateRecommendations('B', teamA, newTeamB);
          if (newTeamB.length === 2) {
            newState.currentTeam = 'A';
            newState.currentPhase = 3;
            newState.recommendations = calculateRecommendations('A', newTeamB, teamA);
            showTurnAnnouncement('A', 3);
          }
        }
        break;
      
      case 3:
        if (currentTeam === 'A' && teamA.length < 3) {
          const newTeamA = [...teamA, character];
          newState.teamA = newTeamA;
          newState.recommendations = calculateRecommendations('A', teamB, newTeamA);
          if (newTeamA.length === 3) {
            newState.currentTeam = 'B';
            newState.currentPhase = 4;
            newState.recommendations = calculateRecommendations('B', newTeamA, teamB);
            showTurnAnnouncement('B', 4);
          }
        }
        break;
      
      case 4:
        if (currentTeam === 'B' && teamB.length < 3) {
          const newTeamB = [...teamB, character];
          newState.teamB = newTeamB;
          newState.recommendations = [];
        }
        break;
    }

    setGameState(newState);
  };

  const renderTeam = (team: Team) => {
    const teamChars = team === 'A' ? gameState.teamA : gameState.teamB;
    const slots = 3;

    return (
      <View style={[
        styles.teamContainer,
        gameState.currentTeam === team && styles.activeTeamContainer
      ]}>
        <Text style={[
          styles.teamTitle,
          gameState.currentTeam === team && styles.activeTeamTitle
        ]}>
          チーム{team}
        </Text>
        <View style={styles.teamSlots}>
          {[...Array(slots)].map((_, index) => (
            <View key={index} style={[
              styles.teamSlot,
              gameState.currentTeam === team && styles.activeTeamSlot
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.fixedHeader}>
        <View style={styles.header}>
          <Text style={styles.title}>ピック予測</Text>
          <Text style={styles.phase}>{getPhaseInstructions(gameState.currentPhase, gameState.currentTeam)}</Text>
          <TouchableOpacity 
            style={styles.resetButton}
            onPress={resetGame}
          >
            <Text style={styles.resetButtonText}>リセット</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.teamsContainer}>
          {renderTeam('A')}
          {renderTeam('B')}
        </View>
      </View>

      <ScrollView style={styles.scrollContent}>
        {gameState.recommendations.length > 0 && (
          <View style={styles.recommendationsContainer}>
            <Text style={styles.recommendationsTitle}>おすすめキャラクター</Text>
            {(expandedRecommendations 
              ? gameState.recommendations 
              : gameState.recommendations.slice(0, 3)
            ).map((rec, index) => (
              <View key={index} style={styles.recommendationRow}>
                <View style={styles.recommendationContent}>
                  <View style={styles.characterInfo}>
                    <Text style={styles.rankText}>#{index + 1}</Text>
                    <CharacterImage characterName={rec.character} size={25} />
                    <Text style={styles.characterName}>{rec.character}</Text>
                  </View>
                  <View style={styles.scoreInfo}>
                    <Text style={styles.score}>{rec.score.toFixed(1)}</Text>
                    <Text style={styles.reasonText}>{rec.reason}</Text>
                  </View>
                </View>
                <View style={styles.scoreBarContainer}>
                  <View
                    style={[
                      styles.scoreBar,
                      { 
                        width: `${(rec.score / 30) * 100}%`,
                        backgroundColor: getScoreColor(rec.score)
                      }
                    ]}
                  />
                </View>
              </View>
            ))}
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
          {Object.values(CHARACTER_MAP).map((character) => (
            <TouchableOpacity
              key={character}
              style={[
                styles.characterButton,
                (gameState.teamA.includes(character) || gameState.teamB.includes(character)) && 
                styles.selectedCharacterButton
              ]}
              onPress={() => handleCharacterSelect(character)}
              disabled={gameState.teamA.includes(character) || gameState.teamB.includes(character)}
            >
              <CharacterImage characterName={character} size={40} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Modal
        transparent={true}
        visible={showTurnModal}
        animationType="none"
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleModalClose}
        >
          <Animated.View
            style={[
              styles.turnAnnouncement,
              {
                transform: [
                  { scale: scaleAnim },
                  { perspective: 1000 }
                ]
              }
            ]}
          >
            <View style={[
              styles.turnCard,
              { backgroundColor: gameState.currentTeam === 'A' ? '#FF6B6B' : '#4ECDC4' }
            ]}>
              <Text style={styles.turnMessageMain}>{turnMessage}</Text>
              <Text style={styles.turnMessageSub}>{turnSubMessage}</Text>
              <Text style={styles.skipText}>タップでスキップ</Text>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  fixedHeader: {
    backgroundColor: '#fff',
    zIndex: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    height: 80,
    backgroundColor: '#21A0DB',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    position: 'relative',
  },
  scrollContent: {
    flex: 1,
  },
  resetButton: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -15 }],
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#fff',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  phase: {
    fontSize: 14,
    color: '#fff',
  },
  teamsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginHorizontal: 10,
  },
  teamContainer: {
    width: '48%',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
  },
  activeTeamContainer: {
    backgroundColor: 'rgba(33, 160, 219, 0.1)',
  },
  teamTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  activeTeamTitle: {
    color: '#21A0DB',
  },
  teamSlots: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  teamSlot: {
    width: '32%',
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTeamSlot: {
    borderColor: '#21A0DB',
  },
  selectedCharacter: {
    alignItems: 'center',
  },
  emptySlot: {
    fontSize: 10,
    color: '#bdbdbd',
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
    padding: 5,
    marginTop: 10,
  },
  characterButton: {
    padding: 8,
    margin: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCharacterButton: {
    backgroundColor: '#e0e0e0',
    opacity: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  turnAnnouncement: {
    width: 300,
    padding: 20,
    borderRadius: 15,
    backgroundColor: 'white',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  turnCard: {
    width: '100%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  turnMessageMain: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  turnMessageSub: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  skipText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
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

export default PickPrediction;