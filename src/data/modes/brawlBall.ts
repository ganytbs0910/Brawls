//brawlBall.ts
import { MapDetail } from '../../types/type';

export const brawlBallMaps: Record<string, MapDetail> = {
     "セカンドチャンス": {
    id: "bb_second_try",
    name: "セカンドチャンス",
    mode: "brawlBall",
    description: "シンプルながら戦略性の高いブロウルボールマップ。基本に忠実な立ち回りが重要です。",
    characteristics: ["基本重視", "シンプル構造", "戦略性"],
    difficulty: "Easy",
    recommendedBrawlers: [
      {
        name: "メロディー",
        reason: "",
        power: 5
      },
      {
        name: "MAX",
        reason: "",
        power: 5
      },
      {
        name: "ベル",
        reason: "",
        power: 5
      },
      {
        name: "エリザベス",
        reason: "",
        power: 5
      },
      {
        name: "ガス",
        reason: "",
        power: 5
      },
      {
        name: "バイロン",
        reason: "",
        power: 5
      },
      {
        name: "ストゥー",
        reason: "",
        power: 5
      },
      {
        name: "カール",
        reason: "",
        power: 4
      },
      {
        name: "ペニー",
        reason: "",
        power: 4
      },
      {
        name: "ビー",
        reason: "",
        power: 4
      },
      {
        name: "フランケン",
        reason: "",
        power: 4
      },
      {
        name: "ローラ",
        reason: "",
        power: 3
      },
      {
        name: "イヴ",
        reason: "",
        power: 3
      },
      {
        name: "ルー",
        reason: "",
        power: 3
      },
      {
        name: "サム",
        reason: "",
        power: 2
      },
      {
        name: "ファング",
        reason: "",
        power: 2
      },
      {
        name: "チャーリー",
        reason: "",
        power: 2
      },
    ],
    tips: [
      "基本的なパス回しを重視",
      "無理な突っ込みを避ける",
      "守備の基本を固める"
    ]
  },
  "鉄壁の守り": {
    id: "bb_backyard_bowl",
    name: "鉄壁の守り",
    mode: "brawlBall",
    description: "防衛が重要視されるブロウルボールマップ。堅実な攻めが求められます。",
    characteristics: ["防衛重視", "ゴール前狭い", "堅実プレー"],
    difficulty: "Medium",
    recommendedBrawlers: [
      {
        name: "ガス",
        reason: "",
        power: 5
      },
      {
        name: "バイロン",
        reason: "",
        power: 5
      },
      {
        name: "エリザベス",
        reason: "",
        power: 5
      },
      {
        name: "MAX",
        reason: "",
        power: 5
      },
      {
        name: "ジュジュ",
        reason: "",
        power: 5
      },
      {
        name: "ストゥー",
        reason: "",
        power: 4
      },
      {
        name: "ブロック",
        reason: "",
        power: 4
      },
      {
        name: "カール",
        reason: "",
        power: 4
      },
      {
        name: "ビー",
        reason: "",
        power: 4
      },
      {
        name: "ボウ",
        reason: "",
        power: 4
      },
      {
        name: "グレイ",
        reason: "",
        power: 4
      },
      {
        name: "ベル",
        reason: "",
        power: 3
      },
    ],

    tips: [
      "ゴール前の陣形を維持",
      "無理な攻めを控える",
      "カウンター機会を狙う"
    ]
  },
  "ピンボールドリーム": {
    id: "bb_pinball_dreams",
    name: "ピンボールドリーム",
    mode: "brawlBall",
    description: "壁の配置が特徴的なマップ。ボールの跳ね返りを活用した攻撃が有効です。",
    characteristics: ["壁反射", "複雑な地形", "技巧的"],
    difficulty: "Expert",
    recommendedBrawlers: [
      {
      name: "サージ",
      reason: "水路での移動が得意",
      power: 5
    },
    {
      name: "ストゥー",
      reason: "水路を挟んだ狙撃",
      power: 5
    },
    {
      name: "ラリー&ローリー",
      reason: "水路越しの攻撃",
      power: 5
    },
    {
      name: "ジュジュ",
      reason: "水路での移動が得意",
      power: 5
    },
    {
      name: "ダイナマイク",
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
      name: "バイロン",
      reason: "水路を挟んだ狙撃",
      power: 4
    },
    {
      name: "ガス",
      reason: "水路越しの攻撃",
      power: 4
    },
    {
      name: "オーティス",
      reason: "水路を挟んだ狙撃",
      power: 4
    },
    {
      name: "Max",
      reason: "水路越しの攻撃",
      power: 4
    },
    {
      name: "ニタ",
      reason: "水路を挟んだ狙撃",
      power: 4
    },
    {
      name: "リコ",
      reason: "水路越しの攻撃",
      power: 4
    },
    {
      name: "バスター",
      reason: "水路を挟んだ狙撃",
      power: 4
    },
    {
      name: "フランケン",
      reason: "水路越しの攻撃",
      power: 4
    },
    {
      name: "ジャッキー",
      reason: "水路越しの攻撃",
      power: 4
    },
    {
      name: "ビビ",
      reason: "水路越しの攻撃",
      power: 4
    },
    {
      name: "ダリル",
      reason: "水路越しの攻撃",
      power: 4
    },
    {
      name: "モーティス",
      reason: "水路越しの攻撃",
      power: 3
    },
    {
      name: "サンディ",
      reason: "水路越しの攻撃",
      power: 3
    },
    {
      name: "コーデリアス",
      reason: "水路越しの攻撃",
      power: 3
    },
    {
      name: "ベリー",
      reason: "水路越しの攻撃",
      power: 3
    },
    ],

    tips: [
      "壁の跳ね返りを計算",
      "地形変化に対応",
      "相手の移動を制限"
    ]
  },
  "狭き門": {
    id: "bb_pinhole_punt",
    name: "狭き門",
    mode: "brawlBall",
    description: "ゴール前が特に狭いブロウルボールマップ。正確なシュートと堅実な守備が求められます。",
    characteristics: ["狭いゴール前", "精密性", "守備重要"],
    difficulty: "Hard",
    recommendedBrawlers: [
      {
        name: "サンディ",
        reason: "",
        power: 5
      },
      {
        name: "Emz",
        reason: "",
        power: 5
      },
      {
        name: "カール",
        reason: "",
        power: 5
      },
      {
        name: "ガス",
        reason: "",
        power: 5
      },
      {
        name: "バイロン",
        reason: "",
        power: 5
      },
      {
        name: "MAX",
        reason: "",
        power: 5
      },
      {
        name: "ストゥー",
        reason: "",
        power: 5
      },
      {
        name: "フランケン",
        reason: "",
        power: 5
      },
      {
        name: "リコ",
        reason: "",
        power: 4
      },
      {
        name: "ビビ",
        reason: "",
        power: 4
      },
      {
        name: "ビー",
        reason: "",
        power: 4
      },
      {
        name: "コレット",
        reason: "",
        power: 4
      },
      {
        name: "バズ",
        reason: "",
        power: 4
      },
      {
        name: "スクウィーク",
        reason: "",
        power: 4
      },
      {
        name: "オーティス",
        reason: "",
        power: 4
      },
      {
        name: "バスター",
        reason: "",
        power: 4
      },
      {
        name: "アンバー",
        reason: "",
        power: 3
      },
      {
        name: "ジャネット",
        reason: "",
        power: 3
      },
      {
        name: "ラリー&ローリー",
        reason: "",
        power: 3
      },
      {
        name: "ベリー",
        reason: "",
        power: 3
      },
      {
        name: "イヴ",
        reason: "",
        power: 3
      },
    ],
    tips: [
      "シュートは確実に",
      "ゴール前の守備を固める",
      "焦らず正確なプレーを"
    ]
  },
  "中央コート": {
    id: "bb_center_stage",
    name: "中央コート",
    mode: "brawlBall",
    description: "中央に広場があるシンメトリーなマップ。中央支配権の争いが重要です。",
    characteristics: ["中央広場", "シンメトリー", "エリア支配"],
    difficulty: "Medium",
    recommendedBrawlers: [
      {
      name: "サージ",
      reason: "水路での移動が得意",
      power: 5
    },
    {
      name: "リコ",
      reason: "水路を挟んだ狙撃",
      power: 5
    },
    {
      name: "ニタ",
      reason: "水路越しの攻撃",
      power: 5
    },
    {
      name: "オーティス",
      reason: "水路での移動が得意",
      power: 4
    },
    {
      name: "ジュジュ",
      reason: "水路を挟んだ狙撃",
      power: 4
    },
    {
      name: "ストゥー",
      reason: "水路越しの攻撃",
      power: 4
    },
    {
      name: "サンディ",
      reason: "水路での移動が得意",
      power: 4
    },
    {
      name: "フランケン",
      reason: "水路を挟んだ狙撃",
      power: 4
    },
    {
      name: "ダリル",
      reason: "水路越しの攻撃",
      power: 4
    },
    {
      name: "ジャッキー",
      reason: "水路を挟んだ狙撃",
      power: 4
    },
    {
      name: "バスター",
      reason: "水路越しの攻撃",
      power: 4
    },
    {
      name: "Max",
      reason: "水路を挟んだ狙撃",
      power: 3
    },
    {
      name: "コーデリアス",
      reason: "水路越しの攻撃",
      power: 3
    },
    {
      name: "バズ",
      reason: "水路越しの攻撃",
      power: 3
    },
    {
      name: "タラ",
      reason: "水路越しの攻撃",
      power: 3
    },
    {
      name: "ラリー&ローリー",
      reason: "水路越しの攻撃",
      power: 3
    },
    {
      name: "ゲイル",
      reason: "水路越しの攻撃",
      power: 3
    },
    {
      name: "ローサ",
      reason: "水路越しの攻撃",
      power: 3
    },
    ],

    tips: [
      "中央の支配権を維持",
      "サイドからの展開も意識",
      "チームの散開と集中"
    ]
  },
  "ビーチボール": {
    id: "bb_beach_ball",
    name: "ビーチボール",
    mode: "brawlBall",
    description: "ビーチをテーマにした開放的なマップ。砂地での機動力と正確な判断が求められます。",
    characteristics: ["開放地形", "砂地戦", "機動戦"],
    difficulty: "Medium",
    recommendedBrawlers: [
      {
        name: "ジュジュ",
        reason: "",
        power: 5
      },
      {
        name: "ラリー&ローリー",
        reason: "",
        power: 5
      },
      {
        name: "バーリー",
        reason: "",
        power: 5
      },
      {
        name: "フランケン",
        reason: "",
        power: 5
      },
      {
        name: "ビビ",
        reason: "",
        power: 5
      },
      {
        name: "ストゥー",
        reason: "",
        power: 5
      },
      {
        name: "MAX",
        reason: "",
        power: 5
      },
      {
        name: "サージ",
        reason: "",
        power: 5
      },
      {
        name: "サンディ",
        reason: "",
        power: 5
      },
      {
        name: "ダイナマイク",
        reason: "",
        power: 4
      },
      {
        name: "ダリル",
        reason: "",
        power: 4
      },
      {
        name: "カール",
        reason: "",
        power: 4
      },
      {
        name: "コーデリアス",
        reason: "",
        power: 4
      },
      {
        name: "オーティス",
        reason: "",
        power: 4
      },
      {
        name: "バイロン",
        reason: "",
        power: 4
      },
      {
        name: "タラ",
        reason: "",
        power: 3
      },
      {
        name: "リリー",
        reason: "",
        power: 3
      },
      {
        name: "ウィロー",
        reason: "",
        power: 3
      },
      {
        name: "ジャッキー",
        reason: "",
        power: 3
      },
      {
        name: "メイジー",
        reason: "",
        power: 3
      },
      {
        name: "シェイド",
        reason: "",
        power: 3
      },
      {
        name: "モー",
        reason: "",
        power: 3
      },
      {
        name: "スクウィーク",
        reason: "",
        power: 2
      },
    ],

    tips: [
      "砂地での移動速度を意識",
      "広い地形を活かしたパス",
      "味方との距離を適切に保つ"
    ]
  },
  "トリプル・ドリブル": {
    id: "bb_triple_dribble",
    name: "トリプル・ドリブル",
    mode: "brawlBall",
    description: "3つの主要ルートがあるマップ。ルート選択と切り替えのタイミングが重要です。",
    characteristics: ["3ルート構成", "切り替え戦術", "ルート選択"],
    difficulty: "Hard",
    recommendedBrawlers: [
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
      power: 5
    },
    {
      name: "Max",
      reason: "水路越しの攻撃",
      power: 5
    },
    {
      name: "ダイナマイク",
      reason: "水路での移動が得意",
      power: 5
    },
    {
      name: "ウィロー",
      reason: "水路を挟んだ狙撃",
      power: 4
    },
    {
      name: "バスター",
      reason: "水路越しの攻撃",
      power: 4
    },
    {
      name: "ニタ",
      reason: "水路を挟んだ狙撃",
      power: 4
    },
    {
      name: "ダリル",
      reason: "水路越しの攻撃",
      power: 4
    },
    {
      name: "リコ",
      reason: "水路を挟んだ狙撃",
      power: 4
    },
    {
      name: "コーデリアス",
      reason: "水路越しの攻撃",
      power: 4
    },
    {
      name: "モーティス",
      reason: "水路を挟んだ狙撃",
      power: 4
    },
    {
      name: "ビビ",
      reason: "水路越しの攻撃",
      power: 3
    },
    {
      name: "フランケン",
      reason: "水路越しの攻撃",
      power: 3
    },
    {
      name: "ジャッキー",
      reason: "水路越しの攻撃",
      power: 3
    },
    {
      name: "オーティス",
      reason: "水路越しの攻撃",
      power: 3
    },
    ],
    tips: [      "常に複数のルートを意識",
      "チームでのルート分担",
      "切り替えのタイミング"
    ]
  },
  "静かな広場": {
    id: "bb_sneaky_fields",
    name: "静かな広場",
    mode: "brawlBall",
    description: "一見静かな広場での戦い。ブッシュを活用した駆け引きが重要です。",
    characteristics: ["ブッシュ戦術", "待ち伏せ", "展開速度"],
    difficulty: "Medium",
    recommendedBrawlers: [
      {
      name: "Max",
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
      name: "オーティス",
      reason: "水路での移動が得意",
      power: 4
    },
    {
      name: "バスター",
      reason: "水路を挟んだ狙撃",
      power: 4
    },
    {
      name: "リコ",
      reason: "水路越しの攻撃",
      power: 4
    },
    {
      name: "ジャッキー",
      reason: "水路での移動が得意",
      power: 4
    },
    {
      name: "ニタ",
      reason: "水路を挟んだ狙撃",
      power: 4
    },
    {
      name: "フランケン",
      reason: "水路越しの攻撃",
      power: 4
    },
    {
      name: "ビビ",
      reason: "水路を挟んだ狙撃",
      power: 4
    },
    {
      name: "ダリル",
      reason: "水路越しの攻撃",
      power: 4
    },
    {
      name: "ケンジ",
      reason: "水路を挟んだ狙撃",
      power: 4
    },
    {
      name: "ストゥー",
      reason: "水路越しの攻撃",
      power: 3
    },
    {
      name: "シェリー",
      reason: "水路越しの攻撃",
      power: 3
    },
    {
      name: "ラリー&ローリー",
      reason: "水路越しの攻撃",
      power: 3
    },
    {
      name: "ローサ",
      reason: "水路越しの攻撃",
      power: 3
    },
    {
      name: "バズ",
      reason: "水路越しの攻撃",
      power: 3
    },
    {
      name: "サンディ",
      reason: "水路越しの攻撃",
      power: 3
    },
    ],

    tips: [
      "ブッシュチェックを怠らない",
      "相手の視界を把握",
      "待ち伏せ位置の工夫"
    ]
  },
  "スーパービーチ": {
    id: "bb_super_beach",
    name: "スーパービーチ",
    mode: "brawlBall",
    description: "ビーチでの開放的な戦い。広い地形を活かした展開が求められます。",
    characteristics: ["開放地形", "スピード戦", "パスワーク"],
    difficulty: "Easy",
    recommendedBrawlers: [
      {
        name: "サンディ",
        reason: "",
        power: 5
      },
      {
        name: "ストゥー",
        reason: "",
        power: 5
      },
      {
        name: "カール",
        reason: "",
        power: 5
      },
      {
        name: "タラ",
        reason: "",
        power: 5
      },
      {
        name: "ジュジュ",
        reason: "",
        power: 5
      },
      {
        name: "ラリー&ローリー",
        reason: "",
        power: 5
      },
      {
        name: "バーリー",
        reason: "",
        power: 5
      },
      {
        name: "フランケン",
        reason: "",
        power: 4
      },
      {
        name: "ビビ",
        reason: "",
        power: 4
      },
      {
        name: "ニタ",
        reason: "",
        power: 4
      },
      {
        name: "ダイナマイク",
        reason: "",
        power: 4
      },
      {
        name: "コーデリアス",
        reason: "",
        power: 4
      },
      {
        name: "ケンジ",
        reason: "",
        power: 3
      },
      {
        name: "バイロン",
        reason: "",
        power: 3
      },
      {
        name: "オーティス",
        reason: "",
        power: 3
      },
    ],

    tips: [
      "広いスペースの活用",
      "スピーディーなパス回し",
      "チーム全体での連携"
    ]
  },
  "サニーサッカー": {
    id: "bb_sunny_soccer",
    name: "サニーサッカー",
    mode: "brawlBall",
    description: "明るい雰囲気の基本に忠実なサッカーマップ。基礎的な戦術の完成度が問われます。",
    characteristics: ["基本重視", "オーソドックス", "チーム戦"],
    difficulty: "Easy",
    recommendedBrawlers: [
      {
        name: "サンディ",
        reason: "",
        power: 5
      },
      {
        name: "ストゥー",
        reason: "",
        power: 5
      },
      {
        name: "カール",
        reason: "",
        power: 5
      },
      {
        name: "タラ",
        reason: "",
        power: 5
      },
      {
        name: "リコ",
        reason: "",
        power: 5
      },
      {
        name: "ダリル",
        reason: "",
        power: 5
      },
      {
        name: "ジュジュ",
        reason: "",
        power: 5
      },
      {
        name: "ラリー&ローリー",
        reason: "",
        power: 5
      },
      {
        name: "バーリー",
        reason: "",
        power: 5
      },
      {
        name: "フランケン",
        reason: "",
        power: 4
      },
      {
        name: "ビビ",
        reason: "",
        power: 4
      },
      {
        name: "メイジー",
        reason: "",
        power: 4
      },
      {
        name: "バスター",
        reason: "",
        power: 4
      },
      {
        name: "ダイナマイク",
        reason: "",
        power: 4
      },
      {
        name: "コーデリアス",
        reason: "",
        power: 4
      },
      {
        name: "ケンジ",
        reason: "",
        power: 3
      },
      {
        name: "バイロン",
        reason: "",
        power: 3
      },
      {
        name: "ドラコ",
        reason: "",
        power: 3
      },
      {
        name: "モーティス",
        reason: "",
        power: 3
      },
      {
        name: "ボウ",
        reason: "",
        power: 3
      },
    ],

    tips: [
      "基本的なパス回しの徹底",      
      "シンプルな攻防の意識",
      "チームワークの重視"
    ]
  },
  "トリッキー": {
    id: "bb_trickey",
    name: "トリッキー",
    mode: "brawlBall",
    description: "トリッキーな地形配置が特徴のマップ。予想外の展開とフェイントが効果的です。",
    characteristics: ["変則的地形", "フェイント重要", "技巧的"],
    difficulty: "Expert",
    recommendedBrawlers: [
      {
        name: "サンディ",
        reason: "",
        power: 5
      },
      {
        name: "ストゥー",
        reason: "",
        power: 5
      },
      {
        name: "ジュジュ",
        reason: "",
        power: 5
      },
      {
        name: "コーデリアス",
        reason: "",
        power: 5
      },
      {
        name: "MAX",
        reason: "",
        power: 5
      },
      {
        name: "フランケン",
        reason: "",
        power: 5
      },
      {
        name: "ビビ",
        reason: "",
        power: 5
      },
      {
        name: "モーティス",
        reason: "",
        power: 4
      },
      {
        name: "カール",
        reason: "",
        power: 4
      },
      {
        name: "ダリル",
        reason: "",
        power: 4
      },
      {
        name: "ニタ",
        reason: "",
        power: 4
      },
      {
        name: "Emz",
        reason: "",
        power: 4
      },
    ],

    tips: [
      "地形の特徴を最大限活用",
      "予想外の動きを心がける",
      "相手の死角を突く展開"
    ]
  },
  "ペナルティキック": {
    id: "bb_penalty_kick",
    name: "ペナルティキック",
    mode: "brawlBall",
    description: "ゴール前の攻防が重要なマップ。正確なシュートと堅実な守備が求められます。",
    characteristics: ["ゴール前重視", "シュート精度", "守備重要"],
    difficulty: "Hard",
    recommendedBrawlers: [
      {
        name: "コーデリアス",
        reason: "",
        power: 5
      },
      {
        name: "サンディ",
        reason: "",
        power: 5
      },
      {
        name: "ニタ",
        reason: "",
        power: 5
      },
      {
        name: "ストゥー",
        reason: "",
        power: 5
      },
      {
        name: "ビビ",
        reason: "",
        power: 5
      },
      {
        name: "サージ",
        reason: "",
        power: 5
      },
      {
        name: "フランケン",
        reason: "",
        power: 5
      },
      {
        name: "ラリー&ローリー",
        reason: "",
        power: 5
      },
      {
        name: "ジュジュ",
        reason: "",
        power: 5
      },
      {
        name: "バーリー",
        reason: "",
        power: 4
      },
      {
        name: "バスター",
        reason: "",
        power: 4
      },
      {
        name: "シェイド",
        reason: "",
        power: 4
      },
    ],

    tips: [
      "シュートの精度を重視",
      "ゴール前の守備を固める",
      "チームでのカバーを意識"
    ]
  }
};