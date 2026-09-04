import React from 'react';
import { Heart, Pause, Volume2, VolumeX, Flame } from 'lucide-react';
import { GameMode } from '../types';

interface HUDProps {
  mode: GameMode;
  score: number;
  combo: number;
  timeRemaining: number; // for timed modes (Standard, Frenzy)
  survivalTime: number; // for Survival mode elapsed
  lives: number; // for Survival (0-3)
  onPause: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  matches?: number;
}

export const HUD: React.FC<HUDProps> = ({
  mode,
  score,
  combo,
  timeRemaining,
  survivalTime,
  lives,
  onPause,
  isMuted,
  onToggleMute,
  matches,
}) => {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const isLowTime = (mode === 'STANDARD' || mode === 'FRENZY_BLITZ') && timeRemaining <= 10;

  return (
    <div
      id="gameplay-hud"
      className="fixed top-0 left-0 right-0 z-30 pt-[max(0.5rem,env(safe-area-inset-top))] pb-1 px-3 sm:px-6 md:px-8 xl:px-12 flex items-center justify-between pointer-events-none select-none w-full"
    >
      {/* Top Left: Score / Matches & Combo */}
      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 pointer-events-auto">
        <div className="bg-slate-900/85 border border-slate-700/70 backdrop-blur-md px-2.5 sm:px-4 md:px-5 py-1 sm:py-1.5 md:py-2 rounded-2xl shadow-lg flex items-center gap-1.5 sm:gap-2">
          <span className="text-[9px] sm:text-xs md:text-sm font-bold uppercase tracking-wider text-slate-400">
            {mode === 'ZEN' ? 'Matches' : 'Score'}
          </span>
          <span className="font-bubble text-base sm:text-xl md:text-2xl xl:text-3xl font-black text-cyan-300 drop-shadow">
            {mode === 'ZEN' ? (matches !== undefined ? matches : score) : score}
          </span>
        </div>

        {combo > 1 && (
          <div className="flex items-center gap-1 bg-amber-500/20 border border-amber-400/50 px-2 sm:px-2.5 md:px-3 py-0.5 sm:py-1 md:py-1.5 rounded-xl animate-bounce backdrop-blur-md">
            <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-amber-400 fill-amber-400 shrink-0" />
            <span className="text-[11px] sm:text-xs md:text-sm font-black text-amber-300 font-bubble whitespace-nowrap">
              x{combo}
            </span>
          </div>
        )}
      </div>

      {/* Top Center: Timer or Elapsed */}
      <div className="pointer-events-auto mx-1">
        {mode === 'SURVIVAL' ? (
          <div className="bg-slate-900/85 border border-slate-700/70 backdrop-blur-md px-2.5 sm:px-4 md:px-6 py-1 sm:py-1.5 md:py-2 rounded-2xl shadow-lg flex items-center gap-1.5 sm:gap-2">
            <span className="text-[9px] sm:text-xs md:text-sm font-bold uppercase tracking-wider text-slate-400 hidden xs:inline">Survived</span>
            <span className="font-bubble text-base sm:text-xl md:text-2xl xl:text-3xl font-black text-emerald-300 font-mono">
              {formatTime(survivalTime)}
            </span>
          </div>
        ) : mode === 'ZEN' ? (
          <div className="bg-slate-900/85 border border-emerald-700/50 backdrop-blur-md px-2.5 sm:px-4 md:px-6 py-1 sm:py-1.5 md:py-2 rounded-2xl shadow-lg flex items-center gap-1.5 sm:gap-2">
            <span className="text-[9px] sm:text-xs md:text-sm font-bold uppercase tracking-wider text-emerald-400 hidden xs:inline">Practice</span>
            <span className="font-bubble text-base sm:text-xl md:text-2xl xl:text-3xl font-black text-emerald-300 font-mono">
              {formatTime(survivalTime)}
            </span>
          </div>
        ) : (
          <div
            className={`px-2.5 sm:px-4 md:px-6 py-1 sm:py-1.5 md:py-2 rounded-2xl shadow-lg flex items-center gap-1.5 sm:gap-2 border backdrop-blur-md transition-colors ${
              isLowTime
                ? 'bg-rose-950/85 border-rose-500 text-rose-300 animate-pulse'
                : 'bg-slate-900/85 border-slate-700/70 text-sky-300'
            }`}
          >
            <span className="text-[9px] sm:text-xs md:text-sm font-bold uppercase tracking-wider text-slate-400">
              Time
            </span>
            <span className="font-bubble text-base sm:text-xl md:text-2xl xl:text-3xl font-black font-mono">
              {timeRemaining}s
            </span>
          </div>
        )}
      </div>

      {/* Top Right: Lives + Controls */}
      <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2.5 pointer-events-auto">
        {mode === 'SURVIVAL' && (
          <div className="flex items-center gap-0.5 sm:gap-1 md:gap-1.5 bg-slate-900/85 border border-slate-700/70 backdrop-blur-md px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-2xl">
            {[1, 2, 3].map((heartIndex) => {
              const hasLife = heartIndex <= lives;
              return (
                <Heart
                  key={`heart-${heartIndex}`}
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 transition-all duration-300 ${
                    hasLife
                      ? 'text-rose-500 fill-rose-500 scale-100 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                      : 'text-slate-600 fill-slate-700/50 scale-75'
                  }`}
                />
              );
            })}
          </div>
        )}

        {/* Quick Sound Toggle */}
        <button
          id="btn-quick-mute"
          type="button"
          onClick={onToggleMute}
          aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-xl md:rounded-2xl bg-slate-900/85 hover:bg-slate-800 border border-slate-700/70 text-slate-300 hover:text-white transition-all shadow-md active:scale-95 flex items-center justify-center shrink-0"
        >
          {isMuted ? <VolumeX className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-rose-400" /> : <Volume2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-cyan-400" />}
        </button>

        {/* Pause Button */}
        <button
          id="btn-pause-game"
          type="button"
          onClick={onPause}
          aria-label="Pause Game"
          className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-xl md:rounded-2xl bg-slate-900/85 hover:bg-slate-800 border border-slate-700/70 text-slate-300 hover:text-white transition-all shadow-md active:scale-95 flex items-center justify-center shrink-0"
        >
          <Pause className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5" />
        </button>
      </div>
    </div>
  );
};
