import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AdMobService from '../services/AdMobService';
import { SupabaseClient } from '@supabase/supabase-js';
import { TabState } from './types';
import { calculateNextLotteryDateString } from './TicketScreen';

// チケット獲得量定数
const TICKET_REWARD_AD = 200; 
const TICKET_REWARD_LOGIN = 200;

// 抽選ステータステーブルID定数
const LOTTERY_STATUS_ID = '00000000-0000-0000-0000-000000000000';

const TicketsTab = ({
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
  participantsCount,
  resultChecked,
  showResultButton,
  handleCheckResult
}) => {
  const [adLoading, setAdLoading] = useState(false);
  const [freeClaimAvailable, setFreeClaimAvailable] = useState(false);
  const [loginBonusAvailable, setLoginBonusAvailable] = useState(false);
  const [isLotteryRunning, setIsLotteryRunning] = useState(false);
  const [lotteryButtonDisabled, setLotteryButtonDisabled] = useState(false);
  const [isGlobalLotteryRunning, setIsGlobalLotteryRunning] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState(0);
  const [checkingLotteryResults, setCheckingLotteryResults] = useState(false);
  
  // refで状態管理
  const lastParticipantCheckTimeRef = useRef(0);
  const pollingIntervalRef = useRef(null);

  // 初期化時チェック
  useEffect(() => {
    if (effectiveUserId) {
      checkDailyFreeClaim();
      checkDailyLoginBonus();
      // 結果確認ボタンの表示は親コンポーネントから制御するため削除
    }
  }, [isAdFree, effectiveUserId]);

  // 広告サービス初期化
  useEffect(() => {
    const initializeAdService = async () => {
      try {
        if (!isAdFree) {
          const adMobService = await AdMobService.initialize();
          await adMobService.loadInterstitial();
        }
      } catch (error) {
        // エラー処理
      }
    };

    initializeAdService();
  }, [isAdFree]);

  // 抽選ステータスポーリング設定
  useEffect(() => {
    // 初回のステータスチェック
    checkLotteryStatus();
    
    // 10秒ごとにステータスをチェックするポーリング設定
    const interval = setInterval(() => {
      checkLotteryStatus();
    }, 10000);
    
    pollingIntervalRef.current = interval;
    
    // クリーンアップ
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [supabaseClient]);

  // 抽選ステータスチェック関数 - 修正済み
  const checkLotteryStatus = async () => {
    try {
      if (!supabaseClient) return;
      
      const now = Date.now();
      // 前回のチェックから3秒以内の場合はスキップ（過剰なリクエスト防止）
      if (now - lastCheckTime < 3000) return;
      
      setLastCheckTime(now);
      
      // lottery_statusテーブルを確認
      const { data, error } = await supabaseClient
        .from('lottery_status')
        .select('*')
        .eq('id', LOTTERY_STATUS_ID)
        .single();
        
      if (error) {
        console.error('Lottery status check error:', error);
        return;
      }
      
      // 抽選状態が変化したかチェック（実行中→完了の変化を検出）
      const wasRunning = isGlobalLotteryRunning;
      setIsGlobalLotteryRunning(data.is_running);
      
      // 抽選が完了した場合（実行中→完了への変化）
      if (wasRunning && !data.is_running) {
        console.log("Lottery status changed from running to completed");
        // 必要な情報を再読み込み
        await resetLotteryState();
        // 結果確認ボタンを表示するが、自動的に結果は確認しない
        // 親コンポーネントのステートを使用
      }
      
      // 抽選が実行されたばかりの場合も確認
      if (data.last_executed_at) {
        const lastExecTime = new Date(data.last_executed_at).getTime();
        
        // 30秒以内に実行された場合
        if (now - lastExecTime < 30000) {
          console.log("Recent lottery execution detected");
          // 必要な情報を再読み込み
          await resetLotteryState();
          // 抽選結果確認ボタンを表示（親コンポーネントのメソッドを使用）
        }
      }
    } catch (error) {
      console.error('Lottery status check error:', error);
    }
  };

  // 抽選結果確認ボタンのハンドラ - 親コンポーネントの関数を呼び出すように変更
  const handleCheckLotteryResult = async () => {
    if (!supabaseClient || !effectiveUserId) {
      Alert.alert('エラー', 'システムの初期化中です。しばらくお待ちください。');
      return;
    }

    setCheckingLotteryResults(true);
    
    try {
      // 親コンポーネントのハンドラを呼び出す
      await handleCheckResult();
    } catch (error) {
      console.error('Check result error:', error);
      Alert.alert('エラー', '抽選結果の確認中にエラーが発生しました。');
    } finally {
      setCheckingLotteryResults(false);
    }
  };

  // 参加者数確認
  const checkParticipants = async () => {
    try {
      const now = Date.now();
      if (now - lastParticipantCheckTimeRef.current < 30000) {
        return participantsCount;
      }
      
      if (!supabaseClient) {
        return 0;
      }
      
      lastParticipantCheckTimeRef.current = Date.now();
      
      const { dateISO } = calculateNextLotteryDateString();
      
      const response = await supabaseClient
        .from('lottery_participants')
        .select('*', { count: 'exact', head: true })
        .eq('lottery_date', dateISO);
        
      const { count, error } = response;
      
      if (error) {
        throw error;
      }
      
      return count || 0;
    } catch (error) {
      return 0;
    }
  };

  // 1日1回無料ポイントチェック
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
      setFreeClaimAvailable(false);
    }
  };

  // ログインボーナスチェック
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
      setLoginBonusAvailable(false);
    }
  };

  // ログインボーナス受け取り
  const handleClaimLoginBonus = async () => {
    try {
      await onAddTickets(TICKET_REWARD_LOGIN);
      
      const today = new Date().toISOString().split('T')[0];
      await AsyncStorage.setItem('lastLoginBonusDate', today);
      
      setLoginBonusAvailable(false);
      Alert.alert('ログインボーナス獲得', `本日のログインボーナス${TICKET_REWARD_LOGIN}チケットを獲得しました！`);
    } catch (error) {
      Alert.alert('エラー', 'ログインボーナス獲得中にエラーが発生しました');
    }
  };

  // 広告表示処理
  const handleWatchAd = async () => {
    try {
      setAdLoading(true);
      
      if (isAdFree && freeClaimAvailable) {
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
        await onAddTickets(TICKET_REWARD_AD);
        Alert.alert('チケット獲得', `広告視聴で${TICKET_REWARD_AD}チケットを獲得しました！`);
      } else {
        Alert.alert('お知らせ', '広告の読み込みに失敗しました。時間をおいて再度お試しください。');
      }
    } catch (error) {
      Alert.alert('エラー', '広告表示中にエラーが発生しました');
    } finally {
      setAdLoading(false);
    }
  };

  // 抽選実行ボタンのハンドラ
  const handleRunLottery = async () => {
    if (!supabaseClient || !effectiveUserId) {
      Alert.alert('エラー', 'システムの初期化中です。しばらくお待ちください。');
      return;
    }
    
    // ボタンを無効化して二重クリック防止
    setLotteryButtonDisabled(true);
    setIsLotteryRunning(true);
    
    try {
      // 参加者数確認
      const participantCount = await checkParticipants();
      
      // 参加者がいない場合は抽選スキップ
      if (participantCount <= 0) {
        Alert.alert('抽選中止', '現在の抽選に参加者がいません。参加者がいる場合にのみ抽選が実行されます。');
        setIsLotteryRunning(false);
        setLotteryButtonDisabled(false);
        return;
      }

      // 全体の抽選ステータスを「実行中」に設定
      const { error: statusError } = await supabaseClient
        .from('lottery_status')
        .update({ 
          is_running: true,
          executed_by: effectiveUserId
        })
        .eq('id', LOTTERY_STATUS_ID);
      
      if (statusError) {
        throw new Error('抽選ステータスの更新に失敗しました');
      }
      
      // ユーザーに抽選開始を通知
      Alert.alert('抽選開始', '抽選を開始します。結果をお待ちください...');
      
      const { dateISO } = calculateNextLotteryDateString();
      
      // 参加者データ取得
      const participantsResponse = await supabaseClient
        .from('lottery_participants')
        .select('*')
        .eq('lottery_date', dateISO);
      
      const { data: participants, error: fetchError } = participantsResponse;
        
      if (fetchError) {
        throw new Error(`参加者の取得に失敗しました: ${JSON.stringify(fetchError)}`);
      }
      
      if (!participants || participants.length === 0) {
        throw new Error('参加者データが存在しないか空です');
      }
      
      let winner;
      
      // 参加者が1人の場合はその人を当選者に
      if (participants.length === 1) {
        winner = participants[0];
      } else {
        // 複数参加者がいる場合はランダム選択
        const randomIndex = Math.floor(Math.random() * participants.length);
        winner = participants[randomIndex];
      }
      
      let resultSaved = false;
      let resultRecord = null;
      
      try {
        // 抽選結果をDBに記録
        const insertData = {
          lottery_date: dateISO,
          winner_id: winner.user_id,
          total_participants: participants.length,
          created_at: new Date().toISOString(),
          prize_claimed: false
        };
        
        const resultResponse = await supabaseClient
          .from('lottery_results')
          .insert([insertData])
          .select()
          .single();
          
        const { data, error: resultError } = resultResponse;
          
        if (!resultError) {
          resultSaved = true;
          resultRecord = data;
        }
      } catch (dbError) {
        Alert.alert('データベースエラー', '操作中にエラーが発生しました');
      }
      
      // 自分が当選者かチェック
      const isCurrentUserWinner = effectiveUserId === winner.user_id;
      
      // 抽選終了後、状態リセット
      try {
        await resetLotteryState();
        
        // 参加者レコードを削除
        const deleteResponse = await supabaseClient
          .from('lottery_participants')
          .delete()
          .eq('lottery_date', dateISO);
      } catch (resetError) {
        // エラー処理
        console.error('Lottery reset error:', resetError);
      }
      
      // 全体の抽選ステータスを「完了」に更新
      await supabaseClient
        .from('lottery_status')
        .update({ 
          is_running: false,
          last_executed_at: new Date().toISOString()
        })
        .eq('id', LOTTERY_STATUS_ID);
      
      // 結果は明かさず、確認ボタンを表示するよう親コンポーネントに通知
      
      // 結果表示
      setTimeout(() => {
        // 結果は明かさず、抽選完了のみ通知
        Alert.alert(
          '抽選完了', 
          '抽選が完了しました。「抽選結果を確認する」ボタンで結果を確認できます。',
          [{ text: 'OK' }]
        );
        
        // 状態リセット
        setIsLotteryRunning(false);
        setLotteryButtonDisabled(false);
      }, 2000);
      
    } catch (error) {
      console.error('Lottery execution error:', error);
      Alert.alert('エラー', '抽選処理中にエラーが発生しました');
      
      // エラー時も抽選ステータスをリセット
      try {
        await supabaseClient
          .from('lottery_status')
          .update({ 
            is_running: false,
            last_executed_at: new Date().toISOString()
          })
          .eq('id', LOTTERY_STATUS_ID);
      } catch (resetError) {
        console.error('Status reset error:', resetError);
      }
      
      // エラー時も状態リセット
      setIsLotteryRunning(false);
      setLotteryButtonDisabled(false);
    }
  };

  return (
    <ScrollView style={styles.content}>
      {/* 抽選情報セクション */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>抽選情報</Text>
        
        <View style={styles.lotteryInfoBox}>
          <Text style={styles.participantsInfo}>
            現在の参加者数: <Text style={styles.participantsCount}>{participantsCount}人</Text>
          </Text>
          <Text style={styles.winningOddsInfo}>
            当選確率: <Text style={styles.winningOdds}>
              {participantsCount > 0 ? `1/${participantsCount}` : '- '}
            </Text>
          </Text>
          
          <TouchableOpacity 
            style={[
              styles.runLotteryButton,
              (isLotteryRunning || lotteryButtonDisabled || isGlobalLotteryRunning) && styles.disabledButton
            ]} 
            onPress={handleRunLottery}
            disabled={isLotteryRunning || lotteryButtonDisabled || isGlobalLotteryRunning}
          >
            {isLotteryRunning || isGlobalLotteryRunning ? (
              <>
                <ActivityIndicator color="#fff" size="small" style={styles.buttonSpinner} />
                <Text style={styles.runLotteryText}>
                  {isGlobalLotteryRunning ? '抽選実行中...' : '抽選処理中...'}
                </Text>
              </>
            ) : (
              <>
                <Image 
                  source={require('../../assets/AppIcon/ticket.png')} 
                  style={styles.runLotteryIcon} 
                />
                <Text style={styles.runLotteryText}>抽選を実行する</Text>
              </>
            )}
          </TouchableOpacity>

          {/* 抽選結果確認ボタン - 親コンポーネントの状態を使用 */}
          {showResultButton && (
            <TouchableOpacity 
              style={[
                styles.checkResultButton,
                checkingLotteryResults && styles.disabledButton
              ]} 
              onPress={handleCheckLotteryResult}
              disabled={checkingLotteryResults}
            >
              {checkingLotteryResults ? (
                <>
                  <ActivityIndicator color="#fff" size="small" style={styles.buttonSpinner} />
                  <Text style={styles.checkResultText}>確認中...</Text>
                </>
              ) : (
                <>
                  <Image 
                    source={require('../../assets/AppIcon/ticket.png')} 
                    style={styles.checkResultIcon} 
                  />
                  <Text style={styles.checkResultText}>抽選結果を確認する</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
        
        <Text style={styles.lotteryNote}>
          ※ボタンを押すと抽選が実行されます。参加者の中から1名がランダムに選ばれます。
          {isGlobalLotteryRunning && '\n他のユーザーが抽選を実行中です。しばらくお待ちください。'}
        </Text>
      </View>
    
      {/* ログインボーナスセクション */}
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
            <Text style={styles.rewardName}>抽選に参加する</Text>
            <Text style={styles.rewardDesc}>
              {isParticipating 
                ? '今回の抽選にすでに参加しています' 
                : '100チケットで抽選に参加（当選確率 1/' + (participantsCount > 0 ? participantsCount : 1) + '）'}
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
          ※毎回1名様にBrawl Starsパスが当たります！抽選はボタンを押すと実行され、参加者の中から1名のみ選ばれます。チケット100枚で応募でき、当選確率は応募者数で決まります。
        </Text>
      </View>
      
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
  // 抽選情報ボックスのスタイル
  lotteryInfoBox: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  participantsInfo: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  participantsCount: {
    fontWeight: 'bold',
    color: '#21A0DB',
  },
  winningOddsInfo: {
    fontSize: 16,
    color: '#555',
    marginBottom: 16,
  },
  winningOdds: {
    fontWeight: 'bold',
    color: '#FF9800',
  },
  runLotteryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF5722',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    width: '100%',
    marginTop: 8,
    marginBottom: 8,
  },
  // 抽選結果確認ボタン
  checkResultButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#21A0DB',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: '100%',
    marginTop: 8,
  },
  checkResultIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
    marginRight: 8,
  },
  checkResultText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  runLotteryIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
    marginRight: 12,
  },
  runLotteryText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  buttonSpinner: {
    marginRight: 10,
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
  lotteryNote: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  }
});

export default TicketsTab;