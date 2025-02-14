import mobileAds, {
  InterstitialAd,
  AdEventType,
} from 'react-native-google-mobile-ads';
import { Platform } from 'react-native';
import { AD_CONFIG } from '../config/AdConfig';

class AdMobService {
  private static instance: AdMobService | null = null;
  private interstitial: InterstitialAd | null = null;
  private isLoading: boolean = false;

  private constructor() {
    this.initInterstitial();
  }

  static async initialize(): Promise<AdMobService> {
    if (!this.instance) {
      try {
        await mobileAds().initialize();
        this.instance = new AdMobService();
      } catch (error) {
        console.error('AdMob initialization error:', error);
        throw error;
      }
    }
    return this.instance;
  }

  static getInstance(): AdMobService {
    if (!this.instance) {
      throw new Error('AdMobService not initialized. Call initialize() first.');
    }
    return this.instance;
  }

  private get interstitialAdUnitId(): string {
    return Platform.select({
      ios: AD_CONFIG.IOS_INTERSTITIAL_ID,
      android: AD_CONFIG.ANDROID_INTERSTITIAL_ID,
    }) as string;
  }

  private initInterstitial() {
    try {
      // 新しいインスタンスを作成する前に、古いインスタンスのイベントリスナーを解除
      if (this.interstitial) {
        this.interstitial.removeAllListeners();
      }
      
      this.interstitial = InterstitialAd.createForAdRequest(
        this.interstitialAdUnitId,
        {
          requestNonPersonalizedAdsOnly: true,
        }
      );
    } catch (error) {
      console.error('Interstitial initialization error:', error);
      this.interstitial = null;
    }
  }

  async loadInterstitial(): Promise<boolean> {
    if (!this.interstitial || this.isLoading) return false;

    try {
      this.isLoading = true;
      const loadPromise = new Promise<boolean>((resolve) => {
        const unsubscribeLoad = this.interstitial?.addAdEventListener(
          AdEventType.LOADED,
          () => {
            this.isLoading = false;
            unsubscribeLoad();
            resolve(true);
          }
        );
        
        const unsubscribeError = this.interstitial?.addAdEventListener(
          AdEventType.ERROR,
          (error) => {
            console.error('Ad loading error:', error);
            this.isLoading = false;
            unsubscribeError();
            resolve(false);
          }
        );
      });

      this.interstitial.load();
      return await loadPromise;
    } catch (error) {
      console.error('Load interstitial error:', error);
      this.isLoading = false;
      return false;
    }
  }

  async showInterstitial(): Promise<boolean> {
    if (!this.interstitial) return false;

    try {
      if (!this.interstitial.loaded) {
        const loaded = await this.loadInterstitial();
        if (!loaded) return false;
      }

      return new Promise<boolean>((resolve) => {
        const unsubscribeClosed = this.interstitial?.addAdEventListener(
          AdEventType.CLOSED,
          () => {
            unsubscribeClosed();
            this.initInterstitial();
            resolve(true);
          }
        );

        const unsubscribeError = this.interstitial?.addAdEventListener(
          AdEventType.ERROR,
          (error) => {
            console.error('Ad showing error:', error);
            unsubscribeError();
            this.initInterstitial();
            resolve(false);
          }
        );

        this.interstitial?.show().catch((error) => {
          console.error('Show interstitial error:', error);
          if (unsubscribeClosed) unsubscribeClosed();
          if (unsubscribeError) unsubscribeError();
          this.initInterstitial();
          resolve(false);
        });
      });
    } catch (error) {
      console.error('Show interstitial error:', error);
      return false;
    }
  }
}

export default AdMobService;