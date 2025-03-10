export type SettingsScreenTranslation = {
  header: {
    settings: string;
    privacy: string;
    terms: string;
    allTips: string;
    roulette: string;
    news: string;
    developer: string; // 追加：開発者情報ヘッダー
  };
  menuItems: {
    language: string;
    share: string;
    removeAds: string;
    adsRemoved: string;
    rateApp: string;
    privacy: string;
    terms: string;
    allTips: string;
    punishmentGame: string;
    roulette: string;
    news: string;
    developer: string; // 追加：開発者情報メニュー項目
  };
  roulette: {
    spin: string;
    spinning: string;
  };
  purchase: {
    title: string;
    message: string;
    cancel: string;
    confirm: string;
    complete: string;
    priceDisplay: string;
    productName: string;
    errors: {
      failed: string;
      alreadyOwned: string;
      notPrepared: string;
      notAvailable: string;
      default: string;
      storeConnect: string;
    };
    restore: {
      button: string; // 追加：復元ボタンのテキスト
      success: string;
      notFound: string;
      error: string;
    };
  };
  ads: {
    showError: string;
    rewardError: string;
  };
  share: {
    message: string;
    title: string;
    dialogTitle: string;
  };
};

export const ja: SettingsScreenTranslation = {
  header: {
    settings: '設定',
    privacy: 'プライバシーポリシー',
    terms: '利用規約',
    allTips: '豆知識一覧',
    roulette: 'キャラクタールーレット',
    news: 'YouTubeニュース',
    developer: '開発者について', // 追加
  },
  menuItems: {
    language: '言語設定',
    share: '友達に共有する',
    removeAds: '広告を削除',
    adsRemoved: '広告削除済み',
    rateApp: 'アプリを評価する',
    privacy: 'プライバシーポリシー',
    terms: '利用規約',
    allTips: '豆知識一覧',
    punishmentGame: '罰ゲーム',
    roulette: 'キャラクタールーレット',
    news: 'YouTubeニュース',
    developer: '開発者について', // 追加
  },
  roulette: {
    spin: 'スピン！',
    spinning: 'スピン中...',
  },
  purchase: {
    title: '広告削除の購入',
    message: '{price}で広告を完全に削除します。\n購入を続けますか？',
    cancel: 'キャンセル',
    confirm: '購入する',
    complete: '広告の削除が完了しました！',
    priceDisplay: '¥800',
    productName: '広告削除パック',
    errors: {
      failed: '購入処理に失敗しました。',
      alreadyOwned: 'すでに購入済みです。購入の復元をお試しください。',
      notPrepared: 'ストアとの接続に失敗しました。後でもう一度お試しください。',
      notAvailable: '現在この商品は購入できません。',
      default: '購入処理中にエラーが発生しました。({code})',
      storeConnect: 'App Storeに接続できません',
    },
    restore: {
      button: '購入を復元する', // 追加
      success: '広告削除の購入を復元しました！',
      notFound: '復元可能な購入が見つかりませんでした。',
      error: '購入の復元に失敗しました。',
    },
  },
  ads: {
    showError: '広告の表示に失敗しました。',
    rewardError: 'リワード広告の表示に失敗しました。',
  },
  share: {
    message: 'ブロスタのマップ情報をチェックできるアプリ「Brawl Status」\n\nApp Storeからダウンロード：\n{appStoreUrl}',
    title: 'Brawl Status - ブロスタ攻略アプリ',
    dialogTitle: 'Brawl Statusを共有',
  },
};

export const en: SettingsScreenTranslation = {
  header: {
    settings: 'Settings',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    allTips: 'All Tips',
    roulette: 'Character Roulette',
    news: 'YouTube News',
    developer: 'About Developer', // 追加
  },
  menuItems: {
    language: 'Language Settings',
    share: 'Share with Friends',
    removeAds: 'Remove Ads',
    adsRemoved: 'Ads Removed',
    rateApp: 'Rate App',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    allTips: 'All Tips',
    punishmentGame: 'Punishment Game',
    roulette: 'Character Roulette',
    news: 'YouTube News',
    developer: 'About Developer', // 追加
  },
  roulette: {
    spin: 'Spin!',
    spinning: 'Spinning...',
  },
  purchase: {
    title: 'Remove Ads',
    message: 'Remove ads completely for {price}.\nWould you like to continue?',
    cancel: 'Cancel',
    confirm: 'Purchase',
    complete: 'Ads have been successfully removed!',
    priceDisplay: '$4.99',
    productName: 'Ad Removal Pack',
    errors: {
      failed: 'Purchase failed.',
      alreadyOwned: 'Already purchased. Please try restoring your purchase.',
      notPrepared: 'Failed to connect to the store. Please try again later.',
      notAvailable: 'This item is currently unavailable.',
      default: 'An error occurred during purchase. ({code})',
      storeConnect: 'Cannot connect to App Store',
    },
    restore: {
      button: 'Restore Purchase', // 追加
      success: 'Ad removal purchase restored!',
      notFound: 'No restorable purchases found.',
      error: 'Failed to restore purchase.',
    },
  },
  ads: {
    showError: 'Failed to display ad.',
    rewardError: 'Failed to display reward ad.',
  },
  share: {
    message: 'Check Brawl Stars map information with "Brawl Status"\n\nDownload from App Store:\n{appStoreUrl}',
    title: 'Brawl Status - Brawl Stars Guide',
    dialogTitle: 'Share Brawl Status',
  },
};

