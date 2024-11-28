import React from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Character } from '../types/character';
import { getCompatibilityList } from '../utils/compatibility';

type CompatibilityModalProps = {
  character: Character | null;
  isVisible: boolean;
  onClose: () => void;
  allCharacters: Character[];
};

export const CompatibilityModal: React.FC<CompatibilityModalProps> = ({
  character,
  isVisible,
  onClose,
  allCharacters,
}) => {
  if (!character) return null;

  const compatibilities = getCompatibilityList(character, allCharacters);

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>{character.name}との相性</Text>
          <ScrollView style={styles.scrollView}>
            {compatibilities.map(({ character: comp, score }) => (
              <View key={comp.id} style={styles.row}>
                <Text style={styles.characterName}>{comp.name}</Text>
                <Text style={styles.score}>{score}/10</Text>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>閉じる</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    width: '80%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  scrollView: {
    maxHeight: '80%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  characterName: {
    fontSize: 16,
  },
  score: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});