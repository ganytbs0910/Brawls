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
  TextInput,
  Linking,
  Modal,
} from 'react-native';
import { SupabaseClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Brawl Stars ギフトリンク
const BRAWL_STARS_GIFT_LINK = 'https://link.brawlstars.com/?supercell_id&p=96-61b0620d-6de4-4848-999d-d97765726124';

interface PrizeTabProps {
  hasPrize: boolean;
  prizeInfo: any;
  supabaseClient: SupabaseClient | null;
  effectiveUserId: string | null;
  onPrizeClaimed: () => void;
  setHasPrize: (hasPrize: boolean) => void;
  setPrizeInfo: (prizeInfo: any) => void;
}

const PrizeTab: React.FC<PrizeTabProps> = ({
  hasPrize,
  prizeInfo,
  supabaseClient,
  effectiveUserId,
  onPrizeClaimed,
  setHasPrize,
  setPrizeInfo
}) => {
  const [playerTag, setPlayerTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPrizeModal, setShowPrizeModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [checkingResult, setCheckingResult] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showResultCheckButton, setShowResultCheckButton] = useState(false);

  // コンポーネントマウント時に抽選結果確認ボタンの表示状態をチェック
  useEffect(() => {
    if (supabaseClient && effectiveUserId) {
      checkLotteryAvailability();
    }
  }, [supabaseClient, effectiveUserId]);

  // 抽選日付用関数 
  const calculateNextLotteryDateString = () => {
    const now = new Date();
    const dateISO = now.toISOString().split('T')[0];
    
    const month = now.getMonth() + 1;
    const date = now.getDate();
    const dateString = `${month}月${date}日`;
    
    return { dateString, dateISO };
  };

  // 最新の抽選結果が確認可能かチェック
  const checkLotteryAvailability = async () => {
    try {
      if (!supabaseClient) return;
      
      // 前回の抽選結果を確認したかどうかのフラグを取得
      const lastLotteryChecked = await AsyncStorage.getItem('last_lottery_checked');
      const lastLotteryDate = await AsyncStorage.getItem('last_lottery_date');
      
      // 最新の抽選結果を取得
      const { data, error } = await supabaseClient
        .from('lottery_results')
        .select('created_at')
        .order('created_at', { ascending: false })
        .limit(1);
        
      if (error) {
        console.error('Lottery result check error:', error);
        return;
      }
      
      // 抽選結果がある場合
      if (data && data.length > 0) {
        const latestResultDate = data[0].created_at;
        
        // 最新の抽選日と前回確認した抽選日を比較
        if (lastLotteryChecked === 'true' && lastLotteryDate === latestResultDate) {
          // すでに確認済みの抽選結果なので、ボタンを表示しない
          setShowResultCheckButton(false);
        } else {
          // 新しい抽選結果か未確認の結果なので、確認ボタンを表示
          setShowResultCheckButton(true);
        }
      } else {
        // 抽選結果がない場合は確認ボタンを表示しない
        setShowResultCheckButton(false);
      }
    } catch (error) {
      console.error('Lottery availability check error:', error);
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
  
  // 確認ダイアログを表示する
  const showConfirmation = () => {
    if (!playerTag || playerTag.trim() === '') {
      Alert.alert('入力エラー', 'プレイヤータグを入力してください。');
      return;
    }
    
    // 確認モーダルを表示
    setShowConfirmationModal(true);
  };
  
  // プレイヤータグを送信する
  const submitPlayerTag = async () => {
    if (!supabaseClient || !effectiveUserId || !prizeInfo) {
      Alert.alert('エラー', 'システムエラーが発生しました。');
      return;
    }
    
    setIsSubmitting(true);
    setShowConfirmationModal(false);
    
    try {
      // プレイヤータグをDBに保存
      const { error } = await supabaseClient
        .from('prize_claims')
        .insert([{
          user_id: effectiveUserId,
          lottery_result_id: prizeInfo.id,
          player_tag: playerTag.trim(),
          status: 'pending'
        }]);
        
      if (error) {
        Alert.alert('エラー', 'データの送信に失敗しました。');
        return;
      }
      
      // lottery_resultsテーブルの景品受取状態を更新
      const { error: updateError } = await supabaseClient
        .from('lottery_results')
        .update({ prize_claimed: true })
        .eq('id', prizeInfo.id);
        
      if (updateError) {
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
              // 親コンポーネントに通知
              onPrizeClaimed();
            }
          }
        ]
      );
      
    } catch (error) {
      Alert.alert('エラー', '処理中にエラーが発生しました。');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 抽選結果確認ボタンのハンドラ
  const handleCheckLotteryResult = async () => {
    if (!supabaseClient || !effectiveUserId) {
      Alert.alert('エラー', 'システムの初期化中です。しばらくお待ちください。');
      return;
    }

    setCheckingResult(true);

    try {
      // 最新の抽選結果を取得
      const { data, error } = await supabaseClient
        .from('lottery_results')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);
        
      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        const result = data[0];
        
        // 自分が当選者かチェック
        const isWinner = result.winner_id === effectiveUserId;
        
        // 既に景品を受け取ったかチェック
        const alreadyClaimed = result.prize_claimed;
        
        // ここで初めて結果確認済みとしてマーク
        await AsyncStorage.setItem('lottery_result_checked', 'true');
        await AsyncStorage.setItem('last_lottery_checked', 'true');
        await AsyncStorage.setItem('last_lottery_date', result.created_at);
        
        // 結果情報をセット
        setLastResult({
          isWinner,
          alreadyClaimed,
          totalParticipants: result.total_participants,
          winnerId: result.winner_id,
          date: result.lottery_date,
          resultId: result.id
        });
        
        // 自分が当選者で未受取の場合はprizeInfoを更新・hasPrizeをtrueに設定
        if (isWinner && !alreadyClaimed) {
          setPrizeInfo(result);
          setHasPrize(true);
        }
        
        // 結果モーダルを表示
        setShowResultModal(true);
        
        // 結果を確認したので、ボタンを非表示にする
        setShowResultCheckButton(false);
      } else {
        Alert.alert('結果なし', '最新の抽選結果が見つかりませんでした。');
      }
    } catch (error) {
      console.error('Check result error:', error);
      Alert.alert('エラー', '抽選結果の確認中にエラーが発生しました。');
    } finally {
      setCheckingResult(false);
    }
  };

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
                onPress={showConfirmation}
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
            
            {/* 抽選結果確認ボタン */}
            {showResultCheckButton && (
              <TouchableOpacity 
                style={[
                  styles.checkResultButton,
                  checkingResult && styles.disabledButton
                ]} 
                onPress={handleCheckLotteryResult}
                disabled={checkingResult}
              >
                {checkingResult ? (
                  <ActivityIndicator color="#fff" size="small" style={styles.buttonSpinner} />
                ) : (
                  <Image 
                    source={require('../../assets/AppIcon/ticket.png')} 
                    style={styles.checkResultIcon} 
                  />
                )}
                <Text style={styles.checkResultText}>
                  抽選結果を確認する
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* 確認モーダル */}
      <Modal
        visible={showConfirmationModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowConfirmationModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.confirmationModal}>
            <View style={styles.confirmationIconContainer}>
              <Text style={styles.confirmationIcon}>⚠️</Text>
            </View>
            <Text style={styles.confirmationTitle}>送信の確認</Text>
            <Text style={styles.confirmationMessage}>
              以下のプレイヤータグで送信します：
            </Text>
            <Text style={styles.tagPreview}>{playerTag}</Text>
            <Text style={styles.confirmationWarning}>
              一度送信すると、プレイヤータグの修正はできません。
              正しいタグを入力したことを確認してください。
            </Text>
            <View style={styles.confirmationButtons}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => setShowConfirmationModal(false)}
              >
                <Text style={styles.cancelButtonText}>キャンセル</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.confirmButton} 
                onPress={submitPlayerTag}
              >
                <Text style={styles.confirmButtonText}>送信する</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 抽選結果モーダル */}
      <Modal
        visible={showResultModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowResultModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.resultModal}>
            <Text style={styles.resultModalTitle}>
              {lastResult?.isWinner ? '🎉 当選結果 🎉' : '抽選結果'}
            </Text>
            
            {lastResult && (
              <>
                <View style={styles.resultInfoContainer}>
                  <Text style={styles.resultInfoLabel}>抽選日</Text>
                  <Text style={styles.resultInfoValue}>
                    {new Date(lastResult.date).toLocaleDateString('ja-JP')}
                  </Text>
                </View>
                
                <View style={styles.resultInfoContainer}>
                  <Text style={styles.resultInfoLabel}>参加者数</Text>
                  <Text style={styles.resultInfoValue}>
                    {lastResult.totalParticipants}人
                  </Text>
                </View>
                
                {lastResult.isWinner ? (
                  <View style={styles.winnerContainer}>
                    <Text style={styles.winnerText}>
                      あなたが当選しました！
                    </Text>
                    {lastResult.alreadyClaimed ? (
                      <Text style={styles.claimedText}>
                        ※景品は既に受け取り済みです
                      </Text>
                    ) : (
                      <Text style={styles.notClaimedText}>
                        景品を受け取ることができます
                      </Text>
                    )}
                  </View>
                ) : (
                  <View style={styles.notWinnerContainer}>
                    <Text style={styles.notWinnerText}>
                      残念ながら、あなたは当選しませんでした。
                    </Text>
                    <Text style={styles.winnerIdText}>
                      当選者ID: {lastResult.winnerId}
                    </Text>
                  </View>
                )}
              </>
            )}
            
            <TouchableOpacity 
              style={styles.closeResultButton} 
              onPress={() => setShowResultModal(false)}
            >
              <Text style={styles.closeResultButtonText}>閉じる</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
                onPress={showConfirmation}
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
  disabledButton: {
    opacity: 0.6,
    backgroundColor: '#a0a0a0',
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
    marginBottom: 24,
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
    marginTop: 16,
    width: '80%',
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
  buttonSpinner: {
    marginRight: 8,
  },
  // 結果モーダル
  resultModal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  resultModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#21A0DB',
    textAlign: 'center',
    marginBottom: 20,
  },
  resultInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  resultInfoLabel: {
    fontSize: 16,
    color: '#666',
  },
  resultInfoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  winnerContainer: {
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
    marginBottom: 20,
  },
  winnerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  claimedText: {
    fontSize: 14,
    color: '#777',
    fontStyle: 'italic',
  },
  notClaimedText: {
    fontSize: 14,
    color: '#FF9800',
    fontWeight: 'bold',
  },
  notWinnerContainer: {
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
    marginBottom: 20,
  },
  notWinnerText: {
    fontSize: 16,
    color: '#FF5722',
    marginBottom: 8,
    textAlign: 'center',
  },
  winnerIdText: {
    fontSize: 14,
    color: '#666',
  },
  closeResultButton: {
    backgroundColor: '#21A0DB',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  closeResultButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
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
  // 確認モーダルのスタイル
  confirmationModal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  confirmationIconContainer: {
    marginBottom: 12,
  },
  confirmationIcon: {
    fontSize: 40,
  },
  confirmationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  confirmationMessage: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  tagPreview: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF5722',
    marginBottom: 16,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    overflow: 'hidden',
  },
  confirmationWarning: {
    fontSize: 14,
    color: '#F44336',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  confirmationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: '#FF5722',
    borderRadius: 8,
    padding: 12,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default PrizeTab;