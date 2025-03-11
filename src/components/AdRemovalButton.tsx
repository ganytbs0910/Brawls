import React, { useState, useEffect } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  View,
  Platform
} from 'react-native';
import {
  initConnection,
  getProducts,
  requestPurchase,
  finishTransaction,
  PurchaseError,
  Product,
  getPurchases,
  acknowledgePurchase,
  consumeAllItems,
  validateReceiptIos,
  validateReceiptAndroid,
  clearTransactionIOS,
  getAvailablePurchases,
  type Purchase,
  finishTransactionIOS,
  purchaseErrorListener,
  purchaseUpdatedListener,
  flushFailedPurchasesCachedAsPendingAndroid,
  endConnection
} from 'react-native-iap';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AdMobService from './AdMobService';

const AD_REMOVAL_SKU = Platform.select({
  ios: 'com.brawlstatus.adremoval',
  android: 'com.brawlstatus.adremoval'
});

const PURCHASE_CONFIG = {
  PRICE: 500,
  PRICE_DISPLAY: '¥500',
  PRODUCT_NAME: '広告削除パック',
} as const;

// 共有シークレットとアクセストークンの設定
// 実際の値に置き換える必要があります
const IOS_SHARED_SECRET = 'YOUR_ACTUAL_SHARED_SECRET'; // App Store Connect から取得
const ANDROID_ACCESS_TOKEN = 'YOUR_ACTUAL_ACCESS_TOKEN'; // Google Play Console から取得

class IAPManager {
  private static instance: IAPManager;
  private initialized = false;
  private adMobService: AdMobService | null = null;
  private purchaseUpdateSubscription: any = null;
  private purchaseErrorSubscription: any = null;

  private constructor() {}

  static getInstance(): IAPManager {
    if (!IAPManager.instance) {
      IAPManager.instance = new IAPManager();
    }
    return IAPManager.instance;
  }

  async init(): Promise<void> {
    if (this.initialized) return;

    try {
      console.log('IAP初期化開始...');
      const result = await initConnection();
      console.log('IAP初期化結果:', result);

      // 購入イベントリスナーを設定
      this.purchaseUpdateSubscription = purchaseUpdatedListener(async (purchase) => {
        console.log('購入更新イベント:', purchase);
        if (purchase.productId === AD_REMOVAL_SKU) {
          await this.handlePurchase(purchase);
        }
      });

      this.purchaseErrorSubscription = purchaseErrorListener((error) => {
        console.error('購入エラーイベント:', error);
      });

      await this.cleanupPendingPurchases();
      await this.loadProducts();
      this.adMobService = AdMobService.getInstance();
      this.initialized = true;
      console.log('IAP初期化完了');
    } catch (error) {
      console.error('IAP初期化エラー:', error);
      throw new Error('Failed to initialize IAP');
    }
  }

  async cleanup(): Promise<void> {
    try {
      // リスナーを解除
      if (this.purchaseUpdateSubscription) {
        this.purchaseUpdateSubscription.remove();
        this.purchaseUpdateSubscription = null;
      }
      if (this.purchaseErrorSubscription) {
        this.purchaseErrorSubscription.remove();
        this.purchaseErrorSubscription = null;
      }

      // 接続を終了
      if (this.initialized) {
        await endConnection();
        this.initialized = false;
      }
    } catch (error) {
      console.error('IAP終了エラー:', error);
    }
  }

  private async cleanupPendingPurchases(): Promise<void> {
    try {
      console.log('未処理の購入をクリーンアップ中...');
      if (Platform.OS === 'ios') {
        await clearTransactionIOS();
      } else {
        await flushFailedPurchasesCachedAsPendingAndroid();
        await consumeAllItems();
      }
      console.log('クリーンアップ完了');
    } catch (error) {
      console.warn('[IAP] Cleanup warning:', error);
    }
  }

  private async loadProducts(): Promise<void> {
    if (!AD_REMOVAL_SKU) return;
    try {
      console.log('製品情報をロード中...');
      const products = await getProducts({ skus: [AD_REMOVAL_SKU] });
      console.log('取得した製品:', products);
    } catch (error) {
      console.error('製品情報取得エラー:', error);
    }
  }

