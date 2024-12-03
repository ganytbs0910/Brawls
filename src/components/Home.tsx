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
        はじめに{'\n\n'}
        本プライバシーポリシーは、個人開発者Gan（以下「当開発者」）が提供するアプリケーション（以下「本アプリ」）における、ユーザーの個人情報の取扱いについて説明するものです。{'\n\n'}

        1. 収集する情報{'\n\n'}
        本アプリでは、以下の情報を収集する場合があります：
        • 広告配信のために Google Admob を通じて収集される情報
        • デバイス情報
        • 広告ID
        • 位置情報（設定している場合）
        
        ゲームの攻略情報の提供以外で、アプリ独自の個人情報の収集は行っておりません。{'\n\n'}

        2. 情報の利用目的{'\n\n'}
        収集した情報は以下の目的で利用されます：
        • 広告の配信（Google Admob）
        • アプリの改善やバグ修正
        • サービスの品質向上{'\n\n'}

        3. 広告について{'\n\n'}
        本アプリでは、Google Admobを利用して広告を配信しています。広告配信に関する情報収集やプライバシーポリシーについては、Google Admobのプライバシーポリシーをご確認ください。{'\n\n'}

        4. 免責事項{'\n\n'}
        本アプリで提供される攻略情報は、参考情報として提供されるものであり、その正確性、完全性、有用性等について保証するものではありません。ユーザーご自身の判断と責任においてご利用ください。{'\n\n'}

        5. プライバシーポリシーの変更{'\n\n'}
        当開発者は、必要に応じて、本プライバシーポリシーの内容を変更することがあります。変更があった場合、アプリ内もしくはその他の適切な手段で通知いたします。{'\n\n'}

        6. お問い合わせ{'\n\n'}
        本プライバシーポリシーに関するお問い合わせは、以下の連絡先までお願いいたします：
        
        開発者名：Gan
        お問い合わせ先：ganytbs@gmail.com
        
        最終更新日：2024/12/3
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
        はじめに{'\n\n'}
        本利用規約（以下「本規約」）は、個人開発者Gan（以下「当開発者」）が提供するアプリケーション（以下「本アプリ」）の利用条件を定めるものです。ユーザーの皆様には、本規約に同意の上、本アプリをご利用いただくようお願いいたします。{'\n\n'}

        第1条（適用）{'\n\n'}
        1. 本規約は、本アプリの利用に関する当開発者とユーザーとの間の権利義務関係を定めることを目的とし、ユーザーと当開発者との間の本アプリの利用に関わる一切の関係に適用されます。
        2. 本アプリをダウンロード、インストール、または使用することで、ユーザーは本規約に同意したものとみなされます。{'\n\n'}

        第2条（利用資格）{'\n\n'}
        本アプリは、以下の条件をすべて満たす方に限り、ご利用いただけます：
        1. 本規約に同意していただける方
        2. 過去に本規約に違反したことのない方
        3. 当開発者が利用を承認した方{'\n\n'}

        第3条（禁止事項）{'\n\n'}
        ユーザーは、本アプリの利用にあたり、以下の行為を行ってはなりません：
        1. 法令または公序良俗に違反する行為
        2. 犯罪行為に関連する行為
        3. 本アプリの運営を妨害する行為
        4. 本アプリのリバースエンジニアリング、逆コンパイル、逆アセンブル等の行為
        5. 本アプリの複製、改変、二次的著作物の作成等の行為
        6. その他、当開発者が不適切と判断する行為{'\n\n'}

        第4条（提供情報について）{'\n\n'}
        1. 本アプリで提供される攻略情報は、あくまでも参考情報として提供されるものです。
        2. ユーザーは、提供される情報の正確性や完全性を保証するものではないことを理解し、自己の責任において本アプリを利用するものとします。
        3. 提供される情報に基づいて行った行為の結果について、当開発者は一切の責任を負いません。{'\n\n'}

        第5条（広告配信）{'\n\n'}
        1. 本アプリでは、Google Admobを利用して広告を配信しています。
        2. 広告配信に関連して収集される情報については、Google Admobのプライバシーポリシーが適用されます。{'\n\n'}

        第6条（免責事項）{'\n\n'}
        1. 当開発者は、本アプリの内容の正確性、完全性、有用性等について、いかなる保証もいたしません。
        2. 当開発者は、本アプリの利用により生じた損害について、一切の責任を負いません。
        3. 当開発者は、本アプリの仕様・機能の変更、提供の終了、またはそれに伴うデータの消失について、一切の責任を負いません。{'\n\n'}

        第7条（本規約の変更）{'\n\n'}
        1. 当開発者は、必要と判断した場合には、ユーザーに通知することなく本規約を変更することができるものとします。
        2. 変更後の本規約は、本アプリ内または適切な手段で告知した時点から効力を生じるものとします。{'\n\n'}

        第8条（準拠法・管轄裁判所）{'\n\n'}
        1. 本規約の解釈にあたっては、日本法を準拠法とします。
        2. 本アプリに関して紛争が生じた場合には、開発者の所在地を管轄する裁判所を第一審の専属的合意管轄裁判所とします。{'\n\n'}

        第9条（お問い合わせ）{'\n\n'}
        本規約に関するお問い合わせは、以下の連絡先までお願いいたします：
        
        開発者名：Gan
        お問い合わせ先：ganytbs@gmail.com
        
        制定日：2024/12/3
        最終更新日：2024/12/3
      </Text>
    </ScrollView>
  </View>
);

// Rest of the components (Settings, Home) and styles remain unchanged
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