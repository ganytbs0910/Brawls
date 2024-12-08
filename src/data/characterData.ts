// src/data/characterData.ts
import { CharacterData, CharacterRole, RankingItem } from '../types/types';

export const characterTypes: { [key: string]: string[] } = {
  all: [
    "シェイド", "ストゥー", "ガス", "モー", "ケンジ", "サージ", "バイロン", "ダリル", 
    "フランケン", "リコ", "ラリー&ローリー", "ジュジュ", "ペニー", "クランシー", "MAX",
    "サンディ", "キット", "ニタ", "メロディー", "バスター", "エリザベス", "マンディ",
    "アンジェロ", "R-T", "オーティス", "ラフス", "クロウ", "モーティス", "ベル", "ジーン",
    "ローラ", "コレット", "ドラコ", "グレイ", "カール", "チェスター", "ビー", "アンバー",
    "パール", "リリー", "ゲイル", "イヴ", "バーリー", "ティック", "ダイナマイク", "コーデリアス",
    "タラ", "8ビット", "コルト", "スクウィーク", "グリフ", "メイジー", "ナーニ", "ジェシー",
    "バズ", "Emz", "メグ", "エルプリモ", "ビビ", "ローサ", "チャック", "パム",
    "ジャッキー", "ウィロー", "スプラウト", "ベリー", "チャーリー", "レオン", "スパイク",
    "ルー", "ポコ", "シェリー", "ジャネット", "ブロック", "ボニー", "ボウ", "サム",
    "ファング", "Mr.P", "エドガー", "ハンク", "ブル", "アッシュ", "グロム", "ダグ", "ミコ"
  ],
  tank: [
    "ダリル", "フランケン", "バスター", "ドラコ", "ビビ", 
    "エルプリモ", "ローサ", "ジャッキー", "ブル", "アッシュ", 
    "サム", "ハンク", "バズ", "ダグ", "メグ"
  ],
  thrower: [
    "ラリー&ローリー", "ジュジュ", "バーリー", "ティック", 
    "ダイナマイク", "スプラウト", "ウィロー", "グロム"
  ],
  assassin: [
    "シェイド", "ストゥー", "ケンジ", "メロディー", "クロウ",
    "モーティス", "リリー", "コーデリアス", "レオン", "ファング",
    "エドガー", "ミコ"
  ],
  sniper: [
    "エリザベス", "マンディ", "アンジェロ", "ベル", "ビー",
    "ナーニ", "メイジー", "ブロック", "ボニー", "ジャネット"
  ],
  attacker: [
    "モー", "サージ", "リコ", "クランシー", "ニタ",
    "ローラ", "コレット", "カール", "チェスター", "パール",
    "イヴ", "タラ", "8ビット", "スパイク", "R-T"
  ],
  support: [
    "ガス", "バイロン", "キット", "ラフス", "グレイ",
    "パム", "ベリー", "ポコ", "MAX"
  ],
  controller: [
    "ペニー", "サンディ", "オーティス", "ジーン", "アンバー",
    "ゲイル", "スクウィーク", "グリフ", "ジェシー", "Emz",
    "チャック", "チャーリー", "ルー", "ボウ", "Mr.P"
  ]
};

export interface RankingItem {
  rank: number;
  characterName: string;
  description: string;
}

