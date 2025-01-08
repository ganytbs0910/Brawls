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
  PurchasesPackage,
  CustomerInfo,
  purchasePackage,
  PurchasesError,
  configure,
  getCustomerInfo,
  checkTrialOrIntroductoryPriceEligibility
} from 'react-native-purchases';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 定数定義
const REVENUE_CAT_API_KEY = Platform.select({
  ios: 'YOUR_IOS_KEY',
  android: 'YOUR_ANDROID_KEY',
}) ?? '';

const PURCHASE_CONFIG = {
  ENTITLEMENT_ID: 'ad_free',
  PRODUCT_ID: 'ad_removal_240',
  PRICE: 240,
  PRICE_DISPLAY: '¥240',
  PRODUCT_NAME: '広告削除パック',
} as const;

// カスタムフック
const useAdRemoval = () => {
  const [isAdFree, setIsAdFree] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 初期化
  useEffect(() => {
    configure({
      apiKey: REVENUE_CAT_API_KEY,
      observerMode: false
    });
    checkStatus();
  }, []);

  // 購入状態の確認
  const checkStatus = async () => {
    try {
      setLoading(true);
      const storedStatus = await AsyncStorage.getItem('adFreeStatus');
      
      if (storedStatus === 'true') {
        setIsAdFree(true);
        setLoading(false);
        return;
      }

      const customerInfo = await getCustomerInfo();
      const isActive = customerInfo.entitlements.active[PURCHASE_CONFIG.ENTITLEMENT_ID] !== undefined;
      
      if (isActive) {
        await AsyncStorage.setItem('adFreeStatus', 'true');
        setIsAdFree(true);
      }

    } catch (err) {
      console.error('Status check error:', err);
      setError('ステータスの確認に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // 広告削除の購入
  const purchaseAdRemoval = async () => {
    try {
      setLoading(true);
      setError(null);

      const customerInfo = await getCustomerInfo();
      if (customerInfo.entitlements.active[PURCHASE_CONFIG.ENTITLEMENT_ID]) {
        setIsAdFree(true);
        return true;
      }

      const offerings = await purchasePackage({});
      const package_ = offerings.current?.availablePackages[0];
      
      if (!package_) {
        throw new Error('利用可能なパッケージがありません');
      }

      const { customerInfo: updatedInfo } = await purchasePackage(package_);
      const isActive = updatedInfo.entitlements.active[PURCHASE_CONFIG.ENTITLEMENT_ID] !== undefined;

      if (isActive) {
        await AsyncStorage.setItem('adFreeStatus', 'true');
        setIsAdFree(true);
      }

      return isActive;
    } catch (err) {
      console.error('Purchase error:', err);
      setError('購入処理に失敗しました');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 購入の復元
  const restorePurchases = async () => {
    try {
      setLoading(true);
      setError(null);

      const customerInfo = await getCustomerInfo();
      const isActive = customerInfo.entitlements.active[PURCHASE_CONFIG.ENTITLEMENT_ID] !== undefined;
      
      if (isActive) {
        await AsyncStorage.setItem('adFreeStatus', 'true');
        setIsAdFree(true);
      }

      return isActive;
    } catch (err) {
      console.error('Restore error:', err);
      setError('購入の復元に失敗しました');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    isAdFree,
    loading,
    error,
    purchaseAdRemoval,
    restorePurchases,
    checkStatus
  };
};

// ボタンコンポーネント
interface AdRemovalButtonProps {
  style?: any;
}

export const AdRemovalButton: React.FC<AdRemovalButtonProps> = ({ style }) => {
  const { isAdFree, loading, purchaseAdRemoval, restorePurchases } = useAdRemoval();

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
      style={[styles.button, style, (loading || isAdFree) && styles.disabled]}
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
  },
});

// エクスポート
export { useAdRemoval, PURCHASE_CONFIG };
export default AdRemovalButton;