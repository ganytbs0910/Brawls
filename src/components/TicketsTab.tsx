import React, { useState, useEffect, useCallback, useRef } from 'react';
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

// 次回の抽選時間を計算する関数 (0:15に統一)
const calculateNextLotteryTime = (): { time: Date, timeString: string } => {
  const now = new Date();
  const nextLottery = new Date();
  
  // 毎日0:15に設定
  nextLottery.setHours(1, 14, 0, 0);
  
  // もし現在時刻が0:15を過ぎていたら、翌日の0:15に設定
  if (now > nextLottery) {
    nextLottery.setDate(nextLottery.getDate() + 1);
  }
  
  // フォーマットされた時間文字列を作成
  const month = nextLottery.getMonth() + 1;
  const date = nextLottery.getDate();
  const hours = nextLottery.getHours().toString().padStart(2, '0');
  const minutes = nextLottery.getMinutes().toString().padStart(2, '0');
  const timeString = `${month}月${date}日 ${hours}:${minutes}`;
  
  return { time: nextLottery, timeString };
};

// 残り時間をフォーマットする関数
const formatRemainingTime = (milliseconds: number): string => {
  if (milliseconds <= 0) return "0時間0分0秒";
  
  const seconds = Math.floor((milliseconds / 1000) % 60);
  const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  
  return `${hours}時間${minutes}分${seconds}秒`;
};

