// TeamBoard.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  Linking,
  Image
} from 'react-native';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { getCurrentMode } from '../utils/gameData';

const firebaseConfig = {
  apiKey: "AIzaSyDCuES9P2UaLjQnYNVj0HhakM8o01TR5bQ",
  authDomain: "brawlstatus-eebf8.firebaseapp.com",
  projectId: "brawlstatus-eebf8",
  storageBucket: "brawlstatus-eebf8.firebasestorage.app",
  messagingSenderId: "799846073884",
  appId: "1:799846073884:web:33dca774ee25a04a4bc1d9",
  measurementId: "G-V7C3C0GKQK"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

interface TeamPost {
  id: string;
  selectedMode: string;
  inviteLink: string;
  description: string;
  createdAt: Timestamp;
}

interface GameMode {
  name: string;
  currentMap: string;
  updateTime: number;
  color: string;
  icon: any;
  isRotating?: boolean;
}

const TeamBoard: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMode, setSelectedMode] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [description, setDescription] = useState('');
  const [posts, setPosts] = useState<TeamPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteLinkLength, setInviteLinkLength] = useState(0);
  const [descriptionLength, setDescriptionLength] = useState(0);

  const getCurrentModes = (): GameMode[] => {
    const currentDate = new Date();
    
    return [
      {
        name: "バトルロワイヤル",
        currentMap: "current_map",
        updateTime: 5,
        color: "#90EE90",
        icon: require('../../assets/GameModeIcons/showdown_icon.png')
      },
      {
        name: "エメラルドハント",
        currentMap: "current_map",
        updateTime: 11,
        color: "#DA70D6",
        icon: require('../../assets/GameModeIcons/gem_grab_icon.png')
      },
      {
        name: getCurrentMode("heist", currentDate)?.name || "ホットゾーン＆強奪",
        currentMap: "current_map",
        updateTime: 23,
        color: "#FF69B4",
        icon: getCurrentMode("heist", currentDate)?.icon || require('../../assets/GameModeIcons/heist_icon.png')
      },
      {
        name: "ブロストライカー",
        currentMap: "current_map",
        updateTime: 17,
        color: "#4169E1",
        icon: require('../../assets/GameModeIcons/brawl_ball_icon.png')
      },
      {
        name: getCurrentMode("brawlBall5v5", currentDate)?.name || "5vs5ブロストライカー",
        currentMap: "current_map",
        updateTime: 17,
        color: "#808080",
        icon: getCurrentMode("brawlBall5v5", currentDate)?.icon || require('../../assets/GameModeIcons/brawl_ball_icon.png')
      },
      {
        name: getCurrentMode("duel", currentDate)?.name || "デュエル＆殲滅＆賞金稼ぎ",
        currentMap: "current_map",
        updateTime: 17,
        color: "#FF0000",
        icon: getCurrentMode("duel", currentDate)?.icon || require('../../assets/GameModeIcons/bounty_icon.png')
      },
      {
        name: "ノックアウト",
        currentMap: "current_map",
        updateTime: 11,
        color: "#FFA500",
        icon: require('../../assets/GameModeIcons/knock_out_icon.png')
      }
    ];
  };

  const modes = getCurrentModes();

  useEffect(() => {
    const q = query(
      collection(db, 'teamPosts'), 
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const postData: TeamPost[] = [];
      querySnapshot.forEach((doc) => {
        postData.push({ id: doc.id, ...doc.data() } as TeamPost);
      });
      setPosts(postData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const validateInviteLink = (link: string): boolean => {
    const baseUrl = 'https://link.brawlstars.com/invite/gameroom';
    const urlMatch = link.match(/(https:\/\/link\.brawlstars\.com\/invite\/gameroom\/[^\s]+)/);
    if (!urlMatch) return false;
    
    const cleanUrl = urlMatch[1];
    return cleanUrl.startsWith(baseUrl);
  };

  const handleInviteLinkChange = (text: string) => {
    setInviteLink(text);
    setInviteLinkLength(text.length);
  };

  const handleDescriptionChange = (text: string) => {
    setDescription(text);
    setDescriptionLength(text.length);
  };

  const handleOpenLink = async (url: string) => {
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert('エラー', 'このリンクを開けません');
      }
    } catch (error) {
      Alert.alert('エラー', 'リンクを開く際にエラーが発生しました');
    }
  };

  const createPost = async () => {
    if (!selectedMode) {
      Alert.alert('エラー', 'モードを選択してください');
      return;
    }

    if (!inviteLink || !validateInviteLink(inviteLink)) {
      Alert.alert('エラー', '有効な招待リンクを入力してください');
      return;
    }

    try {
      const urlMatch = inviteLink.match(/(https:\/\/link\.brawlstars\.com\/invite\/gameroom\/[^\s]+)/);
      const cleanInviteLink = urlMatch ? urlMatch[1] : inviteLink;

      await addDoc(collection(db, 'teamPosts'), {
        selectedMode,
        inviteLink: cleanInviteLink,
        description: description.trim(),
        createdAt: Timestamp.now()
      });

      setSelectedMode('');
      setInviteLink('');
      setDescription('');
      setModalVisible(false);
      Alert.alert('成功', '投稿が作成されました');
    } catch (error) {
      Alert.alert('エラー', '投稿の作成に失敗しました');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#21A0DB" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>チーム募集掲示板</Text>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.createButtonText}>投稿する</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {posts.map((post) => (
          <View key={post.id} style={styles.postCard}>
            <View style={styles.postHeader}>
              <Text style={styles.modeTag}>{post.selectedMode}</Text>
              <Text style={styles.timestamp}>
                {post.createdAt.toDate().toLocaleString()}
              </Text>
            </View>
            
            <TouchableOpacity 
              style={styles.inviteLinkContainer}
              onPress={() => handleOpenLink(post.inviteLink)}
            >
              <Text style={styles.inviteLink}>{post.inviteLink}</Text>
            </TouchableOpacity>
            
            {post.description && (
              <Text style={styles.description}>{post.description}</Text>
            )}
          </View>
        ))}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <ScrollView>
              <Text style={styles.modalTitle}>新規投稿</Text>
              
              <View style={styles.modeSelectorContainer}>
                <Text style={styles.inputLabel}>モード選択</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {modes.map((mode, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.modeButton,
                        selectedMode === mode.name && styles.selectedModeButton,
                        { backgroundColor: selectedMode === mode.name ? mode.color : '#f0f0f0' }
                      ]}
                      onPress={() => setSelectedMode(mode.name)}
                    >
                      <Image source={mode.icon} style={styles.modeIcon} />
                      <Text style={[
                        styles.modeButtonText,
                        selectedMode === mode.name && styles.selectedModeButtonText
                      ]}>
                        {mode.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>招待リンク</Text>
                <Text style={styles.charCount}>{inviteLinkLength}/75</Text>
              </View>
              <TextInput
                style={styles.input}
                value={inviteLink}
                onChangeText={handleInviteLinkChange}
                placeholder="招待リンクを貼り付け"
                multiline
                maxLength={75}
              />

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>コメント (任意)</Text>
                <Text style={styles.charCount}>{descriptionLength}/100</Text>
              </View>
              <TextInput
                style={[styles.input, styles.multilineInput]}
                value={description}
                onChangeText={handleDescriptionChange}
                placeholder="募集に関する詳細や要望を入力"
                multiline
                maxLength={100}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>キャンセル</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.submitButton]}
                  onPress={createPost}
                >
                  <Text style={styles.submitButtonText}>投稿</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  createButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  createButtonText: {
    color: '#21A0DB',
    fontWeight: 'bold',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modeTag: {
    backgroundColor: '#21A0DB',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    fontSize: 12,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  inviteLinkContainer: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  inviteLink: {
    color: '#21A0DB',
    textDecorationLine: 'underline',
  },
  description: {
    marginTop: 8,
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
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
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
  },
  charCount: {
    fontSize: 12,
    color: '#666',
  },
  modeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginRight: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    minWidth: 100,
  },
  selectedModeButton: {
    backgroundColor: '#21A0DB',
  },
  modeIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  modeButtonText: {
    textAlign: 'center',
    fontSize: 14,
  },
  selectedModeButtonText: {
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
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
  },
});

export default TeamBoard;