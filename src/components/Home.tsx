import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Animated, 
  ScrollView, 
  Dimensions, 
  SafeAreaView,
  AppState,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../App';
import { DailyTip } from '../components/DailyTip';
import { RewardedAd, RewardedAdEventType } from 'react-native-google-mobile-ads';
import { AD_CONFIG } from '../config/AdConfig';
import { BannerAdComponent } from '../components/BannerAdComponent';
import { 
  rotatingModes, 
  mapImages,
  getGameDataForDateTime
} from '../utils/gameData';
import AdMobService from '../services/AdMobService';
import SettingsScreen from './SettingsScreen';
import { MapDetail, GameMode, ScreenType, ScreenState } from '../types';
import { getMapDetails } from '../data/mapDetails';

type RankingsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const SCREEN_WIDTH = Dimensions.get('window').width;

// 更新時刻の定義
const UPDATE_HOURS = [5, 11, 17, 23];

const useMapUpdateTimer = (updateHours: number[]) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const getNextUpdateTime = (currentTime: Date): Date => {
      const now = new Date(currentTime);
      let nextUpdate = new Date(now);
      nextUpdate.setDate(nextUpdate.getDate() + 1);
      nextUpdate.setHours(5, 0, 0, 0);  // 次の日の5時をデフォルト
    
      // 今日の残りの更新時刻をチェック
      for (const hour of updateHours) {
        const updateTime = new Date(now);
        updateTime.setHours(hour, 0, 0, 0);
        
        if (updateTime > now && updateTime < nextUpdate) {
          nextUpdate = updateTime;
        }
      }
      return nextUpdate;
    };

    const scheduleNextUpdate = () => {
      const now = new Date();
      const nextUpdate = getNextUpdateTime(now);
      const timeUntilUpdate = nextUpdate.getTime() - now.getTime();

      console.log('Next update scheduled for:', nextUpdate);
      console.log('Time until update:', timeUntilUpdate, 'ms');

      timeoutId = setTimeout(() => {
        const newTime = new Date();
        setCurrentTime(newTime);
        console.log('Update triggered at:', newTime);
        
        // 次の更新をスケジュール（1秒の遅延を入れて重複を避ける）
        setTimeout(() => {
          scheduleNextUpdate();
        }, 1000);
      }, timeUntilUpdate);
    };

    // 1分ごとの更新も維持
    const minuteUpdateId = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    scheduleNextUpdate();

    return () => {
      clearTimeout(timeoutId);
      clearInterval(minuteUpdateId);
    };
  }, []);

  return currentTime;
};

