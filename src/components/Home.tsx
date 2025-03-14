import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
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
  Platform,
  TextInput
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../App';
import { DailyTip } from '../components/DailyTip';
import MapDetailScreen from '../components/MapDetailScreen';
import { RewardedAd, RewardedAdEventType } from 'react-native-google-mobile-ads';
import { AD_CONFIG } from '../config/AdConfig';
import { useHomeTranslation } from '../i18n/home';
import { useMapDetailTranslation } from '../i18n/mapDetail';
import AdMobService from '../services/AdMobService';
import SettingsScreen from './SettingsScreen';
import { MapDetail, GameMode, ScreenType, ScreenState } from '../types';
import { GAME_MODES, getLocalizedModeName, generateCombinedModeTranslation } from '../data/modeData';
import { getMapDetails } from '../data/mapDetails';
import { 
  initializeMapData, 
  getMapData, 
  mapImages, 
  getGameDataForDateTime, 
  getAvailableMapsForMode,
  getGameModeForMap,
  filterMaps
} from '../data/mapDataService';
import { UpdateNotification } from '../components/UpdateNotification';

type RankingsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const SCREEN_WIDTH = Dimensions.get('window').width;
const UPDATE_HOURS = [5, 11, 17, 23];

// Notification message constant - Easy to update
const UPDATE_NOTIFICATION_MESSAGE = "大型アップデートによりマップ周期が変更されました。マップ周期が判明し次第修正します。";

