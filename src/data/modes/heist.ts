import { MapDetail } from '../../types/type';

export const heistMaps: Record<string, MapDetail> = {
    "安全地帯": {
    id: "he_safe_zone",
    name: "安全地帯",
    mode: "heist",
    description: "金庫を中心とした防衛戦。多くのカバーを活用した攻防が特徴です。",
    characteristics: ["金庫中心", "カバー豊富", "攻防一体"],
    difficulty: "Medium",
    recommendedBrawlers: [
      {
        name: "クロウ",
        reason: "通路での強さを発揮",
        power: 5
      },
      {
        name: "コレット",
        reason: "高所からの制圧",
        power: 5
      },
      {
        name: "チャック",
        reason: "壁跳ね攻撃が有効",
        power: 5
      },
      {
        name: "メロディー",
        reason: "通路での強さを発揮",
        power: 5
      },
      {
        name: "コルト",
        reason: "高所からの制圧",
        power: 5
      },
      {
        name: "イヴ",
        reason: "壁跳ね攻撃が有効",
        power: 5
      },
      {
        name: "アンジェロ",
        reason: "壁跳ね攻撃が有効",
        power: 5
      },
      {
        name: "エリザベス",
        reason: "壁跳ね攻撃が有効",
        power: 4
      },
      {
        name: "バイロン",
        reason: "壁跳ね攻撃が有効",
        power: 4
      },
      {
        name: "ベル",
        reason: "壁跳ね攻撃が有効",
        power: 4
      },
      {
        name: "アンバー",
        reason: "壁跳ね攻撃が有効",
        power: 4
      },
      {
        name: "ミコ",
        reason: "壁跳ね攻撃が有効",
        power: 3
      },
      {
        name: "ダリル",
        reason: "壁跳ね攻撃が有効",
        power: 3
      },
      {
        name: "ペニー",
        reason: "壁跳ね攻撃が有効",
        power: 3
      },
      {
        name: "ブロック",
        reason: "壁跳ね攻撃が有効",
        power: 3
      },
      {
        name: "R-T",
        reason: "壁跳ね攻撃が有効",
        power: 3
      },
      {
        name: "ブロック",
        reason: "壁跳ね攻撃が有効",
        power: 3
      },
      {
        name: "8ビット",
        reason: "壁跳ね攻撃が有効",
        power: 3
      },
      {
        name: "ボニー",
        reason: "壁跳ね攻撃が有効",
        power: 2
      },
    ],

    tips: [
      "壁の破壊状況を把握",
      "金庫までの最短ルート確認",
      "チームの攻守のバランス"
    ]
  },
  "パラレルワールド": {
    id: "he_parallel_plays",
    name: "パラレルワールド",
    mode: "heist",
    description: "左右対称の平行した通路が特徴。攻撃ルートの選択と防衛位置が重要です。",
    characteristics: ["対称構造", "並行通路", "ルート選択"],
    difficulty: "Hard",
    recommendedBrawlers: [
      {
      name: "ストゥー",
      reason: "水路での移動が得意",
      power: 5
    },
    {
      name: "サージ",
      reason: "水路を挟んだ狙撃",
      power: 5
    },
    {
      name: "ジュジュ",
      reason: "水路越しの攻撃",
      power: 5
    },
    {
      name: "ラリー&ローリー",
      reason: "水路での移動が得意",
      power: 5
    },
    {
      name: "バーリー",
      reason: "水路を挟んだ狙撃",
      power: 5
    },
    {
      name: "バーリー",
      reason: "水路越しの攻撃",
      power: 5
    },
    {
      name: "ウィロー",
      reason: "水路での移動が得意",
      power: 5
    },
    {
      name: "R-T",
      reason: "水路を挟んだ狙撃",
      power: 4
    },
    {
      name: "ダイナマイク",
      reason: "水路越しの攻撃",
      power: 4
    },
    {
      name: "ガス",
      reason: "水路を挟んだ狙撃",
      power: 4
    },
    {
      name: "メロディー",
      reason: "水路越しの攻撃",
      power: 4
    },
    {
      name: "ケンジ",
      reason: "水路を挟んだ狙撃",
      power: 4
    },
    {
      name: "ダグ",
      reason: "水路越しの攻撃",
      power: 4
    },
    {
      name: "フランケン",
      reason: "水路を挟んだ狙撃",
      power: 4
    },
    {
      name: "コーデリアス",
      reason: "水路越しの攻撃",
      power: 3
    },
    {
      name: "バイロン",
      reason: "水路越しの攻撃",
      power: 3
    },
    {
      name: "ビビ",
      reason: "水路越しの攻撃",
      power: 3
    },
    {
      name: "ジャッキー",
      reason: "水路越しの攻撃",
      power: 3
    },
    ],

    tips: [
      "通路での待ち伏せに注意",
      "ルートの切り替えを柔軟に",
      "チームの集中と分散を判断"
    ]
  },
  "炎のリング": {
    id: "he_ring_of_fire",
    name: "炎のリング",
    mode: "heist",
    description: "円形の地形に金庫が配置され、様々な角度からの攻撃が可能なマップです。",
    characteristics: ["円形地形", "多角的攻撃", "守備範囲広"],
    difficulty: "Expert",
    recommendedBrawlers: [
      {
      name: "ガス",
      reason: "水路での移動が得意",
      power: 5
    },
    {
      name: "バイロン",
      reason: "水路を挟んだ狙撃",
      power: 5
    },
    {
      name: "ペニー",
      reason: "水路越しの攻撃",
      power: 5
    },
    {
      name: "リコ",
      reason: "水路での移動が得意",
      power: 5
    },
    {
      name: "ジュジュ",
      reason: "水路を挟んだ狙撃",
      power: 5
    },
    {
      name: "ラフス",
      reason: "水路越しの攻撃",
      power: 5
    },
    {
      name: "ストゥー",
      reason: "水路での移動が得意",
      power: 5
    },
    {
      name: "サージ",
      reason: "水路を挟んだ狙撃",
      power: 4
    },
    {
      name: "スクウィーク",
      reason: "水路越しの攻撃",
      power: 4
    },
    {
      name: "フランケン",
      reason: "水路を挟んだ狙撃",
      power: 4
    },
    {
      name: "マックス",
      reason: "水路越しの攻撃",
      power: 4
    },
    {
      name: "グレイ",
      reason: "水路越しの攻撃",
      power: 3
    },
    {
      name: "ラリー&ローリー",
      reason: "水路を挟んだ狙撃",
      power: 3
    },
    {
      name: "タラ",
      reason: "水路を挟んだ狙撃",
      power: 3
    },
    {
      name: "カール",
      reason: "水路越しの攻撃",
      power: 3
    },
    {
      name: "ベリー",
      reason: "水路越しの攻撃",
      power: 3
    },
    {
      name: "ジェシー",
      reason: "水路越しの攻撃",
      power: 3
    },
    ],

    tips: [
      "死角からの攻撃を意識",
      "防衛範囲の優先順位付け",
      "チームでの攻撃角度分散"
    ]
  },
  "大いなる湖": {
    id: "he_great_lake",
    name: "大いなる湖",
    mode: "heist",
    description: "湖を挟んだ金庫防衛戦。水路の活用と横断タイミングが重要です。",
    characteristics: ["水路地形", "横断戦術", "長距離戦"],
    difficulty: "Hard",
    recommendedBrawlers: [
      {
        name: "パイパー",
        reason: "湖を挟んでの狙撃が有効",
        power: 5
      },
      {
        name: "ダリル",
        reason: "水路横断能力が高い",
        power: 4
      },
      {
        name: "ペニー",
        reason: "砲台での長距離攻撃",
        power: 4
      }
    ],

    tips: [
      "水中での移動は最小限に",
      "横断時の援護を重視",
      "長距離戦での体力管理"
    ]
  },
  "GG 2.0": {
    id: "he_gg_2",
    name: "GG 2.0",
    mode: "heist",
    description: "アップデートされた金庫防衛マップ。多彩な攻撃ルートが特徴です。",
    characteristics: ["複数ルート", "戦略性高", "バランス型"],
    difficulty: "Medium",
    recommendedBrawlers: [
      {
        name: "コルト",
        reason: "多彩なルート開拓",
        power: 5
      },
      {
        name: "スパイク",
        reason: "金庫への高火力",
        power: 4
      },
      {
        name: "ペニー",
        reason: "砲台での守備が有効",
        power: 4
      }
    ],

    tips: [
      "ルートの使い分けを意識",
      "チームでの連携を重視",
      "守備位置の柔軟な変更"
    ]
  },
  "ビートルバトル": {
    id: "he_dueling_beetles",
    name: "ビートルバトル",
    mode: "heist",
    description: "対称的な構造の中での金庫戦。攻守の切り替えが素早く求められます。",
    characteristics: ["対称構造", "攻守転換", "戦略性"],
    difficulty: "Hard",
    recommendedBrawlers: [
    {
      name: "ガス",
      reason: "水路での移動が得意",
      power: 5
    },
    {
      name: "バイロン",
      reason: "水路を挟んだ狙撃",
      power: 5
    },
    {
      name: "ペニー",
      reason: "水路越しの攻撃",
      power: 5
    },
    {
      name: "ストゥー",
      reason: "水路での移動が得意",
      power: 5
    },
    {
      name: "ジュジュ",
      reason: "水路を挟んだ狙撃",
      power: 5
    },
    {
      name: "バーリー",
      reason: "水路越しの攻撃",
      power: 5
    },
    {
      name: "ラリー&ローリー",
      reason: "水路での移動が得意",
      power: 5
    },
    {
      name: "サージ",
      reason: "水路を挟んだ狙撃",
      power: 4
    },
    {
      name: "スクウィーク",
      reason: "水路越しの攻撃",
      power: 4
    },
    {
      name: "ジェシー",
      reason: "水路を挟んだ狙撃",
      power: 4
    },
    {
      name: "フランケン",
      reason: "水路越しの攻撃",
      power: 4
    },
    {
      name: "ベリー",
      reason: "水路を挟んだ狙撃",
      power: 3
    },
    {
      name: "ビビ",
      reason: "水路越しの攻撃",
      power: 3
    },
    {
      name: "ルー",
      reason: "水路越しの攻撃",
      power: 3
    },
    {
      name: "グレイ",
      reason: "水路越しの攻撃",
      power: 3
    },
    {
      name: "メロディー",
      reason: "水路越しの攻撃",
      power: 3
    },
    ],

    tips: [
      "攻守の切り替えを躊躇しない",
      "チームでの判断を統一",
      "金庫の体力差を意識"
    ]
  },
  "ホットポテト": {
    id: "he_hot_potato",
    name: "ホットポテト",
    mode: "heist",
    description: "熱いバトルが繰り広げられる金庫マップ。中央での戦いが激しくなります。",
    characteristics: ["中央激戦", "リスク管理", "攻防一体"],
    difficulty: "Medium",
    recommendedBrawlers: [
      {
        name: "クロウ",
        reason: "通路での強さを発揮",
        power: 5
      },
      {
        name: "コレット",
        reason: "高所からの制圧",
        power: 5
      },
      {
        name: "チャック",
        reason: "壁跳ね攻撃が有効",
        power: 5
      },
      {
        name: "メロディー",
        reason: "通路での強さを発揮",
        power: 5
      },
      {
        name: "バーリー",
        reason: "高所からの制圧",
        power: 5
      },
      {
        name: "ラリー&ローリー",
        reason: "壁跳ね攻撃が有効",
        power: 5
      },
      {
        name: "ジュジュ",
        reason: "壁跳ね攻撃が有効",
        power: 5
      },
      {
        name: "ベリー",
        reason: "壁跳ね攻撃が有効",
        power: 5
      },
      {
        name: "ダイナマイク",
        reason: "壁跳ね攻撃が有効",
        power: 5
      },
      {
        name: "リコ",
        reason: "壁跳ね攻撃が有効",
        power: 4
      },
      {
        name: "ミコ",
        reason: "壁跳ね攻撃が有効",
        power: 4
      },
      {
        name: "ニタ",
        reason: "壁跳ね攻撃が有効",
        power: 3
      },
      {
        name: "フランケン",
        reason: "壁跳ね攻撃が有効",
        power: 3
      },
      {
        name: "ダリル",
        reason: "壁跳ね攻撃が有効",
        power: 3
      },
      {
        name: "ジェシー",
        reason: "壁跳ね攻撃が有効",
        power: 3
      },
      {
        name: "コルト",
        reason: "壁跳ね攻撃が有効",
        power: 3
      },
    ],
    tips: [
      "中央の支配権を意識",
      "無理な突っ込みを避ける",
      "チームの体力管理"
    ]
  },
   "どんぱち谷": {
    id: "he_kaboom_canyon",
    name: "どんぱち谷",
    mode: "heist",
    description: "爆発的な戦いが繰り広げられる渓谷マップ。壁の破壊が戦況を大きく変えます。",
    characteristics: ["壁破壊重要", "地形変化", "ダイナミック"],
    difficulty: "Hard",
    recommendedBrawlers: [
      {
        name: "クロウ",
        reason: "通路での強さを発揮",
        power: 5
      },
      {
        name: "コレット",
        reason: "高所からの制圧",
        power: 5
      },
      {
        name: "チャック",
        reason: "壁跳ね攻撃が有効",
        power: 5
      },
      {
        name: "メロディー",
        reason: "通路での強さを発揮",
        power: 5
      },
      {
        name: "コルト",
        reason: "高所からの制圧",
        power: 5
      },
      {
        name: "エリザベス",
        reason: "壁跳ね攻撃が有効",
        power: 4
      },
      {
        name: "イヴ",
        reason: "壁跳ね攻撃が有効",
        power: 4
      },
      {
        name: "アンジェロ",
        reason: "壁跳ね攻撃が有効",
        power: 4
      },
      {
        name: "バイロン",
        reason: "壁跳ね攻撃が有効",
        power: 4
      },
      {
        name: "ベル",
        reason: "壁跳ね攻撃が有効",
        power: 4
      },
      {
        name: "アンバー",
        reason: "壁跳ね攻撃が有効",
        power: 4
      },
      {
        name: "ペニー",
        reason: "壁跳ね攻撃が有効",
        power: 3
      },
      {
        name: "ナーニ",
        reason: "壁跳ね攻撃が有効",
        power: 3
      },
      {
        name: "ブロック",
        reason: "壁跳ね攻撃が有効",
        power: 3
      },
      {
        name: "ミコ",
        reason: "壁跳ね攻撃が有効",
        power: 3
      },
    ],

    tips: [
      "壁破壊の優先順位",
      "変化する地形への適応",
      "チームでの破壊範囲分担"
    ]
  },
  "喧騒居住地": {
    id: "he_noisy_neighbors",
    name: "喧騒居住地",
    mode: "heist",
    description: "騒がしい住宅地での金庫戦。近接戦と遠距離戦のバランスが重要です。",
    characteristics: ["住宅地形", "混合戦", "バランス型"],
    difficulty: "Medium",
    recommendedBrawlers: [
      {
        name: "バル",
        reason: "近距離での制圧力",
        power: 5
      },
      {
        name: "パイパー",
        reason: "遠距離からの牽制",
        power: 4
      },
      {
        name: "タラ",
        reason: "中距離での影響力",
        power: 4
      }
    ],

    tips: [
      "距離帯の使い分けを意識",
      "建物の利用を工夫",
      "チームの連携を重視"
    ]
  },
  "オープンビジネス": {
    id: "he_open_business",
    name: "オープンビジネス",
    mode: "heist",
    description: "開放的な地形での金庫戦。様々な角度からの攻撃と防御が可能です。",
    characteristics: ["開放地形", "多角的戦術", "視界確保"],
    difficulty: "Medium",
    recommendedBrawlers: [
      {
      name: "バイロン",
      reason: "水路での移動が得意",
      power: 5
    },
    {
      name: "ガス",
      reason: "水路を挟んだ狙撃",
      power: 5
    },
    {
      name: "ストゥー",
      reason: "水路越しの攻撃",
      power: 5
    },
    {
      name: "サージ",
      reason: "水路での移動が得意",
      power: 5
    },
    {
      name: "バーリー",
      reason: "水路を挟んだ狙撃",
      power: 5
    },
    {
      name: "ラリー&ローリー",
      reason: "水路越しの攻撃",
      power: 5
    },
    {
      name: "コーデリアス",
      reason: "水路での移動が得意",
      power: 5
    },
    {
      name: "フランケン",
      reason: "水路を挟んだ狙撃",
      power: 4
    },
    {
      name: "ベリー",
      reason: "水路越しの攻撃",
      power: 4
    },
    {
      name: "ジュジュ",
      reason: "水路を挟んだ狙撃",
      power: 4
    },
    {
      name: "ダイナマイク",
      reason: "水路越しの攻撃",
      power: 4
    },
    {
      name: "ニタ",
      reason: "水路越しの攻撃",
      power: 3
    },
    {
      name: "ケンジ",
      reason: "水路越しの攻撃",
      power: 3
    },
    {
      name: "グレイ",
      reason: "水路越しの攻撃",
      power: 3
    },
    {
      name: "ジェシー",
      reason: "水路越しの攻撃",
      power: 3
    },
    {
      name: "メロディー",
      reason: "水路越しの攻撃",
      power: 3
    },
    {
      name: "スクウィーク",
      reason: "水路越しの攻撃",
      power: 3
    },
    {
      name: "タラ",
      reason: "水路越しの攻撃",
      power: 3
    },
    ],

    tips: [
      "視界の確保を重視",
      "攻撃角度の変更を工夫",
      "チームでの連携攻撃"
    ]
  },
  "安全地帯・改": {
    id: "he_safer_zone",
    name: "安全地帯・改",
    mode: "heist",
    description: "オリジナルの安全地帯を改良したマップ。より戦略的な要素が加わり、バランスが調整されています。",
    characteristics: ["改良地形", "戦略的防衛", "バランス調整"],
    difficulty: "Hard",
    recommendedBrawlers: [
      {
        name: "スパイク",
        reason: "金庫への高火力と地形活用",
        power: 5
      },
      {
        name: "ブロック",
        reason: "防衛壁の設置が効果的",
        power: 4
      },
      {
        name: "バイロン",
        reason: "チームサポートと長距離攻撃",
        power: 4
      }
    ],

    tips: [
      "新しい地形の特徴を把握",
      "改良された防衛位置の活用",
      "チームでの連携を強化"
    ]
  },
  "ウォータースポーツ": {
    id: "he_watersport",
    name: "ウォータースポーツ",
    mode: "heist",
    description: "水域が特徴的な金庫マップ。水路の活用と陸路での戦いのバランスが重要です。",
    characteristics: ["水路活用", "複合地形", "立体的戦略"],
    difficulty: "Expert",
    recommendedBrawlers: [
      {
        name: "ダリル",
        reason: "水路を活用した奇襲が得意",
        power: 5
      },
      {
        name: "ルー",
        reason: "水上での機動力が高い",
        power: 4
      },
      {
        name: "エメル",
        reason: "広範囲での制圧が可能",
        power: 4
      }
    ],

    tips: [
      "水中での移動タイミング",
      "陸路からの援護を意識",
      "水域での待ち伏せに警戒"
    ]
  },
};