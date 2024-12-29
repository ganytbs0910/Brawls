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
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "最初のエメラルド確保を目指しつつ、相手の動きを観察する",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "エメラルドの保持数に応じて攻撃的か防御的か立ち回りを変える",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "カウントダウン時の最後の一個を確実に確保する",
        phase: "Late"
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
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "高所のポジション確保と初期エメラルドの位置把握",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "要塞の構造を活かした守りと攻めの切り替え",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "チーム全体でのエメラルド保持数の管理",
        phase: "Late"
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
        name: "エドガー",
        reason: "狭い通路での接近戦に強い",
        power: 4
      },
      {
        name: "ダイナマイク",
        reason: "通路に爆弾を置いて進路を妨害",
        power: 4
      }
    ],
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "近くの通路の制圧とエメラルド確保",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "通路と広場の切り替えで敵を翻弄",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "チーム全体での持ち点管理と防衛",
        phase: "Late"
      }
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
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "トロッコの動きを把握しつつエメラルド収集",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "トロッコを利用した攻防",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "エメラルド保持と安全な移動",
        phase: "Late"
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
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "チームでの陣形形成",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "エメラルド保持者の護衛",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "残り時間を意識した守り",
        phase: "Late"
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
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "有利な通路の確保",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "壁を利用した待ち伏せ",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "エメラルド保持での生存",
        phase: "Late"
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
        name: "バル",
        reason: "通路での強さを発揮",
        power: 5
      },
      {
        name: "エメル",
        reason: "高所からの制圧",
        power: 4
      },
      {
        name: "リコ",
        reason: "壁跳ね攻撃が有効",
        power: 4
      }
    ],
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "主要通路の確保",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "高低差を活用した戦い",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "エメラルド確保と防衛",
        phase: "Late"
      }
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
      name: "ボウ",
      reason: "プラットフォームからの視界確保が有効",
      power: 5
    },
    {
      name: "ジャクキー",
      reason: "待合所での近接戦に強い",
      power: 4
    },
    {
      name: "バイロン",
      reason: "味方の回復とサポートが可能",
      power: 4
    }
  ],
  tactics: [
    {
      title: "序盤の立ち回り",
      description: "中央プラットフォームの確保と初期エメラルドの回収",
      phase: "Early"
    },
    {
      title: "中盤の戦略",
      description: "待合所を利用した待ち伏せと防衛",
      phase: "Mid"
    },
    {
      title: "終盤での勝ち方",
      description: "プラットフォームと待合所の利点を活かした陣地確保",
      phase: "Late"
    }
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
  tactics: [
    {
      title: "序盤の立ち回り",
      description: "サボテン周辺の安全地帯確保",
      phase: "Early"
    },
    {
      title: "中盤の戦略",
      description: "罠を利用した相手の誘導",
      phase: "Mid"
    },
    {
      title: "終盤での勝ち方",
      description: "有利な地形での防衛態勢構築",
      phase: "Late"
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
      name: "ルー",
      reason: "レール間の素早い移動が可能",
      power: 5
    },
    {
      name: "サンディ",
      reason: "広範囲攻撃で制圧が可能",
      power: 4
    },
    {
      name: "スプラウト",
      reason: "壁での進路妨害が有効",
      power: 4
    }
  ],
  tactics: [
    {
      title: "序盤の立ち回り",
      description: "レールの確保と初期ポジション取り",
      phase: "Early"
    },
    {
      title: "中盤の戦略",
      description: "レールを使った機動力重視の戦術",
      phase: "Mid"
    },
    {
      title: "終盤での勝ち方",
      description: "レールと地上の両方を考慮した総合的な戦略",
      phase: "Late"
    }
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
  tactics: [
    {
      title: "序盤の立ち回り",
      description: "ブッシュの確保と視界の確保",
      phase: "Early"
    },
    {
      title: "中盤の戦略",
      description: "自然の障害物を利用した攻防",
      phase: "Mid"
    },
    {
      title: "終盤での勝ち方",
      description: "エメラルド保持者の効果的な防衛",
      phase: "Late"
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
  tactics: [
    {
      title: "序盤の立ち回り",
      description: "滑走地形の把握と安全な移動ルートの確保",
      phase: "Early"
    },
    {
      title: "中盤の戦略",
      description: "氷の特性を活かした攻撃と防御",
      phase: "Mid"
    },
    {
      title: "終盤での勝ち方",
      description: "滑走地形でのエメラルド保持戦略",
      phase: "Late"
    }
  ],
  tips: [
    "滑走による予期せぬ移動に注意",
    "岩場での安全な足場確保",
    "氷上での戦闘は避ける"
  ]
},
};