export const ko: SettingsScreenTranslation = {
  header: {
    settings: '설정',
    privacy: '개인정보 처리방침',
    terms: '이용약관',
    allTips: '모든 팁',
    roulette: '캐릭터 룰렛',
    news: 'YouTube 뉴스',
    developer: '개발자 정보', // 추가
  },
  menuItems: {
    language: '언어 설정',
    share: '친구에게 공유',
    removeAds: '광고 제거',
    adsRemoved: '광고 제거됨',
    rateApp: '앱 평가하기',
    privacy: '개인정보 처리방침',
    terms: '이용약관',
    allTips: '모든 팁',
    punishmentGame: '벌칙 게임',
    roulette: '캐릭터 룰렛',
    news: 'YouTube 뉴스',
    developer: '개발자 정보', // 추가
  },
  roulette: {
    spin: '돌리기!',
    spinning: '돌리는 중...',
  },
  purchase: {
    title: '광고 제거',
    message: '{price}에 광고를 완전히 제거합니다\n계속하시겠습니까?',
    cancel: '취소',
    confirm: '구매',
    complete: '광고가 성공적으로 제거되었습니다!',
    priceDisplay: '₩5,500',
    productName: '광고 제거 팩',
    errors: {
      failed: '구매에 실패했습니다.',
      alreadyOwned: '이미 구매한 상품입니다. 구매 복원을 시도해주세요.',
      notPrepared: '스토어 연결에 실패했습니다. 나중에 다시 시도해주세요.',
      notAvailable: '현재 이 상품은 구매할 수 없습니다.',
      default: '구매 중 오류가 발생했습니다. ({code})',
      storeConnect: 'App Store에 연결할 수 없습니다',
    },
    restore: {
      button: '구매 복원', // 추가
      success: '광고 제거 구매가 복원되었습니다!',
      notFound: '복원 가능한 구매를 찾을 수 없습니다.',
      error: '구매 복원에 실패했습니다.',
    },
  },
  ads: {
    showError: '광고 표시에 실패했습니다.',
    rewardError: '리워드 광고 표시에 실패했습니다.',
  },
  share: {
    message: '브롤스타즈 맵 정보를 확인할 수 있는 앱 "Brawl Status"\n\nApp Store에서 다운로드：\n{appStoreUrl}',
    title: 'Brawl Status - 브롤스타즈 가이드',
    dialogTitle: 'Brawl Status 공유',
  },
};

