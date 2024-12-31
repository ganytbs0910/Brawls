import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import { getCharacterData } from '../data/characterData';
import CharacterImage from './CharacterImage';
import { getStarPowerIcon, getGadgetIcon } from '../data/iconMappings';

type CharacterDetailsRouteProp = RouteProp<RootStackParamList, 'CharacterDetails'>;

const CharacterDetails: React.FC = () => {
  const route = useRoute<CharacterDetailsRouteProp>();
  const { characterName } = route.params;
  const character = getCharacterData(characterName);

  const getRecommendationColor = (level: number) => {
    switch (level) {
      case 5: return '#4CAF50';
      case 4: return '#8BC34A';
      case 3: return '#FFC107';
      case 2: return '#FF9800';
      case 1: return '#F44336';
      default: return '#757575';
    }
  };

  const   getRecommendationLabel = (level: number) => {
    switch (level) {
      case 5: return '最優先 (5/5)';
      case 4: return 'おすすめ (4/5)';
      case 3: return '優先度中 (3/5)';
      case 2: return '優先度低 (2/5)';
      case 1: return '後回しOK (1/5)';
      default: return '未評価';
    }
  };

  const renderPowerCard = (power: any, index: number, isPowerStar: boolean) => {
    const recommendationLevel = power.recommendationLevel || 0;
    const bgColor = recommendationLevel >= 4 ? 'rgba(76, 175, 80, 0.1)' : '#ffffff';
    const borderColor = recommendationLevel >= 4 ? '#4CAF50' : '#e0e0e0';

    return (
      <View 
        style={[
          styles.powerCard,
          { 
            backgroundColor: '#ffffff',
            borderColor: recommendationLevel === 5 ? '#4CAF50' : 'transparent',
            borderWidth: recommendationLevel === 5 ? 2 : 0,
          }
        ]} 
        key={index}
      >
        <View style={styles.recommendationBadge}>
          <View style={[styles.recommendationBar, { backgroundColor: getRecommendationColor(recommendationLevel) }]}>
            <Text style={styles.recommendationText}>
              {getRecommendationLabel(recommendationLevel)}
            </Text>
          </View>
        </View>

        <View style={styles.powerHeader}>
          <Image
            source={isPowerStar ? getStarPowerIcon(character.name, index) : getGadgetIcon(character.name, index)}
            style={styles.powerIcon}
          />
          <Text style={styles.skillName}>{power.name}</Text>
        </View>

        <Text style={styles.description}>{power.description}</Text>
        
        {power.recommendationReason && (
          <View style={styles.reasonContainer}>
            <Text style={styles.reasonLabel}>おすすめの理由:</Text>
            <Text style={styles.recommendationReason}>{power.recommendationReason}</Text>
          </View>
        )}
      </View>
    );
  };

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
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>スターパワー</Text>
              <View style={styles.legendContainer}>
                <View style={[styles.legendItem, { backgroundColor: '#4CAF50' }]} />
                <Text style={styles.legendText}>おすすめ</Text>
              </View>
            </View>
            <View style={styles.powerGrid}>
              {character.starPowers.map((starPower, index) => renderPowerCard(starPower, index, true))}
            </View>
          </View>
        )}

        {character.gadgets && character.gadgets.length > 0 && (
          <View style={styles.infoCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>ガジェット</Text>
              <View style={styles.legendContainer}>
                <View style={[styles.legendItem, { backgroundColor: '#4CAF50' }]} />
                <Text style={styles.legendText}>おすすめ</Text>
              </View>
            </View>
            <View style={styles.powerGrid}>
              {character.gadgets.map((gadget, index) => renderPowerCard(gadget, index, false))}
            </View>
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  legendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendItem: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#666',
  },
  powerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  powerCard: {
    width: '48%',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    position: 'relative',
  },
  recommendationBadge: {
    position: 'absolute',
    top: -1,
    right: -1,
    zIndex: 1,
  },
  recommendationBar: {
    padding: 4,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
  },
  recommendationText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  basicInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 16,
  },
  powerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 8,
  },
  powerIcon: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  skillName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 8,
  },
  reasonContainer: {
    marginTop: 8,
  },
  reasonLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  recommendationReason: {
    fontSize: 14,
  },
});

export default CharacterDetails;