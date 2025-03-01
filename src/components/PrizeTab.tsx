import React, { useState } from 'react';
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

// Brawl Stars ギフトリンク
const BRAWL_STARS_GIFT_LINK = 'https://link.brawlstars.com/?supercell_id&p=96-61b0620d-6de4-4848-999d-d97765726124';

interface PrizeTabProps {
  hasPrize: boolean;
  prizeInfo: any;
  supabaseClient: SupabaseClient | null;
  effectiveUserId: string | null;
  onPrizeClaimed: () => void;
}

const PrizeTab: React.FC<PrizeTabProps> = ({
  hasPrize,
  prizeInfo,
  supabaseClient,
  effectiveUserId,
  onPrizeClaimed
}) => {
  const [playerTag, setPlayerTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPrizeModal, setShowPrizeModal] = useState(false);

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
        // claimed_atフィールドを削除
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

export default PrizeTab;