//characterCompatibility.ts
import { CharacterCompatibility } from '../types/types';
import { shellyData } from './characters/shellyData';
import { nitaData } from './characters/nitaData';
import { coltData } from './characters/coltData';
import { bullData } from './characters/bullData';
import { brockData } from './characters/brockData';
import { elPrimoData } from './characters/elPrimoData';
import { barleyData } from './characters/barleyData';
import { pocoData } from './characters/pocoData';
import { rosaData } from './characters/rosaData';
import { jessieData } from './characters/jessieData';
import { dynamikeData } from './characters/dynamikeData';
import { tickData } from './characters/tickData';
import { eightBitData } from './characters/eightBitData';
import { ricoData } from './characters/ricoData';
import { darrylData } from './characters/darrylData';
import { pennyData } from './characters/pennyData';
import { carlData } from './characters/carlData';
import { jackyData } from './characters/jackyData';
import { gusData } from './characters/gusData';
import { boData } from './characters/boData';
import { emzData } from './characters/emzData';
import { stuData } from './characters/stuData';
import { piperData } from './characters/piperData';
import { pamData } from './characters/pamData';
import { frankData } from './characters/frankData';
import { bibiData } from './characters/bibiData';
import { beaData } from './characters/beaData';
import { naniData } from './characters/naniData';
import { edgarData } from './characters/edgarData';
import { griffData } from './characters/griffData';
import { gromData } from './characters/gromData';
import { bonnieData } from './characters/bonnieData';
import { galeData } from './characters/galeData';
import { coletteData } from './characters/coletteData';
import { belleData } from './characters/belleData';
import { ashData } from './characters/ashData';
import { lolaData } from './characters/lolaData';
import { samData } from './characters/samData';
import { mandyData } from './characters/mandyData';
import { maisieData } from './characters/maisieData';
import { hankData } from './characters/hankData';
import { pearlData } from './characters/pearlData';
import { larryandLawrieData } from './characters/larryandLawrieData';
import { angeloData } from './characters/angeloData';
import { berryData } from './characters/berryData';
import { shadeData } from './characters/shadeData';
import { mortisData } from './characters/mortisData';
import { taraData } from './characters/taraData';
import { geneData } from './characters/geneData';
import { maxData } from './characters/maxData';
import { mrpData } from './characters/mrpData';
import { sproutData } from './characters/sproutData';
import { byronData } from './characters/byronData';
import { squeakData } from './characters/squeakData';
import { louData } from './characters/louData';
import { ruffsData } from './characters/ruffsData';
import { buzzData } from './characters/buzzData';
import { fangData } from './characters/fangData';
import { eveData } from './characters/eveData';
import { janetData } from './characters/janetData';
import { otisData } from './characters/otisData';
import { busterData } from './characters/busterData';
import { grayData } from './characters/grayData';
import { rtData } from './characters/rtData';
import { willowData } from './characters/willowData';
import { dougData } from './characters/dougData';
import { chuckData } from './characters/chuckData';
import { charlieData } from './characters/charlieData';
import { micoData } from './characters/micoData';
import { melodieData } from './characters/melodieData';
import { lilyData } from './characters/lilyData';
import { clancyData } from './characters/clancyData';
import { moeData } from './characters/moeData';
import { jujuData } from './characters/jujuData';
import { spikeData } from './characters/spikeData';
import { crowData } from './characters/crowData';
import { leonData } from './characters/leonData';
import { sandyData } from './characters/sandyData';
import { amberData } from './characters/amberData';
import { megData } from './characters/megData';
import { surgeData } from './characters/surgeData';
import { chesterData } from './characters/chesterData';
import { cordeliusData } from './characters/cordeliusData';
import { kitData } from './characters/kitData';
import { dracoData } from './characters/dracoData';
import { kenjiData } from './characters/kenjiData';

