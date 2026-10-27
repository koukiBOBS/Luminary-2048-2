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
  isDark: boolean; // Flag to activate dark mode styling on UI elements
  dotColor: string; // Color preview for the quick switcher
  appBg: string; // Solid background for app viewport
  cardBg: string; // Solid background for modals & cards
  gridBg: string; // Board background
  emptyCellBg: string; // Empty cell background
  textColor: string; // Primary text color
  mutedTextColor: string; // Secondary text color
  scoreBg: string; // Score box background
  scoreText: string; // Score text color
  buttonBg: string; // Primary button background
  buttonText: string; // Primary button text color
  buttonHoverBg?: string; // Primary button hover background
  secondaryButtonBg: string; // Secondary button background
  tileColors: Record<number, string>; // Background & border classes for each tile number
  tileTextColors: Record<number, string>; // Accurate contrast text color for each tile number
}