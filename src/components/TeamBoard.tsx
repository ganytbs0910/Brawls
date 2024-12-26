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
} from 'react-native';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot,
  Timestamp,
  where,
  getDocs
} from 'firebase/firestore';
import CharacterImage from './CharacterImage';
import { CHARACTER_MAP } from '../data/characterCompatibility';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDCuES9P2UaLjQnYNVj0HhakM8o01TR5bQ",
  authDomain: "brawlstatus-eebf8.firebaseapp.com",
  projectId: "brawlstatus-eebf8",
  storageBucket: "brawlstatus-eebf8.firebasestorage.app",
  messagingSenderId: "799846073884",
  appId: "1:799846073884:web:33dca774ee25a04a4bc1d9",
  measurementId: "G-V7C3C0GKQK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

interface TeamPost {
  id: string;
  selectedCharacters: string[];
  playerName: string;
  description: string;
  createdAt: Timestamp;
  requirements: string;
}

const TeamBoard: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [createPostModal, setCreatePostModal] = useState(false);
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [posts, setPosts] = useState<TeamPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to posts
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

  const handleCharacterSelect = (character: string) => {
    if (selectedCharacters.includes(character)) {
      setSelectedCharacters(selectedCharacters.filter(char => char !== character));
      return;
    }

    if (selectedCharacters.length < 3) {
      setSelectedCharacters([...selectedCharacters, character]);
    }
  };

  const createPost = async () => {
    if (selectedCharacters.length === 0) {
      Alert.alert('エラー', 'キャラクターを選択してください');
      return;
    }

    if (!playerName.trim()) {
      Alert.alert('エラー', 'プレイヤー名を入力してください');
      return;
    }

    try {
      await addDoc(collection(db, 'teamPosts'), {
        selectedCharacters,
        playerName: playerName.trim(),
        description: description.trim(),
        requirements: requirements.trim(),
        createdAt: Timestamp.now()
      });

      setSelectedCharacters([]);
      setPlayerName('');
      setDescription('');
      setRequirements('');
      setCreatePostModal(false);
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
          onPress={() => setCreatePostModal(true)}
        >
          <Text style={styles.createButtonText}>投稿する</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {posts.map((post) => (
          <View key={post.id} style={styles.postCard}>
            <View style={styles.postHeader}>
              <Text style={styles.playerName}>{post.playerName}</Text>
              <Text style={styles.timestamp}>
                {post.createdAt.toDate().toLocaleString()}
              </Text>
            </View>
            
            <View style={styles.charactersContainer}>
              {post.selectedCharacters.map((character, index) => (
                <View key={index} style={styles.characterItem}>
                  <CharacterImage characterName={character} size={40} />
                  <Text style={styles.characterName}>{character}</Text>
                </View>
              ))}
            </View>
            
            {post.description && (
              <Text style={styles.description}>{post.description}</Text>
            )}
            
            {post.requirements && (
              <View style={styles.requirementsContainer}>
                <Text style={styles.requirementsLabel}>募集要件:</Text>
                <Text style={styles.requirements}>{post.requirements}</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Create Post Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={createPostModal}
        onRequestClose={() => setCreatePostModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <ScrollView>
              <Text style={styles.modalTitle}>新規投稿</Text>
              
              <Text style={styles.inputLabel}>キャラクター選択</Text>
              <View style={styles.characterSelection}>
                {Object.values(CHARACTER_MAP).map((character) => (
                  <TouchableOpacity
                    key={character}
                    style={[
                      styles.characterButton,
                      selectedCharacters.includes(character) && styles.selectedCharacterButton
                    ]}
                    onPress={() => handleCharacterSelect(character)}
                  >
                    <CharacterImage characterName={character} size={30} />
                    <Text style={[
                      styles.characterButtonText,
                      selectedCharacters.includes(character) && styles.selectedCharacterButtonText
                    ]}>
                      {character}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>プレイヤー名</Text>
              <TextInput
                style={styles.input}
                value={playerName}
                onChangeText={setPlayerName}
                placeholder="プレイヤー名を入力"
              />

              <Text style={styles.inputLabel}>説明</Text>
              <TextInput
                style={[styles.input, styles.multilineInput]}
                value={description}
                onChangeText={setDescription}
                placeholder="説明を入力"
                multiline
              />

              <Text style={styles.inputLabel}>募集要件</Text>
              <TextInput
                style={[styles.input, styles.multilineInput]}
                value={requirements}
                onChangeText={setRequirements}
                placeholder="募集要件を入力"
                multiline
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setCreatePostModal(false)}
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
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  charactersContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  characterItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  characterName: {
    fontSize: 12,
    marginTop: 4,
  },
  description: {
    marginBottom: 12,
    lineHeight: 20,
  },
  requirementsContainer: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
  },
  requirementsLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  requirements: {
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
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
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
  characterSelection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  characterButton: {
    padding: 8,
    margin: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
    width: 70,
  },
  selectedCharacterButton: {
    backgroundColor: '#21A0DB',
  },
  characterButtonText: {
    fontSize: 10,
    marginTop: 4,
  },
  selectedCharacterButtonText: {
    color: '#fff',
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