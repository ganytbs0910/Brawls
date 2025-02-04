import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Modal,
  Animated,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { TeamSection } from './TeamSection';
import { CharacterSelection } from './CharacterSelection';
import MapDetailScreen from './MapDetailScreen';
import { usePickPredictionTranslation } from '../i18n/pickPrediction';
import {
  CHARACTER_MAP,
  allCharacterData,
  getCharacterId
} from '../data/characterCompatibility';
import { heistMaps } from '../data/modes/heist';
import { brawlBallMaps } from '../data/modes/brawlBall';
import { duelMaps } from '../data/modes/duel';
import { emeraldHuntMaps } from '../data/modes/emeraldHunt';
import { knockoutMaps } from '../data/modes/knockout';

interface GameMode {
  name: keyof typeof pickPredictionTranslations.ja.modes;
  color: string;
  icon: any;
}

interface GameMap {
  name: string;
  image: any;
}

interface MapsByMode {
  [key: string]: GameMap[];
}

export type Team = 'A' | 'B';
export type GamePhase = 1 | 2 | 3 | 4;
export type ScreenType = 'home' | 'settings' | 'mapDetail';

export interface ScreenState {
  type: ScreenType;
  translateX: Animated.Value;
  zIndex: number;
}

export interface SelectionState {
  teamA: string[];
  teamB: string[];
  bansA: string[];
  bansB: string[];
  currentPhase: GamePhase;
  currentTeam: Team;
  recommendations: CharacterRecommendation[];
  isBanPhaseEnabled: boolean;
  selectedMode?: string;
  selectedMap?: string;
  mapDetailProps?: {
    mapName: string;
    modeName: string;
    modeColor: string;
    modeIcon: any;
    mapImage: any;
  } | null;
}

interface HistoryEntry {
  state: SelectionState;
  timestamp: number;
}

export interface CharacterRecommendation {
  character: string;
  score: number;
  maxScore: number;
  reason: string;
}

const GAME_MODES: GameMode[] = [
  { name: "emeraldHunt", color: "#DA70D6", icon: require('../../assets/GameModeIcons/gem_grab_icon.png') },
  { name: "brawlBall", color: "#cccccc", icon: require('../../assets/GameModeIcons/brawl_ball_icon.png') },
  { name: "heist", color: "#cccccc", icon: require('../../assets/GameModeIcons/heist_icon.png') },
  { name: "knockout", color: "#FFA500", icon: require('../../assets/GameModeIcons/knock_out_icon.png') },
  { name: "bounty", color: "#DA70D6", icon: require('../../assets/GameModeIcons/bounty_icon.png') },
  { name: "hotZone", color: "#cccccc", icon: require('../../assets/GameModeIcons/hot_zone_icon.png') },
];

const MAPS_BY_MODE: MapsByMode = {
  "エメラルドハント": [
    { name: "ごつごつ坑道", image: require('../../assets/MapImages/Hard_Rock_Mine.png') },
    { name: "アンダーマイン", image: require('../../assets/MapImages/Undermine.png') },
    { name: "ダブルレール", image: require('../../assets/MapImages/Double_Swoosh.png') },
    { name: "ラストストップ", image: require('../../assets/MapImages/Last_Stop.png') },
  ],
  "ブロストライカー": [
    { name: "トリプル・ドリブル", image: require('../../assets/MapImages/Triple_Dribble.png') },
    { name: "静かな広場", image: require('../../assets/MapImages/Sneaky_Fields.png') },
    { name: "中央コート", image: require('../../assets/MapImages/Center_Stage.png') },
    { name: "ピンボールドリーム", image: require('../../assets/MapImages/Pinball_Dreams.png') },
  ],
  "強奪": [
    { name: "安全地帯", image: require('../../assets/MapImages/Safe_Zone.png') },
    { name: "ホットポテト", image: require('../../assets/MapImages/Hot_Potato.png') },
    { name: "どんぱち谷", image: require('../../assets/MapImages/Kaboom_Canyon.png') },
    { name: "橋の彼方", image: require('../../assets/MapImages/Bridge_Too_Far.png') },
  ],
  "ノックアウト": [
    { name: "ベルの岩", image: require('../../assets/MapImages/Belles_Rock.png') },
    { name: "燃える不死鳥", image: require('../../assets/MapImages/Flaring_Phoenix.png') },
    { name: "オープンフィールド", image: require('../../assets/MapImages/Out_In_The_Open.png') },
    { name: "ゴールドアームの渓谷", image: require('../../assets/MapImages/Goldarm_Gulch.png') },
  ],
  "賞金稼ぎ": [
    { name: "流れ星", image: require('../../assets/MapImages/Shooting_Star.png') },
    { name: "隠れ家", image: require('../../assets/MapImages/Hideout.png') },
    { name: "ジグザグ草原", image: require('../../assets/MapImages/Snake_Prairie.png') },
    { name: "グランドカナル", image: require('../../assets/MapImages/Canal_Grande.png') },
  ],
  "ホットゾーン": [
    { name: "炎のリング", image: require('../../assets/MapImages/Ring_Of_Fire.png') },
    { name: "ビートルバトル", image: require('../../assets/MapImages/Dueling_Beetles.png') },
    { name: "オープンビジネス", image: require('../../assets/MapImages/Open_Business.png') },
    { name: "パラレルワールド", image: require('../../assets/MapImages/Parallel_Plays.png') },
  ],
};

