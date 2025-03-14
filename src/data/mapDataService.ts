// mapDataService.ts
import { MapData, GameMode, GameModeData } from '../types/types';
import mapData from './mapAPI.json';
import characterData from './characterAPI.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LocalizedText {
  ja: string;
  en: string;
  ko: string;
  es: string;
  ar: string;
  fr: string;
  zhTw: string;
}

interface BrawlifyMap {
  name: LocalizedText;
  gameMode: string;
  image: string;
  description: string;
  recommendedBrawlers: RecommendedBrawler[];
}

interface RecommendedBrawler {
  name: string;
  reason: string;
  power: number;
}

// キャッシュとローディング状態の管理
let mapsDataCache: Record<string, MapData> = {};
let isInitialized = false;

// 画像アセットの定義
export const mapImages = {
  "天国と地獄": require('../../assets/MapImages/Feast_Or_Famine.png'),
  "空飛ぶ絨毯": require('../../assets/MapImages/Flying_Fantasies.png'),
  "囚われた島": require('../../assets/MapImages/Island_Invasion.png'),
  "狙撃手たちの楽園": require('../../assets/MapImages/Marksmans_Paradise.png'),
  "岩壁の決戦": require('../../assets/MapImages/Rockwall_Brawl.png'),
  "安全センター": require('../../assets/MapImages/Safety_Center.png'),
  "ガイコツ川": require('../../assets/MapImages/Skull_Creek.png'),
  "酸性湖": require('../../assets/MapImages/Acid_Lakes.png'),
  "激動の洞窟": require('../../assets/MapImages/Cavern_Churn.png'),
  "暗い廊下": require('../../assets/MapImages/Dark_Passage.png'),
  "ダブルトラブル": require('../../assets/MapImages/Double_Trouble.png'),
  "枯れた川": require('../../assets/MapImages/Dried_Up_River.png'),
  "白熱対戦": require('../../assets/MapImages/H_for.png'),
  "新たなる地平": require('../../assets/MapImages/New_Horizons.png'),
  "オープンフィールド": require('../../assets/MapImages/Out_In_The_Open.png'),
  "生い茂る廃墟": require('../../assets/MapImages/Overgrown_Ruins.png'),
  "バキューン神殿": require('../../assets/MapImages/Temple_Of_Vroom.png'),
  "極小列島": require('../../assets/MapImages/Tiny_Islands.png'),
  "双頭の川": require('../../assets/MapImages/Two_Rivers.png'),
  "ベルの岩": require('../../assets/MapImages/Belles_Rock.png'),
  "密林の奥地": require('../../assets/MapImages/Deep_Forest.png'),
  "燃える不死鳥": require('../../assets/MapImages/Flaring_Phoenix.png'),
  "四段階層": require('../../assets/MapImages/Four_Levels.png'),
  "ゴールドアームの渓谷": require('../../assets/MapImages/Goldarm_Gulch.png'),
  "ごつごつ坑道": require('../../assets/MapImages/Hard_Rock_Mine.png'),
  "ラストストップ": require('../../assets/MapImages/Last_Stop.png'),
  "トロッコの狂気": require('../../assets/MapImages/Minecart_Madness.png'),
  "オープンスペース": require('../../assets/MapImages/Open_Space.png'),
  "寂れたアーケード": require('../../assets/MapImages/Rustic_Arcade.png'),
  "アンダーマイン": require('../../assets/MapImages/Undermine.png'),
  "クリスタルアーケード": require('../../assets/MapImages/Crystal_Arcade.png'),
  "サボテンの罠": require('../../assets/MapImages/Deathcap_Trap.png'),
  "ダブルレール": require('../../assets/MapImages/Double_Swoosh.png'),
  "森林伐採": require('../../assets/MapImages/Forest_Clearing.png'),
  "クールロック": require('../../assets/MapImages/The_Cooler_Hard_Rock.png'),
  "エメラルドの要塞": require('../../assets/MapImages/Gem_Fort.png'),
  "オープンビジネス": require('../../assets/MapImages/Open_Business.png'),
  "安全地帯": require('../../assets/MapImages/Safe_Zone.png'),
  "パラレルワールド": require('../../assets/MapImages/Parallel_Plays.png'),
  "安全地帯・改": require('../../assets/MapImages/Safe(r)_Zone.png'),
  "炎のリング": require('../../assets/MapImages/Ring_Of_Fire.png'),
  "大いなる湖": require('../../assets/MapImages/The_Great_Lake.png'),
  "ウォータースポーツ": require('../../assets/MapImages/Watersport.png'),
  "GG 2.0": require('../../assets/MapImages/Gg_2.0.png'),
  "ビートルバトル": require('../../assets/MapImages/Dueling_Beetles.png'),
  "ホットポテト": require('../../assets/MapImages/Hot_Potato.png'),
  "喧騒居住地": require('../../assets/MapImages/Noisy_Neighbors.png'),
  "どんぱち谷": require('../../assets/MapImages/Kaboom_Canyon.png'),
  "サスペンダーズ": require('../../assets/MapImages/Suspenders.png'),
  "合流地点": require('../../assets/MapImages/Riverbank_Crossing.png'),
  "凍てつく波紋": require('../../assets/MapImages/Freezing_Ripples.png'),
  "ツルツルロード": require('../../assets/MapImages/Slippery_Road.png'),
  "大波": require('../../assets/MapImages/Great_Waves.png'),
  "ガクブル公園": require('../../assets/MapImages/Icy_Ice_Park.png'),
  "クールシェイプ": require('../../assets/MapImages/Cool_Shapes.png'),
  "フロスティトラック": require('../../assets/MapImages/Frosty_Tracks.png'),
  "暴徒のオアシス": require('../../assets/MapImages/Slayers_Paradise.png'),
  "流れ星": require('../../assets/MapImages/Shooting_Star.png'),
  "常勝街道": require('../../assets/MapImages/Warriors_Way.png'),
  "スパイスプロダクション": require('../../assets/MapImages/Spice_Production.png'),
  "ジグザグ草原": require('../../assets/MapImages/Snake_Prairie.png'),
  "禅の庭園": require('../../assets/MapImages/Zen_Garden.png'),
  "大いなる入口": require('../../assets/MapImages/The_Great_Open.png'),
  "グランドカナル": require('../../assets/MapImages/Canal_Grande.png'),
  "猿の迷路": require('../../assets/MapImages/Monkey_Maze.png'),
  "果てしなき不運": require('../../assets/MapImages/Infinite_Doom.png'),
  "隠れ家": require('../../assets/MapImages/Hideout.png'),
  "不屈の精神": require('../../assets/MapImages/No_Surrender.png'),
  "セカンドチャンス": require('../../assets/MapImages/Second_Try.png'),
  "静かな広場": require('../../assets/MapImages/Sneaky_Fields.png'),
  "サニーサッカー": require('../../assets/MapImages/Sunny_Soccer.png'),
  "スーパービーチ": require('../../assets/MapImages/Super_Beach.png'),
  "トリッキー": require('../../assets/MapImages/Trickey.png'),
  "トリプル・ドリブル": require('../../assets/MapImages/Triple_Dribble.png'),
  "鉄壁の護り": require('../../assets/MapImages/Backyard_Bowl.png'),
  "ビーチボール": require('../../assets/MapImages/Beach_Ball.png'),
  "中央コート": require('../../assets/MapImages/Center_Stage.png'),
  "ペナルティキック": require('../../assets/MapImages/Penalty_Kick.png'),
  "ピンボールドリーム": require('../../assets/MapImages/Pinball_Dreams.png'),
  "狭き門": require('../../assets/MapImages/Pinhole_Punt.png'),
  "レイヤーケーキ": require('../../assets/MapImages/Layer_Bake.png'),
  "ミルフィーユ": require('../../assets/MapImages/Layer_Cake.png'),
  "ガールズファイト": require('../../assets/MapImages/Petticoat_Duel.png'),
  "四重傷": require('../../assets/MapImages/Quad_Damage.png'),
  "言い訳厳禁": require('../../assets/MapImages/No_Excuses.png'),
  "見えざる大蛇": require('../../assets/MapImages/Shrouding_Serpent.png'),
  "橋の彼方": require('../../assets/MapImages/Bridge_Too_Far.png'),
  "フローラルレイク": require('../../assets/MapImages/Lilygear_Lakes.png'),
  "グルメタウン": require('../../assets/MapImages/Local_Restaurants.png'),
  "禁断の33": require('../../assets/MapImages/Mystical_Thirty_Three.png'),
  "ウェーブフォーム": require('../../assets/MapImages/Waveform.png'),
  "コスモコア": require('../../assets/MapImages/Core_Of_Orbit.png'),
  "リリーラグーン": require('../../assets/MapImages/Lilypond_Grove.png'),
  "ピットストップ": require('../../assets/MapImages/Pit_Stop.png'),
  "プレーンテキスト": require('../../assets/MapImages/Plain_Text.png'),
  "乾燥地帯": require('../../assets/MapImages/Dry_Season.png'),
  "インパクトゾーン": require('../../assets/MapImages/Brace_For_Impact.png'),
  "サボテン王国": require('../../assets/MapImages/Priceless_Cactus.png'),
  "スカイハイランナー": require('../../assets/MapImages/Rooftop_Runners.png'),
  "クリスタルホール": require('../../assets/MapImages/Bejeweled.png'),
  "フィッシングヘイブン": require('../../assets/MapImages/Fishing_Bed.png'),
  "淀みなき泉": require('../../assets/MapImages/Flowing_Springs.png'),
  "新天地": require('../../assets/MapImages/New_Horizons.png'),
  "リスキーロード": require('../../assets/MapImages/Healthy_Middle_Ground.png'),
  "一触爆発": require('../../assets/MapImages/Close_Quarters.png'),
  "深緑の古道": require('../../assets/MapImages/Mossy_Crossing.png'),
  "シークレットガーデン": require('../../assets/MapImages/Covered_Garden.png'),
  "ボヨヨンボウル": require('../../assets/MapImages/Bouncy_Bowl.png'),
  "氷点下": require('../../assets/MapImages/Below_Zero.png'),
  "クールボックス": require('../../assets/MapImages/Cool_Box.png'),
  "スターガーデン": require('../../assets/MapImages/Starr_Garden.png'),
  "スーパーセンター": require('../../assets/MapImages/Super_Center.png'),
  "ため池大決戦": require('../../assets/MapImages/Big_Battle_Basin.png'),
  "ポーラーパーク": require('../../assets/MapImages/Polar_Park.png'),
  "極寒採掘": require('../../assets/MapImages/Arctic_Extraction.png'),
  "シズリングチャンバー": require('../../assets/MapImages/Sizzling_Chambers.png'),
  "ガーデンクラッシャーズ": require('../../assets/MapImages/Courtyard_Clashers.png'),
  "ハリケーン": require('../../assets/MapImages/Hurricane.png'),
  "シベリアの決戦": require('../../assets/MapImages/Siberian_Stand_Off.png'),
  "オープンゾーン": require('../../assets/MapImages/Open_Zone.png'),
  "幻想の樹海": require('../../assets/MapImages/Shimmering_Forest.png'),
  "冷血サバイバル": require('../../assets/MapImages/Survival_Of_The_Meanest.png'),
  "狂気の幻影": require('../../assets/MapImages/Mirages_Of_Madness.png'),
  "ストレージスタジアム": require('../../assets/MapImages/Stockpile_Stadium.png'),
  "トレジャーアイランド": require('../../assets/MapImages/Treasure_Island.png'),
  "一触即発": require('../../assets/MapImages/Close_Quarters.png'),
  "アンハッピーアリーナ": require('../../assets/MapImages/Unhappy_Arena.png'),
  "ディープエンド": require('../../assets/MapImages/Deep_End.png'),
  "フローズントラップ": require('../../assets/MapImages/Arctic_Ambush.png'),
  "近くの地下室": require('../../assets/MapImages/Crispy_Crypt.png'),
  
};