// 抽選を実行する時間かどうかをチェックする関数
const isTimeForLottery = (targetTime: Date): boolean => {
  const now = new Date();
  const diff = targetTime.getTime() - now.getTime();
  // 10秒以内かつ、過去になっていない場合は抽選時間と判断
  return diff >= 0 && diff < 10000;
};

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
  const [nextLotteryTime, setNextLotteryTime] = useState(calculateNextLotteryTime());
  const [remainingTime, setRemainingTime] = useState<string>("計算中...");
  const [isLotteryTime, setIsLotteryTime] = useState(false);
  
  // refで状態を管理
  const hasRunLotteryRef = useRef(false);
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);
  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastParticipantCheckTimeRef = useRef(0);

  // チケット獲得量の定数
  const TICKET_REWARD_AD = 200; // 広告視聴で獲得するチケット数
  const TICKET_REWARD_LOGIN = 200; // ログインボーナスで獲得するチケット数

  // コンポーネントがアンマウントされる際にタイマーをクリア
  useEffect(() => {
    return () => {
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current);
        timerIdRef.current = null;
      }
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
        updateIntervalRef.current = null;
      }
    };
  }, []);

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
        // エラー処理は省略
      }
    };

    initializeAdService();
  }, [isAdFree]);

  // 残り時間の更新とカウントダウン表示のみを行う
  useEffect(() => {
    // すでに抽選中なら何もしない
    if (isLotteryTime) return;
    
    // 既存のタイマーをクリア
    if (updateIntervalRef.current) {
      clearInterval(updateIntervalRef.current);
    }
    
    // 残り時間を更新する関数
    const updateRemainingTime = () => {
      const now = new Date();
      const targetTime = nextLotteryTime.time;
      const diff = targetTime.getTime() - now.getTime();
      
      // 残り時間を表示用にフォーマット
      if (diff > 0) {
        setRemainingTime(formatRemainingTime(diff));
      } else {
        // 抽選時間が過ぎた場合は次の抽選時間を計算
        const newNextLottery = calculateNextLotteryTime();
        setNextLotteryTime(newNextLottery);
        setRemainingTime(formatRemainingTime(newNextLottery.time.getTime() - now.getTime()));
      }
    };
    
    // 初回実行
    updateRemainingTime();
    
    // 1秒ごとに残り時間を更新
    updateIntervalRef.current = setInterval(updateRemainingTime, 1000);
    
    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
        updateIntervalRef.current = null;
      }
    };
  }, [nextLotteryTime, isLotteryTime]);

  // 抽選時間の監視と実行（残り時間の表示とは分離）
  useEffect(() => {
    // すでに抽選中なら何もしない
    if (isLotteryTime || hasRunLotteryRef.current) return;
    
    // 既存のタイマーをクリア
    if (timerIdRef.current) {
      clearTimeout(timerIdRef.current);
    }
    
    // 抽選時間をチェックする関数
    const checkLotteryTime = () => {
      if (isTimeForLottery(nextLotteryTime.time) && !hasRunLotteryRef.current) {
        hasRunLotteryRef.current = true;
        setIsLotteryTime(true);
        
        // runLottery関数を呼び出す前に少し遅延
        timerIdRef.current = setTimeout(() => {
          executeLottery();
        }, 1000);
      } else {
        // 次のチェックを5秒後に設定
        timerIdRef.current = setTimeout(checkLotteryTime, 5000);
      }
    };
    
    // 初回チェック
    checkLotteryTime();
    
    return () => {
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current);
        timerIdRef.current = null;
      }
    };
  }, [nextLotteryTime]);

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
      setLoginBonusAvailable(false);
    }
  };

  // ログインボーナスを受け取る処理
  const handleClaimLoginBonus = async () => {
    try {
      // ログインボーナスとしてチケットを付与
      await onAddTickets(TICKET_REWARD_LOGIN);
      
      // 今日の日付を保存
      const today = new Date().toISOString().split('T')[0];
      await AsyncStorage.setItem('lastLoginBonusDate', today);
      
      setLoginBonusAvailable(false);
      Alert.alert('ログインボーナス獲得', `本日のログインボーナス${TICKET_REWARD_LOGIN}チケットを獲得しました！`);
    } catch (error) {
      Alert.alert('エラー', 'ログインボーナス獲得中にエラーが発生しました');
    }
  };

  // インタースティシャル広告を表示する処理
  const handleWatchAd = async () => {
    try {
      setAdLoading(true);
      
      if (isAdFree && freeClaimAvailable) {
        // 無料チケットを付与
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
        // 広告視聴でチケットを付与
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

  // 参加者数を確認する関数（最小限のチェックを行う）
  const checkParticipants = async (): Promise<number> => {
    // 最後のチェックから30秒経っていない場合はキャッシュした値を返す
    const now = Date.now();
    if (now - lastParticipantCheckTimeRef.current < 30000) {
      return participantsCount;
    }
    
    try {
      if (!supabaseClient) return 0;
      
      lastParticipantCheckTimeRef.current = now;
      
      const { dateISO } = calculateNextLotteryDateString();
      const { count, error } = await supabaseClient
        .from('lottery_participants')
        .select('*', { count: 'exact', head: true })
        .eq('lottery_date', dateISO);
      
      if (error) throw error;
      return count || 0;
    } catch (error) {
      return 0;
    }
  };

  // 抽選を実行する関数
  const executeLottery = useCallback(async () => {
    if (!supabaseClient || !effectiveUserId) {
      resetLotteryState();
      setIsLotteryTime(false);
      hasRunLotteryRef.current = false;
      return;
    }
    
    try {
      // 参加者数を確認
      const participantCount = await checkParticipants();
      
      // 参加者がいない場合は抽選をスキップ
      if (participantCount <= 0) {
        // 状態をリセット
        hasRunLotteryRef.current = false;
        setIsLotteryTime(false);
        
        // 次回の抽選時間を設定
        const newNextLottery = calculateNextLotteryTime();
        setNextLotteryTime(newNextLottery);
        return;
      }
      
      // 自動抽選が実行されることをユーザーに通知
      Alert.alert('抽選実行中', '本日の抽選が実行されています。結果をお待ちください...');
      
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
      
      let resultSaved = false;
      
      try {
        // 2. 抽選結果をDBに記録
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
          
        if (!resultError) {
          resultSaved = true;
        }
      } catch (dbError) {
        Alert.alert('データベースエラー', '操作中にエラーが発生しました');
      }
      
      // 3. 自分が当選者かどうかをチェック
      const isCurrentUserWinner = effectiveUserId === winner.user_id;
      
      // 4. 抽選終了後、抽選参加状態をリセット
      try {
        await AsyncStorage.removeItem('lotteryParticipation');
        
        // 参加者レコードを削除（すべてのユーザーが再度参加できるようにする）
        await supabaseClient
          .from('lottery_participants')
          .delete()
          .eq('lottery_date', dateISO);
      } catch (resetError) {
        // エラー処理は省略
      }
      
      // 5. 成功通知 - 自分が当選した場合は特別な演出を表示
      setTimeout(() => {
        if (isCurrentUserWinner && resultSaved) {
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
        } else if (!isCurrentUserWinner) {
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
        
        // 抽選状態をリセット
        setIsLotteryTime(false);
        hasRunLotteryRef.current = false;
        
        // 次回の抽選時間を更新
        setNextLotteryTime(calculateNextLotteryTime());
        
        // 抽選後の状態リセット
        resetLotteryState();
      }, 2000); // 2秒後に結果を表示
      
    } catch (error) {
      Alert.alert('エラー', '抽選処理中にエラーが発生しました');
      
      // エラー発生時も状態をリセット
      setIsLotteryTime(false);
      hasRunLotteryRef.current = false;
      setNextLotteryTime(calculateNextLotteryTime());
    }
  }, [supabaseClient, effectiveUserId, setHasPrize, setPrizeInfo, setActiveTab, resetLotteryState]);

  return (
    <ScrollView style={styles.content}>
      {/* 次回抽選情報セクション */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>次回の抽選情報</Text>
        
        <View style={styles.lotteryInfoBox}>
          <Text style={styles.nextLotteryTime}>
            {nextLotteryTime.timeString}
          </Text>
          <Text style={styles.countdownLabel}>抽選まであと</Text>
          <Text style={styles.countdown}>{remainingTime}</Text>
          
          {isLotteryTime && (
            <View style={styles.lotteryRunningContainer}>
              <ActivityIndicator size="large" color="#FF9800" />
              <Text style={styles.lotteryRunningText}>抽選実行中...</Text>
            </View>
          )}
        </View>
        
        <Text style={styles.lotteryNote}>
          ※毎日0:15に自動的に抽選が実行されます。抽選前にチケットで参加を忘れずに！
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
            <Text style={styles.rewardName}>次回の抽選に参加する</Text>
            <Text style={styles.rewardDesc}>
              {isParticipating 
                ? '今回の抽選にすでに参加しています' 
                : '100チケットで抽選に参加'}
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
          ※抽選が行われ、参加者の中から1名様に豪華景品をプレゼント！
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
  // 抽選情報ボックスのスタイル
  lotteryInfoBox: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  nextLotteryTime: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF9800',
    marginBottom: 12,
  },
  countdownLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  countdown: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  lotteryRunningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    padding: 8,
    borderRadius: 8,
  },
  lotteryRunningText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF9800',
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