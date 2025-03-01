import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AdMobService from '../services/AdMobService';
import { SupabaseClient } from '@supabase/supabase-js';
import { TabState } from './types';
import { calculateNextLotteryDateString } from './TicketScreen';

interface TicketsTabProps {
  tickets: number;
  isAdFree: boolean;
  onAddTickets: (amount: number) => Promise<void>;
  handleEnterLottery: () => Promise<void>;
  isParticipating: boolean;
  supabaseClient: SupabaseClient | null;
  effectiveUserId: string | null;
  resetLotteryState: () => Promise<void>;
  setHasPrize: React.Dispatch<React.SetStateAction<boolean>>;
  setPrizeInfo: React.Dispatch<React.SetStateAction<any>>;
  setActiveTab: React.Dispatch<React.SetStateAction<TabState>>;
  participantsCount: number;
}

const TicketsTab: React.FC<TicketsTabProps> = ({
  tickets,
  isAdFree,
  onAddTickets,
  handleEnterLottery,
  isParticipating,
  supabaseClient,
  effectiveUserId,
  resetLotteryState,
  setHasPrize,
  setPrizeInfo,
  setActiveTab,
  participantsCount
}) => {
  const [adLoading, setAdLoading] = useState(false);
  const [freeClaimAvailable, setFreeClaimAvailable] = useState(false);
  const [loginBonusAvailable, setLoginBonusAvailable] = useState(false);
  const [testLotteryRunning, setTestLotteryRunning] = useState(false);
  const [testLotteryCountdown, setTestLotteryCountdown] = useState(10);

  // チケット獲得量の定数
  const TICKET_REWARD_AD = 20; // 広告視聴で獲得するチケット数
  const TICKET_REWARD_LOGIN = 20; // ログインボーナスで獲得するチケット数

  // 初期化時に各種チェックを実行
  useEffect(() => {
    if (effectiveUserId) {
      checkDailyFreeClaim();
      checkDailyLoginBonus();
    }
  }, [isAdFree, effectiveUserId]);

  // 広告サービスの初期化
  useEffect(() => {
    const initializeAdService = async () => {
      try {
        if (!isAdFree) {
          const adMobService = await AdMobService.initialize();
          await adMobService.loadInterstitial();
        }
      } catch (error) {
        // 不要なログを削除
      }
    };

    initializeAdService();
  }, [isAdFree]);

  // テスト抽選のカウントダウンを処理するエフェクト
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (testLotteryRunning && testLotteryCountdown > 0) {
      timer = setTimeout(() => {
        setTestLotteryCountdown(prev => prev - 1);
      }, 1000);
    } else if (testLotteryRunning && testLotteryCountdown === 0) {
      runTestLottery();
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [testLotteryRunning, testLotteryCountdown]);

  // 1日1回の無料ポイントが利用可能かチェックする（課金ユーザー向け）
  const checkDailyFreeClaim = async () => {
    if (!isAdFree) {
      setFreeClaimAvailable(false);
      return;
    }

    try {
      const lastClaimDate = await AsyncStorage.getItem('lastFreeClaimDate');
      const today = new Date().toISOString().split('T')[0];
      
      if (!lastClaimDate || lastClaimDate !== today) {
        setFreeClaimAvailable(true);
      } else {
        setFreeClaimAvailable(false);
      }
    } catch (error) {
      // 不要なログを削除
      setFreeClaimAvailable(false);
    }
  };

  // 1日1回のログインボーナスが利用可能かチェックする（全ユーザー向け）
  const checkDailyLoginBonus = async () => {
    try {
      const lastLoginBonusDate = await AsyncStorage.getItem('lastLoginBonusDate');
      const today = new Date().toISOString().split('T')[0];
      
      if (!lastLoginBonusDate || lastLoginBonusDate !== today) {
        setLoginBonusAvailable(true);
      } else {
        setLoginBonusAvailable(false);
      }
    } catch (error) {
      // 不要なログを削除
      setLoginBonusAvailable(false);
    }
  };

  // ログインボーナスを受け取る処理
  const handleClaimLoginBonus = async () => {
    try {
      // ログインボーナスとして20チケットを付与
      await onAddTickets(TICKET_REWARD_LOGIN);
      
      // 今日の日付を保存
      const today = new Date().toISOString().split('T')[0];
      await AsyncStorage.setItem('lastLoginBonusDate', today);
      
      setLoginBonusAvailable(false);
      Alert.alert('ログインボーナス獲得', `本日のログインボーナス${TICKET_REWARD_LOGIN}チケットを獲得しました！`);
    } catch (error) {
      // 不要なログを削除
      Alert.alert('エラー', 'ログインボーナス獲得中にエラーが発生しました');
    }
  };

  // インタースティシャル広告を表示する処理
  const handleWatchAd = async () => {
    try {
      setAdLoading(true);
      
      if (isAdFree && freeClaimAvailable) {
        // 無料チケット20枚を付与
        await onAddTickets(TICKET_REWARD_AD);
        const today = new Date().toISOString().split('T')[0];
        await AsyncStorage.setItem('lastFreeClaimDate', today);
        setFreeClaimAvailable(false);
        Alert.alert('チケット獲得', `本日の無料チケット${TICKET_REWARD_AD}枚を獲得しました！`);
        return;
      }
      
      let adMobService;
      try {
        adMobService = AdMobService.getInstance();
      } catch (error) {
        adMobService = await AdMobService.initialize();
      }
      
      const adShown = await adMobService.showInterstitial();
      
      if (adShown) {
        // 広告視聴で20チケットを付与
        await onAddTickets(TICKET_REWARD_AD);
        Alert.alert('チケット獲得', `広告視聴で${TICKET_REWARD_AD}チケットを獲得しました！`);
      } else {
        Alert.alert('お知らせ', '広告の読み込みに失敗しました。時間をおいて再度お試しください。');
      }
    } catch (error) {
      // 不要なログを削除
      Alert.alert('エラー', '広告表示中にエラーが発生しました');
    } finally {
      setAdLoading(false);
    }
  };

  // テスト抽選ボタンを押した時の処理
  const handleTestLottery = () => {
    if (!supabaseClient) {
      Alert.alert('エラー', 'データベース接続が確立されていません');
      return;
    }
    
    setTestLotteryRunning(true);
    setTestLotteryCountdown(10);
    Alert.alert('テスト抽選開始', '10秒後に抽選が実行されます！');
  };
  
  // 実際にテスト抽選を実行する関数
  const runTestLottery = async () => {
    try {
      if (!supabaseClient || !effectiveUserId) {
        throw new Error('データベース接続またはユーザーIDが確立されていません');
      }
      
      if (participantsCount <= 0) {
        Alert.alert('抽選中止', '抽選参加者がいません');
        setTestLotteryRunning(false);
        return;
      }
      
      const { dateISO } = calculateNextLotteryDateString();
      
      // 1. すべての参加者を取得
      const { data: participants, error: fetchError } = await supabaseClient
        .from('lottery_participants')
        .select('*')
        .eq('lottery_date', dateISO);
        
      if (fetchError || !participants || participants.length === 0) {
        throw new Error('参加者の取得に失敗しました');
      }
      
      let winner;
      
      // 参加者が1人の場合はその人を当選者にする
      if (participants.length === 1) {
        winner = participants[0];
      } else {
        // 複数参加者がいる場合はランダム選択
        const randomIndex = Math.floor(Math.random() * participants.length);
        winner = participants[randomIndex];
      }
      
      try {
        // 2. 抽選結果をDBに記録 - 既存のテーブル構造に合わせて項目を絞る
        const { data: resultRecord, error: resultError } = await supabaseClient
          .from('lottery_results')
          .insert([
            {
              lottery_date: dateISO,
              winner_id: winner.user_id,
              total_participants: participants.length,
              created_at: new Date().toISOString(),
              prize_claimed: false
            }
          ])
          .select()
          .single();
          
        if (resultError) {
          throw new Error('抽選結果の保存に失敗しました');
        }
        
      } catch (dbError) {
        // 不要なログを削除
        Alert.alert('データベースエラー', '操作中にエラーが発生しました');
        
        // DB操作が失敗しても抽選自体は完了したものとして処理を続行
      }
      
      // 3. 自分が当選者かどうかをチェック
      const isCurrentUserWinner = effectiveUserId === winner.user_id;
      
      // 4. 抽選終了後、抽選参加状態をリセット
      await AsyncStorage.removeItem('lotteryParticipation');
      
      // 参加者レコードを削除（すべてのユーザーが再度参加できるようにする）
      const { error: deleteError } = await supabaseClient
        .from('lottery_participants')
        .delete()
        .eq('lottery_date', dateISO);
      
      // 5. 成功通知 - 自分が当選した場合は特別な演出を表示
      if (isCurrentUserWinner) {
        // 特別な当選演出 - 画面全体に大きく表示
        Alert.alert(
          '🎉🎉🎉 あなたが当選しました！ 🎉🎉🎉', 
          '✨✨ おめでとうございます！ ✨✨\n\nあなたが当選者に選ばれました！\n豪華景品が贈られます！',
          [
            {
              text: '受け取る！',
              onPress: () => {
                // 当選タブを表示する
                setPrizeInfo({
                  id: Date.now().toString(),
                  date: new Date().toISOString()
                });
                setHasPrize(true);
                setActiveTab(TabState.PRIZE);
              },
              style: 'default'
            }
          ],
          { cancelable: false }
        );
      } else {
        // 通常の完了通知 - 自分が当選していないことを明示
        Alert.alert(
          '抽選完了', 
          `参加者${participants.length}名の中から1名が選ばれました。\n\n残念ながら、あなたは当選しませんでした。\n\n当選者ID: ${winner.user_id}\n\n抽選がリセットされました。再度参加できます。`,
          [
            {
              text: '次回に期待',
              style: 'default'
            }
          ]
        );
      }
      
    } catch (error) {
      // 不要なログを削除
      Alert.alert('エラー', '抽選処理中にエラーが発生しました');
    } finally {
      // 状態をリセット
      setTestLotteryRunning(false);
      setTestLotteryCountdown(10);
      
      // 抽選に再度参加できるようにする
      resetLotteryState();
    }
  };

  return (
    <ScrollView style={styles.content}>
      {/* テスト抽選ボタンセクション */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>テスト抽選</Text>
        
        <TouchableOpacity 
          style={[
            styles.actionButton, 
            styles.testLotteryButton,
            testLotteryRunning && styles.disabledButton
          ]} 
          onPress={handleTestLottery}
          disabled={testLotteryRunning}
        >
          <Image 
            source={require('../../assets/AppIcon/ticket.png')} 
            style={styles.actionIcon} 
          />
          <Text style={styles.actionText}>
            {testLotteryRunning 
              ? `テスト抽選実行まで: ${testLotteryCountdown}秒` 
              : 'テスト抽選を実行する'}
          </Text>
          {testLotteryRunning && (
            <ActivityIndicator 
              size="small" 
              color="#FFFFFF" 
              style={styles.spinner} 
            />
          )}
        </TouchableOpacity>
        
        <Text style={styles.testLotteryNote}>
          ※このボタンを押すと10秒後に実際の参加者の中から1名が選ばれ、当選メッセージが送信されます。
        </Text>
      </View>
    
      {/* ログインボーナスセクション - 全ユーザー向け */}
      {loginBonusAvailable && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ログインボーナス</Text>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.loginBonusButton]} 
            onPress={handleClaimLoginBonus}
          >
            <Image 
              source={require('../../assets/AppIcon/ticket.png')} 
              style={styles.actionIcon} 
            />
            <Text style={styles.actionText}>
              本日のログインボーナスを受け取る (+{TICKET_REWARD_LOGIN})
            </Text>
          </TouchableOpacity>
        </View>
      )}
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>チケットを獲得</Text>
        
        <TouchableOpacity 
          style={[styles.actionButton, adLoading && styles.disabledButton]} 
          onPress={handleWatchAd}
          disabled={adLoading}
        >
          <Image 
            source={require('../../assets/AppIcon/ticket.png')} 
            style={styles.actionIcon} 
          />
          <Text style={styles.actionText}>
            {isAdFree && freeClaimAvailable 
              ? `本日の無料チケットを受け取る (+${TICKET_REWARD_AD})` 
              : `広告を見る (+${TICKET_REWARD_AD})`}
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
        <Text style={styles.sectionTitle}>抽選に参加</Text>
        
        <TouchableOpacity 
          style={[
            styles.rewardItem, 
            (tickets < 100 || isParticipating) && styles.disabledReward
          ]} 
          onPress={handleEnterLottery}
          disabled={tickets < 100 || isParticipating}
        >
          <Image 
            source={require('../../assets/AppIcon/ticket.png')} 
            style={styles.rewardIcon} 
          />
          <View style={styles.rewardInfo}>
            <Text style={styles.rewardName}>ウィークリー抽選</Text>
            <Text style={styles.rewardDesc}>
              {isParticipating 
                ? '今週の抽選にすでに参加しています' 
                : '100チケットで週間抽選に参加'}
            </Text>
          </View>
          <View style={styles.costContainer}>
            <Image 
              source={require('../../assets/AppIcon/ticket.png')} 
              style={styles.smallTicket} 
            />
            <Text style={styles.costText}>100</Text>
          </View>
        </TouchableOpacity>
        
        <Text style={styles.lotteryNote}>
          ※毎週日曜21時に抽選が行われ、参加者の中から1名様に豪華景品をプレゼント！
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
  loginBonusButton: {
    backgroundColor: '#4CAF50', // 緑色でログインボーナスを区別
  },
  testLotteryButton: {
    backgroundColor: '#FF9800', // オレンジ色でテスト抽選ボタンを区別
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
  spinner: {
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
  lotteryNote: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  testLotteryNote: {
    fontSize: 12,
    color: '#FF5722',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default TicketsTab;