import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import { getCharacterData } from '../data/characterData';
import CharacterImage from './CharacterImage';
import { getStarPowerIcon, getGadgetIcon, gearIcons } from '../data/iconMappings';
import { allCharacterData } from '../data/characterCompatibility';

type CharacterDetailsRouteProp = RouteProp<RootStackParamList, 'CharacterDetails'>;
type CharacterDetailsNavigationProp = StackNavigationProp<RootStackParamList, 'CharacterDetails'>;
type CompatibilityView = 'good' | 'bad';

type CompatibilityCategory = {
  title: string;
  minScore: number;
  maxScore: number;
  color: string;
  backgroundColor: string;
};

const goodCompatibilityCategories: CompatibilityCategory[] = [
  { 
    title: '最高の相性',
    minScore: 9,
    maxScore: 10,
    color: '#2E7D32',
    backgroundColor: '#E8F5E9'
  },
  { 
    title: '良い相性',
    minScore: 7,
    maxScore: 8.9,
    color: '#1565C0',
    backgroundColor: '#E3F2FD'
  },
];

const badCompatibilityCategories: CompatibilityCategory[] = [
  { 
    title: '相性が悪い',
    minScore: 0,
    maxScore: 4.9,
    color: '#C62828',
    backgroundColor: '#FFEBEE'
  },
  { 
    title: '普通の相性',
    minScore: 5,
    maxScore: 6.9,
    color: '#F57F17',
    backgroundColor: '#FFF8E1'
  },
];

