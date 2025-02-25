import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useSettingsScreenTranslation } from '../i18n/settingsScreen';
import { 
  fetchAndProcessCharactersData, 
  getCharacterData,
} from '../data/characterData';
import { useCharacterLocalization } from '../hooks/useCharacterLocalization';
import { CHARACTER_IMAGES, isValidCharacterName } from '../data/characterImages';
import { JAPANESE_TO_ENGLISH_MAP } from '../data/characterCompatibility';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Character {
  id: number;
  name: string;
  localizedName?: string;
  image: any;
}

interface CharacterRouletteScreenProps {
  onClose: () => void;
}

const CharacterRouletteScreen: React.FC<CharacterRouletteScreenProps> = ({ onClose }) => {
  const { t } = useSettingsScreenTranslation();
  const { getLocalizedName } = useCharacterLocalization();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSelecting, setIsSelecting] = useState(false);

  // キャラクター名から画像を取得する関数
  const getCharacterImage = (characterName: string) => {
    // 日本語名を英語名に変換
    const englishName = JAPANESE_TO_ENGLISH_MAP[characterName];
    
    if (englishName && isValidCharacterName(englishName)) {
      return CHARACTER_IMAGES[englishName];
    }
    
    // 名前の正規化バリエーション
    const normalizedName = characterName.toLowerCase();
    const variations = [
      normalizedName,
      normalizedName.replace(/\s+/g, ''),
      normalizedName.replace(/\s+/g, '-'),
      normalizedName.replace(/\s+/g, '_'),
      normalizedName.replace(/-/g, ''),
      normalizedName.replace(/_/g, '')
    ];
    
    // 各バリエーションで画像を探す
    for (const variant of variations) {
      if (isValidCharacterName(variant)) {
        return CHARACTER_IMAGES[variant];
      }
    }
    
    // デフォルト画像
    return CHARACTER_IMAGES.shelly;
  };

  useEffect(() => {
    const loadCharacters = async () => {
      try {
        setIsLoading(true);
        const charsData = await fetchAndProcessCharactersData();
        
        // キャラクターデータを整形
        const formattedChars: Character[] = Object.keys(charsData).map((name, index) => {
          const characterImage = getCharacterImage(name);
          
          return {
            id: index + 1,
            name: name,
            localizedName: getLocalizedName(name),
            image: characterImage
          };
        });
        
        setCharacters(formattedChars);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch character data:', error);
        // エラー時はCHARACTER_IMAGESからダミーデータを生成
        const characterNames = Object.keys(CHARACTER_IMAGES);
        const dummyChars: Character[] = characterNames.slice(0, 20).map((name, i) => ({
          id: i + 1,
          name: name,
          localizedName: name.charAt(0).toUpperCase() + name.slice(1),
          image: CHARACTER_IMAGES[name]
        }));
        
        setCharacters(dummyChars);
        setIsLoading(false);
      }
    };

    loadCharacters();
  }, []);

  const selectRandomCharacter = () => {
    if (characters.length === 0 || isSelecting) return;
    
    setIsSelecting(true);
    
    // 少し遅延を入れてアニメーション感を出す
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * characters.length);
      setSelectedCharacter(characters[randomIndex]);
      setIsSelecting(false);
    }, 800);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>キャラクタールーレット</Text>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#21A0DB" />
          <Text style={styles.loadingText}>キャラクターをロード中...</Text>
        </View>
      ) : (
        <View style={styles.contentContainer}>
          {selectedCharacter ? (
            <View style={styles.resultContainer}>
              <View style={styles.characterCard}>
                <View style={styles.imageContainer}>
                  <Image
                    source={selectedCharacter.image}
                    style={styles.characterImage}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.characterName}>
                  {selectedCharacter.localizedName || selectedCharacter.name}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>
                ボタンを押して、ランダムなキャラクターを選択してください
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.selectButton, isSelecting && styles.selectButtonDisabled]}
            onPress={selectRandomCharacter}
            disabled={isSelecting}
          >
            {isSelecting ? (
              <View style={styles.selectingContainer}>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={styles.selectButtonText}>選択中...</Text>
              </View>
            ) : (
              <Text style={styles.selectButtonText}>
                {selectedCharacter ? 'もう一度選択' : 'ランダム選択'}
              </Text>
            )}
          </TouchableOpacity>
          
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>
              合計キャラクター数: {characters.length}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    height: 60,
    backgroundColor: '#21A0DB',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  characterCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    width: SCREEN_WIDTH - 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  imageContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  characterImage: {
    width: 180,
    height: 180,
  },
  characterName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  selectButton: {
    backgroundColor: '#21A0DB',
    paddingVertical: 16,
    borderRadius: 30,
    marginTop: 30,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  selectButtonDisabled: {
    opacity: 0.7,
  },
  selectButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  selectingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  statsText: {
    fontSize: 14,
    color: '#666',
  },
});

export default CharacterRouletteScreen