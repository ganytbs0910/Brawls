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
};