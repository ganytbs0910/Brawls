// AdRemovalFeature.tsx
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
  getPurchases
} from 'react-native-iap';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 商品ID定義
const AD_REMOVAL_SKU_IOS = 'com.brawlstatus.adremoval';
const AD_REMOVAL_SKU_ANDROID = 'brawl_status_ad_removal';

const PURCHASE_CONFIG = {
  PRICE: 200,
  PRICE_DISPLAY: '¥200',
  PRODUCT_NAME: '広告削除パック',
} as const;

// カスタムフック
const useAdRemoval = () => {
  const [isAdFree, setIsAdFree] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  // 初期化
  useEffect(() => {
    const initIAP = async () => {
      try {
        console.log('[IAP] Starting initialization');
        console.log('[IAP] Environment:', __DEV__ ? 'Sandbox' : 'Production');
        
        if (Platform.OS === 'ios' && Platform.constants.isSimulator) {
          console.warn('[IAP] Running on Simulator - IAP may not work');
        }

        const result = await initConnection();
        console.log('[IAP] Connection initialized:', result);

        const skuId = Platform.select({
          ios: AD_REMOVAL_SKU_IOS,
          android: AD_REMOVAL_SKU_ANDROID
        });

        if (!skuId) {
          throw new Error('Platform not supported');
        }

        // 利用可能な商品の確認
        const availableProducts = await getProducts({ skus: [skuId] });
        console.log('[IAP] Available products:', availableProducts);
        setProducts(availableProducts);

        // 購入状態の確認
        const storedStatus = await AsyncStorage.getItem('adFreeStatus');
        setIsAdFree(storedStatus === 'true');

      } catch (error) {
        console.error('[IAP] Initialization error:', error);
        setError('初期化に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    initIAP();
  }, []);

  // 広告削除の購入
  const purchaseAdRemoval = async () => {
    try {
      setLoading(true);
      setError(null);

      const skuId = Platform.select({
        ios: AD_REMOVAL_SKU_IOS,
        android: AD_REMOVAL_SKU_ANDROID
      });

      if (!skuId) {
        throw new Error('Platform not supported');
      }

      console.log('[IAP] Starting purchase for SKU:', skuId);

      // 商品情報の再確認
      if (products.length === 0) {
        const availableProducts = await getProducts({ skus: [skuId] });
        console.log('[IAP] Available products:', availableProducts);
        if (availableProducts.length === 0) {
          throw new Error('Product not found');
        }
      }

      // 購入リクエスト
      const purchase = await requestPurchase({
        sku: skuId,
        andDangerouslyFinishTransactionAutomatically: false
      });

      console.log('[IAP] Purchase response:', purchase);

      if (purchase) {
        await finishTransaction(purchase);
        await AsyncStorage.setItem('adFreeStatus', 'true');
        setIsAdFree(true);
        return true;
      }

      return false;

    } catch (error) {
      console.error('[IAP] Purchase error:', error);
      let errorMessage = '購入処理に失敗しました。';

      if (error instanceof PurchaseError) {
        switch (error.code) {
          case 'E_USER_CANCELLED':
            return false;
          case 'E_ALREADY_OWNED':
            errorMessage = '既に購入済みです。購入の復元をお試しください。';
            break;
          case 'E_NETWORK_ERROR':
            errorMessage = 'ネットワークエラーが発生しました。接続を確認してください。';
            break;
          default:
            errorMessage = `購入エラー: ${error.code}`;
        }
      } else {
        console.error('[IAP] Unexpected error:', error);
        errorMessage = '予期せぬエラーが発生しました';
      }

      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 購入の復元
  const restorePurchases = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('[IAP] Starting purchase restoration');
      const purchases = await getPurchases();
      console.log('[IAP] Retrieved purchases:', purchases);

      const hasAdRemoval = purchases.some(
        purchase => purchase.productId === AD_REMOVAL_SKU_IOS || 
                   purchase.productId === AD_REMOVAL_SKU_ANDROID
      );

      if (hasAdRemoval) {
        await AsyncStorage.setItem('adFreeStatus', 'true');
        setIsAdFree(true);
        return true;
      }

      return false;
    } catch (error) {
      console.error('[IAP] Restore error:', error);
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

// ボタンコンポーネント
export const AdRemovalButton: React.FC = () => {
  const { 
    isAdFree, 
    loading, 
    purchaseAdRemoval, 
    restorePurchases 
  } = useAdRemoval();

  const handlePress = async () => {
    if (isAdFree) return;

    Alert.alert(
      '広告削除の購入',
      `${PURCHASE_CONFIG.PRICE_DISPLAY}で広告を完全に削除します。\n購入を続けますか？`,
      [
        {
          text: 'キャンセル',
          style: 'cancel'
        },
        {
          text: '購入を復元',
          onPress: async () => {
            try {
              const restored = await restorePurchases();
              if (restored) {
                Alert.alert('完了', '広告削除の購入を復元しました！');
              } else {
                Alert.alert('お知らせ', '復元可能な購入が見つかりませんでした。');
              }
            } catch (error) {
              Alert.alert('エラー', '購入の復元に失敗しました。');
            }
          }
        },
        {
          text: '購入する',
          onPress: async () => {
            try {
              const success = await purchaseAdRemoval();
              if (success) {
                Alert.alert('完了', '広告の削除が完了しました！');
              }
            } catch (error) {
              Alert.alert('エラー', '購入処理に失敗しました。');
            }
          }
        }
      ]
    );
  };

  return (
    <TouchableOpacity
      style={[styles.button, (loading || isAdFree) && styles.disabled]}
      onPress={handlePress}
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
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 16,
    backgroundColor: '#21A0DB',
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
  }
});

export default AdRemovalButton;