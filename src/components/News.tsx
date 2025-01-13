import React, { useState, useEffect } from 'react';
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
  StyleSheet,
  Image,
  Linking,
} from 'react-native';
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
  Timestamp,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDCuES9P2UaLjQnYNVj0HhakM8o01TR5bQ",
  authDomain: "brawlstatus-eebf8.firebaseapp.com",
  projectId: "brawlstatus-eebf8",
  storageBucket: "brawlstatus-eebf8.firebaseapp.com",
  messagingSenderId: "799846073884",
  appId: "1:799846073884:web:33dca774ee25a04a4bc1d9",
  measurementId: "G-V7C3C0GKQK"
};

interface NewsPost {
  id: string;
  title: string;
  youtubeUrl: string;
  description: string;
  createdAt: Timestamp;
  creatorName: string;
}

// Firebase初期化
let app;
let db;

try {
  // Firebase が未初期化の場合のみ初期化
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  db = getFirestore(app);
} catch (error) {
  console.error('Firebase initialization error:', error);
}
const CREATOR_PASSWORD = 'Y';

const YouTubeCard: React.FC<{ post: NewsPost }> = ({ post }) => {
  const getYouTubeVideoId = (url: string) => {
    const regex = /(?:\?v=|\/embed\/|\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const videoId = getYouTubeVideoId(post.youtubeUrl);
  
  const handlePress = async () => {
    if (videoId) {
      const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
      try {
        await Linking.openURL(youtubeUrl);
      } catch (error) {
        Alert.alert('エラー', 'URLを開けませんでした');
      }
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{post.title}</Text>
      <Text style={styles.creatorName}>投稿者: {post.creatorName}</Text>
      {videoId && (
        <TouchableOpacity onPress={handlePress}>
          <Image
            style={styles.thumbnail}
            source={{
              uri: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
            }}
          />
          <View style={styles.playButton}>
            <Image
              source={require('../../assets/AppIcon/home.png')}
              style={styles.playIcon}
            />
          </View>
        </TouchableOpacity>
      )}
      <Text style={styles.description}>{post.description}</Text>
      <Text style={styles.timestamp}>
        {post.createdAt.toDate().toLocaleString('ja-JP')}
      </Text>
    </View>
  );
};

const News: React.FC = () => {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [description, setDescription] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    if (!db) {
      console.error('Firestore is not initialized');
      Alert.alert('エラー', 'データベース接続に失敗しました');
      setLoading(false);
      return;
    }

    try {
      const postsRef = collection(db, 'youtubePosts');
      const q = query(postsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        setPosts([]);
        console.log('No posts found');
      } else {
        const postData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as NewsPost[];
        setPosts(postData);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      Alert.alert('エラー', 'データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const verifyPassword = () => {
    if (password === CREATOR_PASSWORD) {
      setIsPasswordVerified(true);
      setPassword('');
    } else {
      Alert.alert('エラー', 'パスワードが間違っています');
    }
  };

  const validateYouTubeUrl = (url: string): boolean => {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return regex.test(url);
  };

  const createPost = async () => {
    if (!db) {
      Alert.alert('エラー', 'データベース接続に失敗しました');
      return;
    }

    if (!title.trim()) {
      Alert.alert('エラー', 'タイトルを入力してください');
      return;
    }
    if (!validateYouTubeUrl(youtubeUrl)) {
      Alert.alert('エラー', '有効なYouTubeのURLを入力してください');
      return;
    }
    if (!creatorName.trim()) {
      Alert.alert('エラー', 'クリエイター名を入力してください');
      return;
    }

    try {
      const newPost = {
        title: title.trim(),
        youtubeUrl: youtubeUrl.trim(),
        description: description.trim(),
        creatorName: creatorName.trim(),
        createdAt: Timestamp.now()
      };

      const postsRef = collection(db, 'youtubePosts');
      const docRef = await addDoc(postsRef, newPost);
      
      if (docRef.id) {
        resetForm();
        setModalVisible(false);
        Alert.alert('成功', '投稿が作成されました');
        await fetchPosts();
      } else {
        throw new Error('Document ID not received');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('エラー', '投稿の作成に失敗しました。もう一度お試しください。');
    }
  };

  const resetForm = () => {
    setTitle('');
    setYoutubeUrl('');
    setDescription('');
    setCreatorName('');
    setIsPasswordVerified(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF0000" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>YouTube News</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.createButtonText}>投稿する</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {posts.map((post) => (
          <YouTubeCard key={post.id} post={post} />
        ))}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          resetForm();
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            {!isPasswordVerified ? (
              <View>
                <Text style={styles.modalTitle}>クリエイター認証</Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="パスワードを入力"
                  secureTextEntry
                />
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={verifyPassword}
                >
                  <Text style={styles.submitButtonText}>認証</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <ScrollView>
                <Text style={styles.modalTitle}>新規投稿</Text>
                <Text style={styles.inputLabel}>タイトル</Text>
                <TextInput
                  style={styles.input}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="動画のタイトル"
                />

                <Text style={styles.inputLabel}>クリエイター名</Text>
                <TextInput
                  style={styles.input}
                  value={creatorName}
                  onChangeText={setCreatorName}
                  placeholder="あなたの名前"
                />

                <Text style={styles.inputLabel}>YouTube URL</Text>
                <TextInput
                  style={styles.input}
                  value={youtubeUrl}
                  onChangeText={setYoutubeUrl}
                  placeholder="YouTubeの動画URL"
                />

                <Text style={styles.inputLabel}>説明 (任意)</Text>
                <TextInput
                  style={[styles.input, styles.multilineInput]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="動画の説明"
                  multiline
                  numberOfLines={4}
                />

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => {
                      setModalVisible(false);
                      resetForm();
                    }}
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
            )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF0000',
  },
  content: {
    flex: 1,
  },
  createButton: {
    backgroundColor: '#FF0000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    margin: 8,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  creatorName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  thumbnail: {
    width: '100%',
    height: 200,
    marginBottom: 8,
    borderRadius: 8,
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [
      { translateX: -25 },
      { translateY: -25 }
    ],
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    width: 30,
    height: 30,
    tintColor: '#fff',
  },
  description: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
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
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
  },
  submitButton: {
    backgroundColor: '#FF0000',
  },
  cancelButtonText: {
    color: '#333',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default News;