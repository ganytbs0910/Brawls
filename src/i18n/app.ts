import { useSettingsScreenTranslation } from './settingsScreen';

type AppTranslations = {
  tabs: {
    home: string;
    analysis: string;
    team: string;
    prediction: string;
    rankings: string;
    news: string;
    gacha: string;
  };
  alerts: {
    update: {
      title: string;
      button: string;
    };
    loginBonus: {
      title: string;
      message: string;
      button: string;
    };
  };
};

const translations: Record<string, AppTranslations> = {
  ja: {
    tabs: {
      home: 'ホーム',
      analysis: '分析',
      team: 'チーム募集',
      prediction: 'ピック想定',
      rankings: 'ランキング',
      news: 'ニュース',
      gacha: 'ガチャ'
    },
    alerts: {
      update: {
        title: 'アップデートが必要です',
        button: 'アップデート'
      },
      loginBonus: {
        title: 'ログインボーナス！',
        message: 'デイリーガチャチケット1枚をプレゼント！',
        button: 'OK'
      }
    }
  },
  en: {
    tabs: {
      home: 'Home',
      analysis: 'Analysis',
      team: 'Team',
      prediction: 'Pick',
      rankings: 'Rankings',
      news: 'News',
      gacha: 'Gacha'
    },
    alerts: {
      update: {
        title: 'Update Required',
        button: 'Update'
      },
      loginBonus: {
        title: 'Login Bonus!',
        message: 'You received 1 Daily Gacha Ticket!',
        button: 'OK'
      }
    }
  },
  ko: {
    tabs: {
      home: '홈',
      analysis: '분석',
      team: '팀 모집',
      prediction: '픽 예상',
      rankings: '랭킹',
      news: '뉴스',
      gacha: '가챠'
    },
    alerts: {
      update: {
        title: '업데이트가 필요합니다',
        button: '업데이트'
      },
      loginBonus: {
        title: '로그인 보너스!',
        message: '데일리 가챠 티켓 1장을 받았습니다!',
        button: '확인'
      }
    }
  }
};

export const useAppTranslation = () => {
  const { currentLanguage } = useSettingsScreenTranslation();
  const t = translations[currentLanguage] || translations.en;
  return { t, currentLanguage };
};