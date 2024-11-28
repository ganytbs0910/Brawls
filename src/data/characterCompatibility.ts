import { CharacterCompatibility } from '../types/types';
import { sherryData } from './characters/sherry';
import { nitaData } from './characters/nita';
import { coltData } from './characters/colt';
import { bullData } from './characters/bull';
import { brockData } from './characters/brock';
import { elPrimoData } from './characters/elprimo';
import { barleyData } from './characters/barley';
import { pocoData } from './characters/poco';
import { rosaData } from './characters/rosa';
import { jessieData } from './characters/jessie';
import { dynamikeData } from './characters/dynamike';
import { tickData } from './characters/tick';
import { eightBitData } from './characters/eightbit';
import { ricoData } from './characters/rico';
import { darrylData } from './characters/darryl';
import { pennyData } from './characters/penny';
import { carlData } from './characters/carl';
import { jackyData } from './characters/jacky';
import { gusData } from './characters/gus';
import { boData } from './characters/bo';
import { emzData } from './characters/emz';
import { stuData } from './characters/stu';
import { elizabethData } from './characters/elizabeth';
import { pamData } from './characters/pam';
import { frankData } from './characters/frank';
import { bibiData } from './characters/bibi';
import { beaData } from './characters/bea';
import { naniData } from './characters/nani';
import { edgarData } from './characters/edgar';
import { griffData } from './characters/griff';
import { gromData } from './characters/grom';
import { bonnieData } from './characters/bonnie';
import { galeData } from './characters/gale';
import { coletteData } from './characters/colette';
import { belleData } from './characters/belle';
import { ashData } from './characters/ash';
import { lolaData } from './characters/lola';
import { samData } from './characters/sam';
import { mandyData } from './characters/mandy';
import { maisieData } from './characters/maisie';
import { hankData } from './characters/hank';
import { pearlData } from './characters/pearl';
import { larryandLawrieData } from './characters/larryandLawrie';
import { angeloData } from './characters/angelo';
import { berryData } from './characters/berry';
import { shadeData } from './characters/shade';
import { mortisData } from './characters/mortis';
import { taraData } from './characters/tara';
import { geneData } from './characters/gene';
import { maxData } from './characters/max';
import { mrpData } from './characters/mrp';
import { sproutData } from './characters/sprout';
import { byronData } from './characters/byron';
import { squeakData } from './characters/squeak';
import { louData } from './characters/lou';
import { ruffsData } from './characters/ruffs';
import { buzzData } from './characters/buzz';
import { fangData } from './characters/fang';
import { eveData } from './characters/eve';
import { janetData } from './characters/janet';
import { otisData } from './characters/otis';
import { busterData } from './characters/buster';
import { grayData } from './characters/gray';
import { rtData } from './characters/rt';
import { willowData } from './characters/willow';
import { dougData } from './characters/doug';
import { chuckData } from './characters/chuck';
import { charlieData } from './characters/charlie';
import { micoData } from './characters/mico';
import { melodyData } from './characters/melody';
import { lilyData } from './characters/lily';
import { clancyData } from './characters/clancy';
import { moeData } from './characters/moe';
import { jujuData } from './characters/juju';
import { spikeData } from './characters/spike';
import { crowData } from './characters/crow';
import { leonData } from './characters/leon';
import { sandyData } from './characters/sandy';
import { amberData } from './characters/amber';
import { megData } from './characters/meg';
import { surgeData } from './characters/surge';
import { chesterData } from './characters/chester';
import { cordeliusData } from './characters/cordelius';
import { kitData } from './characters/kit';
import { dracoData } from './characters/draco';
import { kenjiData } from './characters/kenji';

