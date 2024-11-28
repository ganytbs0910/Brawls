import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import { CharacterCompatibility } from '../types/types';
import { allCharacterData, CHARACTER_MAP } from '../data/characterCompatibility';

interface CharacterRecommendation {
  character: string;
  score: number;
  reason: string;
}

const TeamCompatibility: React.FC = () => {
  const [selectedTeam, setSelectedTeam] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [recommendations, setRecommendations] = useState<CharacterRecommendation[]>([]);

  const handleCharacterSelect = (character: string) => {
    if (selectedTeam.length < 3 && !selectedTeam.includes(character)) {
      const newTeam = [...selectedTeam, character];
      setSelectedTeam(newTeam);
      
      if (newTeam.length === 3) {
        calculateRecommendations(newTeam);
        setModalVisible(true);
      }
    }
  };

  const removeCharacter = (character: string) => {
    setSelectedTeam(selectedTeam.filter(char => char !== character));
    setModalVisible(false);
  };

  const calculateCharacterScore = (character: string, team: string[]): number => {
    let totalScore = 0;

    // 選択されたチームとの相性を計算
    for (const teamMember of team) {
      const char1 = allCharacterData[character];
      const char2 = allCharacterData[teamMember];
      if (char1 && char2) {
        totalScore += char1.compatibilityScores[teamMember] || 0;
        totalScore += char2.compatibilityScores[character] || 0;
      }
    }

    return totalScore / (team.length * 2); // 平均スコアを計算
  };

  const getRecommendationReason = (score: number): string => {
    if (score >= 8) return '非常に高い相性';
    if (score >= 7) return '高い相性';
    if (score >= 6) return '良い相性';
    return '平均的な相性';
  };

  const calculateRecommendations = (team: string[]) => {
    const recommendations: CharacterRecommendation[] = [];
    
    // 全キャラクターについて相性を計算
    Object.keys(allCharacterData).forEach(character => {
      // 既に選択されているキャラクターは除外
      if (!team.includes(character)) {
        const score = calculateCharacterScore(character, team);
        recommendations.push({
          character,
          score,
          reason: getRecommendationReason(score)
        });
      }
    });

    // スコアで降順ソート
    recommendations.sort((a, b) => b.score - a.score);
    setRecommendations(recommendations.slice(0, 5)); // 上位5キャラクターを表示
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>3vs3 チーム編成</Text>

      {/* 選択中のチーム表示 */}
      <View style={styles.selectedTeamContainer}>
        {[0, 1, 2].map((index) => (
          <View key={index} style={styles.teamSlot}>
            {selectedTeam[index] ? (
              <View style={styles.selectedCharacter}>
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

      {/* キャラクター選択エリア */}
      <ScrollView style={styles.characterList}>
        <View style={styles.characterGrid}>
          {Object.values(CHARACTER_MAP).map((character) => (
            <TouchableOpacity
              key={character}
              style={[
                styles.characterButton,
                selectedTeam.includes(character) && styles.characterButtonSelected
              ]}
              onPress={() => handleCharacterSelect(character)}
              disabled={selectedTeam.includes(character)}
            >
              <Text style={[
                styles.characterButtonText,
                selectedTeam.includes(character) && styles.characterButtonTextSelected
              ]}>
                {character}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* おすすめキャラクター表示モーダル */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>おすすめのキャラクター</Text>
            <Text style={styles.modalSubtitle}>
              選択中: {selectedTeam.join(', ')}
            </Text>
            {recommendations.map((recommendation, index) => (
              <View key={index} style={styles.recommendationItem}>
                <View style={styles.recommendationRankContainer}>
                  <Text style={styles.recommendationRank}>#{index + 1}</Text>
                </View>
                <View style={styles.recommendationInfo}>
                  <Text style={styles.recommendationCharacter}>
                    {recommendation.character}
                  </Text>
                  <Text style={styles.recommendationReason}>
                    {recommendation.reason}
                  </Text>
                </View>
                <Text style={styles.recommendationScore}>
                  {recommendation.score.toFixed(1)}
                </Text>
              </View>
            ))}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>閉じる</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  selectedTeamContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  teamSlot: {
    width: '30%',
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCharacter: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  selectedCharacterText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#1976d2',
  },
  emptySlot: {
    color: '#bdbdbd',
    fontSize: 12,
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ef5350',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  characterList: {
    flex: 1,
  },
  characterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  characterButton: {
    width: '23%',
    aspectRatio: 1,
    margin: '1%',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  characterButtonSelected: {
    backgroundColor: '#2196F3',
  },
  characterButtonText: {
    fontSize: 12,
    color: '#333',
  },
  characterButtonTextSelected: {
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  recommendationRankContainer: {
    width: 40,
  },
  recommendationRank: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  recommendationInfo: {
    flex: 1,
    marginLeft: 8,
  },
  recommendationCharacter: {
    fontSize: 16,
    fontWeight: '500',
  },
  recommendationReason: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  recommendationScore: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2196F3',
    marginLeft: 8,
  },
  closeButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#2196F3',
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TeamCompatibility;