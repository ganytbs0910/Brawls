import { MapDetail } from '../../types';

export const emeraldHuntMaps: Record<string, MapDetail> = {
    "クリスタルアーケード": {
    id: "eh_crystal_arcade",
    name: "クリスタルアーケード",
    mode: "emeraldHunt",
    description: "中央にエメラルドが出現し、両サイドに隠れ場所となるブッシュが配置されています。エメラルドの確保と敵の妨害のバランスが重要です。",
    characteristics: ["左右対称", "エメラルド集中", "カバー多め"],
    difficulty: "Hard",
    recommendedBrawlers: [
      {
        name: "ローサ",
        reason: "高い耐久力でエメラルドを保持しやすい",
        power: 5
      },
      {
        name: "タラ",
        reason: "広範囲攻撃で敵を牽制しやすい",
        power: 4
      },
      {
        name: "ジーン",
        reason: "敵を引き寄せる能力で陣地の崩壊が可能",
        power: 5
      }
    ],

    tips: [
      "エメラルドを持っている時は無理な進出を避ける",
      "味方のカバーを意識した位置取りを心がける",
      "相手のスーパースキルのタイミングを把握して行動する"
    ]
  },
  "エメラルドの要塞": {
    id: "eh_gem_fort",
    name: "エメラルドの要塞",
    mode: "emeraldHunt",
    description: "要塞型の地形で、エメラルドの出現場所が分散しています。高台からの防衛と攻略のバランスが鍵となります。",
    characteristics: ["高低差", "要塞構造", "分散配置"],
    difficulty: "Medium",
    recommendedBrawlers: [
      {
        name: "ボウ",
        reason: "高所からの視界確保と攻撃が有効",
        power: 5
      },
      {
        name: "モーティス",
        reason: "素早い移動で分散したエメラルドを回収",
        power: 4
      },
      {
        name: "コルト",
        reason: "壁破壊で新たなルートを作れる",
        power: 4
      }
    ],

    tips: [
      "高所からの視界を活用して敵の動きを把握",
      "要塞の死角を利用した立ち回り",
      "チームメイトとの連携を重視する"
    ]
  },
  "ごつごつ坑道": {
    id: "eh_hard_rock_mine",
    name: "ごつごつ坑道",
    mode: "emeraldHunt",
    description: "坑道内の狭い通路と開けた空間が混在する複雑なマップ。エメラルドの奪い合いが激しくなります。",
    characteristics: ["狭路と広場", "複雑な地形", "接近戦多発"],
    difficulty: "Hard",
    recommendedBrawlers: [
      {
        name: "バイロン",
        reason: "味方の回復と通路での牽制が可能",
        power: 5
      },
      {
        name: "ガス",
        reason: "狭い通路での接近戦に強い",
        power: 5
      },
      {
        name: "リコ",
        reason: "通路に爆弾を置いて進路を妨害",
        power: 5
      },
      {
        name: "ラフス",
        reason: "通路に爆弾を置いて進路を妨害",
        power: 5
      },
      {
        name: "ストゥー",
        reason: "通路に爆弾を置いて進路を妨害",
        power: 4
      },
      {
        name: "8ビット",
        reason: "通路に爆弾を置いて進路を妨害",
        power: 4
      },
      {
        name: "サージ",
        reason: "通路に爆弾を置いて進路を妨害",
        power: 4
      },
      {
        name: "バスター",
        reason: "通路に爆弾を置いて進路を妨害",
        power: 4
      },
      {
        name: "ジュジュ",
        reason: "通路に爆弾を置いて進路を妨害",
        power: 4
      },
      {
        name: "エリザベス",
        reason: "通路に爆弾を置いて進路を妨害",
        power: 3
      },
      {
        name: "タラ",
        reason: "通路に爆弾を置いて進路を妨害",
        power: 3
      },
      {
        name: "マックス",
        reason: "通路に爆弾を置いて進路を妨害",
        power: 3
      },
      {
        name: "ペニー",
        reason: "通路に爆弾を置いて進路を妨害",
        power: 3
      },
      {
        name: "モーティス",
        reason: "通路に爆弾を置いて進路を妨害",
        power: 3
      },
      {
        name: "ダリル",
        reason: "通路に爆弾を置いて進路を妨害",
        power: 3
      },
      {
        name: "フランケン",
        reason: "通路に爆弾を置いて進路を妨害",
        power: 3
      },
      {
        name: "ビビ",
        reason: "通路に爆弾を置いて進路を妨害",
        power: 3
      },
    ],

    tips: [
      "狭い通路での待ち伏せに注意",
      "広場での戦いは慎重に",
      "常に複数の逃げ道を確保"
    ]
  },
  "トロッコの狂気": {
    id: "eh_minecart_madness",
    name: "トロッコの狂気",
    mode: "emeraldHunt",
    description: "トロッコが走る危険な線路と、エメラルドの奪い合いが特徴的なマップです。",
    characteristics: ["トロッコ注意", "リスク管理", "エメラルド分散"],
    difficulty: "Expert",
    recommendedBrawlers: [
      {
        name: "エメル",
        reason: "高所からの視界確保と制圧",
        power: 5
      },
      {
        name: "グロム",
        reason: "安全な距離からの攻撃",
        power: 4
      },
      {
        name: "スプラウト",
        reason: "壁でエメラルド防衛",
        power: 4
      }
    ],

    tips: [
      "トロッコの予定経路を把握",
      "エメラルド保持中は慎重に",
      "線路横断は必要最小限に"
    ]
  },
  "オープンスペース": {
    id: "eh_open_space",
    name: "オープンスペース",
    mode: "emeraldHunt",
    description: "開けた地形でのエメラルド争奪戦。カバーが少なく、チーム戦術が重要です。",
    characteristics: ["開放地形", "チーム戦", "視界確保"],
    difficulty: "Hard",
    recommendedBrawlers: [
      {
        name: "パイパー",
        reason: "広い視界での狙撃",
        power: 5
      },
      {
        name: "パム",
        reason: "回復とエリア制圧",
        power: 4
      },
      {
        name: "ベル",
        reason: "長距離からの牽制",
        power: 4
      }
    ],

    tips: [
      "チームの散開を避ける",
      "常に視界を確保",
      "カバーを最大限活用"
    ]
  },
  "廃れたアーケード": {
    id: "eh_rustic_arcade",
    name: "廃れたアーケード",
    mode: "emeraldHunt",
    description: "廃墟となったアーケードでの戦い。壁と通路を活用した戦術が鍵となります。",
    characteristics: ["廃墟構造", "近接戦", "通路戦"],
    difficulty: "Medium",
    recommendedBrawlers: [
      {
        name: "シェリー",
        reason: "近接戦での強さ",
        power: 5
      },
      {
        name: "コルト",
        reason: "壁破壊での地形操作",
        power: 4
      },
      {
        name: "タラ",
        reason: "通路での制圧力",
        power: 4
      }
    ],

    tips: [
      "壁破壊の状況を把握",
      "通路での待ち伏せに注意",
      "チームの位置を把握"
    ]
  },
  "アンダーマイン": {
    id: "eh_undermine",
    name: "アンダーマイン",
    mode: "emeraldHunt",
    description: "地下鉱山をモチーフにしたマップ。狭い通路と広場の使い分けが重要です。",
    characteristics: ["地下構造", "通路と広場", "立体地形"],
    difficulty: "Hard",
    recommendedBrawlers: [
      {
        name: "ジーン",
        reason: "通路での強さを発揮",
        power: 5
      },
      {
        name: "オーティス",
        reason: "高所からの制圧",
        power: 5
      },
      {
        name: "サージ",
        reason: "壁跳ね攻撃が有効",
        power: 5
      },
      {
        name: "タラ",
        reason: "通路での強さを発揮",
        power: 5
      },
      {
        name: "ガス",
        reason: "高所からの制圧",
        power: 5
      },
      {
        name: "バイロン",
        reason: "壁跳ね攻撃が有効",
        power: 4
      },
      {
        name: "パール",
        reason: "壁跳ね攻撃が有効",
        power: 4
      },
      {
        name: "バスター",
        reason: "壁跳ね攻撃が有効",
        power: 4
      },
      {
        name: "ストゥー",
        reason: "壁跳ね攻撃が有効",
        power: 4
      },
      {
        name: "エリザベス",
        reason: "壁跳ね攻撃が有効",
        power: 4
      },
      {
        name: "ニタ",
        reason: "壁跳ね攻撃が有効",
        power: 3
      },
      {
        name: "ケンジ",
        reason: "壁跳ね攻撃が有効",
        power: 3
      },
      {
        name: "マックス",
        reason: "壁跳ね攻撃が有効",
        power: 3
      },
      {
        name: "ゲイル",
        reason: "壁跳ね攻撃が有効",
        power: 3
      },
    ],

    tips: [
      "高低差での有利不利を判断",
      "通路での接近戦に備える",
      "チームの退路を確保"
    ]
  },
  "ラストストップ": {
  id: "eh_last_stop",
  name: "ラストストップ",
  mode: "emeraldHunt",
  description: "最終停車場をモチーフにした戦略的なマップ。中央のプラットフォームと両サイドの待合所が特徴的です。",
  characteristics: ["中央プラットフォーム", "待合所", "複数の通路"],
  difficulty: "Medium",
  recommendedBrawlers: [
    {
        name: "エリザベス",
        reason: "通路での強さを発揮",
        power: 5
      },
      {
        name: "バイロン",
        reason: "高所からの制圧",
        power: 5
      },
      {
        name: "ガス",
        reason: "壁跳ね攻撃が有効",
        power: 5
      },
      {
        name: "ストゥー",
        reason: "通路での強さを発揮",
        power: 5
      },
      {
        name: "マックス",
        reason: "高所からの制圧",
        power: 5
      },
      {
        name: "ベル",
        reason: "壁跳ね攻撃が有効",
        power: 4
      },
      {
        name: "ラフス",
        reason: "壁跳ね攻撃が有効",
        power: 4
      },
      {
        name: "オーティス",
        reason: "壁跳ね攻撃が有効",
        power: 4
      },
      {
        name: "スクウィーク",
        reason: "壁跳ね攻撃が有効",
        power: 4
      },
      {
        name: "サージ",
        reason: "壁跳ね攻撃が有効",
        power: 4
      },
      {
        name: "ケンジ",
        reason: "壁跳ね攻撃が有効",
        power: 4
      },
      {
        name: "ペニー",
        reason: "壁跳ね攻撃が有効",
        power: 4
      },
      {
        name: "アンバー",
        reason: "壁跳ね攻撃が有効",
        power: 3
      },
      {
        name: "リコ",
        reason: "壁跳ね攻撃が有効",
        power: 3
      },
  ],
  tips: [
    "プラットフォームでの過度な滞在は避ける",
    "待合所での待ち伏せに注意",
    "チームメイトとの連携を重視"
  ]
},
"サボテンの罠": {
  id: "eh_deathcap_trap",
  name: "サボテンの罠",
  mode: "emeraldHunt",
  description: "砂漠地帯に点在するサボテンと岩場が特徴的なマップ。隠れ場所と罠が絶妙に配置されています。",
  characteristics: ["サボテン地帯", "罠エリア", "開けた地形"],
  difficulty: "Hard",
  recommendedBrawlers: [
    {
      name: "スパイク",
      reason: "地形を活かした攻撃が得意",
      power: 5
    },
    {
      name: "ローサ",
      reason: "ブッシュでの待ち伏せが効果的",
      power: 4
    },
    {
      name: "リコ",
      reason: "壁跳ね攻撃で死角をつく",
      power: 4
    }
  ],
  tips: [
    "サボテン付近での戦いに注意",
    "罠の位置を把握して立ち回る",
    "開けた場所での移動は慎重に"
  ]
},
"ダブルレール": {
  id: "eh_double_swoosh",
  name: "ダブルレール",
  mode: "emeraldHunt",
  description: "二本のレールが特徴的な対称マップ。レール上の移動と地上戦の使い分けが重要です。",
  characteristics: ["二重レール構造", "対称マップ", "高低差"],
  difficulty: "Expert",
  recommendedBrawlers: [
    {
      name: "ジーン",
      reason: "レール間の素早い移動が可能",
      power: 5
    },
    {
      name: "チェスター",
      reason: "広範囲攻撃で制圧が可能",
      power: 5
    },
    {
      name: "サージ",
      reason: "レール間の素早い移動が可能",
      power: 5
    },
    {
      name: "サンディ",
      reason: "広範囲攻撃で制圧が可能",
      power: 5
    },
    {
      name: "アンバー",
      reason: "レール間の素早い移動が可能",
      power: 5
    },
    {
      name: "オーティス",
      reason: "広範囲攻撃で制圧が可能",
      power: 4
    },
    {
      name: "パール",
      reason: "レール間の素早い移動が可能",
      power: 4
    },
    {
      name: "バスター",
      reason: "広範囲攻撃で制圧が可能",
      power: 4
    },
    {
      name: "ペニー",
      reason: "広範囲攻撃で制圧が可能",
      power: 4
    },
    {
      name: "ジェシー",
      reason: "広範囲攻撃で制圧が可能",
      power: 4
    },
    {
      name: "ジュジュ",
      reason: "レール間の素早い移動が可能",
      power: 3
    },
    {
      name: "バイロン",
      reason: "広範囲攻撃で制圧が可能",
      power: 3
    },
    {
      name: "ガス",
      reason: "広範囲攻撃で制圧が可能",
      power: 3
    },
    {
      name: "ストゥー",
      reason: "広範囲攻撃で制圧が可能",
      power: 3
    },
    {
      name: "タラ",
      reason: "レール間の素早い移動が可能",
      power: 3
    },
    {
      name: "ダリル",
      reason: "広範囲攻撃で制圧が可能",
      power: 3
    },
    {
      name: "モーティス",
      reason: "広範囲攻撃で制圧が可能",
      power: 3
    },
    {
      name: "フランケン",
      reason: "広範囲攻撃で制圧が可能",
      power: 2
    },
    {
      name: "ドラコ",
      reason: "レール間の素早い移動が可能",
      power: 2
    },
    {
      name: "ゲイル",
      reason: "広範囲攻撃で制圧が可能",
      power: 2
    },
  ],
  tips: [
    "レール上での待ち伏せに警戒",
    "高所からの攻撃を活用",
    "チームの散開を避ける"
  ]
},
"森林伐採": {
  id: "eh_forest_clearing",
  name: "森林伐採",
  mode: "emeraldHunt",
  description: "伐採された森の中での戦い。切り株や残された木々が戦略的なカバーとなります。",
  characteristics: ["自然障害物", "ブッシュ地帯", "開放区域"],
  difficulty: "Medium",
  recommendedBrawlers: [
    {
      name: "ボウ",
      reason: "ブッシュチェックが得意",
      power: 5
    },
    {
      name: "シャリー",
      reason: "近距離での強さを発揮",
      power: 4
    },
    {
      name: "エメル",
      reason: "切り株を利用した狙撃が有効",
      power: 4
    }
  ],
  tips: [
    "ブッシュでの待ち伏せに注意",
    "切り株を効果的なカバーとして使用",
    "開放区域での移動は慎重に"
  ]
},
"クールロック": {
  id: "eh_the_cooler_hard_rock",
  name: "クールロック",
  mode: "emeraldHunt",
  description: "氷の要素を取り入れた岩場のマップ。滑りやすい地形での戦いが特徴です。",
  characteristics: ["氷の地形", "岩場", "滑走エリア"],
  difficulty: "Expert",
  recommendedBrawlers: [
    {
      name: "グロム",
      reason: "遠距離から安全に攻撃可能",
      power: 5
    },
    {
      name: "バル",
      reason: "滑走を活かした素早い移動",
      power: 4
    },
    {
      name: "コルト",
      reason: "壁破壊で地形を変化させられる",
      power: 4
    }
  ],
  tips: [
    "滑走による予期せぬ移動に注意",
    "岩場での安全な足場確保",
    "氷上での戦闘は避ける"
  ]
},
};