import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Modal,
  Animated,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { TeamSection } from './TeamSection';
import { CharacterSelection } from './CharacterSelection';
import MapDetailScreen from './MapDetailScreen';
// GAME_MODESをmodeData.tsからインポート
import { GAME_MODES } from '../data/modeData';
import { usePickPrediction } from '../hooks/usePickPrediction';
import { ScreenState } from './types';

// ScreenTypeの型定義
type ScreenType = 'home' | 'mapDetail' | 'characterDetail';

// 表示するゲームモードを限定する
const DISPLAY_MODES = [
  'gemGrab',    // エメラルドハント
  'brawlBall',  // ブロストライカー
  'knockout',   // ノックアウト
  'hotZone',     // ホットゾーン
  'brawlHockey', // ブロホッケー
];

// モード名から対応するGAME_MODESのキーを取得するヘルパー関数
const getGameModeKey = (modeName) => {
  return Object.keys(GAME_MODES).find(key => 
    GAME_MODES[key].name === modeName
  );
};

// 表示するゲームモードのオブジェクトリスト
const displayModes = DISPLAY_MODES.map(modeName => {
  const modeKey = getGameModeKey(modeName);
  return modeKey ? GAME_MODES[modeKey] : null;
}).filter(Boolean); // nullは除外

const PickPrediction: React.FC = () => {
  const {
    gameState,
    history,
    showTurnModal,
    showModeModal,
    turnMessage,
    turnSubMessage,
    mapsByMode,
    getLocalizedName,
    setShowTurnModal,
    setShowModeModal,
    handleUndo,
    handleBanSelect,
    handleCharacterSelect,
    handleModeSelect,
    handleMapSelect,
    calculateTeamAdvantage,
    resetGame,
    getMapsByMode,
    handleMapInfoPress,
    setGameStateWithHistory,
    t
  } = usePickPrediction();

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const [isTeamsSwapped, setIsTeamsSwapped] = useState(false);
  const [screenStack, setScreenStack] = useState<ScreenState[]>([
    { type: 'home', translateX: new Animated.Value(0), zIndex: 0 }
  ]);

  useEffect(() => {
    if (showTurnModal) {
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),
        Animated.delay(1500),
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start(() => {
        setShowTurnModal(false);
        scaleAnim.setValue(0);
      });
    }
  }, [showTurnModal]);

  const handleTeamSwap = () => {
    setIsTeamsSwapped(prev => !prev);
    setShowTurnModal(true);
  };

  // Helper function to get the visually correct team data
  const getVisualTeamData = (team: 'A' | 'B') => {
    if (isTeamsSwapped) {
      return {
        team: team === 'A' ? 'B' : 'A',
        teamData: team === 'A' ? gameState.teamB : gameState.teamA,
        bans: team === 'A' ? gameState.bansB : gameState.bansA,
        isCurrentTurn: gameState.currentTeam === (team === 'A' ? 'B' : 'A')
      };
    }
    return {
      team,
      teamData: team === 'A' ? gameState.teamA : gameState.teamB,
      bans: team === 'A' ? gameState.bansA : gameState.bansB,
      isCurrentTurn: gameState.currentTeam === team
    };
  };

  // Wrapper for character selection handler
  const handleVisualCharacterSelect = (character: string, team: 'A' | 'B') => {
    const actualTeam = isTeamsSwapped ? (team === 'A' ? 'B' : 'A') : team;
    handleCharacterSelect(character, actualTeam);
  };

  // Wrapper for ban selection handler
  const handleVisualBanSelect = (character: string, team: 'A' | 'B') => {
    const actualTeam = isTeamsSwapped ? (team === 'A' ? 'B' : 'A') : team;
    handleBanSelect(character, actualTeam);
  };

  const showScreen = (screenType: ScreenType) => {
    const newScreen: ScreenState = {
      type: screenType,
      translateX: new Animated.Value(Dimensions.get('window').width),
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
      toValue: Dimensions.get('window').width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setScreenStack(prev => prev.slice(0, -1));
    });
  };

  const handleModalClose = () => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowTurnModal(false);
      scaleAnim.setValue(0);
    });
  };

  // モードと言語の関係を処理する関数
  const getGameModeByName = (modeName: string) => {
    return Object.values(GAME_MODES).find(mode => {
      // 現在の言語でのモード名と一致するか確認
      const currentLanguage = t.currentLanguage || 'en';
      return mode.translations[currentLanguage] === modeName;
    });
  };

  const renderModeAndMapModal = () => {
    return (
      <Modal
        transparent={true}
        visible={showModeModal}
        animationType="fade"
        onRequestClose={() => setShowModeModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowModeModal(false)}
        >
          <View style={styles.modeModalContent}>
            <View style={styles.modeGrid}>
              {/* 限定された表示モードのみを使用 */}
              {displayModes.map((mode) => (
                <TouchableOpacity
                  key={mode.name}
                  style={[
                    styles.modeModalButton,
                    gameState.selectedMode === mode.translations[t.currentLanguage] && {
                      backgroundColor: mode.color
                    }
                  ]}
                  onPress={() => handleModeSelect(mode.name)}
                >
                  <Image source={mode.icon} style={styles.modeIcon} />
                </TouchableOpacity>
              ))}
            </View>
            {gameState.selectedMode && (
              <>
                <Text style={styles.mapModalTitle}>{t.mapSelection.title}</Text>
                <View style={styles.mapGrid}>
                  {getMapsByMode(gameState.selectedMode).map((map) => (
                    <TouchableOpacity
                      key={map.name}
                      style={[
                        styles.mapModalButton,
                        gameState.selectedMap === map.name && styles.selectedMapButton
                      ]}
                      onPress={() => handleMapSelect(map.name)}
                    >
                      <View style={styles.mapModalImageContainer}>
                        <Image source={map.image} style={styles.mapModalImage} />
                        <TouchableOpacity 
                          style={styles.mapModalInfoButton}
                          onPress={(e) => {
                            e.stopPropagation();
                            // 選択されたモードを特定
                            const selectedMode = getGameModeByName(gameState.selectedMode);
                            if (selectedMode) {
                              setShowModeModal(false);
                              handleMapInfoPress(selectedMode, map.name);
                              showScreen('mapDetail');
                            }
                          }}
                        >
                          <Image 
                            source={require('../../assets/OtherIcon/button_info.png')}
                            style={styles.mapModalInfoIcon}
                          />
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.mapModalText}>{map.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.fixedHeader}>
        {renderModeAndMapModal()}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity 
              style={[
                styles.headerButton,
                {
                  opacity: (gameState.teamA.length > 0 || gameState.teamB.length > 0 || 
                           gameState.bansA.length > 0 || gameState.bansB.length > 0) ? 1 : 0.5
                }
              ]}
              onPress={handleTeamSwap}
              disabled={!(gameState.teamA.length > 0 || gameState.teamB.length > 0 || 
                        gameState.bansA.length > 0 || gameState.bansB.length > 0)}
            >
              <Image 
                source={require('../../assets/OtherIcon/reload_Icon.png')}
                style={[styles.headerButtonImage, { transform: [{ rotate: '90deg' }] }]}
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.headerButton, { opacity: history.length > 0 ? 1 : 0.5 }]}
              onPress={handleUndo}
              disabled={history.length === 0}
            >
              <Image 
                source={require('../../assets/OtherIcon/undo.png')}
                style={styles.headerButtonImage}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.headerCenter}>
            <TouchableOpacity 
              style={styles.modeSelectButton}
              onPress={() => setShowModeModal(true)}
            >
              <Text style={styles.modeSelectText}>
                {gameState.selectedMode ? gameState.selectedMode : t.header.selectMode}
              </Text>
              {gameState.selectedMap && (
                <Text style={styles.selectedMapText}>
                  {gameState.selectedMap}
                </Text>
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity 
              style={styles.resetButton}
              onPress={resetGame}
            >
              <Text style={styles.resetButtonText}>{t.header.reset}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.teamsContainer}>
          <TeamSection
            gameState={gameState}
            {...getVisualTeamData('A')}
            onBanSelect={handleVisualBanSelect}
            onCharacterSelect={handleVisualCharacterSelect}
            getLocalizedName={getLocalizedName}
          />
          <View style={styles.centerContent}>
            {gameState.selectedMap ? (
              <View style={styles.selectedMapContainer}>
                <Image 
                  source={getMapsByMode(gameState.selectedMode)?.find(m => m.name === gameState.selectedMap)?.image}
                  style={styles.selectedMapImage}
                />
                <TouchableOpacity 
                  style={styles.infoButton}
                  onPress={() => {
                    const selectedMode = getGameModeByName(gameState.selectedMode);
                    if (selectedMode && gameState.selectedMap) {
                      handleMapInfoPress(selectedMode, gameState.selectedMap);
                      showScreen('mapDetail');
                    }
                  }}
                >
                  <Image 
                    source={require('../../assets/OtherIcon/button_info.png')}
                    style={styles.infoIcon}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <Image 
                source={require('../../assets/AppIcon/VSIcon.png')}
                style={styles.vsIcon}
              />
            )}
          </View>
          <TeamSection
            gameState={gameState}
            {...getVisualTeamData('B')}
            onBanSelect={handleVisualBanSelect}
            onCharacterSelect={handleVisualCharacterSelect}
            getLocalizedName={getLocalizedName}
          />
        </View>
      </View>

      <CharacterSelection
        gameState={gameState}
        onBanSelect={handleVisualBanSelect}
        onCharacterSelect={handleVisualCharacterSelect}
        calculateTeamAdvantage={calculateTeamAdvantage}
        getLocalizedName={getLocalizedName}
        isTeamsSwapped={isTeamsSwapped}
      />

      <Modal
        transparent={true}
        visible={showTurnModal}
        animationType="none"
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleModalClose}
        >
          <Animated.View
            style={[
              styles.turnAnnouncement,
              {
                transform: [
                  { scale: scaleAnim },
                  { perspective: 1000 }
                ]
              }
            ]}
          >
            <View style={[
              styles.turnCard,
              { backgroundColor: gameState.currentTeam === 'A' ? '#FF3B30' : '#007AFF' }
            ]}>
              <Text style={styles.turnMessageMain}>{turnMessage}</Text>
              <Text style={styles.turnMessageSub}>{turnSubMessage}</Text>
              <Text style={styles.skipText}>{t.turnAnnouncement.skipTap}</Text>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>

      {screenStack.map((screen, index) => (
        index > 0 && screen.type === 'mapDetail' && gameState.mapDetailProps && (
          <Animated.View
            key={`${screen.type}-${screen.zIndex}`}
            style={[
              styles.screenContainer,
              {
                transform: [{ translateX: screen.translateX }],
                zIndex: screen.zIndex,
              },
            ]}
          >
            <MapDetailScreen
              {...gameState.mapDetailProps}
              onClose={goBack}
            />
          </Animated.View>
        )
      ))}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  fixedHeader: {
    backgroundColor: '#fff',
    zIndex: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    height: 65,
    backgroundColor: '#21A0DB',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    position: 'relative',
  },
  headerLeft: {
    position: 'absolute',
    left: 10,
    top: '50%',
    transform: [{ translateY: -15 }],
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerRight: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -15 }],
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginRight: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: '#fff'
  },
  resetButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#fff',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modeSelectButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
  },
  modeSelectText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedMapText: {
    color: '#fff',
    fontSize: 12,
  },
  teamsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 0,
    marginHorizontal: 0,
    backgroundColor: '#fff',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 90,
    flexShrink: 0,
  },
  selectedMapContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  selectedMapImage: {
    width: 90,
    height: 120,
    borderRadius: 4,
    marginBottom: 4,
    resizeMode: 'cover',
  },
  infoButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    zIndex: 1,
  },
  infoIcon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  vsIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
  },
  modeModalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  modeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modeModalButton: {
    width: '15%',
    aspectRatio: 1,
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  modeIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  mapModalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    marginTop: 10,
    textAlign: 'center',
  },
  mapGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  mapModalButton: {
    width: '48%',
    marginBottom: 15,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  selectedMapButton: {
    backgroundColor: '#e0e0e0',
    borderWidth: 2,
    borderColor: '#21A0DB',
  },
  mapModalImageContainer: {
    position: 'relative',
    width: '100%',
  },
  mapModalImage: {
    width: '100%',
    height: 150,
    borderRadius: 4,
    marginBottom: 4,
    resizeMode: 'cover',
  },
  mapModalInfoButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    zIndex: 1,
  },
  mapModalInfoIcon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  mapModalText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
  },
  turnAnnouncement: {
    width: 300,
    padding: 20,
    borderRadius: 15,
    backgroundColor: 'white',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  turnCard: {
    width: '100%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  turnMessageMain: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  turnMessageSub: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  skipText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
  }
});

export default PickPrediction;