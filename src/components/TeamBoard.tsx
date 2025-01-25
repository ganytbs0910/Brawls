// TeamBoard.tsx
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
  limit,
  onSnapshot
} from 'firebase/firestore';
import { getCurrentMode } from '../utils/gameData';
import CharacterSelector, { Character } from './CharacterSelector';
import { PostCard, styles } from './TeamBoardComponents';
import { usePlayerData } from '../hooks/useBrawlStarsApi';
import { nameMap } from '../data/characterData';
import { createClient } from '@supabase/supabase-js';

const POST_LIMIT = 6;

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


const supabase = createClient(
  'https://gfdruxypzjwxlzvdqtlu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmZHJ1eHlwemp3eGx6dmRxdGx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc3MDYyNzMsImV4cCI6MjA1MzI4MjI3M30.5UM-xYGCq9neRV_yIFmVxjMfPcwWNv2hu5gb3s6i8pk'
);

const TeamBoard: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
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
  const [isLoadingPlayerData, setIsLoadingPlayerData] = useState(false);
  const [hostInfo, setHostInfo] = useState<HostInfo>({
    wins3v3: 0,
    totalTrophies: 0,
    winsDuo: 0
  });

  const REFRESH_COOLDOWN = 3000;
  const scrollViewRef = useRef<ScrollView>(null);
  const inviteLinkInputRef = useRef<TextInput>(null);
  const playerDataAPI = usePlayerData();

 // リアルタイム更新のuseEffectを変更