export const CHARACTER_NAMES = {
  shelly: { ja: "シェリー", en: "Shelly", ko: "쉘리" },
  nita: { ja: "ニタ", en: "Nita", ko: "니타" },
  colt: { ja: "コルト", en: "Colt", ko: "콜트" },
  bull: { ja: "ブル", en: "Bull", ko: "불" },
  brock: { ja: "ブロック", en: "Brock", ko: "브록" },
  elPrimo: { ja: "エルプリモ", en: "El Primo", ko: "엘 프리모" },
  barley: { ja: "バーリー", en: "Barley", ko: "발리" },
  poco: { ja: "ポコ", en: "Poco", ko: "포코" },
  rosa: { ja: "ローサ", en: "Rosa", ko: "로사" },
  jessie: { ja: "ジェシー", en: "Jessie", ko: "제시" },
  dynamike: { ja: "ダイナマイク", en: "Dynamike", ko: "다이나마이크" },
  tick: { ja: "ティック", en: "Tick", ko: "틱" },
  eightBit: { ja: "8ビット", en: "8-Bit", ko: "8-비트" },
  rico: { ja: "リコ", en: "Rico", ko: "리코" },
  darryl: { ja: "ダリル", en: "Darryl", ko: "대릴" },
  penny: { ja: "ペニー", en: "Penny", ko: "페니" },
  carl: { ja: "カール", en: "Carl", ko: "칼" },
  jacky: { ja: "ジャッキー", en: "Jacky", ko: "재키" },
  gus: { ja: "ガス", en: "Gus", ko: "거스" },
  bo: { ja: "ボウ", en: "Bo", ko: "보" },
  emz: { ja: "Emz", en: "EMZ", ko: "EMZ" },
  stu: { ja: "ストゥー", en: "Stu", ko: "스투" },
  piper: { ja: "エリザベス", en: "Piper", ko: "파이퍼" },
  pam: { ja: "パム", en: "Pam", ko: "팸" },
  frank: { ja: "フランケン", en: "Frank", ko: "프랭크" },
  bibi: { ja: "ビビ", en: "Bibi", ko: "비비" },
  bea: { ja: "ビー", en: "Bea", ko: "베아" },
  nani: { ja: "ナーニ", en: "Nani", ko: "나니" },
  edgar: { ja: "エドガー", en: "Edgar", ko: "에드가" },
  griff: { ja: "グリフ", en: "Griff", ko: "그리프" },
  grom: { ja: "グロム", en: "Grom", ko: "그롬" },
  bonnie: { ja: "ボニー", en: "Bonnie", ko: "보니" },
  gale: { ja: "ゲイル", en: "Gale", ko: "게일" },
  colette: { ja: "コレット", en: "Colette", ko: "콜레트" },
  belle: { ja: "ベル", en: "Belle", ko: "벨" },
  ash: { ja: "アッシュ", en: "Ash", ko: "애쉬" },
  lola: { ja: "ローラ", en: "Lola", ko: "롤라" },
  sam: { ja: "サム", en: "Sam", ko: "샘" },
  mandy: { ja: "マンディ", en: "Mandy", ko: "맨디" },
  maisie: { ja: "メイジー", en: "Maisie", ko: "메이지" },
  hank: { ja: "ハンク", en: "Hank", ko: "행크" },
  pearl: { ja: "パール", en: "Pearl", ko: "펄" },
  larryandLawrie: { ja: "ラリー&ローリー", en: "Larry & Lawrie", ko: "래리&로리" },
  angelo: { ja: "アンジェロ", en: "Angelo", ko: "안젤로" },
  berry: { ja: "ベリー", en: "Berry", ko: "베리" },
  shade: { ja: "シェイド", en: "Shade", ko: "쉐이드" },
  mortis: { ja: "モーティス", en: "Mortis", ko: "모티스" },
  tara: { ja: "タラ", en: "Tara", ko: "타라" },
  gene: { ja: "ジーン", en: "Gene", ko: "진" },
  max: { ja: "MAX", en: "Max", ko: "맥스" },
  mrp: { ja: "ミスターP", en: "Mr. P", ko: "Mr. P" },
  sprout: { ja: "スプラウト", en: "Sprout", ko: "스프라우트" },
  byron: { ja: "バイロン", en: "Byron", ko: "바이런" },
  squeak: { ja: "スクウィーク", en: "Squeak", ko: "스퀴크" },
  lou: { ja: "ルー", en: "Lou", ko: "루" },
  ruffs: { ja: "ラフス", en: "Ruffs", ko: "러프스" },
  buzz: { ja: "バズ", en: "Buzz", ko: "버즈" },
  fang: { ja: "ファング", en: "Fang", ko: "팡" },
  eve: { ja: "イヴ", en: "Eve", ko: "이브" },
  janet: { ja: "ジャネット", en: "Janet", ko: "자넷" },
  otis: { ja: "オーティス", en: "Otis", ko: "오티스" },
  buster: { ja: "バスター", en: "Buster", ko: "버스터" },
  gray: { ja: "グレイ", en: "Gray", ko: "그레이" },
  rt: { ja: "R-T", en: "R-T", ko: "R-T" },
  willow: { ja: "ウィロー", en: "Willow", ko: "윌로우" },
  doug: { ja: "ダグ", en: "Doug", ko: "더그" },
  chuck: { ja: "チャック", en: "Chuck", ko: "척" },
  charlie: { ja: "チャーリー", en: "Charlie", ko: "찰리" },
  mico: { ja: "ミコ", en: "Mico", ko: "미코" },
  melodie: { ja: "メロディー", en: "Melodie", ko: "멜로디" },
  lily: { ja: "リリー", en: "Lily", ko: "릴리" },
  clancy: { ja: "クランシー", en: "Clancy", ko: "클랜시" },
  moe: { ja: "モー", en: "Moe", ko: "모" },
  juju: { ja: "ジュジュ", en: "Juju", ko: "주주" },
  spike: { ja: "スパイク", en: "Spike", ko: "스파이크" },
  crow: { ja: "クロウ", en: "Crow", ko: "크로우" },
  leon: { ja: "レオン", en: "Leon", ko: "레온" },
  sandy: { ja: "サンディ", en: "Sandy", ko: "샌디" },
  amber: { ja: "アンバー", en: "Amber", ko: "앰버" },
  meg: { ja: "メグ", en: "Meg", ko: "메그" },
  surge: { ja: "サージ", en: "Surge", ko: "서지" },
  chester: { ja: "チェスター", en: "Chester", ko: "체스터" },
  cordelius: { ja: "コーデリアス", en: "Cordelius", ko: "코델리우스" },
  kit: { ja: "キット", en: "Kit", ko: "키트" },
  draco: { ja: "ドラコ", en: "Draco", ko: "드라코" },
  kenji: { ja: "ケンジ", en: "Kenji", ko: "켄지" }
} as const;

