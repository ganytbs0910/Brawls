// src/utils/modes.ts

import { ja } from "../i18n/settingsScreen";

// モード名のマッピング
const modeNameMapping = {
  // 日本語のモード名をキーとして、他の言語の対応を設定
  "ガチバトル": {
    ja: "ガチバトル",
    en: "Ranked",
    ko: "경쟁전",
    es: "COMPETITIVO",
    ar: "المصنف",
    fr: "CLASSÉ",
    zhTw: "排位賽",
    icon: require('../../assets/GameModeIcons/rank_front.png')
  },
  "バトルロイヤル": {
    ja: "バトルロイヤル",
    en: "Battle Royale",
    ko: "쇼다운",
    es: "SUPERVIVENCIA",
    ar: "المواجهة الحاسمة",
    fr: "SURVIVANT",
    zhTw: "荒野生死鬥",
    icon: require('../../assets/GameModeIcons/showdown_icon.png')
  },
  "ソロバトルロイヤル": {
    ja: "ソロバトルロイヤル",
    en: "Solo Battle Royale",
    ko: "솔로 쇼다운",
    es: "SUPERVIVENCIA (SOLO)",
    ar: "المواجهة الحاسمة الفردية",
    fr: "SURVIVANT SOLO",
    zhTw: "單人荒野生死鬥",
    icon: require('../../assets/GameModeIcons/showdown_icon.png')
  },
  "デュオバトルロイヤル": {
    ja: "デュオバトルロイヤル",
    en: "Duo Showdown",
    ko: "듀오 쇼다운",
    es: "SUPERVIVENCIA (DÚO)",
    ar: "المواجهة الحاسمة الزوجية",
    fr: "SURVIVANT DUO",
    zhTw: "雙人荒野生死鬥",
    icon: require('../../assets/GameModeIcons/duo_showdown_icon.png')
  },
  "エメラルドハント": {
    ja: "エメラルドハント",
    en: "Gem Grab",
    ko: "젬 그랩",
    es: "ATRAPAGEMAS",
    ar: "جمع الجواهر",
    fr: "RAZZIA DE GEMMES",
    zhTw: "寶石爭奪戰",
    icon: require('../../assets/GameModeIcons/gem_grab_icon.png')
  },
  "ブロストライカー": {
    ja: "ブロストライカー",
    en: "Brawl Ball",
    ko: "브롤 볼",
    es: "BALÓN BRAWL",
    ar: "كرة العراك",
    fr: "BRAWLBALL",
    zhTw: "亂鬥足球",
    icon: require('../../assets/GameModeIcons/brawl_ball_icon.png')
  },
  "5vs5ブロストライカー": {
    ja: "5vs5ブロストライカー",
    en: "5v5 Brawl Ball",
    ko: "5대5 브롤 볼",
    es: "BALÓN BRAWL 5C5",
    ar: "كرة العراك 5 ضد 5",
    fr: "BRAWLBALL 5C5",
    zhTw: "5v5亂鬥足球",
    icon: require('../../assets/GameModeIcons/5v5brawl_ball_icon.png')
  },
  "強奪": {
    ja: "強奪",
    en: "Heist",
    ko: "하이스트",
    es: "ATRACO",
    ar: "السطو",
    fr: "BRAQUAGE",
    zhTw: "金庫攻防戰",
    icon: require('../../assets/GameModeIcons/heist_icon.png')
  },
  "ノックアウト": {
    ja: "ノックアウト",
    en: "Knockout",
    ko: "녹아웃",
    es: "NOQUEO",
    ar: "الضربة القاضية",
    fr: "HORS-JEU",
    zhTw: "極限淘汰賽",
    icon: require('../../assets/GameModeIcons/knock_out_icon.png')
  },
  "賞金稼ぎ": {
    ja: "賞金稼ぎ",
    en: "Bounty",
    ko: "바운티",
    es: "CAZA ESTELAR",
    ar: "الجائزة",
    fr: "PRIME",
    zhTw: "搶星大作戰",
    icon: require('../../assets/GameModeIcons/bounty_icon.png')
  },
  "ホットゾーン": {
    ja: "ホットゾーン",
    en: "Hot Zone",
    ko: "핫 존",
    es: "ZONA RESTRINGIDA",
    ar: "المنطقة الساخنة",
    fr: "ZONE RÉSERVÉE",
    zhTw: "據點搶奪戰",
    icon: require('../../assets/GameModeIcons/hot_zone_icon.png')
  },
  "殲滅": {
    ja: "殲滅",
    en: "Wipeout",
    ko: "클린 아웃",
    es: "DESTRUCCIÓN",
    ar: "المحو",
    fr: "CHASSE OUVERTE",
    zhTw: "",
    icon: require('../../assets/GameModeIcons/wipeout_icon.png')
  },
  "5vs5殲滅": {
    ja: "5vs5殲滅",
    en: "5v5 Wipeout",
    ko: "5대5 클린 아웃",
    es: "DESTRUCCIÓN 5C5",
    ar: "المحو 5 ضد 5",
    fr: "CHASSE OUVERTE 5C5",
    zhTw: "5v5積分爭奪戰",
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
      name: "デュオバトルロイヤル",
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