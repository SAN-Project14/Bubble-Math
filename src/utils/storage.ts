import { GameSettings, GameStatistics, GameMode } from '../types';

const SETTINGS_KEY = 'bubble_math_settings_v1';
const STATS_KEY = 'bubble_math_stats_v1';

export const DEFAULT_SETTINGS: GameSettings = {
  musicEnabled: true,
  sfxEnabled: true,
  difficulty: 'NORMAL',
  reducedMotion: false,
  musicVolume: 0.78,
  sfxVolume: 0.7,
};

export const DEFAULT_STATS: GameStatistics = {
  highScoreStandard: 0,
  bestSurvivalTime: 0,
  bestFrenzyScore: 0,
  bestZenMatches: 0,
  totalGamesPlayed: 0,
  totalCorrect: 0,
  totalIncorrect: 0,
  totalMissed: 0,
};

export function loadSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw);
    // If the stored volume is the old lower default or below 0.5, bump to 0.78
    if (parsed.musicVolume === undefined || parsed.musicVolume <= 0.5) {
      parsed.musicVolume = 0.78;
    }
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings: GameSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

export function loadStats(): GameStatistics {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return { ...DEFAULT_STATS };
    return { ...DEFAULT_STATS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_STATS };
  }
}

export function saveStats(stats: GameStatistics): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save stats:', e);
  }
}

export function recordGameSession(
  mode: GameMode,
  score: number,
  survivalTime: number,
  correct: number,
  incorrect: number,
  missed: number
): { isNewBest: boolean; updatedStats: GameStatistics } {
  const current = loadStats();
  let isNewBest = false;

  if (mode === 'STANDARD') {
    if (score > current.highScoreStandard) {
      current.highScoreStandard = score;
      isNewBest = true;
    }
  } else if (mode === 'SURVIVAL') {
    if (survivalTime > current.bestSurvivalTime) {
      current.bestSurvivalTime = survivalTime;
      isNewBest = true;
    }
  } else if (mode === 'FRENZY_BLITZ') {
    if (score > current.bestFrenzyScore) {
      current.bestFrenzyScore = score;
      isNewBest = true;
    }
  } else if (mode === 'ZEN') {
    if (correct > current.bestZenMatches) {
      current.bestZenMatches = correct;
      isNewBest = true;
    }
  }

  current.totalGamesPlayed += 1;
  current.totalCorrect += correct;
  current.totalIncorrect += incorrect;
  current.totalMissed += missed;

  saveStats(current);
  return { isNewBest, updatedStats: current };
}

export function resetAllData(): { settings: GameSettings; stats: GameStatistics } {
  try {
    localStorage.removeItem(SETTINGS_KEY);
    localStorage.removeItem(STATS_KEY);
  } catch (e) {
    console.error('Failed to reset data:', e);
  }
  return {
    settings: { ...DEFAULT_SETTINGS },
    stats: { ...DEFAULT_STATS },
  };
}
