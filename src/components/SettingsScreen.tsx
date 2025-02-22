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
  Dimensions,
  Linking
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
import { LanguageSelector } from './LanguageSelector';
import { useSettingsScreenTranslation } from '../i18n/settingsScreen';

const AD_REMOVAL_SKU_IOS = 'com.brawlstatus.adremoval';
const AD_REMOVAL_SKU_ANDROID = 'brawl_status_ad_removal';
const SCREEN_WIDTH = Dimensions.get('window').width;

const PURCHASE_CONFIG = {
  PRICE: 500,
  PRICE_DISPLAY: '¥500',
  PRODUCT_NAME: '広告削除パック',
} as const;

interface SettingsScreenProps {
  screen?: ScreenState;
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
  const { t, currentLanguage } = useSettingsScreenTranslation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <View style={styles.settingsContainer}>
      <View style={styles.settingsHeader}>
        <Text style={styles.settingsTitle}>{t.header.allTips}</Text>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.contentContainer}>
        {DAILY_TIPS.map((tip) => (
          <View key={tip.id} style={styles.tipItem}>
            <Text style={styles.tipItemTitle}>{tip.title[currentLanguage]}</Text>
            <Text style={styles.tipItemContent}>{tip.content[currentLanguage]}</Text>
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
  const { t, currentLanguage } = useSettingsScreenTranslation();
  const [loading, setLoading] = useState(false);
  const [isIAPAvailable, setIsIAPAvailable] = useState(false);
  
  // Initialize with default screen state if none provided
  const initialScreen: ScreenState = {
    type: 'settings',
    translateX: new Animated.Value(0),
    zIndex: 0
  };
  const [screenStack, setScreenStack] = useState<ScreenState[]>([screen || initialScreen]);

  // Update stack when screen prop changes
  useEffect(() => {
    if (screen) {
      setScreenStack([screen]);
    }
  }, [screen]);

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
        adService.current = await AdMobService.initialize();
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
      message: t.share.message.replace('{appStoreUrl}', appStoreUrl),
      url: appStoreUrl,
      title: t.share.title
    }, {
      dialogTitle: t.share.dialogTitle,
      subject: t.share.title,
      tintColor: '#21A0DB'
    });
  } catch (error) {
    console.error('Share error:', error);
  }
};

  const handlePurchaseAdRemoval = async () => {
    if (loading || isAdFree || !isIAPAvailable) return;

    Alert.alert(
      t.purchase.title,
      t.purchase.message
        .replace('{originalPrice}', PURCHASE_CONFIG.ORIGINAL_PRICE_DISPLAY)
        .replace('{salePrice}', PURCHASE_CONFIG.SALE_PRICE_DISPLAY),
      [
        {
          text: t.purchase.cancel,
          style: 'cancel'
        },
        {
          text: t.purchase.confirm,
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
                Alert.alert('完了', t.purchase.complete);
              }

            } catch (error) {
              console.error('Purchase error:', error);
              let errorMessage = t.purchase.errors.failed;
              
              if (error instanceof PurchaseError) {
                switch (error.code) {
                  case 'E_USER_CANCELLED':
                    return;
                  case 'E_ALREADY_OWNED':
                    errorMessage = t.purchase.errors.alreadyOwned;
                    break;
                  case 'E_NOT_PREPARED':
                    errorMessage = t.purchase.errors.notPrepared;
                    break;
                  case 'E_PRODUCT_NOT_AVAILABLE':
                    errorMessage = t.purchase.errors.notAvailable;
                    break;
                  default:
                    errorMessage = t.purchase.errors.default.replace('{code}', error.code);
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
        Alert.alert('完了', t.purchase.restore.success);
      } else {
        Alert.alert('お知らせ', t.purchase.restore.notFound);
      }
    } catch (error) {
      console.error('Restore error:', error);
      Alert.alert('エラー', t.purchase.restore.error);
    } finally {
      setLoading(false);
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

  const renderSettingsContent = () => (
    <View style={styles.settingsContainer}>
      <View style={styles.settingsHeader}>
        <Text style={styles.settingsTitle}>{t.header.settings}</Text>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity 
        style={styles.settingsItem}
        onPress={() => navigateToScreen('language')}
      >
        <Text style={styles.settingsItemText}>{t.menuItems.language}</Text>
      </TouchableOpacity>
      <ScrollView style={styles.settingsContent}>
        <TouchableOpacity 
          style={styles.settingsItem}
          onPress={handleShare}
        >
          <Text style={styles.settingsItemText}>{t.menuItems.share}</Text>
        </TouchableOpacity>

        {renderPurchaseButton()}

        {!isAdFree && (
          <>
            <TouchableOpacity 
              style={styles.settingsItem}
              onPress={() => {
                const url = Platform.select({
                  ios: 'https://apps.apple.com/jp/app/brawl-status/id6738936691?action=write-review',
                  android: 'market://details?id=com.brawlstatus'
                });
                if (url) Linking.openURL(url);
              }}
            >
              <Text style={styles.settingsItemText}>{t.menuItems.rateApp}</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity 
          style={styles.settingsItem}
          onPress={() => navigateToScreen('privacy')}
        >
          <Text style={styles.settingsItemText}>{t.menuItems.privacy}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.settingsItem}
          onPress={() => navigateToScreen('terms')}
        >
          <Text style={styles.settingsItemText}>{t.menuItems.terms}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.settingsItem}
          onPress={() => navigateToScreen('allTips')}
        >
          <Text style={styles.settingsItemText}>{t.menuItems.allTips}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.settingsItem}
          onPress={() => navigateToScreen('punishmentGame')}
        >
          <Text style={styles.settingsItemText}>{t.menuItems.punishmentGame}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  const renderPurchaseButton = () => {
    if (!isIAPAvailable) {
      return (
        <TouchableOpacity 
          style={[styles.settingsItem, styles.settingsItemDisabled]}
          disabled={true}
        >
          <Text style={[styles.settingsItemText, styles.settingsItemTextDisabled]}>
            {Platform.select({
              ios: t.purchase.errors.storeConnect,
              android: t.purchase.errors.storeConnect.replace('App Store', 'Google Play')
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
        <View>
          <Text style={[
            styles.settingsItemText,
            (loading || isAdFree) && styles.settingsItemTextDisabled
          ]}>
            {isAdFree ? t.menuItems.adsRemoved : t.menuItems.removeAds}
            {loading && ' (処理中...)'}
          </Text>
          {!isAdFree && !loading && (
  <View style={styles.priceContainer}>
    <Text style={styles.price}>
      {PURCHASE_CONFIG.PRICE_DISPLAY}
    </Text>
  </View>
)}
        </View>
      </TouchableOpacity>
    );
  };

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
              <Text style={styles.settingsTitle}>{t.header.privacy}</Text>
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
              <Text style={styles.settingsTitle}>{t.header.terms}</Text>
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
      case 'language':
        return <LanguageSelector onClose={goBack} />;
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
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  price: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  }
});

export default SettingsScreen;