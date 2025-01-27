import React, { useState, useEffect, useRef } from 'react';
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
} from 'react-native';
import { TeamSection } from './TeamSection';
import { CharacterSelection } from './CharacterSelection';
import {
  CHARACTER_MAP,
  allCharacterData,
  getCharacterId
} from '../data/characterCompatibility';

interface GameMode {
  name: string;
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
}

export interface CharacterRecommendation {
  character: string;
  score: number;
  maxScore: number;
  reason: string;
}

export interface TeamSectionProps {
  gameState: SelectionState;
  team: Team;
  onBanSelect: (character: string) => void;
  onCharacterSelect: (character: string) => void;
}

const GAME_MODES: GameMode[] = [
  { name: "エメラルドハント", color: "#DA70D6", icon: require('../../assets/GameModeIcons/gem_grab_icon.png') },
  { name: "ブロストライカー", color: "#cccccc", icon: require('../../assets/GameModeIcons/brawl_ball_icon.png') },
  { name: "強奪", color: "#cccccc", icon: require('../../assets/GameModeIcons/heist_icon.png') },
  { name: "ノックアウト", color: "#FFA500", icon: require('../../assets/GameModeIcons/knock_out_icon.png') },
  { name: "賞金稼ぎ", color: "#DA70D6", icon: require('../../assets/GameModeIcons/bounty_icon.png') },
  { name: "ホットゾーン", color: "#cccccc", icon: require('../../assets/GameModeIcons/hot_zone_icon.png') },
];

