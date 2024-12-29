// src/components/Home.tsx
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
  Share, 
  SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import { privacyPolicyContent } from '../contents/privacyPolicy';
import { termsContent } from '../contents/terms';
import { DailyTip } from '../components/DailyTip';
import { RewardedAd, RewardedAdEventType } from 'react-native-google-mobile-ads';
import { AD_CONFIG } from '../config/AdConfig';
import { 
  rotatingModes, 
  mapImages, 
  getCurrentMode, 
  getMapForDate 
} from '../utils/gameData';
import AdMobService from '../services/AdMobService';
import { BannerAdComponent } from '../components/BannerAdComponent';
import MapDetailScreen from './MapDetailScreen';
import { MapDetail, GameMode, ScreenType, ScreenState } from '../types';
import { getMapDetails } from '../data/mapDetails';

type RankingsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const SCREEN_WIDTH = Dimensions.get('window').width;

interface MapDetailScreenProps {
  mapName: string;
  modeName: string;
  modeColor: string;
  modeIcon: any;
  modeImage: any;
  onClose: () => void;
}

const Home: React.FC = () => {
  const navigation = useNavigation<RankingsScreenNavigationProp>();
  const [screenStack, setScreenStack] = useState<ScreenState[]>([
    { type: 'home', translateX: new Animated.Value(0), zIndex: 0 }
  ]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isRewardedAdReady, setIsRewardedAdReady] = useState(false);
  const [mapDetailProps, setMapDetailProps] = useState<Omit<MapDetailScreenProps, 'onClose'> | null>(null);
  const adService = useRef<AdMobService | null>(null);

  const rewarded = useRef(
    RewardedAd.createForAdRequest(AD_CONFIG.IOS_REWARDED_ID, {
      requestNonPersonalizedAdsOnly: true,
      keywords: ['game', 'mobile game'],
    })
  ).current;

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
    const initAdService = async () => {
      try {
        const instance = await AdMobService.initialize();
        adService.current = instance;
      } catch (error) {
        console.error('AdMob initialization error:', error);
      }
    };
    
    initAdService();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const showRewardedAd = async () => {
    if (isRewardedAdReady) {
      await rewarded.show();
      setIsRewardedAdReady(false);
      rewarded.load();
    }
  };

  const handleShare = async () => {
    try {
      const appStoreUrl = 'https://apps.apple.com/jp/app/brawl-status/id6738936691';
      await Share.share({
        message: 'ブロールスターズのマップ情報をチェックできるアプリ「Brawl Status」を見つけました！\n\nApp Storeからダウンロード：\n' + appStoreUrl,
        url: appStoreUrl, // iOS での共有シートにリンクを表示
        title: 'Brawl Status - マップ情報アプリ'
      }, {
        // iOS専用の設定
        dialogTitle: 'Brawl Statusを共有', // Androidでのみ使用
        subject: 'Brawl Status - ブロールスターズマップ情報アプリ', // メール共有時の件名
        tintColor: '#21A0DB' // iOSでの共有シートのアクセントカラー
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const handleSupportClick = async () => {
    if (adService.current) {
      await adService.current.showInterstitial();
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

  const getCurrentModeName = (modeType: string, date: Date) => {
    const mode = getCurrentMode(modeType, date);
    return mode?.name;
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
      color: "#90EE90",
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
      color: "#FF69B4",
      isRotating: true,
      icon: getCurrentMode("heist", selectedDate)?.icon || require('../../assets/GameModeIcons/heist_icon.png')
    },
    {
      name: "ブロストライカー",
      currentMap: currentMaps.brawlBall,
      updateTime: 17,
      color: "#4169E1",
      isRotating: true,
      icon: require('../../assets/GameModeIcons/brawl_ball_icon.png')
    },
    {
      name: getCurrentModeName("brawlBall5v5", selectedDate) || "5vs5ブロストライカー",
      currentMap: currentMaps.brawlBall5v5,
      updateTime: 17,
      color: "#808080",
      isRotating: true,
      icon: getCurrentMode("brawlBall5v5", selectedDate)?.icon || require('../../assets/GameModeIcons/brawl_ball_icon.png')
    },
    {
      name: getCurrentModeName("duel", selectedDate) || "デュエル＆殲滅＆賞金稼ぎ",
      currentMap: currentMaps.duel,
      updateTime: 17,
      color: "#FF0000",
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

  const renderScreenContent = (screen: ScreenState) => {
    switch (screen.type) {
      case 'mapDetail':
        return mapDetailProps ? (
          <MapDetailScreen
            {...mapDetailProps}
            onClose={goBack}
            onCharacterPress={handleCharacterPress}  // 追加
          />
        ) : null;
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
                onPress={handleSupportClick}
              >
                <Text style={styles.settingsItemText}>広告を見て支援する（小）</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.settingsItem,
                  !isRewardedAdReady && styles.settingsItemDisabled
                ]}
                onPress={showRewardedAd}
                disabled={!isRewardedAdReady}
              >
                <Text style={[
                  styles.settingsItemText,
                  !isRewardedAdReady && styles.settingsItemTextDisabled
                ]}>
                  広告を見て支援する（大）
                  {!isRewardedAdReady && ' (準備中)'}
                </Text>
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
            <TouchableOpacity 
              style={styles.todayButton} 
              onPress={() => setSelectedDate(new Date())}>
              <Text style={styles.todayButtonText}>Today</Text>
            </TouchableOpacity>
          </View>
          {modes.map((mode, index) => (
            <View key={index} style={styles.modeCard}>
              <View style={styles.modeHeader}>
                <View style={[styles.modeTag, { backgroundColor: mode.color }]}>
                  <Image source={mode.icon} style={styles.modeIcon} />
                  <Text style={styles.modeTagText}>{mode.name}</Text>
                </View>
                {selectedDate.getDate() === new Date().getDate() && (
                  <Text style={styles.updateTime}>
                    更新まで {getNextUpdateTime(mode.updateTime)}
                  </Text>
                )}
              </View>
              <TouchableOpacity 
                style={styles.mapContent}
                onPress={() => handleMapClick(mode)}
                activeOpacity={0.7}
              >
                <Text style={styles.mapName}>{mode.currentMap}</Text>
                {(mode.name === "バトルロワイヤル" || mode.name === "エメラルドハント" || 
                  mode.name === "ノックアウト" || getCurrentModeName("heist", selectedDate) || 
                  getCurrentModeName("brawlBall5v5", selectedDate) || mode.name === "ブロストライカー" || 
                  getCurrentModeName("duel", selectedDate)) && (
                  <Image 
                    source={mapImages[mode.currentMap]}
                    style={styles.mapImage}
                    resizeMode="contain"
                  />
                )}
              </TouchableOpacity>
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
  settingsItemDisabled: {
    opacity: 0.5,
  },
  settingsItemText: {
    fontSize: 16,
  },
  settingsItemTextDisabled: {
    color: '#999',
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  modeIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
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
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginTop: 8,
  },
  mapName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  mapImage: {
    width: 80,
    height: 53,
    borderRadius: 8,
    marginLeft: 16,
  },
  rotatingNote: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
});

export default Home;