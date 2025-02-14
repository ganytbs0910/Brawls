import React, { useState, useRef, useEffect } from 'react';
import {
  Vibration,
  SafeAreaView,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Animated,
  Dimensions,
  Platform,
  Alert,
  Linking,
  PanResponder,
  ScaledSize,
} from 'react-native';
import { getDeviceLanguage } from './utils/languageUtils';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppOpenAd } from 'react-native-google-mobile-ads';
import { AD_CONFIG } from './config/AdConfig';
import { useAppTranslation } from './i18n/app';

import BrawlStarsCompatibility from './components/BrawlStarsApp';
import TeamBoard from './components/TeamBoard';
import BrawlStarsRankings from './components/BrawlStarsRankings';
import CharacterDetails from './components/CharacterDetails';
import PickPrediction from './components/PickPrediction';
import Home from './components/Home';
import News from './components/News';
import Gacha from './components/Gacha';
import { BannerAdComponent } from './components/BannerAdComponent';

const { width, height: SCREEN_HEIGHT } = Dimensions.get('window');
const TAB_WIDTH = width / 6;

const SNAP_POINTS = {
  TOP: 0,
  MIDDLE: SCREEN_HEIGHT * 0.4,
  BOTTOM: SCREEN_HEIGHT * 0.95,
};

const APP_VERSION = Platform.select({
  ios: "1.31",
  android: "2.21",
});

interface UpdateInfo {
  currentVersion: string;
  message: string;
  storeUrl: string;
}

interface VersionResponse {
  ios: UpdateInfo;
  android: UpdateInfo;
}

export type RootStackParamList = {
  Main: undefined;
  Rankings: undefined;
  CharacterDetails: { characterName: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const appOpenAdUnitId = Platform.select({
  ios: AD_CONFIG.IOS_APP_OPEN_ID,
  android: AD_CONFIG.ANDROID_APP_OPEN_ID,
}) || '';

const appOpenAd = AppOpenAd.createForAdRequest(appOpenAdUnitId, {
  requestNonPersonalizedAdsOnly: true,
});

const getServerTime = async (): Promise<number> => {
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000;
  
  const TIME_SERVERS = [
    'https://worldtimeapi.org/api/timezone/Asia/Tokyo',
    'https://timeapi.io/api/Time/current/zone?timeZone=Asia/Tokyo',
    'https://www.timeapi.io/api/Time/current/zone?timeZone=Asia/Tokyo'
  ];

  const getFallbackTime = (): number => {
    const now = new Date();
    const jstDate = new Date(now.getTime() + (9 * 60 * 60 * 1000));
    return Math.floor(jstDate.getTime() / 1000);
  };

  const fetchWithRetry = async (url: string, retryCount: number = 0): Promise<number> => {
    try {
      const response = await fetch(url, {
        timeout: 5000,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'YourApp/1.0'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (url.includes('worldtimeapi.org')) {
        return Math.floor(new Date(data.datetime).getTime() / 1000);
      } else if (url.includes('timeapi.io')) {
        return Math.floor(new Date(data.dateTime).getTime() / 1000);
      }
      
      throw new Error('Unknown API format');

    } catch (error) {
      if (retryCount < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return fetchWithRetry(url, retryCount + 1);
      }
      throw error;
    }
  };

  for (const server of TIME_SERVERS) {
    try {
      return await fetchWithRetry(server);
    } catch (error) {
      continue;
    }
  }

  return getFallbackTime();
};

const getLastResetTime = (currentTimestamp: number): number => {
  const date = new Date(currentTimestamp * 1000);
  date.setHours(0, 0, 0, 0);
  return Math.floor(date.getTime() / 1000);
};

const SplitViewLayout = React.memo<{ 
  primary: React.ReactNode; 
}>(({ primary }) => {
  return (
    <View style={styles.container}>
      {primary}
    </View>
  );
});

const RankingsStack = ({ 
  isAdFree,
  onShowDetails 
}: { 
  isAdFree: boolean;
  onShowDetails: (content: React.ReactNode) => void;
}) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Rankings"
        component={(props) => (
          <BrawlStarsRankings 
            {...props} 
            isAdFree={isAdFree}
            onShowDetails={onShowDetails}
          />
        )}
      />
      <Stack.Screen
        name="CharacterDetails"
        component={(props) => (
          <CharacterDetails 
            {...props}
            onShowDetails={onShowDetails}
          />
        )}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#21A0DB',
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          }
        }}
      />
    </Stack.Navigator>
  );
};

