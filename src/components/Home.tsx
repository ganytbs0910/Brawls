import React, { useState } from 'react';
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
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../i18n/translations';
import { privacyPolicyContent } from '../contents/privacyPolicy';
import { termsContent } from '../contents/terms';
import { DailyTip } from '../components/DailyTip';

const SCREEN_WIDTH = Dimensions.get('window').width;

type ScreenType = 'home' | 'settings' | 'privacy' | 'terms' | 'language';

interface ScreenState {
  type: ScreenType;
  translateX: Animated.Value;
  zIndex: number;
}

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
      <Text style={styles.settingsTitle}>
        {translations[currentLanguage].settings.language}
      </Text>
      <TouchableOpacity onPress={onClose} style={styles.backButton}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.settingsContent}>
      {Object.keys(translations.ja.languages).map((lang) => (
        <TouchableOpacity 
          key={lang}
          style={[
            styles.languageItem,
            currentLanguage === lang && styles.selectedLanguageItem
          ]}
          onPress={() => onLanguageChange(lang)}
        >
          <Text style={[
            styles.languageText,
            currentLanguage === lang && styles.selectedLanguageText
          ]}>
            {translations[currentLanguage].languages[lang]}
          </Text>
        </TouchableOpacity>
      ))}
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
      <Text style={styles.settingsTitle}>
        {translations[currentLanguage].settings.privacy}
      </Text>
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
      <Text style={styles.settingsTitle}>
        {translations[currentLanguage].settings.terms}
      </Text>
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
      <Text style={styles.settingsTitle}>
        {translations[currentLanguage].settings.title}
      </Text>
      <TouchableOpacity onPress={onClose} style={styles.backButton}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.settingsContent}>
      <TouchableOpacity 
        style={styles.settingsItem}
        onPress={() => onNavigate('language')}
      >
        <Text style={styles.settingsItemText}>
          {translations[currentLanguage].settings.language}
        </Text>
        <Text style={styles.settingsValueText}>
          {translations[currentLanguage].languages[currentLanguage]}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.settingsItem}
        onPress={onShare}
      >
        <Text style={styles.settingsItemText}>
          {translations[currentLanguage].settings.share}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.settingsItem}
        onPress={() => onNavigate('privacy')}
      >
        <Text style={styles.settingsItemText}>
          {translations[currentLanguage].settings.privacy}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.settingsItem}
        onPress={() => onNavigate('terms')}
      >
        <Text style={styles.settingsItemText}>
          {translations[currentLanguage].settings.terms}
        </Text>
      </TouchableOpacity>
    </View>
  </View>
);

const Home: React.FC = () => {
  const { currentLanguage, changeLanguage } = useLanguage();
  const [screenStack, setScreenStack] = useState<ScreenState[]>([
    { type: 'home', translateX: new Animated.Value(0), zIndex: 0 }
  ]);

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: translations[currentLanguage].home.shareMessage,
        title: translations[currentLanguage].home.shareTitle
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
            onLanguageChange={changeLanguage}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {translations[currentLanguage].home.title}
        </Text>
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
});

export default Home;