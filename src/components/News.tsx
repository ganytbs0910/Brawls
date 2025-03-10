import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Image,
  Linking,
} from 'react-native';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { newsTranslations, Language } from '../i18n/news';
import 'react-native-url-polyfill/auto';

const supabase = createClient(
  'https://llxmsbnqtdlqypnwapzz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxseG1zYm5xdGRscXlwbndhcHp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4MjA5MjEsImV4cCI6MjA1MzM5NjkyMX0.EkqepILQU0KgOTW1ZaXpe54ERpZbSRodf24r5022VKs'
);

const POST_LIMIT = 10;
const CREATOR_PASSWORD = 'Y';

interface NewsPost {
  id: string;
  title: string;
  youtube_url: string;
  description: string;
  created_at: string;
  creator_name: string;
}

interface NewsProps {
  isAdFree?: boolean;
}

const getTableName = async (language: Language): Promise<string> => {
  // サポートされている言語のテーブル名を生成
  const tableName = `youtube_posts_${language}`;
  
  try {
    // テーブルが存在するか確認
    const { error } = await supabase
      .from(tableName)
      .select('id')
      .limit(1);
    
    // エラーがない場合はそのテーブルを使用
    if (!error) {
      return tableName;
    }
  } catch (error) {
    console.error(`Error checking table ${tableName}:`, error);
  }
  
  // テーブルが存在しない場合は英語テーブルを返す
  return 'youtube_posts_en';
};