// 他の言語も同様に追加
export const es: SettingsScreenTranslation = {
  header: {
    settings: 'Ajustes',
    privacy: 'Política de Privacidad',
    terms: 'Términos de Servicio',
    allTips: 'Todos los Consejos',
    roulette: 'Ruleta de Personajes',
    news: 'Noticias de YouTube',
    developer: 'Acerca del Desarrollador', // 追加
  },
  menuItems: {
    language: 'Configuración de Idioma',
    share: 'Compartir con Amigos',
    removeAds: 'Eliminar Anuncios',
    adsRemoved: 'Anuncios Eliminados',
    rateApp: 'Calificar App',
    privacy: 'Política de Privacidad',
    terms: 'Términos de Servicio',
    allTips: 'Todos los Consejos',
    punishmentGame: 'Juego de Castigo',
    roulette: 'Ruleta de Personajes',
    news: 'Noticias de YouTube',
    developer: 'Acerca del Desarrollador', // 追加
  },
  roulette: {
    spin: '¡Girar!',
    spinning: 'Girando...',
  },
  purchase: {
    title: 'Eliminar Anuncios',
    message: 'Eliminar anuncios completamente por {price}.\n¿Desea continuar?',
    cancel: 'Cancelar',
    confirm: 'Comprar',
    complete: '¡Los anuncios se han eliminado exitosamente!',
    priceDisplay: '€4.99',
    productName: 'Paquete de eliminación de anuncios',
    errors: {
      failed: 'La compra falló.',
      alreadyOwned: 'Ya comprado. Intente restaurar su compra.',
      notPrepared: 'Error al conectar con la tienda. Inténtelo más tarde.',
      notAvailable: 'Este artículo no está disponible actualmente.',
      default: 'Ocurrió un error durante la compra. ({code})',
      storeConnect: 'No se puede conectar con App Store',
    },
    restore: {
      button: 'Restaurar Compra', // 追加
      success: '¡Compra de eliminación de anuncios restaurada!',
      notFound: 'No se encontraron compras restaurables.',
      error: 'Error al restaurar la compra.',
    },
  },
  ads: {
    showError: 'Error al mostrar el anuncio.',
    rewardError: 'Error al mostrar el anuncio de recompensa.',
  },
  share: {
    message: 'Verifica la información de mapas de Brawl Stars con "Brawl Status"\n\nDescarga desde App Store:\n{appStoreUrl}',
    title: 'Brawl Status - Guía de Brawl Stars',
    dialogTitle: 'Compartir Brawl Status',
  },
};

export const ar: SettingsScreenTranslation = {
  header: {
    settings: 'الإعدادات',
    privacy: 'سياسة الخصوصية',
    terms: 'شروط الخدمة',
    allTips: 'جميع النصائح',
    roulette: 'عجلة الشخصيات',
    news: 'أخبار YouTube',
    developer: 'حول المطور', // 追加
  },
  menuItems: {
    language: 'إعدادات اللغة',
    share: 'مشاركة مع الأصدقاء',
    removeAds: 'إزالة الإعلانات',
    adsRemoved: 'تم إزالة الإعلانات',
    rateApp: 'تقييم التطبيق',
    privacy: 'سياسة الخصوصية',
    terms: 'شروط الخدمة',
    allTips: 'جميع النصائح',
    punishmentGame: 'لعبة العقاب',
    roulette: 'عجلة الشخصيات',
    news: 'أخبار YouTube',
    developer: 'حول المطور', // 追加
  },
  roulette: {
    spin: 'دوران!',
    spinning: 'يدور...',
  },
  purchase: {
    title: 'إزالة الإعلانات',
    message: 'إزالة جميع الإعلانات بمبلغ {price}.\nهل ترغب في المتابعة؟',
    cancel: 'إلغاء',
    confirm: 'شراء',
    complete: 'تم إزالة الإعلانات بنجاح!',
    priceDisplay: '$4.99',
    productName: 'حزمة إزالة الإعلانات',
    errors: {
      failed: 'فشلت عملية الشراء.',
      alreadyOwned: 'تم الشراء مسبقاً. يرجى محاولة استعادة مشترياتك.',
      notPrepared: 'فشل الاتصال بالمتجر. يرجى المحاولة لاحقاً.',
      notAvailable: 'هذا العنصر غير متوفر حالياً.',
      default: 'حدث خطأ أثناء الشراء. ({code})',
      storeConnect: 'لا يمكن الاتصال بمتجر التطبيقات',
    },
    restore: {
      button: 'استعادة الشراء', // 追加
      success: 'تمت استعادة شراء إزالة الإعلانات!',
      notFound: 'لم يتم العثور على مشتريات قابلة للاستعادة.',
      error: 'فشل في استعادة المشتريات.',
    },
  },
  ads: {
    showError: 'فشل في عرض الإعلان.',
    rewardError: 'فشل في عرض إعلان المكافأة.',
  },
  share: {
    message: 'تحقق من معلومات خرائط Brawl Stars مع "Brawl Status"\n\nقم بالتحميل من App Store:\n{appStoreUrl}',
    title: 'Brawl Status - دليل Brawl Stars',
    dialogTitle: 'مشاركة Brawl Status',
  },
};

