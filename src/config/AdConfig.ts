import { TestIds } from 'react-native-google-mobile-ads';

const isDevelopment = __DEV__;

export const AD_CONFIG = {
  IOS_APP_ID: isDevelopment 
    ? TestIds.APP 
    : 'ca-app-pub-4317478239934902~6966717306',
  IOS_INTERSTITIAL_ID: isDevelopment 
    ? TestIds.INTERSTITIAL 
    : 'ca-app-pub-4317478239934902/8782634924',
  IOS_BANNER_ID: isDevelopment 
    ? TestIds.BANNER 
    : 'ca-app-pub-4317478239934902/5594861664',
  IOS_REWARDED_ID: isDevelopment 
    ? TestIds.REWARDED 
    : 'ca-app-pub-4317478239934902/4496232521',
} as const;