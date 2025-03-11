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
  StyleSheet,
  useWindowDimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CharacterSelector, { Character } from './CharacterSelector';
import { PostCard } from './TeamBoardComponents';
import { usePlayerData, validatePlayerTag, useBrawlStarsApi } from '../hooks/useBrawlStarsApi';
import { useTeamBoardTranslation } from '../i18n/teamBoard';
import { TeamBoardTranslation } from '../i18n/teamBoard';
import characterData from '../data/characterAPI.json';
import AdMobService from '../services/AdMobService';
import { createClient, RealtimeChannel } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
import { GAME_MODES } from '../data/modeData';

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
  host_info: HostInfo;
}

interface GameMode {
  id: string;
  name: string;
  color: string;
  icon: any;
}

interface TeamBoardProps {
  isAdFree: boolean;
  isCompact?: boolean;
  onShowDetails?: (content: React.ReactNode) => void;
}

// 表示するゲームモードを定義
const DISPLAY_MODES = [
  'ranked',
  'duoShowdown',
  'gemGrab',
  'brawlBall',
  'heist',
  'knockout',
  'bounty',
  'wipeout',
  'hotZone',
  'brawlHockey',
  'brawlBall5v5',
  'wipeout5v5'
];

// ゲームモード情報を取得する関数
const getGameModes = (t: TeamBoardTranslation): GameMode[] => {
  if (!t || !t.modes) {
    console.error('Translation object is not properly loaded or modes is undefined');
    return [];
  }

  return DISPLAY_MODES
    .filter(modeId => t.modes[modeId]) // t.modes[modeId]が存在する場合のみ
    .map(modeId => {
      // modeData.tsからゲームモード情報を検索
      const modeEntry = Object.entries(GAME_MODES).find(([_, mode]) => mode.name === modeId);
      
      if (!modeEntry) {
        console.warn(`Mode with id ${modeId} not found in GAME_MODES`);
        return null;
      }

      const [_, modeData] = modeEntry;
      
      return {
        id: modeId,
        name: t.modes[modeId],
        color: modeData.color,
        icon: modeData.icon
      };
    })
    .filter(Boolean) as GameMode[]; // nullを除外
};