// ゲームモードのアイコン定義
export const gameModeIcons = {
  gemGrab: require('../../assets/GameModeIcons/gem_grab_icon.png'),
  brawlBall: require('../../assets/GameModeIcons/brawl_ball_icon.png'),
  heist: require('../../assets/GameModeIcons/heist_icon.png'),
  knockout: require('../../assets/GameModeIcons/knock_out_icon.png'),
  bounty: require('../../assets/GameModeIcons/bounty_icon.png'),
  hotZone: require('../../assets/GameModeIcons/hot_zone_icon.png'),
  wipeout: require('../../assets/GameModeIcons/wipeout_icon.png'),
  brawlBall5v5: require('../../assets/GameModeIcons/5v5brawl_ball_icon.png'),
  wipeout5v5: require('../../assets/GameModeIcons/5v5wipeout_icon.png'),
  duels: require('../../assets/GameModeIcons/duels_icon.png'),
  showdown: require('../../assets/GameModeIcons/showdown_icon.png'),
  brawlHockey: require('../../assets/GameModeIcons/brawl_hockey.png'),
  battleRoyale: require('../../assets/GameModeIcons/showdown_icon.png'), // 追加: バトルロワイヤル用のアイコン
};

// ゲームモード設定
export const GAME_MODES = {
  GEM_GRAB: { name: "gemGrab", color: "#DA70D6", icon: gameModeIcons.gemGrab },
  BRAWL_BALL: { name: "brawlBall", color: "#cccccc", icon: gameModeIcons.brawlBall },
  HEIST: { name: "heist", color: "#cccccc", icon: gameModeIcons.heist },
  KNOCKOUT: { name: "knockout", color: "#FFA500", icon: gameModeIcons.knockout },
  BOUNTY: { name: "bounty", color: "#DA70D6", icon: gameModeIcons.bounty },
  HOT_ZONE: { name: "hotZone", color: "#cccccc", icon: gameModeIcons.hotZone },
  BRAWL_HOCKEY: { name: "brawlHockey", color: "#cccccc", icon: gameModeIcons.brawlHockey },
  WIPEOUT: { name: "wipeout", color: "#FF4500", icon: gameModeIcons.wipeout },
  BRAWL_BALL_5V5: { name: "brawlBall5v5", color: "#4169E1", icon: gameModeIcons.brawlBall5v5 },
  WIPEOUT_5V5: { name: "wipeout5v5", color: "#9932CC", icon: gameModeIcons.wipeout5v5 },
  DUEL: { name: "duel", color: "#FF0000", icon: gameModeIcons.duels },
  BATTLE_ROYALE: { name: "battleRoyale", color: "#99ff66", icon: gameModeIcons.showdown },
};

