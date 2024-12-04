//types.ts
export interface CharacterCompatibility {
  id: number;
  name: string;
  compatibilityScores: { [key: string]: number };
  explanation: { [key: string]: string };
}
