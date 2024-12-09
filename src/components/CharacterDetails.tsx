import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import { getCharacterData } from '../data/characterData';
import CharacterImage from './CharacterImage';

type CharacterDetailsRouteProp = RouteProp<RootStackParamList, 'CharacterDetails'>;

const CharacterDetails: React.FC = () => {
  const route = useRoute<CharacterDetailsRouteProp>();
  const { characterName } = route.params;
  const character = getCharacterData(characterName);

  if (!character) {
    return (
      <View style={styles.container}>
        <Text>キャラクターが見つかりませんでした。</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <CharacterImage 
          characterName={characterName} 
          size={160} 
          style={styles.characterImage} 
        />
        <Text style={styles.name}>{character.name}</Text>
        
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>基本情報</Text>
          <View style={styles.basicInfo}>
            <Text style={styles.infoLabel}>役割: {character.role}</Text>
            <Text style={styles.infoLabel}>レアリティ: {character.rarity}</Text>
          </View>
        </View>

        {character.starPowers && character.starPowers.length > 0 && (
          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>スターパワー</Text>
            {character.starPowers.map((starPower, index) => (
              <View key={index} style={styles.powerItem}>
                <Text style={styles.skillName}>{starPower.name}</Text>
                <Text style={styles.description}>{starPower.description}</Text>
              </View>
            ))}
          </View>
        )}

        {character.gadgets && character.gadgets.length > 0 && (
          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>ガジェット</Text>
            {character.gadgets.map((gadget, index) => (
              <View key={index} style={styles.powerItem}>
                <Text style={styles.skillName}>{gadget.name}</Text>
                <Text style={styles.description}>{gadget.description}</Text>
                {gadget.cooldown && (
                  <Text style={styles.cooldown}>クールダウン: {gadget.cooldown}秒</Text>
                )}
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  characterImage: {
    alignSelf: 'center',
    marginVertical: 24,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 12,
  },
  basicInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  skillName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 8,
  },
  skillStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
  },
  powerItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  cooldown: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

export default CharacterDetails;