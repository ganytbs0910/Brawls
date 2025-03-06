// src/i18n/developerInfoScreen.ts
export type DeveloperInfoTranslation = {
  title: string;
  description: string;
  contact: {
    twitter: string;
    twitterUrl: string;
    youtube: string;
    youtubeUrl: string;
    email: string;
    emailAddress: string;
  };
  appVersion: string;
  lastUpdated: string;
};

export const ja: DeveloperInfoTranslation = {
  title: '開発者について',
  description: 'どうも開発者です。\nSupercellの公認です。\nBrawlStarsの実況をしている日本人です。\nブロスタがより活発になれるようなアプリを作成しています。',
  contact: {
    twitter: 'Twitter:',
    twitterUrl: 'https://x.com/Gan_tonanoru',
    youtube: 'YouTube:',
    youtubeUrl: 'https://www.youtube.com/@gan8728',
    email: 'メール:',
    emailAddress: 'ganytbs@gmail.com'
  },
  appVersion: 'アプリバージョン: 1.2.0',
  lastUpdated: '最終更新日: 2025年3月6日'
};

export const en: DeveloperInfoTranslation = {
  title: 'About Developer',
  description: 'Hello, I\'m the developer. I\'m a Japanese Brawl Stars streamer officially recognized by Supercell.\nI\'m creating apps to make Brawl Stars more vibrant and active.',
  contact: {
    twitter: 'Twitter:',
    twitterUrl: 'https://x.com/Gan_tonanoru',
    youtube: 'YouTube:',
    youtubeUrl: 'https://www.youtube.com/@gan8728',
    email: 'Email:',
    emailAddress: 'ganytbs@gmail.com'
  },
  appVersion: 'App Version: 1.2.0',
  lastUpdated: 'Last Updated: March 6, 2025'
};

export const ko: DeveloperInfoTranslation = {
  title: '개발자 정보',
  description: '안녕하세요, 개발자입니다. 저는 Supercell에서 공식 인정받은 일본인 Brawl Stars 스트리머입니다.\nBrawl Stars가 더 활발해질 수 있도록 앱을 만들고 있습니다.',
  contact: {
    twitter: '트위터:',
    twitterUrl: 'https://x.com/Gan_tonanoru',
    youtube: '유튜브:',
    youtubeUrl: 'https://www.youtube.com/@gan8728',
    email: '이메일:',
    emailAddress: 'ganytbs@gmail.com'
  },
  appVersion: '앱 버전: 1.2.0',
  lastUpdated: '마지막 업데이트: 2025년 3월 6일'
};

export const es: DeveloperInfoTranslation = {
  title: 'Acerca del Desarrollador',
  description: 'Hola, soy el desarrollador. Soy un streamer japonés de Brawl Stars oficialmente reconocido por Supercell.\nEstoy creando aplicaciones para hacer que Brawl Stars sea más vibrante y activo.',
  contact: {
    twitter: 'Twitter:',
    twitterUrl: 'https://x.com/Gan_tonanoru',
    youtube: 'YouTube:',
    youtubeUrl: 'https://www.youtube.com/@gan8728',
    email: 'Correo:',
    emailAddress: 'ganytbs@gmail.com'
  },
  appVersion: 'Versión de la aplicación: 1.2.0',
  lastUpdated: 'Última actualización: 6 de marzo de 2025'
};

export const ar: DeveloperInfoTranslation = {
  title: 'حول المطور',
  description: 'مرحبًا، أنا المطور. أنا بث مباشر ياباني لـ Brawl Stars معترف به رسميًا من قبل Supercell.\nأقوم بإنشاء تطبيقات لجعل Brawl Stars أكثر حيوية ونشاطًا.',
  contact: {
    twitter: 'تويتر:',
    twitterUrl: 'https://x.com/Gan_tonanoru',
    youtube: 'يوتيوب:',
    youtubeUrl: 'https://www.youtube.com/@gan8728',
    email: 'البريد الإلكتروني:',
    emailAddress: 'ganytbs@gmail.com'
  },
  appVersion: 'إصدار التطبيق: 1.2.0',
  lastUpdated: 'آخر تحديث: 6 مارس 2025'
};

export const fr: DeveloperInfoTranslation = {
  title: 'À propos du Développeur',
  description: 'Bonjour, je suis le développeur. Je suis un streamer japonais de Brawl Stars officiellement reconnu par Supercell.\nJe crée des applications pour rendre Brawl Stars plus dynamique et actif.',
  contact: {
    twitter: 'Twitter:',
    twitterUrl: 'https://x.com/Gan_tonanoru',
    youtube: 'YouTube:',
    youtubeUrl: 'https://www.youtube.com/@gan8728',
    email: 'Email:',
    emailAddress: 'ganytbs@gmail.com'
  },
  appVersion: 'Version de l\'application: 1.2.0',
  lastUpdated: 'Dernière mise à jour: 6 mars 2025'
};

export const zhTw: DeveloperInfoTranslation = {
  title: '關於開發者',
  description: '您好，我是開發者。我是一名受Supercell官方認可的日本Brawl Stars實況主。\n我正在創建應用程序，使Brawl Stars更加活躍。',
  contact: {
    twitter: 'Twitter:',
    twitterUrl: 'https://x.com/Gan_tonanoru',
    youtube: 'YouTube:',
    youtubeUrl: 'https://www.youtube.com/@gan8728',
    email: '電子郵件:',
    emailAddress: 'ganytbs@gmail.com'
  },
  appVersion: '應用版本: 1.2.0',
  lastUpdated: '最後更新: 2025年3月6日'
};

export const developerInfoTranslations = {
  ja,
  en,
  ko,
  es,
  ar,
  fr,
  zhTw,
} as const;

export type Language = keyof typeof developerInfoTranslations;

import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useDeveloperInfoTranslation() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('ja');

  useEffect(() => {
    const getLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
        if (savedLanguage && (savedLanguage in developerInfoTranslations)) {
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
        if (savedLanguage && savedLanguage !== currentLanguage && (savedLanguage in developerInfoTranslations)) {
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
    t: developerInfoTranslations[currentLanguage],
    currentLanguage,
  };
}