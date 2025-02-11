import { CharacterData, RankingItem } from '../types/types';
import { useCharacterRolesTranslation } from '../i18n/characterRoles';

interface CustomRankingConfig {
  [role: string]: {
    characters: string[];
    key: keyof CharacterRolesTranslation['roles']; // 翻訳キーを追加
  };
}

const roleSpecificRankings: CustomRankingConfig = {
  all: {
    key: 'all',
    characters: [
      'ストゥー',　'メロディー', 'ジュジュ', 'ガス', 'ベリー', 'ルー', 'フランケン', 'ペニー', 'サージ', 'R-T', 'リコ', 'エリザベス', 'Max', 
      'サンディ', 'ダリル', 'グレイ', 'バスター', 'イヴ', 'ラリー&ローリー', 'ドラコ', 'ケンジ', 'アンジェロ', 'コレット', 'ベル', 'バイロン', 
      'オーティス', 'キット', 'ジーン', 'カール', 'アッシュ', 'ニタ', 'コーデリアス', 'シェイド', 'メイジー', 'アンバー', 'ビー', 'パール', 
      'ローラ', 'マンディ', 'オーリー', 'ジェシー', 'グリフ', 'モーティス', 'ラフス', 'クロウ', 'コルト', 'バーリー', 'ジャネット', 'リリー', 
      'ミープル', 'ナーニ', 'タラ', 'バズ', 'ゲイル', 'ジャッキー', 'チャック', 'レオン', 'ダイナマイク', 'ティック', 'ウィロー', 'ブロック', 
      'スパイク', 'Emz', '8ビット', 'チェスター', 'ビビ', 'モー', 'ポコ', 'クランシー', 'ローサ', 'スクウィーク', 'チャーリー', 'メグ', 
      'ハンク', 'ファング', 'ボウ', 'ボニー', 'エルプリモ', 'シェリー', 'パム', 'サム', 'スプラウト', 'エドガー', 'ミスターP', 'ダグ', 'グロム', 
      'ミコ', 'ブル'
    ]
  },
  tank: {
    key: 'tank',
    characters: [
      'ブル', 'エルプリモ', 'ローサ', 'ダリル', 'ジャッキー', 　'フランケン', 'ビビ', 'アッシュ', 
      'ハンク', 'バスター', 'オーリー', 'メグ', 'ドラコ',
    ]
  },
  assassin: {
    key: 'assassin',
    characters: [
      'ストゥー', 'エドガー', 'サム', 'シェイド', 'モーティス','バズ', 'ファング', 'ミコ', 'メロディー', 
      'リリー', 'クロウ', 'レオン', 'コーデリアス', 'ケンジ', 
    ]
  },
  support: {
    key: 'support',
    characters: [
      'ポコ', 'ガス', 'パム', 'ベリー', 'Max', 'バイロン', 'ラフス', 'グレイ', 'ダグ', 'キット'
    ]
  },
  controller: {
    key: 'controller',
    characters: [
      'ジェシー', 'ペニー', 'ボウ', 'Emz', 'グリフ', 'ゲイル',  'ミープル', 'ジーン', 'ミスターP', 'スクウィーク',
      'ルー', 'オーティス', 'ウィロー', 'チャック', 'チャーリー', 'サンディ', 'アンバー'
    ]
  },
  attacker: { 
    key: 'attacker',
    characters: [
      'シェリー', 'ニタ', 'コルト', '8ビット', 'リコ', 'カール', 'コレット', 'ローラ', 'パール', 'タラ',
      'イヴ', 'R-T', 'クランシー', 'モー', 'スパイク', 'サージ', 'チェスター'
    ]
  },
  sniper: {
    key: 'sniper',
    characters: [
      'ブロック', 'エリザベス', 'ビー', 'ナーニ', 'ボニー',
      'ベル', 'マンディ', 'メイジー', 'アンジェロ', 'ジャネット',
    ]
  },
  grenadier: {
    key: 'grenadier',
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

// getRoleDisplayName関数を更新
export const getRoleDisplayName = (role: string): string => {
  const { t } = useCharacterRolesTranslation();
  const roleConfig = roleSpecificRankings[role];
  if (!roleConfig) return role;
  return t.roles[roleConfig.key];
};

export const getAllRoles = (): string[] => {
  return Object.keys(roleSpecificRankings);
};

// 検証関数は変更なし
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