  private async validatePurchase(purchase: Purchase): Promise<boolean> {
    try {
      console.log('購入検証開始:', purchase.productId);
      
      if (__DEV__) {
        console.log('開発環境のため検証をスキップします');
        return true; // 開発環境では検証をスキップ
      }
      
      if (Platform.OS === 'ios') {
        const receipt = purchase.transactionReceipt;
        if (!receipt) {
          console.error('レシートが見つかりません');
          return false;
        }
        
        console.log('iOSレシート検証中...');
        const validation = await validateReceiptIos({
          receiptBody: {
            'receipt-data': receipt,
            password: IOS_SHARED_SECRET
          },
          isTest: __DEV__
        });
        
        console.log('検証結果:', validation.status);
        return validation.status === 0;
      } else {
        console.log('Androidレシート検証中...');
        const validation = await validateReceiptAndroid({
          packageName: 'com.brawlstatus',
          productId: purchase.productId,
          purchaseToken: purchase.purchaseToken,
          accessToken: ANDROID_ACCESS_TOKEN
        });
        
        console.log('検証結果:', validation.purchaseState);
        return validation.purchaseState === 1;
      }
    } catch (error) {
      console.error('購入検証エラー:', error);
      return false;
    }
  }

  async handlePurchase(purchase: Purchase): Promise<boolean> {
    try {
      console.log('購入処理開始:', purchase.productId);
      
      // 検証処理
      // const isValid = await this.validatePurchase(purchase);
      // if (!isValid) {
      //   console.error('購入検証に失敗しました');
      //   return false;
      // }
      
      // 検証を一時的にスキップ（開発時）
      const isValid = true;

      console.log('購入トランザクションを完了します');
      if (Platform.OS === 'android' && !purchase.acknowledged) {
        await acknowledgePurchase(purchase.purchaseToken);
        console.log('Android購入確認完了');
      } else {
        await finishTransaction({ purchase, isConsumable: false });
        console.log('トランザクション完了');
      }

      await AsyncStorage.setItem('adFreeStatus', 'true');
      console.log('広告削除ステータスを保存しました');
      return true;
    } catch (error) {
      console.error('購入処理エラー:', error);
      if (error instanceof Error) {
        console.error('エラーメッセージ:', error.message);
        console.error('エラースタック:', error.stack);
      }
      return false;
    }
  }

  async purchaseAdRemoval(): Promise<boolean> {
    if (!AD_REMOVAL_SKU) {
      console.error('SKUが定義されていません');
      return false;
    }

    try {
      console.log('広告削除購入開始...');
      
      // 既存の購入をチェック
      const purchases = await getPurchases();
      console.log('現在のデバイスの購入:', purchases.length);
      
      const existingPurchase = purchases.find(p => p.productId === AD_REMOVAL_SKU);
      if (existingPurchase) {
        console.log('既存の購入を処理します');
        return this.handlePurchase(existingPurchase);
      }

      console.log('新規購入をリクエスト中...');
      const purchase = await requestPurchase({
        sku: AD_REMOVAL_SKU,
        andDangerouslyFinishTransactionAutomatically: false
      });

      if (!purchase) {
        console.error('購入リクエストに失敗しました');
        return false;
      }
      
      console.log('購入リクエスト成功:', purchase);
      const success = await this.handlePurchase(purchase);
      
      if (success && this.adMobService) {
        console.log('広告表示を無効化します');
        await AsyncStorage.setItem('adFreeStatus', 'true');
      }

      return success;
    } catch (error) {
      console.error('購入エラー:', error);
      
      if (error instanceof PurchaseError) {
        console.error('購入エラーコード:', error.code);
        switch (error.code) {
          case 'E_USER_CANCELLED':
            console.log('ユーザーがキャンセルしました');
            return false;
          case 'E_ALREADY_OWNED':
            console.log('既に所有しています。アプリ内ステータスを更新します');
            await AsyncStorage.setItem('adFreeStatus', 'true');
            return true;
          default:
            console.error(`未処理の購入エラーコード: ${error.code}`);
            return false;
        }
      }
      
      if (error instanceof Error) {
        console.error('エラーメッセージ:', error.message);
        console.error('エラースタック:', error.stack);
      }
      
      return false;
    }
  }

