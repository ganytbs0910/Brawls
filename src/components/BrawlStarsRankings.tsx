// src/components/BrawlStarsRankings.tsx

import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image, Animated, Dimensions, Share } from 'react-native';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../i18n/translations';
import { privacyPolicyContent } from '../contents/privacyPolicy';
import { termsContent } from '../contents/terms';
import CharacterImage from './CharacterImage';
import { characterTypes, characterRankings, rankingTypes, RankingItem } from '../data/characterData';

const SCREEN_WIDTH = Dimensions.get('window').width;

type ScreenType = 'rankings' | 'settings' | 'privacy' | 'terms' | 'language';

interface ScreenState {
  type: ScreenType;
  translateX: Animated.Value;
  zIndex: number;
}

const LanguageSettings = ({ onClose, currentLanguage, onLanguageChange }: {
  onClose: () => void;
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}) => (
  <View style={styles.settingsContainer}>
    <View style={styles.settingsHeader}>
      <Text style={styles.settingsTitle}>{translations[currentLanguage].settings.language}</Text>
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

const PrivacyPolicy = ({ onClose, currentLanguage }: { 
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
      <Text style={styles.contentText}>{privacyPolicyContent[currentLanguage]}</Text>
    </ScrollView>
  </View>
);

const Terms = ({ onClose, currentLanguage }: { 
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
      <Text style={styles.contentText}>{termsContent[currentLanguage]}</Text>
    </ScrollView>
  </View>
);

const Settings = ({ onClose, onNavigate, onShare, currentLanguage }: { 
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

const BrawlStarsRankings: React.FC = () => {
  const { currentLanguage, changeLanguage } = useLanguage();
  const [screenStack, setScreenStack] = useState<ScreenState[]>([
    { type: 'rankings', translateX: new Animated.Value(0), zIndex: 0 }
  ]);
  const [selectedRankingType, setSelectedRankingType] = useState('all');

  const localizedRankingTypes = rankingTypes.map(type => ({
    ...type,
    name: translations[currentLanguage].rankings.types[type.id]
  }));

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: translations[currentLanguage].rankings.shareMessage,
        title: translations[currentLanguage].rankings.shareTitle
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

  const getFilteredRankings = () => {
    if (!selectedRankingType || !characterTypes[selectedRankingType]) {
      console.warn(`無効なselectedType: ${selectedRankingType}, allに戻します`);
      return characterRankings;
    }

    if (selectedRankingType === 'all') {
      return characterRankings;
    }

    const characterList = characterTypes[selectedRankingType];
    if (!Array.isArray(characterList)) {
      console.warn(`タイプ ${selectedRankingType} のキャラクターリストが無効です、allに戻します`);
      return characterRankings;
    }

    const filteredRankings = characterRankings.filter(item =>
      characterList.includes(item.characterName)
    );

    return filteredRankings.map((item, index) => ({
      ...item,
      rank: index + 1
    }));
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {translations[currentLanguage].rankings.title}
        </Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => showScreen('settings')}
        >
          <Image 
            source={require('../../assets/AppIcon/settings_icon.png')} 
            style={[styles.settingsIcon, { tintColor: '#000000' }]}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.rankingTypeContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.tabScroll}
          contentContainerStyle={styles.tabScrollContent}
        >
          {localizedRankingTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.typeTab,
                selectedRankingType === type.id && styles.selectedTypeTab
              ]}
              onPress={() => setSelectedRankingType(type.id)}
            >
              <Text style={[
                styles.typeText,
                selectedRankingType === type.id && styles.selectedTypeText
              ]}>
                {type.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.content}>
        <ScrollView>
          {getFilteredRankings().map((item) => (
            <View key={item.rank} style={styles.rankingItem}>
              <View style={styles.rankContainer}>
                <Text style={styles.rankNumber} numberOfLines={1}>
                  {item.rank}{translations[currentLanguage].rankings.rankSuffix}
                </Text>
              </View>
              <View style={styles.characterInfo}>
                <CharacterImage characterName={item.characterName} size={40} style={styles.characterImage} />
                <View style={styles.textContainer}>
                  <Text style={styles.characterName}>
                    {translations[currentLanguage].rankings.characters[item.characterName]?.name || item.characterName}
                  </Text>
                  <Text style={styles.description}>
                    {translations[currentLanguage].rankings.characters[item.characterName]?.description || item.description}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
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
  rankingTypeContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tabScroll: {
    flexGrow: 0,
    height: 50,
  },
  tabScrollContent: {
    paddingHorizontal: 12,
  },
  typeTab: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedTypeTab: {
    backgroundColor: '#2196F3',
  },
  typeText: {
    fontSize: 14,
    color: '#666',
  },
  selectedTypeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  rankContainer: {
    width: 45,
  },
  rankNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  characterInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  characterImage: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  characterName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  settingsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: '#2196F3',
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

export default BrawlStarsRankings;