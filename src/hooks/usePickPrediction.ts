import { useState, useEffect } from 'react';
import { usePickPredictionTranslation } from '../i18n/pickPrediction';
import { useCharacterLocalization } from '../hooks/useCharacterLocalization';
import {
  CHARACTER_MAP,
  allCharacterData,
  getCharacterId
} from '../data/characterCompatibility';
import { createMapsByMode, MapsByMode, GAME_MODES, getMapData } from '../data/mapDataService';
import { 
  Team, 
  GamePhase, 
  SelectionState, 
  HistoryEntry, 
  CharacterRecommendation 
} from './types';

export const usePickPrediction = () => {
  const { t } = usePickPredictionTranslation();
  const { getLocalizedName, currentLanguage } = useCharacterLocalization();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState<number>(0);
  const [mapsByMode, setMapsByMode] = useState<MapsByMode>({});
  const [showTurnModal, setShowTurnModal] = useState(false);
  const [showModeModal, setShowModeModal] = useState(false);
  const [turnMessage, setTurnMessage] = useState('');
  const [turnSubMessage, setTurnSubMessage] = useState('');

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

  const calculateTeamAdvantage = (teamAChars: string[], teamBChars: string[]) => {
  // チームスコアの計算
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

  // 勝率計算の修正
  const baseWinRate = 50; // ベース勝率は50%
  let winRate = baseWinRate;
  const totalScore = teamAScore + teamBScore; // totalScore の宣言を前に移動

  if (teamAScore === teamBScore) {
    // スコアが同じ場合は50%
    winRate = baseWinRate;
  } else if (totalScore > 0) {
    const scoreDiff = Math.abs(teamAScore - teamBScore);
    const maxDeviation = 50; // 最大偏差を50%に設定（0%〜100%の範囲）
    
    // スコア差の比率を計算（0〜1の範囲）
    const diffRatio = scoreDiff / totalScore;
    
    // 比率を調整（極端な値を抑制）
    const adjustedRatio = Math.pow(diffRatio, 0.7); // 0.7乗で緩やかなカーブに

    if (teamAScore > teamBScore) {
      winRate = baseWinRate + (maxDeviation * adjustedRatio);
    } else {
      winRate = baseWinRate - (maxDeviation * adjustedRatio);
    }

    // 0%〜100%の範囲に収める
    winRate = Math.max(0, Math.min(100, winRate));
  }

  return {
    teamAScore,
    teamBScore,
    advantageTeam,
    difference,
    winRate: Math.round(winRate)
  };
};

  const getMapBasedRecommendations = (mapName: string | undefined): CharacterRecommendation[] => {
  if (!mapName) return [];
  
  const mapData = getMapData(mapName);
  if (!mapData || !mapData.recommendedBrawlers) return [];

  return mapData.recommendedBrawlers
    .filter(brawler => brawler.power >= 4)
    .map(brawler => ({
      character: brawler.name,
      // ここでオリジナルのマップパワー値も保持しておく
      originalScore: brawler.power,
      // 表示用のスコアとして1.6倍した値を計算し切り上げる
      score: Math.ceil(brawler.power * 1.6),
      maxScore: Math.ceil(5 * 1.6) // 最大スコアも更新
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
  
  const mapRecs = getMapBasedRecommendations(selectedMap || gameState.selectedMap);
  const mapRecScores: { [key: string]: number } = {};
  
  mapRecs.forEach(mapRec => {
    mapRecScores[mapRec.character] = mapRec.score;
  });
  
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

      const mapScore = mapRecScores[character] || 0;
      // マップスコアを1.6倍して小数点を切り上げる
      const weightedMapScore = Math.ceil(mapScore * 1.6);
      
      const finalScore = totalScore + weightedMapScore;
      // 最大スコアも更新（マップスコアの最大値が5なので、変更後は最大8になる可能性がある）
      const maxScore = (opposingTeamChars.length * 10) + Math.ceil(5 * 1.6);

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
      newState = {
        ...newState,
        bansA: newBansA,
        currentTeam: newBansA.length === 3 ? 'B' : 'A'
      };
      
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
      newState = {
        ...newState,
        bansB: newBansB,
        currentTeam: newBansB.length === 3 ? 'A' : 'B'
      };
      
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
    const isAlreadyBanned = gameState.bansA.includes(character) || gameState.bansB.includes(character);
    const isValidDoubleban = isAlreadyBanned && (
      (gameState.currentTeam === 'A' && gameState.bansB.includes(character) && !gameState.bansA.includes(character)) ||
      (gameState.currentTeam === 'B' && gameState.bansA.includes(character) && !gameState.bansB.includes(character))
    );

    if (isAlreadyBanned && !isValidDoubleban) {
      return;
    }

    const handlePickPhase = () => {
      const { currentPhase, currentTeam, teamA, teamB, bansA, bansB } = gameState;
      
      if (bansA.includes(character) || bansB.includes(character)) {
        return;
      }
      
      if (currentTeam === 'A' && teamA.includes(character)) return;
      if (currentTeam === 'B' && teamB.includes(character)) return;
      
      let newState = { ...gameState };

      if (currentPhase === 1 && teamA.length === 0 && teamB.length === 0) {
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
                recommendations: []
              };
            }
          }
          break;
      }

      setGameStateWithHistory(newState);
    };

    if (gameState.isBanPhaseEnabled && 
        (gameState.bansA.length < 3 || gameState.bansB.length < 3)) {
      handleBanSelect(character);
    } else {
      handlePickPhase();
    }
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
    const bannedCharacters = [...gameState.bansA, ...gameState.bansB];
    const mapRecs = getMapBasedRecommendations(mapName)
      .filter(rec => !bannedCharacters.includes(rec.character));
    
    // 推奨計算も更新されたマップスコアを使用
    const newRecommendations = calculateRecommendations('A', [], [], mapName);
    
    setGameStateWithHistory(prev => ({
      ...prev,
      selectedMap: mapName,
      recommendations: mapRecs, // すでに1.6倍されたスコアが含まれる
      mapRecommendations: mapRecs
    }));
    setShowModeModal(false);
  }
};

  const showTurnAnnouncement = (team: Team, phase: GamePhase, isBanPhase: boolean = false) => {
    const message = t.turnAnnouncement.teamTurn(team);
    const subMessage = isBanPhase 
      ? t.turnAnnouncement.selectBan 
      : t.turnAnnouncement.selectCharacter;

    setTurnMessage(message);
    setTurnSubMessage(subMessage);
    setShowTurnModal(true);
  };

  const resetGame = () => {
    setGameStateWithHistory(prevState => {
      const currentMode = prevState.selectedMode;
      const currentMap = prevState.selectedMap;
      
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
        recommendations: mapRecommendations,
        mapRecommendations: mapRecommendations,
        isBanPhaseEnabled: prevState.isBanPhaseEnabled,
        selectedMode: currentMode,
        selectedMap: currentMap,
        mapDetailProps: null,
      };
    });
    
    setHistory([]);
    setCurrentHistoryIndex(0);

    if (gameState.selectedMap) {
      showTurnAnnouncement('A', gameState.isBanPhaseEnabled ? 0 : 1, gameState.isBanPhaseEnabled);
    } else {
      setShowModeModal(true);
    }
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
  };

  return {
    gameState,
    history,
    currentHistoryIndex,
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
    showTurnAnnouncement,
    handleMapInfoPress,
    setGameStateWithHistory,
    t
  };
};