export const characterRankings: RankingItem[] = [
  { rank: 1, characterName: "シェイド", description: "罠設置と長距離攻撃" },
  { rank: 2, characterName: "ストゥー", description: "現環境最強のブロッカー。高いHPと強力な範囲攻撃が特徴" },
  { rank: 3, characterName: "ガス", description: "形態変化による高い汎用性と驚異的な火力を持つ" },
  { rank: 4, characterName: "モー", description: "安定した攻撃力と優れたサポート能力を持つ" },
  { rank: 5, characterName: "ケンジ", description: "広範囲な攻撃と高い機動力で戦場を支配" },
  { rank: 6, characterName: "サージ", description: "ロボット形態の圧倒的な性能と優れた回復力" },
  { rank: 7, characterName: "バイロン", description: "強力な範囲攻撃とチーム全体へのサポート力" },
  { rank: 8, characterName: "ダリル", description: "長距離からの高火力と敵の動きを制限する能力" },
  { rank: 9, characterName: "フランケン", description: "優れた制圧力と敵を翻弄する機動力" },
  { rank: 10, characterName: "リコ", description: "高いバースト火力と安定したコントロール能力" },
  { rank: 11, characterName: "ラリー&ローリー", description: "強力な範囲攻撃と効果的なゾーニング能力" },
  { rank: 12, characterName: "ジュジュ", description: "味方の回復と敵への攻撃を両立する万能性" },
  { rank: 13, characterName: "ペニー", description: "チームサポートと安定した火力を持つ" },
  { rank: 14, characterName: "クランシー", description: "高いバースト火力と優れた地形コントロール" },
  { rank: 15, characterName: "MAX", description: "効果的な範囲攻撃と安定したコントロール" },
  { rank: 16, characterName: "サンディ", description: "敵を引き寄せる独特な戦術と高い汎用性" },
  { rank: 17, characterName: "キット", description: "長距離からの高火力と壁破壊能力" },
  { rank: 18, characterName: "ニタ", description: "安定した長距離攻撃と優れた壁破壊能力" },
  { rank: 19, characterName: "メロディー", description: "範囲攻撃と砲台による効果的な制圧" },
  { rank: 20, characterName: "バスター", description: "高い耐久力と味方のサポート能力" },
  { rank: 21, characterName: "エリザベス", description: "効果的な範囲攻撃と敵の行動を制限する能力" },
  { rank: 22, characterName: "マンディ", description: "長距離からの正確な攻撃と高い火力" },
  { rank: 23, characterName: "アンジェロ", description: "範囲攻撃と強力なスーパースキル" },
  { rank: 24, characterName: "R-T", description: "地形変化による戦場のコントロール" },
  { rank: 25, characterName: "オーティス", description: "高い機動力と近接での驚異的な火力" },
  { rank: 26, characterName: "ラフス", description: "独特な攻撃パターンと高い戦術性" },
  { rank: 27, characterName: "クロウ", description: "高い機動力とチームサポート能力" },
  { rank: 28, characterName: "モーティス", description: "効果的なスタン効果と接近戦での強さ" },
  { rank: 29, characterName: "ベル", description: "壁を利用した攻撃と高いスキル性" },
  { rank: 30, characterName: "ジーン", description: "効果的な範囲攻撃とシールドサポート" },
  { rank: 31, characterName: "ローラ", description: "長距離攻撃とポーターによる制圧" },
  { rank: 32, characterName: "コレット", description: "継続的なダメージと範囲攻撃" },
  { rank: 33, characterName: "ドラコ", description: "高い耐久力と近接での強さ" },
  { rank: 34, characterName: "グレイ", description: "毒効果と高い機動力による牽制" },
  { rank: 35, characterName: "カール", description: "効果的な範囲攻撃と独特な戦術" },
  { rank: 36, characterName: "チェスター", description: "チャージ攻撃による高火力" },
  { rank: 37, characterName: "ビー", description: "壁越しの攻撃と範囲ダメージ" },
  { rank: 38, characterName: "アンバー", description: "ステルス能力と高いバースト火力" },
  { rank: 39, characterName: "パール", description: "範囲攻撃と味方を隠すスーパー" },
  { rank: 40, characterName: "リリー", description: "範囲攻撃と独特な移動能力" },
  { rank: 41, characterName: "ゲイル", description: "怒り効果による火力上昇" },
  { rank: 42, characterName: "イヴ", description: "連鎖的な攻撃と高い機動力" },
  { rank: 43, characterName: "バーリー", description: "操作可能な攻撃と高火力" },
  { rank: 44, characterName: "ティック", description: "範囲攻撃と効果的なスーパー" },
  { rank: 45, characterName: "ダイナマイク", description: "突進能力と近接での強さ" },
  { rank: 46, characterName: "コーデリアス", description: "範囲攻撃と効果的な牽制" },
  { rank: 47, characterName: "タラ", description: "近距離での高火力と範囲攻撃" },
  { rank: 48, characterName: "8ビット", description: "ノックバック効果と機動力" },
  { rank: 49, characterName: "コルト", description: "高速な近接攻撃と範囲攻撃" },
  { rank: 50, characterName: "スクウィーク", description: "高い耐久力と近接攻撃" },
  { rank: 51, characterName: "グリフ", description: "範囲回復と攻撃の両立" },
  { rank: 52, characterName: "メイジー", description: "継続ダメージと地域制圧" },
  { rank: 53, characterName: "ナーニ", description: "ブーメラン攻撃と壁破壊" },
  { rank: 54, characterName: "ジェシー", description: "熊の召喚と近距離攻撃" },
  { rank: 55, characterName: "バズ", description: "ハッチリングによる制圧" },
  { rank: 56, characterName: "Emz", description: "突進攻撃と高い耐久力" },
  { rank: 57, characterName: "メグ", description: "魔法攻撃と範囲効果" },
  { rank: 58, characterName: "エルプリモ", description: "掘削能力と近接攻撃" },
  { rank: 59, characterName: "ビビ", description: "回復と攻撃の組み合わせ" },
  { rank: 60, characterName: "ローサ", description: "投擲攻撃と範囲効果" },
  { rank: 61, characterName: "チャック", description: "インク攻撃と移動阻害" },
  { rank: 62, characterName: "パム", description: "近距離と遠距離の攻撃" },
  { rank: 63, characterName: "ジャッキー", description: "爆弾による地域制圧" },
  { rank: 64, characterName: "ウィロー", description: "高火力と攻撃力ブースト" },
  { rank: 65, characterName: "スプラウト", description: "投擲爆弾と壁破壊" },
  { rank: 66, characterName: "ベリー", description: "高いHPとスタン効果" },
  { rank: 67, characterName: "チャーリー", description: "高い機動力と吸血効果" },
  { rank: 68, characterName: "レオン", description: "近接での範囲攻撃" },
  { rank: 69, characterName: "スパイク", description: "粘着爆弾による攻撃" },
  { rank: 70, characterName: "ルー", description: "ステルス能力と近接攻撃" },
  { rank: 71, characterName: "ポコ", description: "回復とサポート能力" },
  { rank: 72, characterName: "シェリー", description: "範囲攻撃と特殊効果" },
  { rank: 73, characterName: "ジャネット", description: "範囲攻撃と制御能力" },
  { rank: 74, characterName: "ブロック", description: "変形能力と適応力" },
  { rank: 75, characterName: "ボニー", description: "アップグレード型の攻撃" },
  { rank: 76, characterName: "ボウ", description: "吹き飛ばし効果と範囲攻撃" },
  { rank: 77, characterName: "サム", description: "継続ダメージと範囲攻撃" },
  { rank: 78, characterName: "ファング", description: "高い耐久力とシールド" },
  { rank: 79, characterName: "Mr.P", description: "範囲攻撃と特殊効果" },
  { rank: 80, characterName: "エドガー", description: "HP比例ダメージ攻撃" },
  { rank: 81, characterName: "ハンク", description: "特殊な攻撃パターン" },
  { rank: 82, characterName: "ブル", description: "範囲攻撃と制御効果" },
  { rank: 83, characterName: "アッシュ", description: "二人一組の特殊な攻撃" },
  { rank: 84, characterName: "グロム", description: "凍結効果と範囲攻撃" },
  { rank: 85, characterName: "ダグ", description: "特殊な攻撃と効果" },
  { rank: 86, characterName: "ミコ", description: "タレット設置と電撃攻撃" }
];

