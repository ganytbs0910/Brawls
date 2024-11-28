import React from 'react';
import { StyleSheet, Text, TouchableOpacity, useColorScheme } from 'react-native';
import { Character } from '../types/character';

type CharacterCardProps = {
  character: Character;
  onPress: () => void;
};

export const CharacterCard: React.FC<CharacterCardProps> = ({ character, onPress }) => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.card}
    >
      <Text style={[
        styles.name,
        { color: isDarkMode ? '#FFFFFF' : '#000000' }
      ]}>
        {character.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '30%',
    aspectRatio: 1,
    margin: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    padding: 8,
  },
});