const useMapUpdateTimer = (updateHours: number[]) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const getNextUpdateTime = (currentTime: Date): Date => {
      const now = new Date(currentTime);
      let nextUpdate = new Date(now);
      nextUpdate.setDate(nextUpdate.getDate() + 1);
      nextUpdate.setHours(5, 0, 0, 0);
    
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

      timeoutId = setTimeout(() => {
        const newTime = new Date();
        setCurrentTime(newTime);
        
        setTimeout(() => {
          scheduleNextUpdate();
        }, 1000);
      }, timeUntilUpdate);
    };

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
  const { t } = useHomeTranslation();
  const { currentLanguage } = useMapDetailTranslation();
  const currentTime = useMapUpdateTimer(UPDATE_HOURS);
  const navigation = useNavigation<RankingsScreenNavigationProp>();
  const [screenStack, setScreenStack] = useState<ScreenState[]>([
    { type: 'home', translateX: new Animated.Value(0), zIndex: 0 }
  ]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isRewardedAdReady, setIsRewardedAdReady] = useState(false);
  const [isAdFree, setIsAdFree] = useState(false);
  const [mapDetailProps, setMapDetailProps] = useState<MapDetail | null>(null);
  const [isMapDataInitialized, setIsMapDataInitialized] = useState(false);
  const [showNotification, setShowNotification] = useState(true);
  
  // 一覧表示のデフォルト値をtrueに設定
  const [isListView, setIsListView] = useState(true);
  
  // 検索とフィルター用の状態
  const [searchText, setSearchText] = useState('');
  const [selectedModes, setSelectedModes] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

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

  const getLocalizedMapName = useCallback((mapId: string) => {
    const mapData = getMapData(mapId);
    if (!mapData) return mapId;

    switch (currentLanguage) {
      case 'en':
        return mapData.nameEn;
      case 'ko':
        return mapData.nameKo;
      case 'es':
        return mapData.nameEs;
      case 'ar':
        return mapData.nameAr;
      case 'fr':
        return mapData.nameFr;
      case 'zhTw':
        return mapData.nameZhTw;
      default:
        return mapData.name;  // Japanese name
    }
  }, [currentLanguage]);

  useEffect(() => {
    const initData = async () => {
      try {
        const data = await initializeMapData();
        setIsMapDataInitialized(true);
      } catch (error) {
        console.error('Failed to initialize map data:', error);
      }
    };
    
    initData();
  }, []);

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

  // Add effect to check if notification should be shown (persisting notification state)
  useEffect(() => {
    const checkNotificationState = async () => {
      try {
        const notificationState = await AsyncStorage.getItem('mapUpdateNotificationShown');
        if (notificationState === 'false') {
          setShowNotification(false);
        }
      } catch (error) {
        console.error('Failed to check notification state:', error);
      }
    };

    checkNotificationState();
  }, []);

  // Effect to load the saved view mode preference
  useEffect(() => {
    const loadViewPreference = async () => {
      try {
        const savedViewMode = await AsyncStorage.getItem('viewModePreference');
        if (savedViewMode !== null) {
          setIsListView(savedViewMode === 'list');
        }
      } catch (error) {
        console.error('Failed to load view mode preference:', error);
      }
    };

    loadViewPreference();
  }, []);

  // Effect to save the view mode preference when it changes
  useEffect(() => {
    const saveViewPreference = async () => {
      try {
        await AsyncStorage.setItem('viewModePreference', isListView ? 'list' : 'grid');
      } catch (error) {
        console.error('Failed to save view mode preference:', error);
      }
    };

    saveViewPreference();
  }, [isListView]);

  // Add function to handle closing the notification and save the state
  const handleCloseNotification = async () => {
    setShowNotification(false);
    try {
      await AsyncStorage.setItem('mapUpdateNotificationShown', 'false');
    } catch (error) {
      console.error('Failed to save notification state:', error);
    }
  };

  // Function to toggle view mode
  const toggleViewMode = () => {
    setIsListView(prev => !prev);
  };

  // 検索テキストを処理する関数
  const handleSearchChange = (text) => {
    setSearchText(text);
  };

  // モードフィルターを切り替える関数
  const toggleModeFilter = (mode) => {
    if (selectedModes.includes(mode)) {
      setSelectedModes(selectedModes.filter(m => m !== mode));
    } else {
      setSelectedModes([...selectedModes, mode]);
    }
  };

  // すべてのフィルターをクリアする関数
  const clearFilters = () => {
    setSearchText('');
    setSelectedModes([]);
  };

  const renderScreen = (screen: ScreenState) => {
    switch (screen.type) {
      case 'settings':
        return (
          <Animated.View
            style={[
              styles.overlayScreen,
              {
                transform: [{ translateX: screen.translateX }],
                zIndex: screen.zIndex,
              },
            ]}
          >
            <SettingsScreen
              onClose={goBack}
              isAdFree={isAdFree}
              setIsAdFree={setIsAdFree}
              isRewardedAdReady={isRewardedAdReady}
              rewarded={rewarded}
              adService={adService}
            />
          </Animated.View>
        );
      case 'mapDetail':
        return (
          <Animated.View
            style={[
              styles.overlayScreen,
              {
                transform: [{ translateX: screen.translateX }],
                zIndex: screen.zIndex,
              },
            ]}
          >
            {mapDetailProps && (
              <MapDetailScreen
                mapName={mapDetailProps.mapName}
                modeName={mapDetailProps.modeName}
                modeColor={typeof mapDetailProps.modeColor === 'function' 
                  ? mapDetailProps.modeColor() 
                  : mapDetailProps.modeColor}
                modeIcon={mapDetailProps.modeIcon}
                onClose={goBack}
                mapImage={mapDetailProps.mapImage}
                onCharacterPress={handleCharacterPress}
              />
            )}
          </Animated.View>
        );
      default:
        return null;
    }
  };

  const handleMapClick = (mode: any) => {
    if (!isMapDataInitialized) {
      console.warn('Map data is not initialized yet');
      return;
    }

    const currentMapData = getMapData(mode.currentMap);
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
      console.log('Current mode:', mode);
      console.log('Available maps:', getMapData(mode.currentMap));
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

    setScreenStack(prev => {
      const newStack = [...prev, newScreen];
      return newStack;
    });

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

  const isSameDate = (date1: Date, date2: Date): boolean => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const isCurrentDate = (date: Date) => {
    const now = new Date();
    return isSameDate(date, now);
  };

  const getModeUpdateTime = (gameMode: keyof GameMaps): number => {
    switch (gameMode) {
      case 'battleRoyale': return 5;
      case 'gemGrab': return 11;
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
      return getGameDataForDateTime(gameMode, currentTime, getModeUpdateTime(gameMode));
    } else {
      const daysDiff = Math.floor((selectedDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      const nextDayOffset = daysDiff * 24 + 24;
      
      return getGameDataForDateTime(
        gameMode,
        now,
        getModeUpdateTime(gameMode),
        nextDayOffset
      );
    }
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

    return t.updateTime.timeUntilUpdate(hours, minutes);
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
      return t.dateSelector.today;
    } else if (isSameDate(date, yesterday)) {
      return t.dateSelector.yesterday;
    } else if (isSameDate(date, tomorrow)) {
      return t.dateSelector.tomorrow;
    } else {
      return t.dateSelector.monthDay(date.getMonth() + 1, date.getDate());
    }
  };

  // 全モードのマップデータを取得する関数
  const getAllGameData = () => {
    // 各ゲームモードの全マップデータを取得
    const battleRoyaleMaps = getAllMapsForMode("battleRoyale");
    const gemGrabMaps = getAllMapsForMode("gemGrab");
    const heistMaps = getAllMapsForMode("heist");
    const brawlBallMaps = getAllMapsForMode("brawlBall");
    const brawlBall5v5Maps = getAllMapsForMode("brawlBall5v5");
    const knockoutMaps = getAllMapsForMode("knockout");
    const duelMaps = getAllMapsForMode("duel");
    
    // 全マップデータを統合
    return {
      battleRoyale: battleRoyaleMaps,
      gemGrab: gemGrabMaps,
      heist: heistMaps,
      brawlBall: brawlBallMaps,
      brawlBall5v5: brawlBall5v5Maps,
      knockout: knockoutMaps,
      duel: duelMaps
    };
  };

  // 特定のモードの全マップを取得する関数
  const getAllMapsForMode = (gameMode: keyof GameMaps) => {
    // 実装例: 
    // データサービスから特定のモードのすべてのマップデータを取得
    const allMapsForMode = getAvailableMapsForMode(gameMode);
    
    return allMapsForMode.map(mapId => {
      return {
        map: mapId,
        mode: GAME_MODES[getGameModeForMap(mapId) as keyof typeof GAME_MODES]
      };
    });
  };

  // モード情報を取得する関数
  const getModeInfo = (gameMode: keyof GameMaps) => {
    switch (gameMode) {
      case 'battleRoyale':
        return {
          name: t.modes.getModeName('BATTLE_ROYALE'),
          updateTime: 5,
          color: GAME_MODES.BATTLE_ROYALE.color || "#99ff66",
          icon: GAME_MODES.BATTLE_ROYALE.icon
        };
      case 'gemGrab':
        return {
          name: t.modes.getModeName('GEM_GRAB'),
          updateTime: 11,
          color: GAME_MODES.GEM_GRAB.color || "#DA70D6",
          icon: GAME_MODES.GEM_GRAB.icon
        };
      case 'heist':
        return {
          name: t.modes.getModeName('HEIST'),
          updateTime: 23,
          color: GAME_MODES.HEIST.color || "#FF69B4",
          icon: GAME_MODES.HEIST.icon
        };
      case 'brawlBall':
        return {
          name: t.modes.getModeName('BRAWL_BALL'),
          updateTime: 17,
          color: GAME_MODES.BRAWL_BALL.color || "#cccccc",
          icon: GAME_MODES.BRAWL_BALL.icon
        };
      case 'brawlBall5v5':
        return {
          name: t.modes.getModeName('BRAWL_BALL_5V5'),
          updateTime: 17,
          color: GAME_MODES.BRAWL_BALL_5V5.color || "#d3d3d3",
          icon: GAME_MODES.BRAWL_BALL_5V5.icon
        };
      case 'knockout':
        return {
          name: t.modes.getModeName('KNOCKOUT'),
          updateTime: 11,
          color: GAME_MODES.KNOCKOUT.color || "#FFA500",
          icon: GAME_MODES.KNOCKOUT.icon
        };
      case 'duel':
        return {
          name: t.modes.getModeName('DUEL'),
          updateTime: 23,
          color: GAME_MODES.DUEL.color || "#FF0000",
          icon: GAME_MODES.DUEL.icon
        };
      default:
        return {
          name: "Unknown Mode",
          updateTime: 5,
          color: "#cccccc",
          icon: GAME_MODES.BATTLE_ROYALE.icon
        };
    }
  };

  // 「一覧」モード（isListView = true）用の全マップリスト生成関数
  const generateAllMapsList = () => {
    const allGameData = getAllGameData();
    let fullMapList = [];
    
    // すべてのモードとマップを一つのリストに統合
    for (const [gameMode, maps] of Object.entries(allGameData)) {
      const modeInfo = getModeInfo(gameMode as keyof GameMaps);
      
      maps.forEach(mapData => {
        fullMapList.push({
          name: modeInfo.name,
          currentMap: mapData.map,
          updateTime: modeInfo.updateTime,
          color: modeInfo.color,
          icon: modeInfo.icon
        });
      });
    }
    
    return fullMapList;
  };

  // 「本日」モード（isListView = false）用の選択された日付のマップリスト生成関数
  const generateSelectedDateMapsList = () => {
    // 選択された日付のマップデータを取得
    return [
      {
        name: t.modes.getModeName('BATTLE_ROYALE'),
        currentMap: getGameDataForSelectedDate("battleRoyale").map,
        updateTime: 5,
        color: GAME_MODES.BATTLE_ROYALE.color || "#99ff66",
        icon: GAME_MODES.BATTLE_ROYALE.icon
      },
      {
        name: t.modes.getModeName('GEM_GRAB'),
        currentMap: getGameDataForSelectedDate("gemGrab").map,
        updateTime: 11,
        color: GAME_MODES.GEM_GRAB.color || "#DA70D6",
        icon: GAME_MODES.GEM_GRAB.icon
      },
      {
        // heistモードは回転するモードを考慮
        name: (() => {
          const heistData = getGameDataForSelectedDate("heist");
          if (heistData.mode?.name) {
            return t.modes.getModeName(heistData.mode.name as keyof typeof GAME_MODES);
          }
          return t.modes.getCombinedModeName(['HOT_ZONE', 'HEIST']);
        })(),
        currentMap: getGameDataForSelectedDate("heist").map,
        updateTime: 23,
        color: (() => {
          const heistData = getGameDataForSelectedDate("heist");
          const modeName = heistData.mode?.name;
          if (modeName) {
            return GAME_MODES[modeName]?.color || "#FF69B4";
          }
          return "#FF69B4";
        })(),
        isRotating: true,
        icon: (() => {
          const heistData = getGameDataForSelectedDate("heist");
          return heistData.mode?.icon || GAME_MODES.HEIST.icon;
        })()
      },
      {
        name: t.modes.getModeName('BRAWL_BALL'),
        currentMap: getGameDataForSelectedDate("brawlBall").map,
        updateTime: 17,
        color: GAME_MODES.BRAWL_BALL.color || "#cccccc",
        isRotating: true,
        icon: GAME_MODES.BRAWL_BALL.icon
      },
      {
        // brawlBall5v5モードは回転するモードを考慮
        name: (() => {
          const bb5v5Data = getGameDataForSelectedDate("brawlBall5v5");
          if (bb5v5Data.mode?.name) {
            return t.modes.getModeName(bb5v5Data.mode.name as keyof typeof GAME_MODES);
          }
          return t.modes.getModeName('BRAWL_BALL_5V5');
        })(),
        currentMap: getGameDataForSelectedDate("brawlBall5v5").map,
        updateTime: 17,
        color: (() => {
          const bb5v5Data = getGameDataForSelectedDate("brawlBall5v5");
          const modeName = bb5v5Data.mode?.name;
          if (modeName) {
            return GAME_MODES[modeName]?.color || "#cccccc";
          }
          return "#d3d3d3";
        })(),
        isRotating: true,
        icon: (() => {
          const bb5v5Data = getGameDataForSelectedDate("brawlBall5v5");
          return bb5v5Data.mode?.icon || GAME_MODES.BRAWL_BALL_5V5.icon;
        })()
      },
      {
        // duelモードは回転するモードを考慮
        name: (() => {
          const duelData = getGameDataForSelectedDate("duel");
          if (duelData.mode?.name) {
            return t.modes.getModeName(duelData.mode.name as keyof typeof GAME_MODES);
          }
          return t.modes.getCombinedModeName(['DUEL', 'WIPEOUT', 'BOUNTY']);
        })(),
        currentMap: getGameDataForSelectedDate("duel").map,
        updateTime: 23,
        color: (() => {
          const duelData = getGameDataForSelectedDate("duel");
          const modeName = duelData.mode?.name;
          if (modeName) {
            return GAME_MODES[modeName]?.color || "#FF0000";
          }
          return "#FF0000";
        })(),
        isRotating: true,
        icon: (() => {
          const duelData = getGameDataForSelectedDate("duel");
          return duelData.mode?.icon || GAME_MODES.BOUNTY.icon;
        })()
      },
      {
        name: t.modes.getModeName('KNOCKOUT'),
        currentMap: getGameDataForSelectedDate("knockout").map,
        updateTime: 11,
        color: GAME_MODES.KNOCKOUT.color || "#FFA500",
        icon: GAME_MODES.KNOCKOUT.icon
      }
    ];
  };

  // 一覧表示用の拡張されたリスト生成
  const generateFullMapList = () => {
    // isListView = true の場合は全マップ、false の場合は選択された日付のマップを返す
    return isListView ? generateAllMapsList() : generateSelectedDateMapsList();
  };

  const currentGameData = {
    battleRoyale: getGameDataForSelectedDate("battleRoyale"),
    gemGrab: getGameDataForSelectedDate("gemGrab"),
    heist: getGameDataForSelectedDate("heist"),
    brawlBall: getGameDataForSelectedDate("brawlBall"),
    brawlBall5v5: getGameDataForSelectedDate("brawlBall5v5"),
    knockout: getGameDataForSelectedDate("knockout"),
    duel: getGameDataForSelectedDate("duel")
  };

  const modes = useMemo(() => [
  {
    name: t.modes.getModeName('BATTLE_ROYALE'),
    currentMap: currentGameData.battleRoyale.map,
    updateTime: 5,
    color: GAME_MODES.BATTLE_ROYALE.color || "#99ff66",
    icon: GAME_MODES.BATTLE_ROYALE.icon
  },
  {
    name: t.modes.getModeName('GEM_GRAB'),
    currentMap: currentGameData.gemGrab.map,
    updateTime: 11,
    color: GAME_MODES.GEM_GRAB.color || "#DA70D6",
    icon: GAME_MODES.GEM_GRAB.icon
  },
  {
    name: currentGameData.heist.mode?.name 
      ? t.modes.getModeName(currentGameData.heist.mode.name as keyof typeof GAME_MODES)
      : t.modes.getCombinedModeName(['HOT_ZONE', 'HEIST']),
    currentMap: currentGameData.heist.map,
    updateTime: 23,
    color: () => {
      const modeName = currentGameData.heist.mode?.name;
      if (modeName) {
        return GAME_MODES[modeName]?.color || "#FF69B4";
      }
      return "#FF69B4";
    },
    isRotating: true,
    icon: currentGameData.heist.mode?.icon || GAME_MODES.HEIST.icon
  },
  {
    name: t.modes.getModeName('BRAWL_BALL'),
    currentMap: currentGameData.brawlBall.map,
    updateTime: 17,
    color: GAME_MODES.BRAWL_BALL.color || "#cccccc",
    isRotating: true,
    icon: GAME_MODES.BRAWL_BALL.icon
  },
  {
    name: currentGameData.brawlBall5v5.mode?.name 
      ? t.modes.getModeName(currentGameData.brawlBall5v5.mode.name as keyof typeof GAME_MODES)
      : t.modes.getModeName('BRAWL_BALL_5V5'),
    currentMap: currentGameData.brawlBall5v5.map,
    updateTime: 17,
    color: () => {
      const modeName = currentGameData.brawlBall5v5.mode?.name;
      if (modeName) {
        return GAME_MODES[modeName]?.color || "#cccccc";
      }
      return "#d3d3d3";
    },
    isRotating: true,
    icon: currentGameData.brawlBall5v5.mode?.icon || GAME_MODES.BRAWL_BALL_5V5.icon
  },
  {
    name: currentGameData.duel.mode?.name 
      ? t.modes.getModeName(currentGameData.duel.mode.name as keyof typeof GAME_MODES)
      : t.modes.getCombinedModeName(['DUEL', 'WIPEOUT', 'BOUNTY']),
    currentMap: currentGameData.duel.map,
    updateTime: 23,
    color: () => {
      const modeName = currentGameData.duel.mode?.name;
      if (modeName) {
        return GAME_MODES[modeName]?.color || "#FF0000";
      }
      return "#FF0000";
    },
    isRotating: true,
    icon: currentGameData.duel.mode?.icon || GAME_MODES.BOUNTY.icon
  },
  {
    name: t.modes.getModeName('KNOCKOUT'),
    currentMap: currentGameData.knockout.map,
    updateTime: 11,
    color: GAME_MODES.KNOCKOUT.color || "#FFA500",
    icon: GAME_MODES.KNOCKOUT.icon
  }
  ], [currentGameData, t.modes]);

  // 一覧表示用の全マップリスト
  const fullMapList = useMemo(() => {
    return generateFullMapList();
  }, [isListView, selectedDate, currentGameData, t.modes]);

  // フィルターを適用したマップリスト
  const filteredMapList = useMemo(() => {
    return filterMaps(fullMapList, {
      searchText,
      modes: selectedModes
    });
  }, [fullMapList, searchText, selectedModes]);

  // 検索・フィルターセクションを追加
  const renderSearchAndFilters = () => (
    <View style={styles.searchFilterContainer}>
      {/* 検索バー */}
      <View style={styles.searchBar}>
        <Image 
          source={require('../../assets/AppIcon/analysis.png')} 
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder={t.searchFilter.searchPlaceholder}
          value={searchText}
          onChangeText={handleSearchChange}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <Image 
              source={require('../../assets/AppIcon/analysis.png')} 
              style={styles.clearIcon}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {/* フィルターボタン */}
      <TouchableOpacity 
        style={styles.filterButton} 
        onPress={() => setShowFilters(!showFilters)}
      >
        <Image 
          source={require('../../assets/AppIcon/analysis.png')} 
          style={[styles.filterIcon, selectedModes.length > 0 && styles.filterActive]} 
        />
      </TouchableOpacity>
      
      {/* フィルターパネル */}
      {showFilters && (
        <View style={styles.filterPanel}>
          <Text style={styles.filterTitle}>{t.searchFilter.filterByMode}</Text>
          <View style={styles.modeFilters}>
            {Object.keys(GAME_MODES).map((mode) => (
              <TouchableOpacity
                key={mode}
                style={[
                  styles.modeFilterChip,
                  selectedModes.includes(mode) && { backgroundColor: GAME_MODES[mode].color || '#cccccc' }
                ]}
                onPress={() => toggleModeFilter(mode)}
              >
                <Image source={GAME_MODES[mode].icon} style={styles.modeFilterIcon} />
                <Text style={[
                  styles.modeFilterText,
                  selectedModes.includes(mode) && { color: '#fff' }
                ]}>
                  {t.modes.getModeName(mode)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.clearFiltersButton} onPress={clearFilters}>
            <Text style={styles.clearFiltersText}>{t.searchFilter.clearFilters}</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* 結果カウンター */}
      <View style={styles.resultsCounter}>
        <Text style={styles.resultsText}>
          {filteredMapList.length} {t.searchFilter.resultsFound}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{t.header.title}</Text>
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
          {/* 通知バナー */}
          <UpdateNotification 
            visible={showNotification}
            onClose={handleCloseNotification}
            message={UPDATE_NOTIFICATION_MESSAGE}
          />
          
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
                <Text style={styles.todayButtonText}>{t.dateSelector.today}</Text>
              </TouchableOpacity>
              {/* 表示切り替えボタン */}
              <TouchableOpacity 
                style={[styles.viewToggleButton, isListView ? styles.viewToggleButtonActive : {}]} 
                onPress={toggleViewMode}>
                <Text style={styles.viewToggleButtonText}>
                  {isListView ? t.viewToggle.grid : t.viewToggle.list}
                </Text>
              </TouchableOpacity>
            </View>
            
            {/* 検索・フィルターセクションを常に表示 */}
            {renderSearchAndFilters()}
            
            {/* マップ一覧（統一された一覧表示形式） */}
            <View style={styles.modeList}>
              {filteredMapList.length > 0 ? (
                filteredMapList.map((mode, index) => (
                  <TouchableOpacity 
                    key={index}
                    style={styles.modeListItem}
                    onPress={() => handleMapClick(mode)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.modeListTag, { 
                      backgroundColor: typeof mode.color === 'function' ? mode.color() : mode.color 
                    }]}>
                      <Image source={mode.icon} style={styles.modeListIcon} />
                    </View>
                    <View style={styles.modeListContent}>
                      <Text style={styles.modeListName}>{mode.name}</Text>
                      <Text style={styles.modeListMapName}>
                        {getLocalizedMapName(mode.currentMap)}
                      </Text>
                      {isCurrentDate(selectedDate) && (
                        <Text style={styles.modeListUpdateTime}>
                          {formatTimeUntilUpdate(mode)}
                        </Text>
                      )}
                    </View>
                    <Image 
                      source={mapImages[mode.currentMap]}
                      style={styles.modeListMapImage}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.noResultsContainer}>
                  <Text style={styles.noResultsText}>{t.searchFilter.noResults}</Text>
                  <TouchableOpacity style={styles.clearFiltersButton} onPress={clearFilters}>
                    <Text style={styles.clearFiltersText}>{t.searchFilter.clearFilters}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </ScrollView>

        {screenStack.map((screen, index) => (
          <React.Fragment key={`${screen.type}-${index}`}>
            {index > 0 && renderScreen(screen)}
          </React.Fragment>
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
    flex: 1,
    padding: 8,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
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
  // 表示切り替えボタン用のスタイル
  viewToggleButton: {
    backgroundColor: '#21A0DB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 16,
  },
  viewToggleButtonActive: {
    backgroundColor: '#1880B0',
  },
  viewToggleButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  // グリッドビュースタイル（既存）
  modeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 16,
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
    flex: 1,
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
    marginBottom: 8,
  },
  
  // 検索・フィルター関連のスタイル
  searchFilterContainer: {
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  searchBar: {
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: '#666',
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: '#333',
  },
  clearIcon: {
    width: 16,
    height: 16,
    tintColor: '#666',
  },
  filterButton: {
    position: 'absolute',
    right: 16,
    top: 8,
    padding: 4,
  },
  filterIcon: {
    width: 24,
    height: 24,
    tintColor: '#666',
  },
  filterActive: {
    tintColor: '#21A0DB',
  },
  filterPanel: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  modeFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  modeFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  modeFilterIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  modeFilterText: {
    fontSize: 12,
    color: '#333',
  },
  clearFiltersButton: {
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#21A0DB',
  },
  clearFiltersText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  resultsCounter: {
    marginTop: 8,
    marginBottom: 8,
  },
  resultsText: {
    fontSize: 12,
    color: '#666',
  },
  noResultsContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  
  // 一覧表示の改良スタイル
  modeList: {
    flexDirection: 'column',
    paddingBottom: 16,
  },
  modeListItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    alignItems: 'center',
  },
  modeListTag: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  modeListIcon: {
    width: 24,
    height: 24,
  },
  modeListContent: {
    flex: 1,
    paddingRight: 10,
  },
  modeListName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  modeListMapName: {
    fontSize: 14,
    color: '#333',
    marginTop: 2,
  },
  modeListUpdateTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  modeListMapImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
  },
  overlayScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
  }
});

export default Home;