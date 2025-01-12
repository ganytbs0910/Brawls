import React from 'react';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { Platform } from 'react-native';
import { AD_CONFIG } from '../config/AdConfig';

export const BannerAdComponent = () => {
  const bannerAdUnitId = Platform.select({
    ios: AD_CONFIG.IOS_BANNER_ID,
    android: AD_CONFIG.ANDROID_BANNER_ID,
  }) as string;

  return (
    <BannerAd
      unitId={bannerAdUnitId}
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
    />
  );
};