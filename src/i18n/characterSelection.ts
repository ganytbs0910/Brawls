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

// アラビア語翻訳
export const ar: CharacterSelectionTranslation = {
  advantage: {
    title: 'تحليل توافق الفريق',
    teamScore: (team: string) => `نقاط الفريق ${team}: `,
    winningProbability: (team: string) => `معدل فوز الفريق ${team}: `,
  },
  recommendations: {
    title: 'الشخصيات المُوصى بها',
    showMore: (count: number) => `عرض المزيد (${count})`,
    close: 'إغلاق',
    rank: (index: number) => `#${index + 1}`,
  }
};

// フランス語翻訳
export const fr: CharacterSelectionTranslation = {
  advantage: {
    title: 'Analyse de Compatibilité d\'Équipe',
    teamScore: (team: string) => `Score de l'équipe ${team}: `,
    winningProbability: (team: string) => `Taux de victoire de l'équipe ${team}: `,
  },
  recommendations: {
    title: 'Personnages Recommandés',
    showMore: (count: number) => `Voir plus (${count})`,
    close: 'Fermer',
    rank: (index: number) => `#${index + 1}`,
  }
};

// スペイン語翻訳
export const es: CharacterSelectionTranslation = {
  advantage: {
    title: 'Análisis de Compatibilidad del Equipo',
    teamScore: (team: string) => `Puntuación del equipo ${team}: `,
    winningProbability: (team: string) => `Tasa de victoria del equipo ${team}: `,
  },
  recommendations: {
    title: 'Personajes Recomendados',
    showMore: (count: number) => `Mostrar más (${count})`,
    close: 'Cerrar',
    rank: (index: number) => `#${index + 1}`,
  }
};

export const zhTw: CharacterSelectionTranslation = {
  advantage: {
    title: '隊伍相性分析',
    teamScore: (team: string) => `${team}隊伍評分：`,
    winningProbability: (team: string) => `${team}隊伍勝率：`,
  },
  recommendations: {
    title: '推薦角色',
    showMore: (count: number) => `顯示更多 (${count}個)`,
    close: '關閉',
    rank: (index: number) => `#${index + 1}`,
  }
};

// 翻訳オブジェクトをまとめたもの
export const characterSelectionTranslations = {
  ja,
  en,
  ko,
  ar,
  fr,
  es,
  zhTw // 台湾語を追加
} as const;

// 言語タイプの定義
export type Language = keyof typeof characterSelectionTranslations;