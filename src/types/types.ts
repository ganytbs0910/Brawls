export interface CharacterCompatibility {
  id: number;
  name: string;
  compatibilityScores: {
    [characterName: string]: number;  // キャラクター名と相性スコア（1-10）のマッピング
  };
  explanation?: {
    [characterName: string]: string;  // 特に説明が必要な相性の理由を記載
  };
}