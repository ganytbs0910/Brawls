import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
  Alert
} from 'react-native';

export interface Character {
  id: string;
  name: string;
  icon: any;
}

interface CharacterSelectorProps {
  onSelect: (character: Character | null) => void;
  selectedCharacterId?: string;
  title: string;
  isRequired?: boolean;
}

// キャラクターデータの配列
export const characters: Character[] = [
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
export const CharacterSelector: React.FC<CharacterSelectorProps> = ({ 
  onSelect, 
  selectedCharacterId,
  title,
  isRequired = false
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    selectedCharacterId ? characters.find(c => c.id === selectedCharacterId) || null : characters[0]
  );

  const handleSelect = (character: Character) => {
    if (character.id === 'none' && isRequired) {
      Alert.alert('エラー', 'このキャラクター選択は必須です');
      return;
    }
    setSelectedCharacter(character);
    onSelect(character.id === 'none' ? null : character);
    setModalVisible(false);
  };

  return (
    <View style={styles.characterSelectorContainer}>
      <Text style={styles.inputLabel}>{title}</Text>
      
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
                    onPress={() => handleSelect(character)}
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

const styles = StyleSheet.create({
  characterSelectorContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
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
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
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
  modalButton: {
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    textAlign: 'center',
    color: '#666',
    fontWeight: 'bold',
  },
});

export default CharacterSelector;