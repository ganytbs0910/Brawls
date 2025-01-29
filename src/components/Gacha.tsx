import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Vibration,
  Image,
  Animated,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface GachaProps {
  isAdFree: boolean;
  onShowDetails: (content: React.ReactNode) => void;
  tickets: number;
  useTicket: () => Promise<boolean>;
}

const Gacha: React.FC<GachaProps> = ({ isAdFree, tickets, useTicket }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [nextBonusTime, setNextBonusTime] = useState<string>('');
  const [spinAnim] = useState(new Animated.Value(0));

  useEffect(() => {
  const updateNextBonusTime = async () => {
    const now = new Date();
    // 日本時間の次の0時までの時間を計算
    const tomorrow = new Date();
    tomorrow.setHours(24, 0, 0, 0);
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();
    
    const hours = Math.floor(timeUntilMidnight / (1000 * 60 * 60));
    const minutes = Math.floor((timeUntilMidnight % (1000 * 60 * 60)) / (1000 * 60));
    
    setNextBonusTime(`次のログインボーナスまで: ${hours}時間${minutes}分`);
  };

  updateNextBonusTime();
  const timer = setInterval(updateNextBonusTime, 60000); // 1分ごとに更新

  return () => clearInterval(timer);
}, []);

  const startSpinAnimation = () => {
    spinAnim.setValue(0);
    Animated.sequence([
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleGachaPull = async () => {
    if (isAnimating) return;
    
    if (tickets <= 0) {
      Alert.alert(
        'チケット不足',
        'ガチャを引くにはチケットが必要です。毎日ログインすると1枚もらえます！',
        [{ text: 'OK' }]
      );
      return;
    }

    // チケットを使用
    const ticketUsed = await useTicket();
    if (!ticketUsed) return;

    setIsAnimating(true);
    startSpinAnimation();
    Vibration.vibrate(100);

    // 1/10の確率で当選
    const result = Math.random() < 0.1;
    
    setTimeout(() => {
      if (result) {
        Alert.alert(
          '🎉 大当たり！',
          'おめでとうございます！\nレア報酬を獲得しました！',
          [{ text: 'OK', onPress: () => setIsAnimating(false) }]
        );
      } else {
        Alert.alert(
          '残念...',
          'はずれです。\nまた挑戦してください！',
          [{ text: 'OK', onPress: () => setIsAnimating(false) }]
        );
      }
    }, 1000);
  };

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ガチャシミュレーター</Text>
      
      <View style={styles.infoContainer}>
        <Text style={styles.description}>
          当選確率: 10%{'\n'}
          所持チケット: {tickets}枚
        </Text>
        {nextBonusTime && (
          <Text style={styles.timerText}>{nextBonusTime}</Text>
        )}
      </View>

      <View style={styles.gachaContainer}>
        <Animated.Image
          source={require('../../assets/AppIcon/analysis.png')}
          style={[
            styles.gachaImage,
            { transform: [{ rotate: spin }] }
          ]}
        />
        
        <TouchableOpacity
          style={[
            styles.gachaButton,
            (isAnimating || tickets <= 0) && styles.gachaButtonDisabled
          ]}
          onPress={handleGachaPull}
          disabled={isAnimating || tickets <= 0}
        >
          <Text style={styles.buttonText}>
            {isAnimating ? 'ガチャ実行中...' : 
             tickets <= 0 ? 'チケットが必要です' : 'ガチャを引く！'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.noteContainer}>
        <Text style={styles.note}>
          ※ログインボーナスで毎日1枚チケットがもらえます
        </Text>
        <Text style={styles.subNote}>
          ※チケットは日付が変わるまで保存されます
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 10,
  },
  timerText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  gachaContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  gachaImage: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  gachaButton: {
    backgroundColor: '#65BBE9',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gachaButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  noteContainer: {
    alignItems: 'center',
    marginTop: 'auto',
  },
  note: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 5,
  },
  subNote: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
});

export default Gacha;