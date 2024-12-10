import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import CharacterImage from './CharacterImage';
import { 
  fetchAndProcessCharactersData, 
  getCharacterRankings, 
  getCharacterData,
  characterTypes, 
  rankingTypes 
} from '../data/characterData';
import { RootStackParamList } from '../App';
import { RankingItem } from '../types/types';

type RankingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Rankings'>;

const SCREEN_WIDTH = Dimensions.get('window').width;
const typeNames: Record<string, string> = {
  all: '全体',
  tank: 'タンク',
  thrower: '投げ',
  assassin: 'アサシン',
  sniper: 'スナイパー',
  attacker: 'アタッカー',
  support: 'サポート',
  controller: 'コントローラー'
};

const BrawlStarsRankings: React.FC = () => {
  const navigation = useNavigation<RankingsScreenNavigationProp>();
  const [selectedRankingType, setSelectedRankingType] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [rankings, setRankings] = useState<RankingItem[]>([]);

  useEffect(() => {
    const initializeData = async () => {
      try {
        await fetchAndProcessCharactersData();
        const allRankings = getCharacterRankings();
        setRankings(allRankings);
      } catch (error) {
        console.error('Failed to fetch rankings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  const handleCharacterPress = (characterName: string) => {
    navigation.navigate('CharacterDetails', { characterName });
  };

  const getFilteredRankings = () => {
    if (!selectedRankingType || !characterTypes[selectedRankingType]) {
      console.warn(`無効なタイプです: ${selectedRankingType}, 全体表示に戻します`);
      return rankings;
    }

    if (selectedRankingType === 'all') {
      return rankings.map(item => {
        const characterData = getCharacterData(item.characterName);
        return {
          ...item,
          imageUrl: characterData?.images?.borderless || '',
        };
      });
    }

    const characterList = characterTypes[selectedRankingType];
    if (!Array.isArray(characterList)) {
      console.warn(`タイプ ${selectedRankingType} のキャラクターリストが無効です。全体表示に戻します`);
      return rankings;
    }

    const filteredRankings = rankings.filter(item =>
      characterList.includes(item.characterName)
    );

    return filteredRankings.map((item, index) => {
      const characterData = getCharacterData(item.characterName);
      return {
        ...item,
        rank: index + 1,
        imageUrl: characterData?.images?.borderless || '',
      };
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  const localizedRankingTypes = rankingTypes.map(type => ({
    ...type,
    name: typeNames[type.id] || type.id
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>キャラクターランキング</Text>
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
                  {item.rank}位
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.characterInfo}
                onPress={() => handleCharacterPress(item.characterName)}
                activeOpacity={0.7}
              >
                <CharacterImage 
                  characterName={item.characterName}
                  imageUrl={item.imageUrl}
                  size={40} 
                  style={styles.characterImage}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.characterName}>
                    {item.characterName}
                  </Text>
                  <Text style={styles.description} numberOfLines={2}>
                    {item.description}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    height: 60,
    backgroundColor: '#21A0DB',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#4FA8D6',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  rankingTypeContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 8,
  },
  tabScroll: {
    flexGrow: 0,
    height: 36,
  },
  tabScrollContent: {
    paddingHorizontal: 8,
  },
  typeTab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedTypeTab: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196F3',
  },
  typeText: {
    fontSize: 13,
    color: '#666',
  },
  selectedTypeText: {
    color: '#2196F3',
    fontWeight: '600',
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