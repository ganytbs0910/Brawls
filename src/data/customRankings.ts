//customRankings.ts
import { CharacterData, RankingItem } from '../types/types';

interface CustomRankingConfig {
  [role: string]: {
    characters: string[];
    displayName: string;
  };
}

const roleSpecificRankings: CustomRankingConfig = {
  all: {
    displayName: "すべて",
    characters: [
      'ストゥー',　'メロディー', 'ジュジュ', 'フランケン', 'ダリル', 'イヴ', 'シェイド', 
      'サージ', 'ケンジ', 'ガス', 'バイロン', 'リコ', 'ペニー', 'Max', 'グレイ', 
      'コーデリアス', 'サンディ', 'ニタ', 'バスター', 'キット', 'ラリー&ローリー', 
      'アンジェロ', 'エリザベス', 'R-T', 'マンディ', 'オーティス', 'クロウ', 'モーティス', 
      'ベル', 'ジーン', 'ローラ', 'コレット', 'ドラコ', 'ルー', 'カール', 'ラフス', 
      'メイジー', 'クランシー', 'ビー', 'チェスター', 'アンバー', 'パール', 'アッシュ', 
      'ゲイル', 'ジャッキー', 'リリー', 'モー', 'グリフ', 'バーリー', 'ベリー', 'ティック', 
      'ダイナマイク', 'ウィロー', 'タラ', '8ビット', 'コルト', 'ジャネット', 'ナーニ', 
      'スクウィーク', 'ジェシー', 'バズ', 'Emz', 'エルプリモ', 'ビビ', 'スパイク', 'ローサ', 
      'チャック', 'レオン', 'メグ', 'ポコ', 'シェリー', 'ブロック', 'ハンク', 'ボニー', 
      'パム', 'チャーリー', 'ボウ', 'サム', 'スプラウト', 'ファング', 'エドガー', 'ブル', 
      'グロム', 'ミスターP', 'ダグ', 'ミコ'
    ]
  },
  tank: {
    displayName: "タンク",
    characters: [
      'ブル', 'エルプリモ', 'ローサ', 'ダリル', 'ジャッキー', 
      'フランケン', 'ビビ', 'アッシュ', 'ハンク', 'バスター', 'メグ', 'ドラコ'
    ]
  },
  assassin: {
    displayName: "アサシン",
    characters: [
      'ストゥー', 'エドガー', 'サム', 'シェイド', 'モーティス',
      'バズ', 'ファング', 'ミコ', 'メロディー', 'リリー',
      'クロウ', 'レオン', 'コーデリアス', 'ケンジ', 
    ]
  },
  support: {
    displayName: "サポート",
    characters: [
      'ポコ', 'ガス', 'パム', 'ベリー', 'Max',
      'バイロン', 'ラフス', 'グレイ', 'ダグ', 'キット'
    ]
  },
  controller: {
    displayName: "コントローラー",
    characters: [
      'ジェシー', 'ペニー', 'ボウ', 'Emz', 'グリフ',
      'ゲイル', 'ジーン', 'ミスターP', 'スクウィーク',
      'ルー', 'オーティス', 'ウィロー', 'チャック',
      'チャーリー', 'サンディ', 'アンバー',
    ]
  },
  fighter: {
    displayName: "ファイター",
    characters: [
      'サージ', 'シェイド', 'ダリル', 'モーティス', 'エドガー',
      'バイロン', 'ファング', 'ビビ', 'ガス', 'クロウ'
    ]
  },
  attacker: { 
    displayName: "アタッカー",
    characters: [
      'シェリー', 'ニタ', 'コルト', '8ビット', 'リコ',
      'カール', 'コレット', 'ローラ', 'パール', 'タラ',
      'イヴ', 'R-T', 'クランシー', 'モー', 'スパイク',
      'サージ', 'チェスター'
    ]
  },
  sniper: {
    displayName: "スナイパー",
    characters: [
      'ブロック', 'エリザベス', 'ビー', 'ナーニ', 'ボニー',
      'ベル', 'マンディ', 'メイジー', 'アンジェロ', 'ジャネット',
    ]
  },
  grenadier: {
    displayName: "グレネーディア",
    characters: [
      'バーリー', 'ダイナマイク', 'ティック', 'グロム',
      'ラリー&ローリー', 'スプラウト', 'ジュジュ',
    ]
  },
};

export const generateCustomRankings = (
  characters: Record<string, CharacterData>,
  selectedType: string
): RankingItem[] => {
  const roleConfig = roleSpecificRankings[selectedType];
  
  if (!roleConfig) {
    console.warn(`Invalid ranking type: ${selectedType}`);
    return [];
  }

  const allRankMap = new Map(
    roleSpecificRankings.all.characters.map((char, index) => [char, index])
  );

  return roleConfig.characters
    .sort((a, b) => {
      const rankA = allRankMap.get(a) ?? Infinity;
      const rankB = allRankMap.get(b) ?? Infinity;
      return rankA - rankB;
    })
    .map((charName, index) => {
      const char = characters[charName];
      return {
        rank: index + 1,
        characterName: charName,
        description: char?.description || `Description for ${charName} not found`
      };
    });
};

export const getRoleDisplayName = (role: string): string => {
  return roleSpecificRankings[role]?.displayName || role;
};

export const getAllRoles = (): string[] => {
  return Object.keys(roleSpecificRankings);
};

export const validateRankings = (): void => {
  const allCharacters = new Set(roleSpecificRankings.all.characters);
  
  Object.entries(roleSpecificRankings).forEach(([role, config]) => {
    if (role === 'all') return;
    
    config.characters.forEach(char => {
      if (!allCharacters.has(char)) {
        console.warn(`Character ${char} in ${role} role is not in the all list`);
      }
    });
  });
};

export const checkDuplicatesByRole = (): void => {
  Object.entries(roleSpecificRankings).forEach(([role, config]) => {
    const seen = new Set<string>();
    config.characters.forEach(char => {
      if (seen.has(char)) {
        console.warn(`Duplicate character ${char} found in ${role} role`);
      }
      seen.add(char);
    });
  });
};

validateRankings();
checkDuplicatesByRole();