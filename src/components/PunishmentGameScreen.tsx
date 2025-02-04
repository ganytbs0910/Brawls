import React, { useState, useRef, useEffect } from 'react';
import { 
 View, 
 Text, 
 StyleSheet, 
 TouchableOpacity,
 Image,
 Dimensions,
 ScrollView
} from 'react-native';
import { CHARACTER_IMAGES, CharacterName } from '../data/characterImages';
import { usePunishmentGameTranslation, PunishmentGameTranslation } from '../i18n/punishmentGameScreen';

type Difficulty = 'easy' | 'normal' | 'hard' | 'extreme';

interface ChallengeGameScreenProps {
 onClose: () => void;
}

const useSlotReel = <T extends any>(initialItems: T[], intervalMs: number = 100) => {
 const [currentItem, setCurrentItem] = useState<T | null>(null);
 const [isSpinning, setIsSpinning] = useState(false);
 const intervalRef = useRef<NodeJS.Timer | null>(null);
 const itemsRef = useRef(initialItems);

 const updateItems = (newItems: T[]) => {
   itemsRef.current = newItems;
   if (!isSpinning && !currentItem) {
     setCurrentItem(newItems[0]);
   }
 };

 const startSpinning = () => {
   if (isSpinning || itemsRef.current.length === 0) return;
   
   setIsSpinning(true);
   let index = 0;
   
   setCurrentItem(itemsRef.current[0]);
   
   intervalRef.current = setInterval(() => {
     index = (index + 1) % itemsRef.current.length;
     setCurrentItem(itemsRef.current[index]);
   }, intervalMs);
 };

 const stopSpinning = () => {
   if (!isSpinning) return;
   
   if (intervalRef.current) {
     clearInterval(intervalRef.current);
     intervalRef.current = null;
   }
   
   const randomIndex = Math.floor(Math.random() * itemsRef.current.length);
   setCurrentItem(itemsRef.current[randomIndex]);
   setIsSpinning(false);
 };

 useEffect(() => {
   if (initialItems.length > 0) {
     setCurrentItem(initialItems[0]);
   }
   return () => {
     if (intervalRef.current) {
       clearInterval(intervalRef.current);
     }
   };
 }, []);

 return { currentItem, isSpinning, startSpinning, stopSpinning, updateItems };
};

const SCREEN_WIDTH = Dimensions.get('window').width;

const getGameModes = (t: PunishmentGameTranslation) => [
 t.gameModes.duoShowdown,
 t.gameModes.gemGrab,
 t.gameModes.brawlball,
 t.gameModes.knockout,
];

