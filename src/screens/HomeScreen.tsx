import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { CharacterCard } from '../components/CharacterCard';
import { CompatibilityModal } from '../components/CompatibilityModal';
import { characterData } from '../data/characters';
import { Character } from '../types/character';

export const HomeScreen: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <SafeAreaView style={[
      styles.container,
      { backgroundColor: isDarkMode ? '#000000' : '#FFFFFF' }
    ]}>
      <Text style={[
        styles.title,
        { color: isDarkMode ? '#FFFFFF' : '#000000' }
      ]}>
        キャラクター相性表
      </Text>
      <ScrollView contentContainerStyle={styles.grid}>
        {characterData.map(character => (
          <CharacterCard
            key={character.id}
            character={character}
            onPress={() => {
              setSelectedCharacter(character);
              setModalVisible(true);
            }}
          />
        ))}
      </ScrollView>
      <CompatibilityModal
        character={selectedCharacter}
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        allCharacters={characterData}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 8,
  },
});