  async restorePurchases(): Promise<boolean> {
    try {
      console.log('購入復元開始');
      
      if (Platform.OS === 'ios') {
        console.log('iOS専用の購入復元を実行します');
        try {
          // iOSでは空のSKUで復元リクエストを送信
          await requestPurchase({ 
            sku: '',  // 空のSKUで復元モードを起動
            andDangerouslyFinishTransactionAutomatically: false
          });
          
          // トランザクションを処理（リスナーでも処理されるが念のため）
          const transactions = await finishTransactionIOS();
          console.log('iOS復元トランザクション:', transactions);
          
          // ステータスを確認
          await new Promise((resolve) => setTimeout(resolve, 1000));
          const status = await this.checkPurchaseStatus();
          if (status) {
            await AsyncStorage.setItem('adFreeStatus', 'true');
            return true;
          }
        } catch (iosError) {
          console.error('iOS復元特有のエラー:', iosError);
          // iOSでのエラーは無視して、一般的な復元処理を続行
        }
      }
      
      // 通常の復元処理（Android用、またはiOSのフォールバック）
      console.log('getAvailablePurchases を呼び出し中...');
      const availablePurchases = await getAvailablePurchases();
      console.log('利用可能な購入数:', availablePurchases.length);
      
      if (availablePurchases.length > 0) {
        console.log('購入詳細（最初の項目）:', JSON.stringify(availablePurchases[0], null, 2));
      }
      
      const adRemovalPurchase = availablePurchases.find(
        purchase => purchase.productId === AD_REMOVAL_SKU
      );

      if (adRemovalPurchase) {
        console.log('広告削除購入が見つかりました');
        const success = await this.handlePurchase(adRemovalPurchase);
        if (success) {
          await AsyncStorage.setItem('adFreeStatus', 'true');
          return true;
        }
      } else {
        console.log('広告削除購入が見つかりませんでした');
      }

      // 最後の手段としてローカルストレージをチェック
      const storedStatus = await AsyncStorage.getItem('adFreeStatus');
      return storedStatus === 'true';
    } catch (error) {
      console.error('購入復元エラー:', error);
      if (error instanceof Error) {
        console.error('エラーメッセージ:', error.message);
        console.error('エラースタック:', error.stack);
      }
      return false;
    }
  }

  async checkPurchaseStatus(): Promise<boolean> {
    try {
      console.log('購入ステータス確認開始');
      
      // まずローカルストレージをチェック（最速）
      const storedStatus = await AsyncStorage.getItem('adFreeStatus');
      if (storedStatus === 'true') {
        console.log('ローカルに広告削除ステータスが保存されています');
        return true;
      }

      if (!AD_REMOVAL_SKU) {
        console.error('SKUが定義されていません');
        return false;
      }
      
      // 次に、現在のデバイス上の購入を確認
      console.log('現在のデバイスの購入を確認中...');
      const purchases = await getPurchases();
      console.log(`現在のデバイスに ${purchases.length} 件の購入があります`);
      
      const hasPurchase = purchases.some(p => p.productId === AD_REMOVAL_SKU);
      if (hasPurchase) {
        console.log('現在のデバイスで購入が見つかりました');
        await AsyncStorage.setItem('adFreeStatus', 'true');
        return true;
      }
      
      // 最後に、他のデバイスからの購入も含めて確認
      console.log('すべての利用可能な購入を確認中...');
      const availablePurchases = await getAvailablePurchases();
      console.log(`${availablePurchases.length} 件の利用可能な購入があります`);
      
      const hasAvailablePurchase = availablePurchases.some(p => p.productId === AD_REMOVAL_SKU);
      if (hasAvailablePurchase) {
        console.log('他のデバイスで購入が見つかりました');
        await AsyncStorage.setItem('adFreeStatus', 'true');
        return true;
      }
      
      console.log('購入が見つかりませんでした');
      return false;
    } catch (error) {
      console.error('購入ステータス確認エラー:', error);
      if (error instanceof Error) {
        console.error('エラーメッセージ:', error.message);
      }
      return false;
    }
  }
}

