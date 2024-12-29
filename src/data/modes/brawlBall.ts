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
        name: "エル・プリモ",
        reason: "ボール運びと突破力",
        power: 5
      },
      {
        name: "シェリー",
        reason: "防衛と攻撃のバランス",
        power: 4
      },
      {
        name: "ポコ",
        reason: "味方のサポートと回復",
        power: 4
      }
    ],
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "基本的な陣形での展開",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "チャンスを見極めた攻撃",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "基本に忠実な攻防",
        phase: "Late"
      }
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
        name: "エメル",
        reason: "ゴール前での守備力",
        power: 5
      },
      {
        name: "バイロン",
        reason: "チームサポートと回復",
        power: 4
      },
      {
        name: "ブル",
        reason: "突破力とゴール前防衛",
        power: 4
      }
    ],
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "守備態勢の構築",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "チャンスを見極めた攻撃",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "確実な守りからの反撃",
        phase: "Late"
      }
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
        name: "リコ",
        reason: "壁反射を活かした攻撃",
        power: 5
      },
      {
        name: "コルト",
        reason: "壁破壊での状況改善",
        power: 4
      },
      {
        name: "グロム",
        reason: "壁越し攻撃が有効",
        power: 4
      }
    ],
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "壁の配置を活かしたポジション取り",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "壁反射を使った攻撃展開",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "地形を活かした最後の攻め",
        phase: "Late"
      }
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
        name: "エメル",
        reason: "正確なシュート能力",
        power: 5
      },
      {
        name: "ブル",
        reason: "ゴール前での守備",
        power: 4
      },
      {
        name: "グロム",
        reason: "通路での牽制",
        power: 4
      }
    ],
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "堅実な守備体制の構築",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "正確なパス回しでの攻め",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "精密なシュートの成功",
        phase: "Late"
      }
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
        name: "パム",
        reason: "中央での耐久力",
        power: 5
      },
      {
        name: "タラ",
        reason: "広場での制圧力",
        power: 4
      },
      {
        name: "スパイク",
        reason: "エリア管理能力",
        power: 4
      }
    ],
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "中央エリアの確保",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "中央からの展開",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "中央を活かした決定機",
        phase: "Late"
      }
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
        name: "ローサ",
        reason: "砂地での機動力と耐久力",
        power: 5
      },
      {
        name: "モーティス",
        reason: "高速な展開が可能",
        power: 4
      },
      {
        name: "ポコ",
        reason: "広範囲サポート",
        power: 4
      }
    ],
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "砂地でのポジション確保",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "広い地形を活かした展開",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "機動力を活かした決定打",
        phase: "Late"
      }
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
        name: "コルト",
        reason: "壁破壊でルート開拓",
        power: 5
      },
      {
        name: "ジーン",
        reason: "ルート間の敵引き寄せ",
        power: 4
      },
      {
        name: "エメル",
        reason: "複数ルートでの制圧",
        power: 4
      }
    ],
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "メインルートの選択と確保",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "ルート間の素早い切り替え",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "最適ルートでの突破",
        phase: "Late"
      }
    ],
    tips: [
      "常に複数のルートを意識",
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
        name: "ブル",
        reason: "ブッシュでの強さ",
        power: 5
      },
      {
        name: "ボウ",
        reason: "視界確保能力",
        power: 4
      },
      {
        name: "シェリー",
        reason: "近接戦での強さ",
        power: 4
      }
    ],
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "ブッシュの確保と視界管理",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "ブッシュを活用した展開",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "待ち伏せからの決定機",
        phase: "Late"
      }
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
        name: "モーティス",
        reason: "高速な展開が可能",
        power: 5
      },
      {
        name: "エメル",
        reason: "広範囲での制圧",
        power: 4
      },
      {
        name: "ポコ",
        reason: "チームサポート",
        power: 4
      }
    ],
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "広い地形での陣形構築",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "スペースを活用した展開",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "スピーディーな攻め",
        phase: "Late"
      }
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
        name: "エル・プリモ",
        reason: "基本的な突破力",
        power: 5
      },
      {
        name: "ポコ",
        reason: "チームサポート",
        power: 4
      },
      {
        name: "エメル",
        reason: "安定した攻撃力",
        power: 4
      }
    ],
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "基本的な陣形構築",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "オーソドックスな攻防",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "基本に忠実な決定打",
        phase: "Late"
      }
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
        name: "モーティス",
        reason: "予想外の動きが可能",
        power: 5
      },
      {
        name: "リコ",
        reason: "壁を活用した攻撃",
        power: 4
      },
      {
        name: "グロム",
        reason: "地形を活かした牽制",
        power: 4
      }
    ],
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "地形の特徴を活かしたポジション取り",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "フェイントを交えた展開",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "意表を突く最後の一手",
        phase: "Late"
      }
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
        name: "エメル",
        reason: "正確なシュート能力",
        power: 5
      },
      {
        name: "ブル",
        reason: "ゴール前での守備力",
        power: 4
      },
      {
        name: "バイロン",
        reason: "チームサポートと回復",
        power: 4
      }
    ],
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "有利なシュートポジションの確保",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "ゴール前での駆け引き",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "決定的なシュートチャンスの創出",
        phase: "Late"
      }
    ],
    tips: [
      "シュートの精度を重視",
      "ゴール前の守備を固める",
      "チームでのカバーを意識"
    ]
  }
};