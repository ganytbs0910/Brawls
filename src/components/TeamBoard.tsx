import React, { useState, useEffect, useRef } from 'react';
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
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard
} from 'react-native';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc,
  query,
  orderBy,
  getDocs,
  Timestamp,
  limit
} from 'firebase/firestore';
import { getCurrentMode } from '../utils/gameData';
import CharacterSelector, { Character, characters } from './CharacterSelector';

const firebaseConfig = {
  apiKey: "AIzaSyDCuES9P2UaLjQnYNVj0HhakM8o01TR5bQ",
  authDomain: "brawlstatus-eebf8.firebaseapp.com",
  projectId: "brawlstatus-eebf8",
  storageBucket: "brawlstatus-eebf8.firebaseapp.com",
  messagingSenderId: "799846073884",
  appId: "1:799846073884:web:33dca774ee25a04a4bc1d9",
  measurementId: "G-V7C3C0GKQK"
};

let app;
let db;
try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (error) {
  console.error('Firebase initialization failed:', error);
}

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

interface GameMode {
  name: string;
  color: string;
  icon: any;
  isRotating?: boolean;
}

const TeamBoard: React.FC = () => {
  // State management
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'host' | 'post'>('host');
  const [selectedMode, setSelectedMode] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [description, setDescription] = useState('');
  const [posts, setPosts] = useState<TeamPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [characterTrophies, setCharacterTrophies] = useState('');
  const [midCharacters, setMidCharacters] = useState<Character[]>([]);
  const [sideCharacters, setSideCharacters] = useState<Character[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState(0);
  const [hostInfo, setHostInfo] = useState<HostInfo>({
    wins3v3: 0,
    totalTrophies: 0,
    favoriteCharacters: []
  });

  const REFRESH_COOLDOWN = 3000;
  const scrollViewRef = useRef<ScrollView>(null);
  const inviteLinkInputRef = useRef<TextInput>(null);

  const getCurrentModes = (): GameMode[] => {
    const currentDate = new Date();
    return [
      {
        name: "バトルロワイヤル",
        color: "#90EE90",
        icon: require('../../assets/GameModeIcons/showdown_icon.png')
      },
      {
        name: "エメラルドハント",
        color: "#DA70D6",
        icon: require('../../assets/GameModeIcons/gem_grab_icon.png')
      },
      {
        name: getCurrentMode("heist", currentDate)?.name || "ホットゾーン＆強奪",
        color: "#FF69B4",
        icon: getCurrentMode("heist", currentDate)?.icon || require('../../assets/GameModeIcons/heist_icon.png')
      },
      {
        name: "ブロストライカー",
        color: "#4169E1",
        icon: require('../../assets/GameModeIcons/brawl_ball_icon.png')
      },
      {
        name: getCurrentMode("brawlBall5v5", currentDate)?.name || "5vs5ブロストライカー",
        color: "#808080",
        icon: getCurrentMode("brawlBall5v5", currentDate)?.icon || require('../../assets/GameModeIcons/brawl_ball_icon.png')
      },
      {
        name: getCurrentMode("duel", currentDate)?.name || "デュエル＆殲滅＆賞金稼ぎ",
        color: "#FF0000",
        icon: getCurrentMode("duel", currentDate)?.icon || require('../../assets/GameModeIcons/bounty_icon.png')
      },
      {
        name: "ノックアウト",
        color: "#FFA500",
        icon: require('../../assets/GameModeIcons/knock_out_icon.png')
      }
    ];
  };

  const modes = getCurrentModes();
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setTimeout(() => {
          inviteLinkInputRef.current?.measure((x, y, width, height, pageX, pageY) => {
            scrollViewRef.current?.scrollTo({
              y: pageY - 100,
              animated: true
            });
          });
        }, 100);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const q = query(
      collection(db, 'teamPosts'),
      orderBy('createdAt', 'desc'),
      limit(10)
    );
    
    try {
      const snapshot = await getDocs(q);
      const postData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // デフォルトのホスト情報を設定
          hostInfo: data.hostInfo || {
            wins3v3: 0,
            totalTrophies: 0,
            favoriteCharacters: []
          },
          // 募集キャラクターがない場合は空配列を設定
          midCharacters: data.midCharacters || [],
          sideCharacters: data.sideCharacters || []
        }
      }) as TeamPost[];
      setPosts(postData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      Alert.alert('エラー', 'データの取得に失敗しました');
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    const currentTime = Date.now();
    if (currentTime - lastRefreshTime < REFRESH_COOLDOWN) {
      Alert.alert('エラー', '更新は3秒後に可能になります');
      return;
    }

    setIsRefreshing(true);
    setLastRefreshTime(currentTime);

    try {
      await fetchPosts();
      setTimeout(() => setIsRefreshing(false), 500);
    } catch (error) {
      console.error('Refresh failed:', error);
      Alert.alert('エラー', '更新に失敗しました');
      setIsRefreshing(false);
    }
  };

  const validateInviteLink = (link: string): boolean => {
    const baseUrl = 'https://link.brawlstars.com/invite/gameroom';
    const urlMatch = link.match(/(https:\/\/link\.brawlstars\.com\/invite\/gameroom\/[^\s]+)/);
    if (!urlMatch) return false;
    
    const cleanUrl = urlMatch[1];
    return cleanUrl.startsWith(baseUrl);
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

  const validateInputs = () => {
    if (!selectedMode) {
      Alert.alert('エラー', 'モードを選択してください');
      return false;
    }

    if (!selectedCharacter) {
      Alert.alert('エラー', 'キャラクターを選択してください');
      return false;
    }

    if (!characterTrophies || isNaN(Number(characterTrophies))) {
      Alert.alert('エラー', '有効なトロフィー数を入力してください');
      return false;
    }

    if (!inviteLink || !validateInviteLink(inviteLink)) {
      Alert.alert('エラー', '有効な招待リンクを入力してください');
      return false;
    }

    return true;
  };

  const createPost = async () => {
    if (!validateInputs()) return;

    try {
      const urlMatch = inviteLink.match(/(https:\/\/link\.brawlstars\.com\/invite\/gameroom\/[^\s]+)/);
      const cleanInviteLink = urlMatch ? urlMatch[1] : inviteLink;

      const newPost = {
        selectedMode,
        inviteLink: cleanInviteLink,
        description: description.trim(),
        createdAt: Timestamp.now(),
        selectedCharacter: selectedCharacter!.id,
        characterTrophies: Number(characterTrophies),
        midCharacters: midCharacters.map(c => c.id),
        sideCharacters: sideCharacters.map(c => c.id),
        hostInfo
      };

      await addDoc(collection(db, 'teamPosts'), newPost);
      resetForm();
      setModalVisible(false);
      Alert.alert('成功', '投稿が作成されました');
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('エラー', '投稿の作成に失敗しました');
    }
  };

  const resetForm = () => {
    setSelectedMode('');
    setInviteLink('');
    setDescription('');
    setSelectedCharacter(null);
    setCharacterTrophies('');
    setMidCharacters([]);
    setSideCharacters([]);
    setHostInfo({
      wins3v3: 0,
      totalTrophies: 0,
      favoriteCharacters: []
    });
  };
  const PostCard: React.FC<{ post: TeamPost }> = ({ post }) => {
    // デフォルトのホスト情報を設定
    const defaultHostInfo: HostInfo = {
      wins3v3: 0,
      totalTrophies: 0,
      favoriteCharacters: []
    };
    
    // ホスト情報が存在しない場合はデフォルト値を使用
    const hostInfo = post.hostInfo || defaultHostInfo;

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
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={[styles.refreshButton, isRefreshing && styles.refreshButtonDisabled]}
            onPress={handleRefresh}
            disabled={isRefreshing}
          >
            <Text style={styles.refreshButtonText}>
              {isRefreshing ? '更新中...' : '更新'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.createButtonText}>投稿する</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalView}>
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'host' && styles.activeTab]}
                onPress={() => setActiveTab('host')}
              >
                <Text style={[styles.tabText, activeTab === 'host' && styles.activeTabText]}>
                  ホスト情報
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'post' && styles.activeTab]}
                onPress={() => setActiveTab('post')}
              >
                <Text style={[styles.tabText, activeTab === 'post' && styles.activeTabText]}>
                  新規投稿
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView ref={scrollViewRef}>
              {activeTab === 'host' ? (
                <View style={styles.hostInfoForm}>
                  <Text style={styles.inputLabel}>3vs3勝利数</Text>
                  <TextInput
                    style={styles.input}
                    value={String(hostInfo.wins3v3)}
                    onChangeText={value => setHostInfo(prev => ({
                      ...prev,
                      wins3v3: Number(value) || 0
                    }))}
                    keyboardType="numeric"
                    placeholder="3vs3の勝利数を入力"
                  />

                  <Text style={styles.inputLabel}>総合トロフィー</Text>
                  <TextInput
                    style={styles.input}
                    value={String(hostInfo.totalTrophies)}
                    onChangeText={value => setHostInfo(prev => ({
                      ...prev,
                      totalTrophies: Number(value) || 0
                    }))}
                    keyboardType="numeric"
                    placeholder="総合トロフィー数を入力"
                  />

                  <Text style={styles.inputLabel}>得意キャラ (最大2体)</Text>
                  <CharacterSelector
                    title=""
                    onSelect={(character) => {
                      if (!character) return;
                      setHostInfo(prev => ({
                        ...prev,
                        favoriteCharacters: prev.favoriteCharacters.includes(character.id)
                          ? prev.favoriteCharacters.filter(id => id !== character.id)
                          : prev.favoriteCharacters.length < 2
                            ? [...prev.favoriteCharacters, character.id]
                            : prev.favoriteCharacters
                      }));
                    }}
                    multiSelect={true}
                    selectedCharacters={hostInfo.favoriteCharacters.map(id => 
                      characters.find(c => c.id === id)!
                    )}
                    maxSelections={2}
                  />
                </View>
              ) : (
                <View style={styles.postForm}>
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

                  <CharacterSelector
                    title="使用キャラクター"
                    onSelect={setSelectedCharacter}
                    selectedCharacterId={selectedCharacter?.id}
                    isRequired={true}
                  />

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>トロフィー数</Text>
                  </View>
                  <TextInput
                    style={styles.input}
                    value={characterTrophies}
                    onChangeText={setCharacterTrophies}
                    placeholder="キャラクターのトロフィー数を入力"
                    keyboardType="numeric"
                    maxLength={5}
                  />

                  <Text style={styles.inputLabel}>ミッド募集キャラクター (最大2体)</Text>
                  <CharacterSelector
                    title=""
                    onSelect={(character) => {
                      if (!character) return;
                      setMidCharacters(prev => {
                        if (prev.some(c => c.id === character.id)) {
                          return prev.filter(c => c.id !== character.id);
                        }
                        if (prev.length >= 2) {
                          Alert.alert('エラー', 'ミッドキャラは2体まで選択できます');
                          return prev;
                        }
                        return [...prev, character];
                      });
                    }}
                    multiSelect={true}
                    selectedCharacters={midCharacters}
                    maxSelections={2}
                  />

                  <Text style={styles.inputLabel}>サイド募集キャラクター (最大2体)</Text>
                  <CharacterSelector
                    title=""
                    onSelect={(character) => {
                      if (!character) return;
                      setSideCharacters(prev => {
                        if (prev.some(c => c.id === character.id)) {
                          return prev.filter(c => c.id !== character.id);
                        }
                        if (prev.length >= 2) {
                          Alert.alert('エラー', 'サイドキャラは2体まで選択できます');
                          return prev;
                        }
                        return [...prev, character];
                      });
                    }}
                    multiSelect={true}
                    selectedCharacters={sideCharacters}
                    maxSelections={2}
                  />

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>招待リンク</Text>
                  </View>
                  <TextInput
                    ref={inviteLinkInputRef}
                    style={[styles.input, styles.inviteLinkInput]}
                    value={inviteLink}
                    onChangeText={setInviteLink}
                    placeholder="招待リンクを貼り付け"
                    multiline
                    maxLength={125}
                  />

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>コメント (任意)</Text>
                  </View>
                  <TextInput
                    style={[styles.input, styles.multilineInput]}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="募集に関する詳細や要望を入力"
                    multiline
                    maxLength={100}
                  />
                </View>
              )}

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>キャンセル</Text>
                </TouchableOpacity>
                {activeTab === 'post' && (
                  <TouchableOpacity
                    style={[styles.modalButton, styles.submitButton]}
                    onPress={createPost}
                  >
                    <Text style={styles.submitButtonText}>投稿</Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};
  const styles = StyleSheet.create({
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

export default TeamBoard;