const HomeStack = ({ 
  isAdFree,
  onShowDetails 
}: { 
  isAdFree: boolean;
  onShowDetails: (content: React.ReactNode) => void;
}) => {
  return (
    <NavigationContainer independent>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="Main"
          component={(props) => (
            <Home 
              {...props} 
              isAdFree={isAdFree}
              onShowDetails={onShowDetails}
            />
          )}
        />
        <Stack.Screen
          name="CharacterDetails"
          component={(props) => (
            <CharacterDetails 
              {...props}
              onShowDetails={onShowDetails}
            />
          )}
          options={{
            headerShown: true,
            headerStyle: {
              backgroundColor: '#21A0DB',
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            }
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const SlideOver = React.memo<{ children: React.ReactNode; onClose?: () => void }>(({
  children,
  onClose,
}) => {
  const pan = useRef(new Animated.ValueXY({ x: 0, y: SCREEN_HEIGHT })).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: 0,
          y: pan.y._value,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (_, gestureState) => {
        pan.setValue({ x: 0, y: gestureState.dy });
      },
      onPanResponderRelease: (_, gestureState) => {
        pan.flattenOffset();
        const currentPosition = pan.y._value;
        let targetPosition;

        if (Math.abs(gestureState.vy) > 0.5) {
          targetPosition = gestureState.vy > 0 ? SNAP_POINTS.BOTTOM : SNAP_POINTS.TOP;
        } else {
          const distances = Object.values(SNAP_POINTS).map(point =>
            Math.abs(currentPosition - point)
          );
          const minDistance = Math.min(...distances);
          targetPosition = Object.values(SNAP_POINTS)[distances.indexOf(minDistance)];
        }

        if (targetPosition === SNAP_POINTS.BOTTOM) {
          onClose?.();
        }

        Animated.spring(pan, {
          toValue: { x: 0, y: targetPosition },
          useNativeDriver: true,
          bounciness: 4,
          speed: 12,
        }).start();
      },
    })
  ).current;

  useEffect(() => {
    Animated.spring(pan, {
      toValue: { x: 0, y: SNAP_POINTS.MIDDLE },
      useNativeDriver: true,
      bounciness: 4,
      speed: 12,
    }).start();

    return () => {
      pan.stopAnimation();
    };
  }, []);

  return (
    <Animated.View
      style={[
        styles.slideOverContainer,
        {
          transform: [
            {
              translateY: pan.y,
            },
          ],
        },
      ]}
      {...panResponder.panHandlers}
    >
      <View style={styles.slideOverHandle} />
      <View style={styles.slideOverContent}>{children}</View>
    </Animated.View>
  );
});

const TabBar = React.memo<{
  activeTab: string;
  onTabPress: (tab: string, index: number) => void;
  animatedValues: { [key: string]: Animated.Value };
  slideAnimation: Animated.Value;
  t: any;
}>(({ activeTab, onTabPress, animatedValues, slideAnimation, t }) => {
  const tabs = [
    {
      key: 'home',
      label: t.tabs.home,
      icon: require('../assets/AppIcon/home.png'),
    },
    {
      key: 'single',
      label: t.tabs.analysis,
      icon: require('../assets/AppIcon/compatibility.png'),
    },
    {
      key: 'team',
      label: t.tabs.team,
      icon: require('../assets/AppIcon/analysis.png'),
    },
    {
      key: 'prediction',
      label: t.tabs.prediction,
      icon: require('../assets/AppIcon/prediction.png'),
    },
    {
      key: 'rankings',
      label: t.tabs.rankings,
      icon: require('../assets/AppIcon/ranking.png'),
    },
    {
      key: 'news',
      label: t.tabs.news,
      icon: require('../assets/AppIcon/loudspeaker_icon.png'),
    },
  ];

  return (
    <View style={styles.tabBar}>
      <Animated.View
        style={[
          styles.activeIndicator,
          {
            transform: [{ translateX: slideAnimation }],
          },
        ]}
      />
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={tab.key}
          style={styles.tab}
          onPress={() => onTabPress(tab.key, index)}
        >
          <Animated.View
            style={[
              styles.tabContent,
              {
                transform: [
                  {
                    scale: animatedValues[tab.key].interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                ],
                opacity: animatedValues[tab.key].interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.7, 1],
                }),
              },
            ]}
          >
            <Image
              source={tab.icon}
              style={[
                styles.tabIcon,
                activeTab === tab.key && styles.activeTabIcon,
              ]}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key && styles.activeTabText,
              ]}
            >
              {tab.label}
            </Text>
          </Animated.View>
        </TouchableOpacity>
      ))}
    </View>
  );
});

