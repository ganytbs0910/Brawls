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
  type Purchase
} from 'react-native-iap';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AdMobService from './AdMobService';

const AD_REMOVAL_SKU = Platform.select({
  ios: 'com.brawlstatus.adremoval',
  android: 'com.brawlstatus.adremoval'
});

const PURCHASE_CONFIG = {
  PRICE: 200,
  PRICE_DISPLAY: '¥200',
  PRODUCT_NAME: '広告削除パック',
} as const;

class IAPManager {
  private static instance: IAPManager;
  private initialized = false;
  private adMobService: AdMobService | null = null;

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
      await initConnection();
      await this.cleanupPendingPurchases();
      await this.loadProducts();
      this.adMobService = AdMobService.getInstance();
      this.initialized = true;
    } catch (error) {
      throw new Error('Failed to initialize IAP');
    }
  }

  private async cleanupPendingPurchases(): Promise<void> {
    try {
      if (Platform.OS === 'ios') {
        await clearTransactionIOS();
      } else {
        await consumeAllItems();
      }
    } catch (error) {
      console.warn('[IAP] Cleanup warning:', error);
    }
  }

  private async loadProducts(): Promise<void> {
    if (!AD_REMOVAL_SKU) return;
    await getProducts({ skus: [AD_REMOVAL_SKU] });
  }

  private async validatePurchase(purchase: Purchase): Promise<boolean> {
    try {
      if (Platform.OS === 'ios') {
        const receipt = purchase.transactionReceipt;
        if (!receipt) return false;
        
        const validation = await validateReceiptIos({
          receiptBody: {
            'receipt-data': receipt,
            password: 'YOUR_SHARED_SECRET'
          },
          isTest: __DEV__
        });
        
        return validation.status === 0;
      } else {
        const validation = await validateReceiptAndroid({
          packageName: 'com.brawlstatus',
          productId: purchase.productId,
          purchaseToken: purchase.purchaseToken,
          accessToken: 'YOUR_ACCESS_TOKEN'
        });
        
        return validation.purchaseState === 1;
      }
    } catch (error) {
      return false;
    }
  }

  async handlePurchase(purchase: Purchase): Promise<boolean> {
    try {
      const isValid = await this.validatePurchase(purchase);
      if (!isValid) return false;

      if (Platform.OS === 'android' && !purchase.acknowledged) {
        await acknowledgePurchase(purchase.purchaseToken);
      } else {
        await finishTransaction(purchase);
      }

      await AsyncStorage.setItem('adFreeStatus', 'true');
      return true;
    } catch (error) {
      return false;
    }
  }

  async purchaseAdRemoval(): Promise<boolean> {
    if (!AD_REMOVAL_SKU) return false;

    try {
      const purchases = await getPurchases();
      const existingPurchase = purchases.find(p => p.productId === AD_REMOVAL_SKU);

      if (existingPurchase) {
        return this.handlePurchase(existingPurchase);
      }

      const purchase = await requestPurchase({
        sku: AD_REMOVAL_SKU,
        andDangerouslyFinishTransactionAutomatically: false
      });

      if (!purchase) return false;
      const success = await this.handlePurchase(purchase);
      
      if (success && this.adMobService) {
        // 広告表示を無効化
        await AsyncStorage.setItem('adFreeStatus', 'true');
      }

      return success;

    } catch (error) {
      if (error instanceof PurchaseError) {
        switch (error.code) {
          case 'E_USER_CANCELLED':
            return false;
          case 'E_ALREADY_OWNED':
            await AsyncStorage.setItem('adFreeStatus', 'true');
            return true;
          default:
            return false;
        }
      }
      return false;
    }
  }

  async restorePurchases(): Promise<boolean> {
    if (!AD_REMOVAL_SKU) return false;

    try {
      const purchases = await getPurchases();
      
      for (const purchase of purchases) {
        if (purchase.productId === AD_REMOVAL_SKU) {
          const success = await this.handlePurchase(purchase);
          if (success && this.adMobService) {
            await AsyncStorage.setItem('adFreeStatus', 'true');
          }
          return success;
        }
      }

      const storedStatus = await AsyncStorage.getItem('adFreeStatus');
      return storedStatus === 'true';
    } catch (error) {
      return false;
    }
  }

  async checkPurchaseStatus(): Promise<boolean> {
    try {
      const storedStatus = await AsyncStorage.getItem('adFreeStatus');
      if (storedStatus === 'true') return true;

      if (!AD_REMOVAL_SKU) return false;
      
      const purchases = await getPurchases();
      return purchases.some(p => p.productId === AD_REMOVAL_SKU);
    } catch (error) {
      return false;
    }
  }
}

const useAdRemoval = () => {
  const [isAdFree, setIsAdFree] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeIAP = async () => {
      try {
        const iapManager = IAPManager.getInstance();
        await iapManager.init();
        const hasValidPurchase = await iapManager.checkPurchaseStatus();
        setIsAdFree(hasValidPurchase);
      } catch (error) {
        setError('初期化に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    initializeIAP();
  }, []);

  const purchaseAdRemoval = async () => {
    try {
      setLoading(true);
      setError(null);

      const iapManager = IAPManager.getInstance();
      const success = await iapManager.purchaseAdRemoval();
      
      if (success) {
        setIsAdFree(true);
      }
      
      return success;
    } catch (error) {
      setError('購入処理に失敗しました');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const restorePurchases = async () => {
    try {
      setLoading(true);
      setError(null);

      const iapManager = IAPManager.getInstance();
      const success = await iapManager.restorePurchases();
      
      if (success) {
        setIsAdFree(true);
      }
      
      return success;
    } catch (error) {
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