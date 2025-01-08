import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Animated, 
  Share, 
  Alert,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  initConnection,
  purchaseProduct,
  finishTransaction,
  Product,
  requestPurchase,
  getProducts,
  PurchaseError,
  getPurchases,
  validateReceiptIos,
  validateReceiptAndroid
} from 'react-native-iap';
import { privacyPolicyContent } from '../contents/privacyPolicy';
import { termsContent } from '../contents/terms';
import { DAILY_TIPS } from '../components/DailyTip';
import { RewardedAd } from 'react-native-google-mobile-ads';
import AdMobService from '../services/AdMobService';
import MapDetailScreen from './MapDetailScreen';
import PunishmentGameScreen from './PunishmentGameScreen';
import { MapDetail, ScreenType, ScreenState } from '../types';

// 商品IDの定義
const AD_REMOVAL_SKU_IOS = 'com.brawlstatus.adremoval';
const AD_REMOVAL_SKU_ANDROID = 'brawl_status_ad_removal';

interface SettingsScreenProps {
  screen: ScreenState;
  onClose: () => void;
  isAdFree: boolean;
  setIsAdFree: (value: boolean) => void;
  isRewardedAdReady: boolean;
  rewarded: RewardedAd;
  adService: React.RefObject<AdMobService>;
  mapDetailProps: MapDetail | null;
  onCharacterPress: (characterName: string) => void;
}

const AllTipsScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <View style={styles.settingsContainer}>
      <View style={styles.settingsHeader}>
        <Text style={styles.settingsTitle}>豆知識一覧</Text>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.contentContainer}>
        {DAILY_TIPS.map((tip) => (
          <View key={tip.id} style={styles.tipItem}>
            <Text style={styles.tipItemTitle}>{tip.title}</Text>
            <Text style={styles.tipItemContent}>{tip.content}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

// IAPの初期化関数
const initializeIAP = async () => {
  try {
    // シミュレーター判定（iOSの場合）
    if (Platform.OS === 'ios' && Platform.constants.isSimulator) {
      console.warn('Simulator detected: IAP might not work properly');
      return false;
    }

    console.debug('Platform:', Platform.OS);
    console.debug('Is Simulator:', Platform.constants.isSimulator);
    console.debug('Dev Mode:', __DEV__);

    // 接続の初期化
    const result = await initConnection();
    
    if (!result) {
      console.warn('IAP initialization failed');
      return false;
    }

    // プラットフォームに応じた追加の初期化処理
    if (Platform.OS === 'ios') {
      // iOS固有の初期化処理
      try {
        const receipt = await validateReceiptIos({
          receiptBody: {
            'receipt-data': ''
          },
          isTest: __DEV__, // 開発中はテストモード
        });
        console.log('iOS receipt validation success');
      } catch (err) {
        // レシート検証のエラーは無視可能
        console.warn('iOS receipt validation failed:', err);
      }
    } else if (Platform.OS === 'android') {
      // Android固有の初期化処理
      try {
        const result = await validateReceiptAndroid({
          packageName: 'com.brawlstatus',
          productId: AD_REMOVAL_SKU_ANDROID,
          token: 'purchase.token'
        });
        console.log('Android receipt validation success');
      } catch (err) {
        // レシート検証のエラーは無視可能
        console.warn('Android receipt validation failed:', err);
      }
    }

    return true;
  } catch (error) {
    if (error.code === 'E_IAP_NOT_AVAILABLE') {
      console.warn('IAP not available. Please check if:');
      console.warn('- Device is not a simulator');
      console.warn('- User is logged into App Store/Play Store');
      console.warn('- Billing is enabled on the device');
    } else {
      console.error('Unknown IAP initialization error:', error);
    }
    return false;
  }
};

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  screen,
  onClose,
  isAdFree,
  setIsAdFree,
  isRewardedAdReady,
  rewarded,
  adService,
  mapDetailProps,
  onCharacterPress
}) => {
  const [loading, setLoading] = useState(false);
  const [isIAPAvailable, setIsIAPAvailable] = useState(false);

  // コンポーネントマウント時にIAP初期化
  useEffect(() => {
    const init = async () => {
      const available = await initializeIAP();
      setIsIAPAvailable(available);
    };
    init();
  }, []);

  const handleShare = async () => {
    try {
      const appStoreUrl = 'https://apps.apple.com/jp/app/brawl-status/id6738936691';
      await Share.share({
        message: 'ブロールスターズのマップ情報をチェックできるアプリ「Brawl Status」を見つけました！\n\nApp Storeからダウンロード：\n' + appStoreUrl,
        url: appStoreUrl,
        title: 'Brawl Status - マップ情報アプリ'
      }, {
        dialogTitle: 'Brawl Statusを共有',
        subject: 'Brawl Status - ブロールスターズマップ情報アプリ',
        tintColor: '#21A0DB'
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const handlePurchaseAdRemoval = async () => {
  if (loading || isAdFree || !isIAPAvailable) return;

  Alert.alert(
    '広告削除の購入',
    '¥240で広告を完全に削除します。\n購入を続けますか？',
    [
      {
        text: 'キャンセル',
        style: 'cancel'
      },
      {
        text: '購入する',
        onPress: async () => {
          try {
            setLoading(true);
            
            // プラットフォームに応じた商品IDを選択
            const skuId = Platform.select({
              ios: AD_REMOVAL_SKU_IOS,
              android: AD_REMOVAL_SKU_ANDROID
            });

            if (!skuId) {
              console.error('Invalid platform or SKU ID not defined');
              throw new Error('Invalid platform');
            }

            console.log('Requesting products with SKU:', skuId);
            // 商品情報を取得
            const products: Product[] = await getProducts({ skus: [skuId] });
            console.log('Retrieved products:', products);
            
            if (products.length === 0) {
              console.error('No products found for SKU:', skuId);
              throw new Error('Product not found');
            }

            // 購入処理を実行
            console.log('Initiating purchase for product:', products[0]);
            const purchase = await requestPurchase(skuId);
            console.log('Purchase response:', purchase);

            // トランザクションを完了
            if (purchase) {
              console.log('Finishing transaction for purchase:', purchase);
              await finishTransaction(purchase);
              console.log('Transaction finished successfully');
            }

            // 購入成功後の処理
            setIsAdFree(true);
            await AsyncStorage.setItem('adFreeStatus', 'true');
            Alert.alert('完了', '広告の削除が完了しました！');

          } catch (error) {
            console.error('Detailed purchase error:', error);
            console.error('Error type:', error.constructor.name);
            console.error('Error properties:', Object.keys(error));
            
            // エラーメッセージをユーザーフレンドリーに変換
            let errorMessage = '購入処理に失敗しました。';
            if (error instanceof PurchaseError) {
              console.log('PurchaseError code:', error.code);
              switch (error.code) {
                case 'E_USER_CANCELLED':
                  errorMessage = '購入がキャンセルされました。';
                  break;
                case 'E_ALREADY_OWNED':
                  errorMessage = 'すでに購入済みです。購入の復元をお試しください。';
                  break;
                case 'E_NOT_PREPARED':
                  errorMessage = 'ストアとの接続に失敗しました。後でもう一度お試しください。';
                  break;
                case 'E_PRODUCT_NOT_AVAILABLE':
                  errorMessage = '現在この商品は購入できません。';
                  break;
                default:
                  errorMessage = `購入処理中にエラーが発生しました。(${error.code})`;
              }
            } else {
              errorMessage = '予期せぬエラーが発生しました。App Storeに接続できているかご確認ください。';
            }
            Alert.alert('エラー', errorMessage);
          } finally {
            setLoading(false);
          }
        }
      }
    ]
  );
};

  const handleRestorePurchase = async () => {
    if (loading || isAdFree || !isIAPAvailable) return;

    try {
      setLoading(true);
      
      const purchases = await getPurchases();
      const adRemovalPurchase = purchases.find(
        purchase => purchase.productId === AD_REMOVAL_SKU_IOS || 
                   purchase.productId === AD_REMOVAL_SKU_ANDROID
      );

      if (adRemovalPurchase) {
        setIsAdFree(true);
        await AsyncStorage.setItem('adFreeStatus', 'true');
        Alert.alert('完了', '広告削除の購入を復元しました！');
      } else {
        Alert.alert('お知らせ', '復元可能な購入が見つかりませんでした。');
      }
    } catch (error) {
      console.error('Restore error:', error);
      Alert.alert('エラー', '購入の復元に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  const showRewardedAd = async () => {
    if (isRewardedAdReady) {
      await rewarded.show();
    }
  };

  const handleSupportClick = async () => {
    if (adService.current) {
      await adService.current.showInterstitial();
    }
  };

  const renderPurchaseButton = () => {
    if (!isIAPAvailable) {
      return (
        <TouchableOpacity 
          style={[styles.settingsItem, styles.settingsItemDisabled]}
          disabled={true}
        >
          <Text style={[styles.settingsItemText, styles.settingsItemTextDisabled]}>
            {Platform.select({
              ios: 'App Storeに接続できません',
              android: 'Google Playに接続できません'
            })}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity 
        style={[
          styles.settingsItem,
          (loading || isAdFree) && styles.settingsItemDisabled
        ]}
        onPress={handlePurchaseAdRemoval}
        disabled={loading || isAdFree}
      >
        <Text style={[
          styles.settingsItemText,
          (loading || isAdFree) && styles.settingsItemTextDisabled
        ]}>
          {isAdFree ? '広告削除済み' : '広告を削除（¥240）'}
          {loading && ' (処理中...)'}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderRestoreButton = () => {
    if (!isIAPAvailable) return null;

    return (
      <TouchableOpacity 
        style={[
          styles.settingsItem,
          (loading || isAdFree) && styles.settingsItemDisabled
        ]}
        onPress={handleRestorePurchase}
        disabled={loading || isAdFree}
      >
        <Text style={[
          styles.settingsItemText,
          (loading || isAdFree) && styles.settingsItemTextDisabled
        ]}>
          課金を復元
          {loading && ' (処理中...)'}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderScreenContent = (screen: ScreenState) => {
    switch (screen.type) {
      case 'mapDetail':
        return mapDetailProps ? (
          <MapDetailScreen
            {...mapDetailProps}
            onClose={onClose}
            onCharacterPress={onCharacterPress}
          />
        ) : null;
      case 'settings':
        return (
          <View style={styles.settingsContainer}>
            <View style={styles.settingsHeader}>
              <Text style={styles.settingsTitle}>設定</Text>
              <TouchableOpacity onPress={onClose} style={styles.backButton}>
                <Text style={styles.backButtonText}>←</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.settingsContent}>
              <TouchableOpacity 
                style={styles.settingsItem}
                onPress={handleShare}
              >
                <Text style={styles.settingsItemText}>共有</Text>
              </TouchableOpacity>

              {renderPurchaseButton()}
              {renderRestoreButton()}

              {!isAdFree && (
                <>
                  <TouchableOpacity 
                    style={styles.settingsItem}
                    onPress={handleSupportClick}
                  >
                    <Text style={styles.settingsItemText}>
                      広告を見て支援する（小）
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[
                      styles.settingsItem,
                      !isRewardedAdReady && styles.settingsItemDisabled
                    ]}
                    onPress={showRewardedAd}
                    disabled={!isRewardedAdReady}
                  >
                    <Text style={[
                      styles.settingsItemText,
                      !isRewardedAdReady && styles.settingsItemTextDisabled
                    ]}>
                      広告を見て支援する（大）
                      {!isRewardedAdReady && ' (準備中)'}
                    </Text>
                  </TouchableOpacity>
                </>
              )}

              <TouchableOpacity 
                style={styles.settingsItem}
                onPress={() => screen.type = 'privacy'}
              >
                <Text style={styles.settingsItemText}>プライバシーポリシー</Text>
              </TouchableOpacity>

<TouchableOpacity 
                style={styles.settingsItem}
                onPress={() => screen.type = 'terms'}
              >
                <Text style={styles.settingsItemText}>利用規約</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.settingsItem}
                onPress={() => screen.type = 'allTips'}
              >
                <Text style={styles.settingsItemText}>豆知識一覧</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.settingsItem}
                onPress={() => screen.type = 'punishmentGame'}
              >
                <Text style={styles.settingsItemText}>罰ゲーム</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 'privacy':
        return (
          <View style={styles.settingsContainer}>
            <View style={styles.settingsHeader}>
              <Text style={styles.settingsTitle}>プライバシーポリシー</Text>
              <TouchableOpacity onPress={onClose} style={styles.backButton}>
                <Text style={styles.backButtonText}>←</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.contentContainer}>
              <Text style={styles.contentText}>{privacyPolicyContent}</Text>
            </ScrollView>
          </View>
        );
      case 'terms':
        return (
          <View style={styles.settingsContainer}>
            <View style={styles.settingsHeader}>
              <Text style={styles.settingsTitle}>利用規約</Text>
              <TouchableOpacity onPress={onClose} style={styles.backButton}>
                <Text style={styles.backButtonText}>←</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.contentContainer}>
              <Text style={styles.contentText}>{termsContent}</Text>
            </ScrollView>
          </View>
        );
      case 'allTips':
        return <AllTipsScreen onClose={onClose} />;
      case 'punishmentGame':
        return <PunishmentGameScreen onClose={onClose} />;
      default:
        return null;
    }
  };

  return (
    <Animated.View 
      style={[
        styles.settingsOverlay,
        {
          transform: [{ translateX: screen.translateX }],
          zIndex: screen.zIndex
        },
      ]}>
      {renderScreenContent(screen)}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  settingsOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
  },
  settingsContainer: {
    flex: 1,
  },
  settingsHeader: {
    height: 60,
    backgroundColor: '#21A0DB',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#4FA8D6',
  },
  settingsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  settingsContent: {
    flex: 1,
  },
  settingsItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingsItemDisabled: {
    opacity: 0.5,
  },
  settingsItemText: {
    fontSize: 16,
  },
  settingsItemTextDisabled: {
    color: '#999',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: '#fff',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
  },
  tipItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tipItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  tipItemContent: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
  }
});

export default SettingsScreen;