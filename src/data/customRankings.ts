// customRankings.ts
import { CharacterData, RankingItem } from '../types/types';

interface CustomRankingConfig {
  [role: string]: string[];
}

const roleSpecificRankings: CustomRankingConfig = {
  all: [
    'パール',
    'チャック',
    'コーデリアス',
    'グレイ',
    'アンバー',
    'レオン',
    'スパイク',
    'サンディ',
    'クロウ',
    'メグ',
    'チェスター',
    'ウィロー',
    'モーティス',
    'タラ',
    'ジーン',
    'MAX',
    'Mr.P',
    'スプラウト',
    'バイロン',
    'スクウィーク',
    'ガス',
    'バスター',
    'サム',
    'オーティス',
    'ルー',
    'ラフス',
    'ベル',
    'バズ',
    'アッシュ',
    'ローラ',
    'ファング',
    'イヴ',
    'ジャネット',
    'チャーリー',
    'エリザベス',
    'マンディ',
    'ダグ',
    'R-T',
    'ハンク',
    'メイジー',
    'キット',
    'メロディー',
    'ラリー&ローリー',
    'クランシー',
    'アンジェロ',
    'ドラコ',
    'リリー',
    'ベリー',
    'ケンジ',
    'シェイド',
    'ジュジュ',
    'ブロック',
    'ミコ',
    'サージ',
    'シェリー',
    'ニタ',
    'コルト',
    'ブル',
    'ジェシー',
    'ブロック',
    'ダイナマイク',
    'ボウ',
    'ティック',
    '8ビット',
    'Emz',
    'エルプリモ',
    'バーリー',
    'ポコ',
    'ローサ',
    'リコ',
    'ダリル',
    'ペニー',
    'カール',
    'ジャッキー',
    'パイパー',
    'パム',
    'フランケン',
    'ビビ',
    'ビー',
    'ナーニ',
    'エドガー',
    'グリフ',
    'グロム',
    'ボニー',
    'コレット',
    'モー',
    'メロディー',
    'スチュー',
    'ゲイル'
  ],
  
  tank: [
    'ダリル',
    'ブル',
    'ローサ',
    'エルプリモ',
    'フランケン',
    'アッシュ',
    'サム',
    'ジャッキー',
    'チェスター'
  ],
  
  assassin: [
    'モーティス',
    'クロウ',
    'レオン',
    'エドガー',
    'バズ',
    'ファング',
    'スチュー',
    'ビビ',
    'ベリー'
  ],
  
  support: [
    'ポコ',
    'パム',
    'バイロン',
    'MAX',
    'ガス',
    'ジーン',
    'ラフス',
    'メロディー',
    'キット'
  ],
  
  controller: [
    'サンディ',
    'ゲイル',
    'タラ',
    'スプラウト',
    'グロム',
    'オーティス',
    'ルー',
    'ウィロー',
    'ブロック',
    'スクウィーク'
  ],
  
  thrower: [
    'ダイナマイク',
    'バーリー',
    'ティック',
    'スプラウト',
    'グロム',
    'ダグ'
  ],
  
  sniper: [
    'パイパー',
    'ブロック',
    'ベル',
    'ビー',
    'ナーニ',
    'ボウ',
    'チャック',
    'グレイ'
  ],
  
  attacker: [
    'パール',
    'アンバー',
    'シェリー',
    'コルト',
    'リコ',
    'カール',
    '8ビット',
    'Emz',
    'ローラ',
    'サージ',
    'コレット',
    'ボニー',
    'ニタ',
    'ジェシー',
    'ペニー',
    'グリフ',
    'Mr.P',
    'イヴ',
    'ジャネット',
    'メグ',
    'バスター',
    'ミコ',
    'スパイク',
    'ケンジ',
    'コーデリアス',
    'モー'
  ]
};

export const generateCustomRankings = (
  characters: Record<string, CharacterData>,
  selectedType: string
): RankingItem[] => {
  const customRanking = roleSpecificRankings[selectedType];
  
  if (!customRanking) {
    console.warn(`Invalid ranking type: ${selectedType}, falling back to default order`);
    return Object.values(characters).map((char, index) => ({
      rank: index + 1,
      characterName: char.name,
      description: char.description
    }));
  }

  return customRanking.map((charName, index) => {
    const char = characters[charName];
    if (!char) {
      console.warn(`Character not found: ${charName}`);
    }
    return {
      rank: index + 1,
      characterName: charName,
      description: char?.description || `Description for ${charName} not found`
    };
  });
};

export const validateRankings = (): void => {
  const allCharacters = new Set(roleSpecificRankings.all);
  
  Object.entries(roleSpecificRankings).forEach(([role, characters]) => {
    if (role === 'all') return;
    
    characters.forEach(char => {
      if (!allCharacters.has(char)) {
        console.warn(`Character ${char} in ${role} role is not in the all list`);
      }
    });
  });
};

export const checkDuplicates = (): void => {
  Object.entries(roleSpecificRankings).forEach(([role, characters]) => {
    const seen = new Set<string>();
    characters.forEach(char => {
      if (seen.has(char)) {
        console.warn(`Duplicate character ${char} found in ${role} role`);
      }
      seen.add(char);
    });
  });
};

validateRankings();
checkDuplicates();