const ChallengeGameScreen: React.FC<ChallengeGameScreenProps> = ({ onClose }) => {
 const { t } = usePunishmentGameTranslation();
 const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);

 const CHALLENGES: Record<Difficulty, string[]> = {
   easy: t.challenges.easy,
   normal: t.challenges.normal,
   hard: t.challenges.hard,
   extreme: t.challenges.extreme
 };

 const characterReel = useSlotReel(Object.keys(CHARACTER_IMAGES) as CharacterName[]);
 const modeReel = useSlotReel(getGameModes(t));
 const challengeReel = useSlotReel(
   selectedDifficulty ? CHALLENGES[selectedDifficulty] : []
 );

 useEffect(() => {
  if (selectedDifficulty) {
    challengeReel.updateItems(CHALLENGES[selectedDifficulty]);
    modeReel.updateItems(getGameModes(t));
    setTimeout(() => {
      characterReel.startSpinning();
      modeReel.startSpinning();
      challengeReel.startSpinning();
    }, 100);
  }
}, [selectedDifficulty, t]);

 const difficultyColors = {
   easy: '#4CAF50',
   normal: '#FFC107',
   hard: '#F44336',
   extreme: '#800080'
 };

 const getDifficultyStyle = (difficulty: Difficulty) => ({
   ...styles.difficultyButton,
   backgroundColor: difficultyColors[difficulty],
 });

 const startAllReels = () => {
   characterReel.startSpinning();
   modeReel.startSpinning();
   challengeReel.startSpinning();
 };

 const resetSelection = () => {
   characterReel.stopSpinning();
   modeReel.stopSpinning();
   challengeReel.stopSpinning();
   setSelectedDifficulty(null);
 };

 const renderContent = () => {
   if (!selectedDifficulty) {
     return (
       <View style={styles.difficultyContainer}>
         <Text style={styles.instructionText}>{t.selectDifficulty}</Text>
         <View style={styles.difficultyButtonsContainer}>
           {(['easy', 'normal', 'hard', 'extreme'] as Difficulty[]).map((difficulty) => (
             <TouchableOpacity
               key={difficulty}
               style={getDifficultyStyle(difficulty)}
               onPress={() => setSelectedDifficulty(difficulty)}
             >
               <Text style={styles.difficultyButtonText}>
                 {t.difficulties[difficulty]}
               </Text>
             </TouchableOpacity>
           ))}
         </View>
       </View>
     );
   }

   const isAnySpinning = characterReel.isSpinning || modeReel.isSpinning || challengeReel.isSpinning;

   return (
     <View style={styles.slotContainer}>
       <Text style={[styles.difficultyTitle, { color: difficultyColors[selectedDifficulty] }]}>
         {t.difficulties[selectedDifficulty]}
       </Text>
       
       <View style={styles.slotMachine}>
         <View style={styles.reelContainer}>
           <View style={styles.slotReel}>
             {characterReel.currentItem ? (
               <View style={styles.characterContainer}>
                 <Image 
                   source={CHARACTER_IMAGES[characterReel.currentItem]}
                   style={styles.characterImage}
                 />
                 <Text style={styles.reelText}>{characterReel.currentItem}</Text>
               </View>
             ) : (
               <Text style={styles.spinText}>?</Text>
             )}
           </View>
           <TouchableOpacity
             style={[styles.stopButton, !characterReel.isSpinning && styles.buttonDisabled]}
             onPress={characterReel.stopSpinning}
             disabled={!characterReel.isSpinning}
           >
             <Text style={styles.buttonText}>{t.controls.stop}</Text>
           </TouchableOpacity>
         </View>

         <View style={styles.reelContainer}>
           <View style={styles.slotReel}>
             {modeReel.currentItem ? (
               <Text style={styles.reelText}>{modeReel.currentItem}</Text>
             ) : (
               <Text style={styles.spinText}>?</Text>
             )}
           </View>
           <TouchableOpacity
             style={[styles.stopButton, !modeReel.isSpinning && styles.buttonDisabled]}
             onPress={modeReel.stopSpinning}
             disabled={!modeReel.isSpinning}
           >
             <Text style={styles.buttonText}>{t.controls.stop}</Text>
           </TouchableOpacity>
         </View>

         <View style={styles.reelContainer}>
           <View style={styles.slotReel}>
             {challengeReel.currentItem ? (
               <Text style={styles.reelText}>{challengeReel.currentItem}</Text>
             ) : (
               <Text style={styles.spinText}>?</Text>
             )}
           </View>
           <TouchableOpacity
             style={[styles.stopButton, !challengeReel.isSpinning && styles.buttonDisabled]}
             onPress={challengeReel.stopSpinning}
             disabled={!challengeReel.isSpinning}
           >
             <Text style={styles.buttonText}>{t.controls.stop}</Text>
           </TouchableOpacity>
         </View>
       </View>

       <View style={styles.buttonContainer}>
         <TouchableOpacity
           style={[styles.button, styles.spinButton, isAnySpinning && styles.buttonDisabled]}
           onPress={startAllReels}
           disabled={isAnySpinning}
         >
           <Text style={styles.buttonText}>
             {isAnySpinning ? t.controls.spinning : 
              (characterReel.currentItem && modeReel.currentItem && challengeReel.currentItem) ? 
              t.controls.spinAgain : t.controls.spin}
           </Text>
         </TouchableOpacity>
         
         <TouchableOpacity
           style={[styles.button, styles.resetButton]}
           onPress={resetSelection}
         >
           <Text style={styles.buttonText}>{t.controls.backToDifficulty}</Text>
         </TouchableOpacity>
       </View>
     </View>
   );
 };

 return (
   <View style={styles.container}>
     <View style={styles.header}>
       <Text style={styles.title}>{t.title}</Text>
       <TouchableOpacity onPress={onClose} style={styles.backButton}>
         <Text style={styles.backButtonText}>←</Text>
       </TouchableOpacity>
     </View>
     
     <ScrollView 
       style={styles.scrollView}
       contentContainerStyle={styles.scrollViewContent}
       showsVerticalScrollIndicator={false}
     >
       {renderContent()}
     </ScrollView>
   </View>
 );
};

