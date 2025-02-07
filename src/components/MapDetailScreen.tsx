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
import { getMapData } from '../data/mapData';
import CharacterImage from './CharacterImage';
import { MapData } from '../types/types';
import { useMapDetailTranslation } from '../i18n/mapDetail';

const { width } = Dimensions.get('window');
const SCREEN_PADDING = 16;
const SECTION_PADDING = 12;
const CARD_MARGIN = 4;
const CARD_WIDTH = (width - (SCREEN_PADDING * 2) - (SECTION_PADDING * 2) - (CARD_MARGIN * 6)) / 4;

interface MapDetailScreenProps {
  mapName: string;
  modeName: string;
  modeColor: string;
  modeIcon: any;
  onClose: () => void;
  mapImage: any;
  onCharacterPress?: (characterName: string) => void;
  onMapImagePress?: () => void;
}

const MapDetailScreen: React.FC<MapDetailScreenProps> = ({
  mapName,
  modeName,
  modeColor,
  modeIcon,
  onClose,
  mapImage,
  onCharacterPress,
  onMapImagePress
}) => {
  const { t, currentLanguage } = useMapDetailTranslation();
  const mapData = getMapData(mapName);

  const groupBrawlersByPower = (brawlers: MapData['recommendedBrawlers']) => {
    return {
      optimal: brawlers.filter(b => b.power >= 4),
      suitable: brawlers.filter(b => b.power >= 2 && b.power <= 3),
      usable: brawlers.filter(b => b.power === 1)
    };
  };

  if (!mapData) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.errorText}>{t.error.mapNotFound}</Text>
        </View>
      </View>
    );
  }

  const groupedBrawlers = groupBrawlersByPower(mapData.recommendedBrawlers);

  const renderBrawlerSection = (title: string, brawlers: MapData['recommendedBrawlers'], backgroundColor: string) => (
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
              <Text style={styles.brawlerName}>
                {brawler.name}
              </Text>
              <Text style={styles.powerIndicator}>
                {t.brawler.powerRating.replace('{power}', brawler.power.toString())}
              </Text>
              {brawler.reason && (
                <Text style={styles.brawlerReason}>
                  {brawler.reason}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const getLocalizedMapName = () => {
    switch (currentLanguage) {
      case 'en':
        return mapData.nameEn;
      case 'ko':
        return mapData.nameKo;
      default:
        return mapData.name;
    }
  };

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
        <Text style={styles.mapName}>{getLocalizedMapName()}</Text>
        
        <TouchableOpacity 
          onPress={onMapImagePress}
          activeOpacity={0.8}
          style={styles.mapImageContainer}
        >
          <Image 
            source={mapImage} 
            style={styles.mapImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
        
        <Text style={styles.sectionTitle}>{t.sections.mapDescription}</Text>
        <Text style={styles.description}>{mapData.description}</Text>

        <Text style={styles.sectionTitle}>{t.sections.recommendedBrawlers}</Text>
        
        {groupedBrawlers.optimal.length > 0 && (
          renderBrawlerSection(t.powerLevels.optimal, groupedBrawlers.optimal, '#FFF0F0')
        )}
        
        {groupedBrawlers.suitable.length > 0 && (
          renderBrawlerSection(t.powerLevels.suitable, groupedBrawlers.suitable, '#F0F7FF')
        )}
        
        {groupedBrawlers.usable.length > 0 && (
          renderBrawlerSection(t.powerLevels.usable, groupedBrawlers.usable, '#F5F5F5')
        )}
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
    fontSize: 20,
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
    fontSize: 12,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  mapName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  mapImageContainer: {
    width: '100%',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  mapImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 16,
    color: '#333',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
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
    fontSize: 14,
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
    padding: 4,
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
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 2,
  },
  powerIndicator: {
    fontSize: 10,
    color: '#666',
    marginBottom: 4,
  },
  brawlerReason: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    lineHeight: 14,
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