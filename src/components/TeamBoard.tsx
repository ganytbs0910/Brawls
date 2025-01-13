import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
import { getCurrentMode, getGameDataForDateTime } from '../utils/gameData';
import CharacterSelector, { Character } from './CharacterSelector';
import { PostCard, styles } from './TeamBoardComponents';
import { usePlayerData } from '../hooks/useBrawlStarsApi';
import { nameMap } from '../data/characterData';

const firebaseConfig = {
  apiKey: "AIzaSyDCuES9P2UaLjQnYNVj0HhakM8o01TR5bQ",
  authDomain: "brawlstatus-eebf8.firebaseapp.com",
  projectId: "brawlstatus-eebf8",
  storageBucket: "brawlstatus-eebf8.appspot.com",
  messagingSenderId: "799846073884",
  appId: "1:799846073884:web:33dca774ee25a04a4bc1d9",
  measurementId: "G-V7C3C0GKQK"
};

interface HostInfo {
  wins3v3: number;
  totalTrophies: number;
  winsDuo: number;
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

let app;
let db;
try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (error) {
  console.error('Firebase initialization failed:', error);
}

const TeamBoard: React.FC = () => {
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
  const [playerTag, setPlayerTag] = useState('');
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const [isLoadingTrophies, setIsLoadingTrophies] = useState(false);
  const [cachedPlayerData, setCachedPlayerData] = useState<any>(null);
  
  const playerDataAPI = usePlayerData();
  
  const [hostInfo, setHostInfo] = useState<HostInfo>({
    wins3v3: 0,
    totalTrophies: 0,
    winsDuo: 0
  });

  const REFRESH_COOLDOWN = 3000;
  const scrollViewRef = useRef<ScrollView>(null);
  const inviteLinkInputRef = useRef<TextInput>(null);

  // 現在開催中のモードを取得する関数
  const getCurrentModes = () => {
    const currentDate = new Date();
    
    const modes = [
      {
        name: "バトルロワイヤル",
        color: "#99ff66",
        icon: require('../../assets/GameModeIcons/showdown_icon.png')
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
        name: "ノックアウト",
        color: "#FFA500",
        icon: require('../../assets/GameModeIcons/knock_out_icon.png')
      }
    ];

    // 強奪/ホットゾーンの現在のモードを取得
    const heistMode = getCurrentMode("heist", currentDate);
    if (heistMode) {
      modes.push({
        name: heistMode.name,
        color: heistMode.name === "強奪" ? "#FF69B4" : "#ff7f7f",
        icon: heistMode.icon
      });
    }

    // 5vs5モードの現在のモードを取得
    const brawlBall5v5Mode = getCurrentMode("brawlBall5v5", currentDate);
    if (brawlBall5v5Mode) {
      modes.push({
        name: brawlBall5v5Mode.name,
        color: brawlBall5v5Mode.name === "5vs5ブロストライカー" ? "#cccccc" : "#e95295",
        icon: brawlBall5v5Mode.icon
      });
    }

    return modes;
  };

  // 現在のモードリスト
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
    loadHostInfo();
  }, []);

  useEffect(() => {
    setCachedPlayerData(null);
  }, [playerTag]);

  const fetchCharacterTrophies = async (character: Character) => {
    if (!playerTag || !character || isLoadingTrophies) return;

    setIsLoadingTrophies(true);
    try {
      if (cachedPlayerData) {
        const englishName = Object.entries(nameMap).find(
          ([eng, jpn]) => jpn.toLowerCase() === character.name.toLowerCase()
        )?.[0];

        if (englishName) {
          const brawler = cachedPlayerData.playerInfo.brawlers.find(
            (b: any) => b.name.toLowerCase() === englishName.toLowerCase()
          );
          if (brawler) {
            setCharacterTrophies(brawler.trophies.toString());
            return;
          }
        }
      }

      await playerDataAPI.fetchPlayerData(playerTag);
      
      if (playerDataAPI.data?.playerInfo) {
        setCachedPlayerData(playerDataAPI.data);
        const englishName = Object.entries(nameMap).find(
          ([eng, jpn]) => jpn.toLowerCase() === character.name.toLowerCase()
        )?.[0];

        const brawler = englishName 
          ? playerDataAPI.data.playerInfo.brawlers.find(
              (b: any) => b.name.toLowerCase() === englishName.toLowerCase()
            )
          : null;

        if (brawler) {
          setCharacterTrophies(brawler.trophies.toString());
        }
      }
    } catch (error) {
      console.error('Error fetching character trophies:', error);
    } finally {
      setIsLoadingTrophies(false);
    }
  };

  const handleCharacterSelect = async (character: Character | null) => {
    setSelectedCharacter(character);
    if (character && playerTag) {
      await fetchCharacterTrophies(character);
    } else {
      setCharacterTrophies('');
    }
  };

  const handleAutoFill = async () => {
    if (!playerTag) {
      Alert.alert('エラー', 'プレイヤータグを入力してください');
      return;
    }

    setIsAutoFilling(true);
    try {
      await playerDataAPI.fetchPlayerData(playerTag);
      
      if (playerDataAPI.data?.playerInfo) {
        const { playerInfo } = playerDataAPI.data;
        const newHostInfo = {
          wins3v3: playerInfo['3vs3Victories'] || 0,
          winsDuo: playerInfo.duoVictories || 0,
          totalTrophies: playerInfo.trophies || 0
        };
        
        setHostInfo(newHostInfo);
        await saveHostInfo(newHostInfo);
        Alert.alert('成功', 'プレイヤー情報を自動入力しました');
      }
    } catch (error) {
      Alert.alert('エラー', 'プレイヤー情報の取得に失敗しました');
    } finally {
      setIsAutoFilling(false);
    }
  };

  const saveHostInfo = async (info: HostInfo) => {
    try {
      await AsyncStorage.setItem('hostInfo', JSON.stringify(info));
    } catch (error) {
      console.error('Error saving host info:', error);
    }
  };

  const loadHostInfo = async () => {
    try {
      const savedInfo = await AsyncStorage.getItem('hostInfo');
      if (savedInfo) {
        setHostInfo(JSON.parse(savedInfo));
      }
      
      const savedTag = await AsyncStorage.getItem('brawlStarsPlayerTag');
      if (savedTag) {
        setPlayerTag(savedTag);
      }
    } catch (error) {
      console.error('Error loading host info:', error);
    }
  };

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
          hostInfo: data.hostInfo || {
            wins3v3: 0,
            totalTrophies: 0,
            winsDuo: 0
          },
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
      fetchPosts();
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
  };
  const renderHostInfoForm = () => (
    <View style={styles.hostInfoForm}>
      <View style={styles.autoFillSection}>
        <Text style={styles.inputLabel}>プレイヤータグ</Text>
        <View style={styles.autoFillInputContainer}>
          <TextInput
            style={[styles.input, styles.autoFillInput]}
            value={playerTag}
            onChangeText={(text) => setPlayerTag(text.toUpperCase())}
            placeholder="#XXXXXXXXX"
            autoCapitalize="characters"
            autoCorrect={false}
          />
          <TouchableOpacity
            style={[
              styles.autoFillButton,
              isAutoFilling && styles.autoFillButtonDisabled
            ]}
            onPress={handleAutoFill}
            disabled={isAutoFilling}
          >
            <Text style={styles.autoFillButtonText}>
              {isAutoFilling ? '取得中...' : '自動入力'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.inputLabel}>3vs3勝利数</Text>
      <TextInput
        style={styles.input}
        value={String(hostInfo.wins3v3)}
        onChangeText={value => setHostInfo(prev => ({
          ...prev,
          wins3v3: Number(value) || 0
        }))}
        onEndEditing={() => saveHostInfo(hostInfo)}
        keyboardType="numeric"
        placeholder="3vs3の勝利数を入力"
      />

      <Text style={styles.inputLabel}>デュオ勝利数</Text>
      <TextInput
        style={styles.input}
        value={String(hostInfo.winsDuo)}
        onChangeText={value => setHostInfo(prev => ({
          ...prev,
          winsDuo: Number(value) || 0
        }))}
        onEndEditing={() => saveHostInfo(hostInfo)}
        keyboardType="numeric"
        placeholder="デュオの勝利数を入力"
      />

      <Text style={styles.inputLabel}>総合トロフィー</Text>
      <TextInput
        style={styles.input}
        value={String(hostInfo.totalTrophies)}
        onChangeText={value => setHostInfo(prev => ({
          ...prev,
          totalTrophies: Number(value) || 0
        }))}
        onEndEditing={() => saveHostInfo(hostInfo)}
        keyboardType="numeric"
        placeholder="総合トロフィー数を入力"
      />
    </View>
  );

  const renderPostForm = () => (
    <View style={styles.postForm}>
      <View style={styles.modeSelectorContainer}>
        <Text style={styles.inputLabel}>モード選択</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {modes.map((mode, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.modeIconButton,
                selectedMode === mode.name && styles.selectedModeIconButton,
                { borderColor: selectedMode === mode.name ? 
                  (typeof mode.color === 'function' ? mode.color() : mode.color) 
                  : '#e0e0e0' 
                }
              ]}
              onPress={() => setSelectedMode(mode.name)}
            >
              <Image source={mode.icon} style={styles.modeIconLarge} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <CharacterSelector
        title="使用キャラクター"
        onSelect={handleCharacterSelect}
        selectedCharacterId={selectedCharacter?.id}
        isRequired={true}
      />

      <Text style={styles.inputLabel}>トロフィー数</Text>
      <View style={styles.trophyInputContainer}>
        <TextInput
          style={[
            styles.input,
            styles.trophyInput,
            isLoadingTrophies && styles.inputDisabled
          ]}
          value={characterTrophies}
          onChangeText={setCharacterTrophies}
          placeholder={isLoadingTrophies ? "取得中..." : "キャラクターのトロフィー数を入力"}
          keyboardType="numeric"
          maxLength={5}
          editable={!isLoadingTrophies}
        />
        {isLoadingTrophies && (
          <ActivityIndicator 
            size="small" 
            color="#21A0DB" 
            style={styles.trophyLoadingIndicator}
          />
        )}
      </View>

      <Text style={styles.inputLabel}>ミッド募集キャラクター (最大3体)</Text>
      <CharacterSelector
        title=""
        onSelect={(character) => {
          if (!character) return;
          setMidCharacters(prev => {
            if (prev.some(c => c.id === character.id)) {
              return prev.filter(c => c.id !== character.id);
            }
            if (prev.length >= 3) {
              Alert.alert('エラー', 'ミッドキャラは3体まで選択できます');
              return prev;
            }
            return [...prev, character];
          });
        }}
        multiSelect={true}
        selectedCharacters={midCharacters}
        maxSelections={3}
      />

      <Text style={styles.inputLabel}>サイド募集キャラクター (最大3体)</Text>
      <CharacterSelector
        title=""
        onSelect={(character) => {
          if (!character) return;
          setSideCharacters(prev => {
            if (prev.some(c => c.id === character.id)) {
              return prev.filter(c => c.id !== character.id);
            }
            if (prev.length >= 3) {
              Alert.alert('エラー', 'サイドキャラは3体まで選択できます');
              return prev;
            }
            return [...prev, character];
          });
        }}
        multiSelect={true}
        selectedCharacters={sideCharacters}
        maxSelections={3}
      />

      <Text style={styles.inputLabel}>招待リンク</Text>
      <TextInput
        ref={inviteLinkInputRef}
        style={[styles.input, styles.inviteLinkInput]}
        value={inviteLink}
        onChangeText={setInviteLink}
        placeholder="招待リンクを貼り付け"
        multiline
        maxLength={125}
      />

      <Text style={styles.inputLabel}>コメント (任意)</Text>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        value={description}
        onChangeText={setDescription}
        placeholder="募集に関する詳細や要望を入力"
        multiline
        maxLength={100}
      />
    </View>
  );

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
              {activeTab === 'host' ? renderHostInfoForm() : renderPostForm()}

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

export default TeamBoard;