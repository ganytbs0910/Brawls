import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image, Animated, Dimensions, Share } from 'react-native';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../i18n/translations';
import { privacyPolicyContent } from '../contents/privacyPolicy';
import { termsContent } from '../contents/terms';
import CharacterImage from './CharacterImage';

const SCREEN_WIDTH = Dimensions.get('window').width;

type ScreenType = 'rankings' | 'settings' | 'privacy' | 'terms' | 'language';

interface ScreenState {
  type: ScreenType;
  translateX: Animated.Value;
  zIndex: number;
}

interface RankingItem {
  rank: number;
  characterName: string;
  description: string;
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

  const characterTypes: { [key: string]: string[] } = {
    all: [
      "シェイド", "ストゥー", "ガス", "モー", "ケンジ", "サージ", "バイロン", "ダリル", 
      "フランケン", "リコ", "ラリー&ローリー", "ジュジュ", "ペニー", "クランシー", "MAX",
      "サンディ", "キット", "ニタ", "メロディー", "バスター", "エリザベス", "マンディ",
      "アンジェロ", "R-T", "オーティス", "ラフス", "クロウ", "モーティス", "ベル", "ジーン",
      "ローラ", "コレット", "ドラコ", "グレイ", "カール", "チェスター", "ビー", "アンバー",
      "パール", "リリー", "ゲイル", "イヴ", "バーリー", "ティック", "ダイナマイク", "コーデリアス",
      "タラ", "8ビット", "コルト", "スクウィーク", "グリフ", "メイジー", "ナーニ", "ジェシー",
      "バズ", "Emz", "メグ", "エルプリモ", "ビビ", "ローサ", "チャック", "パム",
      "ジャッキー", "ウィロー", "スプラウト", "ベリー", "チャーリー", "レオン", "スパイク",
      "ルー", "ポコ", "シェリー", "ジャネット", "ブロック", "ボニー", "ボウ", "サム",
      "ファング", "Mr.P", "エドガー", "ハンク", "ブル", "アッシュ", "グロム", "ダグ", "ミコ"
    ],
  tank: [
    "ダリル", "フランケン", "バスター", "ドラコ", "ビビ", 
    "エルプリモ", "ローサ", "ジャッキー", "ブル", "アッシュ", 
    "サム", "ハンク", "バズ", "ダグ", "メグ"
  ],
  thrower: [
    "ラリー&ローリー", "ジュジュ", "バーリー", "ティック", 
    "ダイナマイク", "スプラウト", "ウィロー", "グロム"
  ],
  assassin: [
    "シェイド", "ストゥー", "ケンジ", "メロディー", "クロウ",
    "モーティス", "リリー", "コーデリアス", "レオン", "ファング",
    "エドガー", "ミコ"
  ],
  sniper: [
    "エリザベス", "マンディ", "アンジェロ", "ベル", "ビー",
    "ナーニ", "メイジー", "ブロック", "ボニー", "ジャネット"
  ],
  attacker: [
    "モー", "サージ", "リコ", "クランシー", "ニタ",
    "ローラ", "コレット", "カール", "チェスター", "パール",
    "イヴ", "タラ", "8ビット", "スパイク", "R-T"
  ],
  support: [
    "ガス", "バイロン", "キット", "ラフス", "グレイ",
    "パム", "ベリー", "ポコ", "MAX"
  ],
  controller: [
    "ペニー", "サンディ", "オーティス", "ジーン", "アンバー",
    "ゲイル", "スクウィーク", "グリフ", "ジェシー", "Emz",
    "チャック", "チャーリー", "ルー", "ボウ", "Mr.P"
  ]
  };