const Home: React.FC = () => {
  const currentTime = useMapUpdateTimer(UPDATE_HOURS);
  const navigation = useNavigation<RankingsScreenNavigationProp>();
  const [screenStack, setScreenStack] = useState<ScreenState[]>([
    { type: 'home', translateX: new Animated.Value(0), zIndex: 0 }
  ]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isRewardedAdReady, setIsRewardedAdReady] = useState(false);
  const [isAdFree, setIsAdFree] = useState(false);
  const [mapDetailProps, setMapDetailProps] = useState<MapDetail | null>(null);

  const adService = useRef<AdMobService | null>(null);

  const rewardedAdUnitId = Platform.select({
    ios: AD_CONFIG.IOS_REWARDED_ID,
    android: AD_CONFIG.ANDROID_REWARDED_ID,
  }) as string;

  const rewarded = useRef(
    RewardedAd.createForAdRequest(rewardedAdUnitId, {
      requestNonPersonalizedAdsOnly: true,
      keywords: ['game', 'mobile game'],
    })
  ).current;

  // 広告関連の設定
  useEffect(() => {
    const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      setIsRewardedAdReady(true);
    });

    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      reward => {
        console.log('User earned reward of ', reward);
      },
    );

    rewarded.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, [rewarded]);

  // 広告削除状態の確認
  useEffect(() => {
    const checkAdFreeStatus = async () => {
      try {
        const status = await AsyncStorage.getItem('adFreeStatus');
        setIsAdFree(status === 'true');
      } catch (error) {
        console.error('Failed to check ad-free status:', error);
      }
    };

    checkAdFreeStatus();
  }, []);

  // バックグラウンド更新のサポート
  useEffect(() => {
    const handleAppStateChange = async (nextAppState: string) => {
      if (nextAppState === 'active') {
        console.log('App became active, updating state');
        setSelectedDate(new Date());
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, []);

  // 日付比較のヘルパー関数
  const isSameDate = (date1: Date, date2: Date): boolean => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  // 現在の日付と選択された日付が同じかどうかをチェック
  const isCurrentDate = (date: Date) => {
    const now = new Date();
    return isSameDate(date, now);
  };

  // モードごとの更新時刻を取得
  const getModeUpdateTime = (gameMode: keyof GameMaps): number => {
    switch (gameMode) {
      case 'battleRoyale': return 5;
      case 'emeraldHunt': return 11;
      case 'heist': return 23;
      case 'brawlBall': return 17;
      case 'brawlBall5v5': return 17;
      case 'knockout': return 11;
      case 'duel': return 23;
      default: return 5;
    }
  };

  const getGameDataForSelectedDate = (gameMode: keyof GameMaps) => {
    const now = new Date();
    
    if (isCurrentDate(selectedDate)) {
      // 現在の日付の場合は、時刻による更新を適用
      return getGameDataForDateTime(gameMode, currentTime, getModeUpdateTime(gameMode));
    } else {
      // 選択された日付が今日より後の場合
      const daysDiff = Math.floor((selectedDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      // 次の日のマップを取得するため、24時間を加算
      const nextDayOffset = daysDiff * 24 + 24;
      
      return getGameDataForDateTime(
        gameMode,
        now,
        getModeUpdateTime(gameMode),
        nextDayOffset
      );
    }
  };

  const handleMapClick = (mode: any) => {
    const mapDetail = getMapDetails(mode.currentMap);
    
    if (mapDetail) {
      setMapDetailProps({
        mapName: mode.currentMap,
        modeName: mode.name,
        modeColor: mode.color,
        modeIcon: mode.icon,
        mapImage: mapImages[mode.currentMap]
      });
      showScreen('mapDetail');
    } else {
      console.warn(`Map details not found for: ${mode.currentMap}`);
    }
  };

  const handleCharacterPress = (characterName: string) => {
    navigation.navigate('CharacterDetails', { characterName });
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

  const formatTimeUntilUpdate = (mode: any) => {
    const now = new Date();
    let updateTime = new Date(now);
    updateTime.setHours(mode.updateTime, 0, 0, 0);
    
    if (updateTime <= now) {
      updateTime.setDate(updateTime.getDate() + 1);
    }

    const diff = updateTime.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}時間${minutes}分`;
  };

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (isSameDate(date, now)) {
      return '今日';
    } else if (isSameDate(date, yesterday)) {
      return '昨日';
    } else if (isSameDate(date, tomorrow)) {
      return '明日';
    } else {
      return `${date.getMonth() + 1}月${date.getDate()}日`;
    }
  };

  const currentGameData = {
    battleRoyale: getGameDataForSelectedDate("battleRoyale"),
    emeraldHunt: getGameDataForSelectedDate("emeraldHunt"),
    heist: getGameDataForSelectedDate("heist"),
    brawlBall: getGameDataForSelectedDate("brawlBall"),
    brawlBall5v5: getGameDataForSelectedDate("brawlBall5v5"),
    knockout: getGameDataForSelectedDate("knockout"),
    duel: getGameDataForSelectedDate("duel")
  };

  const modes = [
    {
      name: "バトルロワイヤル",
      currentMap: currentGameData.battleRoyale.map,
      updateTime: 5,
      color: "#99ff66",
      icon: require('../../assets/GameModeIcons/showdown_icon.png')
    },
    {
      name: "エメラルドハント",
      currentMap: currentGameData.emeraldHunt.map,
      updateTime: 11,
      color: "#DA70D6",
      icon: require('../../assets/GameModeIcons/gem_grab_icon.png')
    },
    {
      name: currentGameData.heist.mode?.name || "ホットゾーン＆強奪",
      currentMap: currentGameData.heist.map,
      updateTime: 23,
      color: () => {
        switch (currentGameData.heist.mode?.name) {
          case "強奪":
            return "#FF69B4";
          case "ホットゾーン":
            return "#ff7f7f";
          default:
            return "#FF69B4";
        }
      },
      isRotating: true,
      icon: currentGameData.heist.mode?.icon || require('../../assets/GameModeIcons/heist_icon.png')
    },
    {
      name: "ブロストライカー",
      currentMap: currentGameData.brawlBall.map,
      updateTime: 17,
      color: "#cccccc",
      isRotating: true,
      icon: require('../../assets/GameModeIcons/brawl_ball_icon.png')
    },
    {
      name: currentGameData.brawlBall5v5.mode?.name || "5vs5ブロストライカー",
      currentMap: currentGameData.brawlBall5v5.map,
      updateTime: 17,
      color: () => {
        switch (currentGameData.brawlBall5v5.mode?.name) {
          case "5vs5ブロストライカー":
            return "#cccccc";
          case "5vs5殲滅":
            return "#e95295";
          default:
            return "#d3d3d3";
        }
      },
      isRotating: true,
      icon: currentGameData.brawlBall5v5.mode?.icon || require('../../assets/GameModeIcons/brawl_ball_icon.png')
    },
    {
      name: currentGameData.duel.mode?.name || "デュエル＆殲滅＆賞金稼ぎ",
      currentMap: currentGameData.duel.map,
      updateTime: 23,
      color: () => {
        switch (currentGameData.duel.mode?.name) {
          case "賞金稼ぎ":
            return "#00ccff";
          case "殲滅":
            return "#e95295";
          case "デュエル":
            return "#FF0000";
          default:
            return "#FF0000";
        }
      },
      isRotating: true,
      icon: currentGameData.duel.mode?.icon || require('../../assets/GameModeIcons/bounty_icon.png')
    },
    {
      name: "ノックアウト",
      currentMap: currentGameData.knockout.map,
      updateTime: 11,
      color: "#FFA500",
      icon: require('../../assets/GameModeIcons/knock_out_icon.png')
    }
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>ブロスタ マップ情報</Text>
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
              <TouchableOpacity 
                style={styles.todayButton} 
                onPress={() => setSelectedDate(new Date())}>
                <Text style={styles.todayButtonText}>Today</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modeGrid}>
              {modes.map((mode, index) => (
                <View key={index} style={styles.modeCard}>
                  <View style={styles.modeHeader}>
                    <View style={[styles.modeTag, { 
                      backgroundColor: typeof mode.color === 'function' ? mode.color() : mode.color 
                    }]}>
                      <Image source={mode.icon} style={styles.modeIcon} />
                      <Text style={styles.modeTagText}>{mode.name}</Text>
                    </View>
                  </View>
                  {isCurrentDate(selectedDate) && (
                    <Text style={styles.updateTime}>
                      更新まで {formatTimeUntilUpdate(mode)}
                    </Text>
                  )}
                  <TouchableOpacity 
                    style={styles.mapContent}
                    onPress={() => handleMapClick(mode)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.mapName}>{mode.currentMap}</Text>
                    <Image 
                      source={mapImages[mode.currentMap]}
                      style={styles.mapImage}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        {!isAdFree && <BannerAdComponent />}

        {screenStack.map((screen, index) => (
          index > 0 && (
            <SettingsScreen
              key={`${screen.type}-${screen.zIndex}`}
              screen={screen}
              onClose={goBack}
              isAdFree={isAdFree}
              setIsAdFree={setIsAdFree}
              isRewardedAdReady={isRewardedAdReady}
              rewarded={rewarded}
              adService={adService}
              mapDetailProps={mapDetailProps}
              onCharacterPress={handleCharacterPress}
            />
          )
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
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
  modeContainer: {
    padding: 8,
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
  todayButton: {
    backgroundColor: '#21A0DB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 16,
  },
  todayButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  modeCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    padding: 12,
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
    marginBottom: 8,
  },
  modeTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  modeIcon: {
    width: 20,
    height: 20,
    marginRight: 4,
  },
  modeTagText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  updateTime: {
    color: '#666',
    fontSize: 12,
    marginBottom: 4,
  },
  mapContent: {
    flexDirection: 'column',
    padding: 8,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  mapName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  mapImage: {
    width: '100%',
    height: 80,
    borderRadius: 8,
  }
});

export default Home;