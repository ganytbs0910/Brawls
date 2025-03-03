import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Image, SafeAreaView, Alert, TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import DeviceInfo from 'react-native-device-info';
import { useAppTranslation } from '../i18n/app';

import TicketsTab from './TicketsTab';
import PrizeTab from './PrizeTab';

// Supabase設定
const SUPABASE_URL = 'https://llxmsbnqtdlqypnwapzz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxseG1zYm5xdGRscXlwbndhcHp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4MjA5MjEsImV4cCI6MjA1MzM5NjkyMX0.EkqepILQU0KgOTW1ZaXpe54ERpZbSRodf24r5022VKs';

// TabState定義
enum TabState {
  TICKETS = 'tickets',
  PRIZE = 'prize'
}

// 匿名ユーザーID取得/生成関数
const getOrCreateAnonymousUserId = async () => {
  try {
    const storedId = await AsyncStorage.getItem('user_anonymous_id');
    if (storedId) return storedId;
    
    let deviceId;
    try {
      deviceId = await DeviceInfo.getUniqueId();
    } catch (deviceError) {
      deviceId = `device_${Date.now()}`;
    }
    
    const salt = Math.random().toString(36).substring(2, 9);
    const anonymousId = `anon_${deviceId}_${salt}`;
    await AsyncStorage.setItem('user_anonymous_id', anonymousId);
    return anonymousId;
  } catch (error) {
    return `temp_${Date.now()}`;
  }
};

// 抽選日付用関数 (ボタントリガー用に単純化)
export const calculateNextLotteryDateString = () => {
  const now = new Date();
  const dateISO = now.toISOString().split('T')[0];
  
  const month = now.getMonth() + 1;
  const date = now.getDate();
  const dateString = `${month}月${date}日`;
  
  return { dateString, dateISO };
};

// チケット保存関数
const saveTickets = async (tickets) => {
  try {
    const ticketValue = Math.floor(tickets);
    const safeTicketValue = Math.max(0, ticketValue);
    await AsyncStorage.setItem('user_tickets', safeTicketValue.toString());
  } catch (error) {
    // エラー処理
  }
};

// チケット読み込み関数
const loadTickets = async () => {
  try {
    const storedTickets = await AsyncStorage.getItem('user_tickets');
    if (storedTickets) {
      const tickets = parseInt(storedTickets, 10);
      if (!isNaN(tickets) && tickets >= 0) {
        return tickets;
      }
    }
  } catch (error) {
    // エラー処理
  }
  return 0;
};

