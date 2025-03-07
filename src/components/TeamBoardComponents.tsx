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
  mid_characters: string[];
  side_characters: string[];
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

      <View style={styles.contentContainer}>
        <View style={styles.infoRow}>
          <View style={styles.recruitSection}>
            <View style={styles.recruitRow}>
              <View style={styles.recruitColumn}>
                <Text style={styles.sectionTitle}>
                  {t.postCard.recruiting.mid}
                </Text>
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
                <Text style={styles.sectionTitle}>
                  {t.postCard.recruiting.side}
                </Text>
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
            <Text style={styles.sectionTitle}>
              {t.postCard.hostInfo.title}
            </Text>
            <View style={styles.hostStats}>
              <View style={styles.hostStatRow}>
                <Image 
                  source={require('../../assets/OtherIcon/trophy_Icon.png')}
                  style={styles.tinyTrophyIcon}
                />
                <Text>{t.postCard.hostInfo.totalTrophies}: {post.host_info.totalTrophies}</Text>
              </View>
              <View style={styles.hostStatRow}>
                <Image 
                  source={require('../../assets/GameModeIcons/gem_grab_icon.png')}
                  style={styles.tinyTrophyIcon}
                />
                <Text>{t.postCard.hostInfo.wins3v3}: {post.host_info.wins3v3}</Text>
              </View>
              <View style={styles.hostStatRow}>
                <Image 
                  source={require('../../assets/GameModeIcons/duo_showdown_icon.png')}
                  style={styles.tinyTrophyIcon}
                />
                <Text>{t.postCard.hostInfo.winsDuo}: {post.host_info.winsDuo}</Text>
              </View>
            </View>
            <View style={styles.hostStatRow}>
              <Image 
                source={characters.find(c => c.id === post.selected_character)?.icon}
                style={styles.smallCharIcon}
              />
              <Text>{t.postCard.hostInfo.useChar}: </Text>
              <Text>{post.character_trophies}</Text>
            </View>
          </View>
        </View>

        {post.description && (
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>
              {t.postCard.comment.title}
            </Text>
            <Text style={styles.description}>{post.description}</Text>
          </View>
        )}
      </View>
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
});

export default PostCard;