export const fr: SettingsScreenTranslation = {
  header: {
    settings: 'Paramètres',
    privacy: 'Politique de Confidentialité',
    terms: 'Conditions d\'Utilisation',
    allTips: 'Tous les Conseils',
    roulette: 'Roulette des Personnages',
    news: 'Actualités YouTube',
    developer: 'À propos du Développeur', // 追加
  },
  menuItems: {
    language: 'Paramètres de Langue',
    share: 'Partager avec des Amis',
    removeAds: 'Supprimer les Publicités',
    adsRemoved: 'Publicités Supprimées',
    rateApp: 'Évaluer l\'Application',
    privacy: 'Politique de Confidentialité',
    terms: 'Conditions d\'Utilisation',
    allTips: 'Tous les Conseils',
    punishmentGame: 'Jeu de Gage',
    roulette: 'Roulette des Personnages',
    news: 'Actualités YouTube',
    developer: 'À propos du Développeur', // 追加
  },
  roulette: {
    spin: 'Tourner !',
    spinning: 'En rotation...',
  },
  purchase: {
    title: 'Supprimer les Publicités',
    message: 'Supprimer toutes les publicités pour {price}.\nSouhaitez-vous continuer ?',
    cancel: 'Annuler',
    confirm: 'Acheter',
    complete: 'Les publicités ont été supprimées avec succès !',
    priceDisplay: '€4.99',
    productName: 'Pack suppression des publicités',
    errors: {
      failed: 'L\'achat a échoué.',
      alreadyOwned: 'Déjà acheté. Veuillez essayer de restaurer votre achat.',
      notPrepared: 'Échec de la connexion à la boutique. Veuillez réessayer plus tard.',
      notAvailable: 'Cet article n\'est pas disponible actuellement.',
      default: 'Une erreur s\'est produite lors de l\'achat. ({code})',
      storeConnect: 'Impossible de se connecter à l\'App Store',
    },
    restore: {
      button: 'Restaurer l\'Achat', // 追加
      success: 'Achat de suppression des publicités restauré !',
      notFound: 'Aucun achat restaurable trouvé.',
      error: 'Échec de la restauration de l\'achat.',
    },
  },
  ads: {
    showError: 'Échec de l\'affichage de la publicité.',
    rewardError: 'Échec de l\'affichage de la publicité à récompense.',
  },
  share: {
    message: 'Consultez les informations des cartes Brawl Stars avec "Brawl Status"\n\nTéléchargez sur l\'App Store :\n{appStoreUrl}',
    title: 'Brawl Status - Guide Brawl Stars',
    dialogTitle: 'Partager Brawl Status',
  },
};

export const zhTw: SettingsScreenTranslation = {
  header: {
    settings: '設定',
    privacy: '隱私權政策',
    terms: '使用條款',
    allTips: '所有提示',
    roulette: '角色輪盤',
    news: 'YouTube 新聞',
    developer: '關於開發者', // 追加
  },
  menuItems: {
    language: '語言設定',
    share: '分享給好友',
    removeAds: '移除廣告',
    adsRemoved: '已移除廣告',
    rateApp: '為應用評分',
    privacy: '隱私權政策',
    terms: '使用條款',
    allTips: '所有提示',
    punishmentGame: '懲罰遊戲',
    roulette: '角色輪盤',
    news: 'YouTube 新聞',
    developer: '關於開發者', // 追加
  },
  roulette: {
    spin: '轉動！',
    spinning: '轉動中...',
  },
  purchase: {
    title: '移除廣告',
    message: '以 {price} 完全移除廣告。\n是否要繼續？',
    cancel: '取消',
    confirm: '購買',
    complete: '已成功移除廣告！',
    priceDisplay: 'NT$150',
    productName: '移除廣告套件',
    errors: {
      failed: '購買失敗。',
      alreadyOwned: '已經購買過。請嘗試恢復購買。',
      notPrepared: '無法連接到商店。請稍後再試。',
      notAvailable: '目前無法購買此項目。',
      default: '購買過程中發生錯誤。({code})',
      storeConnect: '無法連接到 App Store',
    },
    restore: {
      button: '恢復購買', // 追加
      success: '已恢復移除廣告的購買！',
      notFound: '找不到可恢復的購買項目。',
      error: '恢復購買失敗。',
    },
  },
  ads: {
    showError: '顯示廣告失敗。',
    rewardError: '顯示獎勵廣告失敗。',
  },
  share: {
    message: '查看 Brawl Stars 地圖資訊的應用程式 "Brawl Status"\n\n從 App Store 下載：\n{appStoreUrl}',
    title: 'Brawl Status - Brawl Stars 攻略指南',
    dialogTitle: '分享 Brawl Status',
  },
};

export const settingsScreenTranslations = {
  ja,
  en,
  ko,
  es,
  ar,
  fr,
  zhTw,
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