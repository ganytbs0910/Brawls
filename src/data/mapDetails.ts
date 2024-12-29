import { MapDetail, GameMode } from '../types';

export const mapDetails: Record<string, MapDetail> = {
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
  "天国と地獄": {
    id: "br_feast_or_famine",
    name: "天国と地獄",
    mode: "battleRoyale",
    description: "中央に豊富な報酬と高いリスクがある地帯があり、外周は比較的安全な地帯という特徴的なマップ。",
    characteristics: ["リスク vs リワード", "中央集中", "ブッシュ戦"],
    difficulty: "Expert",
    recommendedBrawlers: [
      {
        name: "シェリー",
        reason: "ブッシュでの近接戦に強い",
        power: 5
      },
      {
        name: "ブル",
        reason: "突進能力で中央への素早いアクセス",
        power: 4
      },
      {
        name: "ボウ",
        reason: "ブッシュチェック能力が有用",
        power: 5
      }
    ],
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "中央に向かうか外周で立ち回るかの判断",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "パワーキューブの差を考慮した戦闘判断",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "有利な位置取りと毒ガスの動きの予測",
        phase: "Late"
      }
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
      {
        name: "クロウ",
        reason: "高所からの攻撃と機動力が活きる",
        power: 5
      },
      {
        name: "パイパー",
        reason: "高所からの狙撃が有効",
        power: 4
      },
      {
        name: "エドガー",
        reason: "ジャンプ能力で空中戦が可能",
        power: 4
      }
    ],
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "有利な高台の確保と初期装備の収集",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "高低差を活用した攻防の展開",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "最後の安全地帯での高所確保",
        phase: "Late"
      }
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
      {
        name: "ブル",
        reason: "ブッシュでの待ち伏せに強い",
        power: 5
      },
      {
        name: "ローサ",
        reason: "近接戦での強さを活かせる",
        power: 4
      },
      {
        name: "ボウ",
        reason: "ブッシュチェックが重要",
        power: 4
      }
    ],
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "安全なブッシュの確保と周囲の警戒",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "ブッシュを活用した待ち伏せと移動",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "狭まる範囲での位置取りと接近戦",
        phase: "Late"
      }
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
      {
        name: "パイパー",
        reason: "広い視界での狙撃が得意",
        power: 5
      },
      {
        name: "ブロック",
        reason: "カバーを作って前進可能",
        power: 4
      },
      {
        name: "ベル",
        reason: "長距離からの牽制が有効",
        power: 4
      }
    ],
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "安全な射撃位置の確保",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "カバー間の移動と狙撃の機会",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "有利な射線の確保と維持",
        phase: "Late"
      }
    ],
    tips: [
      "不用意な移動を控える",
      "常にカバーを意識",
      "敵の狙撃位置を把握"
    ]
  },
  "岩壁の決戦": {
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "有利な岩場の確保と装備収集",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "壁の破壊による戦況の変化に対応",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "残存する壁を活用した戦い",
        phase: "Late"
      }
    ],
    tips: [
      "壁の破壊状況を把握する",
      "岩場での待ち伏せに注意",
      "地形変化に柔軟に対応"
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
      {
        name: "ナイタ",
        reason: "建物内での戦闘に強い",
        power: 5
      },
      {
        name: "スパイク",
        reason: "狭い通路での制圧力が高い",
        power: 4
      },
      {
        name: "ジーン",
        reason: "敵を引き寄せる能力が有効",
        power: 4
      }
    ],
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "中央建物か外周かの位置選択",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "建物を利用した攻防の展開",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "建物内外の有利なポジション確保",
        phase: "Late"
      }
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
      {
        name: "ダリル",
        reason: "川を横断する能力が優秀",
        power: 5
      },
      {
        name: "パイパー",
        reason: "川を挟んでの狙撃が有効",
        power: 4
      },
      {
        name: "プリモ",
        reason: "ジャンプで川を渡れる",
        power: 4
      }
    ],
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "川の片側での装備収集",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "橋の制圧と渡河タイミング",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "川を挟んだ有利な打点の確保",
        phase: "Late"
      }
    ],
    tips: [
      "橋での戦いは慎重に",
      "水中での移動は危険",
      "渡河時の援護を意識"
    ]
  },
  "酸性湖": {
    id: "br_acid_lakes",
    name: "酸性湖",
    mode: "battleRoyale",
    description: "危険な酸性湖に囲まれた戦場。安全な通路が限られており、移動経路の選択が重要です。",
    characteristics: ["危険地帯", "限られた通路", "戦略性"],
    difficulty: "Expert",
    recommendedBrawlers: [
      {
        name: "グロム",
        reason: "遠距離から安全に攻撃可能",
        power: 5
      },
      {
        name: "スプラウト",
        reason: "壁を作って経路を制限",
        power: 4
      },
      {
        name: "コルト",
        reason: "新しい経路を作れる",
        power: 4
      }
    ],
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "安全な初期位置の確保",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "移動経路の確保と制御",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "安全地帯での有利な打点確保",
        phase: "Late"
      }
    ],
    tips: [
      "酸性湖への接触を避ける",
      "経路確保を最優先",
      "敵の移動を制限する"
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
      {
        name: "シェリー",
        reason: "ブッシュでの強さを活かせる",
        power: 5
      },
      {
        name: "ボウ",
        reason: "ブッシュチェックが有効",
        power: 4
      },
      {
        name: "タラ",
        reason: "広範囲攻撃で牽制可能",
        power: 4
      }
    ],
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "安全なブッシュの確保",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "地形を利用した待ち伏せ",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "有利な位置での近接戦",
        phase: "Late"
      }
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
      {
        name: "ボウ",
        reason: "視界確保能力が重要",
        power: 5
      },
      {
        name: "エドガー",
        reason: "狭い通路での戦いに強い",
        power: 4
      },
      {
        name: "ダイナマイク",
        reason: "通路封鎖が効果的",
        power: 4
      }
    ],
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "安全な通路の確保",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "視界の確保と移動",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "広場での有利な打点確保",
        phase: "Late"
      }
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
      {
        name: "コルト",
        reason: "壁破壊で新経路作成可能",
        power: 5
      },
      {
        name: "リコ",
        reason: "壁跳ね攻撃が有効",
        power: 4
      },
      {
        name: "パム",
        reason: "エリア制圧力が高い",
        power: 4
      }
    ],
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "有利なエリアの選択と確保",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "エリア間の移動タイミング",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "最後の安全地帯での陣取り",
        phase: "Late"
      }
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
      {
        name: "ブロック",
        reason: "地形を活かした戦いが得意",
        power: 5
      },
      {
        name: "バイロン",
        reason: "高所からの攻撃が有効",
        power: 4
      },
      {
        name: "エドガー",
        reason: "高低差を活かした接近が可能",
        power: 4
      }
    ],
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "高所か低所かの位置選択",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "地形を活かした攻防",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "有利な高低差の確保",
        phase: "Late"
      }
    ],
    tips: [
      "高低差での戦いを意識",
      "河床での露出に注意",
      "地形を活かした移動"
    ]
  },
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
  "安全地帯": {
    id: "he_safe_zone",
    name: "安全地帯",
    mode: "heist",
    description: "金庫を中心とした防衛戦。多くのカバーを活用した攻防が特徴です。",
    characteristics: ["金庫中心", "カバー豊富", "攻防一体"],
    difficulty: "Medium",
    recommendedBrawlers: [
      {
        name: "ダリル",
        reason: "金庫への突進が得意",
        power: 5
      },
      {
        name: "コルト",
        reason: "壁破壊での突破",
        power: 4
      },
      {
        name: "ペニー",
        reason: "砲台での守備が強力",
        power: 4
      }
    ],
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "攻撃ルートの確立",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "カバーを活用した前進",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "一気の総攻撃か守り切りか",
        phase: "Late"
      }
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
        name: "ブル",
        reason: "通路での突進力",
        power: 5
      },
      {
        name: "リコ",
        reason: "壁跳ね攻撃が有効",
        power: 4
      },
      {
        name: "バル",
        reason: "通路での制圧力",
        power: 4
      }
    ],
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "メインルートの選択",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "ルート間の切り替え",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "一点突破か分散か判断",
        phase: "Late"
      }
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
        name: "スパイク",
        reason: "多方向からの攻撃が可能",
        power: 5
      },
      {
        name: "ダイナマイク",
        reason: "壁越しの攻撃が得意",
        power: 4
      },
      {
        name: "ブロック",
        reason: "防衛壁の設置が有効",
        power: 4
      }
    ],
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "攻撃角度の確保と防衛位置の決定",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "攻撃位置の変更で守備を崩す",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "一斉攻撃での守備崩壊",
        phase: "Late"
      }
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
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "横断ポイントの確保",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "水路を活用した攻防",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "一斉横断での最終攻撃",
        phase: "Late"
      }
    ],
    tips: [
      "水中での移動は最小限に",
      "横断時の援護を重視",
      "長距離戦での体力管理"
    ]
  },
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
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "陣形の構築とボール確保",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "壁を活用した攻撃展開",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "数的優位を活かした決定打",
        phase: "Late"
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
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "チーム全体での陣形構築",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "広場と通路の使い分け",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "陣形を崩さない攻め",
        phase: "Late"
      }
    ],
    tips: [
      "5人の位置取りを意識",
      "ボール持ちの援護を重視",
      "相手の陣形変化に対応"
    ]
  },
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
  "ツルツルロード": {
    id: "bb5_slippery_road",
    name: "ツルツルロード",
    mode: "brawlBall5v5",
    description: "滑りやすい路面が特徴の5vs5マップ。ボール保持と移動の慎重さが求められます。",
    characteristics: ["特殊地形", "チーム戦", "慎重プレー"],
    difficulty: "Hard",
    recommendedBrawlers: [
      {
        name: "シェリー",
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
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "慎重な陣形構築",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "地形特性を考慮した展開",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "確実なボール運びでの決着",
        phase: "Late"
      }
    ],
    tips: [
      "急な動きを避ける",
      "味方との間隔を保つ",
      "地形特性を理解する"
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
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "攻撃ルートの選択",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "複数ルートでの連携攻撃",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "最適ルートでの総攻撃",
        phase: "Late"
      }
    ],
    tips: [
      "ルートの使い分けを意識",
      "チームでの連携を重視",
      "守備位置の柔軟な変更"
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
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "地形を活かしたポジション取り",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "形状を利用した連携プレー",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "地形を活用した最終攻撃",
        phase: "Late"
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
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "中央通路の確保判断",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "通路と横の使い分け",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "陣形を活かした突破",
        phase: "Late"
      }
    ],
    tips: [
      "通路での接近戦に注意",
      "横からの展開を意識",
      "チームの連携を重視"
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
  "フロスティトラック": {
    id: "bb5_frosty_tracks",
    name: "フロスティトラック",
    mode: "brawlBall5v5",
    description: "氷のような滑らかな地形での5vs5戦。慎重な動きと正確な判断が必要です。",
    characteristics: ["滑走地形", "精密操作", "5人連携"],
    difficulty: "Expert",
    recommendedBrawlers: [
      {
        name: "スパイク",
        reason: "地形制御能力",
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
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "慎重な陣形構築",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "地形特性を活かした展開",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "正確な動きでの決着",
        phase: "Late"
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
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "地形の理解と初期配置",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "波紋状の地形を活用",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "地形特性を活かした決定打",
        phase: "Late"
      }
    ],
    tips: [
      "波紋状の地形を把握",
      "5人での連携を重視",
      "地形の利点を最大化"
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
        name: "スパイク",
        reason: "高い金庫攻撃力",
        power: 5
      },
      {
        name: "ダリル",
        reason: "素早い攻守の切り替え",
        power: 4
      },
      {
        name: "ペニー",
        reason: "砲台での守備力",
        power: 4
      }
    ],
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "初期の攻守判断",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "攻守の素早い切り替え",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "状況判断での一点集中",
        phase: "Late"
      }
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
        name: "バル",
        reason: "中央での制圧力",
        power: 5
      },
      {
        name: "エメル",
        reason: "広範囲での牽制",
        power: 4
      },
      {
        name: "グロム",
        reason: "壁越しの攻撃",
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
        description: "中央からの展開判断",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "陣地の優位を活かした決着",
        phase: "Late"
      }
    ],
    tips: [
      "中央の支配権を意識",
      "無理な突っ込みを避ける",
      "チームの体力管理"
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
  "どんぱち谷": {
    id: "he_kaboom_canyon",
    name: "どんぱち谷",
    mode: "heist",
    description: "爆発的な戦いが繰り広げられる渓谷マップ。壁の破壊が戦況を大きく変えます。",
    characteristics: ["壁破壊重要", "地形変化", "ダイナミック"],
    difficulty: "Hard",
    recommendedBrawlers: [
      {
        name: "コルト",
        reason: "壁破壊での地形操作",
        power: 5
      },
      {
        name: "ダイナマイク",
        reason: "壁越しの攻撃",
        power: 4
      },
      {
        name: "ブロック",
        reason: "新しい壁の設置",
        power: 4
      }
    ],
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "重要な壁の破壊判断",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "変化する地形での立ち回り",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "地形を活かした最終攻撃",
        phase: "Late"
      }
    ],
    tips: [
      "壁破壊の優先順位",
      "変化する地形への適応",
      "チームでの破壊範囲分担"
    ]
  },
  "トリッキー": {
    id: "bb_trickey",
    name: "トリッキー",
    mode: "brawlBall",
    description: "トリッキーな仕掛けが散りばめられたマップ。予測不能な展開に対応する必要があります。",
    characteristics: ["複雑な地形", "予測困難", "適応力"],
    difficulty: "Expert",
    recommendedBrawlers: [
      {
        name: "コルト",
        reason: "壁破壊での状況改善",
        power: 5
      },
      {
        name: "ジーン",
        reason: "不意の引き込み",
        power: 4
      },
      {
        name: "スパイク",
        reason: "地形を活かした制圧",
        power: 4
      }
    ],
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "マップ特性の把握と初期展開",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "状況変化への柔軟な対応",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "予測不能な動きでの決定打",
        phase: "Late"
      }
    ],
    tips: [
      "常に複数の選択肢を持つ",
      "チームでの情報共有",
      "臨機応変な対応を心がける"
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
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "地形を活かしたポジション取り",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "距離帯の使い分け",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "チーム戦力の集中",
        phase: "Late"
      }
    ],
    tips: [
      "距離帯の使い分けを意識",
      "建物の利用を工夫",
      "チームの連携を重視"
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
    tactics: [
      {
        title: "序盤の立ち回り",
        description: "ルート分担と初期展開",
        phase: "Early"
      },
      {
        title: "中盤の戦略",
        description: "合流タイミングの判断",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "チーム全体での総攻撃",
        phase: "Late"
      }
    ],
    tips: [
      "合流ポイントの把握",
      "5人での連携を重視",
      "ルートの切り替えを柔軟に"
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
  "オープンビジネス": {
    id: "he_open_business",
    name: "オープンビジネス",
    mode: "heist",
    description: "開放的な地形での金庫戦。様々な角度からの攻撃と防御が可能です。",
    characteristics: ["開放地形", "多角的戦術", "視界確保"],
    difficulty: "Medium",
    recommendedBrawlers: [
      {
        name: "パイパー",
        reason: "長距離からの攻撃",
        power: 5
      },
      {
        name: "ペニー",
        reason: "広範囲での制圧",
        power: 4
      },
      {
        name: "スパイク",
        reason: "金庫への高火力",
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
        description: "多角的な攻撃展開",
        phase: "Mid"
      },
      {
        title: "終盤での勝ち方",
        description: "集中攻撃での押し切り",
        phase: "Late"
      }
    ],
    tips: [
      "視界の確保を重視",
      "攻撃角度の変更を工夫",
      "チームでの連携攻撃"
    ]
  },
}

// マップ情報を取得するユーティリティ関数
export const getMapDetails = (mapName: string): MapDetail | undefined => {
  return mapDetails[mapName];
};

export const getMapsByMode = (mode: GameMode): string[] => {
  return Object.entries(mapDetails)
    .filter(([_, detail]) => detail.mode === mode)
    .map(([mapName]) => mapName);
};

export const getMapsByDifficulty = (difficulty: MapDetail['difficulty']): string[] => {
  return Object.entries(mapDetails)
    .filter(([_, detail]) => detail.difficulty === difficulty)
    .map(([mapName]) => mapName);
};

export const getRecommendedMapsForBrawler = (brawlerName: string): string[] => {
  return Object.entries(mapDetails)
    .filter(([_, detail]) => 
      detail.recommendedBrawlers.some(b => 
        b.name === brawlerName && (b.power || 0) >= 4
      )
    )
    .map(([mapName]) => mapName);
};