const fs = require('fs');
const path = require('path');

interface CharacterCompatibility {
  id: number;
  name: string;
  compatibilityScores: { [key: string]: number };
  explanation: { [key: string]: string };
}

// キャラクター名のリスト（日本語名）
const characters: string[] = [
  "シェリー", "ニタ", "コルト", "ブル", "ブロック", "エルプリモ", "バーリー", 
  "ポコ", "ローサ", "ジェシー", "ダイナマイク", "ティック", "8ビット", "リコ", 
  "ダリル", "ペニー", "カール", "ジャッキー", "ガス", "ボウ", "Emz", "ストゥー", 
  "エリザベス", "パム", "フランケン", "ビビ", "ビー", "ナーニ", "エドガー", 
  "グリフ", "グロム", "ボニー", "ゲイル", "コレット", "ベル", "アッシュ", 
  "ローラ", "サム", "マンディ", "メイジー", "ハンク", "パール", "ラリー&ローリー", 
  "アンジェロ", "ベリー", "シェイド", "モーティス", "タラ", "ジーン", "MAX", 
  "ミスターP", "スプラウト", "バイロン", "スクウィーク", "ルー", "ラフス", 
  "バズ", "ファング", "イヴ", "ジャネット", "オーティス", "バスター", "グレイ", 
  "R-T", "ウィロー", "ダグ", "チャック", "チャーリー", "ミコ", "メロディー", 
  "リリー", "クランシー", "モー", "ジュジュ", "スパイク", "クロウ", "レオン", 
  "サンディ", "アンバー", "メグ", "サージ", "チェスター", "コーデリアス", 
  "キット", "ドラコ", "ケンジ"
];

// ファイル名を生成する関数（日本語をローマ字に変換）
const getFileName = (name: string): string => {
  const nameMapping: { [key: string]: string } = {
    "シェリー": "shelly",
    "ニタ": "nita",
    "コルト": "colt",
    "ブル": "bull",
    "ブロック": "brock",
    "エルプリモ": "el-primo",
    "バーリー": "barley",
    "ポコ": "poco",
    "ローサ": "rosa",
    "ジェシー": "jessie",
    "ダイナマイク": "dynamike",
    "ティック": "tick",
    "8ビット": "8-bit",
    "リコ": "rico",
    "ダリル": "darryl",
    "ペニー": "penny",
    "カール": "carl",
    "ジャッキー": "jacky",
    "ガス": "gus",
    "ボウ": "bo",
    "Emz": "emz",
    "ストゥー": "stu",
    "エリザベス": "elizabeth",
    "パム": "pam",
    "フランケン": "frank",
    "ビビ": "bibi",
    "ビー": "bea",
    "ナーニ": "nani",
    "エドガー": "edgar",
    "グリフ": "griff",
    "グロム": "grom",
    "ボニー": "bonnie",
    "ゲイル": "gale",
    "コレット": "colette",
    "ベル": "belle",
    "アッシュ": "ash",
    "ローラ": "lola",
    "サム": "sam",
    "マンディ": "mandy",
    "メイジー": "maisie",
    "ハンク": "hank",
    "パール": "pearl",
    "ラリー&ローリー": "larry-and-lawrie",
    "アンジェロ": "angelo",
    "ベリー": "berry",
    "シェイド": "shade",
    "モーティス": "mortis",
    "タラ": "tara",
    "ジーン": "gene",
    "MAX": "max",
    "ミスターP": "mr-p",
    "スプラウト": "sprout",
    "バイロン": "byron",
    "スクウィーク": "squeak",
    "ルー": "lou",
    "ラフス": "ruffs",
    "バズ": "buzz",
    "ファング": "fang",
    "イヴ": "eve",
    "ジャネット": "janet",
    "オーティス": "otis",
    "バスター": "buster",
    "グレイ": "gray",
    "R-T": "r-t",
    "ウィロー": "willow",
    "ダグ": "doug",
    "チャック": "chuck",
    "チャーリー": "charlie",
    "ミコ": "mico",
    "メロディー": "melody",
    "リリー": "lily",
    "クランシー": "clancy",
    "モー": "maw",
    "ジュジュ": "juju",
    "スパイク": "spike",
    "クロウ": "crow",
    "レオン": "leon",
    "サンディ": "sandy",
    "アンバー": "amber",
    "メグ": "meg",
    "サージ": "surge",
    "チェスター": "chester",
    "コーデリアス": "cordelius",
    "キット": "kit",
    "ドラコ": "draco",
    "ケンジ": "kenji"
  };
  
  return nameMapping[name] || name.toLowerCase();
};

// データディレクトリのパス
const DATA_DIR = path.join(process.cwd(), 'app', 'data', 'characters');

// ディレクトリが存在しない場合は作成
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 各キャラクターのファイルを生成
characters.forEach((character, index) => {
  const compatibilityScores: { [key: string]: number } = {};
  
  // 全キャラクターとの相性スコアを初期化
  characters.forEach(otherCharacter => {
    if (otherCharacter !== character) {
      compatibilityScores[otherCharacter] = 0;
    }
  });

  const characterData: CharacterCompatibility = {
    id: index + 1,
    name: character,
    compatibilityScores,
    explanation: {}
  };

  const fileContent = `import { CharacterCompatibility } from '../types/types';

export const ${getFileName(character)}Data: CharacterCompatibility = ${JSON.stringify(characterData, null, 2)};
`;

  const fileName = path.join(DATA_DIR, `${getFileName(character)}.ts`);
  fs.writeFileSync(fileName, fileContent);
  console.log(`Created ${fileName}`);
});

console.log('All character files have been generated!');