// ローテーションモードの定義
export const rotatingModes = {
  heist: {
    modes: [
      { name: "ホットゾーン", icon: gameModeIcons.hotZone },
      { name: "強奪", icon: gameModeIcons.heist },
    ]
  },
  brawlBall5v5: {
    modes: [
      { name: "5vs5殲滅", icon: gameModeIcons.wipeout5v5 },
      { name: "5vs5ブロストライカー", icon: gameModeIcons.brawlBall5v5 },
    ]
  },
  duel: {
    modes: [
      { name: "殲滅", icon: gameModeIcons.wipeout },
      { name: "賞金稼ぎ", icon: gameModeIcons.bounty },
      { name: "デュエル", icon: gameModeIcons.duels },
    ]
  }
};

const RNAKED_MAPS = {
  gemGrab: [
    "ごつごつ坑道",
    "アンダーマイン",
    "ダブルレール",
    "エメラルドの要塞"
  ],
  brawlBall: [
    "静かな広場",
    "中央コート",
    "ピンボールドリーム",
    "トリプル・ドリブル"
  ],
  bounty: [
    "流れ星",
    "隠れ家",
    "ミルフィーユ",
    "乾燥地帯"
  ],
  knockout: [
    "ベルの岩",
    "燃える不死鳥",
    "オープンフィールド",
    "新たなる地平"
  ],
  hotZone: [
    "ビートルバトル",
    "オープンビジネス",
    "パラレルワールド",
    "炎のリング"
  ],
  brawlHockey: [
    "スーパーセンター",
    "クールボックス",
    "氷点下",
    "スターガーデン"
  ],
};

