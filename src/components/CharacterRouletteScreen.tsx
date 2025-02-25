import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  Animated,
  Easing,
  Vibration,
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
  const [showConfetti, setShowConfetti] = useState(false);
  
  // アニメーション用のRef
  const spinValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;
  const bounceValue = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // 回転アニメーション
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

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
    setShowConfetti(false);
    
    // 回転アニメーションをリセットしてスタート
    spinValue.setValue(0);
    Animated.timing(spinValue, {
      toValue: 5, // 5回転
      duration: 2000,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true
    }).start();
    
    // ランダム選択中の効果音や振動をここに追加可能
    Vibration.vibrate(100);
    
    // 高速にキャラを次々と表示するエフェクト
    let count = 0;
    const maxCount = 15; // 表示回数
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * characters.length);
      setSelectedCharacter(characters[randomIndex]);
      count++;
      
      // 表示が終わったら
      if (count >= maxCount) {
        clearInterval(interval);
        
        // 最終的な選択
        const finalIndex = Math.floor(Math.random() * characters.length);
        setSelectedCharacter(characters[finalIndex]);
        
        // 選択完了時のアニメーション
        Animated.sequence([
          Animated.timing(scaleValue, {
            toValue: 1.2,
            duration: 200,
            useNativeDriver: true
          }),
          Animated.timing(scaleValue, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true
          })
        ]).start();
        
        // 完了時の振動
        Vibration.vibrate([0, 70, 50, 100]);
        
        // コンフェッティ表示
        setShowConfetti(true);
        
        setIsSelecting(false);
      }
    }, 100);
  };

  // キャラクター選択後のバウンスアニメーション
  useEffect(() => {
    if (selectedCharacter && !isSelecting) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceValue, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true
          }),
          Animated.timing(bounceValue, {
            toValue: 0,
            duration: 800,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true
          })
        ]),
        { iterations: -1 }
      ).start();
    }
  }, [selectedCharacter, isSelecting]);

  // コンフェッティのアニメーション
  useEffect(() => {
    if (showConfetti) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      }).start();
      
      // 5秒後にフェードアウト
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true
        }).start(() => setShowConfetti(false));
      }, 2000);
    }
  }, [showConfetti]);

  // コンフェッティコンポーネント
  const Confetti = () => {
    return (
      <Animated.View style={[styles.confettiContainer, { opacity: fadeAnim }]}>
        {Array.from({ length: 50 }).map((_, i) => {
          const size = Math.random() * 8 + 4;
          const left = Math.random() * SCREEN_WIDTH;
          const delay = Math.random() * 3;
          const duration = Math.random() * 3000 + 2000;
          
          return (
            <Animated.View
              key={i}
              style={{
                position: 'absolute',
                top: -20,
                left,
                width: size,
                height: size,
                backgroundColor: [
                  '#FF5252', '#FF4081', '#E040FB', '#7C4DFF',
                  '#536DFE', '#448AFF', '#40C4FF', '#18FFFF',
                  '#64FFDA', '#69F0AE', '#B2FF59', '#EEFF41',
                  '#FFFF00', '#FFD740', '#FFAB40', '#FF6E40'
                ][Math.floor(Math.random() * 16)],
                borderRadius: size / 2,
                transform: [{
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 500]
                  })
                }]
              }}
            />
          );
        })}
      </Animated.View>
    );
  };

  // バウンスアニメーションの値を計算
  const bounce = bounceValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10]
  });

  return (
    <View style={styles.container}>
      {showConfetti && <Confetti />}
      
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
              <Animated.View 
                style={[
                  styles.characterCard,
                  { 
                    transform: [
                      { scale: scaleValue },
                      { translateY: bounce }
                    ] 
                  }
                ]}
              >
                <View style={styles.imageContainer}>
                  <Animated.Image
                    source={selectedCharacter.image}
                    style={[
                      styles.characterImage,
                      { transform: [{ rotate: isSelecting ? spin : '0deg' }] }
                    ]}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.characterName}>
                  {selectedCharacter.localizedName || selectedCharacter.name}
                </Text>
                
                {!isSelecting && (
                  <Text style={styles.characterTagline}>
                    ルーレットの結果はこのキャラクター！
                  </Text>
                )}
              </Animated.View>
            </View>
          ) : (
            <View style={styles.placeholderContainer}>
              <Image
                source={require('../../assets/BrawlerIcons/8bit_pin.png')}
                style={styles.questionMark}
                resizeMode="contain"
              />
              <Text style={styles.placeholderText}>
                ボタンを押して、ランダムなキャラクターを選択してください
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.selectButton, isSelecting && styles.selectButtonDisabled]}
            onPress={selectRandomCharacter}
            disabled={isSelecting}
            activeOpacity={0.7}
          >
            {isSelecting ? (
              <View style={styles.selectingContainer}>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={styles.selectButtonText}>選択中...</Text>
              </View>
            ) : (
              <Text style={styles.selectButtonText}>
                {selectedCharacter ? 'もう一度選択' : 'ルーレットスタート！'}
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
  questionMark: {
    width: 120,
    height: 120,
    marginBottom: 20,
    opacity: 0.5,
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
    borderRadius: 100,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#21A0DB',
  },
  characterImage: {
    width: 160,
    height: 160,
  },
  characterName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  characterTagline: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
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
    backgroundColor: '#5BBCE0',
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
    gap: 10,
  },
  statsContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  statsText: {
    fontSize: 14,
    color: '#666',
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    pointerEvents: 'none',
  },
});

export default CharacterRouletteScreen;