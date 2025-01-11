import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { getMapDetails } from '../data/mapDetails';
import CharacterImage from './CharacterImage';
import type { MapDetail } from '../types';

const { width } = Dimensions.get('window');
const SCREEN_PADDING = 16;  // 画面の左右パディング
const SECTION_PADDING = 12;  // セクションの内側パディング
const CARD_MARGIN = 4;  // カード間のマージン
const CARD_WIDTH = (width - (SCREEN_PADDING * 2) - (SECTION_PADDING * 2) - (CARD_MARGIN * 4)) / 3;  // 3列の場合の1カードの幅

interface MapDetailScreenProps {
  mapName: string;
  modeName: string;
  modeColor: string;
  modeIcon: any;
  onClose: () => void;
  mapImage: any;
  onCharacterPress?: (characterName: string) => void;
}

const MapDetailScreen: React.FC<MapDetailScreenProps> = ({
  mapName,
  modeName,
  modeColor,
  modeIcon,
  onClose,
  mapImage,
  onCharacterPress
}) => {
  const mapDetail = getMapDetails(mapName);

  const groupBrawlersByPower = (brawlers: MapDetail['recommendedBrawlers']) => {
    return {
      optimal: brawlers.filter(b => b.power >= 4),
      suitable: brawlers.filter(b => b.power >= 2 && b.power <= 3),
      usable: brawlers.filter(b => b.power === 1)
    };
  };

  if (!mapDetail) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.errorText}>マップ情報が見つかりませんでした</Text>
        </View>
      </View>
    );
  }

  const groupedBrawlers = groupBrawlersByPower(mapDetail.recommendedBrawlers);

  const renderBrawlerSection = (title: string, brawlers: MapDetail['recommendedBrawlers'], backgroundColor: string) => (
    <View style={[styles.brawlerSection, { backgroundColor }]}>
      <Text style={styles.brawlerSectionTitle}>{title}</Text>
      <View style={styles.brawlerGrid}>
        {brawlers.map((brawler, index) => (
          <TouchableOpacity
            key={index}
            style={styles.brawlerCard}
            onPress={() => onCharacterPress?.(brawler.name)}
            activeOpacity={0.7}
          >
            <View style={styles.brawlerCardContent}>
              <CharacterImage
                characterName={brawler.name}
                size={32}
                style={styles.brawlerImage}
              />
              <Text style={styles.brawlerName}>{brawler.name}</Text>
              <Text style={styles.powerIndicator}>{brawler.power}/5</Text>
              <Text style={styles.brawlerReason}>{brawler.reason}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={[styles.modeTag, { backgroundColor: modeColor }]}>
          <Image source={modeIcon} style={styles.modeIcon} />
          <Text style={styles.modeTagText}>{modeName}</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.mapName}>{mapDetail.name}</Text>
        
        <Image 
          source={mapImage} 
          style={styles.mapImage}
          resizeMode="contain"
        />

        <View style={styles.difficultyContainer}>
          <Text style={styles.difficultyLabel}>難易度:</Text>
          <View style={[styles.difficultyTag, styles[`difficulty${mapDetail.difficulty}`]]}>
            <Text style={styles.difficultyText}>{mapDetail.difficulty}</Text>
          </View>
        </View>

        <View style={styles.characteristicsContainer}>
          {mapDetail.characteristics.map((char, index) => (
            <View key={index} style={styles.characteristicTag}>
              <Text style={styles.characteristicText}>{char}</Text>
            </View>
          ))}
        </View>
        
        <Text style={styles.sectionTitle}>マップ説明</Text>
        <Text style={styles.description}>{mapDetail.description}</Text>

        <Text style={styles.sectionTitle}>おすすめブロウラー</Text>
        
        {groupedBrawlers.optimal.length > 0 && (
          renderBrawlerSection('最適性 (4-5点)', groupedBrawlers.optimal, '#FFF0F0')
        )}
        
        {groupedBrawlers.suitable.length > 0 && (
          renderBrawlerSection('適正 (2-3点)', groupedBrawlers.suitable, '#F0F7FF')
        )}
        
        {groupedBrawlers.usable.length > 0 && (
          renderBrawlerSection('使える (1点)', groupedBrawlers.usable, '#F5F5F5')
        )}

        <Text style={styles.sectionTitle}>Tips</Text>
        {mapDetail.tips.map((tip, index) => (
          <View key={index} style={styles.tipItem}>
            <Text style={styles.tipText}>• {tip}</Text>
          </View>
        ))}
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
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#4FA8D6',
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 24,
    color: '#fff',
  },
  modeTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  modeIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  modeTagText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  mapName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  mapImage: {
    width: '100%',
    height: 200,
    marginBottom: 16,
    borderRadius: 8,
  },
  difficultyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  difficultyLabel: {
    fontSize: 16,
    color: '#666',
    marginRight: 8,
  },
  difficultyTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyEasy: {
    backgroundColor: '#90EE90',
  },
  difficultyMedium: {
    backgroundColor: '#FFD700',
  },
  difficultyHard: {
    backgroundColor: '#FF6B6B',
  },
  difficultyText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  characteristicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  characteristicTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  characteristicText: {
    fontSize: 14,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 16,
    color: '#333',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
    marginBottom: 16,
  },
  brawlerSection: {
    marginBottom: 16,
    borderRadius: 12,
    padding: 12,
    width: '100%',
  },
  brawlerSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  brawlerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -CARD_MARGIN / 2,
  },
  brawlerCard: {
    width: CARD_WIDTH,
    marginHorizontal: CARD_MARGIN / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    padding: 6,
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  brawlerCardContent: {
    alignItems: 'center',
  },
  brawlerImage: {
    marginBottom: 4,
    borderRadius: 20,
  },
  brawlerName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 2,
  },
  powerIndicator: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  brawlerReason: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
  tipItem: {
    marginBottom: 12,
    paddingLeft: 8,
  },
  tipText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    flex: 1,
    marginRight: 48,
  }
});

export default MapDetailScreen;