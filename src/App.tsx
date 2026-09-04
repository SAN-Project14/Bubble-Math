import { useState, useEffect } from 'react';
import { ScreenState, GameMode, GameSettings, GameStatistics, GameSessionResult } from './types';
import { loadSettings, saveSettings, loadStats, recordGameSession, resetAllData } from './utils/storage';
import { soundEngine } from './utils/audio';
import { BackgroundBubbleCanvas } from './components/BackgroundBubbleCanvas';
import { MainMenu } from './components/MainMenu';
import { TutorialScreen } from './components/TutorialScreen';
import { GameModeSelect } from './components/GameModeSelect';
import { CountdownOverlay } from './components/CountdownOverlay';
import { GameScreen } from './components/GameScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { SettingsModal } from './components/SettingsModal';
import { OfflineIndicator } from './components/OfflineIndicator';

export default function App() {
  const [screen, setScreen] = useState<ScreenState>('MENU');
  const [activeMode, setActiveMode] = useState<GameMode>('STANDARD');
  const [settings, setSettings] = useState<GameSettings>(loadSettings);
  const [stats, setStats] = useState<GameStatistics>(loadStats);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [lastSessionResult, setLastSessionResult] = useState<GameSessionResult | null>(null);

  // Sync sound engine on initial mount and when settings change
  useEffect(() => {
    soundEngine.setSettings(
      settings.musicEnabled,
      settings.sfxEnabled,
      settings.musicVolume,
      settings.sfxVolume
    );
  }, [settings]);

  // Manage background music for screens
  useEffect(() => {
    if (screen === 'MENU' || screen === 'MODE_SELECT' || screen === 'TUTORIAL') {
      soundEngine.startMusic('menu');
    }
  }, [screen]);

  // Start game flow: trigger countdown first
  const handleStartGameWithMode = (mode: GameMode) => {
    setActiveMode(mode);
    setScreen('COUNTDOWN');
  };

  const handleCountdownFinished = () => {
    setScreen('PLAYING');
  };

  const handleGameOver = (result: GameSessionResult) => {
    // Record into local statistics & high scores
    const { isNewBest, updatedStats } = recordGameSession(
      result.mode,
      result.score,
      result.survivalTime,
      result.correctCount,
      result.incorrectCount,
      result.missedCount
    );

    setStats(updatedStats);
    setLastSessionResult({ ...result, isNewBest });
    setScreen('RESULTS');
  };

  const handleUpdateSettings = (newSettings: GameSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleResetData = () => {
    const { settings: resetSettings, stats: resetStats } = resetAllData();
    setSettings(resetSettings);
    setStats(resetStats);
  };

  return (
    <main className="relative w-full h-full h-[100dvh] overflow-hidden bg-slate-950 text-white select-none">
      {/* Dynamic Animated Bubble Canvas with Math Symbols */}
      <BackgroundBubbleCanvas reducedMotion={settings.reducedMotion} />

      {/* Screen Router */}
      {screen === 'MENU' && (
        <MainMenu
          stats={stats}
          onStartGame={() => handleStartGameWithMode('STANDARD')}
          onOpenModes={() => setScreen('MODE_SELECT')}
          onOpenTutorial={() => setScreen('TUTORIAL')}
          onOpenSettings={() => setShowSettingsModal(true)}
        />
      )}

      {screen === 'MODE_SELECT' && (
        <GameModeSelect
          stats={stats}
          onSelectMode={(mode) => handleStartGameWithMode(mode)}
          onBack={() => setScreen('MENU')}
        />
      )}

      {screen === 'TUTORIAL' && (
        <TutorialScreen
          onComplete={() => setScreen('MENU')}
        />
      )}

      {screen === 'COUNTDOWN' && (
        <CountdownOverlay
          onComplete={handleCountdownFinished}
          reducedMotion={settings.reducedMotion}
        />
      )}

      {screen === 'PLAYING' && (
        <GameScreen
          mode={activeMode}
          difficulty={settings.difficulty}
          reducedMotion={settings.reducedMotion}
          onGameOver={handleGameOver}
          onExitToMenu={() => setScreen('MENU')}
          stats={stats}
        />
      )}

      {screen === 'RESULTS' && lastSessionResult && (
        <ResultsScreen
          result={lastSessionResult}
          stats={stats}
          onPlayAgain={() => handleStartGameWithMode(activeMode)}
          onChangeMode={() => setScreen('MODE_SELECT')}
          onMainMenu={() => setScreen('MENU')}
        />
      )}

      {/* Settings Modal (can be accessed over Menu or in-game) */}
      {showSettingsModal && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onResetData={handleResetData}
          onClose={() => setShowSettingsModal(false)}
        />
      )}

      {/* Non-intrusive offline connectivity status pill */}
      <OfflineIndicator />
    </main>
  );
}