// マップリストの定義
export const maps = {
  battleRoyale: [
    "天国と地獄", "空飛ぶ絨毯", "リリーラグーン", "禁断の33", "岩壁の決戦", "安全センター", "ガイコツ川", "ウェーブフォーム", "酸性湖", "激動の洞窟", "コスモコア", "ダブルトラブル"
  ],
  knockout: [
    "四段階層", "ゴールドアームの渓谷", "白熱対戦", "リスキーロード", "深緑の古道", "新たなる地平", "新天地", "オープンフィールド", "ベルの岩", "一触即発", "ディープエンド", "淀みなき泉", 
  ],
  gemGrab: [
    "エメラルドの要塞", "ごつごつ坑道", "ラストストップ", "フローラルレイク", "グルメタウン", "オープンスペース", "寂れたアーケード", "アンダーマイン", "クリスタルアーケード", "サボテンの罠", "ダブルレール", "森林伐採", 
  ],
  heist: [
    "フィッシングヘイブン", "ピットストップ", "オープンビジネス", "プレーンテキスト", "オープンゾーン", "安全地帯", "炎のリング", "橋の彼方", "クリスタルホール", "ホットポテト", "ビートルバトル", "どんぱち谷", 
  ],
  brawlBall5v5: [
    "幻想の樹海", "冷血サバイバル", "狂気の幻影", "ストレージスタジアム", "トレジャーアイランド", "アンハッピーアリーナ", "合流地点", "凍てつく波紋", "フローズントラップ", "近くの地下室", "ため池大決戦", "ポーラーパーク", "極寒採掘", "シズリングチャンバー", "ガーデンクラッシャーズ", "シベリアの決戦", 
  ],
  brawlBall: [
    "スカイハイランナー", "セカンドチャンス", "静かな広場", "サニーサッカー", "スーパービーチ", "トリッキー", "トリプル・ドリブル", "鉄壁の護り", "ビーチボール", "ピンボールドリーム", "狭き門", "サボテン王国", 
  ],
  duel: [
    "果てしなき不運", "隠れ家", "不屈の精神", "レイヤーケーキ", "ミルフィーユ", "見えざる大蛇", "暴徒のオアシス", "言い訳厳禁", "常勝街道", "スパイスプロダクション", "流れ星", "禅の庭園", "大いなる入口", "インパクトゾーン", "ハリケーン", "シークレットガーデン", "乾燥地帯", "猿の迷路", 
  ],
  brawlHockey: [
    "氷点下", "クールボックス", "ボヨヨンボウル", "スターガーデン",
  ],
};

