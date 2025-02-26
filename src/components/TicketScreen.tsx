// Import necessary components and libraries
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
} from 'react-native';
import { useAppTranslation } from '../i18n/app';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AdMobService from '../services/AdMobService';
import { createClient } from '@supabase/supabase-js';

// Supabaseの設定
const SUPABASE_URL = 'https://llxmsbnqtdlqypnwapzz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxseG1zYm5xdGRscXlwbndhcHp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4MjA5MjEsImV4cCI6MjA1MzM5NjkyMX0.EkqepILQU0KgOTW1ZaXpe54ERpZbSRodf24r5022VKs';

interface TicketScreenProps {
  isAdFree: boolean;
  tickets: number;
  onUseTicket: () => Promise<boolean>; // チケットを使用する関数
  onAddTickets: (amount: number) => Promise<void>; // チケットを追加する関数
  lotteryParticipants: number; // 抽選参加者数の初期値
  userId?: string; // オプションのユーザーID
}

const TicketScreen: React.FC<TicketScreenProps> = ({
  isAdFree,
  tickets,
  onUseTicket,
  onAddTickets,
  lotteryParticipants,
  userId
}) => {
  const { t } = useAppTranslation();
  const [adLoading, setAdLoading] = useState(false);
  const [freeClaimAvailable, setFreeClaimAvailable] = useState(false);
  const [loginBonusAvailable, setLoginBonusAvailable] = useState(false);
  const [isParticipating, setIsParticipating] = useState(false);
  const [nextLotteryDate, setNextLotteryDate] = useState('');
  const [supabaseClient, setSupabaseClient] = useState<any>(null);
  const [participantsCount, setParticipantsCount] = useState(lotteryParticipants);
  
  // 新しく追加した状態
  const [testLotteryRunning, setTestLotteryRunning] = useState(false);
  const [testLotteryCountdown, setTestLotteryCountdown] = useState(10);

  // Supabaseクライアントの初期化
  useEffect(() => {
    const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
    setSupabaseClient(client);
  }, []);

  // 初期化時に各種チェックを実行
  useEffect(() => {
    checkDailyFreeClaim();
    checkDailyLoginBonus();
    checkLotteryParticipation();
    calculateNextLotteryDate();
    if (supabaseClient) {
      fetchLotteryParticipantsCount();
    }
  }, [isAdFree, supabaseClient, userId]);

  // 1日1回の無料ポイントが利用可能かチェックする（課金ユーザー向け）
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

  // 1日1回のログインボーナスが利用可能かチェックする（全ユーザー向け）
  const checkDailyLoginBonus = async () => {
    try {
      const lastLoginBonusDate = await AsyncStorage.getItem('lastLoginBonusDate');
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD形式
      
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

  // 次回の抽選日を計算して文字列を返す
  const calculateNextLotteryDateString = (): { dateString: string, dateISO: string } => {
    const now = new Date();
    const nextSunday = new Date();
    
    // 次の日曜日を計算
    nextSunday.setDate(now.getDate() + (7 - now.getDay()) % 7);
    
    // 時間を21:00に設定
    nextSunday.setHours(21, 0, 0, 0);
    
    // 今日が日曜で、現在時刻が21時以前なら今日を返す
    if (now.getDay() === 0 && now.getHours() < 21) {
      nextSunday.setDate(now.getDate());
    }
    
    // YYYY-MM-DD形式
    const dateISO = nextSunday.toISOString().split('T')[0];
    
    // 表示用フォーマット: MM月DD日(曜日) HH:MM
    const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
    const month = nextSunday.getMonth() + 1;
    const date = nextSunday.getDate();
    const day = dayNames[nextSunday.getDay()];
    const dateString = `${month}月${date}日(${day}) 21:00`;
    
    return { dateString, dateISO };
  };

  // ユーザーが抽選に参加済みかチェックする
  const checkLotteryParticipation = async () => {
    try {
      // ローカルストレージでのチェック（既存の実装と互換性を保つ）
      const participation = await AsyncStorage.getItem('lotteryParticipation');
      let isParticipatingLocal = participation === 'true';
      
      // Supabaseでのチェック（ユーザーIDがある場合）
      if (supabaseClient && userId) {
        const { dateISO } = calculateNextLotteryDateString();
        
        const { data, error } = await supabaseClient
          .from('lottery_participants')
          .select('*')
          .eq('user_id', userId)
          .eq('lottery_date', dateISO)
          .maybeSingle();
          
        if (!error && data) {
          isParticipatingLocal = true;
        }
      }
      
      setIsParticipating(isParticipatingLocal);
    } catch (error) {
      console.error('Lottery participation check error:', error);
      setIsParticipating(false);
    }
  };

  // 全ての抽選参加者数を取得（日付フィルタなし）
  const fetchLotteryParticipantsCount = async () => {
    try {
      if (!supabaseClient) return;
      
      // 日付フィルターなしで全ての参加者をカウント
      const { count, error } = await supabaseClient
        .from('lottery_participants')
        .select('*', { count: 'exact', head: true });
        
      if (!error) {
        console.log('総参加者数:', count);
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
      await onAddTickets(5);
      
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
      
      // 課金ユーザーで無料ポイント入手可能な場合
      if (isAdFree && freeClaimAvailable) {
        await onAddTickets(100);
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
        await onAddTickets(1000);
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

  // 抽選に参加する処理 - onEnterLotteryを使わない修正版
  const handleEnterLottery = async () => {
    if (tickets >= 100) {
      try {
        // チケットを使用
        const ticketUsed = await onUseTicket();
        
        if (ticketUsed) {
          // ローカルストレージに参加を記録（既存の処理）
          await AsyncStorage.setItem('lotteryParticipation', 'true');
          
          // ユーザーIDが存在しない場合は仮のIDを生成
          const effectiveUserId = userId || `anonymous_${Date.now()}`;
          
          // Supabaseに抽選参加を記録
          if (supabaseClient) {
            const { dateISO } = calculateNextLotteryDateString();
            
            const { data, error } = await supabaseClient
              .from('lottery_participants')
              .insert([
                { 
                  user_id: effectiveUserId, 
                  lottery_date: dateISO,
                  created_at: new Date().toISOString() 
                }
              ]);
              
            if (error) {
              console.error('Supabase insert error:', error);
              Alert.alert('エラー', 'データベースへの登録に失敗しました');
              return;
            }
            
            // 参加者数を再取得
            fetchLotteryParticipantsCount();
          }
          
          setIsParticipating(true);
          Alert.alert('抽選参加完了', '抽選に参加しました！結果発表をお待ちください。');
        } else {
          Alert.alert('エラー', 'チケットの使用に失敗しました');
        }
      } catch (error) {
        console.error('Lottery entry error:', error);
        Alert.alert('エラー', '抽選参加中にエラーが発生しました');
      }
    } else {
      Alert.alert('チケット不足', '抽選に参加するには100チケットが必要です');
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

  // テスト抽選のカウントダウンを処理するエフェクト
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (testLotteryRunning && testLotteryCountdown > 0) {
      timer = setTimeout(() => {
        setTestLotteryCountdown(prev => prev - 1);
      }, 1000);
    } else if (testLotteryRunning && testLotteryCountdown === 0) {
      // カウントダウンが0になったら抽選を実行
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
      if (!supabaseClient) {
        throw new Error('データベース接続が確立されていません');
      }
      
      // 参加者がいなければ中止
      if (participantsCount <= 0) {
        Alert.alert('抽選中止', '抽選参加者がいません');
        setTestLotteryRunning(false);
        return;
      }
      
      // 1. すべての参加者を取得
      const { data: participants, error: fetchError } = await supabaseClient
        .from('lottery_participants')
        .select('*');
        
      if (fetchError || !participants || participants.length === 0) {
        throw new Error('参加者の取得に失敗しました');
      }
      
      // 2. ランダムに1名を選ぶ
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
      
      // 3. メッセージテーブルに当選通知を送信
      const { error: messageError } = await supabaseClient
        .from('user_messages')
        .insert([
          {
            user_id: winner.user_id,
            message: '🎉おめでとうございます！あなたが抽選に当選しました！🎉',
            title: '抽選当選のお知らせ',
            is_read: false,
            created_at: new Date().toISOString()
          }
        ]);
        
      if (messageError) {
        throw new Error('当選メッセージの送信に失敗しました');
      }
      
      // 4. 自分が当選者かどうかをチェック
      console.log('当選チェック:', {
        winnerUserId: winner.user_id,
        currentUserId: userId,
        effectiveUserId: userId || `anonymous_${Date.now()}`
      });
      
      // ユーザーIDの比較 - anonymousプレフィックスも考慮
      const isCurrentUserWinner = userId === winner.user_id || 
                                 (userId === null && winner.user_id.startsWith('anonymous_'));
      
      // 5. 抽選終了後、抽選参加状態をリセット
      await AsyncStorage.removeItem('lotteryParticipation');
      setIsParticipating(false);
      
      // 参加者レコードを削除（すべてのユーザーが再度参加できるようにする）
      const { error: deleteError } = await supabaseClient
        .from('lottery_participants')
        .delete()
        .eq('lottery_date', calculateNextLotteryDateString().dateISO);
        
      if (deleteError) {
        console.error('参加者レコードの削除に失敗しました:', deleteError);
      }
      
      // 抽選参加者カウントをリセット
      setParticipantsCount(0);
      
      // 6. 成功通知 - 自分が当選した場合は特別な演出を表示
      if (isCurrentUserWinner) {
        // 特別な当選演出 - 画面全体に大きく表示
        Alert.alert(
          '🎉🎉🎉 あなたが当選しました！ 🎉🎉🎉', 
          '✨✨ おめでとうございます！ ✨✨\n\nあなたが当選者に選ばれました！\n豪華景品が贈られます！',
          [
            {
              text: '受け取る！',
              onPress: () => {
                // 追加のお祝い演出をここに入れることも可能
                console.log('当選おめでとうございます！');
                // 受け取り処理などを追加できます
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
      setTestLotteryRunning(false);
      setTestLotteryCountdown(10);
    }
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
      
      {/* 抽選情報表示エリア */}
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
      
      <ScrollView style={styles.content}>
        {/* テスト抽選ボタンセクション（新規追加） */}
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
            <Image source={require('../../assets/AppIcon/ticket.png')} style={styles.actionIcon} />
            <Text style={styles.actionText}>
              {testLotteryRunning 
                ? `テスト抽選実行まで: ${testLotteryCountdown}秒` 
                : 'テスト抽選を実行する'}
            </Text>
            {testLotteryRunning && (
              <ActivityIndicator size="small" color="#FFFFFF" style={styles.spinner} />
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
              <Image source={require('../../assets/AppIcon/ticket.png')} style={styles.actionIcon} />
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
          <Text style={styles.sectionTitle}>抽選に参加</Text>
          
          <TouchableOpacity 
            style={[
              styles.rewardItem, 
              (tickets < 100 || isParticipating) && styles.disabledReward
            ]} 
            onPress={handleEnterLottery}
            disabled={tickets < 100 || isParticipating}
          >
            <Image source={require('../../assets/AppIcon/ticket.png')} style={styles.rewardIcon} />
            <View style={styles.rewardInfo}>
              <Text style={styles.rewardName}>ウィークリー抽選</Text>
              <Text style={styles.rewardDesc}>
                {isParticipating 
                  ? '今週の抽選にすでに参加しています' 
                  : '100チケットで週間抽選に参加'}
              </Text>
            </View>
            <View style={styles.costContainer}>
              <Image source={require('../../assets/AppIcon/ticket.png')} style={styles.smallTicket} />
              <Text style={styles.costText}>100</Text>
            </View>
          </TouchableOpacity>
          
          <Text style={styles.lotteryNote}>
            ※毎週日曜21時に抽選が行われ、参加者の中から1名様に豪華景品をプレゼント！
          </Text>
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

export default TicketScreen;