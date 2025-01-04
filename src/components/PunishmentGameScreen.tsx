import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView
} from 'react-native';
import { CHARACTER_IMAGES, CharacterName } from '../data/characterImages';

type Difficulty = '優しい' | '普通' | '厳しい' | '鬼畜';

const GAME_MODES = [
  "バトルロワイヤル（デュオ）",
  "エメラルドハント",
  "ブロストライカー",
  "ノックアウト",
] as const;

type GameMode = typeof GAME_MODES[number];

const CHALLENGES: Record<Difficulty, string[]> = {
  '優しい': [
    "弱い方のスタパ使用",
    "弱い方のガジェット使用",
    "初動15秒操作を禁止",
    "野良でバトル",
  ],
  '普通': [
    "ガジェット使用禁止",
    "ウルト使用禁止",
    "ハイパーチャージ使用禁止",
    "今一番トロ高いキャラを強制的に使用",
    "1回死んでからスタート",
    "スターパワー、ガジェット、ギアは弱い方を使用",
  ],
  '厳しい': [
    "自分と他人の回復を禁止",
    "移動と攻撃ボタン反転でプレイ",
    "今一番トロ高いキャラを強制的に使用",
    "攻撃5回のみ",
    "3連勝するまで終われない",
    "2回死んでからスタート",
    "片手縛り",
    "味方全員投げキャラクター使用"
  ],
  '鬼畜': [
    "上下反転でプレイ",
    "攻撃するの禁止",
    "チーム全員ウルトとガジェットとハイパーチャージ禁止",
    "5連勝するまで終われない",
    "負けたら即170エメラルド購入",
    "右半分の画面見れない縛り",
  ]
};

interface ChallengeGameScreenProps {
  onClose: () => void;
}

