import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, Linking } from 'react-native';
import { characters } from './CharacterSelector';
import { getCurrentMode } from '../utils/gameData';

interface HostInfo {
  wins3v3: number;
  totalTrophies: number;
  winsDuo: number;
}

interface TeamPost {
  id: string;
  selected_mode: string;
  invite_link: string;
  description: string;
  created_at: string;
  selected_character: string;
  character_trophies: number;
  mid_characters: string[];
  side_characters: string[];
  host_info: HostInfo;
}

const timeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) {
    return 'たった今';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}分前`;
  } else if (diffInMinutes < 24 * 60) {
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours}時間前`;
  } else {
    return date.toLocaleDateString('ja-JP', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
};

const handleOpenLink = async (url: string) => {
  try {
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      Alert.alert(
        'チーム参加の確認',
        'チームリンクに参加しますか？',
        [
          {
            text: 'キャンセル',
            style: 'cancel'
          },
          {
            text: '参加する',
            onPress: async () => {
              await Linking.openURL(url);
            }
          }
        ],
        { cancelable: true }
      );
    } else {
      Alert.alert('エラー', 'このリンクを開けません');
    }
  } catch (error) {
    console.error('Error opening link:', error);
    Alert.alert('エラー', 'リンクを開く際にエラーが発生しました');
  }
};

const getCurrentModes = () => {
  const currentDate = new Date();
  const modes = [
      {
        name: "ガチバトル",
        color: "#99ff66",
        icon: require('../../assets/GameModeIcons/rank_front.png')
      },
      {
        name: "デュオバトルロワイヤル",
        color: "#99ff66",
        icon: require('../../assets/GameModeIcons/duo_showdown_icon.png')
      },
      {
        name: "エメラルドハント",
        color: "#DA70D6",
        icon: require('../../assets/GameModeIcons/gem_grab_icon.png')
      },
      {
        name: "ブロストライカー",
        color: "#cccccc",
        icon: require('../../assets/GameModeIcons/brawl_ball_icon.png')
      },
      {
        name: "強奪",
        color: "#cccccc",
        icon: require('../../assets/GameModeIcons/heist_icon.png')
      },
      {
        name: "ノックアウト",
        color: "#FFA500",
        icon: require('../../assets/GameModeIcons/knock_out_icon.png')
      },
      {
        name: "賞金稼ぎ",
        color: "#DA70D6",
        icon: require('../../assets/GameModeIcons/bounty_icon.png')
      },
      {
        name: "殲滅",
        color: "#DA70D6",
        icon: require('../../assets/GameModeIcons/wipeout_icon.png')
      },
      {
        name: "ホットゾーン",
        color: "#cccccc",
        icon: require('../../assets/GameModeIcons/hot_zone_icon.png')
      },
      {
        name: "5vs5ブロストライカー",
        color: "#FFA500",
        icon: require('../../assets/GameModeIcons/5v5brawl_ball_icon.png')
      },
      {
        name: "5vs5殲滅",
        color: "#FFA500",
        icon: require('../../assets/GameModeIcons/5v5wipeout_icon.png')
      },
    ];
  return modes;
};

