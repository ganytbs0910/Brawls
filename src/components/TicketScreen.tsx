import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import DeviceInfo from 'react-native-device-info';
import { useAppTranslation } from '../i18n/app';

import TicketsTab from './TicketsTab';
import PrizeTab from './PrizeTab';

// Supabaseの設定
const SUPABASE_URL = 'https://llxmsbnqtdlqypnwapzz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxseG1zYm5xdGRscXlwbndhcHp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4MjA5MjEsImV4cCI6MjA1MzM5NjkyMX0.EkqepILQU0KgOTW1ZaXpe54ERpZbSRodf24r5022VKs';

interface TicketScreenProps {
  isAdFree: boolean;
  tickets: number;
  onUseTicket: (amount?: number) => Promise<boolean>;
  onAddTickets: (amount: number) => Promise<void>;
  lotteryParticipants: number;
  userId?: string;
  onTicketsUpdated?: (newTickets: number) => void;
}

// タブの状態を定義する enum
enum TabState {
  TICKETS = 'tickets',
  PRIZE = 'prize'
}

// 匿名ユーザーIDを取得または生成する関数
const getOrCreateAnonymousUserId = async (): Promise<string> => {
  try {
    const storedId = await AsyncStorage.getItem('user_anonymous_id');
    
    if (storedId) {
      console.log('保存済みの匿名IDを使用:', storedId);
      return storedId;
    }
    
    let deviceId;
    
    try {
      deviceId = await DeviceInfo.getUniqueId();
    } catch (deviceError) {
      console.warn('デバイスID取得エラー:', deviceError);
      deviceId = `device_${Date.now()}`;
    }
    
    const salt = Math.random().toString(36).substring(2, 9);
    const anonymousId = `anon_${deviceId}_${salt}`;
    
    await AsyncStorage.setItem('user_anonymous_id', anonymousId);
    
    console.log('新しい匿名IDを生成:', anonymousId);
    return anonymousId;
  } catch (error) {
    console.error('匿名ID生成エラー:', error);
    return `temp_${Date.now()}`;
  }
};

// 次回の抽選日時を計算する関数
export const calculateNextLotteryDateString = (): { dateString: string, dateISO: string } => {
  const now = new Date();
  const nextSunday = new Date();
  
  nextSunday.setDate(now.getDate() + (7 - now.getDay()) % 7);
  nextSunday.setHours(21, 0, 0, 0);
  
  if (now.getDay() === 0 && now.getHours() < 21) {
    nextSunday.setDate(now.getDate());
  }
  
  const dateISO = nextSunday.toISOString().split('T')[0];
  
  const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
  const month = nextSunday.getMonth() + 1;
  const date = nextSunday.getDate();
  const day = dayNames[nextSunday.getDay()];
  const dateString = `${month}月${date}日(${day}) 21:00`;
  
  return { dateString, dateISO };
};

// チケットを保存する関数
const saveTickets = async (tickets: number): Promise<void> => {
  try {
    await AsyncStorage.setItem('user_tickets', tickets.toString());
    console.log('チケット数を保存しました:', tickets);
  } catch (error) {
    console.error('チケット保存エラー:', error);
  }
};

// 保存されたチケットを読み込む関数
const loadTickets = async (): Promise<number> => {
  try {
    const storedTickets = await AsyncStorage.getItem('user_tickets');
    if (storedTickets) {
      const tickets = parseInt(storedTickets, 10);
      console.log('保存されたチケット数を読み込みました:', tickets);
      return tickets;
    }
  } catch (error) {
    console.error('チケット読み込みエラー:', error);
  }
  return 0; // デフォルト値
};