const YouTubeCard: React.FC<{ post: NewsPost; t: typeof newsTranslations['en'] }> = ({ post, t }) => {
  const getYouTubeVideoId = (url: string) => {
    const regex = /(?:\?v=|\/embed\/|\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const videoId = getYouTubeVideoId(post.youtube_url);
  
  const handlePress = async () => {
    if (videoId) {
      const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
      try {
        await Linking.openURL(youtubeUrl);
      } catch (error) {
        Alert.alert(t.error, t.fetchError);
      }
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{post.title}</Text>
      <Text style={styles.creatorName}>{t.creator}: {post.creator_name}</Text>
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
              source={require('../../assets/AppIcon/playback_icon.png')}
              style={styles.playIcon}
            />
          </View>
        </TouchableOpacity>
      )}
      <Text style={styles.description}>{post.description}</Text>
      <Text style={styles.timestamp}>
        {new Date(post.created_at).toLocaleString()}
      </Text>
    </View>
  );
};

const News: React.FC<NewsProps> = ({ isAdFree = false }) => {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [description, setDescription] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [t, setT] = useState(newsTranslations.en);
  const [actualLanguage, setActualLanguage] = useState<Language>('en');
  const [initialLoad, setInitialLoad] = useState(true); // 初回ロードフラグを追加

  // コンポーネントのマウント時に一度だけ実行
  useEffect(() => {
    const initLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('selectedLanguage') as Language;
        if (savedLanguage) {
          setCurrentLanguage(savedLanguage);
          // 翻訳とテーブル言語を設定
          setT(newsTranslations[savedLanguage] || newsTranslations.en);
          const supportedLanguages = ['ja', 'en', 'ko', 'ar', 'fr', 'es'];
          setActualLanguage(supportedLanguages.includes(savedLanguage) ? savedLanguage : 'en');
        }
      } catch (error) {
        console.error('Failed to get language setting:', error);
      } finally {
        // 言語設定が完了したらデータ取得を開始
        setInitialLoad(false);
      }
    };

    initLanguage();
  }, []);

  // 言語設定完了後、または actualLanguage が変更されたときにデータを取得
  useEffect(() => {
    if (!initialLoad) {
      const setupSubscription = async () => {
        setLoading(true); // 明示的にローディング状態を設定
        
        try {
          await fetchPosts(); // await を追加して確実に完了させる
          
          const tableName = await getTableName(actualLanguage);
          const channel = supabase
            .channel(`${tableName}_changes`)
            .on('postgres_changes', 
              { event: '*', schema: 'public', table: tableName },
              payload => {
                if (payload.eventType === 'INSERT') {
                  setPosts(prev => [payload.new as NewsPost, ...prev].slice(0, POST_LIMIT));
                }
              }
            )
            .subscribe();
            
          return () => {
            channel.unsubscribe();
          };
        } catch (error) {
          console.error('Error in setup:', error);
          Alert.alert(t.error, t.fetchError);
        }
      };

      setupSubscription();
    }
  }, [actualLanguage, initialLoad]);

  const fetchPosts = async () => {
    try {
      const tableName = await getTableName(actualLanguage);
      console.log(`Fetching posts from table: ${tableName}`);
      
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(POST_LIMIT);

      if (error) throw error;
      
      console.log(`Fetched ${data?.length || 0} posts`);
      setPosts(data as NewsPost[] || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      Alert.alert(t.error, t.fetchError);
    } finally {
      setLoading(false);
    }
  };

  const verifyPassword = () => {
    if (password === CREATOR_PASSWORD) {
      setIsPasswordVerified(true);
      setPassword('');
    } else {
      Alert.alert(t.error, t.passwordError);
    }
  };

  const validateYouTubeUrl = (url: string): boolean => {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return regex.test(url);
  };

  const createPost = async () => {
    if (!title.trim()) {
      Alert.alert(t.error, t.requiredField);
      return;
    }
    if (!validateYouTubeUrl(youtubeUrl)) {
      Alert.alert(t.error, t.invalidYouTubeUrl);
      return;
    }
    if (!creatorName.trim()) {
      Alert.alert(t.error, t.requiredField);
      return;
    }

    try {
      const tableName = await getTableName(actualLanguage);
      const { error } = await supabase
        .from(tableName)
        .insert([{
          title: title.trim(),
          youtube_url: youtubeUrl.trim(),
          description: description.trim(),
          creator_name: creatorName.trim()
        }]);

      if (error) throw error;
      
      resetForm();
      setModalVisible(false);
      Alert.alert(t.success, t.postCreated);
      
      // 投稿成功後に最新のデータを再取得
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert(t.error, t.createError);
    }
  };

  const resetForm = () => {
    setTitle('');
    setYoutubeUrl('');
    setDescription('');
    setCreatorName('');
    setIsPasswordVerified(false);
  };

  // ローディング状態の表示を改善
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF0000" />
        <Text style={styles.loadingText}>{t.loading}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.newsHeader}>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.createButtonText}>{t.post}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {posts.length > 0 ? (
          posts.map((post) => (
            <YouTubeCard key={post.id} post={post} t={t} />
          ))
        ) : (
          <View style={styles.noContentContainer}>
            <Text style={styles.noContentText}>
              {t.noPosts}
            </Text>
          </View>
        )}
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
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setModalVisible(false);
                resetForm();
              }}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
            {!isPasswordVerified ? (
              <View style={styles.authContainer}>
                <Text style={styles.modalTitle}>{t.creatorAuth}</Text>
                <View style={styles.authInputContainer}>
                  <Image
                    source={require('../../assets/AppIcon/magnifyingglass_icon.png')}
                    style={styles.authIcon}
                  />
                  <TextInput
                    style={styles.authInput}
                    value={password}
                    onChangeText={setPassword}
                    placeholder={t.enterPassword}
                    secureTextEntry
                    placeholderTextColor="#999"
                  />
                </View>
                <TouchableOpacity
                  style={styles.authButton}
                  onPress={verifyPassword}
                >
                  <Text style={styles.authButtonText}>{t.authenticate}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <ScrollView>
                <Text style={styles.modalTitle}>{t.newPost}</Text>
                <Text style={styles.inputLabel}>{t.videoTitle}</Text>
                <TextInput
                  style={styles.input}
                  value={title}
                  onChangeText={setTitle}
                  placeholder={t.videoTitle}
                />

                <Text style={styles.inputLabel}>{t.creatorName}</Text>
                <TextInput
                  style={styles.input}
                  value={creatorName}
                  onChangeText={setCreatorName}
                  placeholder={t.creatorName}
                />

                <Text style={styles.inputLabel}>{t.youtubeUrl}</Text>
                <TextInput
                  style={styles.input}
                  value={youtubeUrl}
                  onChangeText={setYoutubeUrl}
                  placeholder={t.youtubeUrl}
                />

                <Text style={styles.inputLabel}>{t.description}</Text>
                <TextInput
                  style={[styles.input, styles.multilineInput]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder={t.description}
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
                    <Text style={styles.cancelButtonText}>{t.cancel}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.submitButton]}
                    onPress={createPost}
                  >
                    <Text style={styles.submitButtonText}>{t.submit}</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
  },
  noContentContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  noContentText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
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
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
    fontWeight: 'bold',
  },
  authContainer: {
    padding: 20,
  },
  authInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
    backgroundColor: '#f8f8f8',
  },
  authIcon: {
    width: 20,
    height: 20,
    tintColor: '#666',
    marginRight: 12,
  },
  authInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#333',
  },
  authButton: {
    backgroundColor: '#FF0000',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  authButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default News;