// 言語設定の取得
const getCurrentLanguage = async (): Promise<'en' | 'ja' | 'ko' | 'es' | 'ar' | 'fr' | 'zhTw'> => {
  try {
    const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
    return (savedLanguage as 'en' | 'ja' | 'ko' | 'es' | 'ar' | 'fr' | 'zhTw') || 'en';
  } catch (error) {
    console.error('Error getting language:', error);
    return 'en';
  }
};

// マップデータの処理
const processMapsData = async (maps: BrawlifyMap[]): Promise<Record<string, MapData>> => {
  const processedData: Record<string, MapData> = {};
  const currentLang = await getCurrentLanguage();

  for (const map of maps) {
    const mapName = map.name.ja;
    
    if (!mapName) {
      console.warn('Missing map name for map:', map);
      continue;
    }
    
    processedData[mapName] = {
      name: mapName,
      nameEn: map.name.en,
      nameKo: map.name.ko,
      nameEs: map.name.es,
      nameAr: map.name.ar,
      nameFr: map.name.fr,
      nameZhTw: map.name.zhTw,
      gameMode: map.gameMode,
      image: mapImages[mapName] || null,
      description: map.description,
      recommendedBrawlers: map.recommendedBrawlers.map(brawler => ({
        name: brawler.name,
        reason: brawler.reason || '',
        power: brawler.power
      }))
    };
  }

  return processedData;
};