export const CHARACTER_MAP: { [key: number]: string } = {
  1: "シェリー", 2: "ニタ", 3: "コルト", 4: "ブル", 5: "ブロック", 6: "エルプリモ", 7: "バーリー", 8: "ポコ",
  9: "ローサ", 10: "ジェシー", 11: "ダイナマイク", 12: "ティック", 13: "8ビット", 14: "リコ", 15: "ダリル",
  16: "ペニー", 17: "カール", 18: "ジャッキー", 19: "ガス", 20: "ボウ", 21: "Emz", 22: "ストゥー",
  23: "エリザベス", 24: "パム", 25: "フランケン", 26: "ビビ", 27: "ビー", 28: "ナーニ", 29: "エドガー",
  30: "グリフ", 31: "グロム", 32: "ボニー", 33: "ゲイル", 34: "コレット", 35: "ベル", 36: "アッシュ",
  37: "ローラ", 38: "サム", 39: "マンディ", 40: "メイジー", 41: "ハンク", 42: "パール",
  43: "ラリー&ローリー", 44: "アンジェロ", 45: "ベリー", 46: "シェイド", 47: "モーティス", 48: "タラ",
  49: "ジーン", 50: "MAX", 51: "ミスターP", 52: "スプラウト", 53: "バイロン", 54: "スクウィーク",
  55: "ルー", 56: "ラフス", 57: "バズ", 58: "ファング", 59: "イヴ", 60: "ジャネット", 61: "オーティス",
  62: "バスター", 63: "グレイ", 64: "R-T", 65: "ウィロー", 66: "ダグ", 67: "チャック", 68: "チャーリー",
  69: "ミコ", 70: "メロディー", 71: "リリー", 72: "クランシー", 73: "モー", 74: "ジュジュ", 75: "スパイク",
  76: "クロウ", 77: "レオン", 78: "サンディ", 79: "アンバー", 80: "メグ", 81: "サージ", 82: "チェスター",
  83: "コーデリアス", 84: "キット", 85: "ドラコ", 86: "ケンジ"
};

