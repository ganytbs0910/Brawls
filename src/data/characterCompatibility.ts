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