import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  Pressable,
} from 'react-native';
import { CharacterCompatibility } from '../types/types';
import { 
  allCharacterData, 
  CHARACTER_MAP, 
  getCharacterId 
} from '../data/characterCompatibility';
import CharacterImage from './CharacterImage';

type AnalysisMode = 'COUNTER_PICK' | 'STRONG_AGAINST';

interface CharacterRecommendation {
  character: string;
  score: number;
  reason: string;
}

const TeamCompatibility: React.FC = () => {
  const [selectedTeam, setSelectedTeam] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [recommendations, setRecommendations] = useState<CharacterRecommendation[]>([]);
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>('COUNTER_PICK');

  const handleCharacterSelect = (character: string) => {
    if (selectedTeam.includes(character)) {
      setSelectedTeam(selectedTeam.filter(char => char !== character));
      setModalVisible(false);
      return;
    }

    if (selectedTeam.length < 3) {
      const newTeam = [...selectedTeam, character];
      setSelectedTeam(newTeam);
      
      if (newTeam.length === 3) {
        calculateRecommendations(newTeam, analysisMode);
        setModalVisible(true);
      }
    }
  };

  const removeCharacter = (character: string) => {
    setSelectedTeam(selectedTeam.filter(char => char !== character));
    setModalVisible(false);
  };

  const calculateTeamScore = (team: string[], opponent: string, mode: AnalysisMode): number => {
    let totalScore = 0;
    const opponentId = getCharacterId(opponent);
    
    if (opponentId && allCharacterData[opponentId]) {
      team.forEach(teamMember => {
        const teamMemberId = getCharacterId(teamMember);
        if (teamMemberId && allCharacterData[teamMemberId]) {
          if (mode === 'COUNTER_PICK') {
            // 相手が自分たちに対して強い = 自分たちが苦手
            const memberScore = allCharacterData[opponentId].compatibilityScores[teamMember];
            if (memberScore) {
              totalScore += memberScore;
            }
          } else {
            // 自分たちが相手に対して強い = 得意
            const memberScore = allCharacterData[teamMemberId].compatibilityScores[opponent];
            if (memberScore) {
              totalScore += memberScore;
            }
          }
        }
      });
    }

    return mode === 'COUNTER_PICK' ? totalScore : totalScore;
  };

  const getRecommendationReason = (score: number, mode: AnalysisMode): string => {
    if (mode === 'COUNTER_PICK') {
      if (score >= 24) return '最も警戒が必要';
      if (score >= 21) return '非常に警戒が必要';
      if (score >= 18) return '警戒が必要';
      if (score >= 15) return 'やや警戒が必要';
      return '通常の警戒';
    } else {
      if (score >= 24) return '最高の相性';
      if (score >= 21) return '非常に高い相性';
      if (score >= 18) return '高い相性';
      if (score >= 15) return '良好な相性';
      return '標準的な相性';
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 24) return '#4CAF50';
    if (score >= 21) return '#2196F3';
    if (score >= 18) return '#FFC107';
    return '#F44336';
  };

  const calculateRecommendations = (team: string[], mode: AnalysisMode) => {
    const recommendations: CharacterRecommendation[] = [];
    
    Object.values(CHARACTER_MAP).forEach(character => {
      if (!team.includes(character)) {
        const score = calculateTeamScore(team, character, mode);
        recommendations.push({
          character,
          score,
          reason: getRecommendationReason(score, mode)
        });
      }
    });

    // COUNTER_PICKモードの場合は警戒度の高い順（スコアの高い順）
    // STRONG_AGAINSTモードの場合は相性の良い順（スコアの高い順）
    recommendations.sort((a, b) => b.score - a.score);
    setRecommendations(recommendations.slice(0, 10));
  };

  const toggleAnalysisMode = () => {
    const newMode = analysisMode === 'COUNTER_PICK' ? 'STRONG_AGAINST' : 'COUNTER_PICK';
    setAnalysisMode(newMode);
    if (selectedTeam.length === 3) {
      calculateRecommendations(selectedTeam, newMode);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>3vs3 ガチバトルピック表</Text>
        <TouchableOpacity 
          style={styles.modeToggleButton}
          onPress={toggleAnalysisMode}
        >
          <Text style={styles.modeToggleText}>
            {analysisMode === 'COUNTER_PICK' ? '苦手キャラ一覧' : '得意キャラ一覧'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View style={styles.selectedTeamContainer}>
          {[0, 1, 2].map((index) => (
            <View key={index} style={styles.teamSlot}>
              {selectedTeam[index] ? (
                <View style={styles.selectedCharacter}>
                  <CharacterImage characterName={selectedTeam[index]} size={60} />
                  <Text style={styles.selectedCharacterText}>
                    {selectedTeam[index]}
                  </Text>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeCharacter(selectedTeam[index])}
                  >
                    <Text style={styles.removeButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <Text style={styles.emptySlot}>選択してください</Text>
              )}
            </View>
          ))}
        </View>

        <View style={styles.buttonContainer}>
          {Object.values(CHARACTER_MAP).map((character) => (
            <TouchableOpacity
              key={character}
              style={[
                styles.button,
                selectedTeam.includes(character) && styles.selectedButton
              ]}
              onPress={() => handleCharacterSelect(character)}
            >
              <CharacterImage characterName={character} size={40} />
              <Text style={[
                styles.buttonText,
                selectedTeam.includes(character) && styles.selectedButtonText
              ]}>
                {character}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalView}>
              <ScrollView>
                <View style={styles.compatibilityContainer}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>
                      {analysisMode === 'COUNTER_PICK' 
                        ? 'このチームが苦手なキャラ (TOP10)' 
                        : 'このチームが得意なキャラ (TOP10)'}
                    </Text>
                  </View>
                  <View style={styles.selectedTeamPreview}>
                    {selectedTeam.map((character, index) => (
                      <View key={index} style={styles.previewCharacter}>
                        <CharacterImage characterName={character} size={40} />
                        <Text style={styles.previewCharacterText}>{character}</Text>
                      </View>
                    ))}
                  </View>
                  {recommendations.map((recommendation, index) => (
                    <View key={index} style={styles.compatibilityRow}>
                      <View style={styles.compatibilityContent}>
                        <View style={styles.opponentInfo}>
                          <Text style={styles.rankText}>#{index + 1}</Text>
                          <CharacterImage characterName={recommendation.character} size={30} />
                          <Text style={styles.characterName}>{recommendation.character}</Text>
                        </View>
                        <View style={styles.scoreGroup}>
                          <Text style={styles.score}>{recommendation.score.toFixed(1)}</Text>
                          <Text style={styles.reasonText}>{recommendation.reason}</Text>
                        </View>
                      </View>
                      <View style={styles.scoreBarContainer}>
                        <View
                          style={[
                            styles.scoreBar,
                            { 
                              width: `${(recommendation.score / 30) * 100}%`,
                              backgroundColor: getScoreColor(recommendation.score)
                            }
                          ]}
                        />
                      </View>
                    </View>
                  ))}
                </View>
              </ScrollView>
              <Pressable
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>閉じる</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 60,
    backgroundColor: '#21A0DB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#4FA8D6',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  modeToggleButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#fff',
  },
  modeToggleText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  selectedTeamContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 10,
    marginBottom: 10,
  },
  teamSlot: {
    width: 100,
    height: 100,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCharacter: {
    alignItems: 'center',
  },
  selectedCharacterText: {
    marginTop: 5,
    fontSize: 12,
  },
  emptySlot: {
    color: '#bdbdbd',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 5,
  },
  button: {
    padding: 8,
    margin: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    width: 80,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 4,
  },
  selectedButtonText: {
    color: '#fff',
  },
  removeButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ff5252',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '90%',
    maxHeight: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  selectedTeamPreview: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  previewCharacter: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  previewCharacterText: {
    marginTop: 5,
    fontSize: 12,
  },
  compatibilityContainer: {
    padding: 10,
  },
  compatibilityRow: {
    marginVertical: 10,
  },
  compatibilityContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  opponentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
    width: 30,
  },
  characterName: {
        marginLeft: 10,
        fontSize: 14,
    },
    score: {
        fontSize: 14,
        fontWeight: 'bold',
        marginRight: 8,
    },
    reasonText: {
        fontSize: 12,
        color: '#666',
    },
    scoreBarContainer: {
        marginTop: 5,
    },
    scoreBar: {
        height: 10,
        borderRadius: 5,
    },
    closeButton: {
        backgroundColor: '#2196F3',
        borderRadius: 20,
        padding: 10,
        marginTop: 15,
        elevation: 2,
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default TeamCompatibility;