export const rankingTypes = [
  { id: 'all', nameKey: 'rankings.types.all' },
  { id: 'tank', nameKey: 'rankings.types.tank' },
  { id: 'thrower', nameKey: 'rankings.types.thrower' },
  { id: 'assassin', nameKey: 'rankings.types.assassin' },
  { id: 'sniper', nameKey: 'rankings.types.sniper' },
  { id: 'attacker', nameKey: 'rankings.types.attacker' },
  { id: 'support', nameKey: 'rankings.types.support' },
  { id: 'controller', nameKey: 'rankings.types.controller' }
];

export const charactersData: Record<string, CharacterData> = {
  'シェリー': {
    id: 'shelly',
    name: 'シェリー',
    description: '近距離での戦闘が得意な初期キャラクター。ショットガンで広範囲にダメージを与える。',
    role: 'シューター',
    rarity: 'レア',
    releaseDate: '2018-06-15',
    stats: {
      health: 5600,
      speed: 720,
      attack: 420,
      defense: 3
    },
    normalAttack: {
      name: 'ショットガンショット',
      description: '近距離で威力を発揮する広範囲攻撃',
      damage: 420,
      range: 7.67
    },
    superSkill: {
      name: 'スーパーシェル',
      description: 'より強力なショットガンの弾を発射し、壁を破壊できる',
      damage: 448,
      range: 8.67,
      cooldown: 0
    },
    gadget1: {
      name: 'ダッシュフォワード',
      description: '前方に素早く移動し、敵を押しのける',
      cooldown: 3.5
    },
    gadget2: {
      name: 'クレイピジョン',
      description: '上空に的を放ち、次の攻撃のダメージが増加',
      cooldown: 3
    },
    starPower1: {
      name: 'シェルショック',
      description: 'スーパースキルが敵の移動速度を4秒間低下させる'
    },
    starPower2: {
      name: 'バンドエイド',
      description: '体力が40%以下になると20秒かけて2000回復する'
    },
    recommendations: {
      bestModes: ['ブロウル', 'ハイスト', 'ジェムグラブ'],
      bestMaps: ['スネークプレイリー', 'ハードロック鉱山'],
      goodPartners: ['ボー', 'エメラルド', 'ポコ'],
      counters: ['パム', 'ブルー', 'コルト']
    }
  },
  'ニタ': {
    id: 'nita',
    name: 'ニタ',
    description: 'クマを召喚して戦うアタッカー。近距離での戦闘が得意。',
    role: 'アタッカー',
    rarity: 'レア',
    releaseDate: '2018-06-15',
    stats: {
      health: 5800,
      speed: 720,
      attack: 1120,
      defense: 3
    },
    normalAttack: {
      name: 'ルプチャー',
      description: '衝撃波を放って敵にダメージを与える',
      damage: 1120,
      range: 6.67
    },
    superSkill: {
      name: 'クマ召喚',
      description: 'バトルクマを召喚して敵を攻撃',
      damage: 800,
      range: 4,
      cooldown: 0
    },
    gadget1: {
      name: 'クマトラップ',
      description: 'クマが3秒間スタン効果を与える',
      cooldown: 4
    },
    starPower1: {
      name: 'クマの怒り',
      description: 'クマの攻撃速度が50%上昇'
    },
    recommendations: {
      bestModes: ['ジェムグラブ', 'ブロウル', 'ハイスト'],
      bestMaps: ['クリスタルマイン', 'スネークプレイリー'],
      goodPartners: ['ポコ', 'ジーン', 'サンディ'],
      counters: ['エメラルド', 'コルト', 'リコ']
    }
  },
  // ... 残りのキャラクターデータ ...
};

export const getCharacterData = (characterId: string): CharacterData | undefined => {
  return charactersData[characterId];
};

export const getAllCharacters = (): CharacterData[] => {
  return Object.values(charactersData);
};

export const getCharactersByRole = (role: CharacterRole): CharacterData[] => {
  return Object.values(charactersData).filter(char => char.role === role);
};

export const getCharacterRanking = (characterName: string): number => {
  const rankingItem = characterRankings.find(item => item.characterName === characterName);
  return rankingItem?.rank ?? -1;
};

export const getCharactersByType = (type: string): CharacterData[] => {
  const characterNames = characterTypes[type] || [];
  return characterNames
    .map(name => charactersData[name])
    .filter((char): char is CharacterData => char !== undefined);
};