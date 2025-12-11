export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
export type Language = 'en' | 'zh';

export interface TileData {
  id: number; // Unique ID for React keys and animation tracking
  value: number;
  row: number;
  col: number;
  isNew?: boolean;
  isMerged?: boolean;
}

export interface GameState {
  tiles: TileData[];
  score: number;
  bestScore: number;
  won: boolean;
  over: boolean;
  lastMoveDirection: Direction | null;
}

export interface Theme {
  name: string;
  appBg: string;
  gridBg: string;
  emptyCellBg: string;
  textColor: string;
  scoreBg: string;
  scoreText: string;
  buttonBg: string;
  buttonText: string;
  tileColors: Record<number, string>;
  tileTextColors: Record<number, string>; // Sometimes we need dark text on light tiles
}