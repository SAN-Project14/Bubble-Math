import React from 'react';
import { Play, RotateCcw, Home } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface PauseOverlayProps {
  onResume: () => void;
  onRestart: () => void;
  onQuit: () => void;
}

export const PauseOverlay: React.FC<PauseOverlayProps> = ({ onResume, onRestart, onQuit }) => {
  return (
    <div
      id="pause-menu-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 select-none"
    >
      <div className="w-full max-w-sm bg-slate-900/90 border-2 border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-center flex flex-col items-center">
        <h2 className="font-bubble text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300 mb-2">
          GAME PAUSED
        </h2>
        <p className="text-slate-400 text-sm mb-8 font-medium">
          Take a breath! The bubbles are frozen.
        </p>

        <div className="w-full flex flex-col gap-3.5">
          <button
            id="btn-pause-resume"
            type="button"
            onMouseEnter={() => soundEngine.playHover()}
            onClick={() => {
              soundEngine.playClick();
              onResume();
            }}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bubble text-xl font-bold shadow-[0_4px_20px_rgba(6,182,212,0.4)] flex items-center justify-center gap-3 active:scale-98 transition-all"
          >
            <Play className="w-5 h-5 fill-current" />
            RESUME
          </button>

          <button
            id="btn-pause-restart"
            type="button"
            onMouseEnter={() => soundEngine.playHover()}
            onClick={() => {
              soundEngine.playClick();
              onRestart();
            }}
            className="w-full py-3 px-6 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 font-bubble text-lg font-bold flex items-center justify-center gap-3 active:scale-98 transition-all"
          >
            <RotateCcw className="w-5 h-5 text-sky-400" />
            RESTART
          </button>

          <button
            id="btn-pause-quit"
            type="button"
            onMouseEnter={() => soundEngine.playHover()}
            onClick={() => {
              soundEngine.playClick();
              onQuit();
            }}
            className="w-full py-3 px-6 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-slate-300 font-bubble text-lg font-bold flex items-center justify-center gap-3 active:scale-98 transition-all hover:text-rose-300"
          >
            <Home className="w-5 h-5 text-rose-400" />
            QUIT TO MENU
          </button>
        </div>
      </div>
    </div>
  );
};