const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: '#fff',
 },
 scrollView: {
   flex: 1,
 },
 scrollViewContent: {
   flexGrow: 1,
   paddingBottom: 24,
 },
 header: {
   height: 60,
   backgroundColor: '#21A0DB',
   flexDirection: 'row',
   justifyContent: 'center',
   alignItems: 'center',
   paddingHorizontal: 16,
   borderBottomWidth: 1,
   borderBottomColor: '#4FA8D6',
 },
 title: {
   fontSize: 20,
   fontWeight: 'bold',
   color: '#fff',
   flex: 1,
   textAlign: 'center',
 },
 backButton: {
   position: 'absolute',
   left: 16,
   padding: 8,
 },
 backButtonText: {
   fontSize: 24,
   color: '#fff',
 },
 difficultyContainer: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
   padding: 16,
 },
 instructionText: {
   fontSize: 20,
   fontWeight: 'bold',
   marginBottom: 32,
   color: '#333',
 },
 difficultyButtonsContainer: {
   width: '100%',
   justifyContent: 'center',
   alignItems: 'center',
   gap: 16,
 },
 difficultyButton: {
   width: '80%',
   paddingVertical: 16,
   borderRadius: 8,
   justifyContent: 'center',
   alignItems: 'center',
   elevation: 3,
   shadowColor: '#000',
   shadowOffset: { width: 0, height: 2 },
   shadowOpacity: 0.25,
   shadowRadius: 3.84,
 },
 difficultyButtonText: {
   color: '#fff',
   fontSize: 20,
   fontWeight: 'bold',
 },
 slotContainer: {
   flex: 1,
   padding: 16,
   alignItems: 'center',
 },
 difficultyTitle: {
   fontSize: 24,
   fontWeight: 'bold',
   marginVertical: 16,
 },
 slotMachine: {
   width: '90%',
   backgroundColor: '#f8f8f8',
   borderRadius: 12,
   marginVertical: 24,
   padding: 16,
   borderWidth: 2,
   borderColor: '#ddd',
   gap: 16,
 },
 reelContainer: {
   alignItems: 'center',
   gap: 8,
 },
 slotReel: {
   width: '100%',
   height: 80,
   backgroundColor: '#fff',
   borderRadius: 8,
   justifyContent: 'center',
   alignItems: 'center',
   borderWidth: 1,
   borderColor: '#ddd',
 },
 characterContainer: {
   flexDirection: 'row',
   alignItems: 'center',
   justifyContent: 'center',
   gap: 8,
 },
 characterImage: {
   width: 40,
   height: 40,
   resizeMode: 'contain',
 },
 reelText: {
   fontSize: 18,
   fontWeight: 'bold',
   color: '#333',
   textAlign: 'center',
   paddingHorizontal: 8,
 },
 spinText: {
   fontSize: 24,
   color: '#666',
 },
 buttonContainer: {
   width: '100%',
   alignItems: 'center',
   gap: 16,
 },
 button: {
   width: '80%',
   paddingVertical: 16,
   borderRadius: 8,
   justifyContent: 'center',
   alignItems: 'center',
 },
 stopButton: {
   width: '50%',
   paddingVertical: 8,
   backgroundColor: '#e74c3c',
   borderRadius: 8,
   justifyContent: 'center',
   alignItems: 'center',
 },
 spinButton: {
   backgroundColor: '#21A0DB',
 },
 resetButton: {
   backgroundColor: '#666',
 },
 buttonDisabled: {
   backgroundColor: '#ccc',
 },
 buttonText: {
   color: '#fff',
   fontSize: 18,
   fontWeight: 'bold',
 },
});

export default ChallengeGameScreen;