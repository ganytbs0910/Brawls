// src/data/modeData.ts
export type GameMode = {
  name: string;
  color: string;
  icon: any;
  translations: {
    ja: string;
    en: string;
    ko: string;
    es: string;
    ar: string;
    fr: string;
    zhTw: string;
  };
};

export const GAME_MODES: { [key: string]: GameMode } = {
  RANKED: {
    name: 'ranked',
    color: "#99ff66",
    translations: {
      ja: 'ガチバトル',
      en: 'Ranked',
      ko: '경쟁전',
      es: 'COMPETITIVO',
      ar: 'المصنف',
      fr: 'CLASSÉ',
      zhTw: '排位賽'
    },
    icon: require('../../assets/GameModeIcons/rank_front.png')
  },
  DUO_BATTLE_ROYALE: {
    name: 'duoShowdown',
    color: "#99ff66",
    translations: {
      ja: 'デュオバトルロイヤル',
      en: 'Duo Showdown',
      ko: '듀오 쇼다운',
      es: 'SUPERVIVENCIA (DÚO)',
      ar: 'المواجهة الحاسمة الزوجية',
      fr: 'SURVIVANT DUO',
      zhTw: '雙人荒野生死鬥'
    },
    icon: require('../../assets/GameModeIcons/duo_showdown_icon.png')
  },
  GEM_GRAB: {
    name: 'gemGrab',
    color: "#DA70D6",
    translations: {
      ja: 'エメラルドハント',
      en: 'Gem Grab',
      ko: '젬 그랩',
      es: 'ATRAPAGEMAS',
      ar: 'جمع الجواهر',
      fr: 'RAZZIA DE GEMMES',
      zhTw: '寶石爭奪戰'
    },
    icon: require('../../assets/GameModeIcons/gem_grab_icon.png')
  },
  BRAWL_BALL: {
    name: 'brawlBall',
    color: "#cccccc",
    translations: {
      ja: 'ブロストライカー',
      en: 'Brawl Ball',
      ko: '브롤 볼',
      es: 'BALÓN BRAWL',
      ar: 'كرة العراك',
      fr: 'BRAWLBALL',
      zhTw: '亂鬥足球'
    },
    icon: require('../../assets/GameModeIcons/brawl_ball_icon.png')
  },
  HEIST: {
    name: 'heist',
    color: "#cccccc",
    translations: {
      ja: '強奪',
      en: 'Heist',
      ko: '하이스트',
      es: 'ATRACO',
      ar: 'السطو',
      fr: 'BRAQUAGE',
      zhTw: '金庫攻防戰'
    },
    icon: require('../../assets/GameModeIcons/heist_icon.png')
  },
  KNOCKOUT: {
    name: 'knockout',
    color: "#FFA500",
    translations: {
      ja: 'ノックアウト',
      en: 'Knockout',
      ko: '녹아웃',
      es: 'NOQUEO',
      ar: 'الضربة القاضية',
      fr: 'HORS-JEU',
      zhTw: '極限淘汰賽'
    },
    icon: require('../../assets/GameModeIcons/knock_out_icon.png')
  },
  BOUNTY: {
    name: 'bounty',
    color: "#DA70D6",
    translations: {
      ja: '賞金稼ぎ',
      en: 'Bounty',
      ko: '바운티',
      es: 'CAZA ESTELAR',
      ar: 'الجائزة',
      fr: 'PRIME',
      zhTw: '搶星大作戰'
    },
    icon: require('../../assets/GameModeIcons/bounty_icon.png')
  },
  WIPEOUT: {
    name: 'wipeout',
    color: "#DA70D6",
    translations: {
      ja: '殲滅',
      en: 'Wipeout',
      ko: '클린 아웃',
      es: 'DESTRUCCIÓN',
      ar: 'المحو',
      fr: 'CHASSE OUVERTE',
      zhTw: '殲滅戰'
    },
    icon: require('../../assets/GameModeIcons/wipeout_icon.png')
  },
  HOT_ZONE: {
    name: 'hotZone',
    color: "#cccccc",
    translations: {
      ja: 'ホットゾーン',
      en: 'Hot Zone',
      ko: '핫 존',
      es: 'ZONA RESTRINGIDA',
      ar: 'المنطقة الساخنة',
      fr: 'ZONE RÉSERVÉE',
      zhTw: '據點搶奪戰'
    },
    icon: require('../../assets/GameModeIcons/hot_zone_icon.png')
  },
  BRAWL_BALL_5V5: {
    name: 'brawlBall5v5',
    color: "#FFA500",
    translations: {
      ja: '5vs5ブロストライカー',
      en: '5v5 Brawl Ball',
      ko: '5대5 브롤 볼',
      es: 'BALÓN BRAWL 5C5',
      ar: 'كرة العراك 5 ضد 5',
      fr: 'BRAWLBALL 5C5',
      zhTw: '5v5亂鬥足球'
    },
    icon: require('../../assets/GameModeIcons/5v5brawl_ball_icon.png')
  },
  WIPEOUT_5V5: {
    name: 'wipeout5v5',
    color: "#FFA500",
    translations: {
      ja: '5vs5殲滅',
      en: '5v5 Wipeout',
      ko: '5대5 클린 아웃',
      es: 'DESTRUCCIÓN 5C5',
      ar: 'المحو 5 ضد 5',
      fr: 'CHASSE OUVERTE 5C5',
      zhTw: '5v5積分爭奪戰'
    },
    icon: require('../../assets/GameModeIcons/5v5wipeout_icon.png')
  },
  BATTLE_ROYALE: {
    name: 'battleRoyale',
    color: "#99ff66",
    translations: {
      ja: 'バトルロイヤル',
      en: 'Battle Royale',
      ko: '배틀로얄',
      es: 'Battle Royale',
      ar: 'باتل رويال',
      fr: 'Battle Royale',
      zhTw: '大逃殺'
    },
    icon: require('../../assets/GameModeIcons/showdown_icon.png')
  },
  SOLO_BATTLE_ROYALE: {
    name: 'soloShowdown',
    color: "#99ff66",
    translations: {
      ja: 'ソロバトルロイヤル',
      en: 'Solo Showdown',
      ko: '솔로 쇼다운',
      es: 'SUPERVIVENCIA (SOLO)',
      ar: 'المواجهة الحاسمة الفردية',
      fr: 'SURVIVANT SOLO',
      zhTw: '單人荒野生死鬥'
    },
    icon: require('../../assets/GameModeIcons/showdown_icon.png')
  },
  DUEL: {
    name: 'duel',
    color: "#FF0000",
    translations: {
      ja: 'デュエル',
      en: 'Duel',
      ko: '결투',
      es: 'Duelo',
      ar: 'المبارزة',
      fr: 'Duel',
      zhTw: '決鬥'
    },
    icon: require('../../assets/GameModeIcons/duels_icon.png')
  },
  FRIENDLY: {
  name: 'friendly',
  color: "#99ff66",
  translations: {
    ja: 'フレンドバトル',
    en: 'Friendly Battle',
    ko: '친선전',
    es: 'Batalla Amistosa',
    ar: 'معركة ودية',
    fr: 'Bataille Amicale',
    zhTw: '友誼賽'
  },
  icon: require('../../assets/GameModeIcons/friendly_icon.png')
},
  BASKET_BRAWL: {
    name: 'basketBrawl',
    color: "#cccccc",
    translations: {
      ja: 'ブロスタバスケ',
      en: 'Basket Brawl',
      ko: '농구 브롤',
      es: 'Baloncesto Brawl',
      ar: 'سلة براول',
      fr: 'Basket Brawl',
      zhTw: '荒野籃球'
    },
    icon: require('../../assets/GameModeIcons/basket_brawl_icon.png')
  },
  PAYLOAD: {
    name: 'payLoad',
    color: "#cccccc",
    translations: {
      ja: 'ペイロード',
      en: 'Payload',
      ko: '페이로드',
      es: 'Carga',
      ar: 'الحمولة',
      fr: 'Convoi',
      zhTw: '推車護送'
    },
    icon: require('../../assets/GameModeIcons/payload_icon.png')
  },
  BRAWL_HOCKEY: {
    name: 'brawlHockey',
    color: "#cccccc",
    translations: {
      ja: 'ブロスタホッケー',
      en: 'Brawl Hockey',
      ko: '브롤 하키',
      es: 'Hockey Brawl',
      ar: 'هوكي براول',
      fr: 'Brawl Hockey',
      zhTw: '冰球'
    },
    icon: require('../../assets/GameModeIcons/brawl_hockey.png')
  }
};

