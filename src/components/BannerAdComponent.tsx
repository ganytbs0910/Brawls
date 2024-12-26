import React from 'react';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { Platform } from 'react-native';
import { AD_CONFIG } from '../config/AdConfig';

export const BannerAdComponent = () => {
  // TestIdsを使用しない
  return (
    <BannerAd
      unitId={AD_CONFIG.IOS_BANNER_ID}
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
    />
  );
};