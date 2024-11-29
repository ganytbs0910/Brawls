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
  Image,
} from 'react-native';
import { CharacterCompatibility } from '../types/types';
import { 
  allCharacterData, 
  CHARACTER_MAP, 
  getCharacterId, 
  JAPANESE_TO_ENGLISH_MAP 
} from '../data/characterCompatibility';
import { CHARACTER_IMAGES, isValidCharacterName } from '../data/characterImages';

interface CharacterRecommendation {
  character: string;
  score: number;
  reason: string;
}

type AnalysisMode = 'COUNTER_PICK' | 'STRONG_AGAINST';

const CharacterImage: React.FC<{ characterName: string; size: number }> = ({ characterName, size }) => {
  const englishName = JAPANESE_TO_ENGLISH_MAP[characterName];
  
  if (!englishName) {
    console.warn(`No English name mapping found for: ${characterName}`);
    return null;
  }

  if (!isValidCharacterName(englishName)) {
    console.warn(`Invalid character image key: ${englishName}`);
    return null;
  }

  return (
    <Image
      source={CHARACTER_IMAGES[englishName]}
      style={{ width: size, height: size }}
    />
  );
};

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
        if (mode === 'COUNTER_PICK') {
          // 相手キャラに対する相性スコア
          const memberScore = allCharacterData[opponentId].compatibilityScores[teamMember];
          if (memberScore) {
            totalScore += memberScore;
          }
        } else {
          // チームメンバーから見た相手キャラへの相性スコア
          const teamMemberId = getCharacterId(teamMember);
          if (teamMemberId && allCharacterData[teamMemberId]) {
            const memberScore = allCharacterData[teamMemberId].compatibilityScores[opponent];
            if (memberScore) {
              totalScore += memberScore;
            }
          }
        }
      });
    }

    return totalScore;
  };

  const getRecommendationReason = (score: number): string => {
    if (score >= 24) return '最高の相性';
    if (score >= 21) return '非常に高い相性';
    if (score >= 18) return '高い相性';
    if (score >= 15) return '良好な相性';
    return '標準的な相性';
  };

  const getScoreColor = (score: number): string => {
    if (score >= 24) return '#4CAF50';
    if (score >= 18) return '#2196F3';
    if (score >= 15) return '#FFC107';
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
          reason: getRecommendationReason(score)
        });
      }
    });

    recommendations.sort((a, b) => b.score - a.score);
    setRecommendations(recommendations.slice(0, 5));
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
      <ScrollView>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>3vs3 弱点発見</Text>
          <TouchableOpacity 
            style={styles.modeToggleButton}
            onPress={toggleAnalysisMode}
          >
            <Text style={styles.modeToggleText}>
              {analysisMode === 'COUNTER_PICK' ? '対策キャラ表示' : '得意キャラ表示'}
            </Text>
          </TouchableOpacity>
        </View>

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
                        ? 'このチームに強いキャラクター' 
                        : 'このチームが得意とするキャラクター'}
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
                      <View style={styles.opponentInfo}>
                        <Text style={styles.rankText}>#{index + 1}</Text>
                        <CharacterImage characterName={recommendation.character} size={30} />
                        <Text style={styles.characterName}>{recommendation.character}</Text>
                      </View>
                      <View style={styles.scoreContainer}>
                        <Text style={styles.score}>{recommendation.score.toFixed(1)}</Text>
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
                      <Text style={styles.reasonText}>{recommendation.reason}</Text>
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modeToggleButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  modeToggleText: {
    color: 'white',
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
    maxHeight: '80%',
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
  opponentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
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
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  score: {
    marginRight: 10,
    fontSize: 14,
    fontWeight: 'bold',
    width: 30,
  },
  scoreBar: {
    height: 10,
    borderRadius: 5,
    flex: 1,
  },
  reasonText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
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