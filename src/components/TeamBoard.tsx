import React, { useState, useRef, useEffect } from 'react';
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
import { useTeamBoardTranslation } from '../i18n/teamBoard';
import { TeamBoardTranslation } from '../i18n/teamBoard';
import characterData from '../data/characterAPI.json';
import AdMobService from '../services/AdMobService';
import { createClient, RealtimeChannel } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

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

interface GameMode {
  id: keyof TeamBoardTranslation['modes'];
  name: string;
  color: string;
  icon: any;
}

const TeamBoard: React.FC = () => {
  // カスタムフックと refs の設定
  const { t, currentLanguage } = useTeamBoardTranslation();
  const scrollViewRef = useRef<ScrollView>(null);
  const inviteLinkInputRef = useRef<TextInput>(null);
  const playerDataAPI = usePlayerData();

  // state の設定
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

  // 言語に基づいてテーブル名を取得
  const getTableName = (lang: string) => `team_posts_${lang}`;

  // ゲームモードの設定
  const getCurrentModes = () => {
    const modes: GameMode[] = [
      {
        id: 'ranked',
        name: t.modes.ranked,
        color: "#99ff66",
        icon: require('../../assets/GameModeIcons/rank_front.png')
      },
      {
        id: 'duoShowdown',
        name: t.modes.duoShowdown,
        color: "#99ff66",
        icon: require('../../assets/GameModeIcons/duo_showdown_icon.png')
      },
      {
        id: 'gemGrab',
        name: t.modes.gemGrab,
        color: "#DA70D6",
        icon: require('../../assets/GameModeIcons/gem_grab_icon.png')
      },
      {
        id: 'brawlBall',
        name: t.modes.brawlBall,
        color: "#cccccc",
        icon: require('../../assets/GameModeIcons/brawl_ball_icon.png')
      },
      {
        id: 'heist',
        name: t.modes.heist,
        color: "#cccccc",
        icon: require('../../assets/GameModeIcons/heist_icon.png')
      },
      {
        id: 'knockout',
        name: t.modes.knockout,
        color: "#FFA500",
        icon: require('../../assets/GameModeIcons/knock_out_icon.png')
      },
      {
        id: 'bounty',
        name: t.modes.bounty,
        color: "#DA70D6",
        icon: require('../../assets/GameModeIcons/bounty_icon.png')
      },
      {
        id: 'wipeout',
        name: t.modes.wipeout,
        color: "#DA70D6",
        icon: require('../../assets/GameModeIcons/wipeout_icon.png')
      },
      {
        id: 'hotZone',
        name: t.modes.hotZone,
        color: "#cccccc",
        icon: require('../../assets/GameModeIcons/hot_zone_icon.png')
      },
      {
        id: 'brawlBall5v5',
        name: t.modes.brawlBall5v5,
        color: "#FFA500",
        icon: require('../../assets/GameModeIcons/5v5brawl_ball_icon.png')
      },
      {
        id: 'wipeout5v5',
        name: t.modes.wipeout5v5,
        color: "#FFA500",
        icon: require('../../assets/GameModeIcons/5v5wipeout_icon.png')
      }
    ];
    return modes;
  };

  // 投稿の取得とリアルタイム更新の設定
  useEffect(() => {
    let isSubscribed = true;
    let currentChannel: RealtimeChannel | null = null;

    const fetchPosts = async () => {
      if (!isSubscribed) return;

      setLoading(true);
      try {
        let query = supabase
          .from(getTableName(currentLanguage))
          .select('*')
          .order('created_at', { ascending: false })
          .limit(POST_LIMIT);
        
        if (selectedModeFilter) {
          query = query.eq('selected_mode', selectedModeFilter);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching posts:', error);
          throw error;
        }

        if (isSubscribed) {
          setPosts(data as TeamPost[]);
        }
      } catch (error) {
        console.error('Error in fetchPosts:', error);
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    const setupRealtimeSubscription = async () => {
      try {
        // 既存のチャンネルがあれば解除
        if (currentChannel) {
          await currentChannel.unsubscribe();
        }

        const tableName = getTableName(currentLanguage);
        console.log('Setting up realtime subscription for table:', tableName);

        // 新しいチャンネルを設定
        currentChannel = supabase
          .channel(`team_posts_${currentLanguage}_changes`)
          .on('postgres_changes', 
            { 
              event: '*', 
              schema: 'public', 
              table: tableName 
            },
            payload => {
              if (!isSubscribed) return;
              
              if (payload.eventType === 'INSERT') {
                setPosts(prev => [payload.new as TeamPost, ...prev].slice(0, POST_LIMIT));
              }
            }
          )
          .subscribe();
      } catch (error) {
        console.error('Error in setupRealtimeSubscription:', error);
      }
    };

    fetchPosts();
    setupRealtimeSubscription();

    // クリーンアップ関数
    return () => {
      isSubscribed = false;
      if (currentChannel) {
        currentChannel.unsubscribe();
      }
    };
  }, [selectedModeFilter, currentLanguage]);

  // 初期データの読み込み
  useEffect(() => {
    loadSavedPlayerTag();
    loadSearchHistory();
  }, []);

  // キャラクター名の言語変換
  const getEnglishName = (japaneseName: string) => {
    const characterInfo = characterData.list.find(
      character => character.name.ja === japaneseName
    );
    return characterInfo?.name.en;
  };

  // キャラクター選択時の処理
  const handleCharacterSelect = async (character: Character | null) => {
    if (!isPlayerVerified) return;
    
    setSelectedCharacter(character);
    if (character && playerDataAPI.data?.playerInfo) {
      const englishName = getEnglishName(character.name);
      console.log('Looking for character:', englishName);

      if (englishName) {
        const brawler = playerDataAPI.data.playerInfo.brawlers.find(
          (b: any) => b.name.toLowerCase() === englishName.toLowerCase()
        );
        console.log('Found brawler data:', brawler);

        if (brawler) {
          setCharacterTrophies(brawler.trophies.toString());
        } else {
          console.log('Brawler not found in player data');
          setCharacterTrophies('0');
        }
      } else {
        console.log('Character name mapping not found for:', character.name);
        setCharacterTrophies('0');
      }
    }
  };

  // 検索履歴の読み込み
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

  // プレイヤータグの検証
  const verifyPlayerTag = async (tag: string) => {
    if (!tag) {
      Alert.alert('Error', t.errors.enterTag);
      return false;
    }

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

  // 保存されたプレイヤータグの読み込み
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

  // プレイヤータグの検証処理
  const handlePlayerTagVerify = async () => {
    if (!playerTag.trim()) {
      Alert.alert('Error', t.errors.enterTag);
      return;
    }

    setIsLoadingPlayerData(true);
    
    try {
      const cleanTag = playerTag.replace('#', '');
      const validatedTag = validatePlayerTag(cleanTag);
      
      if (!validatedTag) {
        Alert.alert('Error', t.errors.invalidTag);
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
        Alert.alert('Error', t.errors.fetchFailed);
        setIsPlayerVerified(false);
      }
    } catch (error) {
      console.error('Error fetching player data:', error);
      Alert.alert('Error', t.errors.fetchFailed);
      setIsPlayerVerified(false);
    } finally {
      setIsLoadingPlayerData(false);
    }
  };

  // 検索履歴からのタグ選択
  const handleHistorySelect = (tag: string) => {
    const validatedTag = validatePlayerTag(tag);
    if (validatedTag) {
      setPlayerTag(validatedTag);
    }
  };

  // 投稿の更新処理
  const handleRefresh = async () => {
    const currentTime = Date.now();
    if (currentTime - lastRefreshTime < REFRESH_COOLDOWN) {
      Alert.alert('Error', t.errors.refreshCooldown);
      return;
    }

    setIsRefreshing(true);
    setLastRefreshTime(currentTime);

    try {
      const tableName = getTableName(currentLanguage);
      console.log('Refreshing posts from table:', tableName);

      let query = supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(POST_LIMIT);
      
      if (selectedModeFilter) {
        query = query.eq('selected_mode', selectedModeFilter);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Refresh error:', error);
        throw error;
      }
      setPosts(data as TeamPost[]);
    } catch (error) {
      console.error('Refresh failed:', error);
      Alert.alert('Error', t.errors.refreshFailed);
    } finally {
      // 少し遅延を入れてUXを改善
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  // 招待リンクの検証
  const validateInviteLink = (link: string): boolean => {
    const baseUrl = 'https://link.brawlstars.com/invite/gameroom';
    const urlMatch = link.match(/(https:\/\/link\.brawlstars\.com\/invite\/gameroom\/[^\s]+)/);
    if (!urlMatch) return false;
    return urlMatch[1].startsWith(baseUrl);
  };

  // 入力の検証
  const validateInputs = () => {
    if (!selectedMode) {
      Alert.alert('Error', t.errors.selectMode);
      return false;
    }

    if (!isPlayerVerified) {
      Alert.alert('Error', t.errors.playerInfo);
      return false;
    }

    if (!selectedCharacter) {
      Alert.alert('Error', t.errors.selectCharacter);
      return false;
    }

    if (!inviteLink || !validateInviteLink(inviteLink)) {
      Alert.alert('Error', t.errors.invalidLink);
      return false;
    }

    return true;
  };

  // 投稿の作成
  const createPost = async () => {
    if (!validateInputs()) return;

    // 投稿の頻度制限をチェック
    const lastPostTime = await AsyncStorage.getItem('lastPostTime'); 
    if (lastPostTime) {
      const timeSinceLastPost = Date.now() - Number(lastPostTime);
      if (timeSinceLastPost < 60000) {
        Alert.alert('Error', t.errors.postTooFrequent);
        return;
      }
    }

    try {
      const urlMatch = inviteLink.match(/(https:\/\/link\.brawlstars\.com\/invite\/gameroom\/[^\s]+)/);
      const cleanInviteLink = urlMatch ? urlMatch[1] : inviteLink;

      // テーブル名を現在の言語から取得
      const tableName = getTableName(currentLanguage);
      console.log('Creating post in table:', tableName);

      const postData = {
        selected_mode: selectedMode,
        invite_link: cleanInviteLink,
        description: description.trim(),
        selected_character: selectedCharacter!.id,
        character_trophies: Number(characterTrophies),
        mid_characters: midCharacters.map(c => c.id),
        side_characters: sideCharacters.map(c => c.id),
        host_info: hostInfo
      };

      const { error } = await supabase
        .from(tableName)
        .insert([postData]);

      if (error) {
        console.error('Supabase insert error:', error);
        throw error;
      }

      // 投稿成功時の処理
      await AsyncStorage.setItem('lastPostTime', Date.now().toString());
      resetForm();
      setModalVisible(false);

      // 広告表示の試行
      try {
        if (AdMobService) {
          const adService = AdMobService.initialize();
          if (adService && typeof adService.showInterstitial === 'function') {
            await adService.showInterstitial();
          }
        }
      } catch (adError) {
        console.error('Ad display failed:', adError);
      }

      Alert.alert('Success', t.success.postCreated);
      
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', t.errors.postCreationFailed);
    }
  };

  // フォームのリセット
  const resetForm = () => {
    setSelectedMode('');
    setInviteLink('');
    setDescription('');
    setSelectedCharacter(null);
    setCharacterTrophies('');
    setMidCharacters([]);
    setSideCharacters([]);
  };

  // 検索履歴の表示
  const renderSearchHistory = () => {
    if (searchHistory.length === 0 || isPlayerVerified) return null;

    return (
      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>{t.searchHistory}</Text>
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

  // 投稿フォームの表示
  const renderPostForm = () => (
    <ScrollView ref={scrollViewRef}>
      <View style={styles.postForm}>
        <View style={styles.playerTagContainer}>
          <Text style={styles.inputLabel}>{t.playerTag}</Text>
          <Text style={styles.tagDescription}>{t.tagDescription}</Text>
          <View style={styles.playerTagInputContainer}>
            <TextInput
              style={[
                styles.input, 
                styles.playerTagInput,
                isPlayerVerified && styles.disabledInput
              ]}
              value={playerTag}
              onChangeText={setPlayerTag}
              placeholder={t.tagPlaceholder}
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
                  {isPlayerVerified ? t.change : t.verify}
                </Text>
              )}
            </TouchableOpacity>
          </View>
          {renderSearchHistory()}
        </View>

        {isPlayerVerified && (
          <>
            <View style={styles.modeSelectorContainer}>
              <Text style={styles.inputLabel}>{t.modeSelection}</Text>
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
              title={t.useCharacter}
              onSelect={handleCharacterSelect}
              selectedCharacterId={selectedCharacter?.id}
              isRequired={true}
            />

            <Text style={styles.inputLabel}>{t.midCharacters}</Text>
            <CharacterSelector
              title=""
              onSelect={(character) => {
                if (!character) return;
                setMidCharacters(prev => {
                  if (prev.some(c => c.id === character.id)) {
                    return prev.filter(c => c.id !== character.id);
                  }
                  if (prev.length >= 3) {
                    Alert.alert('Error', t.errors.maxMidChars);
                    return prev;
                  }
                  return [...prev, character];
                });
              }}
              multiSelect={true}
              selectedCharacters={midCharacters}
              maxSelections={3}
            />

            <Text style={styles.inputLabel}>{t.sideCharacters}</Text>
            <CharacterSelector
              title=""
              onSelect={(character) => {
                if (!character) return;
                setSideCharacters(prev => {
                  if (prev.some(c => c.id === character.id)) {
                    return prev.filter(c => c.id !== character.id);
                  }
                  if (prev.length >= 3) {
                    Alert.alert('Error', t.errors.maxSideChars);
                    return prev;
                  }
                  return [...prev, character];
                });
              }}
              multiSelect={true}
              selectedCharacters={sideCharacters}
              maxSelections={3}
            />

            <Text style={styles.inputLabel}>{t.inviteLink}</Text>
            <TextInput
              ref={inviteLinkInputRef}
              style={[styles.input, styles.inviteLinkInput]}
              value={inviteLink}
              onChangeText={setInviteLink}
              placeholder={t.inviteLinkPlaceholder}
              multiline
              maxLength={125}
            />

            <Text style={styles.inputLabel}>{t.comment}</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={description}
              onChangeText={setDescription}
              placeholder={t.commentPlaceholder}
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
            <Text style={styles.cancelButtonText}>{t.cancel}</Text>
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
            <Text style={styles.submitButtonText}>{t.submit}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  // モードフィルターの表示
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

  // メインレンダリング
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t.boardTitle}</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={[
              styles.refreshButton,
              isRefreshing && styles.refreshButtonDisabled
            ]}
            onPress={handleRefresh}
            disabled={isRefreshing}
          >
            <Text style={styles.refreshButtonText}>{t.refresh}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.createButtonText}>{t.create}</Text>
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
  }
});

export default TeamBoard;