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
import { useCharacterSelectorTranslation } from '../i18n/characterSelector';
import { useCharacterLocalization } from '../hooks/useCharacterLocalization';
import { CHARACTER_MAP, CHARACTER_NAMES, JAPANESE_TO_ENGLISH_MAP } from '../data/characterCompatibility';

// Character Interface
export interface Character {
  id: string;
  name: string;
  icon: any;
}

// キャラクターアイコンのマッピング
const characterIcons = {
  shelly: require('../../assets/BrawlerIcons/shelly_pin.png'),
  nita: require('../../assets/BrawlerIcons/nita_pin.png'),
  colt: require('../../assets/BrawlerIcons/colt_pin.png'),
  bull: require('../../assets/BrawlerIcons/bull_pin.png'),
  brock: require('../../assets/BrawlerIcons/brock_pin.png'),
  elPrimo: require('../../assets/BrawlerIcons/elprimo_pin.png'),
  barley: require('../../assets/BrawlerIcons/barley_pin.png'),
  poco: require('../../assets/BrawlerIcons/poco_pin.png'),
  rosa: require('../../assets/BrawlerIcons/rosa_pin.png'),
  jessie: require('../../assets/BrawlerIcons/jessie_pin.png'),
  dynamike: require('../../assets/BrawlerIcons/dynamike_pin.png'),
  tick: require('../../assets/BrawlerIcons/tick_pin.png'),
  eightBit: require('../../assets/BrawlerIcons/8bit_pin.png'),
  rico: require('../../assets/BrawlerIcons/rico_pin.png'),
  darryl: require('../../assets/BrawlerIcons/darryl_pin.png'),
  penny: require('../../assets/BrawlerIcons/penny_pin.png'),
  carl: require('../../assets/BrawlerIcons/carl_pin.png'),
  jacky: require('../../assets/BrawlerIcons/jacky_pin.png'),
  gus: require('../../assets/BrawlerIcons/gus_pin.png'),
  bo: require('../../assets/BrawlerIcons/bo_pin.png'),
  emz: require('../../assets/BrawlerIcons/emz_pin.png'),
  stu: require('../../assets/BrawlerIcons/stu_pin.png'),
  piper: require('../../assets/BrawlerIcons/piper_pin.png'),
  pam: require('../../assets/BrawlerIcons/pam_pin.png'),
  frank: require('../../assets/BrawlerIcons/frank_pin.png'),
  bibi: require('../../assets/BrawlerIcons/bibi_pin.png'),
  bea: require('../../assets/BrawlerIcons/bea_pin.png'),
  nani: require('../../assets/BrawlerIcons/nani_pin.png'),
  edgar: require('../../assets/BrawlerIcons/edgar_pin.png'),
  griff: require('../../assets/BrawlerIcons/griff_pin.png'),
  grom: require('../../assets/BrawlerIcons/grom_pin.png'),
  bonnie: require('../../assets/BrawlerIcons/bonnie_pin.png'),
  gale: require('../../assets/BrawlerIcons/gale_pin.png'),
  colette: require('../../assets/BrawlerIcons/colette_pin.png'),
  belle: require('../../assets/BrawlerIcons/belle_pin.png'),
  ash: require('../../assets/BrawlerIcons/ash_pin.png'),
  lola: require('../../assets/BrawlerIcons/lola_pin.png'),
  sam: require('../../assets/BrawlerIcons/sam_pin.png'),
  mandy: require('../../assets/BrawlerIcons/mandy_pin.png'),
  maisie: require('../../assets/BrawlerIcons/maisie_pin.png'),
  hank: require('../../assets/BrawlerIcons/hank_pin.png'),
  pearl: require('../../assets/BrawlerIcons/pearl_pin.png'),
  larryandLawrie: require('../../assets/BrawlerIcons/larryandlawrie_pin.png'),
  angelo: require('../../assets/BrawlerIcons/angelo_pin.png'),
  berry: require('../../assets/BrawlerIcons/berry_pin.png'),
  shade: require('../../assets/BrawlerIcons/shade_pin.png'),
  mortis: require('../../assets/BrawlerIcons/mortis_pin.png'),
  tara: require('../../assets/BrawlerIcons/tara_pin.png'),
  gene: require('../../assets/BrawlerIcons/gene_pin.png'),
  max: require('../../assets/BrawlerIcons/max_pin.png'),
  mrp: require('../../assets/BrawlerIcons/mrp_pin.png'),
  sprout: require('../../assets/BrawlerIcons/sprout_pin.png'),
  byron: require('../../assets/BrawlerIcons/byron_pin.png'),
  squeak: require('../../assets/BrawlerIcons/squeak_pin.png'),
  lou: require('../../assets/BrawlerIcons/lou_pin.png'),
  ruffs: require('../../assets/BrawlerIcons/ruffs_pin.png'),
  buzz: require('../../assets/BrawlerIcons/buzz_pin.png'),
  fang: require('../../assets/BrawlerIcons/fang_pin.png'),
  eve: require('../../assets/BrawlerIcons/eve_pin.png'),
  janet: require('../../assets/BrawlerIcons/janet_pin.png'),
  otis: require('../../assets/BrawlerIcons/otis_pin.png'),
  buster: require('../../assets/BrawlerIcons/buster_pin.png'),
  gray: require('../../assets/BrawlerIcons/gray_pin.png'),
  rt: require('../../assets/BrawlerIcons/rt_pin.png'),
  willow: require('../../assets/BrawlerIcons/willow_pin.png'),
  doug: require('../../assets/BrawlerIcons/doug_pin.png'),
  chuck: require('../../assets/BrawlerIcons/chuck_pin.png'),
  charlie: require('../../assets/BrawlerIcons/charlie_pin.png'),
  mico: require('../../assets/BrawlerIcons/mico_pin.png'),
  melodie: require('../../assets/BrawlerIcons/melodie_pin.png'),
  lily: require('../../assets/BrawlerIcons/lily_pin.png'),
  clancy: require('../../assets/BrawlerIcons/clancy_pin.png'),
  moe: require('../../assets/BrawlerIcons/moe_pin.png'),
  juju: require('../../assets/BrawlerIcons/juju_pin.png'),
  spike: require('../../assets/BrawlerIcons/spike_pin.png'),
  crow: require('../../assets/BrawlerIcons/crow_pin.png'),
  leon: require('../../assets/BrawlerIcons/leon_pin.png'),
  sandy: require('../../assets/BrawlerIcons/sandy_pin.png'),
  amber: require('../../assets/BrawlerIcons/amber_pin.png'),
  meg: require('../../assets/BrawlerIcons/meg_pin.png'),
  surge: require('../../assets/BrawlerIcons/surge_pin.png'),
  chester: require('../../assets/BrawlerIcons/chester_pin.png'),
  cordelius: require('../../assets/BrawlerIcons/cordelius_pin.png'),
  kit: require('../../assets/BrawlerIcons/kit_pin.png'),
  draco: require('../../assets/BrawlerIcons/draco_pin.png'),
  kenji: require('../../assets/BrawlerIcons/kenji_pin.png')
};

