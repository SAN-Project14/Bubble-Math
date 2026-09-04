import React, { useEffect } from 'react';
import { Trophy, CheckCircle, XCircle, AlertCircle, Clock, RotateCcw, LayoutGrid, Home, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GameSessionResult, GameStatistics } from '../types';
import { soundEngine } from '../utils/audio';

interface ResultsScreenProps {
  result: GameSessionResult;
  stats: GameStatistics;
  onPlayAgain: () => void;
  onChangeMode: () => void;
  onMainMenu: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  result,
  stats,
  onPlayAgain,
  onChangeMode,
  onMainMenu,
}) => {
  useEffect(() => {
    soundEngine.startMusic('results');
    if (result.isNewBest || result.score > 200 || result.correctCount > 15) {
      // Fire confetti burst!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#a855f7', '#34d399', '#f43f5e', '#fbbf24'],
      });
    }
  }, [result]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="relative z-20 flex flex-col items-center justify-center w-full h-full h-[100dvh] overflow-y-auto no-scrollbar overscroll-contain p-2.5 sm:p-4 md:p-6 xl:p-8 pt-[max(0.5rem,env(safe-area-inset-top))] pb-[max(0.5rem,env(safe-area-inset-bottom))] pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] max-w-2xl xl:max-w-4xl mx-auto select-none">
      <div className="w-full my-auto bg-slate-900/85 border-2 border-slate-700/80 rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 md:p-8 backdrop-blur-xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex flex-col items-center">
        {/* Header Badge */}
        {result.isNewBest && (
          <div className="flex items-center gap-1.5 px-3 py-0.5 sm:py-1 rounded-full bg-amber-500/20 border border-amber-400/60 text-amber-300 text-[10px] sm:text-xs font-black tracking-widest uppercase mb-1.5 sm:mb-2 animate-pulse">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            NEW PERSONAL BEST!
          </div>
        )}

        <h1 className="font-bubble text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300 text-center mb-0.5 sm:mb-1">
          {result.mode === 'SURVIVAL' ? 'SURVIVAL RUN OVER' : 'SESSION RESULTS'}
        </h1>

        <p className="text-slate-400 text-[10px] sm:text-xs md:text-sm font-medium mb-2 sm:mb-4 uppercase tracking-wider">
          Mode: {result.mode.replace('_', ' ')}
        </p>

        {/* Large Score Showcase */}
        <div className="w-full py-2.5 sm:py-4 md:py-6 px-4 sm:px-6 rounded-xl sm:rounded-2xl bg-gradient-to-b from-slate-800/80 to-slate-900/90 border border-cyan-500/30 flex flex-col items-center mb-2 sm:mb-4 shadow-inner">
          <span className="text-[10px] sm:text-xs md:text-sm font-bold text-cyan-400 tracking-widest uppercase mb-0.5">
            {result.mode === 'ZEN' ? 'TOTAL MATCHES' : 'FINAL SCORE'}
          </span>
          <span className="font-bubble text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black text-white tracking-tight drop-shadow-[0_4px_12px_rgba(6,182,212,0.6)]">
            {result.mode === 'ZEN' ? result.correctCount : result.score}
          </span>
          {result.comboMax > 2 && (
            <div className="flex items-center gap-1 mt-1 text-amber-400 text-[11px] sm:text-xs font-bold font-bubble">
              <Flame className="w-3 h-3 fill-current" />
              Highest Combo: x{result.comboMax}
            </div>
          )}
        </div>

        {/* Statistics Grid: 2-col portrait mobile, 5-col landscape & desktop */}
        <div className="grid grid-cols-2 landscape:grid-cols-5 sm:grid-cols-3 lg:grid-cols-5 gap-1.5 sm:gap-2.5 md:gap-3 w-full mb-2 sm:mb-4">
          <div className="bg-slate-800/50 border border-slate-700/50 p-2 sm:p-3 rounded-lg sm:rounded-xl flex flex-col items-center text-center">
            <div className="flex items-center gap-1 text-emerald-400 text-[10px] sm:text-xs font-bold mb-0.5">
              <CheckCircle className="w-3 h-3" />
              Correct
            </div>
            <span className="font-bubble text-lg sm:text-2xl font-bold text-white">
              {result.correctCount}
            </span>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 p-2 sm:p-3 rounded-lg sm:rounded-xl flex flex-col items-center text-center">
            <div className="flex items-center gap-1 text-rose-400 text-[10px] sm:text-xs font-bold mb-0.5">
              <XCircle className="w-3 h-3" />
              Incorrect
            </div>
            <span className="font-bubble text-lg sm:text-2xl font-bold text-white">
              {result.incorrectCount}
            </span>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 p-2 sm:p-3 rounded-lg sm:rounded-xl flex flex-col items-center text-center">
            <div className="flex items-center gap-1 text-amber-400 text-[10px] sm:text-xs font-bold mb-0.5">
              <AlertCircle className="w-3 h-3" />
              Missed
            </div>
            <span className="font-bubble text-lg sm:text-2xl font-bold text-white">
              {result.missedCount}
            </span>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 p-2 sm:p-3 rounded-lg sm:rounded-xl flex flex-col items-center text-center">
            <span className="text-slate-400 text-[10px] sm:text-xs font-bold mb-0.5">Accuracy</span>
            <span className="font-bubble text-lg sm:text-2xl font-bold text-cyan-300">
              {result.accuracy}%
            </span>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 p-2 sm:p-3 rounded-lg sm:rounded-xl flex flex-col items-center text-center col-span-2 landscape:col-span-1 sm:col-span-1">
            <div className="flex items-center gap-1 text-sky-400 text-[10px] sm:text-xs font-bold mb-0.5">
              <Clock className="w-3 h-3" />
              {result.mode === 'SURVIVAL' ? 'Time Survived' : 'Session Time'}
            </div>
            <span className="font-bubble text-lg sm:text-2xl font-bold text-white font-mono">
              {formatTime(result.survivalTime)}
            </span>
          </div>
        </div>

        {/* Mode-Specific High Score Record Banner */}
        <div className="w-full py-1.5 sm:py-2.5 px-3 sm:px-4 rounded-lg sm:rounded-xl bg-slate-800/60 border border-slate-700/40 text-[10px] sm:text-xs md:text-sm flex items-center justify-between text-slate-300 mb-2.5 sm:mb-4 font-medium">
          <span>All-time Best in {result.mode.replace('_', ' ')}:</span>
          <span className="font-bold text-amber-300 font-bubble text-xs sm:text-sm md:text-base">
            {result.mode === 'SURVIVAL'
              ? formatTime(stats.bestSurvivalTime)
              : result.mode === 'ZEN'
              ? `${stats.bestZenMatches} matches`
              : result.mode === 'FRENZY_BLITZ'
              ? `${stats.bestFrenzyScore} pts`
              : `${stats.highScoreStandard} pts`}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col landscape:flex-row sm:flex-row gap-2 sm:gap-3 justify-center">
          <button
            id="btn-results-play-again"
            type="button"
            onMouseEnter={() => soundEngine.playHover()}
            onClick={() => {
              soundEngine.playClick();
              onPlayAgain();
            }}
            className="flex-1 py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl sm:rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bubble text-sm sm:text-base md:text-lg font-bold shadow-[0_4px_20px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
            PLAY AGAIN
          </button>

          <button
            id="btn-results-change-mode"
            type="button"
            onMouseEnter={() => soundEngine.playHover()}
            onClick={() => {
              soundEngine.playClick();
              onChangeMode();
            }}
            className="py-2.5 sm:py-3 px-3.5 sm:px-5 rounded-xl sm:rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 font-bubble text-xs sm:text-sm md:text-base font-bold flex items-center justify-center gap-1.5 active:scale-98 transition-all cursor-pointer"
          >
            <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-400" />
            GAME MODES
          </button>

          <button
            id="btn-results-main-menu"
            type="button"
            onMouseEnter={() => soundEngine.playHover()}
            onClick={() => {
              soundEngine.playClick();
              onMainMenu();
            }}
            className="py-2.5 sm:py-3 px-3.5 sm:px-5 rounded-xl sm:rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-slate-300 font-bubble text-xs sm:text-sm md:text-base font-bold flex items-center justify-center gap-1.5 active:scale-98 transition-all hover:text-white cursor-pointer"
          >
            <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
            MAIN MENU
          </button>
        </div>
      </div>
    </div>
  );
};