// マップデータの初期化
export const initializeMapData = async (): Promise<Record<string, MapData>> => {
  if (isInitialized) return mapsDataCache;
  
  try {
    const processedData = await processMapsData(mapData.list);
    mapsDataCache = processedData;
    isInitialized = true;
    return processedData;
  } catch (error) {
    console.error('Error initializing map data:', error);
    throw error;
  }
};

// 言語変更時のデータ更新
export const refreshMapDataWithNewLanguage = async (): Promise<void> => {
  try {
    mapsDataCache = await processMapsData(mapData.list);
  } catch (error) {
    console.error('Error refreshing map data:', error);
  }
};

// マップデータの取得
export const getMapData = (mapId: string): MapData | undefined => {
  if (!isInitialized) {
    console.warn('Map data not initialized');
    return undefined;
  }

  try {
    const map = mapsDataCache[mapId];
    if (map) return map;

    return Object.values(mapsDataCache).find(
      m => m.name === mapId || m.nameEn === mapId || m.nameKo === mapId
    );
  } catch (error) {
    console.error('Error getting map data:', error);
    return undefined;
  }
};

// モード名のローカライズ
export const getLocalizedModeName = (mode: string, language: string): string => {
  const modeTranslations: { [key: string]: { [key: string]: string } } = {
    gemGrab: {
      ja: "エメラルドハント",
      en: "Gem Grab",
      ko: "젬 그랩",
      es: "ATRAPAGEMAS",
      ar: "جمع الجواهر",
      fr: "RAZZIA DE GEMMES",
      zhTw: "寶石爭奪戰",

    },
    brawlBall: {
      ja: "ブロストライカー",
      en: "Brawl Ball",
      ko: "브롤 볼",
      es: "BALÓN BRAWL",
      ar: "كرة العراك",
      fr: "BRAWLBALL",
      zhTw: "亂鬥足球",
    },
    heist: {
      ja: "強奪",
      en: "Heist",
      ko: "하이스트",
      es: "ATRACO",
      ar: "السطو",
      fr: "BRAQUAGE",
      zhTw: "金庫攻防戰",
    },
    knockout: {
      ja: "ノックアウト",
      en: "Knockout",
      ko: "녹아웃",
      es: "NOQUEO",
      ar: "الضربة القاضية",
      fr: "HORS-JEU",
      zhTw: "",
    },
    bounty: {
      ja: "賞金稼ぎ",
      en: "Bounty",
      ko: "바운티",
      es: "CAZA ESTELAR",
      ar: "الجائزة",
      fr: "PRIME",
      zhTw: "搶星大作戰",
    },
    hotZone: {
      ja: "ホットゾーン",
      en: "Hot Zone",
      ko: "핫 존",
      es: "ZONA RESTRINGIDA",
      ar: "المنطقة الساخنة",
      fr: "ZONE RÉSERVÉE",
      zhTw: "據點搶奪戰",
    },
    brawlHockey: {
      ja: "ブロスタホッケー",
      en: "Brawl Hockey",
      ko: "브롤 하키",
      es: "BRAWL HOCKEY",
      ar: "الهوكي",
      fr: "BRAWL HOCKEY",
      zhTw: "亂鬥曲棍球",
    },
    battleRoyale: {
      ja: "バトルロワイヤル",
      en: "Battle Royale",
      ko: "배틀 로얄",
      es: "BATTLE ROYALE",
      ar: "باتل رويال",
      fr: "BATTLE ROYALE",
      zhTw: "大逃殺",
    },
    brawlBall5v5: {
      ja: "5vs5ブロストライカー",
      en: "5v5 Brawl Ball",
      ko: "5vs5 브롤 볼",
      es: "5vs5 BALÓN BRAWL",
      ar: "5v5 كرة العراك",
      fr: "5v5 BRAWLBALL",
      zhTw: "5v5亂鬥足球",
    },
    wipeout: {
      ja: "殲滅",
      en: "Wipeout",
      ko: "와이프아웃",
      es: "ANIQUILACIÓN",
      ar: "الإبادة",
      fr: "ÉLIMINATION",
      zhTw: "殲滅戰",
    },
    wipeout5v5: {
      ja: "5vs5殲滅",
      en: "5v5 Wipeout",
      ko: "5vs5 와이프아웃",
      es: "5vs5 ANIQUILACIÓN",
      ar: "5v5 الإبادة",
      fr: "5v5 ÉLIMINATION",
      zhTw: "5v5殲滅戰",
    },
    duel: {
      ja: "デュエル",
      en: "Duel",
      ko: "듀얼",
      es: "DUELO",
      ar: "النزال",
      fr: "DUEL",
      zhTw: "決鬥",
    }
  };

  return modeTranslations[mode]?.[language] || mode;
};