const App = () => {
  const { t } = useAppTranslation();
  const [activeTab, setActiveTab] = useState<'home' | 'single' | 'team' | 'rankings' | 'prediction' | 'news' | 'gacha'>('home');
  const [isAdFree, setIsAdFree] = useState(false);
  const [isSlideOverVisible, setIsSlideOverVisible] = useState(false);
  const [previousTab, setPreviousTab] = useState<typeof activeTab>('home');
  const [isSecondaryContentVisible, setIsSecondaryContentVisible] = useState(false);
  const [secondaryContent, setSecondaryContent] = useState<React.ReactNode>(null);
  const [tickets, setTickets] = useState(0);
  const slideAnimation = useRef(new Animated.Value(0)).current;

  const animatedValues = useRef({
    home: new Animated.Value(1),
    single: new Animated.Value(0),
    team: new Animated.Value(0),
    rankings: new Animated.Value(0),
    prediction: new Animated.Value(0),
    news: new Animated.Value(0),
    gacha: new Animated.Value(0),
  }).current;

  const checkVersion = async () => {
    try {
      const response = await fetch('https://api.github.com/gists/02b6fe84bebb1bc494427a956ed7e7d2');
      const gistData = await response.json();
      const content = JSON.parse(Object.values(gistData.files)[0].content) as VersionResponse;
      
      const platform = Platform.OS;
      const updateInfo = platform === 'ios' ? content.ios : content.android;
      
      const compareVersions = (v1: string, v2: string): boolean => {
        const parts1 = v1.split('.').map(Number);
        const parts2 = v2.split('.').map(Number);
        
        for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
          const num1 = parts1[i] || 0;
          const num2 = parts2[i] || 0;
          if (num1 < num2) return true;
          if (num1 > num2) return false;
        }
        return false;
      };

      const isUpdateRequired = compareVersions(APP_VERSION, updateInfo.currentVersion);

      if (isUpdateRequired) {
        Alert.alert(
          t.alerts.update.title,
          updateInfo.message,
          [
            {
              text: t.alerts.update.button,
              onPress: () => {
                Linking.openURL(updateInfo.storeUrl).catch(err => {
                  console.error('Failed to open store:', err);
                });
              },
            },
          ],
          { cancelable: false }
        );
      }
    } catch (error) {
      console.error('Failed to check version:', error);
    }
  };

  const giveLoginBonus = async () => {
    const newTickets = tickets + 1;
    setTickets(newTickets);
    await AsyncStorage.setItem('tickets', newTickets.toString());
    
    Alert.alert(
      t.alerts.loginBonus.title,
      t.alerts.loginBonus.message,
      [{ text: t.alerts.loginBonus.button }]
    );
  };

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await checkVersion();

        // 言語の初期化処理を追加
    const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
    if (!savedLanguage) {
      // 初回起動時のみ実行
      const deviceLang = getDeviceLanguage();
      await AsyncStorage.setItem('selectedLanguage', deviceLang);
    }
        
        const status = await AsyncStorage.getItem('adFreeStatus');
        const isAdFreeStatus = status === 'true';
        setIsAdFree(isAdFreeStatus);

        const currentTimestamp = await getServerTime();
        const lastResetTime = getLastResetTime(currentTimestamp);
        const lastBonusTimestamp = await AsyncStorage.getItem('lastBonusTimestamp');
        const savedTickets = await AsyncStorage.getItem('tickets');
        
        setTickets(savedTickets ? parseInt(savedTickets) : 0);

        if (!lastBonusTimestamp) {
          await AsyncStorage.setItem('lastBonusTimestamp', lastResetTime.toString());
        } else {
          const lastBonus = parseInt(lastBonusTimestamp);
          if (lastBonus < lastResetTime) {
            await AsyncStorage.setItem('lastBonusTimestamp', lastResetTime.toString());
          }
        }

        if (!isAdFreeStatus) {
          const randomValue = Math.random();
          if (randomValue <= 1) {
            appOpenAd.addAdEventListener('loaded', () => {
              appOpenAd.show().catch(showError => {
                console.error('Failed to show app open ad:', showError);
              });
            });

            appOpenAd.addAdEventListener('error', (error) => {
              console.error('App open ad failed to load:', error);
            });

            await appOpenAd.load();
          }
        }
      } catch (error) {
        console.error('Failed to initialize app:', error);
      }
    };

    initializeApp();

    return () => {
      appOpenAd.removeAllListeners();
    };
  }, []);

  const useTicket = async () => {
    if (tickets > 0) {
      const newTickets = tickets - 1;
      setTickets(newTickets);
      await AsyncStorage.setItem('tickets', newTickets.toString());
      return true;
    }
    return false;
  };

  const handleShowSecondaryContent = (content: React.ReactNode) => {
    setSecondaryContent(content);
    setIsSecondaryContentVisible(true);
  };

  // handleTabPressを修正：
