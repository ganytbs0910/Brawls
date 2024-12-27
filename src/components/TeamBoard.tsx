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

interface Character {
  id: string;
  name: string;
  icon: any;
}

interface TeamPost {
  id: string;
  selectedMode: string;
  inviteLink: string;
  description: string;
  createdAt: Timestamp;
  selectedCharacter?: string;
  characterTrophies?: number;
}

interface GameMode {
  name: string;
  currentMap: string;
  updateTime: number;
  color: string;
  icon: any;
  isRotating?: boolean;
}

// キャラクターデータの配列
const characters: Character[] = [
  { id: 'shelly', name: 'シェリー', icon: require('../../assets/BrawlerIcons/shelly_pin.png') },
  { id: 'nita', name: 'ニタ', icon: require('../../assets/BrawlerIcons/nita_pin.png') },
  { id: 'colt', name: 'コルト', icon: require('../../assets/BrawlerIcons/colt_pin.png') },
  { id: 'bull', name: 'ブル', icon: require('../../assets/BrawlerIcons/bull_pin.png') },
  { id: 'brock', name: 'ブロック', icon: require('../../assets/BrawlerIcons/brock_pin.png') },
  { id: 'elPrimo', name: 'エルプリモ', icon: require('../../assets/BrawlerIcons/elprimo_pin.png') },
  { id: 'barley', name: 'バーリー', icon: require('../../assets/BrawlerIcons/barley_pin.png') },
  { id: 'poco', name: 'ポコ', icon: require('../../assets/BrawlerIcons/poco_pin.png') },
  { id: 'rosa', name: 'ローサ', icon: require('../../assets/BrawlerIcons/rosa_pin.png') },
  { id: 'jessie', name: 'ジェシー', icon: require('../../assets/BrawlerIcons/jessie_pin.png') },
  { id: 'dynamike', name: 'ダイナマイク', icon: require('../../assets/BrawlerIcons/dynamike_pin.png') },
  { id: 'tick', name: 'ティック', icon: require('../../assets/BrawlerIcons/tick_pin.png') },
  { id: 'eightBit', name: '8ビット', icon: require('../../assets/BrawlerIcons/8bit_pin.png') },
  { id: 'rico', name: 'リコ', icon: require('../../assets/BrawlerIcons/rico_pin.png') },
  { id: 'darryl', name: 'ダリル', icon: require('../../assets/BrawlerIcons/darryl_pin.png') },
  { id: 'penny', name: 'ペニー', icon: require('../../assets/BrawlerIcons/penny_pin.png') },
  { id: 'carl', name: 'カール', icon: require('../../assets/BrawlerIcons/carl_pin.png') },
  { id: 'jacky', name: 'ジャッキー', icon: require('../../assets/BrawlerIcons/jacky_pin.png') },
  { id: 'gus', name: 'ガス', icon: require('../../assets/BrawlerIcons/gus_pin.png') },
  { id: 'bo', name: 'ボウ', icon: require('../../assets/BrawlerIcons/bo_pin.png') },
  { id: 'emz', name: 'Emz', icon: require('../../assets/BrawlerIcons/emz_pin.png') },
  { id: 'stu', name: 'ストゥー', icon: require('../../assets/BrawlerIcons/stu_pin.png') },
  { id: 'piper', name: 'エリザベス', icon: require('../../assets/BrawlerIcons/piper_pin.png') },
  { id: 'pam', name: 'パム', icon: require('../../assets/BrawlerIcons/pam_pin.png') },
  { id: 'frank', name: 'フランケン', icon: require('../../assets/BrawlerIcons/frank_pin.png') },
  { id: 'bibi', name: 'ビビ', icon: require('../../assets/BrawlerIcons/bibi_pin.png') },
  { id: 'bea', name: 'ビー', icon: require('../../assets/BrawlerIcons/bea_pin.png') },
  { id: 'nani', name: 'ナーニ', icon: require('../../assets/BrawlerIcons/nani_pin.png') },
  { id: 'edgar', name: 'エドガー', icon: require('../../assets/BrawlerIcons/edgar_pin.png') },
  { id: 'griff', name: 'グリフ', icon: require('../../assets/BrawlerIcons/griff_pin.png') },
  { id: 'grom', name: 'グロム', icon: require('../../assets/BrawlerIcons/grom_pin.png') },
  { id: 'bonnie', name: 'ボニー', icon: require('../../assets/BrawlerIcons/bonnie_pin.png') },
  { id: 'gale', name: 'ゲイル', icon: require('../../assets/BrawlerIcons/gale_pin.png') },
  { id: 'colette', name: 'コレット', icon: require('../../assets/BrawlerIcons/colette_pin.png') },
  { id: 'belle', name: 'ベル', icon: require('../../assets/BrawlerIcons/belle_pin.png') },
  { id: 'ash', name: 'アッシュ', icon: require('../../assets/BrawlerIcons/ash_pin.png') },
  { id: 'lola', name: 'ローラ', icon: require('../../assets/BrawlerIcons/lola_pin.png') },
  { id: 'sam', name: 'サム', icon: require('../../assets/BrawlerIcons/sam_pin.png') },
  { id: 'mandy', name: 'マンディ', icon: require('../../assets/BrawlerIcons/mandy_pin.png') },
  { id: 'maisie', name: 'メイジー', icon: require('../../assets/BrawlerIcons/maisie_pin.png') },
  { id: 'hank', name: 'ハンク', icon: require('../../assets/BrawlerIcons/hank_pin.png') },
  { id: 'pearl', name: 'パール', icon: require('../../assets/BrawlerIcons/pearl_pin.png') },
  { id: 'larryandLawrie', name: 'ラリー&ローリー', icon: require('../../assets/BrawlerIcons/larryandlawrie_pin.png') },
  { id: 'angelo', name: 'アンジェロ', icon: require('../../assets/BrawlerIcons/angelo_pin.png') },
  { id: 'berry', name: 'ベリー', icon: require('../../assets/BrawlerIcons/berry_pin.png') },
  { id: 'shade', name: 'シェイド', icon: require('../../assets/BrawlerIcons/shade_pin.png') },
  { id: 'mortis', name: 'モーティス', icon: require('../../assets/BrawlerIcons/mortis_pin.png') },
  { id: 'tara', name: 'タラ', icon: require('../../assets/BrawlerIcons/tara_pin.png') },
  { id: 'gene', name: 'ジーン', icon: require('../../assets/BrawlerIcons/gene_pin.png') },
  { id: 'max', name: 'MAX', icon: require('../../assets/BrawlerIcons/max_pin.png') },
  { id: 'mrp', name: 'ミスターP', icon: require('../../assets/BrawlerIcons/mrp_pin.png') },
  { id: 'sprout', name: 'スプラウト', icon: require('../../assets/BrawlerIcons/sprout_pin.png') },
  { id: 'byron', name: 'バイロン', icon: require('../../assets/BrawlerIcons/byron_pin.png') },
  { id: 'squeak', name: 'スクウィーク', icon: require('../../assets/BrawlerIcons/squeak_pin.png') },
  { id: 'lou', name: 'ルー', icon: require('../../assets/BrawlerIcons/lou_pin.png') },
  { id: 'ruffs', name: 'ラフス', icon: require('../../assets/BrawlerIcons/ruffs_pin.png') },
  { id: 'buzz', name: 'バズ', icon: require('../../assets/BrawlerIcons/buzz_pin.png') },
  { id: 'fang', name: 'ファング', icon: require('../../assets/BrawlerIcons/fang_pin.png') },
  { id: 'eve', name: 'イヴ', icon: require('../../assets/BrawlerIcons/eve_pin.png') },
  { id: 'janet', name: 'ジャネット', icon: require('../../assets/BrawlerIcons/janet_pin.png') },
  { id: 'otis', name: 'オーティス', icon: require('../../assets/BrawlerIcons/otis_pin.png') },
  { id: 'buster', name: 'バスター', icon: require('../../assets/BrawlerIcons/buster_pin.png') },
  { id: 'gray', name: 'グレイ', icon: require('../../assets/BrawlerIcons/gray_pin.png') },
  { id: 'rt', name: 'R-T', icon: require('../../assets/BrawlerIcons/rt_pin.png') },
  { id: 'willow', name: 'ウィロー', icon: require('../../assets/BrawlerIcons/willow_pin.png') },
  { id: 'doug', name: 'ダグ', icon: require('../../assets/BrawlerIcons/doug_pin.png') },
  { id: 'chuck', name: 'チャック', icon: require('../../assets/BrawlerIcons/chuck_pin.png') },
  { id: 'charlie', name: 'チャーリー', icon: require('../../assets/BrawlerIcons/charlie_pin.png') },
  { id: 'mico', name: 'ミコ', icon: require('../../assets/BrawlerIcons/mico_pin.png') },
  { id: 'melodie', name: 'メロディー', icon: require('../../assets/BrawlerIcons/melodie_pin.png') },
  { id: 'lily', name: 'リリー', icon: require('../../assets/BrawlerIcons/lily_pin.png') },
  { id: 'clancy', name: 'クランシー', icon: require('../../assets/BrawlerIcons/clancy_pin.png') },
  { id: 'moe', name: 'モー', icon: require('../../assets/BrawlerIcons/moe_pin.png') },
  { id: 'juju', name: 'ジュジュ', icon: require('../../assets/BrawlerIcons/juju_pin.png') },
  { id: 'spike', name: 'スパイク', icon: require('../../assets/BrawlerIcons/spike_pin.png') },
  { id: 'crow', name: 'クロウ', icon: require('../../assets/BrawlerIcons/crow_pin.png') },
  { id: 'leon', name: 'レオン', icon: require('../../assets/BrawlerIcons/leon_pin.png') },
  { id: 'sandy', name: 'サンディ', icon: require('../../assets/BrawlerIcons/sandy_pin.png') },
  { id: 'amber', name: 'アンバー', icon: require('../../assets/BrawlerIcons/amber_pin.png') },
  { id: 'meg', name: 'メグ', icon: require('../../assets/BrawlerIcons/meg_pin.png') },
  { id: 'surge', name: 'サージ', icon: require('../../assets/BrawlerIcons/surge_pin.png') },
  { id: 'chester', name: 'チェスター', icon: require('../../assets/BrawlerIcons/chester_pin.png') },
  { id: 'cordelius', name: 'コーデリアス', icon: require('../../assets/BrawlerIcons/cordelius_pin.png') },
  { id: 'kit', name: 'キット', icon: require('../../assets/BrawlerIcons/kit_pin.png') },
  { id: 'draco', name: 'ドラコ', icon: require('../../assets/BrawlerIcons/draco_pin.png') },
  { id: 'kenji', name: 'ケンジ', icon: require('../../assets/BrawlerIcons/kenji_pin.png') }
];

