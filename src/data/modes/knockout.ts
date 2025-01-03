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
      name: "R-T",
      reason: "水路での移動が得意",
      power: 5
    },
    {
      name: "ガス",
      reason: "水路を挟んだ狙撃",
      power: 5
    },
    {
      name: "アンジェロ",
      reason: "水路越しの攻撃",
      power: 5
    },
    {
      name: "イヴ",
      reason: "水路での移動が得意",
      power: 5
    },
    {
      name: "ジュジュ",
      reason: "水路を挟んだ狙撃",
      power: 5
    },
    {
      name: "ブロック",
      reason: "水路越しの攻撃",
      power: 5
    },
    {
      name: "マンディ",
      reason: "水路での移動が得意",
      power: 4
    },
    {
      name: "ベル",
      reason: "水路を挟んだ狙撃",
      power: 4
    },
    {
      name: "バイロン",
      reason: "水路越しの攻撃",
      power: 4
    },
    {
      name: "エリザベス",
      reason: "水路を挟んだ狙撃",
      power: 4
    },
    {
      name: "ジーン",
      reason: "水路越しの攻撃",
      power: 4
    },
    {
      name: "パール",
      reason: "水路を挟んだ狙撃",
      power: 4
    },
    {
      name: "ナーニ",
      reason: "水路越しの攻撃",
      power: 3
    },
    {
      name: "キット",
      reason: "水路越しの攻撃",
      power: 3
    },
    {
      name: "ダリル",
      reason: "水路越しの攻撃",
      power: 3
    },
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
      name: "エリザベス",
      reason: "水路での移動が得意",
      power: 5
    },
    {
      name: "バイロン",
      reason: "水路を挟んだ狙撃",
      power: 5
    },
    {
      name: "ガス",
      reason: "水路越しの攻撃",
      power: 5
    },
    {
      name: "R-T",
      reason: "水路での移動が得意",
      power: 5
    },
    {
      name: "グレイ",
      reason: "水路を挟んだ狙撃",
      power: 5
    },
    {
      name: "ジーン",
      reason: "水路越しの攻撃",
      power: 5
    },
    {
      name: "リコ",
      reason: "水路での移動が得意",
      power: 5
    },
    {
      name: "ベル",
      reason: "水路を挟んだ狙撃",
      power: 5
    },
    {
      name: "ティック",
      reason: "水路越しの攻撃",
      power: 5
    },
    {
      name: "スプラウト",
      reason: "水路を挟んだ狙撃",
      power: 5
    },
    {
      name: "アンジェロ",
      reason: "水路越しの攻撃",
      power: 4
    },
    {
      name: "マンディ",
      reason: "水路を挟んだ狙撃",
      power: 4
    },
    {
      name: "ジュジュ",
      reason: "水路越しの攻撃",
      power: 4
    },
    {
      name: "バーリー",
      reason: "水路越しの攻撃",
      power: 4
    },
    {
      name: "ラリー&ローリー",
      reason: "水路越しの攻撃",
      power: 3
    },
    {
      name: "ブロック",
      reason: "水路越しの攻撃",
      power: 3
    },
    {
      name: "ダリル",
      reason: "水路越しの攻撃",
      power: 3
    },
    {
      name: "キット",
      reason: "水路越しの攻撃",
      power: 3
    },
    {
      name: "イヴ",
      reason: "水路越しの攻撃",
      power: 3
    },
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
      name: "R-T",
      reason: "水路での移動が得意",
      power: 5
    },
    {
      name: "エリザベス",
      reason: "水路を挟んだ狙撃",
      power: 5
    },
    {
      name: "ガス",
      reason: "水路越しの攻撃",
      power: 5
    },
    {
      name: "バイロン",
      reason: "水路での移動が得意",
      power: 5
    },
    {
      name: "ジーン",
      reason: "水路を挟んだ狙撃",
      power: 5
    },
    {
      name: "ティック",
      reason: "水路越しの攻撃",
      power: 5
    },
    {
      name: "バスター",
      reason: "水路での移動が得意",
      power: 5
    },
    {
      name: "パール",
      reason: "水路を挟んだ狙撃",
      power: 4
    },
    {
      name: "ベル",
      reason: "水路を挟んだ狙撃",
      power: 4
    },
    {
      name: "スプラウト",
      reason: "水路を挟んだ狙撃",
      power: 4
    },
    {
      name: "リリー",
      reason: "水路越しの攻撃",
      power: 4
    },
    {
      name: "アンジェロ",
      reason: "水路を挟んだ狙撃",
      power: 4
    },
    {
      name: "ブロック",
      reason: "水路越しの攻撃",
      power: 3
    },
    {
      name: "ベリー",
      reason: "水路を挟んだ狙撃",
      power: 3
    },
    {
      name: "グレイ",
      reason: "水路越しの攻撃",
      power: 3
    },
    {
      name: "バーリー",
      reason: "水路越しの攻撃",
      power: 3
    },
    {
      name: "ラリー&ローリー",
      reason: "水路越しの攻撃",
      power: 3
    },
    {
      name: "キット",
      reason: "水路越しの攻撃",
      power: 3
    },
    {
      name: "ダリル",
      reason: "水路越しの攻撃",
      power: 3
    },
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
      name: "エリザベス",
      reason: "水路での移動が得意",
      power: 5
    },
    {
      name: "バイロン",
      reason: "水路を挟んだ狙撃",
      power: 5
    },
    {
      name: "ガス",
      reason: "水路越しの攻撃",
      power: 5
    },
    {
      name: "R-T",
      reason: "水路での移動が得意",
      power: 5
    },
    {
      name: "ジーン",
      reason: "水路を挟んだ狙撃",
      power: 5
    },
    {
      name: "ティック",
      reason: "水路越しの攻撃",
      power: 5
    },
    {
      name: "スプラウト",
      reason: "水路での移動が得意",
      power: 5
    },
    {
      name: "ジュジュ",
      reason: "水路を挟んだ狙撃",
      power: 5
    },
    {
      name: "バスター",
      reason: "水路越しの攻撃",
      power: 5
    },
    {
      name: "ベル",
      reason: "水路を挟んだ狙撃",
      power: 4
    },
    {
      name: "マンディ",
      reason: "水路越しの攻撃",
      power: 4
    },
    {
      name: "アンジェロ",
      reason: "水路を挟んだ狙撃",
      power: 4
    },
    {
      name: "グレイ",
      reason: "水路越しの攻撃",
      power: 4
    },
    {
      name: "リコ",
      reason: "水路越しの攻撃",
      power: 3
    },
    {
      name: "ナーニ",
      reason: "水路越しの攻撃",
      power: 3
    },
    {
      name: "ブロック",
      reason: "水路越しの攻撃",
      power: 3
    },
    {
      name: "イヴ",
      reason: "水路越しの攻撃",
      power: 3
    },
    {
      name: "キット",
      reason: "水路越しの攻撃",
      power: 3
    },
    {
      name: "ダリル",
      reason: "水路越しの攻撃",
      power: 3
    },
    ],
    tips: [
      "通路での待ち伏せに警戒",
      "開けた場所での露出を避ける",
      "チームの散開を防ぐ"
    ]
  },
};