import { MapDetail } from '../../types/type';

export const duelMaps: Record<string, MapDetail> = {
    "暴徒のオアシス": {
    id: "du_slayers_paradise",
    name: "暴徒のオアシス",
    mode: "duel",
    description: "オアシスを中心とした1vs1マップ。カバーを活用した駆け引きが重要です。",
    characteristics: ["1vs1戦", "カバー戦術", "リソース管理"],
    difficulty: "Hard",
    recommendedBrawlers: [
      {
        name: "レオン",
        reason: "不可視を活かした戦い",
        power: 5
      },
      {
        name: "クロウ",
        reason: "毒ダメージの蓄積",
        power: 4
      },
      {
        name: "スパイク",
        reason: "カバー周りでの強さ",
        power: 4
      }
    ],
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "有利なカバーの確保",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "リソースの効率的な使用",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "体力管理での勝利",
        phase: "Late"
      }
    ],
    tips: [
      "カバーの有効活用",
      "スーパースキルの温存",
      "相手の行動予測"
    ]
  },
  "流れ星": {
    id: "du_shooting_star",
    name: "流れ星",
    mode: "duel",
    description: "開けた地形での1vs1デュエル。長距離戦と近接戦のバランスが重要です。",
    characteristics: ["開放地形", "距離管理", "読み合い"],
    difficulty: "Medium",
    recommendedBrawlers: [
      {
        name: "パイパー",
        reason: "長距離からの圧力が強力",
        power: 5
      },
      {
        name: "モーティス",
        reason: "接近戦での優位性",
        power: 4
      },
      {
        name: "ベル",
        reason: "持続的な圧力をかけられる",
        power: 4
      }
    ],
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "相手のブロウラーに応じた距離取り",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "体力とスーパースキルの管理",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "有利な状況での詰め",
        phase: "Late"
      }
    ],
    tips: [
      "適切な距離を保つ",
      "カバーの効率的な活用",
      "スーパースキルの使用タイミング"
    ]
  },
  "禅の庭園": {
    id: "du_zen_garden",
    name: "禅の庭園",
    mode: "duel",
    description: "障害物が配置された静かな庭園での1vs1。地形を活かした立ち回りが鍵となります。",
    characteristics: ["障害物活用", "地形戦", "心理戦"],
    difficulty: "Hard",
    recommendedBrawlers: [
      {
        name: "スパイク",
        reason: "障害物を活かした攻撃",
        power: 5
      },
      {
        name: "タラ",
        reason: "広範囲攻撃での制圧",
        power: 4
      },
      {
        name: "リコ",
        reason: "壁跳ね攻撃の活用",
        power: 4
      }
    ],
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "有利な地形ポジションの確保",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "障害物を活用した攻防",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "地形有利を活かした決着",
        phase: "Late"
      }
    ],
    tips: [
      "障害物の配置を把握",
      "相手の動きを予測",
      "回復の機会を作る"
    ]
  },
  "果てしなき不運": {
    id: "du_infinite_doom",
    name: "果てしなき不運",
    mode: "duel",
    description: "不運な要素が散りばめられた1vs1マップ。状況判断と適応力が試されます。",
    characteristics: ["ランダム要素", "適応力", "リスク管理"],
    difficulty: "Expert",
    recommendedBrawlers: [
      {
        name: "クロウ",
        reason: "状況に応じた立ち回り",
        power: 5
      },
      {
        name: "レオン",
        reason: "不意打ちの機会活用",
        power: 4
      },
      {
        name: "コルト",
        reason: "状況改善能力が高い",
        power: 4
      }
    ],
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "状況把握と初期判断",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "変化する状況への対応",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "リスクを考慮した決着",
        phase: "Late"
      }
    ],
    tips: [
      "状況変化に柔軟に対応",
      "リスクの見極めが重要",
      "予備の戦略を持つ"
    ]
  },
  "隠れ家": {
    id: "du_hideout",
    name: "隠れ家",
    mode: "duel",
    description: "隠れ場所が多いデュエルマップ。視界管理と待ち伏せの駆け引きが重要です。",
    characteristics: ["隠れ場所多数", "視界管理", "駆け引き"],
    difficulty: "Hard",
    recommendedBrawlers: [
      {
        name: "シェリー",
        reason: "待ち伏せからの攻撃",
        power: 5
      },
      {
        name: "ボウ",
        reason: "視界確保能力",
        power: 4
      },
      {
        name: "バル",
        reason: "近接戦での強さ",
        power: 4
      }
    ],
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "有利な隠れ場所の確保",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "視界の管理と移動",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "待ち伏せの成功",
        phase: "Late"
      }
    ],
    tips: [
      "常に周囲の確認を怠らない",
      "移動時は警戒を怠らない",
      "相手の位置予測を心がける"
    ]
  },
  "不屈の精神": {
    id: "du_no_surrender",
    name: "不屈の精神",
    mode: "duel",
    description: "諦めない精神が試される1vs1マップ。長期戦に備えた立ち回りが重要です。",
    characteristics: ["持久戦", "リソース管理", "メンタル重要"],
    difficulty: "Expert",
    recommendedBrawlers: [
      {
        name: "パム",
        reason: "高い耐久力と回復力",
        power: 5
      },
      {
        name: "クロウ",
        reason: "持続的なプレッシャー",
        power: 4
      },
      {
        name: "バイロン",
        reason: "自己回復と攻撃力",
        power: 4
      }
    ],
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "リソースの効率的な使用",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "体力とスキルの管理",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "残存リソースでの決着",
        phase: "Late"
      }
    ],
    tips: [
      "無理な消耗を避ける",
      "回復機会を逃さない",
      "相手の消耗を誘う"
    ]
  },
  "常勝街道": {
    id: "du_warriors_way",
    name: "常勝街道",
    mode: "duel",
    description: "勝者への道が続く1vs1マップ。攻防の切り替えが勝敗を分けます。",
    characteristics: ["攻防一体", "切り替え速度", "判断力"],
    difficulty: "Hard",
    recommendedBrawlers: [
      {
        name: "モーティス",
        reason: "素早い攻防の切り替え",
        power: 5
      },
      {
        name: "ベル",
        reason: "長距離からの制圧",
        power: 4
      },
      {
        name: "エドガー",
        reason: "機動力を活かした戦い",
        power: 4
      }
    ],
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "相手の戦術を見極める",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "攻めと守りの切り替え",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "優位な状況での押し切り",
        phase: "Late"
      }
    ],
    tips: [
      "素早い判断と実行",
      "攻防の切り替えを意識",
      "相手の動きを予測"
    ]
  },
  "猿の迷路": {
    id: "du_monkey_maze",
    name: "猿の迷路",
    mode: "duel",
    description: "迷路のような複雑な地形での1vs1。正確な位置把握と予測が必要です。",
    characteristics: ["迷路構造", "予測重要", "視界制限"],
    difficulty: "Expert",
    recommendedBrawlers: [
      {
        name: "ボウ",
        reason: "視界確保能力",
        power: 5
      },
      {
        name: "リコ",
        reason: "壁跳ね攻撃",
        power: 4
      },
      {
        name: "モーティス",
        reason: "素早い移動能力",
        power: 4
      }
    ],
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "迷路構造の把握と初期展開",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "相手の位置予測と待ち伏せ",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "迷路を活かした包囲",
        phase: "Late"
      }
    ],
    tips: [
      "常に迷路の構造を意識",
      "相手の動きを予測",
      "視界確保を怠らない"
    ]
  },
  "スパイスプロダクション": {
    id: "du_spice_production",
    name: "スパイスプロダクション",
    mode: "duel",
    description: "工場をモチーフにした1vs1マップ。機械的な地形を活用した戦術が重要です。",
    characteristics: ["工場地形", "精密な動き", "機械的構造"],
    difficulty: "Hard",
    recommendedBrawlers: [
      {
        name: "リコ",
        reason: "機械的構造を活かした攻撃",
        power: 5
      },
      {
        name: "コルト",
        reason: "壁破壊での状況改善",
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
        description: "地形の特性を活かしたポジション取り",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "機械的構造を利用した展開",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "地形advantage（優位性）の最大活用",
        phase: "Late"
      }
    ],
    tips: [
      "工場構造の把握が重要",
      "機械的な動きの予測",
      "壁の破壊状況を意識"
    ]
  },
  "ジグザグ草原": {
    id: "du_snake_prairie",
    name: "ジグザグ草原",
    mode: "duel",
    description: "蛇行する地形が特徴の1vs1マップ。曲がりくねった経路での立ち回りが鍵となります。",
    characteristics: ["蛇行地形", "視界制限", "予測重要"],
    difficulty: "Expert",
    recommendedBrawlers: [
      {
        name: "ボウ",
        reason: "視界確保が重要",
        power: 5
      },
      {
        name: "シェリー",
        reason: "近接戦での強さ",
        power: 4
      },
      {
        name: "ローサ",
        reason: "草むらでの戦闘力",
        power: 4
      }
    ],
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "視界の確保と経路選択",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "地形を活かした待ち伏せ",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "蛇行地形での有利な打点確保",
        phase: "Late"
      }
    ],
    tips: [
      "曲がり角での警戒",
      "視界の確保を意識",
      "相手の移動予測"
    ]
  },
  "大いなる入口": {
    id: "du_great_open",
    name: "大いなる入口",
    mode: "duel",
    description: "広大な入り口から始まる1vs1マップ。開放感のある地形での戦術が求められます。",
    characteristics: ["開放地形", "距離管理", "エリア支配"],
    difficulty: "Medium",
    recommendedBrawlers: [
      {
        name: "パイパー",
        reason: "広い地形での狙撃",
        power: 5
      },
      {
        name: "ベル",
        reason: "広範囲での制圧",
        power: 4
      },
      {
        name: "エメル",
        reason: "遠距離からの攻撃",
        power: 4
      }
    ],
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "有利な射線の確保",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "広い地形での距離管理",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "開放地形での決定打",
        phase: "Late"
      }
    ],
    tips: [
      "適切な距離を保つ",
      "カバーの効率的な活用",
      "相手の動きを予測"
    ]
  },
  "グランドカナル": {
    id: "du_canal_grande",
    name: "グランドカナル",
    mode: "duel",
    description: "運河を中心とした1vs1マップ。水路の活用と渡河のタイミングが重要です。",
    characteristics: ["水路地形", "渡河戦術", "地形活用"],
    difficulty: "Hard",
    recommendedBrawlers: [
      {
        name: "ダリル",
        reason: "水路での移動が得意",
        power: 5
      },
      {
        name: "パイパー",
        reason: "水路を挟んだ狙撃",
        power: 4
      },
      {
        name: "グロム",
        reason: "水路越しの攻撃",
        power: 4
      }
    ],
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "渡河ポイントの確認",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "水路を活用した立ち回り",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "地形advantage（優位性）の確立",
        phase: "Late"
      }
    ],
    tips: [
      "水路での移動に注意",
      "渡河タイミングの見極め",
      "水路を挟んだ射線取り"
    ]
  },
};