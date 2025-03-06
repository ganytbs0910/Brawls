import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Linking,
  Platform,
} from 'react-native';
import { useSettingsScreenTranslation } from '../i18n/settingsScreen';
import { useDeveloperInfoTranslation } from '../i18n/developerInfoScreen';

interface DeveloperInfoScreenProps {
  onClose: () => void;
}

const DeveloperInfoScreen: React.FC<DeveloperInfoScreenProps> = ({ onClose }) => {
  const { t: st } = useSettingsScreenTranslation(); // ヘッダー用の翻訳
  const { t, currentLanguage } = useDeveloperInfoTranslation(); // 開発者情報の翻訳

  const openUrl = async (url: string) => {
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        console.error(`Cannot open URL: ${url}`);
      }
    } catch (error) {
      console.error(`Error opening URL ${url}:`, error);
    }
  };

  const openEmail = () => {
    const emailUrl = `mailto:${t.contact.emailAddress}`;
    openUrl(emailUrl);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{st.header.developer}</Text>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.contentContainer}>
        {/* 開発者ロゴ/アイコン */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/AppIcon/analysis.png')} 
            style={styles.logo} 
            resizeMode="contain"
          />
        </View>
        
        {/* 開発者説明 */}
        <Text style={styles.description}>{t.description}</Text>
        
        {/* 連絡先情報 */}
        <View style={styles.contactContainer}>
          {/* Twitter */}
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => openUrl(t.contact.twitterUrl)}
          >
            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>{t.contact.twitter}</Text>
              <Text style={styles.contactValue}>{t.contact.twitterUrl}</Text>
            </View>
          </TouchableOpacity>
          
          {/* YouTube */}
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => openUrl(t.contact.youtubeUrl)}
          >
            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>{t.contact.youtube}</Text>
              <Text style={styles.contactValue}>{t.contact.youtubeUrl}</Text>
            </View>
          </TouchableOpacity>
          
          {/* メール */}
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={openEmail}
          >
            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>{t.contact.email}</Text>
              <Text style={styles.contactValue}>{t.contact.emailAddress}</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        {/* バージョン情報 */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>{t.appVersion}</Text>
          <Text style={styles.versionText}>{t.lastUpdated}</Text>
        </View>
      </ScrollView>
    </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#4FA8D6',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
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
    color: '#fff',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 20,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
    color: '#444',
    textAlign: 'center',
  },
  contactContainer: {
    marginBottom: 24,
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
    padding: 16,
  },
  contactItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    width: 80,
    color: '#333',
  },
  contactValue: {
    fontSize: 16,
    color: '#21A0DB',
    flex: 1,
    textDecorationLine: 'underline',
  },
  versionContainer: {
    marginTop: 16,
    marginBottom: 32,
    padding: 16,
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
  },
});

export default DeveloperInfoScreen;