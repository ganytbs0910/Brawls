import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image } from 'react-native';

const Home = () => {
  const [showSettings, setShowSettings] = useState(false);

  const Settings = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showSettings}
      onRequestClose={() => setShowSettings(false)}
    >
      <View style={styles.modalView}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>設定</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowSettings(false)}
          >
            <Text style={styles.closeButtonText}>閉じる</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Brawl Stars Helper</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => setShowSettings(true)}
        >
          <Image 
            source={require('../../assets/AppIcon/settings_icon.png')} 
            style={[styles.settingsIcon, { tintColor: '#000000' }]}
          />
        </TouchableOpacity>
      </View>
      
      <Settings />

      <View style={styles.content}>
        <Text style={styles.welcomeText}>
          ブロスタヘルパーへようこそ！
        </Text>
      </View>
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
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    alignItems: 'center',
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#2196F3',
    borderRadius: 8,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Home;