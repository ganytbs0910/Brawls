import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, Linking } from 'react-native';
import { Timestamp } from 'firebase/firestore';
import { characters } from './CharacterSelector';

interface HostInfo {
  wins3v3: number;
  totalTrophies: number;
  favoriteCharacters: string[];
}

interface TeamPost {
  id: string;
  selectedMode: string;
  inviteLink: string;
  description: string;
  createdAt: Timestamp;
  selectedCharacter: string;
  characterTrophies: number;
  midCharacters: string[];
  sideCharacters: string[];
  hostInfo: HostInfo;
}

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

export const PostCard: React.FC<{ post: TeamPost }> = ({ post }) => {
  const defaultHostInfo: HostInfo = {
    wins3v3: 0,
    totalTrophies: 0,
    favoriteCharacters: []
  };
  
  const hostInfo = post.hostInfo || defaultHostInfo;
  const modes = [
    {
      name: "バトルロワイヤル",
      color: "#90EE90",
      icon: require('../../assets/GameModeIcons/showdown_icon.png')
    },
    // Add other modes here
  ];

  return (
    <TouchableOpacity
      style={styles.postCard}
      onPress={() => handleOpenLink(post.inviteLink)}
    >
      <View style={styles.postHeader}>
        <View style={[
          styles.modeTagContainer,
          { backgroundColor: modes.find(m => m.name === post.selectedMode)?.color || '#21A0DB' }
        ]}>
          <Image 
            source={modes.find(m => m.name === post.selectedMode)?.icon} 
            style={styles.modeIcon} 
          />
          <Text style={styles.modeName}>{post.selectedMode}</Text>
        </View>
      </View>

      <View style={styles.characterSection}>
        <Text style={styles.sectionTitle}>使用キャラ</Text>
        <View style={styles.characterInfo}>
          <Image 
            source={characters.find(c => c.id === post.selectedCharacter)?.icon} 
            style={styles.characterIcon}
          />
          <Text style={styles.trophyCount}>{post.characterTrophies} 🏆</Text>
        </View>
      </View>

      <View style={styles.hostInfoSection}>
        <Text style={styles.sectionTitle}>ホスト情報</Text>
        <View style={styles.hostStats}>
          <Text>3:3勝利数: {hostInfo.wins3v3}</Text>
          <Text>総合トロ: {hostInfo.totalTrophies}</Text>
          <View style={styles.favoriteChars}>
            <Text>得意キャラ:</Text>
            {hostInfo.favoriteCharacters.map(charId => (
              <Image 
                key={charId}
                source={characters.find(c => c.id === charId)?.icon}
                style={styles.smallCharIcon}
              />
            ))}
          </View>
        </View>
      </View>

      <View style={styles.recruitSection}>
        <View style={styles.recruitPart}>
          <Text style={styles.sectionTitle}>ミッド募集:</Text>
          <View style={styles.characterList}>
            {post.midCharacters.map(charId => (
              <Image 
                key={charId}
                source={characters.find(c => c.id === charId)?.icon}
                style={styles.recruitCharIcon}
              />
            ))}
          </View>
        </View>
        
        <View style={styles.recruitPart}>
          <Text style={styles.sectionTitle}>サイド募集:</Text>
          <View style={styles.characterList}>
            {post.sideCharacters.map(charId => (
              <Image 
                key={charId}
                source={characters.find(c => c.id === charId)?.icon}
                style={styles.recruitCharIcon}
              />
            ))}
          </View>
        </View>
      </View>

      {post.description && (
        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>ひとこと</Text>
          <Text style={styles.description}>{post.description}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export const styles = StyleSheet.create({
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
    margin: 8,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  postHeader: {
    marginBottom: 12,
  },
  modeTagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
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
  characterSection: {
    marginVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  characterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 8,
    borderRadius: 8,
  },
  characterIcon: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  trophyCount: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  hostInfoSection: {
    marginVertical: 12,
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  hostStats: {
    gap: 8,
  },
  favoriteChars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  smallCharIcon: {
    width: 24,
    height: 24,
  },
  recruitSection: {
    marginVertical: 12,
  },
  recruitPart: {
    marginBottom: 12,
  },
  characterList: {
    flexDirection: 'row',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  recruitCharIcon: {
    width: 32,
    height: 32,
  },
  descriptionSection: {
    marginTop: 12,
    padding: 12,
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
  modeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginRight: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    minWidth: 120,
  },
  selectedModeButton: {
    backgroundColor: '#21A0DB',
  },
  modeButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  selectedModeButtonText: {
    color: '#fff',
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
  cancelButtonText: {
    textAlign: 'center',
    color: '#666',
    fontWeight: 'bold',
  },
  submitButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  }
});