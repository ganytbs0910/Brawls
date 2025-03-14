import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, Linking } from 'react-native';
import { characters } from './CharacterSelector';
import { useTeamBoardComponentsTranslation } from '../i18n/teamBoardComponents';
import { getCurrentModes, getLocalizedModeName } from '../utils/modes';

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
  host_info: HostInfo;
}

const timeAgo = (dateString: string, t: any, currentLanguage: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  // 言語タグを標準形式に変換
  const standardLanguage = currentLanguage === 'zhTw' ? 'zh-TW' : currentLanguage;
  
  if (diffInMinutes < 1) {
    return t.postCard.time.justNow;
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}${t.postCard.time.minutesAgo}`;
  } else if (diffInMinutes < 24 * 60) {
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours}${t.postCard.time.hoursAgo}`;
  } else {
    return date.toLocaleDateString(standardLanguage, {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
};

const handleOpenLink = async (url: string, t: any) => {
  try {
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      Alert.alert(
        t.postCard.joinTeam.title,
        t.postCard.joinTeam.message,
        [
          {
            text: t.postCard.joinTeam.cancel,
            style: 'cancel'
          },
          {
            text: t.postCard.joinTeam.join,
            onPress: async () => {
              await Linking.openURL(url);
            }
          }
        ],
        { cancelable: true }
      );
    } else {
      Alert.alert('Error', t.postCard.errors.cannotOpen);
    }
  } catch (error) {
    console.error('Error opening link:', error);
    Alert.alert('Error', t.postCard.errors.openError);
  }
};

export const PostCard: React.FC<{ post: TeamPost }> = ({ post }) => {
  const { t, currentLanguage } = useTeamBoardComponentsTranslation();
  
  const modes = getCurrentModes(currentLanguage);
  
  // 投稿のモード名から対応するモードを探す
  const mode = modes.find(m => {
    // 現在の言語のモード名と完全一致
    if (m.name === post.selected_mode) return true;
    
    // 他の言語のモード名との一致をチェック
    const allLanguages = ['ja', 'en', 'ko'];
    return allLanguages.some(lang => {
      const localizedName = getLocalizedModeName(m.name, lang);
      return localizedName === post.selected_mode;
    });
  }) || {
    name: post.selected_mode,
    color: "#21A0DB",
    icon: require('../../assets/GameModeIcons/4800003.png')
  };

  // 投稿の表示
  const renderPostContent = () => (
    <View style={styles.contentContainer}>
      <View style={styles.infoRow}>
        <View style={styles.hostInfoSection}>
          <Text style={[styles.sectionTitle, styles.compactSectionTitle]}>
            {t.postCard.hostInfo.title}
          </Text>
          
          {/* 2x2グリッドレイアウトに変更 */}
          <View style={styles.hostStatsGrid}>
            {/* 上段: トロフィーと3vs3勝利数 */}
            <View style={styles.gridRow}>
              {/* 総合トロフィー */}
              <View style={styles.gridItem}>
                <View style={styles.hostStatRow}>
                  <Image 
                    source={require('../../assets/OtherIcon/trophy_Icon.png')}
                    style={styles.tinyTrophyIcon}
                  />
                  <Text numberOfLines={1} ellipsizeMode="tail" style={styles.statText}>
                    {t.postCard.hostInfo.totalTrophies}: {post.host_info.totalTrophies}
                  </Text>
                </View>
              </View>
              
              {/* 3vs3勝利数 */}
              <View style={styles.gridItem}>
                <View style={styles.hostStatRow}>
                  <Image 
                    source={require('../../assets/GameModeIcons/gem_grab_icon.png')}
                    style={styles.tinyTrophyIcon}
                  />
                  <Text numberOfLines={1} ellipsizeMode="tail" style={styles.statText}>
                    {t.postCard.hostInfo.wins3v3}: {post.host_info.wins3v3}
                  </Text>
                </View>
              </View>
            </View>
            
            {/* 下段: デュオ勝利数とキャラクタートロフィー */}
            <View style={styles.gridRow}>
              {/* デュオ勝利数 */}
              <View style={styles.gridItem}>
                <View style={styles.hostStatRow}>
                  <Image 
                    source={require('../../assets/GameModeIcons/duo_showdown_icon.png')}
                    style={styles.tinyTrophyIcon}
                  />
                  <Text numberOfLines={1} ellipsizeMode="tail" style={styles.statText}>
                    {t.postCard.hostInfo.winsDuo}: {post.host_info.winsDuo}
                  </Text>
                </View>
              </View>
              
              {/* キャラクタートロフィー */}
              <View style={styles.gridItem}>
                <View style={styles.hostStatRow}>
                  <Image 
                    source={characters.find(c => c.id === post.selected_character)?.icon}
                    style={styles.smallCharIcon}
                  />
                  <Text numberOfLines={1} ellipsizeMode="tail" style={styles.statText}>
                    {t.postCard.hostInfo.useChar}: {post.character_trophies}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>

      {post.description && (
        <View style={styles.descriptionSection}>
          <Text style={[styles.sectionTitle, styles.compactSectionTitle]}>
            {t.postCard.comment.title}
          </Text>
          <Text style={styles.description}>{post.description}</Text>
        </View>
      )}
    </View>
  );

  return (
    <TouchableOpacity
      style={styles.postCard}
      onPress={() => handleOpenLink(post.invite_link, t)}
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
            <Text style={styles.modeName}>
              {getLocalizedModeName(mode.name, currentLanguage)}
            </Text>
          </View>
          <Text style={styles.timestamp}>
            {timeAgo(post.created_at, t, currentLanguage)}
          </Text>
        </View>
      </View>

      {renderPostContent()}
    </TouchableOpacity>
  );
};

export const styles = StyleSheet.create({
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
    padding: 4, // 6→4に削減
    marginBottom: 0,
  },
  contentContainer: {
    padding: 4, // 6→4にさらに減らす
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
    marginVertical: 1, // 3→1にさらに減らす
  },
  hostInfoSection: {
    padding: 4, // 6→4に減らして上下の余白を縮小
    backgroundColor: '#f8f8f8',
    borderRadius: 6,
  },
  // 以前のスタイルは残しつつ、新しいグリッドレイアウト用のスタイルを追加
  hostStats: {
    gap: 1, // 2→1に減らして余白をさらに縮小
  },
  // 2x2グリッドのためのスタイル
  hostStatsGrid: {
    marginTop: 2, // 4→2に減らして上部マージンを縮小
    marginBottom: 0, // 2→0に減らして下部マージンを削除
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2, // 4→2に減らして行間を縮小
  },
  gridItem: {
    width: '48%', // 少し余白を持たせる
  },
  // 既存のスタイルは残す
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
  statText: {
    fontSize: 12, // テキストサイズを少し小さくして収まりやすくする
  },
  descriptionSection: {
    marginTop: 3, // 8→3に大幅に削減
    padding: 4, // 8→4に半減
    backgroundColor: '#f8f8f8',
    borderRadius: 6, // 8→6に小さく
  },
  description: {
    color: '#333',
    lineHeight: 16, // 20→16に行間を縮小
    fontSize: 12, // フォントサイズを小さく
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 2,
    color: '#333',
  },
  compactSectionTitle: {
    marginBottom: 1, // セクションタイトルの下マージンをさらに縮小
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
});

export default PostCard;