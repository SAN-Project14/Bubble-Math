import React, { useState } from 'react';
import { Volume2, VolumeX, Music, Zap, Trash2, X, AlertTriangle } from 'lucide-react';
import { GameSettings, Difficulty } from '../types';
import { soundEngine } from '../utils/audio';
import { PWAInstallButton } from './PWAInstallButton';

interface SettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onResetData: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onResetData,
  onClose,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const toggleMusic = () => {
    soundEngine.playClick();
    const updated = { ...settings, musicEnabled: !settings.musicEnabled };
    onUpdateSettings(updated);
    soundEngine.setSettings(updated.musicEnabled, updated.sfxEnabled, updated.musicVolume, updated.sfxVolume);
  };

  const toggleSfx = () => {
    soundEngine.playClick();
    const updated = { ...settings, sfxEnabled: !settings.sfxEnabled };
    onUpdateSettings(updated);
    soundEngine.setSettings(updated.musicEnabled, updated.sfxEnabled, updated.musicVolume, updated.sfxVolume);
  };

  const handleDifficulty = (diff: Difficulty) => {
    soundEngine.playClick();
    onUpdateSettings({ ...settings, difficulty: diff });
  };

  const toggleMotion = () => {
    soundEngine.playClick();
    onUpdateSettings({ ...settings, reducedMotion: !settings.reducedMotion });
  };

  const handleConfirmReset = () => {
    soundEngine.playClick();
    onResetData();
    setShowConfirmReset(false);
  };

  return (
    <div
      id="settings-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-4 md:p-6 select-none"
    >
      <div className="relative w-full max-w-md md:max-w-xl xl:max-w-2xl max-h-[92dvh] overflow-y-auto no-scrollbar overscroll-contain bg-slate-900/95 border-2 border-slate-700/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex flex-col">
        {/* Close Button */}
        <button
          id="btn-close-settings"
          type="button"
          onClick={() => {
            soundEngine.playClick();
            onClose();
          }}
          className="sticky sm:absolute top-0 right-0 self-end p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors z-10 cursor-pointer"
          aria-label="Close Settings"
        >
          <X className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        <h2 className="font-bubble text-2xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300 mb-3 sm:mb-5">
          SETTINGS
        </h2>

        {/* Audio Section */}
        <div className="flex flex-col gap-2.5 sm:gap-3.5 mb-3 sm:mb-5">
          <div className="flex items-center justify-between py-2 border-b border-slate-800">
            <div className="flex items-center gap-2.5 sm:gap-3.5">
              <Music className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 shrink-0" />
              <div>
                <div className="text-xs sm:text-sm md:text-base font-bold text-white">Music</div>
                <div className="text-[10px] sm:text-xs text-slate-400">Atmospheric synth grooves</div>
              </div>
            </div>
            <button
              id="toggle-music-btn"
              type="button"
              onClick={toggleMusic}
              className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                settings.musicEnabled
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {settings.musicEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-800">
            <div className="flex items-center gap-2.5 sm:gap-3.5">
              {settings.sfxEnabled ? (
                <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0" />
              ) : (
                <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 shrink-0" />
              )}
              <div>
                <div className="text-xs sm:text-sm md:text-base font-bold text-white">Sound Effects</div>
                <div className="text-[10px] sm:text-xs text-slate-400">Pops, chimes, and warnings</div>
              </div>
            </div>
            <button
              id="toggle-sfx-btn"
              type="button"
              onClick={toggleSfx}
              className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                settings.sfxEnabled
                  ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {settings.sfxEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Difficulty Section */}
        <div className="mb-3 sm:mb-5">
          <div className="text-xs sm:text-sm md:text-base font-bold text-white mb-0.5">Difficulty</div>
          <div className="text-[10px] sm:text-xs text-slate-400 mb-2 sm:mb-3">
            Affects equation operations and target value ranges
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {(['EASY', 'NORMAL', 'HARD'] as Difficulty[]).map((diff) => (
              <button
                key={diff}
                id={`btn-diff-${diff.toLowerCase()}`}
                type="button"
                onClick={() => handleDifficulty(diff)}
                className={`py-1.5 sm:py-2.5 px-2.5 sm:px-4 rounded-xl font-bubble text-xs sm:text-sm md:text-base font-bold transition-all border cursor-pointer ${
                  settings.difficulty === diff
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-400 shadow-md'
                    : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:bg-slate-800'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Animation Section */}
        <div className="flex items-center justify-between py-2 border-b border-slate-800 mb-3 sm:mb-5">
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0" />
            <div>
              <div className="text-xs sm:text-sm md:text-base font-bold text-white">Animations</div>
              <div className="text-[10px] sm:text-xs text-slate-400">Full wobbles or reduced motion</div>
            </div>
          </div>
          <button
            id="toggle-animation-btn"
            type="button"
            onClick={toggleMotion}
            className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              !settings.reducedMotion
                ? 'bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            {!settings.reducedMotion ? 'FULL' : 'REDUCED'}
          </button>
        </div>

        {/* PWA Install Button (if installable and not in standalone mode) */}
        <div className="pt-2">
          <PWAInstallButton />
        </div>

        {/* Reset Data Section */}
        <div className="pt-2">
          {!showConfirmReset ? (
            <button
              id="btn-reset-data-prompt"
              type="button"
              onClick={() => setShowConfirmReset(true)}
              className="w-full py-2.5 md:py-3 px-4 md:px-6 rounded-xl bg-slate-800/60 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-900/60 text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              Reset High Scores & Settings
            </button>
          ) : (
            <div className="p-4 md:p-5 rounded-2xl bg-rose-950/60 border border-rose-800/80 flex flex-col gap-3">
              <div className="flex items-start gap-2.5 text-rose-300 text-xs md:text-sm">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                <span>Are you sure? This will wipe all high scores, records, and preferences.</span>
              </div>
              <div className="flex items-center gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowConfirmReset(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs md:text-sm font-semibold hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="btn-confirm-reset-data"
                  type="button"
                  onClick={handleConfirmReset}
                  className="px-3.5 py-1.5 rounded-lg bg-rose-600 text-white text-xs md:text-sm font-bold hover:bg-rose-500 shadow-md cursor-pointer"
                >
                  Yes, Reset Everything
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
