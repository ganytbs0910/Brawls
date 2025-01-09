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
  Platform,
  Dimensions
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

const SCREEN_WIDTH = Dimensions.get('window').width;

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

const initializeIAP = async () => {
  try {
    if (Platform.OS === 'ios' && Platform.constants.isSimulator) {
      console.warn('Simulator detected: IAP might not work properly');
      return false;
    }

    const result = await initConnection();
    if (!result) {
      console.warn('IAP initialization failed');
      return false;
    }

    const skuId = Platform.select({
      ios: AD_REMOVAL_SKU_IOS,
      android: AD_REMOVAL_SKU_ANDROID
    });

    if (!skuId) {
      console.error('Invalid platform - no SKU ID available');
      return false;
    }

    try {
      const products = await getProducts({ skus: [skuId] });
      return products.length > 0;
    } catch (error) {
      console.error('Failed to get products:', error);
      return false;
    }
  } catch (error) {
    console.error('IAP initialization error:', error);
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
  const [screenStack, setScreenStack] = useState<ScreenState[]>([screen]);

  useEffect(() => {
    const init = async () => {
      const available = await initializeIAP();
      setIsIAPAvailable(available);
    };
    init();
  }, []);

  useEffect(() => {
    const initAdService = async () => {
      try {
        if (!adService.current) {
          adService.current = new AdMobService();
          await adService.current.initialize();
        }
      } catch (error) {
        console.error('Failed to initialize AdMobService:', error);
      }
    };
    
    initAdService();
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
              
              const skuId = Platform.select({
                ios: AD_REMOVAL_SKU_IOS,
                android: AD_REMOVAL_SKU_ANDROID
              });

              if (!skuId) {
                throw new Error('Invalid platform');
              }

              const products = await getProducts({ skus: [skuId] });
              
              if (!products || products.length === 0) {
                throw new Error('Product not found');
              }

              const purchase = await requestPurchase({
                sku: products[0].productId,
                andDangerouslyFinishTransactionAutomatically: false
              });
              
              if (purchase && typeof purchase === 'object') {
                await finishTransaction({
                  purchase: purchase,
                  isConsumable: false
                });
                
                setIsAdFree(true);
                await AsyncStorage.setItem('adFreeStatus', 'true');
                Alert.alert('完了', '広告の削除が完了しました！');
              }

            } catch (error) {
              console.error('Purchase error:', error);
              let errorMessage = '購入処理に失敗しました。';
              
              if (error instanceof PurchaseError) {
                switch (error.code) {
                  case 'E_USER_CANCELLED':
                    return;
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

  const handleSupportClick = async () => {
    try {
      if (!adService.current) {
        console.warn('AdMobService not initialized');
        return;
      }
      await adService.current.showInterstitial();
    } catch (error) {
      console.error('Failed to show interstitial ad:', error);
      Alert.alert('エラー', '広告の表示に失敗しました。');
    }
  };

  const showRewardedAd = async () => {
    try {
      if (!isRewardedAdReady) {
        console.warn('Rewarded ad not ready');
        return;
      }
      await rewarded.show();
    } catch (error) {
      console.error('Failed to show rewarded ad:', error);
      Alert.alert('エラー', 'リワード広告の表示に失敗しました。');
    }
  };

  const navigateToScreen = (newScreenType: ScreenType) => {
    const newScreen: ScreenState = {
      type: newScreenType,
      translateX: new Animated.Value(SCREEN_WIDTH),
      zIndex: screenStack.length
    };

    setScreenStack(prev => [...prev, newScreen]);

    Animated.timing(newScreen.translateX, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const goBack = () => {
    if (screenStack.length <= 1) {
      onClose();
      return;
    }

    const currentScreen = screenStack[screenStack.length - 1];
    
    Animated.timing(currentScreen.translateX, {
      toValue: SCREEN_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setScreenStack(prev => prev.slice(0, -1));
    });
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

  const renderSettingsContent = () => (
    <View style={styles.settingsContainer}>
      <View style={styles.settingsHeader}>
        <Text style={styles.settingsTitle}>設定</Text>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.settingsContent}>
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
          onPress={() => navigateToScreen('privacy')}
        >
          <Text style={styles.settingsItemText}>プライバシーポリシー</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.settingsItem}
          onPress={() => navigateToScreen('terms')}
        >
          <Text style={styles.settingsItemText}>利用規約</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.settingsItem}
          onPress={() => navigateToScreen('allTips')}
        >
          <Text style={styles.settingsItemText}>豆知識一覧</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.settingsItem}
          onPress={() => navigateToScreen('punishmentGame')}
        >
          <Text style={styles.settingsItemText}>罰ゲーム</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  const renderScreenContent = (screen: ScreenState) => {
    switch (screen.type) {
      case 'mapDetail':
        return mapDetailProps ? (
          <MapDetailScreen
            {...mapDetailProps}
            onClose={goBack}
            onCharacterPress={onCharacterPress}
          />
        ) : null;
      case 'settings':
        return renderSettingsContent();
      case 'privacy':
        return (
          <View style={styles.settingsContainer}>
            <View style={styles.settingsHeader}>
              <Text style={styles.settingsTitle}>プライバシーポリシー</Text>
              <TouchableOpacity onPress={goBack} style={styles.backButton}>
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
              <TouchableOpacity onPress={goBack} style={styles.backButton}>
                <Text style={styles.backButtonText}>←</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.contentContainer}>
              <Text style={styles.contentText}>{termsContent}</Text>
            </ScrollView>
          </View>
        );
      case 'allTips':
        return <AllTipsScreen onClose={goBack} />;
      case 'punishmentGame':
        return <PunishmentGameScreen onClose={goBack} />;
      default:
        return null;
    }
  };

  return (
    <>
      {screenStack.map((screenState, index) => (
        <Animated.View 
          key={`${screenState.type}-${index}`}
          style={[
            styles.settingsOverlay,
            {
              transform: [{ translateX: screenState.translateX }],
              zIndex: screenState.zIndex
            },
          ]}>
          {renderScreenContent(screenState)}
        </Animated.View>
      ))}
    </>
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