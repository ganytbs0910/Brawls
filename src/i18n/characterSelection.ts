// src/i18n/characterSelection.ts

export type CharacterSelectionTranslation = {
  advantage: {
    title: string;
    teamScore: (team: string) => string;
    winningProbability: (team: string) => string;
  };
  recommendations: {
    title: string;
    showMore: (count: number) => string;
    close: string;
    rank: (index: number) => string;
  };
};

// 日本語翻訳
export const ja: CharacterSelectionTranslation = {
  advantage: {
    title: 'チーム相性分析',
    teamScore: (team: string) => `チーム${team}編成得点: `,
    winningProbability: (team: string) => `チーム${team}の勝利確率: `,
  },
  recommendations: {
    title: 'おすすめキャラクター',
    showMore: (count: number) => `さらに表示 (${count}体)`,
    close: '閉じる',
    rank: (index: number) => `#${index + 1}`,
  }
};

// 英語翻訳
export const en: CharacterSelectionTranslation = {
  advantage: {
    title: 'Team Compatibility Analysis',
    teamScore: (team: string) => `Team ${team} Score: `,
    winningProbability: (team: string) => `Team ${team} Win Rate: `,
  },
  recommendations: {
    title: 'Recommended Characters',
    showMore: (count: number) => `Show More (${count})`,
    close: 'Close',
    rank: (index: number) => `#${index + 1}`,
  }
};

// 韓国語翻訳
export const ko: CharacterSelectionTranslation = {
  advantage: {
    title: '팀 상성 분석',
    teamScore: (team: string) => `팀 ${team} 점수: `,
    winningProbability: (team: string) => `팀 ${team} 승률: `,
  },
  recommendations: {
    title: '추천 캐릭터',
    showMore: (count: number) => `더 보기 (${count}명)`,
    close: '닫기',
    rank: (index: number) => `#${index + 1}`,
  }
};