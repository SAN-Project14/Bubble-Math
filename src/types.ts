export type ScreenState = 
  | 'MENU' 
  | 'TUTORIAL' 
  | 'MODE_SELECT' 
  | 'COUNTDOWN' 
  | 'PLAYING' 
  | 'PAUSED' 
  | 'RESULTS' 
  | 'SETTINGS';

export type GameMode = 'STANDARD' | 'SURVIVAL' | 'FRENZY_BLITZ' | 'ZEN';

export type Difficulty = 'EASY' | 'NORMAL' | 'HARD';

export interface GameSettings {
  musicEnabled: boolean;
  sfxEnabled: boolean;
  difficulty: Difficulty;
  reducedMotion: boolean;
  musicVolume: number; // 0 to 1
  sfxVolume: number; // 0 to 1
}

export interface GameStatistics {
  highScoreStandard: number;
  bestSurvivalTime: number; // in seconds
  bestFrenzyScore: number;
  bestZenMatches: number;
  totalGamesPlayed: number;
  totalCorrect: number;
  totalIncorrect: number;
  totalMissed: number;
}

export interface BubbleEntity {
  id: string;
  equation: string;
  answer: number;
  isCorrect: boolean;
  matchingTargetIndex?: number; // for Frenzy Blitz (0, 1, or 2)
  spawnTime: number; // timestamp in ms
  lifespan: number; // duration in ms (e.g. 5000 or 10000)
  x: number; // position in percentage (e.g. 8% to 82%)
  y: number; // position in percentage (e.g. 15% to 65%)
  vx: number; // horizontal drift speed
  vy: number; // vertical drift speed
  size: number; // diameter in px
  colorIndex: number; // 0 to 5 for vivid thematic gradients
  isWarning: boolean; // true when within warning phase (last 700ms or 15%)
  isPopping: boolean;
  isWrongShake: boolean;
}

export interface FloatingFeedback {
  id: string;
  x: number; // percentage
  y: number; // percentage
  text: string;
  type: 'correct' | 'wrong' | 'combo' | 'warning';
  scoreAdd?: number;
}

export interface GameSessionResult {
  mode: GameMode;
  score: number;
  survivalTime: number; // seconds
  correctCount: number;
  incorrectCount: number;
  missedCount: number;
  accuracy: number; // 0-100%
  comboMax: number;
  livesUsed?: number;
  isNewBest: boolean;
}
