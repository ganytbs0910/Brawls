import { Character } from '../types/character';

export const getCompatibilityList = (
  character: Character,
  allCharacters: Character[]
): { character: Character; score: number }[] => {
  return Object.entries(character.compatibilities)
    .map(([id, score]) => ({
      character: allCharacters.find(c => c.id === parseInt(id))!,
      score
    }))
    .sort((a, b) => b.score - a.score);
};