const TicketScreen: React.FC<TicketScreenProps> = ({
  isAdFree,
  tickets: initialTickets,
  onUseTicket,
  onAddTickets,
  lotteryParticipants,
  userId,
  onTicketsUpdated
}) => {
  const { t } = useAppTranslation();
  const [tickets, setTickets] = useState(initialTickets);
  const [activeTab, setActiveTab] = useState<TabState>(TabState.TICKETS);
  const [supabaseClient, setSupabaseClient] = useState<SupabaseClient | null>(null);
  const [effectiveUserId, setEffectiveUserId] = useState<string | null>(null);
  const [isParticipating, setIsParticipating] = useState(false);
  const [participantsCount, setParticipantsCount] = useState(lotteryParticipants);
  const [nextLotteryDate, setNextLotteryDate] = useState('');
  const [hasPrize, setHasPrize] = useState(false);
  const [prizeInfo, setPrizeInfo] = useState<any>(null);

  // Supabaseクライアントの初期化
  useEffect(() => {
    const initializeClient = async () => {
      const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          storage: AsyncStorage,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        },
      });
      setSupabaseClient(client);
    };
    
    initializeClient();
  }, []);

  // 有効なユーザーIDを初期化
  useEffect(() => {
    const initUserId = async () => {
      if (userId) {
        setEffectiveUserId(userId);
      } else {
        const anonymousId = await getOrCreateAnonymousUserId();
        setEffectiveUserId(anonymousId);
      }
    };
    
    initUserId();
  }, [userId]);

  // 保存されたチケットを読み込む
  useEffect(() => {
    const initTickets = async () => {
      const savedTickets = await loadTickets();
      // 保存されたチケットが存在し、初期値より大きい場合のみ使用
      if (savedTickets > 0 && savedTickets > initialTickets) {
        setTickets(savedTickets);
        // 親コンポーネントに通知
        if (onTicketsUpdated) {
          onTicketsUpdated(savedTickets);
        }
      } else {
        // 初期値を保存
        saveTickets(initialTickets);
      }
    };
    
    initTickets();
  }, [initialTickets, onTicketsUpdated]);

  // 初期化時に各種チェックを実行
  useEffect(() => {
    if (supabaseClient && effectiveUserId) {
      checkLotteryParticipation();
      calculateNextLotteryDateForUI();
      fetchLotteryParticipantsCount();
      checkWinningStatus();
    }
  }, [supabaseClient, effectiveUserId]);

  // チケットを使用するラッパー関数
  const useTickets = async (amount: number = 100): Promise<boolean> => {
    try {
      const success = await onUseTicket(amount);
      if (success) {
        const newTickets = tickets - amount;
        setTickets(newTickets);
        saveTickets(newTickets);
        
        // 親コンポーネントに通知
        if (onTicketsUpdated) {
          onTicketsUpdated(newTickets);
        }
      }
      return success;
    } catch (error) {
      console.error('チケット使用エラー:', error);
      return false;
    }
  };

  // チケットを追加するラッパー関数
  const addTickets = async (amount: number): Promise<void> => {
    try {
      await onAddTickets(amount);
      const newTickets = tickets + amount;
      setTickets(newTickets);
      saveTickets(newTickets);
      
      // 親コンポーネントに通知
      if (onTicketsUpdated) {
        onTicketsUpdated(newTickets);
      }
    } catch (error) {
      console.error('チケット追加エラー:', error);
    }
  };

  // ユーザーが抽選に参加済みかチェックする
  const checkLotteryParticipation = async () => {
    try {
      if (!supabaseClient || !effectiveUserId) return;
      
      const participation = await AsyncStorage.getItem('lotteryParticipation');
      let isParticipatingLocal = participation === 'true';
      
      const { dateISO } = calculateNextLotteryDateString();
      
      const { data, error } = await supabaseClient
        .from('lottery_participants')
        .select('*')
        .eq('user_id', effectiveUserId)
        .eq('lottery_date', dateISO)
        .maybeSingle();
        
      if (!error && data) {
        isParticipatingLocal = true;
        await AsyncStorage.setItem('lotteryParticipation', 'true');
      }
      
      setIsParticipating(isParticipatingLocal);
    } catch (error) {
      console.error('Lottery participation check error:', error);
      setIsParticipating(false);
    }
  };

  // 抽選参加者数を取得
  const fetchLotteryParticipantsCount = async () => {
    try {
      if (!supabaseClient) return;
      
      const { dateISO } = calculateNextLotteryDateString();
      
      const { count, error } = await supabaseClient
        .from('lottery_participants')
        .select('*', { count: 'exact', head: true })
        .eq('lottery_date', dateISO);
        
      if (!error) {
        console.log('抽選参加者数:', count);
        setParticipantsCount(count || 0);
      } else {
        console.error('Count error:', error);
      }
    } catch (error) {
      console.error('Fetch lottery participants count error:', error);
    }
  };

  // 次回の抽選日時を計算する
  const calculateNextLotteryDateForUI = () => {
    const { dateString } = calculateNextLotteryDateString();
    setNextLotteryDate(dateString);
  };

  // 抽選参加後に状態をリセットする
  const resetLotteryState = async () => {
    try {
      // ローカルストレージの参加フラグをリセット
      await AsyncStorage.removeItem('lotteryParticipation');
      setIsParticipating(false);
      
      // 参加状態を確認し直す
      checkLotteryParticipation();
      fetchLotteryParticipantsCount();
    } catch (error) {
      console.error('抽選状態リセットエラー:', error);
    }
  };

  // 当選結果を確認する関数
  const checkWinningStatus = async () => {
    try {
      if (!supabaseClient || !effectiveUserId) {
        return false;
      }
      
      // 未受け取りの当選を確認
      const { data, error } = await supabaseClient
        .from('lottery_results')
        .select('*')
        .eq('winner_id', effectiveUserId)
        .eq('prize_claimed', false)
        .order('created_at', { ascending: false })
        .limit(1);
        
      if (error) {
        console.error('当選確認エラー:', error);
        return false;
      }
      
      if (data && data.length > 0) {
        // 未受け取りの当選がある場合、通知を表示
        setPrizeInfo(data[0]);
        setHasPrize(true);
        
        Alert.alert(
          '🏆 当選のお知らせ 🏆',
          'おめでとうございます！抽選に当選しています。「当選プレゼント」タブから景品を受け取ることができます。',
          [
            {
              text: '後で',
              style: 'cancel'
            },
            {
              text: '受け取る',
              onPress: () => {
                // 当選タブに切り替える
                setActiveTab(TabState.PRIZE);
              }
            }
          ]
        );
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('当選確認エラー:', error);
      return false;
    }
  };

  // 抽選に参加する処理
  const handleEnterLottery = async () => {
    if (!supabaseClient || !effectiveUserId) {
      Alert.alert('エラー', 'システムの初期化中です。しばらくお待ちください。');
      return;
    }
    
    if (tickets < 100) {
      Alert.alert('チケット不足', '抽選に参加するには100チケットが必要です');
      return;
    }
    
    if (isParticipating) {
      Alert.alert('既に参加済み', '今回の抽選には既に参加済みです。');
      return;
    }
    
    try {
      const ticketCost = 100;
      
      // チケットを使用
      const ticketUsed = await useTickets(ticketCost);
      
      if (!ticketUsed) {
        Alert.alert('エラー', 'チケットの使用に失敗しました');
        return;
      }
      
      const { dateISO } = calculateNextLotteryDateString();
      
      // Supabaseに抽選参加を記録
      const { error } = await supabaseClient
        .from('lottery_participants')
        .insert([
          { 
            user_id: effectiveUserId, 
            lottery_date: dateISO,
            created_at: new Date().toISOString(),
            ticket_cost: ticketCost
          }
        ]);
        
      if (error) {
        console.error('Supabase insert error:', error);
        Alert.alert('エラー', 'データベースへの登録に失敗しました');
        // チケットを返却する
        await addTickets(ticketCost);
        return;
      }
      
      // ローカルストレージに参加を記録
      await AsyncStorage.setItem('lotteryParticipation', 'true');
      
      // 参加状態を更新
      setIsParticipating(true);
      
      // 参加者数を更新
      fetchLotteryParticipantsCount();
      
      Alert.alert('抽選参加完了', '抽選に参加しました！結果発表をお待ちください。');
    } catch (error) {
      console.error('Lottery entry error:', error);
      Alert.alert('エラー', '抽選参加中にエラーが発生しました');
    }
  };

  // 景品の受け取り完了時の処理
  const handlePrizeClaimed = () => {
    setHasPrize(false);
    setPrizeInfo(null);
    setActiveTab(TabState.TICKETS);
  };

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
      
      <View style={styles.lotteryInfoContainer}>
        <View style={styles.lotteryInfoItem}>
          <Text style={styles.lotteryInfoLabel}>抽選参加者数</Text>
          <Text style={styles.lotteryInfoValue}>{participantsCount}人</Text>
        </View>
        <View style={styles.lotteryInfoItem}>
          <Text style={styles.lotteryInfoLabel}>当選確率</Text>
          <Text style={styles.lotteryInfoValue}>
            {participantsCount > 0 ? `1/${participantsCount}` : '- '}
          </Text>
        </View>
        <View style={styles.lotteryInfoItem}>
          <Text style={styles.lotteryInfoLabel}>次回抽選日</Text>
          <Text style={styles.lotteryInfoValue}>{nextLotteryDate}</Text>
        </View>
        <View style={styles.lotteryInfoItem}>
          <Text style={styles.lotteryInfoLabel}>参加状況</Text>
          <Text style={[
            styles.lotteryInfoValue, 
            isParticipating ? styles.participatingText : styles.notParticipatingText
          ]}>
            {isParticipating ? '参加中' : '未参加'}
          </Text>
        </View>
      </View>
      
      {/* タブナビゲーション */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[
            styles.tab, 
            activeTab === TabState.TICKETS && styles.activeTab
          ]}
          onPress={() => setActiveTab(TabState.TICKETS)}
        >
          <Image 
            source={require('../../assets/AppIcon/ticket.png')} 
            style={[
              styles.tabIcon, 
              activeTab === TabState.TICKETS && styles.activeTabIcon
            ]} 
          />
          <Text style={[
            styles.tabText,
            activeTab === TabState.TICKETS && styles.activeTabText
          ]}>
            チケット
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tab, 
            activeTab === TabState.PRIZE && styles.activeTab,
            hasPrize && styles.prizeTab
          ]}
          onPress={() => setActiveTab(TabState.PRIZE)}
        >
          <Image 
            source={require('../../assets/AppIcon/ticket.png')} 
            style={[
              styles.tabIcon, 
              activeTab === TabState.PRIZE && styles.activeTabIcon
            ]} 
          />
          <Text style={[
            styles.tabText,
            activeTab === TabState.PRIZE && styles.activeTabText,
            hasPrize && styles.prizeTabText
          ]}>
            当選プレゼント
            {hasPrize && <Text style={styles.newBadge}> NEW</Text>}
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* タブコンテンツ */}
      {activeTab === TabState.TICKETS ? (
        <TicketsTab 
          tickets={tickets}
          isAdFree={isAdFree}
          onAddTickets={addTickets}
          handleEnterLottery={handleEnterLottery}
          isParticipating={isParticipating}
          supabaseClient={supabaseClient}
          effectiveUserId={effectiveUserId}
          resetLotteryState={resetLotteryState}
          setHasPrize={setHasPrize}
          setPrizeInfo={setPrizeInfo}
          setActiveTab={setActiveTab}
          participantsCount={participantsCount}
        />
      ) : (
        <PrizeTab 
          hasPrize={hasPrize}
          prizeInfo={prizeInfo}
          supabaseClient={supabaseClient}
          effectiveUserId={effectiveUserId}
          onPrizeClaimed={handlePrizeClaimed}
        />
      )}
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
  lotteryInfoContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  lotteryInfoItem: {
    flex: 1,
    alignItems: 'center',
  },
  lotteryInfoLabel: {
    fontSize: 12,
    color: '#777',
    marginBottom: 2,
  },
  lotteryInfoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  participatingText: {
    color: '#4CAF50', // 緑色
  },
  notParticipatingText: {
    color: '#F44336', // 赤色
  },
  // タブナビゲーションのスタイル
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#21A0DB',
  },
  prizeTab: {
    borderBottomColor: 'transparent',
  },
  tabIcon: {
    width: 20,
    height: 20,
    tintColor: '#777',
    marginRight: 6,
  },
  activeTabIcon: {
    tintColor: '#21A0DB',
  },
  tabText: {
    fontSize: 14,
    color: '#777',
  },
  activeTabText: {
    fontWeight: 'bold',
    color: '#21A0DB',
  },
  prizeTabText: {
    color: '#F44336',
  },
  newBadge: {
    color: '#F44336',
    fontWeight: 'bold',
  },
});

export default TicketScreen;