  const rankings: RankingItem[] = [
    { rank: 1, characterName: "シェイド", description: "罠設置と長距離攻撃" },
    { rank: 2, characterName: "ストゥー", description: "現環境最強のブロッカー。高いHPと強力な範囲攻撃が特徴" },
    { rank: 3, characterName: "ガス", description: "形態変化による高い汎用性と驚異的な火力を持つ" },
    { rank: 4, characterName: "モー", description: "安定した攻撃力と優れたサポート能力を持つ" },
    { rank: 5, characterName: "ケンジ", description: "広範囲な攻撃と高い機動力で戦場を支配" },
    { rank: 6, characterName: "サージ", description: "ロボット形態の圧倒的な性能と優れた回復力" },
    { rank: 7, characterName: "バイロン", description: "強力な範囲攻撃とチーム全体へのサポート力" },
    { rank: 8, characterName: "ダリル", description: "長距離からの高火力と敵の動きを制限する能力" },
    { rank: 9, characterName: "フランケン", description: "優れた制圧力と敵を翻弄する機動力" },
    { rank: 10, characterName: "リコ", description: "高いバースト火力と安定したコントロール能力" },
    { rank: 11, characterName: "ラリー&ローリー", description: "強力な範囲攻撃と効果的なゾーニング能力" },
    { rank: 12, characterName: "ジュジュ", description: "味方の回復と敵への攻撃を両立する万能性" },
    { rank: 13, characterName: "ペニー", description: "チームサポートと安定した火力を持つ" },
    { rank: 14, characterName: "クランシー", description: "高いバースト火力と優れた地形コントロール" },
    { rank: 15, characterName: "MAX", description: "効果的な範囲攻撃と安定したコントロール" },
    { rank: 16, characterName: "サンディ", description: "敵を引き寄せる独特な戦術と高い汎用性" },
    { rank: 17, characterName: "キット", description: "長距離からの高火力と壁破壊能力" },
    { rank: 18, characterName: "ニタ", description: "安定した長距離攻撃と優れた壁破壊能力" },
    { rank: 19, characterName: "メロディー", description: "範囲攻撃と砲台による効果的な制圧" },
    { rank: 20, characterName: "バスター", description: "高い耐久力と味方のサポート能力" },
    { rank: 21, characterName: "エリザベス", description: "効果的な範囲攻撃と敵の行動を制限する能力" },
    { rank: 22, characterName: "マンディ", description: "長距離からの正確な攻撃と高い火力" },
    { rank: 23, characterName: "アンジェロ", description: "範囲攻撃と強力なスーパースキル" },
    { rank: 24, characterName: "R-T", description: "地形変化による戦場のコントロール" },
    { rank: 25, characterName: "オーティス", description: "高い機動力と近接での驚異的な火力" },
    { rank: 26, characterName: "ラフス", description: "独特な攻撃パターンと高い戦術性" },
    { rank: 27, characterName: "クロウ", description: "高い機動力とチームサポート能力" },
    { rank: 28, characterName: "モーティス", description: "効果的なスタン効果と接近戦での強さ" },
    { rank: 29, characterName: "ベル", description: "壁を利用した攻撃と高いスキル性" },
    { rank: 30, characterName: "ジーン", description: "効果的な範囲攻撃とシールドサポート" },
    { rank: 31, characterName: "ローラ", description: "長距離攻撃とポーターによる制圧" },
    { rank: 32, characterName: "コレット", description: "継続的なダメージと範囲攻撃" },
    { rank: 33, characterName: "ドラコ", description: "高い耐久力と近接での強さ" },
    { rank: 34, characterName: "グレイ", description: "毒効果と高い機動力による牽制" },
    { rank: 35, characterName: "カール", description: "効果的な範囲攻撃と独特な戦術" },
    { rank: 36, characterName: "チェスター", description: "チャージ攻撃による高火力" },
    { rank: 37, characterName: "ビー", description: "壁越しの攻撃と範囲ダメージ" },
    { rank: 38, characterName: "アンバー", description: "ステルス能力と高いバースト火力" },
    { rank: 39, characterName: "パール", description: "範囲攻撃と味方を隠すスーパー" },
    { rank: 40, characterName: "リリー", description: "範囲攻撃と独特な移動能力" },
    { rank: 41, characterName: "ゲイル", description: "怒り効果による火力上昇" },
    { rank: 42, characterName: "イヴ", description: "連鎖的な攻撃と高い機動力" },
    { rank: 43, characterName: "バーリー", description: "操作可能な攻撃と高火力" },
    { rank: 44, characterName: "ティック", description: "範囲攻撃と効果的なスーパー" },
    { rank: 45, characterName: "ダイナマイク", description: "突進能力と近接での強さ" },
    { rank: 46, characterName: "コーデリアス", description: "範囲攻撃と効果的な牽制" },
    { rank: 47, characterName: "タラ", description: "近距離での高火力と範囲攻撃" },
    { rank: 48, characterName: "8ビット", description: "ノックバック効果と機動力" },
    { rank: 49, characterName: "コルト", description: "高速な近接攻撃と範囲攻撃" },
    { rank: 50, characterName: "スクウィーク", description: "高い耐久力と近接攻撃" },
    { rank: 51, characterName: "グリフ", description: "範囲回復と攻撃の両立" },
    { rank: 52, characterName: "メイジー", description: "継続ダメージと地域制圧" },
    { rank: 53, characterName: "ナーニ", description: "ブーメラン攻撃と壁破壊" },
    { rank: 54, characterName: "ジェシー", description: "熊の召喚と近距離攻撃" },
    { rank: 55, characterName: "バズ", description: "ハッチリングによる制圧" },
    { rank: 56, characterName: "Emz", description: "突進攻撃と高い耐久力" },
    { rank: 57, characterName: "メグ", description: "魔法攻撃と範囲効果" },
    { rank: 58, characterName: "エルプリモ", description: "掘削能力と近接攻撃" },
    { rank: 59, characterName: "ビビ", description: "回復と攻撃の組み合わせ" },
    { rank: 60, characterName: "ローサ", description: "投擲攻撃と範囲効果" },
    { rank: 61, characterName: "チャック", description: "インク攻撃と移動阻害" },
    { rank: 62, characterName: "パム", description: "近距離と遠距離の攻撃" },
    { rank: 63, characterName: "ジャッキー", description: "爆弾による地域制圧" },
    { rank: 64, characterName: "ウィロー", description: "高火力と攻撃力ブースト" },
    { rank: 65, characterName: "スプラウト", description: "投擲爆弾と壁破壊" },
    { rank: 66, characterName: "ベリー", description: "高いHPとスタン効果" },
    { rank: 67, characterName: "チャーリー", description: "高い機動力と吸血効果" },
    { rank: 68, characterName: "レオン", description: "近接での範囲攻撃" },
    { rank: 69, characterName: "スパイク", description: "粘着爆弾による攻撃" },
    { rank: 70, characterName: "ルー", description: "ステルス能力と近接攻撃" },
    { rank: 71, characterName: "ポコ", description: "回復とサポート能力" },
    { rank: 72, characterName: "シェリー", description: "範囲攻撃と特殊効果" },
    { rank: 73, characterName: "ジャネット", description: "範囲攻撃と制御能力" },
    { rank: 74, characterName: "ブロック", description: "変形能力と適応力" },
    { rank: 75, characterName: "ボニー", description: "アップグレード型の攻撃" },
    { rank: 76, characterName: "ボウ", description: "吹き飛ばし効果と範囲攻撃" },
    { rank: 77, characterName: "サム", description: "継続ダメージと範囲攻撃" },
    { rank: 78, characterName: "ファング", description: "高い耐久力とシールド" },
    { rank: 79, characterName: "Mr.P", description: "範囲攻撃と特殊効果" },
    { rank: 80, characterName: "エドガー", description: "HP比例ダメージ攻撃" },
    { rank: 81, characterName: "ハンク", description: "特殊な攻撃パターン" },
    { rank: 82, characterName: "ブル", description: "範囲攻撃と制御効果" },
    { rank: 83, characterName: "アッシュ", description: "二人一組の特殊な攻撃" },
    { rank: 84, characterName: "グロム", description: "凍結効果と範囲攻撃" },
    { rank: 85, characterName: "ダグ", description: "特殊な攻撃と効果" },
    { rank: 86, characterName: "ミコ", description: "タレット設置と電撃攻撃" }
    ].map(item => ({
  rank: item.rank,
  characterName: translations[currentLanguage].rankings.characters[item.characterName]?.name || item.characterName,
  description: translations[currentLanguage].rankings.characters[item.characterName]?.description || item.description
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
      return rankings;
    }

    if (selectedRankingType === 'all') {
      return rankings;
    }

    const characterList = characterTypes[selectedRankingType];
    if (!Array.isArray(characterList)) {
      console.warn(`タイプ ${selectedRankingType} のキャラクターリストが無効です、allに戻します`);
      return rankings;
    }

    const filteredRankings = rankings.filter(item =>
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

  const rankingTypes = [
    { id: 'all', name: translations[currentLanguage].rankings.types.all },
    { id: 'tank', name: translations[currentLanguage].rankings.types.tank },
    { id: 'thrower', name: translations[currentLanguage].rankings.types.thrower },
    { id: 'assassin', name: translations[currentLanguage].rankings.types.assassin },
    { id: 'sniper', name: translations[currentLanguage].rankings.types.sniper },
    { id: 'attacker', name: translations[currentLanguage].rankings.types.attacker },
    { id: 'support', name: translations[currentLanguage].rankings.types.support },
    { id: 'controller', name: translations[currentLanguage].rankings.types.controller }
  ];

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
          {rankingTypes.map((type) => (
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
                  <Text style={styles.characterName}>{item.characterName}</Text>
                  <Text style={styles.description}>{item.description}</Text>
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