const CharacterSelector: React.FC<{
  onSelect: (character: Character) => void;
  selectedCharacterId?: string;
}> = ({ onSelect, selectedCharacterId }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    characters.find(c => c.id === selectedCharacterId) || null
  );

  return (
    <View style={styles.characterSelectorContainer}>
      <Text style={styles.inputLabel}>使用キャラクター</Text>
      
      <TouchableOpacity
        style={styles.characterSelectButton}
        onPress={() => setModalVisible(true)}
      >
        {selectedCharacter ? (
          <View style={styles.selectedCharacterContainer}>
            <Image source={selectedCharacter.icon} style={styles.selectedCharacterIcon} />
            <Text style={styles.selectedCharacterName}>{selectedCharacter.name}</Text>
          </View>
        ) : (
          <Text style={styles.placeholderText}>キャラクターを選択</Text>
        )}
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.characterModalOverlay}>
          <View style={styles.characterModalView}>
            <Text style={styles.modalTitle}>キャラクター選択</Text>
            
            <ScrollView style={styles.characterGrid}>
              <View style={styles.characterGridContainer}>
                {characters.map((character) => (
                  <TouchableOpacity
                    key={character.id}
                    style={[
                      styles.characterGridItem,
                      selectedCharacter?.id === character.id && styles.selectedCharacterGridItem
                    ]}
                    onPress={() => {
                      setSelectedCharacter(character);
                      onSelect(character);
                      setModalVisible(false);
                    }}
                  >
                    <Image source={character.icon} style={styles.characterIcon} />
                    <Text style={styles.characterName}>{character.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>閉じる</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const TeamBoard: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMode, setSelectedMode] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [description, setDescription] = useState('');
  const [posts, setPosts] = useState<TeamPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteLinkLength, setInviteLinkLength] = useState(0);
  const [descriptionLength, setDescriptionLength] = useState(0);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [characterTrophies, setCharacterTrophies] = useState('');

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

    if (!selectedCharacter) {
      Alert.alert('エラー', 'キャラクターを選択してください');
      return;
    }

    if (!characterTrophies || isNaN(Number(characterTrophies))) {
      Alert.alert('エラー', '有効なトロフィー数を入力してください');
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
        createdAt: Timestamp.now(),
        selectedCharacter: selectedCharacter.id,
        characterTrophies: Number(characterTrophies)
      });

      setSelectedMode('');
      setInviteLink('');
      setDescription('');
      setSelectedCharacter(null);
      setCharacterTrophies('');
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
          <TouchableOpacity
            key={post.id}
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
                  style={styles.postModeIcon} 
                />
                <Text style={styles.modeTag}>{post.selectedMode}</Text>
              </View>
              <Text style={styles.timestamp}>
                {post.createdAt.toDate().toLocaleString()}
              </Text>
            </View>

            {post.selectedCharacter && (
              <View style={styles.characterInfo}>
                <Image 
                  source={characters.find(c => c.id === post.selectedCharacter)?.icon} 
                  style={styles.postCharacterIcon} 
                />
                <Text style={styles.trophyText}>
                  {post.characterTrophies}🏆
                </Text>
              </View>
            )}
            
            {post.description && (
              <View style={styles.descriptionContainer}>
                <Text style={styles.description}>{post.description}</Text>
              </View>
            )}
          </TouchableOpacity>
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

                            <CharacterSelector
                onSelect={(character) => setSelectedCharacter(character)}
                selectedCharacterId={selectedCharacter?.id}
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

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>招待リンク</Text>
                <Text style={styles.charCount}>{inviteLinkLength}/125</Text>
              </View>
              <TextInput
                style={styles.input}
                value={inviteLink}
                onChangeText={handleInviteLinkChange}
                placeholder="招待リンクを貼り付け"
                multiline
                maxLength={125}
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
  modeTagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  modeTag: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  postModeIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
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
  characterSelectorContainer: {
    marginBottom: 16,
  },
  characterSelectButton: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedCharacterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedCharacterIcon: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
  selectedCharacterName: {
    fontSize: 14,
  },
  placeholderText: {
    color: '#666',
  },
  characterModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  characterModalView: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
  },
  characterGrid: {
    maxHeight: '80%',
  },
  characterGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 8,
  },
  characterGridItem: {
    width: '23%',
    aspectRatio: 1,
    margin: '1%',
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
  },
  selectedCharacterGridItem: {
    backgroundColor: '#e0e0f0',
    borderColor: '#21A0DB',
  },
  characterIcon: {
    width: '60%',
    height: '60%',
    marginBottom: 4,
  },
  characterName: {
    fontSize: 10,
    textAlign: 'center',
  },
  characterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 8,
  },
  postCharacterIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  trophyText: {
    fontSize: 14,
    color: '#666',
  },
});

export default TeamBoard;