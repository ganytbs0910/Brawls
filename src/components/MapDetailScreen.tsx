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

interface MapDetailScreenProps {
  mapName: string;
  modeName: string;
  modeColor: string;
  modeIcon: any;
  onClose: () => void;
  mapImage: any;
  onCharacterPress?: (characterName: string) => void; // 新しく追加したprop
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
        {mapDetail.recommendedBrawlers.map((brawler, index) => (
          <TouchableOpacity
            key={index}
            style={styles.brawlerItem}
            onPress={() => onCharacterPress?.(brawler.name)}
          >
            <View style={styles.brawlerRow}>
              <CharacterImage
                characterName={brawler.name}
                size={48}
                style={styles.brawlerImage}
              />
              <View style={styles.brawlerContent}>
                <View style={styles.brawlerHeader}> 
                  <Text style={styles.brawlerName}>{brawler.name}</Text>
                  {brawler.power && (
                    <View style={styles.powerContainer}>
                      <Text style={styles.powerText}>強さ: {brawler.power}/5</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.brawlerReason}>{brawler.reason}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <Text style={styles.sectionTitle}>戦術</Text>
        {mapDetail.tactics.map((tactic, index) => (
          <View key={index} style={styles.tacticItem}>
            <View style={styles.tacticHeader}>
              <Text style={styles.tacticTitle}>{tactic.title}</Text>
              <View style={styles.phaseTag}>
                <Text style={styles.phaseText}>{tactic.phase}</Text>
              </View>
            </View>
            <Text style={styles.tacticDescription}>{tactic.description}</Text>
          </View>
        ))}

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
  // ... (スタイルは前回と同じ)
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
  brawlerItem: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  brawlerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brawlerImage: {
    marginRight: 12,
    borderRadius: 24,
  },
  brawlerContent: {
    flex: 1,
  },
  brawlerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  brawlerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  powerContainer: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  powerText: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
  },
  brawlerReason: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  tacticItem: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  tacticHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tacticTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  phaseTag: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  phaseText: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
  },
  tacticDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
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