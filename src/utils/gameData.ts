//gameData.ts
export const rotatingModes: RotatingModes = {
  heist: {
    modes: [
      {
        name: "強奪",
        icon: require('../../assets/GameModeIcons/heist_icon.png')
      },
      {
        name: "ホットゾーン",
        icon: require('../../assets/GameModeIcons/hot_zone_icon.png')
      }
    ]
  },
  brawlBall5v5: {
    modes: [
      {
        name: "5vs5ブロストライカー",
        icon: require('../../assets/GameModeIcons/brawl_ball_icon.png')
      },
      {
        name: "5vs5殲滅",
        icon: require('../../assets/GameModeIcons/wipeout_icon.png')
      }
    ]
  },
  duel: {
    modes: [
      {
        name: "デュエル",
        icon: require('../../assets/GameModeIcons/duels_icon.png')
      },
      {
        name: "殲滅",
        icon: require('../../assets/GameModeIcons/wipeout_icon.png')
      },
      {
        name: "賞金稼ぎ",
        icon: require('../../assets/GameModeIcons/bounty_icon.png')
      },
    ]
  }
};

export const mapImages: MapImages = {
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
  "廃れたアーケード": require('../../assets/MapImages/Rustic_Arcade.png'),
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
  "鉄壁の守り": require('../../assets/MapImages/Backyard_Bowl.png'),
  "ビーチボール": require('../../assets/MapImages/Beach_Ball.png'),
  "中央コート": require('../../assets/MapImages/Center_Stage.png'),
  "ペナルティキック": require('../../assets/MapImages/Penalty_Kick.png'),
  "ピンボールドリーム": require('../../assets/MapImages/Pinball_Dreams.png'),
  "狭き門": require('../../assets/MapImages/Pinhole_Punt.png')
};

export const maps: GameMaps = {
  battleRoyale: [
    "枯れた川", "天国と地獄", "空飛ぶ絨毯", "囚われた島", "狙撃手たちの楽園","岩壁の決戦", 
    "安全センター", "ガイコツ川", "酸性湖","激動の洞窟", "暗い廊下", "ダブルトラブル",
  ],
  knockout: [
    "四段階層", "ゴールドアームの渓谷", "白熱対戦", "新たなる地平", "オープンフィールド", "生い茂る廃墟", 
    "バキューン神殿", "極小列島", "双頭の川", "ベルの岩", "密林の奥地", "燃える不死鳥",
  ],
  emeraldHunt: [
    "クールロック", "エメラルドの要塞" ,"ごつごつ坑道", "ラストストップ", "トロッコの狂気", "オープンスペース",
    "廃れたアーケード", "アンダーマイン", "クリスタルアーケード", "サボテンの罠", "ダブルレール", "森林伐採",
  ],
  heist: [
    "どんぱち谷", "オープンビジネス", "安全地帯", "パラレルワールド", "安全地帯・改","炎のリング", 
    "大いなる湖", "ウォータースポーツ", "GG 2.0", "ビートルバトル", "ホットポテト", "喧騒居住地"
  ],
  brawlBall5v5: [
    "凍てつく波紋", "ツルツルロード", "大波", 
    "ガクブル公園", "クールシェイプ", "フロスティトラック", "サスペンダーズ", "合流地点", 
  ],
  brawlBall: [
    "ピンボールドリーム", "狭き門", "セカンドチャンス", "静かな広場", "サニーサッカー", "スーパービーチ", 
    "トリッキー", "トリプル・ドリブル", "鉄壁の守り", "ビーチボール", "中央コート", "ペナルティキック"
  ],
  duel: [
    "不屈の精神", "レイヤーケーキ", "ミルフィーユ", "ガールズファイト", "四重奏", "言い訳厳禁", "見えざる大蛇", "暴徒のオアシス", 
    "流れ星", "常勝街道", "スパイスプロダクション","ジグザグ草原", "禅の庭園", 
    "大いなる入口", "グランドカナル", "猿の迷路", "果てしなき不運", "隠れ家", 
  ]
};

export const getCurrentMode = (modeType: string, date: Date): GameMode | null => {
  if (!rotatingModes[modeType]) return null;
  
  const modes = rotatingModes[modeType].modes;
  const baseDate = new Date(2024, 11, 27);
  const daysDiff = Math.floor((date.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
  const rotationIndex = daysDiff % modes.length;
  return modes[rotationIndex >= 0 ? rotationIndex : (modes.length + rotationIndex)];
};

export const getMapForDate = (gameMode: keyof GameMaps, daysOffset: number): string => {
  // 基準日を2024年1月1日に設定し、+5の調整を加える
  const baseDate = new Date(2024, 0, 1);
  const today = new Date();
  const targetDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + daysOffset);
  
  const daysDiff = Math.floor((targetDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24)) + 5;
  const modeMapList = maps[gameMode] || [];
  const mapIndex = daysDiff % modeMapList.length;
  
  return modeMapList[mapIndex >= 0 ? mapIndex : (modeMapList.length + mapIndex)];
};