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

// マップ画像のインポート
const mapImages = {
  "天国と地獄": require('../../assets/MapImages/Feast_Or_Famine.png'),
  "空飛ぶ絨毯": require('../../assets/MapImages/Flying_Fantasies.png'),
  "囚われた島": require('../../assets/MapImages/Island_Invasion.png'),
  "狙撃手たちの楽園": require('../../assets/MapImages/Marksmans_Paradise.png'),
  "岩壁の決戦": require('../../assets/MapImages/Rockwall_Brawl.png'),
  "安全センター": require('../../assets/MapImages/Safety_Center.png'),
  "ガイコツ川": require('../../assets/MapImages/Skull_Creek.png'),
  "酸性湖": require('../../assets/MapImages/Acid_Lakes.png'),
  "激動の洞窟": require('../../assets/MapImages/Cavern_Churn.png'),
  "暗い廊下": require('../../assets/MapImages/Dark_Passage.png'),
  "ダブルトラブル": require('../../assets/MapImages/Double_Trouble.png'),
  "枯れた川": require('../../assets/MapImages/Dried_Up_River.png'),

  // ノックアウト
  "白熱対戦": require('../../assets/MapImages/H_for.png'),
  "新たなる地平": require('../../assets/MapImages/New_Horizons.png'),
  "オープンフィールド": require('../../assets/MapImages/Out_In_The_Open.png'),
  "生い茂る廃墟": require('../../assets/MapImages/Overgrown_Ruins.png'),
  "バキューン神殿": require('../../assets/MapImages/Temple_Of_Vroom.png'),
  "極小列島": require('../../assets/MapImages/Tiny_Islands.png'),
  "双頭の川": require('../../assets/MapImages/Two_Rivers.png'),
  "ベルの岩": require('../../assets/MapImages/Belles_Rock.png'),
  "密林の奥地": require('../../assets/MapImages/Deep_Forest.png'),
  "燃える不死鳥": require('../../assets/MapImages/Flaring_Phoenix.png'),
  "四段階層": require('../../assets/MapImages/Four_Levels.png'),
  "ゴールドアームの渓谷": require('../../assets/MapImages/Goldarm_Gulch.png'),

  // エメラルドハント
  "ごつごつ坑道": require('../../assets/MapImages/Hard_Rock_Mine.png'),
  "ラストストップ": require('../../assets/MapImages/Last_Stop.png'),
  "トロッコの狂気": require('../../assets/MapImages/Minecart_Madness.png'),
  "オープンスペース": require('../../assets/MapImages/Open_Space.png'),
  "廃れたアーケード": require('../../assets/MapImages/Rustic_Arcade.png'),
  "アンダーマイン": require('../../assets/MapImages/Undermine.png'),
  "クリスタルアーケード": require('../../assets/MapImages/Crystal_Arcade.png'),
  "サボテンの罠": require('../../assets/MapImages/Deathcap_Trap.png'),
  "ダブルレール": require('../../assets/MapImages/Double_Swoosh.png'),
  "森林伐採": require('../../assets/MapImages/Forest_Clearing.png'),
  "クールロック": require('../../assets/MapImages/The_Cooler_Hard_Rock.png'),
  "エメラルドの要塞": require('../../assets/MapImages/Gem_Fort.png'),

  // ホットゾーン＆強奪
  "オープンビジネス": require('../../assets/MapImages/Open_Business.png'),
  "安全地帯": require('../../assets/MapImages/Safe_Zone.png'),
  "パラレルワールド": require('../../assets/MapImages/Parallel_Plays.png'),
  "安全地帯・改": require('../../assets/MapImages/Safe(r)_Zone.png'),
  "炎のリング": require('../../assets/MapImages/Ring_Of_Fire.png'),
  "大いなる湖": require('../../assets/MapImages/The_Great_Lake.png'),
  "ウォータースポーツ": require('../../assets/MapImages/Watersport.png'),
  "GG 2.0": require('../../assets/MapImages/Gg_2.0.png'),
  "ビートルバトル": require('../../assets/MapImages/Dueling_Beetles.png'),
  "ホットポテト": require('../../assets/MapImages/Hot_Potato.png'),
  "喧騒居住地": require('../../assets/MapImages/Noisy_Neighbors.png'),
  "どんぱち谷": require('../../assets/MapImages/Kaboom_Canyon.png'),

  // 5vs5ブロストライカー
  "サスペンダーズ": require('../../assets/MapImages/Suspenders.png'),
  "合流地点": require('../../assets/MapImages/Riverbank_Crossing.png'),
  "凍てつく波紋": require('../../assets/MapImages/Freezing_Ripples.png'),
  "ツルツルロード": require('../../assets/MapImages/Slippery_Road.png'),
  "大波": require('../../assets/MapImages/Great_Waves.png'),
  "ガクブル公園": require('../../assets/MapImages/Icy_Ice_Park.png'),
  "クールシェイプ": require('../../assets/MapImages/Cool_Shapes.png'),
  "フロスティトラック": require('../../assets/MapImages/Frosty_Tracks.png'),

  // デュエル＆殲滅＆賞金稼ぎ
  "暴徒のオアシス": require('../../assets/MapImages/Slayers_Paradise.png'),
  "流れ星": require('../../assets/MapImages/Shooting_Star.png'),
  "常勝街道": require('../../assets/MapImages/Warriors_Way.png'),
  "スパイスプロダクション": require('../../assets/MapImages/Spice_Production.png'),
  "ジグザグ草原": require('../../assets/MapImages/Snake_Prairie.png'),
  "禅の庭園": require('../../assets/MapImages/Zen_Garden.png'),
  "大いなる入口": require('../../assets/MapImages/The_Great_Open.png'),
  "グランドカナル": require('../../assets/MapImages/Canal_Grande.png'),
  "猿の迷路": require('../../assets/MapImages/Monkey_Maze.png'),
  "果てしなき不運": require('../../assets/MapImages/Infinite_Doom.png'),
  "隠れ家": require('../../assets/MapImages/Hideout.png'),
  "不屈の精神": require('../../assets/MapImages/No_Surrender.png'),

  // ブロストライカー
  "セカンドチャンス": require('../../assets/MapImages/Second_Try.png'),
  "静かな広場": require('../../assets/MapImages/Sneaky_Fields.png'),
  "サニーサッカー": require('../../assets/MapImages/Sunny_Soccer.png'),
  "スーパービーチ": require('../../assets/MapImages/Super_Beach.png'),
  "トリッキー": require('../../assets/MapImages/Trickey.png'),
  "トリプル・ドリブル": require('../../assets/MapImages/Triple_Dribble.png'),
  "鉄壁の守り": require('../../assets/MapImages/Backyard_Bowl.png'),
  "ビーチボール": require('../../assets/MapImages/Beach_Ball.png'),
  "中央コート": require('../../assets/MapImages/Center_Stage.png'),
  "ペナルティキック": require('../../assets/MapImages/Penalty_Kick.png'),
  "ピンボールドリーム": require('../../assets/MapImages/Pinball_Dreams.png'),
  "狭き門": require('../../assets/MapImages/Pinhole_Punt.png')
};

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
        "空飛ぶ絨毯", "囚われた島", "狙撃手たちの楽園",
        "岩壁の決戦", "安全センター", "ガイコツ川", "酸性湖",
        "激動の洞窟", "暗い廊下", "ダブルトラブル", "枯れた川", "天国と地獄"
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
        "安全地帯", "パラレルワールド", "安全地帯・改",
        "炎のリング", "大いなる湖", "ウォータースポーツ", "GG 2.0",
        "ビートルバトル", "ホットポテト", "喧騒居住地", "どんぱち谷", "オープンビジネス"
      ],
      brawlBall5v5: [
        "ガクブル公園", "クールシェイプ", "フロスティトラック",
        "サスペンダーズ", "合流地点", "凍てつく波紋", 
        "ツルツルロード", "大波"
      ],
      brawlBall: [
        "セカンドチャンス", "静かな広場", "サニーサッカー", 
        "スーパービーチ", "トリッキー", "トリプル・ドリブル",
        "鉄壁の守り", "ビーチボール", "中央コート",
        "ペナルティキック", "ピンボールドリーム", "狭き門"
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
    brawlBall5v5: getMapForDate("brawlBall5v5", selectedDate.getDate() - new Date().getDate()),
    knockout: getMapForDate("knockout", selectedDate.getDate() - new Date().getDate()),
    duel: getMapForDate("duel", selectedDate.getDate() - new Date().getDate())
  };

  const modes = [
    {
      name: "バトルロワイヤル",
      currentMap: currentMaps.battleRoyale,
      updateTime: 5,
      color: "#90EE90"
    },
    {
      name: "エメラルドハント",
      currentMap: currentMaps.emeraldHunt,
      updateTime: 11,
      color: "#DA70D6"
    },
    {
      name: "ノックアウト",
      currentMap: currentMaps.knockout,
      updateTime: 11,
      color: "#FFA500"
    },
    {
      name: "ホットゾーン＆強奪",
      currentMap: currentMaps.heist,
      updateTime: 23,
      color: "#FF69B4",
      isRotating: true
    },
    {
      name: "5vs5ブロストライカー",
      currentMap: currentMaps.brawlBall5v5,
      updateTime: 17,
      color: "#808080",
      isRotating: true
    },
    {
      name: "ブロストライカー",
      currentMap: currentMaps.brawlBall,
      updateTime: 17,
      color: "#4169E1",
      isRotating: true
    },
    {
      name: "デュエル＆殲滅＆賞金稼ぎ",
      currentMap: currentMaps.duel,
      updateTime: 17,
      color: "#FF0000",
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
              <View style={styles.mapContent}>
                <Text style={styles.mapName}>{mode.currentMap}</Text>
                {(mode.name === "バトルロワイヤル" || mode.name === "エメラルドハント" || 
                  mode.name === "ノックアウト" || mode.name === "ホットゾーン＆強奪" || 
                  mode.name === "5vs5ブロストライカー" || mode.name === "ブロストライカー" || 
                  mode.name === "デュエル＆殲滅＆賞金稼ぎ") && (
                  <Image 
                    source={mapImages[mode.currentMap]}
                    style={styles.mapImage}
                    resizeMode="contain"
                  />
                )}
              </View>
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
            ]}>
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
  mapContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mapName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#333',
    flex: 1,
  },
  mapImage: {
    width: 120,
    height: 80,
    borderRadius: 8,
    marginLeft: 16,
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