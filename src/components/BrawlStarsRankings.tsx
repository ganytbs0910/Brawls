//BrawlStarsRankings.tsx
import React, { useState, useEffect } from 'react';
import { 
  ScrollView, 
  View, 
  Text, 

  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import CharacterImage from './CharacterImage';
import { 
  fetchAndProcessCharactersData, 
  getCharacterRankings,
  getCharacterData,
} from '../data/characterData';
import { useCharacterLocalization } from '../hooks/useCharacterLocalization'; // 変更
import { RootStackParamList } from '../App';
import { RankingItem } from '../types/types';
import { getAllRoles, getRoleDisplayName, generateCustomRankings } from '../data/customRankings';

type RankingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Rankings'>;

const RoleSelector: React.FC<{
  selectedRole: string;
  onRoleChange: (role: string) => void;
}> = ({ selectedRole, onRoleChange }) => {
  const roles = getAllRoles();

  return (
    <View style={styles.roleSelectorContainer}>
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.roleScrollContent}
      >
        {roles.map(role => (
          <TouchableOpacity
            key={role}
            style={[
              styles.roleButton,
              selectedRole === role && styles.selectedRoleButton
            ]}
            onPress={() => onRoleChange(role)}
          >
            <Text style={[
              styles.roleButtonText,
              selectedRole === role && styles.selectedRoleButtonText
            ]}>
              {getRoleDisplayName(role)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const BrawlStarsRankings: React.FC = () => {
  const navigation = useNavigation<RankingsScreenNavigationProp>();
  const [isLoading, setIsLoading] = useState(true);
  const [rankings, setRankings] = useState<RankingItem[]>([]);
  const [selectedRole, setSelectedRole] = useState('all');
  const [characters, setCharacters] = useState({});
  const { getLocalizedName } = useCharacterLocalization(); // 追加

  useEffect(() => {
    const initializeData = async () => {
      try {
        const chars = await fetchAndProcessCharactersData();
        setCharacters(chars);
        const roleRankings = generateCustomRankings(chars, selectedRole);
        setRankings(roleRankings);
      } catch (error) {
        console.error('Failed to fetch rankings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, [selectedRole]);

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
  };

  const handleCharacterPress = (characterName: string) => {
    navigation.navigate('CharacterDetails', { characterName });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>キャラクターランキング</Text>
        <TouchableOpacity 
          style={styles.searchButton}
        >
          <Image 
          source={require('../../assets/AppIcon/search.png')}
            style={styles.searchIcon}
          />
        </TouchableOpacity>
      </View>

      <RoleSelector 
        selectedRole={selectedRole} 
        onRoleChange={handleRoleChange} 
      />

      <View style={styles.content}>
        <ScrollView>
          {rankings.map((item, index) => {
            const characterData = getCharacterData(item.characterName);
            const localizedName = getLocalizedName(item.characterName); // 変更
            
            return (
              <View key={item.rank} style={styles.rankingItem}>
                <View style={styles.rankContainer}>
                  <Text style={styles.rankNumber} numberOfLines={1}>
                    {index + 1}位
                  </Text>
                </View>
                <TouchableOpacity 
                  style={styles.characterInfo}
                  onPress={() => handleCharacterPress(item.characterName)}
                  activeOpacity={0.7}
                >
                  <CharacterImage 
                    characterName={item.characterName}
                    imageUrl={characterData?.images?.borderless || ''}
                    size={40} 
                    style={styles.characterImage}
                  />
                  <View style={styles.textContainer}>
                    <Text style={styles.characterName}>
                      {localizedName} {/* 変更 */}
                    </Text>
                    <Text style={styles.description} numberOfLines={2}>
                      {item.description}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#4FA8D6',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  searchButton: {
    padding: 8,
    position: 'absolute',
    right: 16,
  },
  searchIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
  },
  roleSelectorContainer: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 8,
  },
  roleScrollContent: {
    paddingHorizontal: 12,
  },
  roleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minWidth: 80,
  },
  selectedRoleButton: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  roleButtonText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
  },
  selectedRoleButtonText: {
    color: '#fff',
  },
  content: {
    flex: 1,
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