// スロットの1つのリールを管理するカスタムフック
const useSlotReel = <T extends any>(initialItems: T[], intervalMs: number = 100) => {
  const [currentItem, setCurrentItem] = useState<T | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const intervalRef = useRef<NodeJS.Timer | null>(null);
  const itemsRef = useRef(initialItems);

  const updateItems = (newItems: T[]) => {
    itemsRef.current = newItems;
    if (!isSpinning && !currentItem) {
      setCurrentItem(newItems[0]);
    }
  };

  const startSpinning = () => {
    if (isSpinning || itemsRef.current.length === 0) return;
    
    setIsSpinning(true);
    let index = 0;
    
    // 開始時に最初のアイテムを表示
    setCurrentItem(itemsRef.current[0]);
    
    intervalRef.current = setInterval(() => {
      index = (index + 1) % itemsRef.current.length;
      setCurrentItem(itemsRef.current[index]);
    }, intervalMs);
  };

  const stopSpinning = () => {
    if (!isSpinning) return;
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // ランダムなアイテムで停止
    const randomIndex = Math.floor(Math.random() * itemsRef.current.length);
    setCurrentItem(itemsRef.current[randomIndex]);
    setIsSpinning(false);
  };

  // クリーンアップ
  useEffect(() => {
    // 初期アイテムを設定
    if (initialItems.length > 0) {
      setCurrentItem(initialItems[0]);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return { currentItem, isSpinning, startSpinning, stopSpinning, updateItems };
};

const ChallengeGameScreen: React.FC<ChallengeGameScreenProps> = ({ onClose }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);

  // スロットの各リールを管理
  const characterReel = useSlotReel(Object.keys(CHARACTER_IMAGES) as CharacterName[]);
  const modeReel = useSlotReel(GAME_MODES);
  const challengeReel = useSlotReel(
    selectedDifficulty ? CHALLENGES[selectedDifficulty] : []
  );

  // 難易度が変更されたらチャレンジリールの要素を更新し、全てのリールを開始
  useEffect(() => {
    if (selectedDifficulty) {
      // まずチャレンジリールの要素を更新
      challengeReel.updateItems(CHALLENGES[selectedDifficulty]);
      
      // 少し遅延を入れてからスロットを開始
      setTimeout(() => {
        characterReel.startSpinning();
        modeReel.startSpinning();
        challengeReel.startSpinning();
      }, 100);
    }
  }, [selectedDifficulty]);

  const difficultyColors = {
    '優しい': '#4CAF50',
    '普通': '#FFC107',
    '厳しい': '#F44336',
    '鬼畜': '#800080'
  };

  const getDifficultyStyle = (difficulty: Difficulty) => ({
    ...styles.difficultyButton,
    backgroundColor: difficultyColors[difficulty],
  });

  // 全てのリールを開始
  const startAllReels = () => {
    characterReel.startSpinning();
    modeReel.startSpinning();
    challengeReel.startSpinning();
  };

  // リセット処理
  const resetSelection = () => {
    characterReel.stopSpinning();
    modeReel.stopSpinning();
    challengeReel.stopSpinning();
    setSelectedDifficulty(null);
  };

  const renderContent = () => {
    if (!selectedDifficulty) {
      return (
        <View style={styles.difficultyContainer}>
          <Text style={styles.instructionText}>難易度を選択してください</Text>
          <View style={styles.difficultyButtonsContainer}>
            {(['優しい', '普通', '厳しい', '鬼畜'] as Difficulty[]).map((difficulty) => (
              <TouchableOpacity
                key={difficulty}
                style={getDifficultyStyle(difficulty)}
                onPress={() => setSelectedDifficulty(difficulty)}
              >
                <Text style={styles.difficultyButtonText}>{difficulty}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    }

    const isAnySpinning = characterReel.isSpinning || modeReel.isSpinning || challengeReel.isSpinning;

    return (
      <View style={styles.slotContainer}>
        <Text style={[styles.difficultyTitle, { color: difficultyColors[selectedDifficulty] }]}>
          難易度：{selectedDifficulty}
        </Text>
        
        <View style={styles.slotMachine}>
          {/* キャラクター選択のリール */}
          <View style={styles.reelContainer}>
            <View style={styles.slotReel}>
              {characterReel.currentItem ? (
                <View style={styles.characterContainer}>
                  <Image 
                    source={CHARACTER_IMAGES[characterReel.currentItem]}
                    style={styles.characterImage}
                  />
                  <Text style={styles.reelText}>{characterReel.currentItem}</Text>
                </View>
              ) : (
                <Text style={styles.spinText}>?</Text>
              )}
            </View>
            <TouchableOpacity
              style={[styles.stopButton, !characterReel.isSpinning && styles.buttonDisabled]}
              onPress={characterReel.stopSpinning}
              disabled={!characterReel.isSpinning}
            >
              <Text style={styles.buttonText}>STOP</Text>
            </TouchableOpacity>
          </View>

          {/* モード選択のリール */}
          <View style={styles.reelContainer}>
            <View style={styles.slotReel}>
              {modeReel.currentItem ? (
                <Text style={styles.reelText}>{modeReel.currentItem}</Text>
              ) : (
                <Text style={styles.spinText}>?</Text>
              )}
            </View>
            <TouchableOpacity
              style={[styles.stopButton, !modeReel.isSpinning && styles.buttonDisabled]}
              onPress={modeReel.stopSpinning}
              disabled={!modeReel.isSpinning}
            >
              <Text style={styles.buttonText}>STOP</Text>
            </TouchableOpacity>
          </View>

          {/* チャレンジ選択のリール */}
          <View style={styles.reelContainer}>
            <View style={styles.slotReel}>
              {challengeReel.currentItem ? (
                <Text style={styles.reelText}>{challengeReel.currentItem}</Text>
              ) : (
                <Text style={styles.spinText}>?</Text>
              )}
            </View>
            <TouchableOpacity
              style={[styles.stopButton, !challengeReel.isSpinning && styles.buttonDisabled]}
              onPress={challengeReel.stopSpinning}
              disabled={!challengeReel.isSpinning}
            >
              <Text style={styles.buttonText}>STOP</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.spinButton, isAnySpinning && styles.buttonDisabled]}
            onPress={startAllReels}
            disabled={isAnySpinning}
          >
            <Text style={styles.buttonText}>
              {isAnySpinning ? 'スピン中...' : 
               (characterReel.currentItem && modeReel.currentItem && challengeReel.currentItem) ? 
               'もう一度！' : 'スロットを回す'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.resetButton]}
            onPress={resetSelection}
          >
            <Text style={styles.buttonText}>難易度選択に戻る</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ブロスタチャレンジ</Text>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {renderContent()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 24, // 下部に余白を追加
  },
  header: {
    height: 60,
    backgroundColor: '#21A0DB',
    flexDirection: 'row',
    justifyContent: 'center',
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
  backButton: {
    position: 'absolute',
    left: 16,
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: '#fff',
  },
  difficultyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  instructionText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 32,
    color: '#333',
  },
  difficultyButtonsContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  difficultyButton: {
    width: '80%',
    paddingVertical: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  difficultyButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  slotContainer: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  difficultyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  slotMachine: {
    width: '90%',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    marginVertical: 24,
    padding: 16,
    borderWidth: 2,
    borderColor: '#ddd',
    gap: 16,
  },
  reelContainer: {
    alignItems: 'center',
    gap: 8,
  },
  slotReel: {
    width: '100%',
    height: 80,
    backgroundColor: '#fff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  characterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  characterImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  reelText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  spinText: {
    fontSize: 24,
    color: '#666',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  button: {
    width: '80%',
    paddingVertical: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopButton: {
    width: '50%',
    paddingVertical: 8,
    backgroundColor: '#e74c3c',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinButton: {
    backgroundColor: '#21A0DB',
  },
  resetButton: {
    backgroundColor: '#666',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ChallengeGameScreen;