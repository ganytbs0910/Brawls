// TicketsTab.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SupabaseClient } from '@supabase/supabase-js';
import { calculateNextLotteryDateString } from './TicketScreen';
import AdMobService from '../services/AdMobService';
import TimeService from '../services/TimeService';

// 定数を1箇所にまとめる
const CONSTANTS = {
  TICKET_REWARD_AD: 200,
  TICKET_REWARD_LOGIN: 200,
  LOTTERY_STATUS_ID: '00000000-0000-0000-0000-000000000000',
  RESULT_CHECKED_KEY: 'lottery_result_checked',
  TICKET_COST_TO_ENTER: 100,
  POLLING_INTERVAL: 30000, // 30秒
  MIN_CHECK_INTERVAL: 5000, // 5秒
  BONUS_COOLDOWN_HOURS: 20, // ボーナスクールダウン時間（時間）
};

// 画像パスを一元管理
const IMAGES = {
  TICKET: require('../../assets/AppIcon/ticket.png'),
  CLOCK: require('../../assets/AppIcon/ticket.png'),
};

// TicketsTabのプロップス型定義
interface TicketsTabProps {
  tickets: number;
  isAdFree: boolean;
  onAddTickets: (amount: number) => Promise<void>;
  handleEnterLottery: () => Promise<void>;
  isParticipating: boolean;
  supabaseClient: SupabaseClient | null;
  effectiveUserId: string | null;
  resetLotteryState: () => Promise<void>;
  setHasPrize: (hasPrize: boolean) => void;
  setPrizeInfo: (prizeInfo: any) => void;
  setActiveTab: (tab: string) => void;
  participantsCount: number;
  resultChecked: boolean;
  showResultButton: boolean;
  handleCheckResult: () => Promise<void>;
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
  participantsCount,
  resultChecked,
  showResultButton,
  handleCheckResult
}) => {
  // 状態管理をシンプル化
  const [adLoading, setAdLoading] = useState<boolean>(false);
  const [bonusState, setBonusState] = useState({
    freeClaimAvailable: false,
    loginBonusAvailable: false,
    timeToNextFreeClaim: '',
    timeToNextLogin: ''
  });
  const [lotteryState, setLotteryState] = useState({
    isRunning: false,
    isGlobalRunning: false,
    buttonDisabled: false,
    checkingResults: false,
    lastCheckTime: 0
  });
  const [timeSyncState, setTimeSyncState] = useState({
    initialized: false,
    syncSuccessful: false
  });
  
  // 現在時刻の状態
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  
  // 時間更新用タイマー参照
  const timeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const bonusTimerRef = useRef<NodeJS.Timeout | null>(null);

  // ボーナス状態を更新する関数
  const updateBonusState = useCallback(async () => {
    if (!effectiveUserId) {
      setBonusState({
        freeClaimAvailable: false,
        loginBonusAvailable: false,
        timeToNextFreeClaim: '',
        timeToNextLogin: ''
      });
      return;
    }

    try {
      const userId = effectiveUserId;
      
      // TimeServiceが同期に成功したか確認
      const syncSuccessful = TimeService.isSyncSuccessful();
      setTimeSyncState(prev => ({ ...prev, syncSuccessful }));
      
      if (!syncSuccessful) {
        setBonusState({
          freeClaimAvailable: false,
          loginBonusAvailable: false,
          timeToNextFreeClaim: 'インターネット接続エラー',
          timeToNextLogin: 'インターネット接続エラー'
        });
        return;
      }
      
      // 各ボーナスの受け取り可否を確認
      const canClaimFree = await TimeService.canClaimDailyBonus(userId, 'freeClaim');
      const canClaimLogin = await TimeService.canClaimDailyBonus(userId, 'login');
      
      // 次回ボーナス可能時間を取得
      const timeToNextFreeClaim = await TimeService.getFormattedTimeToNextBonus(userId, 'freeClaim');
      const timeToNextLogin = await TimeService.getFormattedTimeToNextBonus(userId, 'login');
      
      setBonusState({
        freeClaimAvailable: isAdFree && canClaimFree,
        loginBonusAvailable: canClaimLogin,
        timeToNextFreeClaim,
        timeToNextLogin
      });
    } catch (error) {
      console.error('Bonus check error:', error);
      setBonusState({
        freeClaimAvailable: false,
        loginBonusAvailable: false,
        timeToNextFreeClaim: '',
        timeToNextLogin: ''
      });
    }
  }, [isAdFree, effectiveUserId]);

  // 抽選ステータスチェック関数
  const checkLotteryStatus = useCallback(async () => {
    try {
      if (!supabaseClient) return;
      
      const now = Date.now();
      // 過剰なリクエスト防止のためのチェック
      if (now - lotteryState.lastCheckTime < CONSTANTS.MIN_CHECK_INTERVAL) return;
      
      setLotteryState(prev => ({ ...prev, lastCheckTime: now }));
      
      // lottery_statusテーブルを確認
      const { data, error } = await supabaseClient
        .from('lottery_status')
        .select('*')
        .eq('id', CONSTANTS.LOTTERY_STATUS_ID)
        .single();
        
      if (error) {
        console.error('Lottery status check error:', error);
        return;
      }
      
      // 抽選状態が変化したかチェック
      const wasRunning = lotteryState.isGlobalRunning;
      const isNowRunning = data.is_running;
      
      setLotteryState(prev => ({ ...prev, isGlobalRunning: isNowRunning }));
      
      // 抽選が完了した場合（実行中→完了への変化）
      if (wasRunning && !isNowRunning) {
        console.log("Lottery status changed from running to completed");
        await resetLotteryState();
      }
      
      // 抽選が実行されたばかりの場合も確認
      if (data.last_executed_at) {
        const lastExecTime = new Date(data.last_executed_at).getTime();
        
        // 60秒以内に実行された場合
        if (now - lastExecTime < 60000) {
          console.log("Recent lottery execution detected");
          await resetLotteryState();
        }
      }
    } catch (error) {
      console.error('Lottery status check error:', error);
    }
  }, [supabaseClient, lotteryState.lastCheckTime, lotteryState.isGlobalRunning, resetLotteryState]);

  // 日本時間を更新する関数
  const updateJapanTime = useCallback(() => {
    try {
      const formattedTime = TimeService.getFormattedJapanTime('time');
      const formattedDate = TimeService.getFormattedJapanTime('date');
      setCurrentTime(formattedTime);
      setCurrentDate(formattedDate);
    } catch (error) {
      console.error('Time update error:', error);
    }
  }, []);

  // ボーナスタイマーを定期的に更新する関数
  const updateBonusTimers = useCallback(() => {
    if (effectiveUserId) {
      updateBonusState();
    }
  }, [effectiveUserId, updateBonusState]);

  // TimeService初期化と時間表示の更新
  useEffect(() => {
    const initializeTimeService = async () => {
      try {
        // TimeServiceの初期化
        await TimeService.initialize();
        
        // 初期化状態と同期状態を取得
        const syncSuccessful = TimeService.isSyncSuccessful();
        setTimeSyncState({
          initialized: true,
          syncSuccessful
        });
        
        // 初回の時間表示更新
        updateJapanTime();
        
        // 1秒ごとに時間を更新
        timeIntervalRef.current = setInterval(updateJapanTime, 1000);
        
        // ボーナス情報を初期化
        await updateBonusState();
        
        // 1分ごとにボーナス状態を更新
        bonusTimerRef.current = setInterval(updateBonusTimers, 60000);
      } catch (error) {
        console.error('Time service initialization error:', error);
        // エラーが発生しても時間表示はローカル時間で更新
        updateJapanTime();
        timeIntervalRef.current = setInterval(updateJapanTime, 1000);
        
        setTimeSyncState({
          initialized: true,
          syncSuccessful: false
        });
      }
    };
    
    initializeTimeService();
    
    // クリーンアップ
    return () => {
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
        timeIntervalRef.current = null;
      }
      if (bonusTimerRef.current) {
        clearInterval(bonusTimerRef.current);
        bonusTimerRef.current = null;
      }
    };
  }, [updateJapanTime, updateBonusState, updateBonusTimers]);

  // 初期化時の処理
  useEffect(() => {
    if (effectiveUserId) {
      updateBonusState();
    }
    
    // 抽選ステータスポーリング設定
    let pollingInterval: NodeJS.Timeout | null = null;
    
    if (supabaseClient) {
      // 初回のステータスチェック
      checkLotteryStatus();
      
      // 定期的なポーリング設定
      pollingInterval = setInterval(() => {
        checkLotteryStatus();
      }, CONSTANTS.POLLING_INTERVAL);
    }
    
    // 広告サービス初期化
    const initializeAdService = async () => {
      try {
        if (!isAdFree) {
          const adMobService = await AdMobService.initialize();
          await adMobService.loadInterstitial();
        }
      } catch (error) {
        console.error('AdMob initialization error:', error);
      }
    };

    initializeAdService();
    
    // クリーンアップ
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [isAdFree, effectiveUserId, supabaseClient, checkLotteryStatus, updateBonusState]);

  // ログインボーナス受け取り処理
  const handleClaimLoginBonus = async () => {
    try {
      if (!effectiveUserId) {
        Alert.alert('エラー', 'ユーザー情報の読み込みに失敗しました。');
        return;
      }
      
      // 時間同期に失敗している場合はボーナスを受け取れない
      if (!timeSyncState.syncSuccessful) {
        Alert.alert(
          'エラー', 
          'サーバー時間の同期に失敗しているため、ボーナスを受け取れません。\nインターネット接続を確認してください。'
        );
        return;
      }
      
      const userId = effectiveUserId;
      
      // 再度チェック（不正防止）
      const canClaim = await TimeService.canClaimDailyBonus(userId, 'login');
      
      if (!canClaim) {
        // 次回受け取り可能時間を取得
        const timeToNext = await TimeService.getFormattedTimeToNextBonus(userId, 'login');
        
        Alert.alert(
          'エラー', 
          `まだログインボーナスを受け取れません。\n${timeToNext ? `${timeToNext}後に再度お試しください。` : 'インターネット接続を確認してください。'}`
        );
        
        // 表示を更新
        await updateBonusState();
        return;
      }
      
      // チケット付与
      await onAddTickets(CONSTANTS.TICKET_REWARD_LOGIN);
      
      // ボーナス受け取りを記録
      const recorded = await TimeService.recordBonusClaim(userId, 'login');
      
      if (!recorded) {
        Alert.alert(
          '警告', 
          'ボーナス記録中にエラーが発生しました。インターネット接続を確認してください。'
        );
        // ボーナス記録に失敗した場合はチケットを差し引く
        await onAddTickets(-CONSTANTS.TICKET_REWARD_LOGIN);
        return;
      }
      
      // 表示を更新
      await updateBonusState();
      
      Alert.alert('ログインボーナス獲得', `ログインボーナス${CONSTANTS.TICKET_REWARD_LOGIN}チケットを獲得しました！\n次回は${CONSTANTS.BONUS_COOLDOWN_HOURS}時間後から受け取り可能です。`);
    } catch (error) {
      console.error('Claim login bonus error:', error);
      Alert.alert('エラー', 'ログインボーナス獲得中にエラーが発生しました');
    }
  };

  // 広告表示またはフリークレーム処理
  const handleWatchAd = async () => {
    try {
      setAdLoading(true);
      
      // 時間同期に失敗している場合はフリークレームを受け取れない
      if (!timeSyncState.syncSuccessful) {
        Alert.alert(
          'エラー', 
          'サーバー時間の同期に失敗しているため、チケットを受け取れません。\nインターネット接続を確認してください。'
        );
        setAdLoading(false);
        return;
      }
      
      // 有料ユーザーの無料チケット処理
      if (isAdFree && bonusState.freeClaimAvailable) {
        if (!effectiveUserId) {
          Alert.alert('エラー', 'ユーザー情報の読み込みに失敗しました。');
          setAdLoading(false);
          return;
        }
        
        const userId = effectiveUserId;
        
        // 再度チェック（不正防止）
        const canClaim = await TimeService.canClaimDailyBonus(userId, 'freeClaim');
        
        if (!canClaim) {
          // 次回受け取り可能時間を取得
          const timeToNext = await TimeService.getFormattedTimeToNextBonus(userId, 'freeClaim');
          
          Alert.alert(
            'エラー', 
            `まだ無料チケットを受け取れません。\n${timeToNext ? `${timeToNext}後に再度お試しください。` : 'インターネット接続を確認してください。'}`
          );
          
          // 表示を更新
          await updateBonusState();
          setAdLoading(false);
          return;
        }
        
        // チケット付与
        await onAddTickets(CONSTANTS.TICKET_REWARD_AD);
        
        // 無料チケット受け取りを記録
        const recorded = await TimeService.recordBonusClaim(userId, 'freeClaim');
        
        if (!recorded) {
          Alert.alert(
            '警告', 
            'チケット記録中にエラーが発生しました。インターネット接続を確認してください。'
          );
          // ボーナス記録に失敗した場合はチケットを差し引く
          await onAddTickets(-CONSTANTS.TICKET_REWARD_AD);
          setAdLoading(false);
          return;
        }
        
        // 表示を更新
        await updateBonusState();
        
        Alert.alert('チケット獲得', `無料チケット${CONSTANTS.TICKET_REWARD_AD}枚を獲得しました！\n次回は${CONSTANTS.BONUS_COOLDOWN_HOURS}時間後から受け取り可能です。`);
        setAdLoading(false);
        return;
      }
      
      // 通常の広告表示処理
      let adMobService;
      try {
        adMobService = AdMobService.getInstance();
      } catch (error) {
        adMobService = await AdMobService.initialize();
      }
      
      const adShown = await adMobService.showInterstitial();
      
      if (adShown) {
        await onAddTickets(CONSTANTS.TICKET_REWARD_AD);
        Alert.alert('チケット獲得', `広告視聴で${CONSTANTS.TICKET_REWARD_AD}チケットを獲得しました！`);
      } else {
        Alert.alert('お知らせ', '広告の読み込みに失敗しました。時間をおいて再度お試しください。');
      }
    } catch (error) {
      console.error('Watch ad error:', error);
      Alert.alert('エラー', '広告表示中にエラーが発生しました');
    } finally {
      setAdLoading(false);
    }
  };

  // 抽選結果確認処理
  const handleCheckLotteryResult = async () => {
    if (!supabaseClient || !effectiveUserId) {
      Alert.alert('エラー', 'システムの初期化中です。しばらくお待ちください。');
      return;
    }

    setLotteryState(prev => ({ ...prev, checkingResults: true }));
    
    try {
      // 親コンポーネントのハンドラを呼び出す
      await handleCheckResult();
    } catch (error) {
      console.error('Check result error:', error);
      Alert.alert('エラー', '抽選結果の確認中にエラーが発生しました。');
    } finally {
      setLotteryState(prev => ({ ...prev, checkingResults: false }));
    }
  };

  // 抽選実行処理 - よりシンプル化し、抽選実行処理と状態管理を分離
  const handleRunLottery = async () => {
    if (!supabaseClient || !effectiveUserId) {
      Alert.alert('エラー', 'システムの初期化中です。しばらくお待ちください。');
      return;
    }
    
    // ボタンを無効化して二重クリック防止
    setLotteryState(prev => ({
      ...prev,
      buttonDisabled: true,
      isRunning: true
    }));
    
    try {
      // 参加者数が0の場合は抽選スキップ
      if (participantsCount <= 0) {
        Alert.alert('抽選中止', '現在の抽選に参加者がいません。参加者がいる場合にのみ抽選が実行されます。');
        setLotteryState(prev => ({
          ...prev,
          buttonDisabled: false,
          isRunning: false
        }));
        return;
      }

      // 全体の抽選ステータスが既に「実行中」の場合はスキップ
      const { data: statusData } = await supabaseClient
        .from('lottery_status')
        .select('is_running')
        .eq('id', CONSTANTS.LOTTERY_STATUS_ID)
        .single();
        
      if (statusData && statusData.is_running) {
        Alert.alert('抽選実行中', '現在、他のユーザーによって抽選が実行されています。しばらくお待ちください。');
        setLotteryState(prev => ({
          ...prev,
          buttonDisabled: false,
          isRunning: false
        }));
        return;
      }

      // 抽選実行処理を別関数に抽出
      await executeLottery();
      
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
          .eq('id', CONSTANTS.LOTTERY_STATUS_ID);
      } catch (resetError) {
        console.error('Status reset error:', resetError);
      }
    } finally {
      // 状態リセット
      setLotteryState(prev => ({
        ...prev,
        buttonDisabled: false,
        isRunning: false
      }));
    }
  };

  // 抽選処理を実行する関数（ロジックを分割）
  const executeLottery = async () => {
    if (!supabaseClient || !effectiveUserId) return;
    
    // 全体の抽選ステータスを「実行中」に設定
    const { error: statusError } = await supabaseClient
      .from('lottery_status')
      .update({ 
        is_running: true,
        executed_by: effectiveUserId
      })
      .eq('id', CONSTANTS.LOTTERY_STATUS_ID);
    
    if (statusError) {
      throw new Error('抽選ステータスの更新に失敗しました');
    }
    
    // ユーザーに抽選開始を通知
    Alert.alert('抽選開始', '抽選を開始します。結果をお待ちください...');
    
    const { dateISO } = calculateNextLotteryDateString();
    
    // 参加者データ取得
    const { data: participants, error: fetchError } = await supabaseClient
      .from('lottery_participants')
      .select('*')
      .eq('lottery_date', dateISO);
    
    if (fetchError || !participants || participants.length === 0) {
      throw new Error('参加者データの取得に失敗しました');
    }
    
    // 当選者選択（複数いる場合はランダム、1人の場合はその人）
    const winner = participants.length === 1 
      ? participants[0] 
      : participants[Math.floor(Math.random() * participants.length)];
    
    // 抽選結果をDBに記録
    try {
      const insertData = {
        lottery_date: dateISO,
        winner_id: winner.user_id,
        total_participants: participants.length,
        created_at: new Date().toISOString(),
        prize_claimed: false
      };
      
      await supabaseClient
        .from('lottery_results')
        .insert([insertData]);
        
    } catch (dbError) {
      console.error('Database operation error:', dbError);
      throw new Error('抽選結果の記録に失敗しました');
    }
    
    // 抽選終了後、状態リセット
    try {
      // 結果確認済みフラグをリセット
      await AsyncStorage.removeItem(CONSTANTS.RESULT_CHECKED_KEY);
      
      await resetLotteryState();
      
      // 参加者レコードを削除
      await supabaseClient
        .from('lottery_participants')
        .delete()
        .eq('lottery_date', dateISO);
    } catch (resetError) {
      console.error('Lottery reset error:', resetError);
    }
    
    // 全体の抽選ステータスを「完了」に更新
    await supabaseClient
      .from('lottery_status')
      .update({ 
        is_running: false,
        last_executed_at: new Date().toISOString()
      })
      .eq('id', CONSTANTS.LOTTERY_STATUS_ID);
    
    // 結果表示
    setTimeout(() => {
      Alert.alert(
        '抽選完了', 
        '抽選が完了しました。「抽選結果を確認する」ボタンで結果を確認できます。',
        [{ text: 'OK' }]
      );
    }, 2000);
  };

  // 参加フォーム描画関数（レンダリングロジックを分割）
  const renderParticipationForm = () => {
    const isDisabled = tickets < CONSTANTS.TICKET_COST_TO_ENTER || isParticipating;
    
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>抽選に参加</Text>
        
        <TouchableOpacity 
          style={[styles.rewardItem, isDisabled && styles.disabledReward]} 
          onPress={handleEnterLottery}
          disabled={isDisabled}
        >
          <Image source={IMAGES.TICKET} style={styles.rewardIcon} />
          <View style={styles.rewardInfo}>
            <Text style={styles.rewardName}>抽選に参加する</Text>
            <Text style={styles.rewardDesc}>
              {isParticipating 
                ? '今回の抽選にすでに参加しています' 
                : `${CONSTANTS.TICKET_COST_TO_ENTER}チケットで抽選に参加（当選確率 1/${participantsCount > 0 ? participantsCount : 1}）`}
            </Text>
          </View>
          <View style={styles.costContainer}>
            <Image source={IMAGES.TICKET} style={styles.smallTicket} />
            <Text style={styles.costText}>{CONSTANTS.TICKET_COST_TO_ENTER}</Text>
          </View>
        </TouchableOpacity>
        
        <Text style={styles.lotteryNote}>
          ※毎回1名様にBrawl Starsパスが当たります！抽選はボタンを押すと実行され、参加者の中から1名のみ選ばれます。チケット{CONSTANTS.TICKET_COST_TO_ENTER}枚で応募でき、当選確率は応募者数で決まります。
        </Text>
      </View>
    );
  };

  // チケット獲得セクション描画関数
  const renderTicketAcquisitionSection = () => {
    // ボタンテキストを決定
    let buttonText = isAdFree 
      ? bonusState.freeClaimAvailable 
        ? `本日の無料チケットを受け取る (+${CONSTANTS.TICKET_REWARD_AD})` 
        : '無料チケットは受け取り済みです'
      : `広告を見る (+${CONSTANTS.TICKET_REWARD_AD})`;
    
    // 時間表示
    const timeText = bonusState.freeClaimAvailable 
      ? '' 
      : bonusState.timeToNextFreeClaim;
    
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>チケットを獲得</Text>
        
        <TouchableOpacity 
          style={[
            styles.actionButton, 
            (adLoading || (isAdFree && !bonusState.freeClaimAvailable)) && styles.disabledButton
          ]} 
          onPress={handleWatchAd}
          disabled={adLoading || (isAdFree && !bonusState.freeClaimAvailable)}
        >
          <Image source={IMAGES.TICKET} style={styles.actionIcon} />
          <Text style={styles.actionText}>{buttonText}</Text>
          {adLoading && <Text style={styles.loadingText}>読み込み中...</Text>}
        </TouchableOpacity>

        {isAdFree && !bonusState.freeClaimAvailable && timeText && (
          <View style={styles.timeInfoContainer}>
            <Image source={IMAGES.CLOCK} style={styles.clockIcon} />
            <Text style={styles.timeInfoText}>
              {timeText === 'インターネット接続エラー' 
                ? 'インターネット接続エラー' 
                : `次回受け取り可能まであと: ${timeText}`}
            </Text>
          </View>
        )}
        
        {!timeSyncState.syncSuccessful && (
          <Text style={styles.warningText}>
            サーバー時間の同期に失敗しています。インターネット接続を確認してください。
          </Text>
        )}
      </View>
    );
  };

  // ログインボーナスセクション描画関数
  // ログインボーナスセクション描画関数
  const renderLoginBonusSection = () => {
    // ログインボーナスが利用可能でない場合は、次回の受け取り時間を表示
    if (!bonusState.loginBonusAvailable) {
      if (!bonusState.timeToNextLogin) return null;
      
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ログインボーナス</Text>
          <View style={styles.bonusUnavailableContainer}>
            <Image source={IMAGES.CLOCK} style={styles.clockIcon} />
            <Text style={styles.bonusUnavailableText}>
              {bonusState.timeToNextLogin === 'インターネット接続エラー' 
                ? 'インターネット接続エラー' 
                : `次回ログインボーナス受け取りまであと: ${bonusState.timeToNextLogin}`}
            </Text>
          </View>
        </View>
      );
    }
    
    // ボーナスが利用可能な場合
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ログインボーナス</Text>
        <TouchableOpacity 
          style={[styles.actionButton, styles.loginBonusButton]} 
          onPress={handleClaimLoginBonus}
          disabled={!timeSyncState.syncSuccessful}
        >
          <Image source={IMAGES.TICKET} style={styles.actionIcon} />
          <Text style={styles.actionText}>
            {timeSyncState.syncSuccessful 
              ? `ログインボーナスを受け取る (+${CONSTANTS.TICKET_REWARD_LOGIN})` 
              : 'インターネット接続エラー'}
          </Text>
        </TouchableOpacity>
        
        <Text style={styles.bonusInfoText}>
          ログインボーナスは{CONSTANTS.BONUS_COOLDOWN_HOURS}時間に1回受け取れます。
        </Text>
      </View>
    );
  };

  // 抽選情報セクション描画関数
  const renderLotteryInfoSection = () => {
    const { isRunning, isGlobalRunning, buttonDisabled, checkingResults } = lotteryState;
    
    return (
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
              (isRunning || buttonDisabled || isGlobalRunning) && styles.disabledButton
            ]} 
            onPress={handleRunLottery}
            disabled={isRunning || buttonDisabled || isGlobalRunning}
          >
            {isRunning || isGlobalRunning ? (
              <>
                <ActivityIndicator color="#fff" size="small" style={styles.buttonSpinner} />
                <Text style={styles.runLotteryText}>
                  {isGlobalRunning ? '抽選実行中...' : '抽選処理中...'}
                </Text>
              </>
            ) : (
              <>
                <Image source={IMAGES.TICKET} style={styles.runLotteryIcon} />
                <Text style={styles.runLotteryText}>抽選を実行する</Text>
              </>
            )}
          </TouchableOpacity>

          {/* 抽選結果確認ボタン - 条件に基づいて表示/非表示 */}
          {showResultButton && !resultChecked && (
            <TouchableOpacity 
              style={[
                styles.checkResultButton,
                checkingResults && styles.disabledButton
              ]} 
              onPress={handleCheckLotteryResult}
              disabled={checkingResults}
            >
              {checkingResults ? (
                <>
                  <ActivityIndicator color="#fff" size="small" style={styles.buttonSpinner} />
                  <Text style={styles.checkResultText}>確認中...</Text>
                </>
              ) : (
                <>
                  <Image source={IMAGES.TICKET} style={styles.checkResultIcon} />
                  <Text style={styles.checkResultText}>抽選結果を確認する</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
        
        <Text style={styles.lotteryNote}>
          ※ボタンを押すと抽選が実行されます。参加者の中から1名がランダムに選ばれます。
          {isGlobalRunning && '\n他のユーザーが抽選を実行中です。しばらくお待ちください。'}
        </Text>
      </View>
    );
  };

  // 時間表示セクションのレンダリング
  const renderTimeInfoSection = () => {
    return (
      <View style={styles.timeSection}>
        <View style={styles.timeContainer}>
          <Text style={styles.dateText}>{currentDate || '日付を読み込み中...'}</Text>
          <Text style={styles.timeText}>{currentTime || '--:--:--'}</Text>
          {!currentTime && (
            <ActivityIndicator color="#fff" size="small" style={styles.timeLoading} />
          )}
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.content}>
      {renderTimeInfoSection()}
      {renderLotteryInfoSection()}
      {renderLoginBonusSection()}
      {renderParticipationForm()}
      {renderTicketAcquisitionSection()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
  },
  timeSection: {
    marginBottom: 16,
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  timeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 4,
  },
  timeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    fontVariant: ['tabular-nums'],
  },
  timeLoading: {
    marginTop: 4,
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
  // 時間情報コンテナ
  timeInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
  },
  clockIcon: {
    width: 18,
    height: 18,
    tintColor: '#777',
    marginRight: 8,
  },
  timeInfoText: {
    fontSize: 14,
    color: '#555',
  },
  // ボーナス関連スタイル
  bonusInfoText: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
    marginTop: 8,
  },
  bonusUnavailableContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
  },
  bonusUnavailableText: {
    fontSize: 14,
    color: '#555',
    flex: 1,
  },
  warningText: {
    fontSize: 14,
    color: '#f44336',
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
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