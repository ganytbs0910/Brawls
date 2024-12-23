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
    'ローサ',
    'ダリル',
    'ブル',
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
    'ストゥー',
    'ビビ',
    'ベリー'
  ],
  
  support: [
    'ポコ',
    'パム',
    'バイロン',
    'Max',
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
    'エリザベス',
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
    'ミスターP',
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