import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { useSettingsScreenTranslation } from '../i18n/settingsScreen';

const VISIBLE_ITEMS = 5;
const ITEM_HEIGHT = 80;
const CONTAINER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Character {
  id: number;
  name: string;
  iconUrl: string;
}

// サンプルキャラクターデータ
const CHARACTERS: Character[] = Array.from({ length: 88 }, (_, i) => ({
  id: i + 1,
  name: `キャラクター${i + 1}`,
  iconUrl: 'https://via.placeholder.com/50' // 実際のアイコンURLに置き換える
}));

interface CharacterRouletteScreenProps {
  onClose: () => void;
}

const CharacterRouletteScreen: React.FC<CharacterRouletteScreenProps> = ({ onClose }) => {
  const { t } = useSettingsScreenTranslation();
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [displayedCharacters, setDisplayedCharacters] = useState<Character[]>([]);
  const scrollY = useRef(new Animated.Value(0)).current;
  const spinAnimation = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    updateDisplayedCharacters(selectedIndex);
    return () => {
      if (spinAnimation.current) {
        spinAnimation.current.stop();
      }
    };
  }, [selectedIndex]);

  const updateDisplayedCharacters = (currentIndex: number) => {
    const half = Math.floor(VISIBLE_ITEMS / 2);
    let chars: Character[] = [];
    
    for (let i = -half; i <= half; i++) {
      let index = currentIndex + i;
      while (index < 0) index += CHARACTERS.length;
      while (index >= CHARACTERS.length) index -= CHARACTERS.length;
      chars.push(CHARACTERS[index]);
    }
    
    setDisplayedCharacters(chars);
  };

  const spin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    const spins = 20 + Math.floor(Math.random() * 20); // 20-40回のスピン
    const targetIndex = Math.floor(Math.random() * CHARACTERS.length);
    const totalDistance = (spins * CHARACTERS.length + targetIndex) * ITEM_HEIGHT;
    
    scrollY.setValue(0);
    
    spinAnimation.current = Animated.sequence([
      Animated.timing(scrollY, {
        toValue: totalDistance,
        duration: 3000,
        useNativeDriver: true,
      }),
      Animated.spring(scrollY, {
        toValue: targetIndex * ITEM_HEIGHT,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      })
    ]);

    spinAnimation.current.start(() => {
      setIsSpinning(false);
      setSelectedIndex(targetIndex);
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>キャラクタールーレット</Text>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.rouletteContainer}>
        <View style={styles.selectionIndicator} />
        
        <Animated.View
          style={[
            styles.charactersContainer,
            {
              transform: [{
                translateY: scrollY.interpolate({
                  inputRange: [0, CHARACTERS.length * ITEM_HEIGHT],
                  outputRange: [0, -CHARACTERS.length * ITEM_HEIGHT],
                })
              }]
            }
          ]}
        >
          {displayedCharacters.map((char, index) => (
            <View key={`${char.id}-${index}`} style={styles.characterItem}>
              <Image
                source={{ uri: char.iconUrl }}
                style={styles.characterIcon}
              />
              <Text style={styles.characterName}>{char.name}</Text>
            </View>
          ))}
        </Animated.View>
      </View>

      <TouchableOpacity
        style={[styles.spinButton, isSpinning && styles.spinButtonDisabled]}
        onPress={spin}
        disabled={isSpinning}
      >
        <Text style={styles.spinButtonText}>
          {isSpinning ? 'スピン中...' : 'スピン！'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  rouletteContainer: {
    height: CONTAINER_HEIGHT,
    marginVertical: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  selectionIndicator: {
    position: 'absolute',
    top: '50%',
    width: '100%',
    height: ITEM_HEIGHT,
    backgroundColor: 'rgba(33, 160, 219, 0.1)',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#21A0DB',
    transform: [{ translateY: -ITEM_HEIGHT / 2 }],
  },
  charactersContainer: {
    position: 'absolute',
    width: '100%',
  },
  characterItem: {
    height: ITEM_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  characterIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  characterName: {
    fontSize: 16,
    color: '#333',
  },
  spinButton: {
    backgroundColor: '#21A0DB',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  spinButtonDisabled: {
    opacity: 0.5,
  },
  spinButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CharacterRouletteScreen;