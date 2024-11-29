import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated, ScrollView, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

type ScreenType = 'home' | 'settings' | 'privacy' | 'terms';

interface ScreenState {
  type: ScreenType;
  translateX: Animated.Value;
  zIndex: number;
}

const PrivacyPolicy = ({ onClose }: { onClose: () => void }) => (
  <View style={styles.settingsContainer}>
    <View style={styles.settingsHeader}>
      <Text style={styles.settingsTitle}>プライバシーポリシー</Text>
      <TouchableOpacity onPress={onClose} style={styles.backButton}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>
    </View>
    <ScrollView style={styles.contentContainer}>
      <Text style={styles.contentText}>
        1. 個人情報の収集と利用{'\n\n'}
        当アプリケーションでは、より良いサービスを提供するために以下の情報を収集する場合があります：
        • デバイス情報
        • ゲームプレイデータ
        • アプリケーションの利用状況{'\n\n'}

        2. 情報の利用目的{'\n\n'}
        収集した情報は以下の目的で利用されます：
        • サービスの提供と改善
        • ユーザーサポート
        • アプリケーションの性能向上{'\n\n'}

        3. 情報の保護{'\n\n'}
        当アプリケーションでは、収集した情報の保護に最大限の注意を払い、適切な技術的・組織的措置を講じています。{'\n\n'}

        4. 第三者への提供{'\n\n'}
        法令に基づく場合を除き、収集した個人情報を第三者に提供することはありません。{'\n\n'}

        5. お問い合わせ{'\n\n'}
        本プライバシーポリシーに関するお問い合わせは、アプリケーション内の問い合わせフォームよりご連絡ください。
      </Text>
    </ScrollView>
  </View>
);

const Terms = ({ onClose }: { onClose: () => void }) => (
  <View style={styles.settingsContainer}>
    <View style={styles.settingsHeader}>
      <Text style={styles.settingsTitle}>利用規約</Text>
      <TouchableOpacity onPress={onClose} style={styles.backButton}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>
    </View>
    <ScrollView style={styles.contentContainer}>
      <Text style={styles.contentText}>
        1. はじめに{'\n\n'}
        本規約は、当アプリケーション「Brawl Stars Helper」（以下「本アプリ」）の利用条件を定めるものです。{'\n\n'}

        2. 利用条件{'\n\n'}
        本アプリを利用することで、本規約に同意したものとみなされます。
        • 本アプリは個人利用に限ります
        • 商用利用は禁止されています
        • 不正な利用は禁止されています{'\n\n'}

        3. 免責事項{'\n\n'}
        • 本アプリの情報は参考情報として提供されています
        • 実際のゲームプレイとは異なる場合があります
        • 本アプリの利用により生じた損害について、開発者は一切の責任を負いません{'\n\n'}

        4. 知的財産権{'\n\n'}
        本アプリに関する知的財産権は、開発者または正当な権利を有する第三者に帰属します。{'\n\n'}

        5. 規約の変更{'\n\n'}
        本規約は予告なく変更される場合があります。重要な変更については、アプリ内で通知いたします。{'\n\n'}

        6. お問い合わせ{'\n\n'}
        本規約に関するお問い合わせは、アプリケーション内の問い合わせフォームよりご連絡ください。
      </Text>
    </ScrollView>
  </View>
);

const Settings = ({ onClose, onNavigate }: { onClose: () => void; onNavigate: (screen: ScreenType) => void }) => (
  <View style={styles.settingsContainer}>
    <View style={styles.settingsHeader}>
      <Text style={styles.settingsTitle}>設定</Text>
      <TouchableOpacity onPress={onClose} style={styles.backButton}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.settingsContent}>
      <TouchableOpacity 
        style={styles.settingsItem}
        onPress={() => onNavigate('privacy')}
      >
        <Text style={styles.settingsItemText}>プライバシーポリシー</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.settingsItem}
        onPress={() => onNavigate('terms')}
      >
        <Text style={styles.settingsItemText}>利用規約</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const Home: React.FC = () => {
  const [screenStack, setScreenStack] = useState<ScreenState[]>([
    { type: 'home', translateX: new Animated.Value(0), zIndex: 0 }
  ]);

  const showScreen = (screenType: ScreenType) => {
    const newScreen: ScreenState = {
      type: screenType,
      translateX: new Animated.Value(SCREEN_WIDTH),
      zIndex: screenStack.length
    };

    setScreenStack(prev => [...prev, newScreen]);

    Animated.timing(newScreen.translateX, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const goBack = () => {
    if (screenStack.length <= 1) return;

    const currentScreen = screenStack[screenStack.length - 1];

    Animated.timing(currentScreen.translateX, {
      toValue: SCREEN_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setScreenStack(prev => prev.slice(0, -1));
    });
  };

  const renderScreenContent = (screen: ScreenState) => {
    switch (screen.type) {
      case 'settings':
        return <Settings onClose={goBack} onNavigate={showScreen} />;
      case 'privacy':
        return <PrivacyPolicy onClose={goBack} />;
      case 'terms':
        return <Terms onClose={goBack} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Brawl Stars Helper</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => showScreen('settings')}
        >
          <Image 
            source={require('../../assets/AppIcon/settings_icon.png')} 
            style={[styles.settingsIcon, { tintColor: '#000000' }]}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.welcomeText}>
          ブロスタヘルパーへようこそ！
        </Text>
      </View>

      {screenStack.map((screen, index) => (
        index > 0 && (
          <Animated.View 
            key={`${screen.type}-${screen.zIndex}`}
            style={[
              styles.settingsOverlay,
              {
                transform: [{ translateX: screen.translateX }],
                zIndex: screen.zIndex
              },
            ]}
          >
            {renderScreenContent(screen)}
          </Animated.View>
        )
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    fontSize: 20,
    fontWeight: 'bold',
  },
  settingsButton: {
    padding: 8,
  },
  settingsIcon: {
    width: 24,
    height: 24,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  welcomeText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  settingsOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
  },
  settingsContainer: {
    flex: 1,
  },
  settingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  settingsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: '#2196F3',
  },
  settingsContent: {
    flex: 1,
  },
  settingsItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  settingsItemText: {
    fontSize: 16,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default Home;