const MAPS_BY_MODE: MapsByMode = {
  "エメラルドハント": [
    { name: "ごつごつ坑道", image: require('../../assets/MapImages/Hard_Rock_Mine.png') },
    { name: "アンダーマイン", image: require('../../assets/MapImages/Flying_Fantasies.png') },
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
  });

  const [showTurnModal, setShowTurnModal] = useState(false);
  const [showModeModal, setShowModeModal] = useState(false);
  const [turnMessage, setTurnMessage] = useState('');
  const [turnSubMessage, setTurnSubMessage] = useState('');
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const handleModeSelect = (modeName: string) => {
    setGameState(prev => ({
      ...prev,
      selectedMode: modeName,
      selectedMap: undefined
    }));
  };

  const handleMapSelect = (mapName: string) => {
    setGameState(prev => ({
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
    setShowModeModal(true);
  };

  const resetGame = () => {
    setGameState(prev => ({
      teamA: [],
      teamB: [],
      bansA: [],
      bansB: [],
      currentPhase: 1,
      currentTeam: 'A',
      recommendations: [],
      isBanPhaseEnabled: prev.isBanPhaseEnabled,
      selectedMode: prev.selectedMode,
      selectedMap: prev.selectedMap,
    }));
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

  const getPhaseInstructions = (phase: GamePhase, team: Team): string => {
    if (gameState.isBanPhaseEnabled) {
      if (gameState.bansA.length < 3) return `チームAが${3 - gameState.bansA.length}体目のバンを選択`;
      if (gameState.bansB.length < 3) return `チームBが${3 - gameState.bansB.length}体目のバンを選択`;
    }
    
    switch (phase) {
      case 1: return 'チームAが1体目を選択';
      case 2: return 'チームBが1,2体目を選択';
      case 3: return 'チームAが2,3体目を選択';
      case 4: return 'チームBが3体目を選択';
      default: return '';
    }
  };

  const showTurnAnnouncement = (team: Team, phase: GamePhase, isBanPhase: boolean = false) => {
    let message = `チーム${team}の番！`;
    let subMessage = '';
    
    if (isBanPhase) {
      subMessage = 'バンするキャラクターを選択してください';
    } else {
      switch (phase) {
        case 1:
          subMessage = '1体目を選択してください';
          break;
        case 2:
          subMessage = '1,2体目を選択してください';
          break;
        case 3:
          subMessage = '2,3体目を選択してください';
          break;
        case 4:
          subMessage = '最後の1体を選択してください';
          break;
      }
    }

    setTurnMessage(message);
    setTurnSubMessage(subMessage);
    setShowTurnModal(true);
  };

  const handleBanSelect = (character: string) => {
    if (!gameState.isBanPhaseEnabled) return;
    
    if (gameState.bansA.length < 3 && gameState.currentTeam === 'A') {
      const newBansA = [...gameState.bansA, character];
      setGameState(prev => ({
        ...prev,
        bansA: newBansA,
        currentTeam: newBansA.length === 3 ? 'B' : 'A'
      }));
      if (newBansA.length === 3) {
        showTurnAnnouncement('B', 0, true);
      }
    } else if (gameState.bansB.length < 3 && gameState.currentTeam === 'B') {
      const newBansB = [...gameState.bansB, character];
      setGameState(prev => ({
        ...prev,
        bansB: newBansB,
        currentTeam: newBansB.length === 3 ? 'A' : 'B'
      }));
      if (newBansB.length === 3) {
        showTurnAnnouncement('A', 1, false);
      }
    }
  };

  const handleCharacterSelect = (character: string) => {
    const handlePickPhase = () => {
      const { currentPhase, currentTeam, teamA, teamB } = gameState;
      
      if (currentTeam === 'A' && teamA.includes(character)) return;
      if (currentTeam === 'B' && teamB.includes(character)) return;
      
      const newState = { ...gameState };

      switch (currentPhase) {
        case 1:
          if (currentTeam === 'A') {
            newState.teamA = [character];
            newState.currentTeam = 'B';
            newState.currentPhase = 2;
            newState.recommendations = calculateRecommendations('B', [character], []);
            showTurnAnnouncement('B', 2);
          }
          break;
        
        case 2:
          if (currentTeam === 'B' && teamB.length < 2) {
            const newTeamB = [...teamB, character];
            newState.teamB = newTeamB;
            newState.recommendations = calculateRecommendations('B', teamA, newTeamB);
            if (newTeamB.length === 2) {
              newState.currentTeam = 'A';
              newState.currentPhase = 3;
              newState.recommendations = calculateRecommendations('A', newTeamB, teamA);
              showTurnAnnouncement('A', 3);
            }
          }
          break;
        
        case 3:
          if (currentTeam === 'A' && teamA.length < 3) {
            const newTeamA = [...teamA, character];
            newState.teamA = newTeamA;
            newState.recommendations = calculateRecommendations('A', teamB, newTeamA);
            if (newTeamA.length === 3) {
              newState.currentTeam = 'B';
              newState.currentPhase = 4;
              newState.recommendations = calculateRecommendations('B', newTeamA, teamB);
              showTurnAnnouncement('B', 4);
            }
          }
          break;
        
        case 4:
          if (currentTeam === 'B' && teamB.length < 3) {
            const newTeamB = [...teamB, character];
            newState.teamB = newTeamB;
            newState.recommendations = [];
          }
          break;
      }

      setGameState(newState);
    };

    if (!gameState.isBanPhaseEnabled) {
      handlePickPhase();
    } else {
      if (gameState.bansA.includes(character) || gameState.bansB.includes(character)) {
        return;
      }
      
      if (gameState.bansA.length === 3 && gameState.bansB.length === 3) {
        handlePickPhase();
      }
    }
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
        
        opposingTeamChars.forEach(opposingChar => {
          const characterId = getCharacterId(character);
          const opposingId = getCharacterId(opposingChar);
          
          if (characterId && opposingId && allCharacterData[characterId]) {
            const score = allCharacterData[characterId].compatibilityScores[opposingChar] || 0;
            totalScore += score;
          }
        });

        recommendations.push({
          character,
          score: totalScore,
          maxScore: opposingTeamChars.length * 10,
          reason: getRecommendationReason(totalScore, opposingTeamChars.length)
        });
      }
    });

    return recommendations.sort((a, b) => b.score - a.score).slice(0, 10);
  };

  const getRecommendationReason = (score: number, opposingTeamSize: number): string => {
    const maxPossibleScore = opposingTeamSize * 10;
    const scorePercentage = (score / maxPossibleScore) * 100;
    
    if (scorePercentage >= 80) return '最高の選択';
    if (scorePercentage >= 65) return '非常に良い選択';
    if (scorePercentage >= 50) return '良い選択';
    if (scorePercentage >= 35) return '標準的な選択';
    return '要検討';
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
                    gameState.selectedMode === mode.name && { backgroundColor: mode.color }
                  ]}
                  onPress={() => handleModeSelect(mode.name)}
                >
                  <Image source={mode.icon} style={styles.modeIcon} />
                </TouchableOpacity>
              ))}
            </View>
            {gameState.selectedMode && (
              <>
                <Text style={styles.mapModalTitle}>ステージを選択</Text>
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
                      <Image source={map.image} style={styles.mapModalImage} />
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
                setGameState(prev => {
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
              <Text style={styles.banToggleText}>バン選択</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.headerCenter}>
            <TouchableOpacity 
              style={styles.modeSelectButton}
              onPress={handleModeButtonPress}
            >
              <Text style={styles.modeSelectText}>
                {gameState.selectedMode ? gameState.selectedMode : "モードを選択"}
              </Text>
              {gameState.selectedMap && (
                <Text style={styles.selectedMapText}>
                  {gameState.selectedMap}
                </Text>
              )}
            </TouchableOpacity>
            <Text style={styles.phase}>{getPhaseInstructions(gameState.currentPhase, gameState.currentTeam)}</Text>
          </View>
          <TouchableOpacity 
            style={styles.resetButton}
            onPress={resetGame}
          >
            <Text style={styles.resetButtonText}>リセット</Text>
          </TouchableOpacity>
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
                <Text style={styles.selectedMapText}>{gameState.selectedMap}</Text>
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
              <Text style={styles.skipText}>タップでスキップ</Text>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
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
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -15 }],
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
    marginBottom: 5,
  },
  modeSelectText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  phase: {
    fontSize: 14,
    color: '#fff',
  },
  teamsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 10,
    backgroundColor: '#fff',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedMapContainer: {
    alignItems: 'center',
  },
  selectedMapImage: {
    width: 60,
    height: 80,
    borderRadius: 4,
    marginBottom: 4,
    resizeMode: 'cover',
  },
  selectedMapText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
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
  modeModalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  modeModalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    marginTop: 10,
    textAlign: 'center',
  },
  modeGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 10,
    flexWrap: 'wrap',
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
  mapModalImage: {
    width: '100%',
    height: 150,
    borderRadius: 4,
    marginBottom: 4,
    resizeMode: 'cover',
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