// キャラクターデータの配列を作成する関数
const createCharacterList = (): Character[] => {
  return Object.entries(CHARACTER_MAP).map(([_, japaneseName]) => {
    const englishKey = JAPANESE_TO_ENGLISH_MAP[japaneseName];
    if (!englishKey || !characterIcons[englishKey]) {
      console.warn(`Missing icon for character: ${japaneseName} (${englishKey})`);
      return null;
    }
    return {
      id: englishKey,
      name: japaneseName,
      icon: characterIcons[englishKey]
    };
  }).filter((char): char is Character => char !== null);
};

export const characters = createCharacterList();

interface CharacterSelectorProps {
  onSelect: (character: Character | null) => void;
  selectedCharacterId?: string;
  title: string;
  isRequired?: boolean;
  multiSelect?: boolean;
  selectedCharacters?: Character[];
  maxSelections?: number;
}

export const CharacterSelector: React.FC<CharacterSelectorProps> = ({ 
  onSelect, 
  selectedCharacterId,
  title,
  isRequired = false,
  multiSelect = false,
  selectedCharacters = [],
  maxSelections = 5
}) => {
  const { t } = useCharacterSelectorTranslation();
  const { currentLanguage } = useCharacterLocalization();
  const [modalVisible, setModalVisible] = useState(false);
  const [tempSelectedCharacters, setTempSelectedCharacters] = useState<Character[]>(selectedCharacters);

  // キャラクター名をローカライズする関数
  const getLocalizedCharacterName = (character: Character) => {
    const englishKey = JAPANESE_TO_ENGLISH_MAP[character.name];
    if (englishKey && CHARACTER_NAMES[englishKey]) {
      return CHARACTER_NAMES[englishKey][currentLanguage];
    }
    return character.name;
  };

  const handleSelect = (character: Character) => {
    if (!multiSelect) {
      if (character.id === 'none' && isRequired) {
        Alert.alert(t.errors.errorTitle, t.errors.required);
        return;
      }
      onSelect(character.id === 'none' ? null : character);
      setModalVisible(false);
      return;
    }

    setTempSelectedCharacters(prev => {
      const isAlreadySelected = prev.some(c => c.id === character.id);
      
      if (isAlreadySelected) {
        return prev.filter(c => c.id !== character.id);
      } else {
        if (prev.length >= maxSelections) {
          Alert.alert(t.errors.errorTitle, t.errors.maxSelection.replace('{count}', maxSelections.toString()));
          return prev;
        }
        return [...prev, character];
      }
    });
  };

  const handleConfirm = () => {
    if (multiSelect) {
      tempSelectedCharacters.forEach(character => {
        onSelect(character);
      });
    }
    setModalVisible(false);
  };

  const isCharacterSelected = (character: Character) => {
    if (multiSelect) {
      return tempSelectedCharacters.some(c => c.id === character.id);
    }
    return selectedCharacterId === character.id;
  };

  return (
    <View style={styles.characterSelectorContainer}>
      {title && <Text style={styles.inputLabel}>{title}</Text>}
      
      <TouchableOpacity
        style={styles.characterSelectButton}
        onPress={() => {
          setTempSelectedCharacters(selectedCharacters);
          setModalVisible(true);
        }}
      >
        <View style={styles.selectedCharactersContainer}>
          {multiSelect ? (
            selectedCharacters.length > 0 ? (
              <View style={styles.selectedCharactersGrid}>
                {selectedCharacters.map((char) => (
                  <View key={char.id} style={styles.selectedCharacterChip}>
                    <Image source={char.icon} style={styles.selectedCharacterIcon} />
                    <Text style={styles.selectedCharacterName}>
                      {getLocalizedCharacterName(char)}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.placeholderText}>
                {t.selectCharacter} {t.maxSelectionsInfo.replace('{count}', maxSelections.toString())}
              </Text>
            )
          ) : (
            selectedCharacterId ? (
              <View style={styles.selectedCharacterContainer}>
                <Image 
                  source={characters.find(c => c.id === selectedCharacterId)?.icon} 
                  style={styles.selectedCharacterIcon} 
                />
                <Text style={styles.selectedCharacterName}>
                  {getLocalizedCharacterName(characters.find(c => c.id === selectedCharacterId)!)}
                </Text>
              </View>
            ) : (
              <Text style={styles.placeholderText}>{t.selectCharacter}</Text>
            )
          )}
        </View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.characterModalOverlay}>
          <View style={styles.characterModalView}>
            <Text style={styles.modalTitle}>
              {t.modalTitle}
              {multiSelect && ` (${tempSelectedCharacters.length}/${maxSelections})`}
            </Text>
            
            <ScrollView style={styles.characterGrid}>
              <View style={styles.characterGridContainer}>
                {characters.map((character) => (
                  <TouchableOpacity
                    key={character.id}
                    style={[
                      styles.characterGridItem,
                      isCharacterSelected(character) && styles.selectedCharacterGridItem
                    ]}
                    onPress={() => handleSelect(character)}
                  >
                    <Image source={character.icon} style={styles.characterIcon} />
                    <Text style={styles.characterName}>
                      {getLocalizedCharacterName(character)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>{t.cancel}</Text>
              </TouchableOpacity>
              
              {multiSelect && (
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={handleConfirm}
                >
                  <Text style={styles.confirmButtonText}>{t.confirm}</Text>
                </TouchableOpacity>
              )}
            </View>
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
  },
  selectedCharacterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedCharactersContainer: {
    flexDirection: 'column',
  },
  selectedCharactersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedCharacterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 4,
    borderRadius: 4,
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
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 8,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  confirmButton: {
    backgroundColor: '#21A0DB',
  },
  cancelButtonText: {
    textAlign: 'center',
    color: '#666',
    fontWeight: 'bold',
  },
  confirmButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CharacterSelector;