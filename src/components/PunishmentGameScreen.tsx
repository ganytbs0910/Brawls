import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  Easing,
  Dimensions
} from 'react-native';

type Difficulty = '易' | '中' | '難' | '鬼';

interface GameElement {
  id: number;
  text: string;
  category: 'action' | 'control' | 'rule';
}

// 3つのカテゴリーの要素を定義
const GAME_ELEMENTS: Record<Difficulty, {
  action: GameElement[];
  control: GameElement[];
  rule: GameElement[];
}> = {
  '易': {
    action: [
      { id: 1, text: "一定位置で", category: 'action' },
      { id: 2, text: "指定レーンのみで", category: 'action' },
      { id: 3, text: "前進しながら", category: 'action' }
    ],
    control: [
      { id: 1, text: "通常攻撃のみで", category: 'control' },
      { id: 2, text: "スキル1回まで", category: 'control' },
      { id: 3, text: "ジャンプ3回まで", category: 'control' }
    ],
    rule: [
      { id: 1, text: "プレイする", category: 'rule' },
      { id: 2, text: "勝利する", category: 'rule' },
      { id: 3, text: "敵を倒す", category: 'rule' }
    ]
  },
  '中': {
    action: [
      { id: 4, text: "片手で", category: 'action' },
      { id: 5, text: "親指のみで", category: 'action' },
      { id: 6, text: "人差し指のみで", category: 'action' }
    ],
    control: [
      { id: 4, text: "後退しながら", category: 'control' },
      { id: 5, text: "ジャンプ禁止で", category: 'control' },
      { id: 6, text: "近接攻撃のみで", category: 'control' }
    ],
    rule: [
      { id: 4, text: "2キル達成する", category: 'rule' },
      { id: 5, text: "アイテムを3個集める", category: 'rule' },
      { id: 6, text: "チームメイトを守る", category: 'rule' }
    ]
  },
  '難': {
    action: [
      { id: 7, text: "画面を傾けて", category: 'action' },
      { id: 8, text: "スマホを逆さまで", category: 'action' },
      { id: 9, text: "左右反転操作で", category: 'action' }
    ],
    control: [
      { id: 7, text: "回避禁止で", category: 'control' },
      { id: 8, text: "回復アイテム禁止で", category: 'control' },
      { id: 9, text: "弾を3発以上持たずに", category: 'control' }
    ],
    rule: [
      { id: 7, text: "MVP を獲得する", category: 'rule' },
      { id: 8, text: "ダメージ2000以上与える", category: 'rule' },
      { id: 9, text: "敵を3人倒す", category: 'rule' }
    ]
  },
  '鬼': {
    action: [
      { id: 10, text: "画面上半分を隠して", category: 'action' },
      { id: 11, text: "片手逆操作で", category: 'action' },
      { id: 12, text: "目を閉じて3秒ごとに開けながら", category: 'action' }
    ],
    control: [
      { id: 10, text: "HPが50%以下で回復禁止", category: 'control' },
      { id: 11, text: "攻撃は必殺技のみで", category: 'control' },
      { id: 12, text: "常に前進しながら", category: 'control' }
    ],
    rule: [
      { id: 10, text: "30秒以内に勝利する", category: 'rule' },
      { id: 11, text: "ダメージを1000以下に抑える", category: 'rule' },
      { id: 12, text: "チームの全キルを取る", category: 'rule' }
    ]
  }
};

interface PunishmentGameScreenProps {
  onClose: () => void;
}

const SCREEN_HEIGHT = Dimensions.get('window').height;

const PunishmentGameScreen: React.FC<PunishmentGameScreenProps> = ({ onClose }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [selectedElements, setSelectedElements] = useState<GameElement[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const spinValues = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0)
  ]).current;

  const difficultyColors = {
    '易': '#4CAF50',
    '中': '#FFC107',
    '難': '#F44336',
    '鬼': '#800080'
  };

  const getDifficultyStyle = (difficulty: Difficulty) => ({
    ...styles.difficultyButton,
    backgroundColor: difficultyColors[difficulty],
  });

  const spinSlot = () => {
    if (isSpinning || !selectedDifficulty) return;

    setIsSpinning(true);
    const elements = GAME_ELEMENTS[selectedDifficulty];
    
    // リセット
    spinValues.forEach(value => value.setValue(0));

    // 3つのリールのアニメーション
    const animations = spinValues.map((value, index) =>
      Animated.sequence([
        Animated.timing(value, {
          toValue: 20,
          duration: 2000 + (index * 500), // リールごとに少しずつ遅延
          easing: Easing.bezier(0.19, 1, 0.22, 1),
          useNativeDriver: true,
        })
      ])
    );

    Animated.parallel(animations).start(() => {
      // アニメーション終了時に結果を選択
      const selected = [
        elements.action[Math.floor(Math.random() * elements.action.length)],
        elements.control[Math.floor(Math.random() * elements.control.length)],
        elements.rule[Math.floor(Math.random() * elements.rule.length)]
      ];
      setSelectedElements(selected);
      setIsSpinning(false);
    });
  };

  const resetSelection = () => {
    setSelectedDifficulty(null);
    setSelectedElements([]);
    setIsSpinning(false);
    spinValues.forEach(value => value.setValue(0));
  };

  const renderContent = () => {
    if (!selectedDifficulty) {
      return (
        <View style={styles.difficultyContainer}>
          <Text style={styles.instructionText}>難易度を選択してください</Text>
          <View style={styles.difficultyButtonsContainer}>
            {(['易', '中', '難', '鬼'] as Difficulty[]).map((difficulty) => (
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

    return (
      <View style={styles.slotContainer}>
        <Text style={[styles.difficultyTitle, { color: difficultyColors[selectedDifficulty] }]}>
          難易度：{selectedDifficulty}
        </Text>
        
        <View style={styles.slotMachine}>
          {spinValues.map((spinValue, index) => (
            <Animated.View 
              key={index}
              style={[
                styles.slotReel,
                {
                  transform: [{
                    translateY: spinValue.interpolate({
                      inputRange: [0, 10, 20],
                      outputRange: [0, -SCREEN_HEIGHT, 0]
                    })
                  }]
                }
              ]}
            >
              {selectedElements[index] ? (
                <Text style={styles.reelText}>{selectedElements[index].text}</Text>
              ) : (
                <Text style={styles.spinText}>?</Text>
              )}
            </Animated.View>
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.spinButton, isSpinning && styles.buttonDisabled]}
            onPress={spinSlot}
            disabled={isSpinning}
          >
            <Text style={styles.buttonText}>
              {isSpinning ? 'スピン中...' : 'スロットを回す'}
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
        <Text style={styles.title}>罰ゲームスロット</Text>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
      </View>
      
      {renderContent()}
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
  slotReel: {
    width: '100%',
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  reelText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
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

export default PunishmentGameScreen;