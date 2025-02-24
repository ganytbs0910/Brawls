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
  Platform
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
import { initializeMapData, getMapData, mapImages, getGameDataForDateTime } from '../data/mapDataService';

type RankingsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const SCREEN_WIDTH = Dimensions.get('window').width;
const UPDATE_HOURS = [5, 11, 17, 23];

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
                      {formatTimeUntilUpdate(mode)}
                    </Text>
                  )}
                  <TouchableOpacity 
                    style={styles.mapContent}
                    onPress={() => handleMapClick(mode)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.mapName}>
                      {getLocalizedMapName(mode.currentMap)}
                    </Text>
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
    paddingBottom: 16, // Add padding at the bottom
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
    flex: 1, // Add flex: 1 to ensure proper spacing
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
    marginBottom: 8, // Add margin at the bottom
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