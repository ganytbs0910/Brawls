import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Animated, 
  ScrollView, 
  Dimensions, 
  Share, 
  SafeAreaView
} from 'react-native';
import { privacyPolicyContent } from '../contents/privacyPolicy';
import { termsContent } from '../contents/terms';
import { DailyTip } from '../components/DailyTip';

const SCREEN_WIDTH = Dimensions.get('window').width;

type ScreenType = 'home' | 'settings' | 'privacy' | 'terms';

interface ScreenState {
  type: ScreenType;
  translateX: Animated.Value;
  zIndex: number;
}

const Home: React.FC = () => {
  const [screenStack, setScreenStack] = useState<ScreenState[]>([
    { type: 'home', translateX: new Animated.Value(0), zIndex: 0 }
  ]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'ブロールスターズのマップ情報',
        title: 'マップ共有'
      });
    } catch (error) {
      console.error(error);
    }
  };

  const showScreen = (screenType: ScreenType) => {
    const newScreen: ScreenState = {
      type: screenType,
      translateX: new Animated.Value(SCREEN_WIDTH),
      zIndex: screenStack.length
    };

    setScreenStack(prev => [...prev, newScreen]);

    Animated.timing(newScreen.translateX, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const goBack = () => {
    if (screenStack.length <= 1) return;

    const currentScreen = screenStack[screenStack.length - 1];

    Animated.timing(currentScreen.translateX, {
      toValue: SCREEN_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setScreenStack(prev => prev.slice(0, -1));
    });
  };

  const getNextUpdateTime = (hour: number) => {
    const next = new Date(currentTime);
    next.setHours(hour, 0, 0, 0);
    if (next < currentTime) next.setDate(next.getDate() + 1);
    const diff = next - currentTime;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}時間${minutes}分`;
  };

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const getMapForDate = (gameMode: string, daysOffset: number) => {
    const maps = {
      battleRoyale: [
        "天国と地獄", "空飛ぶ絨毯", "囚われた島", "狙撃手たちの楽園",
        "岩壁の決戦", "安全センター", "ガイコツ川", "酸性湖",
        "激動の洞窟", "暗い廊下", "ダブルトラブル", "枯れた川"
      ],
      knockout: [
        "白熱対戦", "新たなる地平", "オープンフィールド", "生い茂る廃墟",
        "バキューン神殿", "極小列島", "双頭の川", "ベルの岩",
        "密林の奥地", "燃える不死鳥", "四段階層", "ゴールドアームの渓谷"
      ],
      emeraldHunt: [
        "ごつごつ坑道", "ラストストップ", "トロッコの狂気", "オープンスペース",
        "廃れたアーケード", "アンダーマイン", "クリスタルアーケード", "サボテンの罠",
        "ダブルレール", "森林伐採", "クールロック", "エメラルドの要塞"
      ],
      heist: [
        "オープンビジネス", "安全地帯", "パラレルワールド", "安全地帯・改",
        "炎のリング", "大いなる湖", "ウォータースポーツ", "GG 2.0",
        "ビートルバトル", "ホットポテト", "喧騒居住地", "どんぱち谷"
      ],
      brawlBall: [
        "サスペンダーズ", "合流地点", "凍てつく波紋", "ツルツルロード",
        "大波", "ガクブル公園", "クールシェイプ", "フロスティトラック"
      ],
      duel: [
        "暴徒のオアシス", "流れ星", "常勝街道", "スパイスプロダクション",
        "ジグザグ草原", "禅の庭園", "大いなる入口", "グランドカナル",
        "猿の迷路", "果てしなき不運", "隠れ家", "不屈の精神"
      ]
    };
  
    const baseDate = new Date(2024, 11, 23);
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysOffset);
    
    const daysDiff = Math.floor((targetDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
    const modeMapList = maps[gameMode as keyof typeof maps] || [];
    const mapIndex = daysDiff % modeMapList.length;
    
    return modeMapList[mapIndex];
  };

  const formatDate = (date: Date) => {
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const currentMaps = {
    battleRoyale: getMapForDate("battleRoyale", selectedDate.getDate() - new Date().getDate()),
    emeraldHunt: getMapForDate("emeraldHunt", selectedDate.getDate() - new Date().getDate()),
    heist: getMapForDate("heist", selectedDate.getDate() - new Date().getDate()),
    brawlBall: getMapForDate("brawlBall", selectedDate.getDate() - new Date().getDate()),
    knockout: getMapForDate("knockout", selectedDate.getDate() - new Date().getDate()),
    duel: getMapForDate("duel", selectedDate.getDate() - new Date().getDate())
  };

  const modes = [
    {
      name: "バトルロワイヤル",
      currentMap: currentMaps.battleRoyale,
      updateTime: 5,
      color: "#EF4444"
    },
    {
      name: "エメラルドハント",
      currentMap: currentMaps.emeraldHunt,
      updateTime: 11,
      color: "#10B981"
    },
    {
      name: "ノックアウト",
      currentMap: currentMaps.knockout,
      updateTime: 11,
      color: "#8B5CF6"
    },
    {
      name: "ホットゾーン＆強奪",
      currentMap: currentMaps.heist,
      updateTime: 23,
      color: "#F97316",
      isRotating: true
    },
    {
      name: "5対5ブロストライカー＆殲滅",
      currentMap: currentMaps.brawlBall,
      updateTime: 17,
      color: "#3B82F6",
      isRotating: true
    },
    {
      name: "デュエル＆殲滅＆賞金稼ぎ",
      currentMap: currentMaps.duel,
      updateTime: 17,
      color: "#EC4899",
      isRotating: true
    }
  ];

  const renderScreenContent = (screen: ScreenState) => {
    switch (screen.type) {
      case 'settings':
        return (
          <View style={styles.settingsContainer}>
            <View style={styles.settingsHeader}>
              <Text style={styles.settingsTitle}>設定</Text>
              <TouchableOpacity onPress={goBack} style={styles.backButton}>
                <Text style={styles.backButtonText}>←</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.settingsContent}>
              <TouchableOpacity 
                style={styles.settingsItem}
                onPress={handleShare}
              >
                <Text style={styles.settingsItemText}>共有</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.settingsItem}
                onPress={() => showScreen('privacy')}
              >
                <Text style={styles.settingsItemText}>プライバシーポリシー</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.settingsItem}
                onPress={() => showScreen('terms')}
              >
                <Text style={styles.settingsItemText}>利用規約</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 'privacy':
        return (
          <View style={styles.settingsContainer}>
            <View style={styles.settingsHeader}>
              <Text style={styles.settingsTitle}>プライバシーポリシー</Text>
              <TouchableOpacity onPress={goBack} style={styles.backButton}>
                <Text style={styles.backButtonText}>←</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.contentContainer}>
              <Text style={styles.contentText}>{privacyPolicyContent}</Text>
            </ScrollView>
          </View>
        );
      case 'terms':
        return (
          <View style={styles.settingsContainer}>
            <View style={styles.settingsHeader}>
              <Text style={styles.settingsTitle}>利用規約</Text>
              <TouchableOpacity onPress={goBack} style={styles.backButton}>
                <Text style={styles.backButtonText}>←</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.contentContainer}>
              <Text style={styles.contentText}>{termsContent}</Text>
            </ScrollView>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ブロールスターズ マップ情報</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => showScreen('settings')}
        >
          <Image 
            source={require('../../assets/AppIcon/settings_icon.png')} 
            style={[styles.settingsIcon, { tintColor: '#ffffff' }]}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <DailyTip />
        <View style={styles.modeContainer}>
          <View style={styles.dateHeader}>
            <TouchableOpacity onPress={() => changeDate(-1)}>
              <Text style={styles.dateArrow}>←</Text>
            </TouchableOpacity>
            <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
            <TouchableOpacity onPress={() => changeDate(1)}>
              <Text style={styles.dateArrow}>→</Text>
            </TouchableOpacity>
          </View>
          {modes.map((mode, index) => (
            <View key={index} style={styles.modeCard}>
              <View style={styles.modeHeader}>
                <View style={[styles.modeTag, { backgroundColor: mode.color }]}>
                  <Text style={styles.modeTagText}>{mode.name}</Text>
                </View>
                {selectedDate.getDate() === new Date().getDate() && (
                  <Text style={styles.updateTime}>
                    更新まで {getNextUpdateTime(mode.updateTime)}
                  </Text>
                )}
              </View>
              <Text style={styles.mapName}>{mode.currentMap}</Text>
              {mode.isRotating && (
                <Text style={styles.rotatingNote}>
                  ※モードとマップはローテーションします
                </Text>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {screenStack.map((screen, index) => (
        index > 0 && (
          <Animated.View 
            key={`${screen.type}-${screen.zIndex}`}
            style={[
              styles.settingsOverlay,
              {
                transform: [{ translateX: screen.translateX }],
                zIndex: screen.zIndex
              },
            ]}
          >
            {renderScreenContent(screen)}
          </Animated.View>
        )
      ))}
    </SafeAreaView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#4FA8D6',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  settingsButton: {
    padding: 8,
  },
  settingsIcon: {
    width: 24,
    height: 24,
  },
  content: {
    flex: 1,
  },
  settingsOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
  },
  settingsContainer: {
    flex: 1,
  },
  settingsHeader: {
    height: 60,
    backgroundColor: '#21A0DB',
    flexDirection: 'row',
  justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#4FA8D6',
  },
  settingsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  settingsContent: {
    flex: 1,
  },
  settingsItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingsItemText: {
    fontSize: 16,
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
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
  },
  modeContainer: {
    padding: 16,
  },
  modeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  modeCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modeTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  modeTagText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  updateTime: {
    color: '#666',
    fontSize: 14,
  },
  mapName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#333',
  },
  rotatingNote: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
  },
  dateArrow: {
    fontSize: 24,
    color: '#21A0DB',
    paddingHorizontal: 16,
  },
});

export default Home;