const TicketScreen = ({
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
  const [activeTab, setActiveTab] = useState(TabState.TICKETS);
  const [supabaseClient, setSupabaseClient] = useState(null);
  const [effectiveUserId, setEffectiveUserId] = useState(null);
  const [isParticipating, setIsParticipating] = useState(false);
  const [participantsCount, setParticipantsCount] = useState(lotteryParticipants);
  const [hasPrize, setHasPrize] = useState(false);
  const [prizeInfo, setPrizeInfo] = useState(null);

  // Supabaseクライアント初期化
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

  // ユーザーID初期化
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

  // チケット読み込み
  useEffect(() => {
    const initTickets = async () => {
      try {
        const savedTickets = await loadTickets();
        const bestTicketCount = Math.max(savedTickets, initialTickets);
        
        setTickets(bestTicketCount);
        
        if (bestTicketCount !== savedTickets) {
          await saveTickets(bestTicketCount);
        }
        
        if (onTicketsUpdated) {
          onTicketsUpdated(bestTicketCount);
        }
      } catch (error) {
        setTickets(initialTickets);
      }
    };
    
    initTickets();
  }, [initialTickets, onTicketsUpdated]);

  // 各種チェック実行
  useEffect(() => {
    if (supabaseClient && effectiveUserId) {
      checkLotteryParticipation();
      fetchLotteryParticipantsCount();
      checkWinningStatus();
    }
  }, [supabaseClient, effectiveUserId]);

  // チケット使用関数
  const useTickets = async (amount = 100) => {
    try {
      const currentTickets = await loadTickets();
      
      if (currentTickets < amount) {
        Alert.alert('チケット不足', `抽選に参加するには${amount}チケットが必要です`);
        setTickets(currentTickets);
        return false;
      }

      const newTickets = currentTickets - amount;
      
      await saveTickets(newTickets);
      setTickets(newTickets);
      
      try {
        const success = await onUseTicket(amount);
      } catch (callbackError) {
        // エラー処理
      }
      
      if (onTicketsUpdated) {
        onTicketsUpdated(newTickets);
      }
      
      return true;
    } catch (error) {
      try {
        const actualTickets = await loadTickets();
        setTickets(actualTickets);
      } catch (loadError) {
        // エラー処理
      }
      
      return false;
    }
  };

  // チケット追加関数
  const addTickets = async (amount) => {
    try {
      const currentTickets = await loadTickets();
      const newTickets = currentTickets + Math.floor(amount);
      
      await saveTickets(newTickets);
      setTickets(newTickets);
      
      try {
        await onAddTickets(amount);
      } catch (callbackError) {
        // エラー処理
      }
      
      if (onTicketsUpdated) {
        onTicketsUpdated(newTickets);
      }
    } catch (error) {
      try {
        const actualTickets = await loadTickets();
        setTickets(actualTickets);
      } catch (loadError) {
        // エラー処理
      }
    }
  };

  // 抽選参加確認 - 修正済み
  const checkLotteryParticipation = async () => {
    try {
      if (!supabaseClient || !effectiveUserId) return;
      
      // 常にデータベースを優先的に確認
      const { dateISO } = calculateNextLotteryDateString();
      
      const { data, error } = await supabaseClient
        .from('lottery_participants')
        .select('*')
        .eq('user_id', effectiveUserId)
        .eq('lottery_date', dateISO)
        .maybeSingle();
      
      if (error) {
        console.error('Participation check error:', error);
        // DBチェックに失敗した場合はローカルストレージをフォールバックとして使用
        const participation = await AsyncStorage.getItem('lotteryParticipation');
        setIsParticipating(participation === 'true');
        return;
      }
      
      // DB結果に基づいて参加状態を設定
      if (data) {
        // DBに存在する場合 - 参加中
        await AsyncStorage.setItem('lotteryParticipation', 'true');
        setIsParticipating(true);
      } else {
        // DBに存在しない場合 - 参加していない
        await AsyncStorage.removeItem('lotteryParticipation');
        setIsParticipating(false);
      }
    } catch (error) {
      console.error('Participation check error:', error);
      setIsParticipating(false);
    }
  };

  // 参加者数取得
  const fetchLotteryParticipantsCount = async () => {
    try {
      if (!supabaseClient) return;
      
      const { dateISO } = calculateNextLotteryDateString();
      
      const { count, error } = await supabaseClient
        .from('lottery_participants')
        .select('*', { count: 'exact', head: true })
        .eq('lottery_date', dateISO);
        
      if (!error) {
        setParticipantsCount(count || 0);
      }
    } catch (error) {
      console.error('Participants count error:', error);
    }
  };

  // 抽選状態リセット - 修正済み
  const resetLotteryState = async () => {
    try {
      // ローカル参加状態をクリア
      await AsyncStorage.removeItem('lotteryParticipation');
      setIsParticipating(false);
      
      // データベースと再同期
      await checkLotteryParticipation();
      await fetchLotteryParticipantsCount();
    } catch (error) {
      console.error('Reset lottery state error:', error);
    }
  };

  // 当選確認
  const checkWinningStatus = async () => {
    try {
      if (!supabaseClient || !effectiveUserId) {
        return false;
      }
      
      const { data, error } = await supabaseClient
        .from('lottery_results')
        .select('*')
        .eq('winner_id', effectiveUserId)
        .eq('prize_claimed', false)
        .order('created_at', { ascending: false })
        .limit(1);
        
      if (error) {
        return false;
      }
      
      if (data && data.length > 0) {
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
                setActiveTab(TabState.PRIZE);
              }
            }
          ]
        );
        return true;
      }
      
      return false;
    } catch (error) {
      return false;
    }
  };

  // 抽選参加処理
  const handleEnterLottery = async () => {
    if (!supabaseClient || !effectiveUserId) {
      Alert.alert('エラー', 'システムの初期化中です。しばらくお待ちください。');
      return;
    }
    
    const currentTickets = await loadTickets();
    setTickets(currentTickets);
    
    if (currentTickets < 100) {
      Alert.alert('チケット不足', '抽選に参加するには100チケットが必要です');
      return;
    }
    
    if (isParticipating) {
      Alert.alert('既に参加済み', '今回の抽選には既に参加済みです。');
      return;
    }
    
    try {
      const ticketCost = 100;
      const ticketUsed = await useTickets(ticketCost);
      
      if (!ticketUsed) {
        return;
      }
      
      const { dateISO } = calculateNextLotteryDateString();
      
      try {
        const { error } = await supabaseClient
          .from('lottery_participants')
          .insert([
            { 
              user_id: effectiveUserId, 
              lottery_date: dateISO,
              created_at: new Date().toISOString()
            }
          ]);
          
        if (error) {
          throw error;
        }
      } catch (dbError) {
        Alert.alert('エラー', 'データベースへの登録に失敗しました。チケットは消費されましたが、抽選には参加できませんでした。');
        return;
      }
      
      await AsyncStorage.setItem('lotteryParticipation', 'true');
      setIsParticipating(true);
      fetchLotteryParticipantsCount();
      
      Alert.alert('抽選参加完了', `抽選に参加しました！「抽選を実行する」ボタンで抽選が実行されるまでお待ちください。`);
    } catch (error) {
      Alert.alert('エラー', '抽選参加中にエラーが発生しました');
    }
  };

  // 景品受け取り完了処理
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