export type Language = keyof (typeof GAME_MODES)[keyof typeof GAME_MODES]['translations'];

// モード名を指定された言語で取得
export function getLocalizedModeName(modeName: keyof typeof GAME_MODES, language: Language): string {
  const mode = GAME_MODES[modeName];
  return mode ? mode.translations[language] : '';
}

// モードのアイコンを取得
export function getModeIcon(modeName: keyof typeof GAME_MODES): any {
  const mode = GAME_MODES[modeName];
  return mode?.icon || require('../../assets/GameModeIcons/4800003.png');
}

// 現在のモードリストを取得
export function getCurrentModes(language: Language) {
  return [
    {
      name: getLocalizedModeName('RANK_FRONT', language),
      color: GAME_MODES.RANK_FRONT.color,
      icon: GAME_MODES.RANK_FRONT.icon
    },
    {
      name: getLocalizedModeName('DUO_BATTLE_ROYALE', language),
      color: GAME_MODES.DUO_BATTLE_ROYALE.color,
      icon: GAME_MODES.DUO_BATTLE_ROYALE.icon
    },
    {
      name: getLocalizedModeName('GEM_GRAB', language),
      color: GAME_MODES.GEM_GRAB.color,
      icon: GAME_MODES.GEM_GRAB.icon
    },
    {
      name: getLocalizedModeName('BRAWL_BALL', language),
      color: GAME_MODES.BRAWL_BALL.color,
      icon: GAME_MODES.BRAWL_BALL.icon
    },
    {
      name: getLocalizedModeName('HEIST', language),
      color: GAME_MODES.HEIST.color,
      icon: GAME_MODES.HEIST.icon
    },
    {
      name: getLocalizedModeName('KNOCKOUT', language),
      color: GAME_MODES.KNOCKOUT.color,
      icon: GAME_MODES.KNOCKOUT.icon
    },
    {
      name: getLocalizedModeName('BOUNTY', language),
      color: GAME_MODES.BOUNTY.color,
      icon: GAME_MODES.BOUNTY.icon
    },
    {
      name: getLocalizedModeName('WIPEOUT', language),
      color: GAME_MODES.WIPEOUT.color,
      icon: GAME_MODES.WIPEOUT.icon
    },
    {
      name: getLocalizedModeName('HOT_ZONE', language),
      color: GAME_MODES.HOT_ZONE.color,
      icon: GAME_MODES.HOT_ZONE.icon
    },
    {
      name: getLocalizedModeName('BRAWL_BALL_5V5', language),
      color: GAME_MODES.BRAWL_BALL_5V5.color,
      icon: GAME_MODES.BRAWL_BALL_5V5.icon
    },
    {
      name: getLocalizedModeName('WIPEOUT_5V5', language),
      color: GAME_MODES.WIPEOUT_5V5.color,
      icon: GAME_MODES.WIPEOUT_5V5.icon
    },
    {
      name: getLocalizedModeName('BRAWL_HOCKEY', language),
      color: GAME_MODES.BRAWL_HOCKEY.color,
      icon: GAME_MODES.BRAWL_HOCKEY.icon
    }
  ];
}

// デュエル＆殲滅＆賞金稼ぎのような組み合わせモードの翻訳を生成
export function generateCombinedModeTranslation(modes: (keyof typeof GAME_MODES)[], language: Language): string {
  return modes
    .map(mode => GAME_MODES[mode].translations[language])
    .join(' & ');
}