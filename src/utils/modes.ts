// src/utils/modes.ts

// モード名のマッピング
const modeNameMapping = {
  // 日本語のモード名をキーとして、他の言語の対応を設定
  "ガチバトル": {
    en: "Ranked Battle",
    ko: "경쟁전",
    icon: require('../../assets/GameModeIcons/rank_front.png')
  },
  "デュオバトルロワイヤル": {
    en: "Duo Showdown",
    ko: "듀오 쇼다운",
    icon: require('../../assets/GameModeIcons/duo_showdown_icon.png')
  },
  "エメラルドハント": {
    en: "Gem Grab",
    ko: "젬 그랩",
    icon: require('../../assets/GameModeIcons/gem_grab_icon.png')
  },
  "ブロストライカー": {
    en: "Brawl Ball",
    ko: "브롤 볼",
    icon: require('../../assets/GameModeIcons/brawl_ball_icon.png')
  },
  "強奪": {
    en: "Heist",
    ko: "하이스트",
    icon: require('../../assets/GameModeIcons/heist_icon.png')
  },
  "ノックアウト": {
    en: "Knockout",
    ko: "녹아웃",
    icon: require('../../assets/GameModeIcons/knock_out_icon.png')
  },
  "賞金稼ぎ": {
    en: "Bounty",
    ko: "바운티",
    icon: require('../../assets/GameModeIcons/bounty_icon.png')
  },
  "殲滅": {
    en: "Wipeout",
    ko: "섬멸전",
    icon: require('../../assets/GameModeIcons/wipeout_icon.png')
  },
  "ホットゾーン": {
    en: "Hot Zone",
    ko: "핫 존",
    icon: require('../../assets/GameModeIcons/hot_zone_icon.png')
  },
  "5vs5ブロストライカー": {
    en: "5v5 Brawl Ball",
    ko: "5대5 브롤 볼",
    icon: require('../../assets/GameModeIcons/5v5brawl_ball_icon.png')
  },
  "5vs5殲滅": {
    en: "5v5 Wipeout",
    ko: "5대5 섬멸전",
    icon: require('../../assets/GameModeIcons/5v5wipeout_icon.png')
  }
};

// モード名を現在の言語に変換する関数
const getLocalizedModeName = (jaModeName: string, currentLanguage: string) => {
  const modeInfo = modeNameMapping[jaModeName];
  if (!modeInfo) return jaModeName;
  return currentLanguage === 'ja' ? jaModeName : modeInfo[currentLanguage] || jaModeName;
};

// getModeIcon関数を追加
const getModeIcon = (modeName: string) => {
  return modeNameMapping[modeName]?.icon || require('../../assets/GameModeIcons/4800003.png');
};

const getCurrentModes = (currentLanguage: string) => {
  const modes = [
    {
      name: "ガチバトル",
      color: "#99ff66",
    },
    {
      name: "デュオバトルロワイヤル",
      color: "#99ff66",
    },
    {
      name: "エメラルドハント",
      color: "#DA70D6",
    },
    {
      name: "ブロストライカー",
      color: "#cccccc",
    },
    {
      name: "強奪",
      color: "#cccccc",
    },
    {
      name: "ノックアウト",
      color: "#FFA500",
    },
    {
      name: "賞金稼ぎ",
      color: "#DA70D6",
    },
    {
      name: "殲滅",
      color: "#DA70D6",
    },
    {
      name: "ホットゾーン",
      color: "#cccccc",
    },
    {
      name: "5vs5ブロストライカー",
      color: "#FFA500",
    },
    {
      name: "5vs5殲滅",
      color: "#FFA500",
    },
  ];

  return modes.map(mode => ({
    ...mode,
    name: getLocalizedModeName(mode.name, currentLanguage),
    icon: getModeIcon(mode.name)
  }));
};

export { getCurrentModes, getLocalizedModeName, getModeIcon, modeNameMapping };