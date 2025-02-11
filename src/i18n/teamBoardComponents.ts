
// src/i18n/teamBoardComponents.ts

export type TeamBoardComponentsTranslation = {
  // PostCard用の翻訳
  postCard: {
    time: {
      justNow: string;
      minutesAgo: string;
      hoursAgo: string;
    };
    recruiting: {
      mid: string;
      side: string;
    };
    hostInfo: {
      title: string;
      totalTrophies: string;
      wins3v3: string;
      winsDuo: string;
      useChar: string;
    };
    comment: {
      title: string;
    };
    joinTeam: {
      title: string;
      message: string;
      cancel: string;
      join: string;
    };
    errors: {
      cannotOpen: string;
      openError: string;
    };
  };
  // 将来的な他のコンポーネント用の翻訳をここに追加
};

// 日本語翻訳
export const ja: TeamBoardComponentsTranslation = {
  postCard: {
    time: {
      justNow: 'たった今',
      minutesAgo: '分前',
      hoursAgo: '時間前'
    },
    recruiting: {
      mid: 'ミッド募集',
      side: 'サイド募集'
    },
    hostInfo: {
      title: 'ホスト情報',
      totalTrophies: '総合トロ',
      wins3v3: '3vs3勝利数',
      winsDuo: 'デュオ勝利数',
      useChar: '使用キャラ'
    },
    comment: {
      title: 'ひとこと'
    },
    joinTeam: {
      title: 'チーム参加の確認',
      message: 'チームリンクに参加しますか？',
      cancel: 'キャンセル',
      join: '参加する'
    },
    errors: {
      cannotOpen: 'このリンクを開けません',
      openError: 'リンクを開く際にエラーが発生しました'
    }
  }
};

// 英語翻訳
export const en: TeamBoardComponentsTranslation = {
  postCard: {
    time: {
      justNow: 'Just now',
      minutesAgo: 'm ago',
      hoursAgo: 'h ago'
    },
    recruiting: {
      mid: 'Mid Recruiting',
      side: 'Side Recruiting'
    },
    hostInfo: {
      title: 'Host Info',
      totalTrophies: 'Total Trophies',
      wins3v3: '3v3 Wins',
      winsDuo: 'Duo Wins',
      useChar: 'Using'
    },
    comment: {
      title: 'Comment'
    },
    joinTeam: {
      title: 'Join Team',
      message: 'Would you like to join this team?',
      cancel: 'Cancel',
      join: 'Join'
    },
    errors: {
      cannotOpen: 'Cannot open this link',
      openError: 'Error occurred while opening the link'
    }
  }
};

// 韓国語翻訳
export const ko: TeamBoardComponentsTranslation = {
  postCard: {
    time: {
      justNow: '방금',
      minutesAgo: '분 전',
      hoursAgo: '시간 전'
    },
    recruiting: {
      mid: '미드 모집',
      side: '사이드 모집'
    },
    hostInfo: {
      title: '호스트 정보',
      totalTrophies: '총 트로피',
      wins3v3: '3대3 승리',
      winsDuo: '듀오 승리',
      useChar: '사용 캐릭터'
    },
    comment: {
      title: '코멘트'
    },
    joinTeam: {
      title: '팀 참가',
      message: '이 팀에 참가하시겠습니까?',
      cancel: '취소',
      join: '참가'
    },
    errors: {
      cannotOpen: '링크를 열 수 없습니다',
      openError: '링크를 여는 중 오류가 발생했습니다'
    }
  }
};

// 翻訳オブジェクトをまとめたもの
export const teamBoardComponentsTranslations = {
  ja,
  en,
  ko
} as const;

// 言語タイプの定義
export type Language = keyof typeof teamBoardComponentsTranslations;

// カスタムフック
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useTeamBoardComponentsTranslation() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('ja');

  useEffect(() => {
    const getLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
        if (savedLanguage && (savedLanguage in teamBoardComponentsTranslations)) {
          setCurrentLanguage(savedLanguage as Language);
        }
      } catch (error) {
        console.error('Failed to get language setting:', error);
      }
    };

    getLanguage();

    const watchLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
        if (savedLanguage && savedLanguage !== currentLanguage && (savedLanguage in teamBoardComponentsTranslations)) {
          setCurrentLanguage(savedLanguage as Language);
        }
      } catch (error) {
        console.error('Failed to watch language setting:', error);
      }
    };

    const interval = setInterval(watchLanguage, 1000);
    return () => clearInterval(interval);
  }, [currentLanguage]);

  return {
    t: teamBoardComponentsTranslations[currentLanguage],
    currentLanguage
  };
}