import React from 'react';
import { ArrowLeft, Heart, Zap, Sparkles, Timer, Trophy } from 'lucide-react';
import { GameMode, GameStatistics } from '../types';
import { soundEngine } from '../utils/audio';

interface GameModeSelectProps {
  stats: GameStatistics;
  onSelectMode: (mode: GameMode) => void;
  onBack: () => void;
}

export const GameModeSelect: React.FC<GameModeSelectProps> = ({ stats, onSelectMode, onBack }) => {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSelect = (mode: GameMode) => {
    soundEngine.playModeSelect();
    onSelectMode(mode);
  };

  return (
    <div className="relative z-20 flex flex-col items-center justify-between w-full h-full h-[100dvh] overflow-y-auto no-scrollbar p-3 sm:p-5 md:p-6 xl:p-8 pt-[max(0.5rem,env(safe-area-inset-top))] pb-[max(0.5rem,env(safe-area-inset-bottom))] pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] max-w-full xl:max-w-7xl mx-auto select-none">
      {/* Header Bar */}
      <div className="w-full flex items-center justify-between mb-2 sm:mb-4 md:mb-6 max-w-full xl:max-w-6xl pt-1 sm:pt-0 shrink-0">
        <button
          id="btn-mode-back"
          type="button"
          onMouseEnter={() => soundEngine.playHover()}
          onClick={() => {
            soundEngine.playClick();
            onBack();
          }}
          className="flex items-center gap-1.5 sm:gap-2 py-1.5 sm:py-2 px-3 sm:px-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white font-bold text-xs sm:text-sm md:text-base transition-all shrink-0 active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
          Back
        </button>

        <div className="text-center px-2">
          <span className="text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-widest text-cyan-400 block">
            CHOOSE YOUR ADVENTURE
          </span>
          <h1 className="font-bubble text-xl sm:text-2xl md:text-3xl xl:text-4xl font-black text-white">
            GAME MODES
          </h1>
        </div>

        <div className="w-12 sm:w-16 md:w-20 shrink-0" /> {/* spacer */}
      </div>

      {/* Mode Grid: 1 col on small mobile portrait, 3 col on mobile landscape, tablet, and desktop */}
      <div className="flex-1 min-h-0 w-full max-w-full xl:max-w-6xl flex flex-col justify-center">
        <div className="grid grid-cols-1 landscape:grid-cols-3 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4 xl:gap-6 w-full mb-2 sm:mb-3 md:mb-4">
          {/* SURVIVAL */}
          <div
            id="card-mode-survival"
            onMouseEnter={() => soundEngine.playHover()}
            onClick={() => handleSelect('SURVIVAL')}
            className="group relative cursor-pointer rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-5 xl:p-6 bg-gradient-to-b from-rose-950/50 via-slate-900/90 to-slate-950/95 border-2 border-rose-500/40 hover:border-rose-400 transition-all duration-300 hover:-translate-y-1 shadow-[0_6px_20px_rgba(244,63,94,0.15)] hover:shadow-[0_10px_30px_rgba(244,63,94,0.3)] flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-1.5 sm:mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl sm:rounded-2xl bg-rose-500/20 border border-rose-400/50 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 fill-current" />
              </div>
              <div className="flex items-center gap-1 text-rose-400 text-[10px] sm:text-xs md:text-sm font-bold px-2 sm:px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30">
                3 Lives
              </div>
            </div>

            <div>
              <h2 className="font-bubble text-lg sm:text-xl md:text-2xl font-black text-white mb-0.5 group-hover:text-rose-300 transition-colors">
                SURVIVAL
              </h2>
              <p className="text-rose-300/80 text-[10px] sm:text-xs font-bold tracking-wide uppercase mb-1 sm:mb-2">
                “How long can you survive?”
              </p>
              <p className="text-slate-400 text-[11px] sm:text-xs md:text-sm leading-snug line-clamp-2 sm:line-clamp-3 mb-2 sm:mb-4">
                Equation bubbles spawn relentlessly. Speed increases every 15 seconds!
              </p>
            </div>

            <div className="pt-2 sm:pt-3 border-t border-rose-900/40 flex items-center justify-between">
              <div className="flex items-center gap-1 text-[11px] sm:text-xs md:text-sm text-slate-400">
                <Trophy className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
                <span>Best:</span>
                <span className="font-bold text-slate-200 font-mono">
                  {formatTime(stats.bestSurvivalTime)}
                </span>
              </div>
              <span className="font-bubble text-[11px] sm:text-xs md:text-sm font-bold text-rose-400 group-hover:translate-x-1 transition-transform">
                PLAY →
              </span>
            </div>
          </div>

          {/* FRENZY BLITZ */}
          <div
            id="card-mode-frenzy"
            onMouseEnter={() => soundEngine.playHover()}
            onClick={() => handleSelect('FRENZY_BLITZ')}
            className="group relative cursor-pointer rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-5 xl:p-6 bg-gradient-to-b from-cyan-950/50 via-slate-900/90 to-slate-950/95 border-2 border-cyan-500/40 hover:border-cyan-400 transition-all duration-300 hover:-translate-y-1 shadow-[0_6px_20px_rgba(6,182,212,0.15)] hover:shadow-[0_10px_30px_rgba(6,182,212,0.3)] flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-1.5 sm:mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl sm:rounded-2xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </div>
              <div className="flex items-center gap-1 text-cyan-400 text-[10px] sm:text-xs md:text-sm font-bold px-2 sm:px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30">
                3 Targets
              </div>
            </div>

            <div>
              <h2 className="font-bubble text-lg sm:text-xl md:text-2xl font-black text-white mb-0.5 group-hover:text-cyan-300 transition-colors">
                FRENZY BLITZ
              </h2>
              <p className="text-cyan-300/80 text-[10px] sm:text-xs font-bold tracking-wide uppercase mb-1 sm:mb-2">
                “Three targets. Total chaos.”
              </p>
              <p className="text-slate-400 text-[11px] sm:text-xs md:text-sm leading-snug line-clamp-2 sm:line-clamp-3 mb-2 sm:mb-4">
                Three target numbers simultaneously! Pop any bubble matching a target in 60s.
              </p>
            </div>

            <div className="pt-2 sm:pt-3 border-t border-cyan-900/40 flex items-center justify-between">
              <div className="flex items-center gap-1 text-[11px] sm:text-xs md:text-sm text-slate-400">
                <Trophy className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
                <span>Best:</span>
                <span className="font-bold text-slate-200">
                  {stats.bestFrenzyScore} pts
                </span>
              </div>
              <span className="font-bubble text-[11px] sm:text-xs md:text-sm font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
                PLAY →
              </span>
            </div>
          </div>

          {/* ZEN MODE */}
          <div
            id="card-mode-zen"
            onMouseEnter={() => soundEngine.playHover()}
            onClick={() => handleSelect('ZEN')}
            className="group relative cursor-pointer rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-5 xl:p-6 bg-gradient-to-b from-emerald-950/50 via-slate-900/90 to-slate-950/95 border-2 border-emerald-500/40 hover:border-emerald-400 transition-all duration-300 hover:-translate-y-1 shadow-[0_6px_20px_rgba(16,185,129,0.15)] hover:shadow-[0_10px_30px_rgba(16,185,129,0.3)] flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-1.5 sm:mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl sm:rounded-2xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </div>
              <div className="flex items-center gap-1 text-emerald-400 text-[10px] sm:text-xs md:text-sm font-bold px-2 sm:px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                No Penalties
              </div>
            </div>

            <div>
              <h2 className="font-bubble text-lg sm:text-xl md:text-2xl font-black text-white mb-0.5 group-hover:text-emerald-300 transition-colors">
                ZEN MODE
              </h2>
              <p className="text-emerald-300/80 text-[10px] sm:text-xs font-bold tracking-wide uppercase mb-1 sm:mb-2">
                “Relax. Think. Pop.”
              </p>
              <p className="text-slate-400 text-[11px] sm:text-xs md:text-sm leading-snug line-clamp-2 sm:line-clamp-3 mb-2 sm:mb-4">
                Serene 10-second lifespans, ambient chimes, and zero penalties.
              </p>
            </div>

            <div className="pt-2 sm:pt-3 border-t border-emerald-900/40 flex items-center justify-between">
              <div className="flex items-center gap-1 text-[11px] sm:text-xs md:text-sm text-slate-400">
                <Trophy className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
                <span>Best:</span>
                <span className="font-bold text-slate-200">
                  {stats.bestZenMatches} matches
                </span>
              </div>
              <span className="font-bubble text-[11px] sm:text-xs md:text-sm font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
                PLAY →
              </span>
            </div>
          </div>
        </div>

        {/* Classic 60s Timed Mode Banner */}
        <div
          id="card-mode-standard"
          onMouseEnter={() => soundEngine.playHover()}
          onClick={() => handleSelect('STANDARD')}
          className="w-full max-w-full xl:max-w-6xl p-2.5 sm:p-3.5 md:p-4 rounded-xl sm:rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-700/80 hover:border-sky-400 transition-all flex items-center justify-between cursor-pointer group shrink-0"
        >
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-transform shrink-0">
              <Timer className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h3 className="font-bubble text-sm sm:text-base md:text-lg font-bold text-white group-hover:text-sky-300 transition-colors">
                  CLASSIC STANDARD TIMED
                </h3>
                <span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-sky-400 bg-sky-500/10 px-1.5 py-0.2 rounded-full border border-sky-500/30">
                  60s
                </span>
              </div>
              <p className="text-slate-400 text-[10px] sm:text-xs md:text-sm line-clamp-1">
                Single target, 60-second arcade rush with time penalties on mistakes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="hidden xs:flex items-center gap-1 text-[10px] sm:text-xs md:text-sm text-slate-400">
              <Trophy className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
              <span>Best:</span>
              <span className="font-bold text-slate-200">{stats.highScoreStandard} pts</span>
            </div>
            <span className="font-bubble text-xs sm:text-sm font-bold text-sky-400 group-hover:translate-x-1 transition-transform">
              PLAY →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
