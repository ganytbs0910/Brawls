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
      this.interstitial = InterstitialAd.createForAdRequest(this.interstitialAdUnitId, {
        requestNonPersonalizedAdsOnly: true,
      });
    } catch (error) {
      console.error('Interstitial initialization error:', error);
    }
  }

  async loadInterstitial(): Promise<boolean> {
    if (!this.interstitial || this.isLoading) return false;

    try {
      this.isLoading = true;
      const loadPromise = new Promise<boolean>((resolve) => {
        this.interstitial?.addAdEventListener(AdEventType.LOADED, () => {
          this.isLoading = false;
          resolve(true);
        });
        
        this.interstitial?.addAdEventListener(AdEventType.ERROR, () => {
          this.isLoading = false;
          resolve(false);
        });
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

      return new Promise((resolve) => {
        this.interstitial?.addAdEventListener(AdEventType.CLOSED, () => {
          this.initInterstitial();
          resolve(true);
        });
        
        this.interstitial?.show();
      });
    } catch (error) {
      console.error('Show interstitial error:', error);
      return false;
    }
  }
}

export default AdMobService;