import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameMode } from '../types';

interface TargetDisplayProps {
  mode: GameMode;
  target: number;
  frenzyTargets: number[];
  activeMatchTargetIndex?: number | null;
}

export const TargetDisplay: React.FC<TargetDisplayProps> = ({
  mode,
  target,
  frenzyTargets,
  activeMatchTargetIndex = null,
}) => {
  const isFrenzy = mode === 'FRENZY_BLITZ';

  return (
    <div
      id="target-container"
      className="fixed bottom-[max(0.5rem,env(safe-area-inset-bottom))] sm:bottom-3 md:bottom-5 xl:bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none w-full max-w-lg md:max-w-2xl xl:max-w-3xl px-3 sm:px-4 md:px-6"
    >
      {isFrenzy ? (
        <div className="w-full flex flex-col items-center">
          <div className="text-[10px] sm:text-xs md:text-sm font-extrabold uppercase tracking-wider sm:tracking-widest text-cyan-300 drop-shadow mb-1 md:mb-2 px-2.5 sm:px-3.5 py-0.5 md:py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 whitespace-nowrap">
            Frenzy Targets • Match Any
          </div>
          <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 xl:gap-8 w-full max-w-sm sm:max-w-md md:max-w-xl xl:max-w-2xl">
            {frenzyTargets.map((num, idx) => {
              const isMatched = activeMatchTargetIndex === idx;
              return (
                <div
                  key={`target-slot-${idx}`}
                  className="flex-1 min-w-0 max-w-[110px] sm:max-w-[130px] md:max-w-[160px] xl:max-w-[180px] flex flex-col items-center"
                >
                  <div
                    className={`w-full py-1.5 sm:py-2.5 md:py-3.5 px-2 sm:px-3 md:px-5 rounded-2xl md:rounded-3xl flex flex-col items-center justify-center border-2 transition-all duration-200 backdrop-blur-md ${
                      isMatched
                        ? 'bg-emerald-500/30 border-emerald-400 shadow-[0_0_25px_rgba(52,211,153,0.6)] scale-105'
                        : idx === 0
                        ? 'bg-cyan-950/75 border-cyan-400/50 shadow-[0_4px_16px_rgba(6,182,212,0.25)]'
                        : idx === 1
                        ? 'bg-violet-950/75 border-violet-400/50 shadow-[0_4px_16px_rgba(168,85,247,0.25)]'
                        : 'bg-amber-950/75 border-amber-400/50 shadow-[0_4px_16px_rgba(245,158,11,0.25)]'
                    }`}
                  >
                    <span className="text-[9px] sm:text-[11px] md:text-xs font-bold uppercase tracking-wider text-slate-300">
                      T{idx + 1}
                    </span>
                    <AnimatePresence mode="popLayout">
                      <motion.span
                        key={`val-${idx}-${num}`}
                        initial={{ scale: 0.6, y: 6, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.6, y: -6, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        className="font-bubble text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-extrabold text-white tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                      >
                        {num}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Single Large Centered Target for Standard, Survival, Zen */
        <div className="flex flex-col items-center">
          <div className="relative group">
            {/* Glow halo */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-500 opacity-60 blur-md animate-pulse" />
            
            <div className="relative px-5 sm:px-8 md:px-14 xl:px-18 py-1.5 sm:py-2.5 md:py-3.5 xl:py-4 rounded-3xl bg-slate-900/85 border-2 border-cyan-400/70 backdrop-blur-md shadow-[0_10px_35px_rgba(6,182,212,0.35)] flex flex-col items-center">
              <span className="text-[10px] sm:text-xs md:text-sm font-black tracking-wider sm:tracking-[0.2em] md:tracking-[0.25em] text-cyan-300 uppercase whitespace-nowrap">
                TARGET NUMBER
              </span>
              
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={`target-${target}`}
                  initial={{ scale: 0.7, y: 8, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0.7, y: -8, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                  className="font-bubble text-3xl sm:text-4xl md:text-6xl xl:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-400 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]"
                >
                  {target}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
