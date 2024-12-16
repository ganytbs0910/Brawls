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

type ScreenType = 'home' | 'settings' | 'privacy' | 'terms' | 'language';

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

const LanguageSettings = ({ 
  onClose, 
  currentLanguage, 
  onLanguageChange 
}: {
  onClose: () => void;
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}) => (
  <View style={styles.settingsContainer}>
    <View style={styles.settingsHeader}>
      <Text style={styles.settingsTitle}>言語設定</Text>
      <TouchableOpacity onPress={onClose} style={styles.backButton}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.settingsContent}>
      <TouchableOpacity 
        style={[
          styles.languageItem,
          currentLanguage === 'ja' && styles.selectedLanguageItem
        ]}
        onPress={() => onLanguageChange('ja')}
      >
        <Text style={[
          styles.languageText,
          currentLanguage === 'ja' && styles.selectedLanguageText
        ]}>
          日本語
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[
          styles.languageItem,
          currentLanguage === 'en' && styles.selectedLanguageItem
        ]}
        onPress={() => onLanguageChange('en')}
      >
        <Text style={[
          styles.languageText,
          currentLanguage === 'en' && styles.selectedLanguageText
        ]}>
          English
        </Text>
      </TouchableOpacity>
    </View>
  </View>
);

const PrivacyPolicy = ({ 
  onClose, 
  currentLanguage 
}: { 
  onClose: () => void;
  currentLanguage: string;
}) => (
  <View style={styles.settingsContainer}>
    <View style={styles.settingsHeader}>
      <Text style={styles.settingsTitle}>プライバシーポリシー</Text>
      <TouchableOpacity onPress={onClose} style={styles.backButton}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>
    </View>
    <ScrollView style={styles.contentContainer}>
      <Text style={styles.contentText}>
        {privacyPolicyContent[currentLanguage]}
      </Text>
    </ScrollView>
  </View>
);

const Terms = ({ 
  onClose, 
  currentLanguage 
}: { 
  onClose: () => void;
  currentLanguage: string;
}) => (
  <View style={styles.settingsContainer}>
    <View style={styles.settingsHeader}>
      <Text style={styles.settingsTitle}>利用規約</Text>
      <TouchableOpacity onPress={onClose} style={styles.backButton}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>
    </View>
    <ScrollView style={styles.contentContainer}>
      <Text style={styles.contentText}>
        {termsContent[currentLanguage]}
      </Text>
    </ScrollView>
  </View>
);

const Settings = ({ 
  onClose, 
  onNavigate, 
  onShare, 
  currentLanguage 
}: { 
  onClose: () => void; 
  onNavigate: (screen: ScreenType) => void;
  onShare: () => void;
  currentLanguage: string;
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
        onPress={() => onNavigate('language')}
      >
        <Text style={styles.settingsItemText}>言語設定</Text>
        <Text style={styles.settingsValueText}>
          {currentLanguage === 'ja' ? '日本語' : 'English'}
        </Text>
      </TouchableOpacity>
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
  const [currentLanguage, setCurrentLanguage] = useState('ja');
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

  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language);
    goBack();
  };

  const renderScreenContent = (screen: ScreenState) => {
    switch (screen.type) {
      case 'settings':
        return (
          <Settings 
            onClose={goBack} 
            onNavigate={showScreen} 
            onShare={handleShare}
            currentLanguage={currentLanguage}
          />
        );
      case 'privacy':
        return (
          <PrivacyPolicy 
            onClose={goBack}
            currentLanguage={currentLanguage}
          />
        );
      case 'terms':
        return (
          <Terms 
            onClose={goBack}
            currentLanguage={currentLanguage}
          />
        );
      case 'language':
        return (
          <LanguageSettings
            onClose={goBack}
            currentLanguage={currentLanguage}
            onLanguageChange={handleLanguageChange}
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
  settingsValueText: {
    fontSize: 14,
    color: '#666',
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
  languageItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  selectedLanguageItem: {
    backgroundColor: '#e3f2fd',
  },
  languageText: {
    fontSize: 16,
  },
  selectedLanguageText: {
    color: '#2196F3',
    fontWeight: 'bold',
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