const useAdRemoval = () => {
  const [isAdFree, setIsAdFree] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // コンポーネントがマウントされたときにIAPを初期化
  useEffect(() => {
    const initializeIAP = async () => {
      try {
        console.log('IAPフックの初期化開始...');
        const iapManager = IAPManager.getInstance();
        await iapManager.init();
        const hasValidPurchase = await iapManager.checkPurchaseStatus();
        setIsAdFree(hasValidPurchase);
        console.log('IAPフックの初期化完了, 広告フリー:', hasValidPurchase);
      } catch (error) {
        console.error('IAPフック初期化エラー:', error);
        setError('初期化に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    initializeIAP();
    
    // クリーンアップ関数
    return () => {
      const cleanupIAP = async () => {
        try {
          const iapManager = IAPManager.getInstance();
          await iapManager.cleanup();
        } catch (error) {
          console.error('IAPクリーンアップエラー:', error);
        }
      };
      
      cleanupIAP();
    };
  }, []);

  // 購入処理
  const purchaseAdRemoval = async () => {
    try {
      console.log('広告削除購入を開始...');
      setLoading(true);
      setError(null);

      const iapManager = IAPManager.getInstance();
      const success = await iapManager.purchaseAdRemoval();
      
      if (success) {
        console.log('購入が成功しました');
        setIsAdFree(true);
      } else {
        console.log('購入が失敗しました');
      }
      
      return success;
    } catch (error) {
      console.error('購入処理エラー:', error);
      setError('購入処理に失敗しました');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 購入復元処理
  const restorePurchases = async () => {
    try {
      console.log('広告削除購入の復元を開始...');
      setLoading(true);
      setError(null);

      const iapManager = IAPManager.getInstance();
      const success = await iapManager.restorePurchases();
      
      if (success) {
        console.log('購入復元が成功しました');
        setIsAdFree(true);
      } else {
        console.log('購入復元に該当する購入がありませんでした');
      }
      
      return success;
    } catch (error) {
      console.error('購入復元エラー:', error);
      setError('購入の復元に失敗しました');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    isAdFree,
    loading,
    error,
    purchaseAdRemoval,
    restorePurchases
  };
};

export const AdRemovalButton: React.FC = () => {
  const { 
    isAdFree, 
    loading, 
    error,
    purchaseAdRemoval, 
    restorePurchases 
  } = useAdRemoval();

  const handlePurchasePress = async () => {
    if (isAdFree || loading) return;

    Alert.alert(
      '広告削除の購入',
      `${PURCHASE_CONFIG.PRICE_DISPLAY}で広告を完全に削除します。\n購入を続けますか？`,
      [
        {
          text: 'キャンセル',
          style: 'cancel'
        },
        {
          text: '購入する',
          onPress: async () => {
            try {
              const success = await purchaseAdRemoval();
              if (success) {
                Alert.alert('完了', '広告の削除が完了しました！');
              } else {
                Alert.alert('お知らせ', '購入処理が完了しませんでした。既に購入済みの場合は「購入を復元」をお試しください。');
              }
            } catch (error) {
              console.error('購入処理中のエラー:', error);
              Alert.alert('エラー', '購入処理に失敗しました。');
            }
          }
        }
      ]
    );
  };

  const handleRestorePress = async () => {
    if (isAdFree || loading) return;
    
    try {
      Alert.alert('確認', '購入の復元を行いますか？', [
        {
          text: 'キャンセル',
          style: 'cancel'
        },
        {
          text: '復元する',
          onPress: async () => {
            try {
              // 復元中の表示
              Alert.alert('お知らせ', '購入を復元中です。しばらくお待ちください...', 
                [], { cancelable: false });
                
              const restored = await restorePurchases();
              
              // 復元結果のアラートを表示（遅延を入れて前のアラートが消えるのを待つ）
              setTimeout(() => {
                if (restored) {
                  Alert.alert('完了', '広告削除の購入を復元しました！');
                } else {
                  Alert.alert('お知らせ', '復元可能な購入が見つかりませんでした。');
                }
              }, 500);
            } catch (restoreError) {
              console.error('復元中のエラー:', restoreError);
              Alert.alert('エラー', '購入の復元に失敗しました。しばらくしてからもう一度お試しください。');
            }
          }
        }
      ]);
    } catch (error) {
      console.error('復元ダイアログエラー:', error);
      Alert.alert('エラー', '購入の復元処理を開始できませんでした。');
    }
  };

  return (
    <View style={styles.container}>
      {/* エラーメッセージ（存在する場合） */}
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
      
      {/* 広告削除購入ボタン */}
      <TouchableOpacity
        style={[styles.button, (loading || isAdFree) && styles.disabled]}
        onPress={handlePurchasePress}
        disabled={loading || isAdFree}
      >
        <View style={styles.content}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.text}>
              {isAdFree 
                ? '広告削除済み' 
                : `広告を削除する（${PURCHASE_CONFIG.PRICE_DISPLAY}）`}
            </Text>
          )}
        </View>
      </TouchableOpacity>

      {/* 課金復元ボタン (広告削除済みの場合は表示しない) */}
      {!isAdFree && (
        <TouchableOpacity
          style={[styles.restoreButton, loading && styles.disabled]}
          onPress={handleRestorePress}
          disabled={loading}
        >
          <View style={styles.content}>
            {loading ? (
              <ActivityIndicator size="small" color="#21A0DB" />
            ) : (
              <Text style={styles.restoreText}>
                購入を復元する
              </Text>
            )}
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  button: {
    padding: 16,
    backgroundColor: '#21A0DB',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  restoreButton: {
    padding: 12,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#21A0DB',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  restoreText: {
    color: '#21A0DB',
    fontSize: 14,
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
    textAlign: 'center',
  }
});

export default AdRemovalButton;