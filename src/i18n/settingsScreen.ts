export type SettingsScreenTranslation = {
  header: {
    settings: string;
    privacy: string;
    terms: string;
    allTips: string;
  };
  menuItems: {
    language: string;
    share: string;
    removeAds: string;
    adsRemoved: string;
    supportSmall: string;
    supportLarge: string;
    supportLargeLoading: string;
    rateApp: string;
    privacy: string;
    terms: string;
    allTips: string;
    punishmentGame: string;
  };
  purchase: {
    title: string;
    message: string;
    cancel: string;
    confirm: string;
    complete: string;
    errors: {
      failed: string;
      alreadyOwned: string;
      notPrepared: string;
      notAvailable: string;
      default: string;
      storeConnect: string;
    };
    restore: {
      success: string;
      notFound: string;
      error: string;
    };
  };
  ads: {
    showError: string;
    rewardError: string;
  };
  sale: {
    label: string;
  };
};

export const ja: SettingsScreenTranslation = {
  header: {
    settings: '設定',
    privacy: 'プライバシーポリシー',
    terms: '利用規約',
    allTips: '豆知識一覧',
  },
  menuItems: {
    language: '言語設定',
    share: '友達に共有する',
    removeAds: '広告を削除',
    adsRemoved: '広告削除済み',
    supportSmall: '広告を見て支援する（小）',
    supportLarge: '広告を見て支援する（大）',
    supportLargeLoading: '広告を見て支援する（大） (準備中)',
    rateApp: 'アプリを評価する',
    privacy: 'プライバシーポリシー',
    terms: '利用規約',
    allTips: '豆知識一覧',
    punishmentGame: '罰ゲーム',
  },
  purchase: {
    title: '広告削除の購入',
    message: 'リリース記念セール中！\n通常{originalPrice}→{salePrice}で広告を完全に削除します。\n購入を続けますか？',
    cancel: 'キャンセル',
    confirm: '購入する',
    complete: '広告の削除が完了しました！',
    errors: {
      failed: '購入処理に失敗しました。',
      alreadyOwned: 'すでに購入済みです。購入の復元をお試しください。',
      notPrepared: 'ストアとの接続に失敗しました。後でもう一度お試しください。',
      notAvailable: '現在この商品は購入できません。',
      default: '購入処理中にエラーが発生しました。({code})',
      storeConnect: 'App Storeに接続できません',
    },
    restore: {
      success: '広告削除の購入を復元しました！',
      notFound: '復元可能な購入が見つかりませんでした。',
      error: '購入の復元に失敗しました。',
    },
  },
  ads: {
    showError: '広告の表示に失敗しました。',
    rewardError: 'リワード広告の表示に失敗しました。',
  },
  sale: {
    label: 'リリース記念セール',
  },
};

export const en: SettingsScreenTranslation = {
  header: {
    settings: 'Settings',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    allTips: 'All Tips',
  },
  menuItems: {
    language: 'Language Settings',
    share: 'Share with Friends',
    removeAds: 'Remove Ads',
    adsRemoved: 'Ads Removed',
    supportSmall: 'Support with Ad (Small)',
    supportLarge: 'Support with Ad (Large)',
    supportLargeLoading: 'Support with Ad (Large) (Loading...)',
    rateApp: 'Rate App',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    allTips: 'All Tips',
    punishmentGame: 'Punishment Game',
  },
  purchase: {
    title: 'Remove Ads',
    message: 'Release Sale!\nRemove all ads for {salePrice} instead of {originalPrice}.\nWould you like to continue?',
    cancel: 'Cancel',
    confirm: 'Purchase',
    complete: 'Ads have been successfully removed!',
    errors: {
      failed: 'Purchase failed.',
      alreadyOwned: 'Already purchased. Please try restoring your purchase.',
      notPrepared: 'Failed to connect to the store. Please try again later.',
      notAvailable: 'This item is currently unavailable.',
      default: 'An error occurred during purchase. ({code})',
      storeConnect: 'Cannot connect to App Store',
    },
    restore: {
      success: 'Ad removal purchase restored!',
      notFound: 'No restorable purchases found.',
      error: 'Failed to restore purchase.',
    },
  },
  ads: {
    showError: 'Failed to display ad.',
    rewardError: 'Failed to display reward ad.',
  },
  sale: {
    label: 'Release Sale',
  },
};

export const ko: SettingsScreenTranslation = {
  header: {
    settings: '설정',
    privacy: '개인정보 처리방침',
    terms: '이용약관',
    allTips: '모든 팁',
  },
  menuItems: {
    language: '언어 설정',
    share: '친구에게 공유',
    removeAds: '광고 제거',
    adsRemoved: '광고 제거됨',
    supportSmall: '광고로 지원하기 (소)',
    supportLarge: '광고로 지원하기 (대)',
    supportLargeLoading: '광고로 지원하기 (대) (로딩 중)',
    rateApp: '앱 평가하기',
    privacy: '개인정보 처리방침',
    terms: '이용약관',
    allTips: '모든 팁',
    punishmentGame: '벌칙 게임',
  },
  purchase: {
    title: '광고 제거',
    message: '출시 기념 세일!\n일반가 {originalPrice}→{salePrice}로 모든 광고를 제거합니다.\n구매를 계속하시겠습니까?',
    cancel: '취소',
    confirm: '구매',
    complete: '광고가 성공적으로 제거되었습니다!',
    errors: {
      failed: '구매에 실패했습니다.',
      alreadyOwned: '이미 구매한 상품입니다. 구매 복원을 시도해주세요.',
      notPrepared: '스토어 연결에 실패했습니다. 나중에 다시 시도해주세요.',
      notAvailable: '현재 이 상품은 구매할 수 없습니다.',
      default: '구매 중 오류가 발생했습니다. ({code})',
      storeConnect: 'App Store에 연결할 수 없습니다',
    },
    restore: {
      success: '광고 제거 구매가 복원되었습니다!',
      notFound: '복원 가능한 구매를 찾을 수 없습니다.',
      error: '구매 복원에 실패했습니다.',
    },
  },
  ads: {
    showError: '광고 표시에 실패했습니다.',
    rewardError: '리워드 광고 표시에 실패했습니다.',
  },
  sale: {
    label: '출시 기념 세일',
  },
};

export const settingsScreenTranslations = {
  ja,
  en,
  ko,
} as const;

export type Language = keyof typeof settingsScreenTranslations;

import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useSettingsScreenTranslation() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('ja');

  useEffect(() => {
    const getLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
        if (savedLanguage && (savedLanguage in settingsScreenTranslations)) {
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
        if (savedLanguage && savedLanguage !== currentLanguage && (savedLanguage in settingsScreenTranslations)) {
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
    t: settingsScreenTranslations[currentLanguage],
    currentLanguage,
  };
}