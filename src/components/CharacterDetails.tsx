// components/CharacterDetails.tsx
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

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>ステータス</Text>
          <View style={styles.statsGrid}>
            {Object.entries(character.stats).map(([key, value]) => (
              <View key={key} style={styles.statItem}>
                <Text style={styles.statLabel}>{key}</Text>
                <Text style={styles.statValue}>{value}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>通常攻撃</Text>
          <Text style={styles.skillName}>{character.normalAttack.name}</Text>
          <Text style={styles.description}>{character.normalAttack.description}</Text>
          <View style={styles.skillStats}>
            <Text>ダメージ: {character.normalAttack.damage}</Text>
            <Text>範囲: {character.normalAttack.range}</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>スーパースキル</Text>
          <Text style={styles.skillName}>{character.superSkill.name}</Text>
          <Text style={styles.description}>{character.superSkill.description}</Text>
        </View>

        {character.gadget1 && (
          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>ガジェット1</Text>
            <Text style={styles.skillName}>{character.gadget1.name}</Text>
            <Text style={styles.description}>{character.gadget1.description}</Text>
          </View>
        )}

        {character.gadget2 && (
          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>ガジェット2</Text>
            <Text style={styles.skillName}>{character.gadget2.name}</Text>
            <Text style={styles.description}>{character.gadget2.description}</Text>
          </View>
        )}

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>おすすめ</Text>
          <Text style={styles.subTitle}>おすすめモード</Text>
          <Text style={styles.description}>{character.recommendations.bestModes.join(', ')}</Text>
          
          <Text style={styles.subTitle}>相性の良いキャラクター</Text>
          <Text style={styles.description}>{character.recommendations.goodPartners.join(', ')}</Text>
          
          <Text style={styles.subTitle}>カウンター</Text>
          <Text style={styles.description}>{character.recommendations.counters.join(', ')}</Text>
        </View>
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
});

export default CharacterDetails;