const handleTabPress = (tabKey: typeof activeTab, index: number) => {
  const animations = Object.keys(animatedValues).map((key) =>
    Animated.timing(animatedValues[key], {
      toValue: key === tabKey ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    })
  );

  Animated.parallel([
    ...animations,
    Animated.spring(slideAnimation, {
      toValue: index * TAB_WIDTH,
      tension: 68,
      friction: 12,
      useNativeDriver: true,
    }),
  ]).start();

  setActiveTab(tabKey);

  // チーム画面の場合はスライドオーバーを表示（iPadでも同じ動作）
  if (tabKey === 'team') {
    setIsSlideOverVisible(true);
  } else {
    setIsSlideOverVisible(false);
  }
};

  const handleSlideOverClose = () => {
    setIsSlideOverVisible(false);
  };

  const renderContent = () => {
  switch (activeTab) {
    case 'home':
      return (
        <HomeStack 
          isAdFree={isAdFree} 
          onShowDetails={handleShowSecondaryContent}
        />
      );
    case 'single':
      return (
        <BrawlStarsCompatibility 
          isAdFree={isAdFree}
          onShowDetails={handleShowSecondaryContent}
        />
      );
    case 'team':
  return (
    <TeamBoard 
      isAdFree={isAdFree}
      isCompact={isSlideOverVisible}
      onShowDetails={handleShowSecondaryContent}
    />
  );
      case 'prediction':
        return (
          <PickPrediction 
            isAdFree={isAdFree}
            onShowDetails={handleShowSecondaryContent}
          />
        );
      case 'rankings':
        return (
          <NavigationContainer independent>
            <RankingsStack 
              isAdFree={isAdFree}
              onShowDetails={handleShowSecondaryContent}
            />
          </NavigationContainer>
        );
      case 'news':
        return (
          <News 
            isAdFree={isAdFree}
            onShowDetails={handleShowSecondaryContent}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {renderContent()}
        {!isAdFree && <BannerAdComponent />}
        <TabBar
          activeTab={activeTab}
          onTabPress={handleTabPress}
          animatedValues={animatedValues}
          slideAnimation={slideAnimation}
          t={t}
        />
      </View>
      {isSlideOverVisible && (
        <SlideOver onClose={handleSlideOverClose}>
          <TeamBoard 
            isAdFree={isAdFree}
            isCompact={true}
            onShowDetails={handleShowSecondaryContent}
          />
        </SlideOver>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
     paddingBottom: Platform.OS === 'ios' ? 105 : 98, // タブバー + バナー広告の高さを考慮して調整
  },
  splitContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  primaryContent: {
    flex: 1,
  },
  secondaryContent: {
    borderLeftWidth: 1,
    borderLeftColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    borderTopWidth: 0,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
    height: Platform.OS === 'ios' ? 55 : 48, // タブバーの高さを明示的に設定
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 5,
    zIndex: 1, // バナー広告より上に表示
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  tabContent: {
    alignItems: 'center',
  },
  tabIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
    tintColor: '#666',
  },
  tabText: {
    fontSize: 12,
    color: '#666',
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    width: TAB_WIDTH,
    height: 2,
    backgroundColor: '#65BBE9',
  },
  activeTabIcon: {
    tintColor: '#65BBE9',
  },
  activeTabText: {
    color: '#65BBE9',
    fontWeight: 'bold',
  },
  slideOverContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -SCREEN_HEIGHT,
    height: SCREEN_HEIGHT,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  slideOverHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#D3D3D3',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
  },
  slideOverContent: {
    flex: 1,
    padding: 20,
  },
  splitContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff'
  },
  primaryContent: {
    flex: 1,
  },
  secondaryContent: {
    // borderLeftWidthをコンポーネント内で動的に設定するため、ここでは削除
    backgroundColor: '#fff',
    // シャドウを追加してセパレーションを明確に
    shadowColor: '#000',
    shadowOffset: {
      width: -1,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
});

export default App;