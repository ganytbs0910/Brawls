export type Character = {
  id: number;
  name: string;
  compatibilities: { [key: number]: number };
};