export const CHARACTER_MAP: { [key: number]: string } = {
  1: "シェリー",
  2: "ニタ",
  3: "コルト",
  4: "ブル",
  5: "ブロック",
  6: "エルプリモ",
  7: "バーリー",
  8: "ポコ",
  9: "ローサ",
  10: "ジェシー",
  11: "ダイナマイク",
  12: "ティック",
  13: "8ビット",
  14: "リコ",
  15: "ダリル",
  16: "ペニー",
  17: "カール",
  18: "ジャッキー",
  19: "ガス",
  20: "ボウ",
  21: "Emz",
  22: "ストゥー",
  23: "エリザベス",
  24: "パム",
  25: "フランケン",
  26: "ビビ",
  27: "ビー",
  28: "ナーニ",
  29: "エドガー",
  30: "グリフ",
  31: "グロム",
  32: "ボニー",
  33: "ゲイル",
  34: "コレット",
  35: "ベル",
  36: "アッシュ",
  37: "ローラ",
  38: "サム",
  39: "マンディ",
  40: "メイジー",
  41: "ハンク",
  42: "パール",
  43: "ラリー&ローリー",
  44: "アンジェロ",
  45: "ベリー",
  46: "シェイド",
  47: "モーティス",
  48: "タラ",
  49: "ジーン",
  50: "MAX",
  51: "ミスターP",
  52: "スプラウト",
  53: "バイロン",
  54: "スクウィーク",
  55: "ルー",
  56: "ラフス",
  57: "バズ",
  58: "ファング",
  59: "イヴ",
  60: "ジャネット",
  61: "オーティス",
  62: "バスター",
  63: "グレイ",
  64: "R-T",
  65: "ウィロー",
  66: "ダグ",
  67: "チャック",
  68: "チャーリー",
  69: "ミコ",
  70: "メロディー",
  71: "リリー",
  72: "クランシー",
  73: "モー",
  74: "ジュジュ",
  75: "スパイク",
  76: "クロウ",
  77: "レオン",
  78: "サンディ",
  79: "アンバー",
  80: "メグ",
  81: "サージ",
  82: "チェスター",
  83: "コーデリアス",
  84: "キット",
  85: "ドラコ",
  86: "ケンジ"
};

// すべてのキャラクターデータを格納
export const allCharacterData: { [key: number]: CharacterCompatibility } = {
  1: sherryData,
  2: nitaData,
  3: coltData,
  4: bullData,
  5: brockData,
  6: elPrimoData,
  7: barleyData,
  8: pocoData,
  9: rosaData,
  10: jessieData,
  11: dynamikeData,
  12: tickData,
  13: eightBitData,
  14: ricoData,
  15: darrylData,
  16: pennyData,
  17: carlData,
  18: jackyData,
  19: gusData,
  20: boData,
  21: emzData,
  22: stuData,
  23: elizabethData,
  24: pamData,
  25: frankData,
  26: bibiData,
  27: beaData,
  28: naniData,
  29: edgarData,
  30: griffData,
  31: gromData,
  32: bonnieData,
  33: galeData,
  34: coletteData,
  35: belleData,
  36: ashData,
  37: lolaData,
  38: samData,
  39: mandyData,
  40: maisieData,
  41: hankData,
  42: pearlData,
  43: larryandLawrieData,
  44: angeloData,
  45: berryData,
  46: shadeData,
  47: mortisData,
  48: taraData,
  49: geneData,
  50: maxData,
  51: mrpData,
  52: sproutData,
  53: byronData,
  54: squeakData,
  55: louData,
  56: ruffsData,
  57: buzzData,
  58: fangData,
  59: eveData,
  60: janetData,
  61: otisData,
  62: busterData,
  63: grayData,
  64: rtData,
  65: willowData,
  66: dougData,
  67: chuckData,
  68: charlieData,
  69: micoData,
  70: melodyData,
  71: lilyData,
  72: clancyData,
  73: moeData,
  74: jujuData,
  75: spikeData,
  76: crowData,
  77: leonData,
  78: sandyData,
  79: amberData,
  80: megData,
  81: surgeData,
  82: chesterData,
  83: cordeliusData,
  84: kitData,
  85: dracoData,
  86: kenjiData
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