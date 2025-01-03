import { MapDetail } from '../../types/type';

export const brawlBall5vs5Maps: Record<string, MapDetail> = {
    "大波": {
    id: "bb5_great_waves",
    name: "大波",
    mode: "brawlBall5v5",
    description: "波のような曲線の壁が特徴的な5vs5マップ。ボール運びのルート選択が重要です。",
    characteristics: ["曲線壁", "多人数戦", "ルート選択"],
    difficulty: "Hard",
    recommendedBrawlers: [
      {
        name: "エメル",
        reason: "壁を利用したシュートが得意",
        power: 5
      },
      {
        name: "モーティス",
        reason: "高速なボール運びが可能",
        power: 4
      },
      {
        name: "コルト",
        reason: "壁破壊での新ルート作成",
        power: 4
      }
    ],
    tips: [
      "味方との連携を重視",
      "壁の形状を活用したパス",
      "相手の数的優位に注意"
    ]
  },
  "ガクブル公園": {
    id: "bb5_icy_ice_park",
    name: "ガクブル公園",
    mode: "brawlBall5v5",
    description: "広場と通路が組み合わさった5vs5マップ。チーム全体での陣形取りが重要です。",
    characteristics: ["複合地形", "5vs5戦術", "陣形重視"],
    difficulty: "Medium",
    recommendedBrawlers: [
      {
        name: "ジーン",
        reason: "敵の陣形を崩せる",
        power: 5
      },
      {
        name: "タラ",
        reason: "広範囲での制圧が可能",
        power: 4
      },
      {
        name: "バイロン",
        reason: "味方の回復とサポート",
        power: 4
      }
    ],

    tips: [
      "5人の位置取りを意識",
      "ボール持ちの援護を重視",
      "相手の陣形変化に対応"
    ]
  },
  "ツルツルロード": {
    id: "bb5_slippery_road",
    name: "ツルツルロード",
    mode: "brawlBall5v5",
    description: "滑りやすい路面が特徴の5vs5マップ。ボール保持と移動の慎重さが求められます。",
    characteristics: ["特殊地形", "チーム戦", "慎重プレー"],
    difficulty: "Hard",
    recommendedBrawlers: [
      {        name: "シェリー",
        reason: "近距離での制圧力",
        power: 5
      },
      {
        name: "ジーン",
        reason: "味方のサポートが可能",
        power: 4
      },
      {
        name: "ローサ",
        reason: "エリア確保が得意",
        power: 4
      }
    ],

    tips: [
      "急な動きを避ける",
      "味方との間隔を保つ",
      "地形特性を理解する"
    ]
  },
  "クールシェイプ": {
    id: "bb5_cool_shapes",
    name: "クールシェイプ",
    mode: "brawlBall5v5",
    description: "幾何学的な形状の壁配置が特徴的な5vs5マップ。形状を活かした連携が重要です。",
    characteristics: ["幾何学構造", "連携重視", "5vs5戦術"],
    difficulty: "Medium",
    recommendedBrawlers: [
      {
        name: "リコ",
        reason: "壁の形状を活かした攻撃",
        power: 5
      },
      {
        name: "エメル",
        reason: "地形を利用した制圧",
        power: 4
      },
      {
        name: "ナイタ",
        reason: "形状を活かした包囲",
        power: 4
      }
    ],
    tips: [
      "壁の形状を把握する",
      "チームの散開と集中を使い分け",
      "形状を活かした守備位置"
    ]
  },
  "サスペンダーズ": {
    id: "bb5_suspenders",
    name: "サスペンダーズ",
    mode: "brawlBall5v5",
    description: "中央に特徴的な通路があるマップ。通路の制圧と横展開のバランスが重要です。",
    characteristics: ["中央通路", "横展開", "陣形変化"],
    difficulty: "Hard",
    recommendedBrawlers: [
      {
        name: "タラ",
        reason: "通路での制圧力が高い",
        power: 5
      },
      {
        name: "ジーン",
        reason: "敵の陣形を崩せる",
        power: 4
      },
      {
        name: "バイロン",
        reason: "広範囲のサポートが可能",
        power: 4
      }
    ],

    tips: [
      "通路での接近戦に注意",
      "横からの展開を意識",
      "チームの連携を重視"
    ]
  },
   "フロスティトラック": {
    id: "bb5_frosty_tracks",
    name: "フロスティトラック",
    mode: "brawlBall5v5",
    description: "氷のような滑らかな地形での5vs5戦。慎重な動きと正確な判断が必要です。",
    characteristics: ["滑走地形", "精密操作", "5人連携"],
    difficulty: "Expert",
    recommendedBrawlers: [
      {
        name: "スパイク",        reason: "地形制御能力",
        power: 5
      },
      {
        name: "バイロン",
        reason: "味方のサポート",
        power: 4
      },
      {
        name: "エメル",
        reason: "正確な射撃能力",
        power: 4
      }
    ],

    tips: [
      "滑走に注意した移動",
      "チームの連携を重視",
      "過度な動きを控える"
    ]
  },
  "凍てつく波紋": {
    id: "bb5_freezing_ripples",
    name: "凍てつく波紋",
    mode: "brawlBall5v5",
    description: "波紋のような氷の地形が特徴的な5vs5マップ。地形の特性を理解した戦術が重要です。",
    characteristics: ["特殊地形", "波紋状構造", "戦術性"],
    difficulty: "Hard",
    recommendedBrawlers: [
      {
        name: "タラ",
        reason: "広範囲での制圧",
        power: 5
      },
      {
        name: "ジーン",
        reason: "地形を活かした引き込み",
        power: 4
      },
      {
        name: "グロム",
        reason: "地形を利用した攻撃",
        power: 4
      }
    ],

    tips: [      "波紋状の地形を把握",
      "5人での連携を重視",
      "地形の利点を最大化"
    ]
  },
  "合流地点": {
    id: "bb5_riverbank_crossing",
    name: "合流地点",
    mode: "brawlBall5v5",
    description: "複数の経路が合流する5vs5マップ。ルート選択と合流タイミングが重要です。",
    characteristics: ["合流地点", "ルート選択", "5人連携"],
    difficulty: "Hard",
    recommendedBrawlers: [
      {
        name: "エメル",
        reason: "合流地点での制圧",
        power: 5
      },
      {
        name: "バイロン",
        reason: "広範囲サポート",
        power: 4
      },
      {
        name: "ジーン",
        reason: "要所での引き寄せ",
        power: 4
      }
    ],

    tips: [
      "合流ポイントの把握",
      "5人での連携を重視",
      "ルートの切り替えを柔軟に"
    ]
  },
}