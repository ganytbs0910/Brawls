import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useAppTranslation } from '../i18n/app';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AdMobService from '../services/AdMobService';

interface TicketScreenProps {
  isAdFree: boolean;
  tickets: number;
  onUseTicket: () => Promise<boolean>;
  onAddTickets: (amount: number) => Promise<void>;
}

const TicketScreen: React.FC<TicketScreenProps> = ({
  isAdFree,
  tickets,
  onUseTicket,
  onAddTickets,
}) => {
  const { t } = useAppTranslation();
  const [adLoading, setAdLoading] = useState(false);
  const [freeClaimAvailable, setFreeClaimAvailable] = useState(false);

  // 課金ユーザー向けの1日1回無料ポイント機能のチェック
  useEffect(() => {
    checkDailyFreeClaim();
  }, [isAdFree]);

  // 1日1回の無料ポイントが利用可能かチェックする
  const checkDailyFreeClaim = async () => {
    if (!isAdFree) {
      setFreeClaimAvailable(false);
      return;
    }

    try {
      const lastClaimDate = await AsyncStorage.getItem('lastFreeClaimDate');
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD形式
      
      if (!lastClaimDate || lastClaimDate !== today) {
        setFreeClaimAvailable(true);
      } else {
        setFreeClaimAvailable(false);
      }
    } catch (error) {
      console.error('Free claim check error:', error);
      setFreeClaimAvailable(false);
    }
  };

  // インタースティシャル広告を表示する処理
  const handleWatchAd = async () => {
    try {
      setAdLoading(true);
      
      // 課金ユーザーで無料ポイント入手可能な場合
      if (isAdFree && freeClaimAvailable) {
        await onAddTickets(10);
        // 今日の日付を保存
        const today = new Date().toISOString().split('T')[0];
        await AsyncStorage.setItem('lastFreeClaimDate', today);
        setFreeClaimAvailable(false);
        Alert.alert('チケット獲得', '本日の無料チケット10枚を獲得しました！');
        return;
      }
      
      // 広告サービスのインスタンスを初期化して取得
      let adMobService;
      try {
        adMobService = AdMobService.getInstance();
      } catch (error) {
        // インスタンスが初期化されていない場合は初期化する
        adMobService = await AdMobService.initialize();
      }
      
      // インタースティシャル広告を表示
      const adShown = await adMobService.showInterstitial();
      
      if (adShown) {
        // 広告表示成功時にチケットを付与
        await onAddTickets(10);
        Alert.alert('チケット獲得', '広告視聴で10チケットを獲得しました！');
      } else {
        Alert.alert('お知らせ', '広告の読み込みに失敗しました。時間をおいて再度お試しください。');
      }
    } catch (error) {
      console.error('Ad watching error:', error);
      Alert.alert('エラー', '広告表示中にエラーが発生しました');
    } finally {
      setAdLoading(false);
    }
  };

  // チケットを使用する処理
  const handleUseTickets = async () => {
    if (tickets >= 100) {
      const success = await onUseTicket();
      if (success) {
        Alert.alert('成功', 'チケットを使用しました');
      }
    } else {
      Alert.alert('エラー', 'チケットが足りません');
    }
  };

  // 広告サービスの初期化と次回広告が表示可能かどうかを先読みする
  useEffect(() => {
    const initializeAdService = async () => {
      try {
        if (!isAdFree) {
          // 広告サービスを初期化
          const adMobService = await AdMobService.initialize();
          
          // インタースティシャル広告を事前に読み込む
          await adMobService.loadInterstitial();
        }
      } catch (error) {
        console.error('Ad initialization error:', error);
      }
    };

    initializeAdService();
  }, [isAdFree]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>チケット</Text>
        <View style={styles.ticketContainer}>
          <Image 
            source={require('../../assets/AppIcon/ticket.png')} 
            style={styles.ticketIcon} 
          />
          <Text style={styles.ticketCount}>{tickets}</Text>
        </View>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>チケットを獲得</Text>
          
          <TouchableOpacity 
            style={[styles.actionButton, adLoading && styles.disabledButton]} 
            onPress={handleWatchAd}
            disabled={adLoading}
          >
            <Image source={require('../../assets/AppIcon/ticket.png')} style={styles.actionIcon} />
            <Text style={styles.actionText}>
              {isAdFree && freeClaimAvailable 
                ? '本日の無料チケットを受け取る (+10)' 
                : '広告を見る (+10)'}
            </Text>
            {adLoading && <Text style={styles.loadingText}>読み込み中...</Text>}
          </TouchableOpacity>

          {isAdFree && !freeClaimAvailable && (
            <Text style={styles.freeClaimInfo}>
              本日の無料チケットはすでに受け取り済みです。明日また来てください。
            </Text>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>チケットを使用</Text>
          
          <TouchableOpacity 
            style={[
              styles.rewardItem, 
              tickets < 100 && styles.disabledReward
            ]} 
            onPress={handleUseTickets}
            disabled={tickets < 100}
          >
            <Image source={require('../../assets/AppIcon/ticket.png')} style={styles.rewardIcon} />
            <View style={styles.rewardInfo}>
              <Text style={styles.rewardName}>スペシャルアイテム</Text>
              <Text style={styles.rewardDesc}>限定コンテンツを入手</Text>
            </View>
            <View style={styles.costContainer}>
              <Image source={require('../../assets/AppIcon/ticket.png')} style={styles.smallTicket} />
              <Text style={styles.costText}>100</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#21A0DB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  ticketContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  ticketIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
    marginRight: 6,
  },
  ticketCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#65BBE9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  disabledButton: {
    opacity: 0.7,
    backgroundColor: '#a0a0a0',
  },
  actionIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
    marginRight: 12,
  },
  actionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  loadingText: {
    fontSize: 12,
    color: '#fff',
    marginLeft: 8,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  disabledReward: {
    opacity: 0.6,
  },
  rewardIcon: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  rewardDesc: {
    fontSize: 12,
    color: '#777',
  },
  costContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  smallTicket: {
    width: 16,
    height: 16,
    tintColor: '#21A0DB',
    marginRight: 4,
  },
  costText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#21A0DB',
  },
  freeClaimInfo: {
    fontSize: 12,
    color: '#777',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default TicketScreen;