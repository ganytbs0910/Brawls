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
  ActivityIndicator,
  TextInput,
  Linking,
  Modal,
} from 'react-native';
import { useAppTranslation } from '../i18n/app';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AdMobService from '../services/AdMobService';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import DeviceInfo from 'react-native-device-info';

// Supabaseの設定
const SUPABASE_URL = 'https://llxmsbnqtdlqypnwapzz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxseG1zYm5xdGRscXlwbndhcHp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4MjA5MjEsImV4cCI6MjA1MzM5NjkyMX0.EkqepILQU0KgOTW1ZaXpe54ERpZbSRodf24r5022VKs';

// Brawl Stars ギフトリンク
const BRAWL_STARS_GIFT_LINK = 'https://link.brawlstars.com/?supercell_id&p=96-61b0620d-6de4-4848-999d-d97765726124';

interface TicketScreenProps {
  isAdFree: boolean;
  tickets: number;
  onUseTicket: (amount?: number) => Promise<boolean>;
  onAddTickets: (amount: number) => Promise<void>;
  lotteryParticipants: number;
  userId?: string;
  // チケット更新用のコールバック関数を追加
  onTicketsUpdated?: (newTickets: number) => void;
}

// 追加: タブの状態を定義する enum
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
const calculateNextLotteryDateString = (): { dateString: string, dateISO: string } => {
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
  const [adLoading, setAdLoading] = useState(false);
  const [freeClaimAvailable, setFreeClaimAvailable] = useState(false);
  const [loginBonusAvailable, setLoginBonusAvailable] = useState(false);
  const [isParticipating, setIsParticipating] = useState(false);
  const [nextLotteryDate, setNextLotteryDate] = useState('');
  const [supabaseClient, setSupabaseClient] = useState<SupabaseClient | null>(null);
  const [participantsCount, setParticipantsCount] = useState(lotteryParticipants);
  const [effectiveUserId, setEffectiveUserId] = useState<string | null>(null);
  
  // 内部でチケット数を管理
  const [tickets, setTickets] = useState(initialTickets);
  
  // テスト抽選用の状態
  const [testLotteryRunning, setTestLotteryRunning] = useState(false);
  const [testLotteryCountdown, setTestLotteryCountdown] = useState(10);

  // 追加: タブ状態の管理
  const [activeTab, setActiveTab] = useState<TabState>(TabState.TICKETS);
  
  // 追加: 当選情報の管理
  const [hasPrize, setHasPrize] = useState(false);
  const [prizeInfo, setPrizeInfo] = useState<any>(null);
  
  // 追加: プレイヤータグの入力管理
  const [playerTag, setPlayerTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPrizeModal, setShowPrizeModal] = useState(false);

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
      checkDailyFreeClaim();
      checkDailyLoginBonus();
      checkLotteryParticipation();
      calculateNextLotteryDate();
      fetchLotteryParticipantsCount();
    }
  }, [isAdFree, supabaseClient, effectiveUserId]);

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
      console.error('Free claim check error:', error);
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
      console.error('Login bonus check error:', error);
      setLoginBonusAvailable(false);
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
  const calculateNextLotteryDate = () => {
    const { dateString } = calculateNextLotteryDateString();
    setNextLotteryDate(dateString);
  };

  // ログインボーナスを受け取る処理
  const handleClaimLoginBonus = async () => {
    try {
      // ログインボーナスとして5チケットを付与
      await addTickets(5);
      
      // 今日の日付を保存
      const today = new Date().toISOString().split('T')[0];
      await AsyncStorage.setItem('lastLoginBonusDate', today);
      
      setLoginBonusAvailable(false);
      Alert.alert('ログインボーナス獲得', '本日のログインボーナス5チケットを獲得しました！');
    } catch (error) {
      console.error('Login bonus claim error:', error);
      Alert.alert('エラー', 'ログインボーナス獲得中にエラーが発生しました');
    }
  };

  // インタースティシャル広告を表示する処理
  const handleWatchAd = async () => {
    try {
      setAdLoading(true);
      
      if (isAdFree && freeClaimAvailable) {
        // 無料チケット10枚を付与
        await addTickets(1000);
        const today = new Date().toISOString().split('T')[0];
        await AsyncStorage.setItem('lastFreeClaimDate', today);
        setFreeClaimAvailable(false);
        Alert.alert('チケット獲得', '本日の無料チケット10枚を獲得しました！');
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
        // 広告視聴で10チケットを付与
        await addTickets(1000);
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

  // 抽選に参加する処理（改善版）
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

  // 広告サービスの初期化
  useEffect(() => {
    const initializeAdService = async () => {
      try {
        if (!isAdFree) {
          const adMobService = await AdMobService.initialize();
          await adMobService.loadInterstitial();
        }
      } catch (error) {
        console.error('Ad initialization error:', error);
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
        console.log('参加者が1人のため、自動的に当選:', winner);
      } else {
        // 複数参加者がいる場合はランダム選択
        const randomIndex = Math.floor(Math.random() * participants.length);
        winner = participants[randomIndex];
        console.log('抽選結果:', { totalParticipants: participants.length, winnerIndex: randomIndex, winner });
      }
      
      try {
        // 3. 抽選結果をDBに記録 - 既存のテーブル構造に合わせて項目を絞る
        const { data: resultRecord, error: resultError } = await supabaseClient
          .from('lottery_results')
          .insert([
            {
              lottery_date: dateISO,
              winner_id: winner.user_id,
              total_participants: participants.length,
              created_at: new Date().toISOString(),
              prize_claimed: false
              // prize_typeとprize_valueは含めない
            }
          ])
          .select()
          .single();
          
        if (resultError) {
          console.error('抽選結果保存の詳細エラー:', resultError);
          throw new Error('抽選結果の保存に失敗しました');
        }
        
        // 4. 当選者にメッセージを送信
        const messageData = {
          user_id: winner.user_id,
          message: '🎉おめでとうございます！あなたが抽選に当選しました！🎉\n\n景品を受け取るにはマイページから手続きを行ってください。',
          title: '抽選当選のお知らせ',
          is_read: false,
          created_at: new Date().toISOString()
        };
        
        // user_messagesテーブルに関連IDフィールドがある場合のみ追加
        try {
          const { error: columnCheckError } = await supabaseClient
            .from('user_messages')
            .select('message_type')
            .limit(1);
          
          // message_typeカラムがあればそれも含める
          if (!columnCheckError) {
            messageData.message_type = 'lottery_win';
          }
          
          // related_idカラムがあればそれも含める
          if (resultRecord && resultRecord.id) {
            messageData.related_id = resultRecord.id;
          }
        } catch (columnCheckError) {
          console.log('メッセージテーブルのカラム確認エラー:', columnCheckError);
          // エラーは無視して続行
        }
        
        const { error: messageError } = await supabaseClient
          .from('user_messages')
          .insert([messageData]);
          
        if (messageError) {
          console.error('当選メッセージの送信に失敗しました:', messageError);
          // メッセージ送信失敗は致命的ではないので続行
        }
      } catch (dbError) {
        console.error('DB操作エラー:', dbError);
        // DB操作エラーを表示
        Alert.alert('データベースエラー', `操作中にエラーが発生しました: ${dbError.message}`);
        
        // DB操作が失敗しても抽選自体は完了したものとして処理を続行
        console.log('DB操作は失敗しましたが、抽選処理は続行します');
      }
      
      // 5. 自分が当選者かどうかをチェック
      const isCurrentUserWinner = effectiveUserId === winner.user_id;
      
      // 6. 抽選終了後、抽選参加状態をリセット
      await AsyncStorage.removeItem('lotteryParticipation');
      setIsParticipating(false);
      
      // 参加者レコードを削除（すべてのユーザーが再度参加できるようにする）
      const { error: deleteError } = await supabaseClient
        .from('lottery_participants')
        .delete()
        .eq('lottery_date', dateISO);
        
      if (deleteError) {
        console.error('参加者レコードの削除に失敗しました:', deleteError);
        // 削除失敗は致命的ではないので続行
      }
      
      // 抽選参加者カウントをリセット
      setParticipantsCount(0);
      
      // 7. 成功通知 - 自分が当選した場合は特別な演出を表示
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
      console.error('Test lottery error:', error);
      Alert.alert('エラー', `抽選処理中にエラーが発生しました: ${error.message || 'Unknown error'}`);
    } finally {
      // 状態をリセット
      setTestLotteryRunning(false);
      setTestLotteryCountdown(10);
      
      // 抽選に再度参加できるようにする
      resetLotteryState();
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
  
  // Brawl Starsリンクを開く
  const openBrawlStarsLink = async () => {
    try {
      const canOpen = await Linking.canOpenURL(BRAWL_STARS_GIFT_LINK);
      if (canOpen) {
        await Linking.openURL(BRAWL_STARS_GIFT_LINK);
      } else {
        Alert.alert('エラー', 'このリンクは開けません。');
      }
    } catch (error) {
      console.error('リンクオープンエラー:', error);
      Alert.alert('エラー', 'リンクを開く際にエラーが発生しました。');
    }
  };
  
  // プレイヤータグを送信する
  const submitPlayerTag = async () => {
    if (!playerTag || playerTag.trim() === '') {
      Alert.alert('入力エラー', 'プレイヤータグを入力してください。');
      return;
    }
    
    if (!supabaseClient || !effectiveUserId || !prizeInfo) {
      Alert.alert('エラー', 'システムエラーが発生しました。');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // プレイヤータグをDBに保存
      const { error } = await supabaseClient
        .from('prize_claims')
        .insert([{
          user_id: effectiveUserId,
          lottery_result_id: prizeInfo.id,
          player_tag: playerTag.trim(),
          claimed_at: new Date().toISOString(),
          status: 'pending'
        }]);
        
      if (error) {
        console.error('プレイヤータグ送信エラー:', error);
        Alert.alert('エラー', 'データの送信に失敗しました。');
        return;
      }
      
      // lottery_resultsテーブルの景品受取状態を更新
      const { error: updateError } = await supabaseClient
        .from('lottery_results')
        .update({ prize_claimed: true })
        .eq('id', prizeInfo.id);
        
      if (updateError) {
        console.error('景品受取状態更新エラー:', updateError);
        // 致命的ではないのでエラー表示しない
      }
      
      // 景品受取完了
      Alert.alert(
        '受取完了', 
        'おめでとうございます！景品の受け取り手続きが完了しました。景品は数日以内に付与されます。',
        [
          {
            text: 'OK',
            onPress: () => {
              // 状態をリセット
              setHasPrize(false);
              setPrizeInfo(null);
              setPlayerTag('');
              setActiveTab(TabState.TICKETS);
            }
          }
        ]
      );
      
    } catch (error) {
      console.error('景品受取エラー:', error);
      Alert.alert('エラー', '処理中にエラーが発生しました。');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // 起動時に当選確認を実行
  useEffect(() => {
    if (supabaseClient && effectiveUserId) {
      checkWinningStatus();
    }
  }, [supabaseClient, effectiveUserId]);

  // メインコンテンツをレンダリングする関数
  const renderContent = () => {
    switch (activeTab) {
      case TabState.PRIZE:
        return renderPrizeTab();
      case TabState.TICKETS:
      default:
        return renderTicketsTab();
    }
  };
  
  // チケットタブのコンテンツ
  const renderTicketsTab = () => {
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
                本日のログインボーナスを受け取る (+5)
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
  
  // 景品受取タブのコンテンツ
  const renderPrizeTab = () => {
    return (
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>当選プレゼント</Text>
          
          {hasPrize ? (
            <>
              <View style={styles.prizeInfoContainer}>
                <Image 
                  source={require('../../assets/AppIcon/ticket.png')} 
                  style={styles.prizeIcon} 
                />
                <Text style={styles.prizeTitle}>
                  🎉 おめでとうございます！抽選に当選しました 🎉
                </Text>
                <Text style={styles.prizeDescription}>
                  Brawl Stars内で景品を受け取るには、以下の手順に従ってください。
                </Text>
              </View>
              
              <View style={styles.prizeStepsContainer}>
                <Text style={styles.prizeStepTitle}>手順1: ゲーム内リンクを開く</Text>
                <TouchableOpacity 
                  style={styles.brawlStarsButton} 
                  onPress={openBrawlStarsLink}
                >
                  <Text style={styles.brawlStarsButtonText}>
                    Brawl Starsを開く
                  </Text>
                </TouchableOpacity>
                
                <Text style={styles.prizeStepTitle}>手順2: プレイヤータグを入力</Text>
                <TextInput
                  style={styles.playerTagInput}
                  placeholder="例: #ABC123"
                  value={playerTag}
                  onChangeText={setPlayerTag}
                  autoCapitalize="characters"
                />
                
                <TouchableOpacity 
                  style={[
                    styles.submitButton, 
                    (!playerTag || isSubmitting) && styles.disabledButton
                  ]} 
                  onPress={submitPlayerTag}
                  disabled={!playerTag || isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.submitButtonText}>送信</Text>
                  )}
                </TouchableOpacity>
                
                <Text style={styles.prizeNote}>
                  ※プレゼントの付与には数日かかる場合があります。
                  プレイヤータグは正確に入力してください。
                </Text>
              </View>
            </>
          ) : (
            <View style={styles.noPrizeContainer}>
              <Image 
                source={require('../../assets/AppIcon/ticket.png')} 
                style={styles.noPrizeIcon} 
              />
              <Text style={styles.noPrizeText}>
                現在、受け取り可能なプレゼントはありません。
              </Text>
              <Text style={styles.noPrizeSubText}>
                抽選に参加して、素敵な景品を当てましょう！
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    );
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
      {renderContent()}
      
      {/* プレゼント受け取りモーダル */}
      <Modal
        visible={showPrizeModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPrizeModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🎉 プレゼント受け取り 🎉</Text>
            
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>手順1: ゲーム内リンクを開く</Text>
              <TouchableOpacity 
                style={styles.brawlStarsButton} 
                onPress={openBrawlStarsLink}
              >
                <Text style={styles.brawlStarsButtonText}>
                  Brawl Starsを開く
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>手順2: プレイヤータグを入力</Text>
              <TextInput
                style={styles.playerTagInput}
                placeholder="例: #ABC123"
                value={playerTag}
                onChangeText={setPlayerTag}
                autoCapitalize="characters"
              />
            </View>
            
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity 
                style={styles.modalCancelButton} 
                onPress={() => setShowPrizeModal(false)}
              >
                <Text style={styles.modalCancelButtonText}>キャンセル</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.modalSubmitButton, 
                  (!playerTag || isSubmitting) && styles.disabledButton
                ]} 
                onPress={() => {
                  submitPlayerTag();
                  setShowPrizeModal(false);
                }}
                disabled={!playerTag || isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.modalSubmitButtonText}>送信</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  // 景品受取タブのスタイル
  prizeInfoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  prizeIcon: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  prizeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF5722',
    textAlign: 'center',
    marginBottom: 8,
  },
  prizeDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  prizeStepsContainer: {
    marginTop: 16,
  },
  prizeStepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  brawlStarsButton: {
    backgroundColor: '#FF9800',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  brawlStarsButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  playerTagInput: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  prizeNote: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  noPrizeContainer: {
    alignItems: 'center',
    padding: 20,
  },
  noPrizeIcon: {
    width: 80,
    height: 80,
    opacity: 0.5,
    marginBottom: 16,
  },
  noPrizeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  noPrizeSubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  // モーダルのスタイル
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF5722',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalSection: {
    marginBottom: 16,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalCancelButton: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  modalCancelButtonText: {
    color: '#666',
    fontWeight: 'bold',
  },
  modalSubmitButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 12,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  modalSubmitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default TicketScreen;