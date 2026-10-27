export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
export type Language = 'en' | 'zh';

export interface TileData {
  id: number; // Unique ID for React keys and animation tracking
  value: number;
  row: number;
  col: number;
  isNew?: boolean;
  isMerged?: boolean;
  isDying?: boolean; // Used for animation: tile slides to destination before being removed
}

export interface GameHistorySnapshot {
  tiles: TileData[];
  score: number;
}

export interface GameState {
  tiles: TileData[];
  score: number;
  bestScore: number;
  won: boolean;
  over: boolean;
  lastMoveDirection: Direction | null;
  history?: GameHistorySnapshot[];
}

export interface Theme {
  id: string;
  name: string;
  nameZh: string;
  dotColor: string; // Color preview for the quick switcher
  appBg: string;
  cardBg: string;
  gridBg: string;
  emptyCellBg: string;
  textColor: string;
  mutedTextColor: string;
  scoreBg: string;
  scoreText: string;
  buttonBg: string;
  buttonText: string;
  buttonHoverBg?: string;
  secondaryButtonBg: string;
  tileColors: Record<number, string>;
  tileTextColors: Record<number, string>;
}