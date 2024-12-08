import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../i18n/translations';
import CharacterImage from './CharacterImage';
import { characterTypes, characterRankings, rankingTypes } from '../data/characterData';
import { RootStackParamList } from '../App';

type RankingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Rankings'>;

const SCREEN_WIDTH = Dimensions.get('window').width;

const BrawlStarsRankings: React.FC = () => {
  const navigation = useNavigation<RankingsScreenNavigationProp>();
  const { currentLanguage } = useLanguage();
  const [selectedRankingType, setSelectedRankingType] = useState('all');

  const localizedRankingTypes = rankingTypes.map(type => ({
    ...type,
    name: translations[currentLanguage].rankings.types[type.id]
  }));

  const handleCharacterPress = (characterName: string) => {
    navigation.navigate('CharacterDetails', { characterName });
  };

  const getFilteredRankings = () => {
    if (!selectedRankingType || !characterTypes[selectedRankingType]) {
      console.warn(`無効なselectedType: ${selectedRankingType}, allに戻します`);
      return characterRankings;
    }

    if (selectedRankingType === 'all') {
      return characterRankings;
    }

    const characterList = characterTypes[selectedRankingType];
    if (!Array.isArray(characterList)) {
      console.warn(`タイプ ${selectedRankingType} のキャラクターリストが無効です、allに戻します`);
      return characterRankings;
    }

    const filteredRankings = characterRankings.filter(item =>
      characterList.includes(item.characterName)
    );

    return filteredRankings.map((item, index) => ({
      ...item,
      rank: index + 1
    }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {translations[currentLanguage].rankings.title}
        </Text>
      </View>

      <View style={styles.rankingTypeContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.tabScroll}
          contentContainerStyle={styles.tabScrollContent}
        >
          {localizedRankingTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.typeTab,
                selectedRankingType === type.id && styles.selectedTypeTab
              ]}
              onPress={() => setSelectedRankingType(type.id)}
            >
              <Text style={[
                styles.typeText,
                selectedRankingType === type.id && styles.selectedTypeText
              ]}>
                {type.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.content}>
        <ScrollView>
          {getFilteredRankings().map((item) => (
            <View key={item.rank} style={styles.rankingItem}>
              <View style={styles.rankContainer}>
                <Text style={styles.rankNumber} numberOfLines={1}>
                  {item.rank}{translations[currentLanguage].rankings.rankSuffix}
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.characterInfo}
                onPress={() => handleCharacterPress(item.characterName)}
                activeOpacity={0.7}
              >
                <CharacterImage characterName={item.characterName} size={40} style={styles.characterImage} />
                <View style={styles.textContainer}>
                  <Text style={styles.characterName}>
                    {translations[currentLanguage].rankings.characters[item.characterName]?.name || item.characterName}
                  </Text>
                  <Text style={styles.description}>
                    {translations[currentLanguage].rankings.characters[item.characterName]?.description || item.description}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  rankingTypeContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tabScroll: {
    flexGrow: 0,
    height: 50,
  },
  tabScrollContent: {
    paddingHorizontal: 12,
  },
  typeTab: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedTypeTab: {
    backgroundColor: '#2196F3',
  },
  typeText: {
    fontSize: 14,
    color: '#666',
  },
  selectedTypeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  rankContainer: {
    width: 45,
  },
  rankNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  characterInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  characterImage: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  characterName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
  }
});

export default BrawlStarsRankings;