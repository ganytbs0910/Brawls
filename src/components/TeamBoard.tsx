import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
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
  Image,
  StyleSheet
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CharacterSelector, { Character } from './CharacterSelector';
import { PostCard } from './TeamBoardComponents';
import { usePlayerData, validatePlayerTag } from '../hooks/useBrawlStarsApi';
import { nameMap } from '../data/characterData';

const supabase = createClient(
  'https://llxmsbnqtdlqypnwapzz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxseG1zYm5xdGRscXlwbndhcHp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4MjA5MjEsImV4cCI6MjA1MzM5NjkyMX0.EkqepILQU0KgOTW1ZaXpe54ERpZbSRodf24r5022VKs'
);

const POST_LIMIT = 50;

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

const TeamBoard: React.FC = () => {
  const scrollViewRef = useRef<ScrollView>(null);
  const inviteLinkInputRef = useRef<TextInput>(null);
  const playerDataAPI = usePlayerData();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMode, setSelectedMode] = useState('');
  const [selectedModeFilter, setSelectedModeFilter] = useState<string | null>(null);
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
  const [isLoadingPlayerData, setIsLoadingPlayerData] = useState(false);
  const [isPlayerVerified, setIsPlayerVerified] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [hostInfo, setHostInfo] = useState<HostInfo>({
    wins3v3: 0,
    totalTrophies: 0,
    winsDuo: 0
  });

  const REFRESH_COOLDOWN = 3000;

  useEffect(() => {
    const fetchPosts = async () => {
      let query = supabase
        .from('team_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(POST_LIMIT);
      
      if (selectedModeFilter) {
        query = query.eq('selected_mode', selectedModeFilter);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching posts:', error);
        return;
      }

      setPosts(data as TeamPost[]);
      setLoading(false);
    };

    const channel = supabase
      .channel('team_posts_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'team_posts' },
        payload => {
          if (payload.eventType === 'INSERT') {
            setPosts(prev => [payload.new as TeamPost, ...prev].slice(0, POST_LIMIT));
          }
        }
      )
      .subscribe();

    fetchPosts();
    return () => {
      channel.unsubscribe();
    };
  }, [selectedModeFilter]);

  useEffect(() => {
    loadSavedPlayerTag();
    loadSearchHistory();
  }, []);

  const loadSearchHistory = async () => {
    try {
      const savedHistoryStr = await AsyncStorage.getItem('searchHistory');
      if (savedHistoryStr) {
        const savedHistory = JSON.parse(savedHistoryStr);
        const validatedHistory = savedHistory
          .map(tag => validatePlayerTag(tag))
          .filter(Boolean);
        setSearchHistory(validatedHistory);
      }
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  };

  const verifyPlayerTag = async (tag: string) => {
    if (!tag) return false;

    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('API timeout')), 5000);
      });

      const currentTag = tag;
      const dataPromise = playerDataAPI.fetchPlayerData(tag);
      const result = await Promise.race([dataPromise, timeoutPromise]);
      
      if (currentTag !== playerTag) {
        console.log('Tag changed during verification');
        return false;
      }
      
      if (!result || !result.playerInfo) {
        return false;
      }
      
      const { playerInfo } = result;
      setHostInfo({
        wins3v3: playerInfo['3vs3Victories'] || 0,
        winsDuo: playerInfo.duoVictories || 0,
        totalTrophies: playerInfo.trophies || 0
      });
      
      return true;
    } catch (error) {
      console.error('Error verifying player tag:', error);
      return false;
    }
  };

  const loadSavedPlayerTag = async () => {
    try {
      const savedTag = await AsyncStorage.getItem('brawlStarsPlayerTag');
      if (savedTag) {
        const validatedTag = validatePlayerTag(savedTag);
        if (validatedTag) {
          setPlayerTag(validatedTag);
          const isVerified = await verifyPlayerTag(validatedTag);
          if (validatedTag === playerTag) {
            setIsPlayerVerified(isVerified);
          }
        }
      }
    } catch (error) {
      console.error('Error loading saved player tag:', error);
    }
  };

  const handlePlayerTagVerify = async () => {
    if (!playerTag.trim()) {
      Alert.alert('エラー', 'プレイヤータグを入力してください');
      return;
    }

    setIsLoadingPlayerData(true);
    
    try {
      const cleanTag = playerTag.replace('#', '');
      const validatedTag = validatePlayerTag(cleanTag);
      
      if (!validatedTag) {
        Alert.alert('エラー', 'プレイヤータグが不正です');
        setIsPlayerVerified(false);
        return;
      }

      const verificationStartTag = validatedTag;
      const verificationResult = await verifyPlayerTag(validatedTag);
      
      if (verificationStartTag !== playerTag) {
        console.log('Tag changed after verification');
        return;
      }

      if (verificationResult) {
        setIsPlayerVerified(true);
        const newHistory = [validatedTag, ...searchHistory.filter(tag => tag !== validatedTag)].slice(0, 3);
        setSearchHistory(newHistory);
        await AsyncStorage.setItem('searchHistory', JSON.stringify(newHistory));
        await AsyncStorage.setItem('brawlStarsPlayerTag', validatedTag);
      } else {
        Alert.alert('エラー', 'プレイヤーデータの取得に失敗しました');
        setIsPlayerVerified(false);
      }
    } catch (error) {
      console.error('Error fetching player data:', error);
      Alert.alert('エラー', 'プレイヤーデータの取得に失敗しました');
      setIsPlayerVerified(false);
    } finally {
      setIsLoadingPlayerData(false);
    }
  };

  const handleHistorySelect = (tag: string) => {
    const validatedTag = validatePlayerTag(tag);
    if (validatedTag) {
      setPlayerTag(validatedTag);
    }
  };

  const handleCharacterSelect = async (character: Character | null) => {
    if (!isPlayerVerified) return;
    
    setSelectedCharacter(character);
    if (character && playerDataAPI.data?.playerInfo) {
      const englishName = Object.entries(nameMap).find(
        ([eng, jpn]) => jpn.toLowerCase() === character.name.toLowerCase()
      )?.[0];

      if (englishName) {
        const brawler = playerDataAPI.data.playerInfo.brawlers.find(
          (b: any) => b.name.toLowerCase() === englishName.toLowerCase()
        );
        if (brawler) {
          setCharacterTrophies(brawler.trophies.toString());
        }
      }
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
      let query = supabase
        .from('team_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(POST_LIMIT);
      
      if (selectedModeFilter) {
        query = query.eq('selected_mode', selectedModeFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setPosts(data as TeamPost[]);
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
    return urlMatch[1].startsWith(baseUrl);
  };

  const validateInputs = () => {
    if (!selectedMode) {
      Alert.alert('エラー', 'モードを選択してください');
      return false;
    }

    if (!isPlayerVerified) {
      Alert.alert('エラー', 'プレイヤー情報を取得してください');
      return false;
    }

    if (!selectedCharacter) {
      Alert.alert('エラー', 'キャラクターを選択してください');
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

      const { error } = await supabase
        .from('team_posts')
        .insert([{
          selected_mode: selectedMode,
          invite_link: cleanInviteLink,
          description: description.trim(),
          selected_character: selectedCharacter!.id,
          character_trophies: Number(characterTrophies),
          mid_characters: midCharacters.map(c => c.id),
          side_characters: sideCharacters.map(c => c.id),
          host_info: hostInfo
        }]);

      if (error) throw error;

      await AsyncStorage.setItem('lastPostTime', Date.now().toString());
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
  };

  const getCurrentModes = () => {
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
      }
    ];
    return modes;
  };

  const renderSearchHistory = () => {
    if (searchHistory.length === 0 || isPlayerVerified) return null;

    return (
      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>検索履歴</Text>
        {searchHistory.map((tag, index) => (
          <View key={index} style={styles.historyItemContainer}>
            <TouchableOpacity 
              style={{ flex: 1 }} 
              onPress={() => handleHistorySelect(tag)}
            >
              <Text style={styles.historyItem}>{tag}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={async () => {
                const newHistory = searchHistory.filter(t => t !== tag);
                setSearchHistory(newHistory);
                await AsyncStorage.setItem('searchHistory', JSON.stringify(newHistory));
              }}
            >
              <Text style={styles.deleteText}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };

  const renderPostForm = () => (
    <ScrollView ref={scrollViewRef}>
      <View style={styles.postForm}>
        <View style={styles.playerTagContainer}>
          <Text style={styles.inputLabel}>あなたのプレイヤータグ</Text>
          <Text style={styles.tagDescription}>※このタグからホスト情報を補填しています。</Text>
          <View style={styles.playerTagInputContainer}>
            <TextInput
              style={[
                styles.input, 
                styles.playerTagInput,
                isPlayerVerified && styles.disabledInput
              ]}
              value={playerTag}
              onChangeText={setPlayerTag}
              placeholder="#XXXXXXXXX"
              autoCapitalize="characters"
              autoCorrect={false}
              editable={!isPlayerVerified}
            />
            <TouchableOpacity
              style={[
                styles.verifyButton,
                isLoadingPlayerData && styles.verifyButtonDisabled
              ]}
              onPress={() => {
                if (isPlayerVerified) {
                  setIsPlayerVerified(false);
                  setSelectedCharacter(null);
                  setCharacterTrophies('');
                  setMidCharacters([]);
                  setSideCharacters([]);
                } else {
                  handlePlayerTagVerify();
                }
              }}
              disabled={isLoadingPlayerData}
            >
              {isLoadingPlayerData ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.verifyButtonText}>
                  {isPlayerVerified ? '変更する' : '取得'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
          {renderSearchHistory()}
        </View>

        {isPlayerVerified && (
          <>
            <View style={styles.modeSelectorContainer}>
              <Text style={styles.inputLabel}>モード選択</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {getCurrentModes().map((mode, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.modeIconButton,
                      selectedMode === mode.name && styles.selectedModeIconButton,
                      { borderColor: selectedMode === mode.name ? mode.color : '#e0e0e0' }
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
          </>
        )}

        <View style={styles.modalButtons}>
          <TouchableOpacity
            style={[styles.modalButton, styles.cancelButton]}
            onPress={() => {
              setIsPlayerVerified(false);
              setModalVisible(false);
              resetForm();
            }}
          >
            <Text style={styles.cancelButtonText}>キャンセル</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.modalButton, 
              styles.submitButton,
              !isPlayerVerified && styles.submitButtonDisabled
            ]}
            onPress={createPost}
            disabled={!isPlayerVerified}
          >
            <Text style={styles.submitButtonText}>投稿</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  const renderModeFilter = () => (
    <View style={styles.filterContainer}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterScrollContent}
      >
        <TouchableOpacity
          style={[
            styles.filterButton,
            !selectedModeFilter && styles.filterButtonActive,
            { borderColor: '#21A0DB' }
          ]}
          onPress={() => setSelectedModeFilter(null)}
        >
          <Image 
            source={require('../../assets/OtherIcon/starPlayer.png')}
            style={styles.filterIcon}
          />
        </TouchableOpacity>

        {getCurrentModes().map((mode, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.filterButton,
              selectedModeFilter === mode.name && styles.filterButtonActive,
              { borderColor: mode.color }
            ]}
            onPress={() => setSelectedModeFilter(mode.name)}
          >
            <Image source={mode.icon} style={styles.filterIcon} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>募集掲示板</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={[
              styles.refreshButton,
              isRefreshing && styles.refreshButtonDisabled
            ]}
            onPress={handleRefresh}
            disabled={isRefreshing}
          >
            <Text style={styles.refreshButtonText}>更新</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.createButtonText}>募集する</Text>
          </TouchableOpacity>
        </View>
      </View>

      {renderModeFilter()}

      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#21A0DB" />
          </View>
        ) : (
          <ScrollView>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </ScrollView>
        )}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          resetForm();
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalView}>
            {renderPostForm()}
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
  filterContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  filterScroll: {
    flexGrow: 0,
  },
  filterScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButton: {
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#f0f0f0',
  },
  filterButtonText: {
    color: '#666',
    fontSize: 12,
    fontWeight: 'bold',
  },
  filterButtonTextActive: {
    color: '#21A0DB',
  },
  filterIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  modeSelectorContainer: {
    marginBottom: 16,
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
  inviteLinkInput: {
    minHeight: 60,
    paddingTop: 12,
    paddingBottom: 12,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
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
  playerTagContainer: {
    marginBottom: 16,
  },
  playerTagInputContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  playerTagInput: {
    flex: 1,
  },
  verifyButton: {
    backgroundColor: '#21A0DB',
    paddingHorizontal: 12,
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
  tagDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: -8,
    marginBottom: 8,
  },
  disabledInput: {
    backgroundColor: '#f5f5f5',
    color: '#666',
  },
  postForm: {
    padding: 16,
  },
});

export default TeamBoard;