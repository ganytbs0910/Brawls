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
import { allCharacterData, CHARACTER_MAP } from '../data/characterCompatibility';

const BrawlStarsCompatibility: React.FC = () => {
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterCompatibility | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleCharacterSelect = (characterName: string) => {
    const character = Object.values(allCharacterData).find(char => char.name === characterName);
    if (character) {
      setSelectedCharacter(character);
      setModalVisible(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>ブロウルスターズ キャラクター相性表</Text>

        {/* キャラクター選択ボタン */}
        <View style={styles.buttonContainer}>
          {Object.values(CHARACTER_MAP).map((character) => (
            <TouchableOpacity
              key={character}
              style={[
                styles.button,
                selectedCharacter?.name === character && styles.selectedButton
              ]}
              onPress={() => handleCharacterSelect(character)}
            >
              <Text style={styles.buttonText}>{character}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 相性表示モーダル */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalView}>
              <ScrollView>
                {selectedCharacter && (
                  <View style={styles.compatibilityContainer}>
                    <Text style={styles.modalTitle}>
                      {selectedCharacter.name}の相性表
                    </Text>
                    {Object.entries(selectedCharacter.compatibilityScores)
                      .sort(([, a], [, b]) => b - a)
                      .map(([opponent, value]) => (
                        <View key={opponent} style={styles.compatibilityRow}>
                          <Text style={styles.characterName}>{opponent}</Text>
                          <View style={styles.scoreContainer}>
                            <Text style={styles.score}>{value}/10</Text>
                            <View
                              style={[
                                styles.scoreBar,
                                { width: `${value * 10}%`, backgroundColor: getScoreColor(value) }
                              ]}
                            />
                          </View>
                        </View>
                      ))}
                  </View>
                )}
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

const getScoreColor = (score: number): string => {
  if (score >= 8) return '#4CAF50';
  if (score >= 6) return '#2196F3';
  if (score >= 4) return '#FFC107';
  return '#F44336';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
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
    minWidth: 80,
  },
  selectedButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  compatibilityContainer: {
    padding: 10,
  },
  compatibilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  characterName: {
    width: 100,
    fontSize: 14,
  },
  scoreContainer: {
    flex: 1,
    marginLeft: 10,
  },
  score: {
    position: 'absolute',
    right: 0,
    zIndex: 1,
  },
  scoreBar: {
    height: 20,
    borderRadius: 10,
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

export default BrawlStarsCompatibility;