import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Modal } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import { getCharacterData } from '../data/characterData';
import CharacterImage from './CharacterImage';
import { getGearInfo, getGearTypeColor, getStarPowerIcon, getGadgetIcon, gearIcons } from '../data/iconMappings';
import { allCharacterData } from '../data/characterCompatibility';
import { useCharacterDetailsTranslation } from '../i18n/characterDetails';

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

const CharacterDetails: React.FC = () => {
  const { t } = useCharacterDetailsTranslation();
  const route = useRoute<CharacterDetailsRouteProp>();
  const navigation = useNavigation<CharacterDetailsNavigationProp>();
  const { characterName } = route.params;

  const [activeTab, setActiveTab] = useState<'info' | 'compatibility'>('info');
  const [compatibilityView, setCompatibilityView] = useState<CompatibilityView>('good');
  const [selectedGear, setSelectedGear] = useState<any | null>(null);
  const [isGearModalOpen, setIsGearModalOpen] = useState(false);

  const character = useMemo(() => getCharacterData(characterName), [characterName]);
  const compatibilityData = useMemo(
    () => Object.values(allCharacterData).find(char => char.name === characterName),
    [characterName]
  );

  const goodCompatibilityCategories: CompatibilityCategory[] = [
    { 
      title: t.compatibility.categories.bestMatch,
      minScore: 9,
      maxScore: 10,
      color: '#2E7D32',
      backgroundColor: '#E8F5E9'
    },
    { 
      title: t.compatibility.categories.goodMatch,
      minScore: 7,
      maxScore: 8.9,
      color: '#1565C0',
      backgroundColor: '#E3F2FD'
    },
  ];

  const badCompatibilityCategories: CompatibilityCategory[] = [
    { 
      title: t.compatibility.categories.badMatch,
      minScore: 0,
      maxScore: 4.9,
      color: '#C62828',
      backgroundColor: '#FFEBEE'
    },
    { 
      title: t.compatibility.categories.normalMatch,
      minScore: 5,
      maxScore: 6.9,
      color: '#F57F17',
      backgroundColor: '#FFF8E1'
    },
  ];

  const getRecommendationLabel = useCallback((level: number) => {
    switch (level) {
      case 5: return t.recommendation.highest;
      case 4: return t.recommendation.recommended;
      case 3: return t.recommendation.medium;
      case 2: return t.recommendation.low;
      case 1: return t.recommendation.optional;
      default: return t.recommendation.unrated;
    }
  }, [t]);

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

  const handleCharacterPress = useCallback((selectedCharName: string) => {
    navigation.push('CharacterDetails', { characterName: selectedCharName });
  }, [navigation]);

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
              ? getStarPowerIcon(character?.name || '', index)
              : getGadgetIcon(character?.name || '', index)
            }
            style={styles.powerIcon}
          />
          <Text style={styles.skillName}>{power.name}</Text>
        </View>

        <Text style={styles.description}>{power.description}</Text>
        
        {power.recommendationReason && (
          <View style={styles.reasonContainer}>
            <Text style={styles.reasonLabel}>{t.powers.recommendationReason}:</Text>
            <Text style={styles.recommendationReason}>
              {power.recommendationReason}
            </Text>
          </View>
        )}
      </View>
    );
  }, [character?.name, getRecommendationColor, getRecommendationLabel, t]);

  const renderGearSection = useCallback(() => {
    if (!character) return null;

    const recommendedGears = character.gears || [];
    const characterGears = gearIcons[character.name];
    if (!characterGears) return null;

    const handleGearClick = (gearId: number) => {
      const gearInfo = getGearInfo(character.name, gearId);
      setSelectedGear(gearInfo);
      setIsGearModalOpen(true);
    };

    return (
      <View style={styles.infoCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t.gears.title}</Text>
          <View style={styles.legendContainer}>
            <View style={[styles.legendItem, { backgroundColor: '#4CAF50' }]} />
            <Text style={styles.legendText}>{t.gears.recommended}</Text>
          </View>
        </View>
        <View style={styles.gearGrid}>
          {Object.entries(characterGears).map(([key, gearInfo]) => {
            const gearId = parseInt(key);
            const isRecommended = recommendedGears.includes(gearId);
            const typeColor = getGearTypeColor(gearInfo.type);

            return (
              <TouchableOpacity 
                key={key} 
                style={[
                  styles.gearItem,
                  { backgroundColor: typeColor + '20' },
                  isRecommended && styles.recommendedGearItem
                ]}
                onPress={() => handleGearClick(gearId)}
              >
                <Image
                  source={gearInfo.icon}
                  style={styles.gearIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            );
          })}
        </View>

        <Modal
          visible={isGearModalOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setIsGearModalOpen(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setIsGearModalOpen(false)}
          >
            {selectedGear && (
              <View 
                style={[
                  styles.modalContent,
                  { borderLeftWidth: 4, borderLeftColor: getGearTypeColor(selectedGear.type) }
                ]}
              >
                <View style={styles.modalHeaderContainer}>
                  <View style={styles.modalHeader}>
                    <View style={[
                      styles.gearIconContainer,
                      { backgroundColor: getGearTypeColor(selectedGear.type) + '20' }
                    ]}>
                      <Image 
                        source={selectedGear.icon}
                        style={styles.modalGearIcon}
                        resizeMode="contain"
                      />
                    </View>
                    <View style={styles.gearInfoContainer}>
                      <Text style={styles.modalTitle}>{selectedGear.name}</Text>
                      <Text style={[
                        styles.gearTypeText,
                        { color: getGearTypeColor(selectedGear.type) }
                      ]}>
                        {t.gears.types[selectedGear.type]}{t.gears.types.gear}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity 
                    onPress={() => setIsGearModalOpen(false)}
                    style={styles.closeButton}
                  >
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.separator} />
                <Text style={styles.modalDescription}>{selectedGear.description}</Text>
              </View>
            )}
          </TouchableOpacity>
        </Modal>
      </View>
    );
  }, [character, selectedGear, isGearModalOpen, t]);

  const renderCharacterInfo = useCallback(() => {
    if (!character) {
      return <Text>{t.errors.characterNotFound}</Text>;
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
          <Text style={styles.sectionTitle}>{t.basicInfo.title}</Text>
          <View style={styles.basicInfo}>
            <Text style={styles.infoLabel}>
              {t.basicInfo.role}: {character.class?.name}
            </Text>
            <Text style={styles.infoLabel}>
              {t.basicInfo.rarity}: {character.rarity?.name}
            </Text>
          </View>
        </View>

        {character.starPowers && character.starPowers.length > 0 && (
          <View style={styles.infoCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t.powers.starPower}</Text>
              <View style={styles.legendContainer}>
                <View style={[styles.legendItem, { backgroundColor: '#4CAF50' }]} />
                <Text style={styles.legendText}>{t.powers.recommended}</Text>
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
              <Text style={styles.sectionTitle}>{t.powers.gadget}</Text>
              <View style={styles.legendContainer}>
                <View style={[styles.legendItem, { backgroundColor: '#4CAF50' }]} />
                <Text style={styles.legendText}>{t.powers.recommended}</Text>
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
  }, [character, characterName, renderPowerCard, renderGearSection, t]);

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

      acc[category.title].characters.sort((a, b) => {
        return compatibilityView === 'good' ? b.score - a.score : a.score - b.score;
      });

      return acc;
    }, {} as Record<string, { 
      characters: Array<{ name: string; score: number }>,
      color: string,
      backgroundColor: string 
    }>);
  }, [compatibilityData, compatibilityView, goodCompatibilityCategories, badCompatibilityCategories]);

  const renderCompatibilityContent = useCallback(() => {
    if (!compatibilityData) return null;

    return (
      <View style={styles.compatibilityContainer}>
        <View style={styles.compatibilityHeader}>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleButton, compatibilityView === 'good' && styles.activeToggleButton]}
              onPress={() => setCompatibilityView('good')}
            >
              <Text style={[styles.toggleButtonText, compatibilityView === 'good' && styles.activeToggleButtonText]}>
                {t.compatibility.toggles.good}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, compatibilityView === 'bad' && styles.activeToggleButton]}
              onPress={() => setCompatibilityView('bad')}
            >
              <Text style={[styles.toggleButtonText, compatibilityView === 'bad' && styles.activeToggleButtonText]}>
                {t.compatibility.toggles.bad}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {Object.entries(categorizedScores)
          .sort(([categoryA], [categoryB]) => {
            if (compatibilityView === 'good') {
              return categoryA === t.compatibility.categories.bestMatch ? -1 : 1;
            } else {
              return categoryA === t.compatibility.categories.badMatch ? -1 : 1;
            }
          })
          .map(([category, data]) => (
            <View key={category} style={[styles.categoryContainer, { backgroundColor: data.backgroundColor }]}>
              <View style={styles.categoryHeader}>
                <CharacterImage characterName={characterName} size={32} style={styles.categoryCharacterImage} />
                <Text style={[styles.categoryTitle, { color: data.color }]}>
                  {category}
                </Text>
              </View>
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
                      {Math.round(char.score)}/10
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
      </View>
    );
  }, [compatibilityData, compatibilityView, characterName, handleCharacterPress, categorizedScores, t]);

  if (!character) {
    return (
      <View style={styles.container}>
        <Text>{t.errors.characterNotFound}</Text>
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
          <Text style={[
            styles.tabText,
            activeTab === 'info' && styles.activeTabText
          ]}>
            {t.tabs.info}
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
            {t.tabs.compatibility}
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
  powerCard: {
    width: '48%',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#ffffff',
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
    padding: 3,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
  },
  recommendationText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
    paddingHorizontal: 6,
  },
  powerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    marginTop: 6,
  },
  powerIcon: {
    width: 28,
    height: 28,
    marginRight: 6,
  },
  skillName: {
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
  },
  description: {
    fontSize: 13,
    color: '#333',
    lineHeight: 18,
    marginBottom: 6,
  },
  reasonContainer: {
    marginTop: 8,
  },
  reasonLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  recommendationReason: {
    fontSize: 13,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  gearIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  modalGearIcon: {
    width: '100%',
    height: '100%',
  },
  gearInfoContainer: {
    marginLeft: 12,
    flex: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  gearTypeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 16,
  },
  modalDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333333',
    padding: 14,
  },
  gearGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  gearItem: {
    width: '15%',
    aspectRatio: 1,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
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
    padding: 12,
  },
  characterImage: {
    alignSelf: 'center',
    marginVertical: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
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
    width: 14,
    height: 14,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    fontSize: 13,
    color: '#666',
  },
  powerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  basicInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 8,
  },
  compatibilityContainer: {
    padding: 16,
  },
  compatibilityHeader: {
    marginBottom: 12,
  },
  categoryContainer: {
    marginBottom: 16,
    borderRadius: 12,
    padding: 12,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  categoryCharacterImage: {
    width: 24,
    height: 24,
    marginRight: 6,
    marginTop: -2,
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: 'bold',
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
    fontSize: 13,
    color: '#666',
  },
  activeToggleButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
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
    padding: 6,
    marginHorizontal: '1%',
    marginBottom: 6,
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
    fontSize: 13,
    marginLeft: 6,
    flex: 1,
  },
  characterScore: {
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 6,
  }
});

export default CharacterDetails;