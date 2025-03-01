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
    tickets: string; // 新しいチケットタブ
  };
  alerts: {
    update: {
      title: string;
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
      gacha: 'ガチャ',
      tickets: 'チケット'
    },
    alerts: {
      update: {
        title: 'アップデートが必要です',
        button: 'アップデート'
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
      gacha: 'Gacha',
      tickets: 'Tickets'
    },
    alerts: {
      update: {
        title: 'Update Required',
        button: 'Update'
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
      gacha: '가챠',
      tickets: '티켓'
    },
    alerts: {
      update: {
        title: '업데이트가 필요합니다',
        button: '업데이트'
      }
    }
  },
  es: {
    tabs: {
      home: 'Inicio',
      analysis: 'Análisis',
      team: 'Equipo',
      prediction: 'Predicción',
      rankings: 'Clasificación',
      news: 'Noticias',
      gacha: 'Gacha',
      tickets: 'Boletos'
    },
    alerts: {
      update: {
        title: 'Actualización Necesaria',
        button: 'Actualizar'
      }
    }
  },
  ar: {
    tabs: {
      home: 'الرئيسية',
      analysis: 'التحليل',
      team: 'الفريق',
      prediction: 'التوقع',
      rankings: 'التصنيفات',
      news: 'الأخبار',
      gacha: 'غاتشا',
      tickets: 'تذاكر'
    },
    alerts: {
      update: {
        title: 'تحديث مطلوب',
        button: 'تحديث'
      }
    }
  },
  fr: {
    tabs: {
      home: 'Accueil',
      analysis: 'Analyse',
      team: 'Équipe',
      prediction: 'Prédiction',
      rankings: 'Classements',
      news: 'Actualités',
      gacha: 'Gacha',
      tickets: 'Tickets'
    },
    alerts: {
      update: {
        title: 'Mise à jour requise',
        button: 'Mettre à jour'
      }
    }
  },
  zhTw: {
    tabs: {
      home: '首頁',
      analysis: '分析',
      team: '組隊',
      prediction: '選角預測',
      rankings: '排行榜',
      news: '新聞',
      gacha: '轉蛋',
      tickets: '票券'
    },
    alerts: {
      update: {
        title: '需要更新',
        button: '更新'
      }
    }
  }
};

export const useAppTranslation = () => {
  const { currentLanguage } = useSettingsScreenTranslation();
  const t = translations[currentLanguage] || translations.en;
  return { t, currentLanguage };
};