const PickPrediction: React.FC = () => {
  const { t } = usePickPredictionTranslation();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState<number>(0);
  const [gameState, setGameState] = useState<SelectionState>({
    teamA: [],
    teamB: [],
    bansA: [],
    bansB: [],
    currentPhase: 1,
    currentTeam: 'A',
    recommendations: [],
    isBanPhaseEnabled: true,
    selectedMode: undefined,
    selectedMap: undefined,
    mapDetailProps: null,
  });

  const [showTurnModal, setShowTurnModal] = useState(false);
  const [showModeModal, setShowModeModal] = useState(false);
  const [turnMessage, setTurnMessage] = useState('');
  const [turnSubMessage, setTurnSubMessage] = useState('');
  const [screenStack, setScreenStack] = useState<ScreenState[]>([
    { type: 'home', translateX: new Animated.Value(0), zIndex: 0 }
  ]);
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const addToHistory = (newState: SelectionState) => {
    const newEntry: HistoryEntry = {
      state: JSON.parse(JSON.stringify(newState)),
      timestamp: Date.now()
    };

    const newHistory = [...history.slice(0, currentHistoryIndex + 1), newEntry];
    setHistory(newHistory);
    setCurrentHistoryIndex(newHistory.length - 1);
  };

  const setGameStateWithHistory = (
    newState: SelectionState | ((prev: SelectionState) => SelectionState)
  ) => {
    setGameState((prev) => {
      const nextState = typeof newState === 'function' ? newState(prev) : newState;
      addToHistory(nextState);
      return nextState;
    });
  };

  const handleUndo = () => {
    if (currentHistoryIndex > 0) {
      const previousState = history[currentHistoryIndex - 1].state;
      setCurrentHistoryIndex(currentHistoryIndex - 1);
      setGameState(previousState);
      
      if (previousState.isBanPhaseEnabled && 
          previousState.bansA.length + previousState.bansB.length < 6) {
        showTurnAnnouncement(previousState.currentTeam, 0, true);
      } else {
        showTurnAnnouncement(previousState.currentTeam, previousState.currentPhase);
      }
    }
  };

  const calculateTeamAdvantage = (teamAChars: string[], teamBChars: string[]): {
    teamAScore: number;
    teamBScore: number;
    advantageTeam: Team | null;
    difference: number;
  } => {
    let teamAScore = 0;
    let teamBScore = 0;

    teamAChars.forEach(aChar => {
      teamBChars.forEach(bChar => {
        const aId = getCharacterId(aChar);
        if (aId && allCharacterData[aId]) {
          const score = allCharacterData[aId].compatibilityScores[bChar] || 0;
          teamAScore += score;
        }
      });
    });

    teamBChars.forEach(bChar => {
      teamAChars.forEach(aChar => {
        const bId = getCharacterId(bChar);
        if (bId && allCharacterData[bId]) {
          const score = allCharacterData[bId].compatibilityScores[aChar] || 0;
          teamBScore += score;
        }
      });
    });

    let mapData;
    switch (gameState.selectedMode) {
      case t.modes.heist:
        mapData = gameState.selectedMap && heistMaps[gameState.selectedMap];
        break;
      case t.modes.brawlBall:
        mapData = gameState.selectedMap && brawlBallMaps[gameState.selectedMap];
        break;
      case t.modes.emeraldHunt:
        mapData = gameState.selectedMap && emeraldHuntMaps[gameState.selectedMap];
        break;
      case t.modes.knockout:
        mapData = gameState.selectedMap && knockoutMaps[gameState.selectedMap];
        break;
      case "デュエル":
        mapData = gameState.selectedMap && duelMaps[gameState.selectedMap];
        break;
    }

    if (mapData) {
      teamAChars.forEach(char => {
        const bonus = mapData.recommendedBrawlers.find(b => b.name === char);
        if (bonus) {
          teamAScore += bonus.power;
        }
      });

      teamBChars.forEach(char => {
        const bonus = mapData.recommendedBrawlers.find(b => b.name === char);
        if (bonus) {
          teamBScore += bonus.power;
        }
      });
    }

    const difference = Math.abs(teamAScore - teamBScore);
    let advantageTeam: Team | null = null;
    
    if (difference > 1) {
      advantageTeam = teamAScore > teamBScore ? 'A' : 'B';
    }

    return {
      teamAScore,
      teamBScore,
      advantageTeam,
      difference
    };
  };

  const handleMapInfoPress = (mode: GameMode, mapName: string) => {
    const mapDetail = {
      mapName,
      modeName: t.modes[mode.name],
      modeColor: typeof mode.color === 'function' ? mode.color() : mode.color,
      modeIcon: mode.icon,
      mapImage: MAPS_BY_MODE[t.modes[mode.name]]?.find(m => m.name === mapName)?.image
    };

    setGameStateWithHistory(prev => ({
      ...prev,
      mapDetailProps: mapDetail
    }));
    showScreen('mapDetail');
  };

  const handleModeSelect = (modeName: string) => {
    setGameStateWithHistory(prev => ({
      ...prev,
      selectedMode: modeName,
      selectedMap: undefined
    }));
  };

  const handleMapSelect = (mapName: string) => {
    setGameStateWithHistory(prev => ({
      ...prev,
      selectedMap: mapName
    }));
    setShowModeModal(false);
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

  const handleModeButtonPress = () => {
    if (!gameState.selectedMode) {
      const initialMode = t.modes[GAME_MODES[0].name];
      const initialMap = MAPS_BY_MODE[initialMode][0].name;
      setGameStateWithHistory(prev => ({
        ...prev,
        selectedMode: initialMode,
        selectedMap: initialMap
      }));
    }
    setShowModeModal(true);
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

  const resetGame = () => {
    setGameStateWithHistory({
      teamA: [],
      teamB: [],
      bansA: [],
      bansB: [],
      currentPhase: 1,
      currentTeam: 'A',
      recommendations: [],
      isBanPhaseEnabled: gameState.isBanPhaseEnabled,
      selectedMode: gameState.selectedMode,
      selectedMap: gameState.selectedMap,
      mapDetailProps: null,
    });
    setHistory([]);
    setCurrentHistoryIndex(0);
    showTurnAnnouncement('A', gameState.isBanPhaseEnabled ? 0 : 1, gameState.isBanPhaseEnabled);
  };

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

  const showTurnAnnouncement = (team: Team, phase: GamePhase, isBanPhase: boolean = false) => {
    const message = t.turnAnnouncement.teamTurn(team);
    const subMessage = isBanPhase 
      ? t.turnAnnouncement.selectBan 
      : t.turnAnnouncement.selectCharacter;

    setTurnMessage(message);
    setTurnSubMessage(subMessage);
    setShowTurnModal(true);
  };

  const getRecommendationReason = (score: number, opposingTeamSize: number): string => {
    const maxPossibleScore = opposingTeamSize * 10;
    const scorePercentage = (score / maxPossibleScore) * 100;
    
    if (scorePercentage >= 80) return t.recommendations.excellent;
    if (scorePercentage >= 65) return t.recommendations.veryGood;
    if (scorePercentage >= 50) return t.recommendations.good;
    if (scorePercentage >= 35) return t.recommendations.average;
    return t.recommendations.needsConsideration;
  };

  const calculateRecommendations = (
    currentTeam: Team,
    opposingTeamChars: string[],
    ownTeamChars: string[]
  ): CharacterRecommendation[] => {
    const recommendations: CharacterRecommendation[] = [];
    const bannedCharacters = [...gameState.bansA, ...gameState.bansB];
    
    Object.values(CHARACTER_MAP).forEach(character => {
      if (!opposingTeamChars.includes(character) && 
          !ownTeamChars.includes(character) && 
          !bannedCharacters.includes(character)) {
        let totalScore = 0;
        let mapBonus = 0;
        
        opposingTeamChars.forEach(opposingChar => {
          const characterId = getCharacterId(character);
          const opposingId = getCharacterId(opposingChar);
          
          if (characterId && opposingId && allCharacterData[characterId]) {
            const score = allCharacterData[characterId].compatibilityScores[opposingChar] || 0;
            totalScore += score;
          }
        });

        let mapData;
        switch (gameState.selectedMode) {
          case t.modes.heist:
            mapData = gameState.selectedMap && heistMaps[gameState.selectedMap];
            break;
          case t.modes.brawlBall:
            mapData = gameState.selectedMap && brawlBallMaps[gameState.selectedMap];
            break;
          case t.modes.emeraldHunt:
            mapData = gameState.selectedMap && emeraldHuntMaps[gameState.selectedMap];
            break;
          case t.modes.knockout:
            mapData = gameState.selectedMap && knockoutMaps[gameState.selectedMap];
            break;
          case "デュエル":
            mapData = gameState.selectedMap && duelMaps[gameState.selectedMap];
            break;
        }

        if (mapData) {
          const characterBonus = mapData.recommendedBrawlers.find(
            brawler => brawler.name === character
          );
          if (characterBonus) {
            mapBonus = characterBonus.power;
            totalScore += mapBonus;
          }
        }

        recommendations.push({
          character,
          score: totalScore,
          maxScore: opposingTeamChars.length * 10,
          reason: mapBonus > 0 
            ? `${getRecommendationReason(totalScore, opposingTeamChars.length)}` 
            : getRecommendationReason(totalScore, opposingTeamChars.length)
        });
      }
    });

    return recommendations.sort((a, b) => b.score - a.score).slice(0, 10);
  };

  const handleBanSelect = (character: string) => {
    if (!gameState.isBanPhaseEnabled) return;
    
    let newState = { ...gameState };
    
    if (gameState.bansA.length < 3 && gameState.currentTeam === 'A') {
      const newBansA = [...gameState.bansA, character];
      newState = {
        ...newState,
        bansA: newBansA,
        currentTeam: newBansA.length === 3 ? 'B' : 'A'
      };
      
      if (newBansA.length === 3) {
        showTurnAnnouncement('B', 0, true);
      }
    } else if (gameState.bansB.length < 3 && gameState.currentTeam === 'B') {
      const newBansB = [...gameState.bansB, character];
      newState = {
        ...newState,
        bansB: newBansB,
        currentTeam: newBansB.length === 3 ? 'A' : 'B'
      };
      
      if (newBansB.length === 3) {
        showTurnAnnouncement('A', 1, false);
      }
    }
    
    setGameStateWithHistory(newState);
  };

  const handleCharacterSelect = (character: string) => {
    const handlePickPhase = () => {
      const { currentPhase, currentTeam, teamA, teamB } = gameState;
      
      if (currentTeam === 'A' && teamA.includes(character)) return;
      if (currentTeam === 'B' && teamB.includes(character)) return;
      
      let newState = { ...gameState };

      switch (currentPhase) {
        case 1:
          if (currentTeam === 'A') {
            newState = {
              ...newState,
              teamA: [character],
              currentTeam: 'B',
              currentPhase: 2,
              recommendations: calculateRecommendations('B', [character], [])
            };
            showTurnAnnouncement('B', 2);
          }
          break;
        
        case 2:
          if (currentTeam === 'B' && teamB.length < 2) {
            const newTeamB = [...teamB, character];
            newState = {
              ...newState,
              teamB: newTeamB,
              recommendations: calculateRecommendations('B', teamA, newTeamB)
            };
            
            if (newTeamB.length === 2) {
              newState = {
                ...newState,
                currentTeam: 'A',
                currentPhase: 3,
                recommendations: calculateRecommendations('A', newTeamB, teamA)
              };
              showTurnAnnouncement('A', 3);
            }
          }
          break;
        
        case 3:
          if (currentTeam === 'A' && teamA.length < 3) {
            const newTeamA = [...teamA, character];
            newState = {
              ...newState,
              teamA: newTeamA,
              recommendations: calculateRecommendations('A', teamB, newTeamA)
            };
            
            if (newTeamA.length === 3) {
              newState = {
                ...newState,
                currentTeam: 'B',
                currentPhase: 4,
                recommendations: calculateRecommendations('B', newTeamA, teamB)
              };
              showTurnAnnouncement('B', 4);
            }
          }
          break;
        
        case 4:
          if (currentTeam === 'B' && teamB.length < 3) {
            const newTeamB = [...teamB, character];
            newState = {
              ...newState,
              teamB: newTeamB,
              recommendations: []
            };
          }
          break;
      }

      setGameStateWithHistory(newState);
    };

    if (!gameState.isBanPhaseEnabled) {
      handlePickPhase();
    } else {
      if (gameState.bansA.length === 3 && gameState.bansB.length === 3) {
        handlePickPhase();
      }
    }
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
              {GAME_MODES.map((mode) => (
                <TouchableOpacity
                  key={mode.name}
                  style={[
                    styles.modeModalButton,
                    gameState.selectedMode === t.modes[mode.name] && {
                      backgroundColor: typeof mode.color === 'function' ? mode.color() : mode.color
                    }
                  ]}
                  onPress={() => handleModeSelect(t.modes[mode.name])}
                >
                  <Image source={mode.icon} style={styles.modeIcon} />
                </TouchableOpacity>
              ))}
            </View>
            {gameState.selectedMode && (
              <>
                <Text style={styles.mapModalTitle}>{t.mapSelection.title}</Text>
                <View style={styles.mapGrid}>
                  {(MAPS_BY_MODE[gameState.selectedMode] || []).map((map) => (
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
                            const selectedMode = GAME_MODES.find(mode => t.modes[mode.name] === gameState.selectedMode);
                            if (selectedMode) {
                              setShowModeModal(false);
                              handleMapInfoPress(selectedMode, map.name);
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
              style={styles.banToggleContainer}
              onPress={() => {
                setGameStateWithHistory(prev => {
                  const newState = {
                    ...prev,
                    isBanPhaseEnabled: !prev.isBanPhaseEnabled,
                    bansA: [],
                    bansB: [],
                    teamA: [],
                    teamB: [],
                    currentPhase: 1,
                    currentTeam: 'A',
                    recommendations: [],
                  };
                  
                  if (!newState.isBanPhaseEnabled) {
                    showTurnAnnouncement('A', 1, false);
                  } else {
                    showTurnAnnouncement('A', 0, true);
                  }
                  
                  return newState;
                });
              }}
            >
              <View style={[
                styles.banToggleBox,
                gameState.isBanPhaseEnabled && styles.banToggleBoxChecked
              ]}>
                {gameState.isBanPhaseEnabled && <Text style={styles.banToggleCheck}>✓</Text>}
              </View>
              <Text style={styles.banToggleText}>{t.header.banToggle}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.headerCenter}>
            <TouchableOpacity 
              style={styles.modeSelectButton}
              onPress={handleModeButtonPress}
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
    style={[styles.headerButton, { opacity: currentHistoryIndex > 0 ? 1 : 0.5 }]}
    onPress={handleUndo}
    disabled={currentHistoryIndex === 0}
  >
    <Image 
      source={require('../../assets/OtherIcon/undo.png')}
      style={styles.undoButtonImage}
    />
  </TouchableOpacity>
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
            team="A"
            onBanSelect={handleBanSelect}
            onCharacterSelect={handleCharacterSelect}
          />
          <View style={styles.centerContent}>
            {gameState.selectedMap ? (
              <View style={styles.selectedMapContainer}>
                <Image 
                  source={MAPS_BY_MODE[gameState.selectedMode || ""]?.find(m => m.name === gameState.selectedMap)?.image}
                  style={styles.selectedMapImage}
                />
                <TouchableOpacity 
                  style={styles.infoButton}
                  onPress={() => {
                    const selectedMode = GAME_MODES.find(mode => t.modes[mode.name] === gameState.selectedMode);
                    if (selectedMode && gameState.selectedMap) {
                      handleMapInfoPress(selectedMode, gameState.selectedMap);
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
            team="B"
            onBanSelect={handleBanSelect}
            onCharacterSelect={handleCharacterSelect}
          />
        </View>
      </View>

      <CharacterSelection
        gameState={gameState}
        onBanSelect={handleBanSelect}
        onCharacterSelect={handleCharacterSelect}
        calculateTeamAdvantage={calculateTeamAdvantage}
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
},
undoButtonImage: {
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
  banToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  banToggleBox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 4,
    marginRight: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  banToggleBoxChecked: {
    backgroundColor: '#fff',
  },
  banToggleCheck: {
    color: '#21A0DB',
    fontSize: 12,
    fontWeight: 'bold',
  },
  banToggleText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
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
  },
});

export default PickPrediction;