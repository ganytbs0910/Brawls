import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import { getCharacterData } from '../data/characterData';
import CharacterImage from './CharacterImage';
import { getStarPowerIcon, getGadgetIcon, gearIcons } from '../data/iconMappings';
import { allCharacterData } from '../data/characterCompatibility';

type CharacterDetailsRouteProp = RouteProp<RootStackParamList, 'CharacterDetails'>;

const CharacterDetails: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'info' | 'compatibility'>('info');
  const route = useRoute<CharacterDetailsRouteProp>();
  const { characterName } = route.params;
  const character = getCharacterData(characterName);
  const compatibilityData = Object.values(allCharacterData).find(char => char.name === characterName);

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

  const getRecommendationLabel = (level: number) => {
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

  const renderGearSection = () => {
    if (!character) return null;

    const recommendedGears = character.gears || [];
    const characterGears = gearIcons[character.name];
    if (!characterGears) return null;

    return (
      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>ギア</Text>
        <View style={styles.gearGrid}>
          {Object.entries(characterGears).map(([key, iconPath]) => {
            const currentGearId = parseInt(key);
            const isRecommended = recommendedGears.includes(currentGearId);

            return (
              <View 
                key={key} 
                style={[
                  styles.gearItem,
                  isRecommended && styles.recommendedGearItem
                ]}
              >
                <Image
                  source={iconPath}
                  style={styles.gearIcon}
                  resizeMode="contain"
                />
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const getScoreColor = (score: number): string => {
    if (score >= 8) return '#4CAF50';
    if (score >= 6) return '#2196F3';
    if (score >= 4) return '#FFC107';
    return '#F44336';
  };

  const renderCompatibilityContent = () => {
    if (!compatibilityData) return null;

    const sortedScores = Object.entries(compatibilityData.compatibilityScores)
      .sort(([, a], [, b]) => b - a);

    return (
      <View style={styles.compatibilityContainer}>
        <View style={styles.compatibilityHeader}>
          <Text style={styles.compatibilityTitle}>相性表</Text>
        </View>
        {sortedScores.map(([opponent, score]) => (
          <View key={opponent} style={styles.compatibilityRow}>
            <View style={styles.opponentInfo}>
              <CharacterImage characterName={opponent} size={30} />
              <Text style={styles.opponentName}>{opponent}</Text>
            </View>
            <View style={styles.scoreContainer}>
              <Text style={[styles.score, { color: getScoreColor(score) }]}>
                {score}/10
              </Text>
              <View
                style={[
                  styles.scoreBar,
                  { 
                    width: score * 10,
                    backgroundColor: getScoreColor(score) 
                  }
                ]}
              />
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderCharacterInfo = () => {
    if (!character) {
      return <Text>キャラクターが見つかりませんでした。</Text>;
    }

    return (
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
            <Text style={styles.infoLabel}>役割: {character.class?.name}</Text>
            <Text style={styles.infoLabel}>レアリティ: {character.rarity?.name}</Text>
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
              {character.starPowers.map((starPower, index) => 
                renderPowerCard(starPower, index, true)
              )}
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
              {character.gadgets.map((gadget, index) => 
                renderPowerCard(gadget, index, false)
              )}
            </View>
          </View>
        )}

        {renderGearSection()}
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
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'info' && styles.activeTab]}
          onPress={() => setActiveTab('info')}
        >
          <Text style={[styles.tabText, activeTab === 'info' && styles.activeTabText]}>
            キャラ情報
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'compatibility' && styles.activeTab]}
          onPress={() => setActiveTab('compatibility')}
        >
          <Text style={[styles.tabText, activeTab === 'compatibility' && styles.activeTabText]}>
            相性表
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer}>
        {activeTab === 'info' ? renderCharacterInfo() : renderCompatibilityContent()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2196F3',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
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
  gearGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'flex-start',
  },
  gearItem: {
    width: '18%',
    aspectRatio: 1,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recommendedGearItem: {
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  gearIcon: {
    width: '100%',
    height: '100%',
  },
  compatibilityContainer: {
    padding: 16,
  },
  compatibilityHeader: {
    marginBottom: 16,
  },
  compatibilityTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  compatibilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
  },
  opponentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 120,
  },
  opponentName: {
    fontSize: 14,
    marginLeft: 8,
  },
  scoreContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  score: {
    marginRight: 8,
    fontSize: 14,
    fontWeight: 'bold',
    minWidth: 45,
  },
  scoreBar: {
    height: 20,
    borderRadius: 10,
    maxWidth: 100,
  },
});

export default CharacterDetails;