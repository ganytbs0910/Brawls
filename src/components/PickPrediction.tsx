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
import { useCharacterLocalization } from '../hooks/useCharacterLocalization';
import {
  CHARACTER_MAP,
  allCharacterData,
  getCharacterId
} from '../data/characterCompatibility';
import { createMapsByMode, MapsByMode, GAME_MODES, getMapData } from '../data/mapDataService';

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
  mapRecommendations: CharacterRecommendation[];
  isBanPhaseEnabled: true;
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
}

const PickPrediction: React.FC = () => {
  const { t } = usePickPredictionTranslation();
  const { getLocalizedName, currentLanguage } = useCharacterLocalization();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState<number>(0);
  const [mapsByMode, setMapsByMode] = useState<MapsByMode>({});
  const [gameState, setGameState] = useState<SelectionState>({
    teamA: [],
    teamB: [],
    bansA: [],
    bansB: [],
    currentPhase: 1,
    currentTeam: 'A',
    recommendations: [],
    mapRecommendations: [],
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

  useEffect(() => {
    const loadMapData = async () => {
      try {
        const maps = await createMapsByMode();
        setMapsByMode(maps);
      } catch (error) {
        console.error('Error loading map data:', error);
      }
    };
    loadMapData();
  }, []);

  const getMapsByMode = (selectedMode: string | undefined) => {
    if (!selectedMode) return [];
    return mapsByMode[selectedMode] || [];
  };

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
  winRate: number;
} => {
  let teamAScore = 0;
  let teamBScore = 0;

  // 基本的なスコア計算（変更なし）
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

  // スコアを正規化して勝率を計算
  const totalScore = teamAScore + teamBScore;
  const advantageScore = Math.max(teamAScore, teamBScore);
  const baseWinRate = 50;
  
  // 勝率を計算（50.1%〜95%の範囲に収める）
  let winRate = baseWinRate;
  if (totalScore > 0) {
    const maxDeviation = 44.9;
    // スコア比率の計算を調整
    const rawRatio = advantageScore / totalScore;
    const enhancedRatio = Math.pow(rawRatio, 0.5); // 0.5の指数でより急激に上昇
    const multiplier = 1.2; // 全体的な倍率を上げる
    const scoreRatio = Math.min(1, (enhancedRatio * multiplier + rawRatio) / 2); // 元の比率と強調された比率の加重平均
    
    winRate = Math.min(95, Math.max(50.1, baseWinRate + (maxDeviation * (2 * scoreRatio - 1))));
  }

  return {
    teamAScore,
    teamBScore,
    advantageTeam,
    difference,
    winRate: Math.round(winRate)
  };
};

  const handleMapInfoPress = (mode: any, mapName: string) => {
    const mapDetail = {
      mapName,
      modeName: t.modes[mode.name],
      modeColor: typeof mode.color === 'function' ? mode.color() : mode.color,
      modeIcon: mode.icon,
      mapImage: getMapsByMode(t.modes[mode.name])?.find(m => m.name === mapName)?.image
    };

    setGameStateWithHistory(prev => ({
      ...prev,
      mapDetailProps: mapDetail
    }));
    showScreen('mapDetail');
  };

  const handleModeSelect = (modeName: string) => {
    const translatedMode = t.modes[modeName as keyof typeof t.modes];
    setGameStateWithHistory(prev => ({
      ...prev,
      selectedMode: translatedMode,
      selectedMap: undefined
    }));
  };

  const handleMapSelect = (mapName: string) => {
    const maps = getMapsByMode(gameState.selectedMode);
    if (maps.length > 0) {
      // まず新しいマップのおすすめを取得
      const bannedCharacters = [...gameState.bansA, ...gameState.bansB];
      const mapRecs = getMapBasedRecommendations(mapName)
        .filter(rec => !bannedCharacters.includes(rec.character));  // バンされたキャラクターを除外
      
      // calculateRecommendationsに新しいマップ名を渡す
      const newRecommendations = calculateRecommendations('A', [], [], mapName);
      
      setGameStateWithHistory(prev => ({
        ...prev,
        selectedMap: mapName,
        recommendations: mapRecs,  // マップベースのおすすめを直接使用
        mapRecommendations: mapRecs
      }));
      setShowModeModal(false);
    }
  };

  const handleModeButtonPress = () => {
    if (!gameState.selectedMode) {
      const initialMode = t.modes[GAME_MODES[0].name];
      const maps = getMapsByMode(initialMode);
      const initialMap = maps[0]?.name;
      
      if (initialMap) {
        setGameStateWithHistory(prev => ({
          ...prev,
          selectedMode: initialMode,
          selectedMap: initialMap,
          recommendations: calculateRecommendations('A', [], [])
        }));
      }
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
  setGameStateWithHistory(prevState => {
    // 現在のマップ設定を取得
    const currentMode = prevState.selectedMode;
    const currentMap = prevState.selectedMap;
    
    // マップに基づく推奨を取得
    const mapRecommendations = currentMap 
      ? getMapBasedRecommendations(currentMap)
      : [];

    return {
      teamA: [],
      teamB: [],
      bansA: [],
      bansB: [],
      currentPhase: 1,
      currentTeam: 'A',
      recommendations: mapRecommendations, // マップベースの推奨で初期化
      mapRecommendations: mapRecommendations,
      isBanPhaseEnabled: prevState.isBanPhaseEnabled,
      selectedMode: currentMode,
      selectedMap: currentMap,
      mapDetailProps: null,
    };
  });
  
  setHistory([]);
  setCurrentHistoryIndex(0);

  // ターンアナウンスを表示（マップが選択されていない場合はマップ選択を促す）
  if (gameState.selectedMap) {
    showTurnAnnouncement('A', gameState.isBanPhaseEnabled ? 0 : 1, gameState.isBanPhaseEnabled);
  } else {
    setShowModeModal(true); // マップが選択されていない場合はモーダルを表示
  }
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

  const handleTeamSwap = () => {
  setGameStateWithHistory(prev => ({
    ...prev,
    teamA: [...prev.teamB],
    teamB: [...prev.teamA],
    bansA: [...prev.bansB],
    bansB: [...prev.bansA],
    // チームの入れ替え時に現在のターンも反転
    currentTeam: prev.currentTeam === 'A' ? 'B' : 'A'
  }));
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

   const getMapBasedRecommendations = (mapName: string | undefined): CharacterRecommendation[] => {
  if (!mapName) return [];
  
  const mapData = getMapData(mapName);
  if (!mapData || !mapData.recommendedBrawlers) return [];

  return mapData.recommendedBrawlers
    .filter(brawler => brawler.power >= 4)
    .map(brawler => ({
      character: brawler.name,
      score: brawler.power,
      maxScore: 5
    }))
    .sort((a, b) => b.score - a.score);
};

  const calculateRecommendations = (
  currentTeam: Team,
  opposingTeamChars: string[],
  ownTeamChars: string[],
  selectedMap?: string
): CharacterRecommendation[] => {
  const recommendations: CharacterRecommendation[] = [];
  const bannedCharacters = [...gameState.bansA, ...gameState.bansB];
  
  // マップベースのおすすめを取得
  const mapRecs = getMapBasedRecommendations(selectedMap || gameState.selectedMap);
  const mapRecScores: { [key: string]: number } = {};
  
  // マップおすすめのスコアを記録
  mapRecs.forEach(mapRec => {
    mapRecScores[mapRec.character] = mapRec.score;
  });
  
  // 使用可能な全キャラクターに対して計算
  Object.values(CHARACTER_MAP).forEach(character => {
    if (!opposingTeamChars.includes(character) && 
        !ownTeamChars.includes(character) && 
        !bannedCharacters.includes(character)) {
      
      let totalScore = 0;
      
      // 相手チームとの相性スコアを計算
      opposingTeamChars.forEach(opposingChar => {
        const characterId = getCharacterId(character);
        const opposingId = getCharacterId(opposingChar);
        
        if (characterId && opposingId && allCharacterData[characterId]) {
          const score = allCharacterData[characterId].compatibilityScores[opposingChar] || 0;
          totalScore += score;
        }
      });

      // マップスコアがある場合は重み付けして加算
      const mapScore = mapRecScores[character] || 0;
      const weightedMapScore = mapScore; // マップスコアの重みを2倍に
      
      const finalScore = totalScore + weightedMapScore;
      const maxScore = (opposingTeamChars.length * 10) + 10; // 相性最大スコア + マップ最大スコア

      if (finalScore > 0 || opposingTeamChars.length === 0 || mapScore > 0) {
        recommendations.push({
          character,
          score: finalScore,
          maxScore: maxScore
        });
      }
    }
  });

  return recommendations.sort((a, b) => b.score - a.score).slice(0, 10);
};

 const handleBanSelect = (character: string) => {
  if (!gameState.isBanPhaseEnabled) return;
  
  let newState = { ...gameState };
  
  if (gameState.bansA.length < 3 && gameState.currentTeam === 'A') {
    const newBansA = [...gameState.bansA, character];
    // バンリストを更新
    newState = {
      ...newState,
      bansA: newBansA,
      currentTeam: newBansA.length === 3 ? 'B' : 'A'
    };
    
    // 毎回のバン選択後に推奨リストを更新
    const mapRecs = getMapBasedRecommendations(gameState.selectedMap)
      .filter(rec => 
        !newBansA.includes(rec.character) && 
        !gameState.bansB.includes(rec.character)
      );
    
    newState = {
      ...newState,
      recommendations: mapRecs,
      mapRecommendations: mapRecs
    };
    
    if (newBansA.length === 3) {
      showTurnAnnouncement('B', 0, true);
    }
  } else if (gameState.bansB.length < 3 && gameState.currentTeam === 'B') {
    const newBansB = [...gameState.bansB, character];
    // バンリストを更新
    newState = {
      ...newState,
      bansB: newBansB,
      currentTeam: newBansB.length === 3 ? 'A' : 'B'
    };
    
    // 毎回のバン選択後に推奨リストを更新
    const mapRecs = getMapBasedRecommendations(gameState.selectedMap)
      .filter(rec => 
        !gameState.bansA.includes(rec.character) && 
        !newBansB.includes(rec.character)
      );
    
    newState = {
      ...newState,
      recommendations: mapRecs,
      mapRecommendations: mapRecs
    };
    
    if (newBansB.length === 3) {
      showTurnAnnouncement('A', 1, false);
    }
  }
  
  setGameStateWithHistory(newState);
};

  const handleCharacterSelect = (character: string) => {
  // バンされたキャラクターのチェック
  // 同じキャラクターのバンは許可する特別ケース
  const isAlreadyBanned = gameState.bansA.includes(character) || gameState.bansB.includes(character);
  const isValidDoubleban = isAlreadyBanned && (
    // Team Aのバン中で、Team Bが既にバン済みの場合
    (gameState.currentTeam === 'A' && gameState.bansB.includes(character) && !gameState.bansA.includes(character)) ||
    // Team Bのバン中で、Team Aが既にバン済みの場合
    (gameState.currentTeam === 'B' && gameState.bansA.includes(character) && !gameState.bansB.includes(character))
  );

  // バンされていて、かつダブルバンケースでもない場合は選択不可
  if (isAlreadyBanned && !isValidDoubleban) {
    return;
  }

  const handlePickPhase = () => {
    const { currentPhase, currentTeam, teamA, teamB, bansA, bansB } = gameState;
    
    // バンされたキャラクターのチェック
    if (bansA.includes(character) || bansB.includes(character)) {
      return; // バンされたキャラクターは選択できない
    }
    
    // 既存のチーム内での重複チェック
    if (currentTeam === 'A' && teamA.includes(character)) return;
    if (currentTeam === 'B' && teamB.includes(character)) return;
    
    let newState = { ...gameState };

    // phase 1の初期状態での処理
    if (currentPhase === 1 && teamA.length === 0 && teamB.length === 0) {
      // マップベースの推奨を取得し、バンされたキャラクターを除外
      const bannedCharacters = [...gameState.bansA, ...gameState.bansB];
      const mapRecs = getMapBasedRecommendations(gameState.selectedMap)
        .filter(rec => !bannedCharacters.includes(rec.character));

      newState = {
        ...newState,
        recommendations: mapRecs
      };
    }

  switch (currentPhase) {
    case 1:
      if (currentTeam === 'A') {
        newState = {
          ...newState,
          teamA: [character],
          currentTeam: 'B',
          currentPhase: 2,
          recommendations: calculateRecommendations('B', [character], [], gameState.selectedMap)
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
          recommendations: calculateRecommendations('B', teamA, newTeamB, gameState.selectedMap)
        };
        
        if (newTeamB.length === 2) {
          newState = {
            ...newState,
            currentTeam: 'A',
            currentPhase: 3,
            recommendations: calculateRecommendations('A', newTeamB, teamA, gameState.selectedMap)
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
          recommendations: calculateRecommendations('A', teamB, newTeamA, gameState.selectedMap)
        };
        
        if (newTeamA.length === 3) {
          newState = {
            ...newState,
            currentTeam: 'B',
            currentPhase: 4,
            recommendations: calculateRecommendations('B', newTeamA, teamB, gameState.selectedMap)
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
          recommendations: calculateRecommendations('B', teamA, newTeamB, gameState.selectedMap)
        };
        
        if (newTeamB.length === 3) {
          newState = {
            ...newState,
            recommendations: [] // 全選択が終わったので推奨をクリア
          };
        }
      }
      break;
  }

  setGameStateWithHistory(newState);
};

    // バンフェーズが有効かつ完了していない場合は、バン選択として処理
    if (gameState.isBanPhaseEnabled && 
        (gameState.bansA.length < 3 || gameState.bansB.length < 3)) {
      handleBanSelect(character);
    } else {
      handlePickPhase();
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
    style={[styles.headerButton, { opacity: currentHistoryIndex > 0 ? 1 : 0.5 }]}
    onPress={handleUndo}
    disabled={currentHistoryIndex === 0}
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
            getLocalizedName={getLocalizedName}
          />
        </View>
      </View>

      <CharacterSelection
        gameState={gameState}
        onBanSelect={handleBanSelect}
        onCharacterSelect={handleCharacterSelect}
        calculateTeamAdvantage={calculateTeamAdvantage}
        getLocalizedName={getLocalizedName}
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
  flexDirection: 'row',  // この行を追加
  alignItems: 'center',  // この行を追加
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
});

export default PickPrediction;