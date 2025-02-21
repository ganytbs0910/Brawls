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
  },
  es: {
    tabs: {
      home: 'Inicio',
      analysis: 'Análisis',
      team: 'Equipo',
      prediction: 'Predicción',
      rankings: 'Clasificación',
      news: 'Noticias',
      gacha: 'Gacha'
    },
    alerts: {
      update: {
        title: 'Actualización Necesaria',
        button: 'Actualizar'
      },
      loginBonus: {
        title: '¡Bono de Inicio de Sesión!',
        message: '¡Has recibido 1 Ticket de Gacha Diario!',
        button: 'Aceptar'
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
      gacha: 'غاتشا'
    },
    alerts: {
      update: {
        title: 'تحديث مطلوب',
        button: 'تحديث'
      },
      loginBonus: {
        title: 'مكافأة تسجيل الدخول!',
        message: 'لقد استلمت تذكرة غاتشا يومية واحدة!',
        button: 'موافق'
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
      gacha: 'Gacha'
    },
    alerts: {
      update: {
        title: 'Mise à jour requise',
        button: 'Mettre à jour'
      },
      loginBonus: {
        title: 'Bonus de connexion !',
        message: 'Vous avez reçu 1 Ticket Gacha Quotidien !',
        button: 'OK'
      }
    }
  },
  'zh-tw': {
    tabs: {
      home: '首頁',
      analysis: '分析',
      team: '組隊',
      prediction: '選角預測',
      rankings: '排行榜',
      news: '新聞',
      gacha: '轉蛋'
    },
    alerts: {
      update: {
        title: '需要更新',
        button: '更新'
      },
      loginBonus: {
        title: '登入獎勵！',
        message: '獲得1張每日轉蛋券！',
        button: '確定'
      }
    }
  }
};

export const useAppTranslation = () => {
  const { currentLanguage } = useSettingsScreenTranslation();
  const t = translations[currentLanguage] || translations.en;
  return { t, currentLanguage };
};