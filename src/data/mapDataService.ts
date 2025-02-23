// mapDataService.ts
import { MapData, GameMode, GameModeData } from '../types/types';
import mapData from './mapAPI.json';
import characterData from './characterAPI.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LocalizedText {
  ja: string;
  en: string;
  ko: string;
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
  "トリプルドリブル": require('../../assets/MapImages/Triple_Dribble.png'),
  "鉄壁の守り": require('../../assets/MapImages/Backyard_Bowl.png'),
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
};

// ゲームモード設定
export const GAME_MODES = [
  { name: "gemGrab", color: "#DA70D6", icon: gameModeIcons.gemGrab },
  { name: "brawlBall", color: "#cccccc", icon: gameModeIcons.brawlBall },
  { name: "heist", color: "#cccccc", icon: gameModeIcons.heist },
  { name: "knockout", color: "#FFA500", icon: gameModeIcons.knockout },
  { name: "bounty", color: "#DA70D6", icon: gameModeIcons.bounty },
  { name: "hotZone", color: "#cccccc", icon: gameModeIcons.hotZone },
];

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
    "ラストストップ",
  ],
  brawlBall: [
    "トリプルドリブル",
    "静かな広場",
    "中央コート",
    "ピンボールドリーム",
  ],
  heist: [
    "安全地帯",
    "ホットポテト",
    "どんぱち谷",
    "橋の彼方",
  ],
  knockout: [
    "ベルの岩",
    "燃える不死鳥",
    "オープンフィールド",
    "ゴールドアームの渓谷",
  ],
  bounty: [
    "流れ星",
    "隠れ家",
    "ジグザグ草原",
    "グランドカナル",
  ],
  hotZone: [
    "炎のリング",
    "ビートルバトル",
    "オープンビジネス",
    "パラレルワールド",
  ],
};

// マップリストの定義
export const maps = {
  battleRoyale: [
    "枯れた川", "天国と地獄", "空飛ぶ絨毯", "囚われた島", "狙撃手たちの楽園",
    "岩壁の決戦", "安全センター", "ガイコツ川", "酸性湖", "激動の洞窟", 
    "暗い廊下", "ダブルトラブル",
  ],
  knockout: [
    "ゴールドアームの渓谷", "白熱対戦", "新たなる地平", "オープンフィールド", 
    "生い茂る廃墟", "バキューン神殿", "極小列島", "双頭の川", "ベルの岩", 
    "密林の奥地", "燃える不死鳥", "四段階層", 
  ],
  gemGrab: [
    "エメラルドの要塞", "ごつごつ坑道", "ラストストップ", "トロッコの狂気", 
    "オープンスペース", "寂れたアーケード", "クールロック", "アンダーマイン", 
    "クリスタルアーケード", "サボテンの罠", "ダブルレール", "森林伐採", 
  ],
  heist: [
    "オープンビジネス", "安全地帯", "パラレルワールド", "安全地帯・改",
    "炎のリング", "大いなる湖", "ウォータースポーツ", "GG 2.0", 
    "ビートルバトル", "ホットポテト", "喧騒居住地", "どんぱち谷", 
  ],
  brawlBall5v5: [
    "ツルツルロード", "大波", "ガクブル公園", "クールシェイプ", 
    "フロスティトラック", "サスペンダーズ", "合流地点", "凍てつく波紋", 
  ],
  brawlBall: [
    "狭き門", "セカンドチャンス", "静かな広場", "サニーサッカー", 
    "スーパービーチ", "トリッキー", "トリプルドリブル", "鉄壁の守り", 
    "ビーチボール", "中央コート", "ペナルティキック", "ピンボールドリーム", 
  ],
  duel: [
    "レイヤーケーキ", "ミルフィーユ", "ガールズファイト", "四重傷", 
    "言い訳厳禁", "見えざる大蛇", "暴徒のオアシス", "流れ星", "常勝街道",
    "スパイスプロダクション", "ジグザグ草原", "禅の庭園", "大いなる入口", 
    "グランドカナル", "猿の迷路", "果てしなき不運", "隠れ家", "不屈の精神", 
  ]
};

// 言語設定の取得
const getCurrentLanguage = async (): Promise<'en' | 'ja' | 'ko'> => {
  try {
    const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
    return (savedLanguage as 'en' | 'ja' | 'ko') || 'en';
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
const getLocalizedModeName = (mode: string, language: string): string => {
  const modeTranslations: { [key: string]: { [key: string]: string } } = {
    gemGrab: {
      ja: "エメラルドハント",
      en: "Gem Grab",
      ko: "젬 그랩"
    },
    brawlBall: {
      ja: "ブロストライカー",
      en: "Brawl Ball",
      ko: "브롤 볼"
    },
    heist: {
      ja: "強奪",
      en: "Heist",
      ko: "하이스트"
    },
    knockout: {
      ja: "ノックアウト",
      en: "Knockout",
      ko: "녹아웃"
    },
    bounty: {
      ja: "賞金稼ぎ",
      en: "Bounty",
      ko: "바운티"
    },
    hotZone: {
      ja: "ホットゾーン",
      en: "Hot Zone",
      ko: "핫 존"
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
  const mode = GAME_MODES.find(m => getLocalizedModeName(m.name, 'ja') === modeName);
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