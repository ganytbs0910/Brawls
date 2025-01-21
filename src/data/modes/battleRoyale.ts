import { MapDetail } from '../../types/type';

export const battleRoyaleMaps: Record<string, MapDetail> = {
    "酸性湖": {
    id: "br_acid_lakes",
    name: "酸性湖",
    mode: "battleRoyale",
    description: "危険な酸性湖に囲まれた戦場。安全な通路が限られており、移動経路の選択が重要です。",
    characteristics: ["危険地帯", "限られた通路", "戦略性"],
    difficulty: "Expert",
    recommendedBrawlers: [
      { name: "イヴ", reason: "", power: 5 },
      { name: "ジュジュ", reason: "", power: 5 },
      { name: "アンジェロ", reason: "", power: 5 },
      { name: "シェイド", reason: "", power: 5 }
    ],
    tips: [
      "酸性湖への接触を避ける",
      "経路確保を最優先",
      "敵の移動を制限する"
    ]
  },
  "天国と地獄": {
    id: "br_feast_or_famine",
    name: "天国と地獄",
    mode: "battleRoyale",
    description: "中央に豊富な報酬と高いリスクがある地帯があり、外周は比較的安全な地帯という特徴的なマップ。",
    characteristics: ["リスク vs リワード", "中央集中", "ブッシュ戦"],
    difficulty: "Expert",
    recommendedBrawlers: [
      { name: "ダグ", reason: "", power: 5 },
      { name: "シェリー", reason: "", power: 5 },
      { name: "バズ", reason: "", power: 5 },
      { name: "ブル", reason: "", power: 5 },
      { name: "サージ", reason: "", power: 5 },
      { name: "R-T", reason: "", power: 5 }
    ],
    tips: [
      "中央への進入は慎重に判断",
      "ブッシュ内の敵の存在を常に警戒",
      "パワーキューブの差を意識した戦闘選択"
    ]
  },
  "空飛ぶ絨毯": {
    id: "br_flying_fantasies",
    name: "空飛ぶ絨毯",
    mode: "battleRoyale",
    description: "空中の足場と地上の戦場が組み合わさった立体的なマップ。高低差を活かした立ち回りが重要です。",
    characteristics: ["立体構造", "空中経路", "見下ろし位置"],
    difficulty: "Hard",
    recommendedBrawlers: [
      { name: "アンジェロ", reason: "", power: 5 },
      { name: "ジュジュ", reason: "", power: 5 },
      { name: "イヴ", reason: "", power: 5 },
      { name: "ガス", reason: "", power: 5 },
      { name: "ストゥー", reason: "", power: 4 },
      { name: "パール", reason: "", power: 4 },
      { name: "R-T", reason: "", power: 4 }
    ],
    tips: [
      "落下ダメージに注意",
      "高所での過度な露出を避ける",
      "地上と空中の敵の位置を把握"
    ]
  },
  "囚われた島": {
    id: "br_island_invasion",
    name: "囚われた島",
    mode: "battleRoyale",
    description: "水に囲まれた島での激しい戦い。ブッシュが多く、近接戦が頻発するマップです。",
    characteristics: ["島地形", "ブッシュ密集", "近接戦重視"],
    difficulty: "Medium",
    recommendedBrawlers: [
      { name: "ボウ", reason: "", power: 5 },
      { name: "バズ", reason: "", power: 5 },
      { name: "シェリー", reason: "", power: 5 },
      { name: "ブル", reason: "", power: 5 },
      { name: "サージ", reason: "", power: 5 },
      { name: "ダリル", reason: "", power: 4 },
      { name: "ジャネット", reason: "", power: 3 }
    ],
    tips: [
      "ブッシュの確認を怠らない",
      "水際での戦いは避ける",
      "常に複数の退路を確保"
    ]
  },
  "狙撃手たちの楽園": {
    id: "br_marksmans_paradise",
    name: "狙撃手たちの楽園",
    mode: "battleRoyale",
    description: "開けた地形が特徴の長距離戦向きマップ。カバーを上手く使った立ち回りが必須です。",
    characteristics: ["開放地形", "長距離戦", "カバー重要"],
    difficulty: "Expert",
    recommendedBrawlers: [
      { name: "ガス", reason: "", power: 5 },
      { name: "アンジェロ", reason: "", power: 5 },
      { name: "パール", reason: "", power: 5 },
      { name: "R-T", reason: "", power: 5 },
      { name: "ストゥー", reason: "", power: 4 },
      { name: "メイジー", reason: "", power: 4 },
      { name: "エリザベス", reason: "", power: 4 }
    ],
    tips: [
      "不用意な移動を控える",
      "常にカバーを意識",
      "敵の狙撃位置を把握"
    ]
  },
  "岩壁の決戦": {
    id: "br_rockwall_brawl",
    name: "岩壁の決戦",
    mode: "battleRoyale",
    description: "開けた地形が特徴の長距離戦向きマップ。カバーを上手く使った立ち回りが必須です。",
    characteristics: ["開放地形", "長距離戦", "カバー重要"],
    difficulty: "Expert",
    recommendedBrawlers: [
      { name: "コーデリアス", reason: "", power: 5 },
      { name: "サージ", reason: "", power: 5 },
      { name: "リリー", reason: "", power: 5 },
      { name: "シェリー", reason: "", power: 5 },
      { name: "ダリル", reason: "", power: 5 },
      { name: "R-T", reason: "", power: 4 }
    ],
    tips: [
      "不用意な移動を控える",
      "常にカバーを意識",
      "敵の狙撃位置を把握"
    ]
  },
  "安全センター": {
    id: "br_safety_center",
    name: "安全センター",
    mode: "battleRoyale",
    description: "中央に大きな建物があり、周囲に様々な障害物が配置された戦略的なマップ。",
    characteristics: ["中央建物", "障害物多数", "戦略性高"],
    difficulty: "Medium",
    recommendedBrawlers: [
      { name: "サージ", reason: "", power: 5 },
      { name: "ストゥー", reason: "", power: 5 },
      { name: "コーデリアス", reason: "", power: 5 },
      { name: "パール", reason: "", power: 5 },
      { name: "メイジー", reason: "", power: 5 },
      { name: "R-T", reason: "", power: 5 }
    ],
    tips: [
      "建物内での足音に注意",
      "窓からの攻撃を警戒",
      "出入り口の把握が重要"
    ]
  },
  "ガイコツ川": {
    id: "br_skull_creek",
    name: "ガイコツ川",
    mode: "battleRoyale",
    description: "川を挟んだ地形での戦い。橋の確保と渡河のタイミングが勝敗を分けます。",
    characteristics: ["河川地形", "橋の重要性", "分断戦"],
    difficulty: "Hard",
    recommendedBrawlers: [
      { name: "サージ", reason: "", power: 5 },
      { name: "リリー", reason: "", power: 5 },
      { name: "キット", reason: "", power: 5 },
      { name: "シェイド", reason: "", power: 5 },
      { name: "ジャッキー", reason: "", power: 4 },
      { name: "コーデリアス", reason: "", power: 4 },
      { name: "エルプリモ", reason: "", power: 4 }
    ],
    tips: [
      "橋での戦いは慎重に",
      "水中での移動は危険",
      "渡河時の援護を意識"
    ]
  },
  "激動の洞窟": {
    id: "br_cavern_churn",
    name: "激動の洞窟",
    mode: "battleRoyale",
    description: "洞窟内の複雑な地形での戦い。ブッシュが多く、近接戦が頻発します。",
    characteristics: ["洞窟地形", "ブッシュ多数", "近接戦"],
    difficulty: "Hard",
    recommendedBrawlers: [
      { name: "シェリー", reason: "", power: 5 },
      { name: "バズ", reason: "", power: 5 },
      { name: "ブル", reason: "", power: 5 },
      { name: "エルプリモ", reason: "", power: 5 },
      { name: "ジャッキー", reason: "", power: 5 },
      { name: "リコ", reason: "", power: 5 },
      { name: "ボウ", reason: "", power: 5 },
      { name: "ウィロー", reason: "", power: 4 },
      { name: "タラ", reason: "", power: 3 }
    ],
    tips: [
      "常にブッシュチェック",
      "地形の死角に注意",
      "近接戦の準備を怠らない"
    ]
  },
  "暗い廊下": {
    id: "br_dark_passage",
    name: "暗い廊下",
    mode: "battleRoyale",
    description: "狭い通路と広場が混在する暗いマップ。視界の確保と敵の予測が重要です。",
    characteristics: ["狭路と広場", "視界制限", "予測重要"],
    difficulty: "Hard",
    recommendedBrawlers: [
      { name: "アンジェロ", reason: "", power: 5 },
      { name: "ガス", reason: "", power: 5 },
      { name: "パール", reason: "", power: 5 },
      { name: "ストゥー", reason: "", power: 5 },
      { name: "R-T", reason: "", power: 4 },
      { name: "メイジー", reason: "", power: 4 },
      { name: "エリザベス", reason: "", power: 4 }
    ],
    tips: [
      "常に視界の確保を意識",
      "通路での待ち伏せに注意",
      "音を頼りに敵を予測"
    ]
  },
  "ダブルトラブル": {
    id: "br_double_trouble",
    name: "ダブルトラブル",
    mode: "battleRoyale",
    description: "2つの主要エリアに分かれたマップ。エリア間の移動と制圧が重要です。",
    characteristics: ["二分割構造", "エリア制圧", "戦略性"],
    difficulty: "Medium",
    recommendedBrawlers: [
      { name: "ストゥー", reason: "", power: 5 },
      { name: "R-T", reason: "", power: 5 },
      { name: "パール", reason: "", power: 5 },
      { name: "キット", reason: "", power: 5 },
      { name: "メイジー", reason: "", power: 4 },
      { name: "サージ", reason: "", power: 4 }
    ],
    tips: [
      "エリア移動は慎重に",
      "壁の破壊状況を把握",
      "両エリアの敵を警戒"
    ]
  },
  "枯れた川": {
    id: "br_dried_up_river",
    name: "枯れた川",
    mode: "battleRoyale",
    description: "枯れた河床を中心とした地形。高低差を活かした戦いが重要です。",
    characteristics: ["河床地形", "高低差", "視線制御"],
    difficulty: "Medium",
    recommendedBrawlers: [
      { name: "シェイド", reason: "", power: 5 },
      { name: "ジュジュ", reason: "", power: 5 },
      { name: "ストゥー", reason: "", power: 5 },
      { name: "サージ", reason: "", power: 5 },
      { name: "キット", reason: "", power: 5 }
    ],
    tips: [
      "高低差での戦いを意識",
      "河床での露出に注意",
      "地形を活かした移動"
    ]
  }
};