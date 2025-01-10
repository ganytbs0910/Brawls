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
  AppState
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
  getCurrentMode, 
  getMapForDate 
} from '../utils/gameData';
import AdMobService from '../services/AdMobService';
import SettingsScreen from './SettingsScreen';
import { MapDetail, GameMode, ScreenType, ScreenState } from '../types';
import { getMapDetails } from '../data/mapDetails';

type RankingsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const SCREEN_WIDTH = Dimensions.get('window').width;

const Home: React.FC = () => {
  const navigation = useNavigation<RankingsScreenNavigationProp>();
  const [screenStack, setScreenStack] = useState<ScreenState[]>([
    { type: 'home', translateX: new Animated.Value(0), zIndex: 0 }
  ]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isRewardedAdReady, setIsRewardedAdReady] = useState(false);
  const [isAdFree, setIsAdFree] = useState(false);
  const [mapDetailProps, setMapDetailProps] = useState<MapDetail | null>(null);

  const adService = useRef<AdMobService | null>(null);

  const rewarded = useRef(
    RewardedAd.createForAdRequest(AD_CONFIG.IOS_REWARDED_ID, {
      requestNonPersonalizedAdsOnly: true,
      keywords: ['game', 'mobile game'],
    })
  ).current;

  // 次の更新時刻を計算する関数
  const getNextUpdateTime = (currentTime: Date, modes: any[]): Date => {
    const now = new Date(currentTime);
    let nextUpdate = new Date(now);
    nextUpdate.setDate(nextUpdate.getDate() + 1);

    modes.forEach(mode => {
      const updateTime = new Date(now);
      updateTime.setHours(mode.updateTime, 0, 0, 0);
      
      if (updateTime > now && updateTime < nextUpdate) {
        nextUpdate = updateTime;
      }
    });

    return nextUpdate;
  };

  // マップ更新のタイマー管理
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let minuteUpdateId: NodeJS.Timeout;

    const scheduleNextUpdate = () => {
      const now = new Date();
      const nextUpdate = getNextUpdateTime(now, modes);
      const timeUntilUpdate = nextUpdate.getTime() - now.getTime();

      // 次の更新までタイマーをセット
      timeoutId = setTimeout(() => {
        setSelectedDate(new Date());
        setCurrentTime(new Date());
        // 次の更新をスケジュール
        scheduleNextUpdate();
      }, timeUntilUpdate);

      // 残り時間表示用の更新（1分ごと）
      minuteUpdateId = setInterval(() => {
        setCurrentTime(new Date());
      }, 60000);
    };

    // 初期スケジュール設定
    scheduleNextUpdate();

    // クリーンアップ
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (minuteUpdateId) clearInterval(minuteUpdateId);
    };
  }, []);

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
    const setupBackgroundUpdate = async () => {
      try {
        await AsyncStorage.setItem('lastUpdateCheck', new Date().toISOString());
        
        const handleAppStateChange = async (nextAppState: string) => {
          if (nextAppState === 'active') {
            const lastCheck = await AsyncStorage.getItem('lastUpdateCheck');
            const now = new Date();
            const lastCheckDate = lastCheck ? new Date(lastCheck) : new Date(0);
            
            modes.forEach(mode => {
              const updateTime = new Date(lastCheckDate);
              updateTime.setHours(mode.updateTime, 0, 0, 0);
              
              if (updateTime > lastCheckDate && updateTime <= now) {
                setSelectedDate(new Date());
              }
            });
            
            await AsyncStorage.setItem('lastUpdateCheck', now.toISOString());
          }
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);
        return () => {
          subscription.remove();
        };
      } catch (error) {
        console.error('Failed to setup background update:', error);
      }
    };

    setupBackgroundUpdate();
  }, []);

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

  const getCurrentModeName = (modeType: string, date: Date) => {
    const mode = getCurrentMode(modeType, date);
    return mode?.name;
  };

  const formatTimeUntilUpdate = (mode: any) => {
    const now = new Date();
    const updateTime = new Date(now);
    updateTime.setHours(mode.updateTime, 0, 0, 0);
    
    if (updateTime <= now) {
      updateTime.setDate(updateTime.getDate() + 1);
    }

    const diff = updateTime.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours === 0) {
      return `${minutes}分`;
    }
    return `${hours}時間${minutes}分`;
  };

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
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
      color: "#99ff66",
      icon: require('../../assets/GameModeIcons/showdown_icon.png')
    },
    {
      name: "エメラルドハント",
      currentMap: currentMaps.emeraldHunt,
      updateTime: 11,
      color: "#DA70D6",
      icon: require('../../assets/GameModeIcons/gem_grab_icon.png')
    },
    {
      name: getCurrentModeName("heist", selectedDate) || "ホットゾーン＆強奪",
      currentMap: currentMaps.heist,
      updateTime: 23,
      color: () => {
        const currentMode = getCurrentMode("heist", selectedDate);
        switch (currentMode?.name) {
          case "強奪":
            return "#FF69B4";
          case "ホットゾーン":
            return "#ff7f7f";
          default:
            return "#FF69B4";
        }
      },
      isRotating: true,
      icon: getCurrentMode("heist", selectedDate)?.icon || require('../../assets/GameModeIcons/heist_icon.png')
    },
    {
      name: "ブロストライカー",
      currentMap: currentMaps.brawlBall,
      updateTime: 17,
      color: "#cccccc",
      isRotating: true,
      icon: require('../../assets/GameModeIcons/brawl_ball_icon.png')
    },
    {
      name: getCurrentModeName("brawlBall5v5", selectedDate) || "5vs5ブロストライカー",
      currentMap: currentMaps.brawlBall5v5,
      updateTime: 17,
      color: () => {
        const currentMode = getCurrentMode("brawlBall5v5", selectedDate);
        switch (currentMode?.name) {
          case "5vs5ブロストライカー":
            return "#cccccc";
          case "5vs5殲滅":
            return "#e95295";
          default:
            return "#d3d3d3";
        }
      },
      isRotating: true,
      icon: getCurrentMode("brawlBall5v5", selectedDate)?.icon || require('../../assets/GameModeIcons/brawl_ball_icon.png')
    },
    {
      name: getCurrentModeName("duel", selectedDate) || "デュエル＆殲滅＆賞金稼ぎ",
      currentMap: currentMaps.duel,
      updateTime: 17,
      color: () => {
        const currentMode = getCurrentMode("duel", selectedDate);
        switch (currentMode?.name) {
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
      icon: getCurrentMode("duel", selectedDate)?.icon || require('../../assets/GameModeIcons/bounty_icon.png')
    },
    {
      name: "ノックアウト",
      currentMap: currentMaps.knockout,
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
                {selectedDate.getDate() === new Date().getDate() && (
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