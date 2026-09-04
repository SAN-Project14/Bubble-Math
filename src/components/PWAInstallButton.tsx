import React, { useState } from 'react';
import { Download, Sparkles, X, Share2, PlusSquare } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { soundEngine } from '../utils/audio';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // Do not render anything if already installed or running in standalone mode
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        id="btn-pwa-install"
        type="button"
        onMouseEnter={() => soundEngine.playHover()}
        onClick={() => {
          soundEngine.playClick();
          install();
        }}
        className="w-full py-2 sm:py-2.5 px-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 hover:from-emerald-500/30 hover:to-cyan-500/30 border border-emerald-400/40 hover:border-emerald-300 text-emerald-300 hover:text-emerald-200 font-bubble text-xs sm:text-sm font-bold shadow-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.98]"
        title="Install Bubble Math on your device"
      >
        <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0 animate-bounce" />
        <span>INSTALL BUBBLE MATH APP</span>
        <Sparkles className="w-3 h-3 text-emerald-300 shrink-0" />
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          id="btn-pwa-install-ios"
          type="button"
          onMouseEnter={() => soundEngine.playHover()}
          onClick={() => {
            soundEngine.playClick();
            setShowIOSGuide(true);
          }}
          className="w-full py-1.5 sm:py-2 px-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-700/60 text-slate-300 hover:text-white font-bubble text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <Download className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <span>INSTALL ON IPHONE / IPAD</span>
        </button>

        {showIOSGuide && (
          <div
            id="pwa-ios-guide-modal"
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 select-none"
            onClick={() => setShowIOSGuide(false)}
          >
            <div
              className="w-full max-w-sm rounded-3xl bg-slate-900 border-2 border-slate-700 p-6 shadow-2xl text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bubble text-lg font-bold text-white flex items-center gap-2">
                  <Download className="w-5 h-5 text-emerald-400" />
                  Install Bubble Math
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-sm text-slate-300 font-medium">
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                  <Share2 className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Step 1:</strong> Tap the <strong>Share</strong> button in Safari toolbar.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                  <PlusSquare className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Step 2:</strong> Scroll down and choose <strong className="text-emerald-300">Add to Home Screen</strong>.
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bubble text-sm font-bold transition"
              >
                GOT IT
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
