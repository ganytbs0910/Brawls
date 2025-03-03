import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AdMobService from '../services/AdMobService';
import { SupabaseClient } from '@supabase/supabase-js';
import { TabState } from './types';
import { calculateNextLotteryDateString } from './TicketScreen';

// 次回抽選時間計算
const calculateNextLotteryTime = (): { time: Date, timeString: string } => {
  const now = new Date();
  const nextLottery = new Date();
  
  nextLottery.setHours(18, 0, 0, 0);
  
  if (now > nextLottery) {
    nextLottery.setDate(nextLottery.getDate() + 1);
  }
  
  const month = nextLottery.getMonth() + 1;
  const date = nextLottery.getDate();
  const hours = nextLottery.getHours().toString().padStart(2, '0');
  const minutes = nextLottery.getMinutes().toString().padStart(2, '0');
  const timeString = `${month}月${date}日 ${hours}:${minutes}`;
  
  return { time: nextLottery, timeString };
};

// 残り時間フォーマット
const formatRemainingTime = (milliseconds: number): string => {
  if (milliseconds <= 0) return "0時間0分0秒";
  
  const seconds = Math.floor((milliseconds / 1000) % 60);
  const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  
  return `${hours}時間${minutes}分${seconds}秒`;
};

// 抽選実行時間チェック
const isTimeForLottery = (targetTime: Date): boolean => {
  const now = new Date();
  const diff = targetTime.getTime() - now.getTime();
  
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
  
  // refで状態管理
  const hasRunLotteryRef = useRef(false);
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);
  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastParticipantCheckTimeRef = useRef(0);
  const lastExecutedLotteryTimeRef = useRef<string>('');

  // チケット獲得量定数
  const TICKET_REWARD_AD = 200; 
  const TICKET_REWARD_LOGIN = 200; 

  // タイマークリア
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

  // 初期化時チェック
  useEffect(() => {
    if (effectiveUserId) {
      checkDailyFreeClaim();
      checkDailyLoginBonus();
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

  // 残り時間更新
  useEffect(() => {
    if (isLotteryTime) return;
    
    if (updateIntervalRef.current) {
      clearInterval(updateIntervalRef.current);
    }
    
    const updateRemainingTime = () => {
      const now = new Date();
      const targetTime = nextLotteryTime.time;
      const diff = targetTime.getTime() - now.getTime();
      
      if (diff > 0) {
        setRemainingTime(formatRemainingTime(diff));
      } else {
        const newNextLottery = calculateNextLotteryTime();
        setNextLotteryTime(newNextLottery);
        setRemainingTime(formatRemainingTime(newNextLottery.time.getTime() - now.getTime()));
      }
    };
    
    updateRemainingTime();
    updateIntervalRef.current = setInterval(updateRemainingTime, 1000);
    
    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
        updateIntervalRef.current = null;
      }
    };
  }, [nextLotteryTime, isLotteryTime]);

  // 抽選時間監視と実行
  useEffect(() => {
    if (isLotteryTime || hasRunLotteryRef.current) {
      return;
    }
    
    if (timerIdRef.current) {
      clearTimeout(timerIdRef.current);
      timerIdRef.current = null;
    }
    
    const lotteryTimeId = nextLotteryTime.time.toISOString();
    
    const checkLotteryTime = () => {
      if (lastExecutedLotteryTimeRef.current === lotteryTimeId) {
        return;
      }
      
      if (isTimeForLottery(nextLotteryTime.time) && !hasRunLotteryRef.current && !isLotteryTime) {
        hasRunLotteryRef.current = true;
        setIsLotteryTime(true);
        lastExecutedLotteryTimeRef.current = lotteryTimeId;
        
        timerIdRef.current = setTimeout(() => {
          executeLottery();
        }, 1000);
      } else {
        timerIdRef.current = setTimeout(checkLotteryTime, 5000);
      }
    };
    
    checkLotteryTime();
    
    return () => {
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current);
        timerIdRef.current = null;
      }
    };
  }, [nextLotteryTime]);

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

  // 参加者数確認
  const checkParticipants = async (): Promise<number> => {
  try {
    if (!isLotteryTime) {
      const now = Date.now();
      if (now - lastParticipantCheckTimeRef.current < 30000) {
        return participantsCount;
      }
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

// 抽選実行
const executeLottery = useCallback(async () => {
  if (!supabaseClient || !effectiveUserId) {
    await resetLotteryState();
    setIsLotteryTime(false);
    hasRunLotteryRef.current = false;
    return;
  }
  
  try {
    // 参加者数確認
    const participantCount = await checkParticipants();
    
    // 参加者がいない場合は抽選スキップ
    if (participantCount <= 0) {
      hasRunLotteryRef.current = false;
      setIsLotteryTime(false);
      
      const newNextLottery = calculateNextLotteryTime();
      setNextLotteryTime(newNextLottery);
      return;
    }
    
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
        
      const { data: resultRecord, error: resultError } = resultResponse;
        
      if (!resultError) {
        resultSaved = true;
      }
    } catch (dbError) {
      Alert.alert('データベースエラー', '操作中にエラーが発生しました');
    }
    
    // 自分が当選者かチェック
    const isCurrentUserWinner = effectiveUserId === winner.user_id;
    
    // 抽選終了後、状態リセット
    try {
      await AsyncStorage.removeItem('lotteryParticipation');
      
      // 参加者レコードを削除
      const deleteResponse = await supabaseClient
        .from('lottery_participants')
        .delete()
        .eq('lottery_date', dateISO);
    } catch (resetError) {
      // エラー処理
    }
    
    // 結果表示
    setTimeout(() => {
      if (isCurrentUserWinner && resultSaved) {
        // 当選演出
        Alert.alert(
          '🎉🎉🎉 あなたが当選しました！ 🎉🎉🎉', 
          '✨✨ おめでとうございます！ ✨✨\n\nあなたが当選者に選ばれました！\n豪華景品が贈られます！',
          [
            {
              text: '受け取る！',
              onPress: () => {
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
        // 落選通知
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
      
      // 状態リセット
      setIsLotteryTime(false);
      hasRunLotteryRef.current = false;
      
      // 次回抽選時間更新
      const newNextLottery = calculateNextLotteryTime();
      setNextLotteryTime(newNextLottery);
      
      // 抽選後状態リセット
      resetLotteryState();
    }, 2000);
    
  } catch (error) {
    Alert.alert('エラー', '抽選処理中にエラーが発生しました');
    
    // エラー時も状態リセット
    setIsLotteryTime(false);
    hasRunLotteryRef.current = false;
    
    // 次回抽選時間更新
    const newNextLottery = calculateNextLotteryTime();
    setNextLotteryTime(newNextLottery);
  }
}, [supabaseClient, effectiveUserId, setHasPrize, setPrizeInfo, setActiveTab, resetLotteryState, participantsCount]);

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
      </View>
      
      <Text style={styles.lotteryNote}>
        ※毎日0:15に自動的に抽選が実行されます。抽選前にチケットで参加を忘れずに！
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
          <Text style={styles.rewardName}>次回の抽選に参加する</Text>
          <Text style={styles.rewardDesc}>
            {isParticipating 
              ? '今回の抽選にすでに参加しています' 
              : '100チケットで抽選に参加（当選確率 1/' + participantsCount + '）'}
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
        ※毎日1名様にBrawl Starsパスが当たります！抽選は参加者の中から1名のみ選ばれます。チケット100枚で応募でき、当選確率はその日の応募者数で決まります。
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
}

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