export const JAPANESE_TO_ENGLISH_MAP: { [key: string]: string } = {
  "シェリー": "shelly", "ニタ": "nita", "コルト": "colt", "ブル": "bull", "ブロック": "brock",
  "エルプリモ": "elPrimo", "バーリー": "barley", "ポコ": "poco", "ローサ": "rosa", "ジェシー": "jessie",
  "ダイナマイク": "dynamike", "ティック": "tick", "8ビット": "eightBit", "リコ": "rico", "ダリル": "darryl",
  "ペニー": "penny", "カール": "carl", "ジャッキー": "jacky", "ガス": "gus", "ボウ": "bo", "Emz": "emz",
  "ストゥー": "stu", "エリザベス": "piper", "パム": "pam", "フランケン": "frank", "ビビ": "bibi",
  "ビー": "bea", "ナーニ": "nani", "エドガー": "edgar", "グリフ": "griff", "グロム": "grom",
  "ボニー": "bonnie", "ゲイル": "gale", "コレット": "colette", "ベル": "belle", "アッシュ": "ash",
  "ローラ": "lola", "サム": "sam", "マンディ": "mandy", "メイジー": "maisie", "ハンク": "hank",
  "パール": "pearl", "ラリー&ローリー": "larryandLawrie", "アンジェロ": "angelo", "ベリー": "berry",
  "シェイド": "shade", "モーティス": "mortis", "タラ": "tara", "ジーン": "gene", "MAX": "max",
  "ミスターP": "mrp", "スプラウト": "sprout", "バイロン": "byron", "スクウィーク": "squeak", "ルー": "lou",
  "ラフス": "ruffs", "バズ": "buzz", "ファング": "fang", "イヴ": "eve", "ジャネット": "janet",
  "オーティス": "otis", "バスター": "buster", "グレイ": "gray", "R-T": "rt", "ウィロー": "willow",
  "ダグ": "doug", "チャック": "chuck", "チャーリー": "charlie", "ミコ": "mico", "メロディー": "melodie",
  "リリー": "lily", "クランシー": "clancy", "モー": "moe", "ジュジュ": "juju", "スパイク": "spike",
  "クロウ": "crow", "レオン": "leon", "サンディ": "sandy", "アンバー": "amber", "メグ": "meg",
  "サージ": "surge", "チェスター": "chester", "コーデリアス": "cordelius", "キット": "kit",
  "ドラコ": "draco", "ケンジ": "kenji"
};

export const allCharacterData: { [key: number]: CharacterCompatibility } = {
  1: shellyData, 2: nitaData, 3: coltData, 4: bullData, 5: brockData, 6: elPrimoData, 7: barleyData, 8: pocoData,
  9: rosaData, 10: jessieData, 11: dynamikeData, 12: tickData, 13: eightBitData, 14: ricoData, 15: darrylData,
  16: pennyData, 17: carlData, 18: jackyData, 19: gusData, 20: boData, 21: emzData, 22: stuData,
  23: piperData, 24: pamData, 25: frankData, 26: bibiData, 27: beaData, 28: naniData, 29: edgarData,
  30: griffData, 31: gromData, 32: bonnieData, 33: galeData, 34: coletteData, 35: belleData, 36: ashData,
  37: lolaData, 38: samData, 39: mandyData, 40: maisieData, 41: hankData, 42: pearlData,
  43: larryandLawrieData, 44: angeloData, 45: berryData, 46: shadeData, 47: mortisData, 48: taraData,
  49: geneData, 50: maxData, 51: mrpData, 52: sproutData, 53: byronData, 54: squeakData, 55: louData,
  56: ruffsData, 57: buzzData, 58: fangData, 59: eveData, 60: janetData, 61: otisData, 62: busterData,
  63: grayData, 64: rtData, 65: willowData, 66: dougData, 67: chuckData, 68: charlieData, 69: micoData,
  70: melodieData, 71: lilyData, 72: clancyData, 73: moeData, 74: jujuData, 75: spikeData, 76: crowData,
  77: leonData, 78: sandyData, 79: amberData, 80: megData, 81: surgeData, 82: chesterData, 83: cordeliusData,
  84: kitData, 85: dracoData, 86: kenjiData
};

export const useCharacterLocalization = () => {
  const { currentLanguage } = useSettingsScreenTranslation();
  
  const getLocalizedName = (characterName: string) => {
    const englishKey = JAPANESE_TO_ENGLISH_MAP[characterName] || characterName.toLowerCase();
    return CHARACTER_NAMES[englishKey]?.[currentLanguage] || characterName;
  };

  return { getLocalizedName, currentLanguage };
};

// 相性スコアを取得する関数
export const getCompatibilityScore = (
  characterId: number,
  targetName: string
): number => {
  const character = allCharacterData[characterId];
  return character?.compatibilityScores[targetName] ?? 5;
};

// 相性の説明を取得する関数
export const getCompatibilityExplanation = (
  characterId: number,
  targetName: string
): string | undefined => {
  const character = allCharacterData[characterId];
  return character?.explanation?.[targetName];
};

// キャラクター名からIDを取得する関数
export const getCharacterId = (name: string): number | undefined => {
  return Object.entries(CHARACTER_MAP).find(([_, charName]) => charName === name)?.[0] as unknown as number;
};