// マップ名のローカライズ
const getLocalizedMapName = (mapName: string): { [key: string]: string } => {
  const map = mapData.list.find(m => m.name.ja === mapName);
  if (!map) return { ja: mapName, en: mapName, ko: mapName };
  return map.name;
};

// モード別マップデータの作成
export const createMapsByMode = async (): Promise<MapsByMode> => {
  const currentLanguage = await getCurrentLanguage();
  const mapsByMode: MapsByMode = {};

  for (const [mode, maps] of Object.entries(RNAKED_MAPS)) {
    const translatedMode = getLocalizedModeName(mode, currentLanguage);
    mapsByMode[translatedMode] = maps.map(mapName => ({
      name: getLocalizedMapName(mapName)[currentLanguage],
      image: mapImages[mapName]
    }));
  }

  return mapsByMode;
};

// マップ情報の取得
export const getMapInfo = (modeName: string, mapName: string) => {
  const mode = Object.values(GAME_MODES).find(m => getLocalizedModeName(m.name, 'ja') === modeName);
  if (!mode) return null;

  return {
    modeName,
    modeColor: mode.color,
    modeIcon: mode.icon,
    mapImage: mapImages[mapName]
  };
};

// ゲームデータの取得（日時指定）
export const getGameDataForDateTime = (
  gameMode: keyof typeof maps,
  date: Date,
  updateHour: number,
  hoursOffset: number = 0
): GameModeData => {
  // マップの基準日
  const mapBaseDate = new Date(2024, 0, 1);
  mapBaseDate.setHours(updateHour, 0, 0, 0);
  
  // モードの基準日
  const modeBaseDate = new Date(2024, 11, 27);
  
  // 現在時刻から指定された時間数後の日時を計算
  const targetDate = new Date(date.getTime() + (hoursOffset * 60 * 60 * 1000));
  const currentHour = targetDate.getHours();
  
  // 更新時刻前なら前日の更新時刻を基準にする
  if (currentHour < updateHour) {
    targetDate.setDate(targetDate.getDate() - 1);
  }
  targetDate.setHours(updateHour, 0, 0, 0);
  
  // マップの計算
  const mapTimeDiff = targetDate.getTime() - mapBaseDate.getTime();
  const mapDaysDiff = Math.floor(mapTimeDiff / (1000 * 60 * 60 * 24)) + 5;
  
  const modeMapList = maps[gameMode] || [];
  const mapIndex = mapDaysDiff % modeMapList.length;
  const map = modeMapList[mapIndex >= 0 ? mapIndex : (modeMapList.length + mapIndex)];

  // モードの計算
  let mode = null;
  if (rotatingModes[gameMode]) {
    const modes = rotatingModes[gameMode].modes;
    const modeTimeDiff = targetDate.getTime() - modeBaseDate.getTime();
    const modeDaysDiff = Math.floor(modeTimeDiff / (1000 * 60 * 60 * 24));
    const modeIndex = modeDaysDiff % modes.length;
    mode = modes[modeIndex >= 0 ? modeIndex : (modes.length + modeIndex)];
  }

  return { map, mode };
};