useEffect(() => {
  const channel = supabase.channel('team_posts_channel')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'team_posts'
      },
      () => {
        refreshPosts();
      }
    )
    .subscribe();

  refreshPosts();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);

  useEffect(() => {
    loadSavedPlayerTag();
  }, []);

  const loadSavedPlayerTag = async () => {
    try {
      const savedTag = await AsyncStorage.getItem('brawlStarsPlayerTag');
      if (savedTag) {
        setPlayerTag(savedTag);
        handlePlayerTagChange(savedTag);
      }
    } catch (error) {
      console.error('Error loading saved player tag:', error);
    }
  };

  const handlePlayerTagChange = async (tag: string) => {
    setPlayerTag(tag.toUpperCase());
    if (tag.length >= 8) {
      setIsLoadingPlayerData(true);
      try {
        await playerDataAPI.fetchPlayerData(tag);
        if (playerDataAPI.data?.playerInfo) {
          const { playerInfo } = playerDataAPI.data;
          setHostInfo({
            wins3v3: playerInfo['3vs3Victories'] || 0,
            winsDuo: playerInfo.duoVictories || 0,
            totalTrophies: playerInfo.trophies || 0
          });

          if (selectedCharacter) {
            const englishName = Object.entries(nameMap).find(
              ([eng, jpn]) => jpn.toLowerCase() === selectedCharacter.name.toLowerCase()
            )?.[0];

            if (englishName) {
              const brawler = playerInfo.brawlers.find(
                (b: any) => b.name.toLowerCase() === englishName.toLowerCase()
              );
              if (brawler) {
                setCharacterTrophies(brawler.trophies.toString());
              }
            }
          }
          
          await AsyncStorage.setItem('brawlStarsPlayerTag', tag);
        }
      } catch (error) {
        Alert.alert('エラー', 'プレイヤー情報の取得に失敗しました');
      } finally {
        setIsLoadingPlayerData(false);
      }
    }
  };

  const handleCharacterSelect = async (character: Character | null) => {
    setSelectedCharacter(character);
    if (character && playerTag && playerDataAPI.data?.playerInfo) {
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

  // 投稿取得の関数を変更
const refreshPosts = async () => {
  const currentTime = Date.now();
  if (currentTime - lastRefreshTime < REFRESH_COOLDOWN) {
    Alert.alert('エラー', '更新は3秒後に可能になります');
    return;
  }
  try {
    const { data, error } = await supabase
      .from('team_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(POST_LIMIT);

    if (error) throw error;

    setPosts(data as TeamPost[]);
    setLoading(false);
  } catch (error) {
    console.error('Error fetching posts:', error);
    setLoading(false);
  }
};
  // const handleRefresh = async () => {
  //   const currentTime = Date.now();
  //   if (currentTime - lastRefreshTime < REFRESH_COOLDOWN) {
  //     Alert.alert('エラー', '更新は3秒後に可能になります');
  //     return;
  //   }

  //   setIsRefreshing(true);
  //   setLastRefreshTime(currentTime);

  //   try {
  //     const q = query(
  //       collection(db, 'teamPosts'),
  //       orderBy('createdAt', 'desc'),
  //       limit(POST_LIMIT)
  //     );
      
  //     const snapshot = await getDocs(q);
  //     const postData = snapshot.docs.map(doc => ({
  //       id: doc.id,
  //       ...doc.data(),
  //       hostInfo: doc.data().hostInfo || {
  //         wins3v3: 0,
  //         totalTrophies: 0,
  //         winsDuo: 0
  //       },
  //       midCharacters: doc.data().midCharacters || [],
  //       sideCharacters: doc.data().sideCharacters || []
  //     })) as TeamPost[];
      
  //     setPosts(postData);
  //     setTimeout(() => setIsRefreshing(false), 500);
  //   } catch (error) {
  //     console.error('Refresh failed:', error);
  //     Alert.alert('エラー', '更新に失敗しました');
  //     setIsRefreshing(false);
  //   }
  // };

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

    if (!playerTag) {
      Alert.alert('エラー', 'プレイヤータグを入力してください');
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

  // 投稿作成の関数を変更
const createPost = async () => {
  if (!validateInputs()) return;

  try {
    const urlMatch = inviteLink.match(/(https:\/\/link\.brawlstars\.com\/invite\/gameroom\/[^\s]+)/);
    const cleanInviteLink = urlMatch ? urlMatch[1] : inviteLink;

    // 新しい投稿を作成
    const { error: insertError } = await supabase
      .from('team_posts')
      .insert([
        {
          selected_mode: selectedMode,
          invite_link: cleanInviteLink,
          description: description.trim(),
          selected_character: selectedCharacter!.id,
          character_trophies: Number(characterTrophies),
          mid_characters: midCharacters.map(c => c.id),
          side_characters: sideCharacters.map(c => c.id),
          host_info: hostInfo
        }
      ]);

    if (insertError) throw insertError;

    // 古い投稿の削除処理
    const { count } = await supabase
      .from('team_posts')
      .select('*', { count: 'exact' });

    if (count && count > POST_LIMIT) {
      const { error: deleteError } = await supabase.rpc('delete_old_posts', {
        limit_count: POST_LIMIT
      });

      if (deleteError) {
        console.error('Error deleting old posts:', deleteError);
      }
    }

      await AsyncStorage.setItem('lastPostTime', Date.now().toString());
    resetForm();
    setModalVisible(false);
    Alert.alert('成功', '投稿が作成されました');
    refreshPosts();
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

  const renderPostForm = () => (
    <ScrollView ref={scrollViewRef}>
      <View style={styles.postForm}>
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

        <View style={styles.playerTagContainer}>
          <Text style={styles.inputLabel}>プレイヤータグ</Text>
          <View style={styles.playerTagInputContainer}>
            <TextInput
              style={[styles.input, styles.playerTagInput]}
              value={playerTag}
              onChangeText={handlePlayerTagChange}
              placeholder="#XXXXXXXXX"
              autoCapitalize="characters"
              autoCorrect={false}
            />
            {isLoadingPlayerData && (
              <ActivityIndicator 
                size="small" 
                color="#21A0DB" 
                style={styles.loadingIndicator}
              />
            )}
          </View>
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
     </View>
   </ScrollView>
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
           onPress={async () => {
             const lastPostTime = await AsyncStorage.getItem('lastPostTime');
             const currentTime = Date.now();
      
             if (lastPostTime && currentTime - parseInt(lastPostTime) < 180000) {
               Alert.alert('エラー', 'すでに投稿済みです。3分後に再度お試しください。');
               return;
             }
             setModalVisible(true);
           }}
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
           {renderPostForm()}
         </View>
       </KeyboardAvoidingView>
     </Modal>
   </SafeAreaView>
 );
};

export default TeamBoard;