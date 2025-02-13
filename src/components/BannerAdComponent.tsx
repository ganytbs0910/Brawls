import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { AD_CONFIG } from '../config/AdConfig';

export const BannerAdComponent = () => {
  const [adHeight, setAdHeight] = useState(0);
  const [adError, setAdError] = useState(false);

  const bannerAdUnitId = Platform.select({
    ios: AD_CONFIG.IOS_BANNER_ID,
    android: AD_CONFIG.ANDROID_BANNER_ID,
    default: TestIds.BANNER,
  }) as string;

  return (
    <View style={[styles.adContainer, { height: adHeight }]}>
      <BannerAd
        unitId={bannerAdUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
          keywords: ['game', 'mobile game']
        }}
        onAdFailedToLoad={(error) => {
          console.error('Banner ad failed to load:', error);
          setAdError(true);
          setAdHeight(0);
        }}
        onAdLoaded={() => {
          setAdError(false);
          // バナーサイズに基づいて適切な高さを設定
          setAdHeight(50);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  adContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginBottom: Platform.OS === 'ios' ? 8 : 0,
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 55 : 48, // タブバーにより近い位置に調整
  }
});