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
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { privacyPolicyContent } from '../contents/privacyPolicy';
import { termsContent } from '../contents/terms';
import { DailyTip } from '../components/DailyTip';
import mapData from '../data/mapAPI.json';

const SCREEN_WIDTH = Dimensions.get('window').width;

type ScreenType = 'home' | 'settings' | 'privacy' | 'terms';

interface ScreenState {
  type: ScreenType;
  translateX: Animated.Value;
  zIndex: number;
}

interface MapData {
  id: number;
  name: string;
  disabled: boolean;
  imageUrl: string;
  gameMode: {
    name: string;
    color: string;
    imageUrl: string;
  };
}

const MapList: React.FC = () => {
  const [maps, setMaps] = useState<MapData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMaps();
  }, []);

  const fetchMaps = () => {
    try {
      const activeMaps = mapData.list.filter((map: MapData) => !map.disabled);
      setMaps(activeMaps);
      setLoading(false);
    } catch (err) {
      setError('マップデータの取得に失敗しました');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#21A0DB" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.mapListContainer}>
      <Text style={styles.sectionTitle}>アクティブなマップ</Text>
      {maps.map((map) => (
        <View key={map.id} style={styles.mapCard}>
          <Image 
            source={{ uri: map.imageUrl }} 
            style={styles.mapImage}
            resizeMode="cover"
          />
          <View style={styles.mapInfo}>
            <Text style={styles.mapName}>{map.name}</Text>
            <View style={[styles.gameModeTag, { backgroundColor: map.gameMode.color }]}>
              <Image 
                source={{ uri: map.gameMode.imageUrl }} 
                style={styles.gameModeIcon}
              />
              <Text style={styles.gameModeText}>{map.gameMode.name}</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

const PrivacyPolicy = ({ onClose }: { onClose: () => void }) => (
  <View style={styles.settingsContainer}>
    <View style={styles.settingsHeader}>
      <Text style={styles.settingsTitle}>プライバシーポリシー</Text>
      <TouchableOpacity onPress={onClose} style={styles.backButton}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>
    </View>
    <ScrollView style={styles.contentContainer}>
      <Text style={styles.contentText}>{privacyPolicyContent}</Text>
    </ScrollView>
  </View>
);

const Terms = ({ onClose }: { onClose: () => void }) => (
  <View style={styles.settingsContainer}>
    <View style={styles.settingsHeader}>
      <Text style={styles.settingsTitle}>利用規約</Text>
      <TouchableOpacity onPress={onClose} style={styles.backButton}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>
    </View>
    <ScrollView style={styles.contentContainer}>
      <Text style={styles.contentText}>{termsContent}</Text>
    </ScrollView>
  </View>
);

const Settings = ({ 
  onClose, 
  onNavigate, 
  onShare
}: { 
  onClose: () => void; 
  onNavigate: (screen: ScreenType) => void;
  onShare: () => void;
}) => (
  <View style={styles.settingsContainer}>
    <View style={styles.settingsHeader}>
      <Text style={styles.settingsTitle}>設定</Text>
      <TouchableOpacity onPress={onClose} style={styles.backButton}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.settingsContent}>
      <TouchableOpacity 
        style={styles.settingsItem}
        onPress={onShare}
      >
        <Text style={styles.settingsItemText}>共有</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.settingsItem}
        onPress={() => onNavigate('privacy')}
      >
        <Text style={styles.settingsItemText}>プライバシーポリシー</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.settingsItem}
        onPress={() => onNavigate('terms')}
      >
        <Text style={styles.settingsItemText}>利用規約</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const Home: React.FC = () => {
  const [screenStack, setScreenStack] = useState<ScreenState[]>([
    { type: 'home', translateX: new Animated.Value(0), zIndex: 0 }
  ]);

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

  const renderScreenContent = (screen: ScreenState) => {
    switch (screen.type) {
      case 'settings':
        return (
          <Settings 
            onClose={goBack} 
            onNavigate={showScreen} 
            onShare={handleShare}
          />
        );
      case 'privacy':
        return (
          <PrivacyPolicy 
            onClose={goBack}
          />
        );
      case 'terms':
        return (
          <Terms 
            onClose={goBack}
          />
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
        <MapList />
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
  mapListContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  mapCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mapImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  mapInfo: {
    padding: 12,
  },
  mapName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  gameModeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  gameModeIcon: {
    width: 20,
    height: 20,
    marginRight: 4,
  },
  gameModeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorContainer: {
    padding: 16,
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
});

export default Home;