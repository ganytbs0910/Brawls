import { MapDetail } from '../../types/type';

export const knockoutMaps: Record<string, MapDetail> = {
    "白熱対戦": {
    id: "ko_h_for",
    name: "白熱対戦",
    mode: "knockout",
    description: "狭いマップながら多くのカバーがあり、接近戦と中距離戦のバランスが重要です。",
    characteristics: ["狭域戦", "カバー豊富", "集中戦"],
    difficulty: "Medium",
    recommendedBrawlers: [
      {
        name: "シェリー",
        reason: "近距離での火力が高く、カバー間の移動が得意",
        power: 5
      },
      {
        name: "コルト",
        reason: "壁破壊で地形を有利に変更可能",
        power: 4
      },
      {
        name: "エドガー",
        reason: "機動力を活かした接近戦が可能",
        power: 4
      }
    ],
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "チームで有利なカバーを確保し、敵の位置を把握",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "地形を活かした押し引きと数的優位の確保",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "残り人数を考慮した攻め時の判断",
        phase: "Late"
      }
    ],
    tips: [
      "チームメイトとの距離を意識",
      "カバー間の移動は慎重に",
      "時間切れを視野に入れた立ち回り"
    ]
  },
  "新たなる地平": {
    id: "ko_new_horizons",
    name: "新たなる地平",
    mode: "knockout",
    description: "開放的な地形と要所に配置された壁を活用する戦略的なマップ。",
    characteristics: ["開放地形", "戦略的壁配置", "視界確保"],
    difficulty: "Hard",
    recommendedBrawlers: [
      {
        name: "パイパー",
        reason: "広い視界での狙撃が有効",
        power: 5
      },
      {
        name: "スパイク",
        reason: "壁を利用した牽制が強力",
        power: 4
      },
      {
        name: "ジーン",
        reason: "長距離から敵を引き寄せられる",
        power: 4
      }
    ],
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "有利な射線の確保と壁の利用",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "チームでの包囲態勢の構築",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "残存する壁を活用した詰め",
        phase: "Late"
      }
    ],
    tips: [
      "不用意な露出を避ける",
      "壁の破壊状況を把握",
      "チームの射線を分散"
    ]
  },
  "オープンフィールド": {
    id: "ko_out_in_the_open",
    name: "オープンフィールド",
    mode: "knockout",
    description: "広大な開放地形での戦い。カバーが少なく、位置取りが極めて重要です。",
    characteristics: ["超開放地形", "少ないカバー", "長距離戦"],
    difficulty: "Expert",
    recommendedBrawlers: [
      {
        name: "ベル",
        reason: "長距離からの牽制が最強",
        power: 5
      },
      {
        name: "ブロック",
        reason: "壁を作って前進可能",
        power: 4
      },
      {
        name: "バイロン",
        reason: "遠距離攻撃と回復が両立",
        power: 4
      }
    ],
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "チーム全体での射線確保",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "限られたカバーの争奪戦",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "残り人数を活かした集中攻撃",
        phase: "Late"
      }
    ],
    tips: [
      "常に複数の退路を確保",
      "チームの陣形を維持",
      "カバーの価値を最大化"
    ]
  },
  "生い茂る廃墟": {
    id: "ko_overgrown_ruins",
    name: "生い茂る廃墟",
    mode: "knockout",
    description: "廃墟とブッシュが混在する複雑な地形。視界の確保と待ち伏せの駆け引きが重要です。",
    characteristics: ["廃墟地形", "ブッシュ戦", "視界制限"],
    difficulty: "Hard",
    recommendedBrawlers: [
      {
        name: "ボウ",
        reason: "視界確保能力が必須",
        power: 5
      },
      {
        name: "タラ",
        reason: "広範囲攻撃で待ち伏せに対応",
        power: 4
      },
      {
        name: "モーティス",
        reason: "奇襲能力を活かせる",
        power: 4
      }
    ],
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "視界の確保と敵の動線予測",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "地形を利用した待ち伏せと奇襲",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "視界確保による有利な展開",
        phase: "Late"
      }
    ],
    tips: [
      "ブッシュチェックを怠らない",
      "地形の死角を把握",
      "待ち伏せ位置を予測"
    ]
  },
  "バキューン神殿": {
    id: "ko_temple_of_vroom",
    name: "バキューン神殿",
    mode: "knockout",
    description: "神殿をモチーフにした対称マップ。中央部の制圧と側面からの攻めのバランスが重要です。",
    characteristics: ["対称構造", "中央重要", "立体地形"],
    difficulty: "Medium",
    recommendedBrawlers: [
      {
        name: "エメル",
        reason: "高所からの制圧が得意",
        power: 5
      },
      {
        name: "リコ",
        reason: "壁跳ね攻撃が有効",
        power: 4
      },
      {
        name: "ペニー",
        reason: "砲台設置で守りを固める",
        power: 4
      }
    ],
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "中央か側面かの進行経路選択",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "高低差を活かした攻防",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "チーム連携での挟み撃ち",
        phase: "Late"
      }
    ],
    tips: [
      "高所からの視界を活用",
      "中央の重要性を意識",
      "側面からの挟み込みに注意"
    ]
  },
  "極小列島": {
    id: "ko_tiny_islands",
    name: "極小列島",
    mode: "knockout",
    description: "小さな島々が散在する特殊なマップ。島の確保と移動のタイミングが勝負の分かれ目です。",
    characteristics: ["島地形", "水路", "移動制限"],
    difficulty: "Expert",
    recommendedBrawlers: [
      {
        name: "ダリル",
        reason: "島間の移動が得意",
        power: 5
      },
      {
        name: "グロム",
        reason: "島を跨いだ攻撃が可能",
        power: 4
      },
      {
        name: "スプラウト",
        reason: "壁で島を拡張できる",
        power: 4
      }
    ],
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "有利な島の確保を優先",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "島の支配権争いと牽制",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "安全な島での陣取り",
        phase: "Late"
      }
    ],
    tips: [
      "水中での移動は最小限に",
      "島間の移動は慎重に",
      "チームの散開を避ける"
    ]
  },
    "双頭の川": {
    id: "ko_two_rivers",
    name: "双頭の川",
    mode: "knockout",
    description: "2本の川によって分断された特殊な地形。川の渡り方と陣地の確保が重要です。",
    characteristics: ["二重河川", "渡河戦術", "陣地戦"],
    difficulty: "Hard",
    recommendedBrawlers: [
      {
        name: "ダリル",
        reason: "川を横断する能力が優秀",
        power: 5
      },
      {
        name: "バイロン",
        reason: "味方の回復と遠距離攻撃",
        power: 4
      },
      {
        name: "ボウ",
        reason: "広い視界での制圧が可能",
        power: 4
      }
    ],
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "初期陣地の確保と渡河ポイントの把握",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "川を利用した有利な打点の確保",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "渡河を強要される敵の狩り",
        phase: "Late"
      }
    ],
    tips: [
      "渡河時の援護を重視",
      "川での待ち伏せに注意",
      "チームの陣形を維持"
    ]
  },"ベルの岩": {
    id: "ko_belles_rock",
    name: "ベルの岩",
    mode: "knockout",
    description: "大きな岩が特徴的な地形。高低差と岩の配置を活かした戦術が重要です。",
    characteristics: ["岩場地形", "高低差", "戦略的カバー"],
    difficulty: "Medium",
    recommendedBrawlers: [
      {
        name: "ベル",
        reason: "地形を活かした長距離攻撃が有効",
        power: 5
      },
      {
        name: "リコ",
        reason: "壁跳ね攻撃で死角を突ける",
        power: 4
      },
      {
        name: "クロウ",
        reason: "高所からの牽制と機動力",
        power: 4
      }
    ],
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "高所の確保と岩の利用法の確認",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "岩を活用した押し引きと陣地争い",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "高低差を活かした包囲網の形成",
        phase: "Late"
      }
    ],
    tips: [
      "岩の配置を味方の盾として活用",
      "高低差での有利不利を把握",
      "敵の死角からの接近に注意"
    ]
  },
  "密林の奥地": {
    id: "ko_deep_forest",
    name: "密林の奥地",
    mode: "knockout",
    description: "鬱蒼とした森の中での戦い。視界が制限され、近距離戦が多発します。",
    characteristics: ["森林地帯", "視界制限", "近接戦重視"],
    difficulty: "Hard",
    recommendedBrawlers: [
      {
        name: "ローサ",
        reason: "森林での近接戦に強い",
        power: 5
      },
      {
        name: "ボウ",
        reason: "視界確保能力が必須",
        power: 4
      },
      {
        name: "シェリー",
        reason: "近距離での火力が有効",
        power: 4
      }
    ],
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "安全な進入ルートの確保",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "視界の確保と待ち伏せの駆け引き",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "チーム連携での包囲と仕留め",
        phase: "Late"
      }
    ],
    tips: [
      "常にブッシュチェックを怠らない",
      "味方との距離を意識",
      "音を頼りに敵を予測"
    ]
  },
  "燃える不死鳥": {
    id: "ko_flaring_phoenix",
    name: "燃える不死鳥",
    mode: "knockout",
    description: "不死鳥をモチーフにした対称マップ。中央部の炎のような障害物が特徴的です。",
    characteristics: ["炎の障害物", "対称構造", "中央集中"],
    difficulty: "Expert",
    recommendedBrawlers: [
      {
        name: "アンバー",
        reason: "炎の地形との相性が抜群",
        power: 5
      },
      {
        name: "スパイク",
        reason: "障害物を活かした攻撃が有効",
        power: 4
      },
      {
        name: "コルト",
        reason: "壁破壊で地形を変更可能",
        power: 4
      }
    ],
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "中央部の制圧と初期配置",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "障害物を活用した攻防",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "残存する障害物での有利な打点確保",
        phase: "Late"
      }
    ],
    tips: [
      "炎の障害物での被弾に注意",
      "対称性を活かした立ち回り",
      "中央部での過度な争いを避ける"
    ]
  },
  "四段階層": {
    id: "ko_four_levels",
    name: "四段階層",
    mode: "knockout",
    description: "4つの階層に分かれた立体的なマップ。高低差の理解と移動の選択が鍵となります。",
    characteristics: ["四層構造", "立体地形", "階層戦"],
    difficulty: "Expert",
    recommendedBrawlers: [
      {
        name: "エメル",
        reason: "高所からの制圧が最強",
        power: 5
      },
      {
        name: "ダイナマイク",
        reason: "異なる層への攻撃が得意",
        power: 4
      },
      {
        name: "プリモ",
        reason: "層を超えた移動が可能",
        power: 4
      }
    ],
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "有利な層の確保と初期配置",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "層を活用した立体的な攻防",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "最適な層での決戦を強制",
        phase: "Late"
      }
    ],
    tips: [
      "各層の利点欠点を把握",
      "安全な層移動を心がける",
      "高所からの攻撃に警戒"
    ]
  },
  "ゴールドアームの渓谷": {
    id: "ko_goldarm_gulch",
    name: "ゴールドアームの渓谷",
    mode: "knockout",
    description: "金鉱をモチーフにした渓谷マップ。狭い通路と開けた場所が混在します。",
    characteristics: ["渓谷地形", "狭路混在", "採掘場"],
    difficulty: "Hard",
    recommendedBrawlers: [
      {
        name: "グリフ",
        reason: "通路での戦闘が得意",
        power: 5
      },
      {
        name: "バル",
        reason: "狭い場所での強さを発揮",
        power: 4
      },
      {
        name: "ルー",
        reason: "素早い移動で優位を築ける",
        power: 4
      }
    ],
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "主要な通路の確保",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "渓谷の地形を活かした包囲",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "敵を不利な地形に追い込む",
        phase: "Late"
      }
    ],
    tips: [
      "通路での待ち伏せに警戒",
      "開けた場所での露出を避ける",
      "チームの散開を防ぐ"
    ]
  },
};