// 補助関数群
export const getAllMaps = (): MapData[] => Object.values(mapsDataCache);

export const getMapsByGameMode = (gameMode: string): MapData[] => 
  Object.values(mapsDataCache).filter(map => map.gameMode === gameMode);

export const getMapsByDifficulty = (difficulty: string): MapData[] => 
  Object.values(mapsDataCache).filter(map => difficulty === 'normal');

export const getRecommendedMapsForBrawler = (brawlerName: string): MapData[] => 
  Object.values(mapsDataCache).filter(map => 
    map.recommendedBrawlers.some(b => b.name === brawlerName && b.power >= 4)
  );

// 既存の関数は互換性のために残す
export const getMapForDateTime = (
  gameMode: keyof typeof maps, 
  date: Date,
  updateHour: number,
  hoursOffset: number = 0
): string => {
  return getGameDataForDateTime(gameMode, date, updateHour, hoursOffset).map;
};

export const getCurrentMode = (modeType: string, date: Date): GameMode | null => {
  if (!rotatingModes[modeType]) return null;
  
  const modes = rotatingModes[modeType].modes;
  const baseDate = new Date(2024, 11, 27);
  const daysDiff = Math.floor((date.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
  const rotationIndex = daysDiff % modes.length;
  return modes[rotationIndex >= 0 ? rotationIndex : (modes.length + rotationIndex)];
};

// 一覧表示用に追加した関数

/**
 * 特定のゲームモードで利用可能なすべてのマップIDを取得する
 * @param {string} gameMode - ゲームモード名
 * @returns {Array} マップIDの配列
 */
export const getAvailableMapsForMode = (gameMode: keyof typeof maps): string[] => {
  return maps[gameMode] || [];
};

/**
 * マップIDからゲームモードを特定する
 * @param {string} mapId - マップID
 * @returns {string} ゲームモード名
 */
export const getGameModeForMap = (mapId: string): string => {
  // 各モードのマップリストをチェックして、どのモードに属するかを判定
  for (const [mode, mapList] of Object.entries(maps)) {
    if (mapList.includes(mapId)) {
      switch (mode) {
        case 'battleRoyale': return 'BATTLE_ROYALE';
        case 'knockout': return 'KNOCKOUT';
        case 'gemGrab': return 'GEM_GRAB';
        case 'heist': return 'HEIST';
        case 'brawlBall5v5': return 'BRAWL_BALL_5V5';
        case 'brawlBall': return 'BRAWL_BALL';
        case 'duel': return 'DUEL';
        case 'brawlHockey': return 'BRAWL_HOCKEY';
        default: return mode.toUpperCase();
      }
    }
  }
  
  return 'UNKNOWN';
};

/**
 * マップリストをフィルタリングする関数
 * @param {Array} mapList - マップリスト
 * @param {Object} filters - フィルタリング条件
 * @returns {Array} フィルタリングされたマップリスト
 */
export const filterMaps = (mapList, filters) => {
  return mapList.filter(map => {
    // モードによるフィルタリング
    if (filters.modes && filters.modes.length > 0) {
      const mapMode = getGameModeForMap(map.currentMap);
      if (!filters.modes.includes(mapMode)) {
        return false;
      }
    }
    
    // マップ名によるフィルタリング
    if (filters.searchText && filters.searchText.length > 0) {
      const mapName = map.currentMap.toLowerCase();
      const searchText = filters.searchText.toLowerCase();
      if (!mapName.includes(searchText)) {
        return false;
      }
    }
    
    return true;
  });
};

// Interface exports
export interface MapsByMode {
  [key: string]: Array<{
    name: string;
    image: any;
  }>;
}

export interface GameModeConfig {
  name: string;
  color: string;
  icon: any;
}

export interface ModeMapData {
  name: string;
  image: any;
}