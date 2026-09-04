import React from 'react';
import { Play, LayoutGrid, BookOpen, Settings, Trophy, Sparkles } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { GameStatistics } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface MainMenuProps {
  stats: GameStatistics;
  onStartGame: () => void;
  onOpenModes: () => void;
  onOpenTutorial: () => void;
  onOpenSettings: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  stats,
  onStartGame,
  onOpenModes,
  onOpenTutorial,
  onOpenSettings,
}) => {
  return (
    <div className="relative z-20 flex flex-col items-center justify-between w-full h-full h-[100dvh] overflow-y-auto no-scrollbar p-3 sm:p-5 md:p-6 xl:p-8 pt-[max(0.5rem,env(safe-area-inset-top))] pb-[max(0.5rem,env(safe-area-inset-bottom))] pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] max-w-full xl:max-w-5xl mx-auto select-none">
      <div className="w-full shrink-0 h-1 sm:h-2" /> {/* Top spacing */}

      {/* Hero Title & Branding */}
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center text-center my-auto py-1 sm:py-2 w-full">
        {/* Floating Bubble Icon Mascot */}
        <div className="relative mb-2 sm:mb-3 md:mb-5 group cursor-pointer" onClick={() => soundEngine.playBubblePop()}>
          <div className="w-14 h-14 sm:w-20 sm:h-20 md:w-28 md:h-28 xl:w-32 xl:h-32 rounded-full bg-gradient-to-br from-cyan-400/40 via-sky-500/30 to-indigo-600/50 border-2 border-cyan-300/80 flex items-center justify-center shadow-[0_0_35px_rgba(6,182,212,0.4)] animate-bubble-float">
            <div className="bubble-highlight" />
            <span className="font-bubble text-xl sm:text-3xl md:text-4xl xl:text-5xl font-black text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] flex items-center gap-0.5">
              <span>+</span>
              <span className="text-cyan-300">×</span>
              <span className="text-amber-300">÷</span>
            </span>
          </div>
          <div className="absolute -bottom-1 -right-1 p-1 sm:p-1.5 md:p-2 rounded-full bg-amber-400 text-slate-950 font-bold shadow-md animate-bounce">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
          </div>
        </div>

        {/* Title */}
        <h1 className="font-bubble text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300 drop-shadow-[0_4px_16px_rgba(6,182,212,0.6)] mb-0.5 sm:mb-1">
          BUBBLE MATH
        </h1>

        {/* Tagline */}
        <p className="font-semibold text-slate-300 text-[11px] sm:text-xs md:text-sm xl:text-base max-w-xs sm:max-w-md xl:max-w-lg tracking-wide leading-snug drop-shadow mb-2 sm:mb-3 md:mb-4 px-2">
          “Pop the right equation. Beat the clock. Master the numbers.”
        </p>

        {/* Best Score Pill Preview */}
        {stats.highScoreStandard > 0 || stats.bestSurvivalTime > 0 || stats.bestFrenzyScore > 0 || stats.bestZenMatches > 0 ? (
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 py-0.5 sm:py-1 md:py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 text-slate-300 text-[10px] sm:text-xs md:text-sm font-semibold backdrop-blur-md mb-2.5 sm:mb-4 shadow-sm">
            <Trophy className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
            <span>Best Timed: <strong className="text-cyan-300">{stats.highScoreStandard}</strong> pts</span>
            <span className="text-slate-600 hidden xs:inline">•</span>
            <span>Surv: <strong className="text-rose-400">{Math.floor(stats.bestSurvivalTime)}s</strong></span>
            {stats.bestFrenzyScore > 0 && (
              <>
                <span className="text-slate-600 hidden xs:inline">•</span>
                <span>Frenzy: <strong className="text-cyan-400">{stats.bestFrenzyScore} pts</strong></span>
              </>
            )}
            {stats.bestZenMatches > 0 && (
              <>
                <span className="text-slate-600 hidden xs:inline">•</span>
                <span>Zen: <strong className="text-emerald-400">{stats.bestZenMatches} matches</strong></span>
              </>
            )}
          </div>
        ) : (
          <div className="h-2 sm:h-3 mb-2 sm:mb-3" />
        )}

        {/* Main Menu Action Buttons */}
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-lg xl:max-w-xl flex flex-col gap-2 sm:gap-2.5 md:gap-3">
          {/* 1. START GAME (Hero Action) */}
          <button
            id="btn-menu-start"
            type="button"
            onMouseEnter={() => soundEngine.playHover()}
            onClick={() => {
              soundEngine.playClick();
              onStartGame();
            }}
            className="w-full py-2.5 sm:py-3.5 md:py-4 px-5 sm:px-6 rounded-2xl md:rounded-3xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:via-sky-400 hover:to-blue-500 text-white font-bubble text-lg sm:text-xl md:text-2xl font-black shadow-[0_6px_25px_rgba(6,182,212,0.5)] flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] active:scale-[0.97]"
          >
            <Play className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 fill-current" />
            START GAME
          </button>

          {/* Secondary Actions: Vertical stack on small mobile portrait, 3-column row on landscape, tablet & desktop */}
          <div className="grid grid-cols-1 landscape:grid-cols-3 sm:grid-cols-3 gap-2 sm:gap-2.5 md:gap-3 w-full">
            {/* 2. GAME MODES */}
            <button
              id="btn-menu-modes"
              type="button"
              onMouseEnter={() => soundEngine.playHover()}
              onClick={() => {
                soundEngine.playClick();
                onOpenModes();
              }}
              className="w-full py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 rounded-xl sm:rounded-2xl bg-slate-900/85 hover:bg-slate-800 border-2 border-slate-700/70 hover:border-cyan-400/80 text-slate-200 hover:text-white font-bubble text-xs sm:text-sm md:text-sm xl:text-base font-bold shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
            >
              <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-400 shrink-0" />
              GAME MODES
            </button>

            {/* 3. TUTORIAL */}
            <button
              id="btn-menu-tutorial"
              type="button"
              onMouseEnter={() => soundEngine.playHover()}
              onClick={() => {
                soundEngine.playClick();
                onOpenTutorial();
              }}
              className="w-full py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 rounded-xl sm:rounded-2xl bg-slate-900/85 hover:bg-slate-800 border-2 border-slate-700/60 hover:border-slate-500 text-slate-300 hover:text-white font-bubble text-xs sm:text-sm md:text-sm xl:text-base font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] whitespace-nowrap"
            >
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
              HOW TO PLAY
            </button>

            {/* 4. SETTINGS */}
            <button
              id="btn-menu-settings"
              type="button"
              onMouseEnter={() => soundEngine.playHover()}
              onClick={() => {
                soundEngine.playClick();
                onOpenSettings();
              }}
              className="w-full py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 rounded-xl sm:rounded-2xl bg-slate-900/85 hover:bg-slate-800 border-2 border-slate-700/60 hover:border-slate-500 text-slate-300 hover:text-white font-bubble text-xs sm:text-sm md:text-sm xl:text-base font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] whitespace-nowrap"
            >
              <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400 shrink-0" />
              SETTINGS
            </button>
          </div>

          {/* In-App PWA Install Action (renders only when installable / on iOS, hides when standalone) */}
          <PWAInstallButton />
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center text-[10px] sm:text-[11px] text-slate-500 font-medium pt-1 pb-0.5 shrink-0">
        Bubble Math Arcade • Use Mouse, Touch, or Keyboard
      </div>
    </div>
  );
};
