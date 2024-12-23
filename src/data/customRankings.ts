import { CharacterData, RankingItem } from '../types/types';

interface CustomRankingConfig {
  [role: string]: string[];
}

const roleSpecificRankings: CustomRankingConfig = {
  all: [
    'メロディー',
    'ジュジュ',
    'ストゥー',
    'フランケン',
    'ダリル',
    'イヴ',
    'シェイド',
    'サージ',
    'ケンジ',
    'ガス',
    'バイロン',
    'リコ',
    'ペニー',
    'Max',
    'グレイ',
    'コーデリアス',
    'サンディ',
    'ニタ',
    'バスター',
    'キット',
    'ラリー&ローリー',
    'アンジェロ',
    'エリザベス',
    'R-T',
    'マンディ',
    'オーティス',
    'クロウ',
    'モーティス',
    'ベル',
    'ジーン',
    'ローラ',
    'コレット',
    'ドラコ',
    'ルー',
    'カール',
    'ラフス',
    'メイジー',
    'クランシー',
    'ビー',
    'チェスター',
    'アンバー',
    'パール',
    'アッシュ',
    'ゲイル',
    'ジャッキー',
    'リリー',
    'モー',
    'グリフ',
    'バーリー',
    'ベリー',
    'ティック',
    'ダイナマイク',
    'ウィロー',
    'タラ',
    '8ビット',
    'コルト',
    'ジャネット',
    'ナーニ',
    'スクウィーク',
    'ジェシー',
    'バズ',
    'Emz',
    'エルプリモ',
    'ビビ',
    'スパイク',
    'ローサ',
    'チャック',
    'レオン',
    'メグ',
    'ポコ',
    'シェリー',
    'ブロック',
    'ハンク',
    'ボニー',
    'パム',
    'チャーリー',
    'ボウ',
    'サム',
    'スプラウト',
    'ファング',
    'エドガー',
    'ブル',
    'グロム',
    'ミスターP',
    'ダグ',
    'ミコ'
  ],
  
  tank: [
    'ブル',
    'エルプリモ',
    'ローサ',
    'ダリル',
    'ジャッキー',
    'フランケン',
    'ビビ',
    'アッシュ',
    'サム',
    'ハンク',
    'バスター',
    'バズ',
    'ダグ',
    'メグ',
    'ドラコ'
  ],
  
  assassin: [
    'メロディー',
    'ストゥー',
    'ケンジ',
    'シェイド',
    'クロウ',
    'モーティス',
    'リリー',
    'コーデリアス',
    'レオン',
    'ファング',
    'エドガー',
    'ミコ'
  ],
  
  support: [
    'ガス',
    'バイロン',
    'Max',
    'グレイ',
    'キット',
    'ラフス',
    'ベリー',
    'ポコ',
    'パム'
  ],
  
  controller: [
    'ジュジュ',
    'サンディ',
    'ペニー',
    'オーティス',
    'ジーン',
    'ルー',
    'ゲイル',
    'グリフ',
    'スクウィーク',
    'Emz',
    'チャック',
    'ミスターP',
    'チャーリー',
    'アンバー'
  ],
  
  thrower: [
    'ジュジュ',
    'ラリー&ローリー',
    'バーリー',
    'ティック',
    'ダイナマイク',
    'ウィロー',
    'スプラウト',
    'グロム'
  ],
  
  sniper: [
    'エリザベス',
    'マンディ',
    'ベル',
    'メイジー',
    'ビー',
    'チェスター',
    'ジャネット',
    'ナーニ',
    'ブロック',
    'ボニー'
  ],
  
  attacker: [
    'イヴ',
    'サージ',
    'リコ',
    'ニタ',
    'R-T',
    'ローラ',
    'コレット',
    'カール',
    'クランシー',
    'パール',
    'モー',
    'タラ',
    '8ビット',
    'コルト',
    'ジェシー',
    'スパイク',
    'シェリー'
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