const CharacterDetails: React.FC = () => {
  // Navigation and route hooks
  const route = useRoute<CharacterDetailsRouteProp>();
  const navigation = useNavigation<CharacterDetailsNavigationProp>();
  const { characterName } = route.params;

  // State hooks
  const [activeTab, setActiveTab] = useState<'info' | 'compatibility'>('info');
  const [compatibilityView, setCompatibilityView] = useState<CompatibilityView>('good');

  // Data preparation
  const character = useMemo(() => getCharacterData(characterName), [characterName]);
  const compatibilityData = useMemo(
    () => Object.values(allCharacterData).find(char => char.name === characterName),
    [characterName]
  );

  // Utility functions
  const getRecommendationColor = useCallback((level: number) => {
    switch (level) {
      case 5: return '#4CAF50';
      case 4: return '#8BC34A';
      case 3: return '#FFC107';
      case 2: return '#FF9800';
      case 1: return '#F44336';
      default: return '#757575';
    }
  }, []);

  const getRecommendationLabel = useCallback((level: number) => {
    switch (level) {
      case 5: return '最優先 (5/5)';
      case 4: return 'おすすめ (4/5)';
      case 3: return '優先度中 (3/5)';
      case 2: return '優先度低 (2/5)';
      case 1: return '後回しOK (1/5)';
      default: return '未評価';
    }
  }, []);

  // Navigation handler
  const handleCharacterPress = useCallback((selectedCharName: string) => {
    navigation.push('CharacterDetails', { characterName: selectedCharName });
  }, [navigation]);

  // Compatibility score calculations
  const categorizedScores = useMemo(() => {
    if (!compatibilityData?.compatibilityScores) return {};

    const categories = compatibilityView === 'good' 
      ? goodCompatibilityCategories 
      : badCompatibilityCategories;

    return Object.entries(compatibilityData.compatibilityScores).reduce((acc, [char, score]) => {
      const category = categories.find(
        cat => score >= cat.minScore && score <= cat.maxScore
      );
      
      if (!category) return acc;

      if (!acc[category.title]) {
        acc[category.title] = {
          characters: [],
          color: category.color,
          backgroundColor: category.backgroundColor,
        };
      }

      acc[category.title].characters.push({ name: char, score });

      // Sort characters within each category
      acc[category.title].characters.sort((a, b) => {
        return compatibilityView === 'good' ? b.score - a.score : a.score - b.score;
      });

      return acc;
    }, {} as Record<string, { 
      characters: Array<{ name: string; score: number }>,
      color: string,
      backgroundColor: string 
    }>);
  }, [compatibilityData, compatibilityView]);

  // Render functions
  const renderPowerCard = useCallback((power: any, index: number, isPowerStar: boolean) => {
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
          <View style={[
            styles.recommendationBar,
            { backgroundColor: getRecommendationColor(recommendationLevel) }
          ]}>
            <Text style={styles.recommendationText}>
              {getRecommendationLabel(recommendationLevel)}
            </Text>
          </View>
        </View>

        <View style={styles.powerHeader}>
          <Image
            source={isPowerStar 
              ? getStarPowerIcon(character.name, index)
              : getGadgetIcon(character.name, index)
            }
            style={styles.powerIcon}
          />
          <Text style={styles.skillName}>{power.name}</Text>
        </View>

        <Text style={styles.description}>{power.description}</Text>
        
        {power.recommendationReason && (
          <View style={styles.reasonContainer}>
            <Text style={styles.reasonLabel}>おすすめの理由:</Text>
            <Text style={styles.recommendationReason}>
              {power.recommendationReason}
            </Text>
          </View>
        )}
      </View>
    );
  }, [character?.name, getRecommendationColor, getRecommendationLabel]);

  const renderGearSection = useCallback(() => {
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
  }, [character]);

  const renderCompatibilityContent = useCallback(() => {
    if (!compatibilityData) return null;

    return (
      <View style={styles.compatibilityContainer}>
        <View style={styles.compatibilityHeader}>
          <Text style={styles.compatibilityTitle}>相性表</Text>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                compatibilityView === 'good' && styles.activeToggleButton,
              ]}
              onPress={() => setCompatibilityView('good')}
            >
              <Text style={[
                styles.toggleButtonText,
                compatibilityView === 'good' && styles.activeToggleButtonText,
              ]}>
                得意
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                compatibilityView === 'bad' && styles.activeToggleButton,
              ]}
              onPress={() => setCompatibilityView('bad')}
            >
              <Text style={[
                styles.toggleButtonText,
                compatibilityView === 'bad' && styles.activeToggleButtonText,
              ]}>
                苦手
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {Object.entries(categorizedScores)
          .sort(([categoryA], [categoryB]) => {
            if (compatibilityView === 'good') {
              return categoryA === '最高の相性' ? -1 : 1;
            } else {
              return categoryA === '相性が悪い' ? -1 : 1;
            }
          })
          .map(([category, data]) => (
            <View 
              key={category}
              style={[
                styles.categoryContainer,
                { backgroundColor: data.backgroundColor }
              ]}
            >
              <Text style={[styles.categoryTitle, { color: data.color }]}>
                {category}
              </Text>
              <View style={styles.characterGrid}>
                {data.characters.map((char) => (
                  <TouchableOpacity
                    key={char.name}
                    style={styles.characterCard}
                    onPress={() => handleCharacterPress(char.name)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.characterInfo}>
                      <CharacterImage characterName={char.name} size={32} />
                      <Text style={styles.characterName} numberOfLines={1}>
                        {char.name}
                      </Text>
                    </View>
                    <Text style={[styles.characterScore, { color: data.color }]}>
                      {char.score.toFixed(1)}/10
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
      </View>
    );
  }, [
    compatibilityData,
    compatibilityView,
    categorizedScores,
    handleCharacterPress
  ]);

  const renderCharacterInfo = useCallback(() => {
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
            <Text style={styles.infoLabel}>
              役割: {character.class?.name}
            </Text>
            <Text style={styles.infoLabel}>
              レアリティ: {character.rarity?.name}
            </Text>
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
  }, [
    character,
    characterName,
    renderPowerCard,
    renderGearSection
  ]);

  // Error state handling
  if (!character) {
    return (
      <View style={styles.container}>
        <Text>キャラクターが見つかりませんでした。</Text>
      </View>
    );
  }

  // Main render
  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'info' && styles.activeTab]}
          onPress={() => setActiveTab('info')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'info' && styles.activeTabText
          ]}>
            キャラ情報
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'compatibility' && styles.activeTab]}
          onPress={() => setActiveTab('compatibility')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'compatibility' && styles.activeTabText
          ]}>
            相性表
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer}>
        {activeTab === 'info'
          ? renderCharacterInfo()
          : renderCompatibilityContent()}
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
    marginBottom: 8,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeToggleButton: {
    backgroundColor: '#2196F3',
  },
  toggleButtonText: {
    fontSize: 14,
    color: '#666',
  },
  activeToggleButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  categoryContainer: {
    marginBottom: 16,
    borderRadius: 12,
    padding: 12,
    overflow: 'hidden',
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  characterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  characterCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 8,
    marginHorizontal: '1%',
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  characterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  characterName: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  characterScore: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default CharacterDetails;