const TeamBoard: React.FC<TeamBoardProps> = ({ isAdFree, isCompact, onShowDetails }) => {
  const { width } = useWindowDimensions();
  const isIPad = Platform.OS === 'ios' && Platform.isPad;

  // カスタムフックと refs の設定
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t, currentLanguage } = useTeamBoardTranslation();
  const scrollViewRef = useRef<ScrollView>(null);
  const inviteLinkInputRef = useRef<TextInput>(null);
  const playerDataAPI = usePlayerData();

  // 既存のstate設定
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMode, setSelectedMode] = useState('');
  const [selectedModeFilter, setSelectedModeFilter] = useState<string | null>(null);
  const [inviteLink, setInviteLink] = useState('');
  const [description, setDescription] = useState('');
  const [posts, setPosts] = useState<TeamPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [characterTrophies, setCharacterTrophies] = useState('');
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
  const [gameModes, setGameModes] = useState<GameMode[]>([]);
  
  // TeamBoard専用のBrawlersデータ
  const [playerBrawlers, setPlayerBrawlers] = useState<any[]>([]);

  useEffect(() => {
    // tとt.modesが利用可能になったらゲームモード情報を設定
    if (t && t.modes) {
      setGameModes(getGameModes(t));
    }
  }, [t]); // tが変更されたら再実行

  const REFRESH_COOLDOWN = 3000;

  // TeamBoard専用のプレイヤータグ検証関数
  const verifyPlayerTagForTeamBoard = async (tag: string): Promise<boolean> => {
    console.log('=== Start TeamBoard tag verification ===');
    console.log('Input playerTag:', tag);

    if (!tag.trim()) {
      console.log('Error: Empty tag');
      return false;
    }

    // タグのクリーニングと検証
    const cleanTag = tag.replace('#', '');
    const validatedTag = validatePlayerTag(cleanTag);
    console.log('Cleaned tag:', cleanTag);
    console.log('Validated tag:', validatedTag);
    
    if (!validatedTag) {
      console.log('Error: Invalid tag format');
      return false;
    }

    try {
      // 既存APIを使用してプレイヤーデータを取得
      const result = await playerDataAPI.fetchPlayerData(validatedTag);
      const playerInfo = result?.playerInfo;
      
      if (!playerInfo) {
        console.log('Error: Player data fetch failed');
        return false;
      }
      
      console.log('Verification successful');
      console.log('Player info:', {
        wins3v3: playerInfo['3vs3Victories'],
        winsDuo: playerInfo.duoVictories,
        totalTrophies: playerInfo.trophies
      });
      
      // TeamBoard専用のデータとして保存
      setPlayerBrawlers(playerInfo.brawlers || []);
      setHostInfo({
        wins3v3: playerInfo['3vs3Victories'] || 0,
        winsDuo: playerInfo.duoVictories || 0,
        totalTrophies: playerInfo.trophies || 0
      });
      
      // TeamBoard専用の検索履歴を更新
      const newHistory = [
        validatedTag,
        ...searchHistory.filter(t => t.toUpperCase() !== validatedTag.toUpperCase())
      ].slice(0, 3);
      
      setSearchHistory(newHistory);
      
      // TeamBoard専用のキーを使用して保存
      await AsyncStorage.setItem('teamBoardSearchHistory', JSON.stringify(newHistory));
      await AsyncStorage.setItem('teamBoardPlayerTag', validatedTag);
      
      console.log('=== End TeamBoard tag verification ===');
      return true;
    } catch (error) {
      console.error('Error details:', error);
      console.log('=== End TeamBoard tag verification with error ===');
      return false;
    }
  };

  // 投稿制限をチェックする関数
  const checkPostCooldown = async () => {
    const lastPostTime = await AsyncStorage.getItem('lastPostTime');
    if (lastPostTime) {
      const timeSinceLastPost = Date.now() - Number(lastPostTime);
      if (timeSinceLastPost < 180000) { // 3分 = 180000ミリ秒
        const remainingTime = Math.ceil((180000 - timeSinceLastPost) / 1000);
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        
        let timeMessage = '';
        if (minutes > 0) {
          timeMessage += `${minutes}${t.errors.minutes}`;
        }
        if (seconds > 0) {
          if (minutes > 0) {
            timeMessage += ' ';
          }
          timeMessage += `${seconds}${t.errors.seconds}`;
        }
        
        Alert.alert(
          t.errors.postLimitTitle,
          `${t.errors.postLimitPrefix}${timeMessage}${t.errors.postLimitSuffix}`,
          [{ text: 'OK', style: 'default' }]
        );
        return false;
      }
    }
    return true;
  };

  // 言語に基づいてテーブル名を取得
  const getTableName = (lang: string) => `team_posts_${lang}`;

  // 投稿の取得とリアルタイム更新の設定
  useEffect(() => {
    let isSubscribed = true;
    let currentChannel: RealtimeChannel | null = null;

    const fetchPosts = async () => {
      if (!isSubscribed) return;

      setLoading(true);
      try {
        // 現在の言語でまず試す
        let query = supabase
          .from(getTableName(currentLanguage))
          .select('*')
          .order('created_at', { ascending: false })
          .limit(POST_LIMIT);
        
        if (selectedModeFilter) {
          query = query.eq('selected_mode', selectedModeFilter);
        }

        const { data: languageData, error: languageError } = await query;

        // 現在の言語のデータが空または存在しない場合、英語をフォールバックとして使用
        if ((!languageData || languageData.length === 0) && currentLanguage !== 'en') {
          console.log('No posts found in current language, falling back to English');
          
          query = supabase
            .from(getTableName('en'))
            .select('*')
            .order('created_at', { ascending: false })
            .limit(POST_LIMIT);
          
          if (selectedModeFilter) {
            query = query.eq('selected_mode', selectedModeFilter);
          }

          const { data: englishData, error: englishError } = await query;

          if (englishError) {
            console.error('Error fetching English posts:', englishError);
            throw englishError;
          }

          if (isSubscribed) {
            setPosts(englishData as TeamPost[]);
          }
        } else {
          if (languageError) {
            console.error('Error fetching language posts:', languageError);
            throw languageError;
          }

          if (isSubscribed) {
            setPosts(languageData as TeamPost[]);
          }
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
        if (currentChannel) {
          await currentChannel.unsubscribe();
        }

        const primaryTableName = getTableName(currentLanguage);
        const fallbackTableName = getTableName('en');

        // 現在の言語のチャンネル
        currentChannel = supabase
          .channel(`team_posts_${currentLanguage}_changes`)
          .on('postgres_changes', 
            { 
              event: '*', 
              schema: 'public', 
              table: primaryTableName 
            },
            payload => {
              if (!isSubscribed) return;
              
              if (payload.eventType === 'INSERT') {
                setPosts(prev => [payload.new as TeamPost, ...prev].slice(0, POST_LIMIT));
              }
            }
          );

        // 現在の言語が英語でない場合、英語のチャンネルも監視
        if (currentLanguage !== 'en') {
          currentChannel = currentChannel.on('postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: fallbackTableName
            },
            payload => {
              if (!isSubscribed) return;
              
              if (payload.eventType === 'INSERT') {
                // 現在の投稿が空の場合のみ英語の投稿を表示
                setPosts(prev => {
                  if (prev.length === 0) {
                    return [payload.new as TeamPost, ...prev].slice(0, POST_LIMIT);
                  }
                  return prev;
                });
              }
            }
          );
        }

        await currentChannel.subscribe();
      } catch (error) {
        console.error('Error in setupRealtimeSubscription:', error);
      }
    };

    fetchPosts();
    setupRealtimeSubscription();

    return () => {
      isSubscribed = false;
      if (currentChannel) {
        currentChannel.unsubscribe();
      }
    };
  }, [selectedModeFilter, currentLanguage]);

  // 初期データの読み込み - TeamBoard専用に修正
  useEffect(() => {
    const initializeTeamBoardData = async () => {
      try {
        // TeamBoard専用のローカルストレージからデータを読み込む
        const savedTag = await AsyncStorage.getItem('teamBoardPlayerTag');
        if (savedTag) {
          const validatedTag = validatePlayerTag(savedTag);
          if (validatedTag) {
            setPlayerTag(validatedTag);
          }
        }
        
        // TeamBoard専用の検索履歴を読み込む
        const historyStr = await AsyncStorage.getItem('teamBoardSearchHistory');
        if (historyStr) {
          try {
            const history = JSON.parse(historyStr);
            const validHistory = history
              .map((tag: string) => validatePlayerTag(tag))
              .filter(Boolean);
            setSearchHistory(validHistory);
          } catch (e) {
            console.error('Invalid history format:', e);
          }
        }
      } catch (error) {
        console.error('Error initializing TeamBoard data:', error);
      }
    };
    
    initializeTeamBoardData();
  }, []);

  // キャラクター名の言語変換
  const getEnglishName = (japaneseName: string) => {
    const characterInfo = characterData.list.find(
      character => character.name.ja === japaneseName
    );
    return characterInfo?.name.en;
  };

  // キャラクター選択時の処理 - TeamBoard専用に修正
  const handleCharacterSelect = (character: Character | null) => {
    setSelectedCharacter(character);
    
    if (!character || !isPlayerVerified || playerBrawlers.length === 0) {
      setCharacterTrophies('0');
      return;
    }
    
    const englishName = getEnglishName(character.name);
    console.log('Looking for character:', englishName);

    if (englishName) {
      // TeamBoard専用のbrawlersデータから検索
      const brawler = playerBrawlers.find(
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
  };

  // プレイヤータグ検証ハンドラ - TeamBoard専用に修正
  const handlePlayerTagVerify = async () => {
    console.log('=== Starting TeamBoard player verification ===');
    
    if (isLoadingPlayerData) return;
    
    if (!playerTag.trim()) {
      Alert.alert('Error', t.errors.enterTag);
      return;
    }

    setIsLoadingPlayerData(true);
    
    try {
      // TeamBoard専用の検証関数を使用
      const isVerified = await verifyPlayerTagForTeamBoard(playerTag);
      
      if (isVerified) {
        setIsPlayerVerified(true);
      } else {
        setIsPlayerVerified(false);
        Alert.alert('Error', t.errors.fetchFailed);
      }
    } catch (error) {
      console.error('Error in handlePlayerTagVerify:', error);
      setIsPlayerVerified(false);
      Alert.alert('Error', t.errors.fetchFailed);
    } finally {
      setIsLoadingPlayerData(false);
      console.log('=== End TeamBoard player verification ===');
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
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  // 招待リンクの検証関数
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

    // 文字数制限のチェック
    if (description.length > 100) {
      Alert.alert('Error', t.errors.descriptionTooLong);
      return false;
    }

    if (inviteLink.length > 125) {
      Alert.alert('Error', t.errors.linkTooLong);
      return false;
    }

    return true;
  };

  // チーム投稿作成処理
  const createPost = async () => {
    if (isSubmitting) return; // 既に実行中なら処理を中断
    
    if (!validateInputs()) return;

    try {
      setIsSubmitting(true); // 処理開始時にフラグを立てる

      // 招待リンクの検証と整形
      const urlMatch = inviteLink.match(/(https:\/\/link\.brawlstars\.com\/invite\/gameroom\/[^\s]+)/);
      if (!urlMatch) {
        Alert.alert('Error', t.errors.invalidLink);
        return;
      }
      const cleanInviteLink = urlMatch[1];

      // 広告の準備を先に行う
      let adService;
      const adFreeStatus = await AsyncStorage.getItem('adFreeStatus');
      const isAdFree = adFreeStatus === 'true';

      if (!isAdFree) {
        try {
          adService = await AdMobService.initialize();
          await adService.loadInterstitial();
        } catch (adError) {
          console.error('Ad preparation error:', adError);
        }
      }

      // テーブル名の取得
      const tableName = getTableName(currentLanguage);
      console.log('Creating post in table:', tableName);

      // 投稿データの準備
      const postData = {
        selected_mode: selectedMode,
        invite_link: cleanInviteLink,
        description: description.trim(),
        selected_character: selectedCharacter!.id,
        character_trophies: Number(characterTrophies),
        host_info: hostInfo
      };

      // Supabaseに投稿
      const { error } = await supabase
        .from(tableName)
        .insert([postData]);

      if (error) throw error;

      // クールダウン時間を記録
      await AsyncStorage.setItem('lastPostTime', Date.now().toString());
      
      // フォームをリセット
      resetForm();

      // モーダルを閉じる前に広告表示の準備
      if (!isAdFree && adService) {
        const showAd = async () => {
          try {
            // モーダルが完全に閉じるのを待つ
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // 広告を表示
            await adService.showInterstitial();
            
            setIsSubmitting(false); // 全ての処理が完了したらフラグを解除
          } catch (adError) {
            console.error('Ad showing error:', adError);
            setIsSubmitting(false); // 全ての処理が完了したらフラグを解除
          }
        };

        // モーダルを閉じてから広告表示処理を開始
        setModalVisible(false);
        showAd();
      } else {
        // 広告なしの場合
        setModalVisible(false);
        setTimeout(() => {
          setIsSubmitting(false); // 処理完了後にフラグを解除
        }, 500);
      }

    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', t.errors.postCreationFailed);
      setIsSubmitting(false); // エラー時もフラグを解除
    }
  };

  // フォームのリセット
  const resetForm = () => {
    setSelectedMode('');
    setInviteLink('');
    setDescription('');
    setSelectedCharacter(null);
    setCharacterTrophies('');
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
                await AsyncStorage.setItem('teamBoardSearchHistory', JSON.stringify(newHistory));
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
                isPlayerVerified && styles.disabledInput,
                isPlayerVerified && styles.verifiedInput // 検証成功時の視覚的フィードバック
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
                isLoadingPlayerData && styles.verifyButtonDisabled,
                isPlayerVerified && styles.changeButton // 検証済み時の変更ボタン表示
              ]}
              onPress={() => {
                if (isPlayerVerified) {
                  setIsPlayerVerified(false);
                  setSelectedCharacter(null);
                  setCharacterTrophies('');
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
            {/* ゲームモード選択 */}
            {renderModeSelector()}

            <CharacterSelector
              title={t.useCharacter}
              onSelect={handleCharacterSelect}
              selectedCharacterId={selectedCharacter?.id}
              isRequired={true}
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
            disabled={isSubmitting} // 投稿処理中は無効化
          >
            <Text style={styles.cancelButtonText}>{t.cancel}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.modalButton, 
              styles.submitButton,
              (!isPlayerVerified || isSubmitting) && styles.submitButtonDisabled
            ]}
            onPress={createPost}
            disabled={!isPlayerVerified || isSubmitting} // 投稿処理中は無効化
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>{t.submit}</Text>
            )}
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

        {gameModes.map((mode, index) => (
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

  const renderModeSelector = () => (
    <View style={styles.modeSelectorContainer}>
      <Text style={styles.inputLabel}>{t.modeSelection}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {gameModes.map((mode, index) => (
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
  );

  const containerStyle = {
    ...styles.container,
    ...(isIPad && {
      maxWidth: Math.min(width, 800),
      alignSelf: 'center',
      width: '100%'
    })
  };

  // メインレンダリング
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={containerStyle}>
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
              onPress={async () => {
                const canPost = await checkPostCooldown();
                if (canPost) {
                  setModalVisible(true);
                }
              }}
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
            <View style={[
              styles.modalView,
              isIPad && {
                maxWidth: 600,
                width: '90%',
                alignSelf: 'center'
              }
            ]}>
              {renderPostForm()}
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
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
    width: '90%',
    maxHeight: '90%',
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
  // 検証成功時の視覚的フィードバック用スタイル
  verifiedInput: {
    backgroundColor: '#f0fff0',
    borderColor: '#4CAF50',
  },
  // タグ変更ボタン用のスタイル
  changeButton: {
    backgroundColor: '#FF9800',
  },
  postForm: {
    padding: 16,
  }
});

export default TeamBoard;