export const PostCard: React.FC<{ post: TeamPost }> = ({ post }) => {
  const modes = getCurrentModes();
  const mode = modes.find(m => m.name === post.selected_mode) || {
    name: post.selected_mode,
    color: "#21A0DB",
    icon: require('../../assets/GameModeIcons/4800003.png')
  };

  return (
    <TouchableOpacity
      style={styles.postCard}
      onPress={() => handleOpenLink(post.invite_link)}
    >
      <View style={[
        styles.postHeader,
        { backgroundColor: mode.color }
      ]}>
        <View style={styles.headerContent}>
          <View style={styles.modeTagContainer}>
            <Image 
              source={mode.icon}
              style={styles.modeIcon} 
            />
            <Text style={styles.modeName}>{post.selected_mode}</Text>
          </View>
          <Text style={styles.timestamp}>{timeAgo(post.created_at)}</Text>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.infoRow}>
          <View style={styles.recruitSection}>
            <View style={styles.recruitRow}>
              <View style={styles.recruitColumn}>
                <Text style={styles.sectionTitle}>ミッド募集</Text>
                <View style={styles.characterList}>
                  {post.mid_characters.map(charId => (
                    <Image 
                      key={charId}
                      source={characters.find(c => c.id === charId)?.icon}
                      style={styles.recruitCharIcon}
                    />
                  ))}
                </View>
              </View>
              
              <View style={styles.recruitColumn}>
                <Text style={styles.sectionTitle}>サイド募集</Text>
                <View style={styles.characterList}>
                  {post.side_characters.map(charId => (
                    <Image 
                      key={charId}
                      source={characters.find(c => c.id === charId)?.icon}
                      style={styles.recruitCharIcon}
                    />
                  ))}
                </View>
              </View>
            </View>
          </View>

          <View style={styles.hostInfoSection}>
            <Text style={styles.sectionTitle}>ホスト情報</Text>
            <View style={styles.hostStats}>
              <View style={styles.hostStatRow}>
                <Image 
                  source={require('../../assets/OtherIcon/trophy_Icon.png')}
                  style={styles.tinyTrophyIcon}
                />
                <Text>総合トロ: {post.host_info.totalTrophies}</Text>
              </View>
              <View style={styles.hostStatRow}>
                <Image 
                  source={require('../../assets/GameModeIcons/gem_grab_icon.png')}
                  style={styles.tinyTrophyIcon}
                />
                <Text>3vs3勝利数: {post.host_info.wins3v3}</Text>
              </View>
              <View style={styles.hostStatRow}>
                <Image 
                  source={require('../../assets/GameModeIcons/duo_showdown_icon.png')}
                  style={styles.tinyTrophyIcon}
                />
                <Text>デュオ勝利数: {post.host_info.winsDuo}</Text>
              </View>
            </View>
            <View style={styles.hostStatRow}>
              <Image 
                source={characters.find(c => c.id === post.selected_character)?.icon}
                style={styles.smallCharIcon}
              />
              <Text>使用キャラ: </Text>
              <Text>{post.character_trophies}</Text>
            </View>
          </View>
        </View>

        {post.description && (
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>ひとこと</Text>
            <Text style={styles.description}>{post.description}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export const styles = StyleSheet.create({
  autoFillSection: {
    marginBottom: 8,
  },
  autoFillInputContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  autoFillInput: {
    flex: 1,
  },
  autoFillButton: {
    backgroundColor: '#21A0DB',
    paddingHorizontal: 12,
    height: 42,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
  },
  autoFillButtonDisabled: {
    opacity: 0.5,
  },
  autoFillButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 60,
    backgroundColor: '#21A0DB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  createButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  refreshButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  refreshButtonDisabled: {
    opacity: 0.5,
  },
  createButtonText: {
    color: '#21A0DB',
    fontWeight: 'bold',
  },
  refreshButtonText: {
    color: '#21A0DB',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postCard: {
    backgroundColor: '#fff',
    margin: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  postHeader: {
    width: '100%',
    padding: 6,
    marginBottom: 0,
  },
  contentContainer: {
    padding: 8,
  },
  modeTagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modeName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  modeIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  infoRow: {
    flexDirection: 'row',
    gap: 6,
    marginVertical: 6,
  },
  hostInfoSection: {
    flex: 1,
    padding: 6,
    backgroundColor: '#f8f8f8',
    borderRadius: 6,
  },
  hostStats: {
    gap: 2,
  },
  hostStatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  smallCharIcon: {
    width: 24,
    height: 24,
  },
  tinyTrophyIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
  favoriteChars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  recruitSection: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    borderRadius: 6,
    padding: 4,
  },
  recruitRow: {
    flexDirection: 'column',
    gap: 4,
  },
  recruitColumn: {
    width: '100%',
  },
  characterList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
    backgroundColor: '#fff',
    padding: 4,
    borderRadius: 6,
    minHeight: 36,
    alignItems: 'center',
  },
  recruitCharIcon: {
    width: 26,
    height: 26,
  },
  descriptionSection: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  description: {
    color: '#333',
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '90%',
    maxHeight: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#21A0DB',
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  activeTab: {
    backgroundColor: '#21A0DB',
  },
  tabText: {
    fontWeight: 'bold',
    color: '#333',
  },
  activeTabText: {
    color: '#fff',
  },
  hostInfoForm: {
    padding: 16,
  },
  postForm: {
    padding: 16,
  },
  modeSelectorContainer: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  inviteLinkInput: {
    minHeight: 60,
    paddingTop: 12,
    paddingBottom: 12,
  },
  modeIconButton: {
    padding: 12,
    marginRight: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedModeIconButton: {
    backgroundColor: '#f8f8f8',
    borderWidth: 2,
  },
  modeIconLarge: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  submitButton: {
    backgroundColor: '#21A0DB',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  cancelButtonText: {
    textAlign: 'center',
    color: '#666',
    fontWeight: 'bold',
  },
  submitButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
  charSelectorContainer: {
    marginBottom: 16,
  },
  charSelectorTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  charSelectorScroll: {
    maxHeight: 200,
  },
  charSelectorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 8,
    padding: 8,
  },
  charSelectorItem: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  selectedCharSelectorItem: {
    borderColor: '#21A0DB',
    backgroundColor: '#f0f8ff',
  },
  charSelectorIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  searchContainer: {
    padding: 8,
    marginBottom: 8,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#fff',
  },
  requiredText: {
    color: '#ff0000',
    fontSize: 12,
    marginLeft: 4,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 2,
    color: '#333',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timestamp: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.9,
  },
  playerTagContainer: {
    marginBottom: 16,
  },
  playerTagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  playerTagInput: {
    flex: 1,
    marginBottom: 0,
  },
  verifyButton: {
    backgroundColor: '#21A0DB',
    paddingHorizontal: 16,
    height: 42,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
  },
  verifyButtonDisabled: {
    opacity: 0.5,
  },
  verifyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  disabledInput: {
    backgroundColor: '#f5f5f5',
    color: '#666',
  },
  historyContainer: {
    marginTop: 8,
  },
  historyTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 4,
  },
  historyItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 4,
    marginBottom: 4,
    paddingLeft: 8,
  },
  historyItem: {
    fontSize: 14,
    paddingVertical: 6,
    color: '#21A0DB',
  },
  deleteButton: {
    padding: 8,
  },
  deleteText: {
    color: '#ff4444',
    fontSize: 16,
  },
});