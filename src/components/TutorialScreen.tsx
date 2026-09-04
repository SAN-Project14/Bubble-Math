import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, X, ShieldAlert, Sparkles, Target, Zap, Clock } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface TutorialScreenProps {
  onComplete: () => void;
}

export const TutorialScreen: React.FC<TutorialScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [demoPopped, setDemoPopped] = useState<boolean | null>(null);

  const totalSteps = 3;

  const handleNext = () => {
    soundEngine.playClick();
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    soundEngine.playClick();
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSkip = () => {
    soundEngine.playClick();
    onComplete();
  };

  const handlePracticePop = (isCorrect: boolean) => {
    if (isCorrect) {
      soundEngine.playCorrect(1);
      soundEngine.playBubblePop();
      setDemoPopped(true);
    } else {
      soundEngine.playIncorrect();
      setDemoPopped(false);
    }
  };

  return (
    <div className="relative z-20 flex flex-col items-center justify-center w-full h-full h-[100dvh] overflow-y-auto no-scrollbar overscroll-contain p-2 sm:p-4 md:p-6 xl:p-8 pt-[max(0.5rem,env(safe-area-inset-top))] pb-[max(0.5rem,env(safe-area-inset-bottom))] pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] max-w-2xl md:max-w-3xl xl:max-w-4xl mx-auto select-none">
      <div className="w-full my-auto bg-slate-900/85 border-2 border-slate-700/80 rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 md:p-8 backdrop-blur-xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-2 sm:mb-4 pb-2 sm:pb-3 border-b border-slate-800">
          <div>
            <span className="text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-widest text-cyan-400">
              TRAINING ACADEMY
            </span>
            <h1 className="font-bubble text-lg sm:text-2xl md:text-3xl font-black text-white">
              HOW TO PLAY
            </h1>
          </div>
          <button
            id="btn-skip-tutorial"
            type="button"
            onClick={handleSkip}
            className="px-2.5 sm:px-3.5 py-1 rounded-full text-xs md:text-sm font-bold text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-all shrink-0"
          >
            Skip Tutorial
          </button>
        </div>

        {/* Step Content */}
        <div className="min-h-0 flex flex-col justify-center">
          {step === 0 && (
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center mb-3 text-cyan-300">
                <Target className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <h2 className="font-bubble text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
                1. Look at the Target Number
              </h2>
              <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-xl mb-6">
                The number at the bottom is your <strong>target</strong>. Tap or click any floating bubble whose equation equals that target number!
              </p>

              {/* Visual Demo Box */}
              <div className="w-full max-w-md md:max-w-xl bg-slate-950/60 border border-slate-800 rounded-2xl p-4 md:p-6 flex flex-col items-center">
                <div className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Interactive Practice:
                </div>

                <div className="flex items-center justify-center gap-6 md:gap-10 mb-4">
                  {/* Correct Bubble Demo */}
                  <button
                    type="button"
                    onClick={() => handlePracticePop(true)}
                    className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-cyan-400/40 via-sky-500/30 to-blue-600/50 border-2 border-cyan-300/80 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <div className="bubble-highlight" />
                    <span className="font-bubble text-lg md:text-xl font-bold text-white">5 + 5</span>
                    <span className="text-[10px] md:text-xs text-emerald-300 font-bold flex items-center">
                      <Check className="w-3 h-3 md:w-3.5 md:h-3.5" /> = 10
                    </span>
                  </button>

                  {/* Incorrect Bubble Demo */}
                  <button
                    type="button"
                    onClick={() => handlePracticePop(false)}
                    className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-pink-400/30 via-rose-500/20 to-purple-600/40 border-2 border-rose-400/60 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <div className="bubble-highlight" />
                    <span className="font-bubble text-lg md:text-xl font-bold text-white">9 − 1</span>
                    <span className="text-[10px] md:text-xs text-rose-300 font-bold flex items-center">
                      <X className="w-3 h-3 md:w-3.5 md:h-3.5" /> = 8
                    </span>
                  </button>
                </div>

                {/* Target Demo Pill */}
                <div className="px-6 md:px-8 py-2 md:py-3 rounded-xl bg-slate-900 border-2 border-cyan-400/80 flex items-center gap-3">
                  <span className="text-xs md:text-sm font-bold uppercase text-cyan-300">Target</span>
                  <span className="font-bubble text-2xl md:text-3xl font-black text-white">10</span>
                </div>

                {demoPopped !== null && (
                  <div className={`mt-3 text-xs md:text-sm font-bold flex items-center gap-1.5 ${demoPopped ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {demoPopped ? <Sparkles className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                    {demoPopped ? 'Great job! 5 + 5 = 10 is CORRECT!' : 'Oops! 9 − 1 = 8 is INCORRECT for target 10.'}
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center mb-3 text-amber-300">
                <Clock className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <h2 className="font-bubble text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
                2. Lifespans & Warning Shakes
              </h2>
              <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-xl mb-6">
                Bubbles float for approximately <strong>5 seconds</strong> (10s in Zen Mode). Before a bubble pops on its own, it will <strong>shake rapidly</strong>!
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl text-left">
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 animate-warning-shake">
                    <Zap className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <div>
                    <div className="text-sm md:text-base font-bold text-white mb-1">Warning Shake</div>
                    <div className="text-xs md:text-sm text-slate-400 leading-relaxed">
                      In the final second, the bubble pulses and shakes to warn you it’s about to vanish.
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 shrink-0">
                    <ShieldAlert className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <div>
                    <div className="text-sm md:text-base font-bold text-white mb-1">Missed Bubble Penalties</div>
                    <div className="text-xs md:text-sm text-slate-400 leading-relaxed">
                      Letting a correct bubble expire untouched penalizes your timer or costs a life!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center mb-3 text-purple-300">
                <Sparkles className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <h2 className="font-bubble text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
                3. Choose Your Challenge
              </h2>
              <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-xl mb-6">
                Bubble Math features three unique game modes tuned for every playstyle:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 w-full max-w-3xl text-left">
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-rose-500/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Survival</span>
                      <span className="text-sm text-rose-400">♥♥♥</span>
                    </div>
                    <p className="text-xs md:text-sm text-slate-300 leading-relaxed">3 lives. Speed scales every 15s. Survive as long as you can!</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-cyan-500/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Frenzy Blitz</span>
                      <span className="text-xs font-bold text-cyan-300 font-bubble">3 Targets</span>
                    </div>
                    <p className="text-xs md:text-sm text-slate-300 leading-relaxed">Three targets at once! High-intensity chaotic 60-second rush.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-emerald-500/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Zen Mode</span>
                      <span className="text-xs font-bold text-emerald-300">Calm</span>
                    </div>
                    <p className="text-xs md:text-sm text-slate-300 leading-relaxed">Zero penalties. 10-second lifespans. Relax and learn at your own pace.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Step Indicator & Navigation */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={`dot-${i}`}
                className={`h-2 rounded-full transition-all ${
                  step === i ? 'w-8 bg-cyan-400' : 'w-2 bg-slate-700'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            {step > 0 && (
              <button
                id="btn-tut-back"
                type="button"
                onClick={handleBack}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-bold flex items-center gap-1.5 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            )}

            <button
              id="btn-tut-next"
              type="button"
              onClick={handleNext}
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bubble text-base font-bold shadow-md flex items-center gap-1.5 transition-all active:scale-98"
            >
              {step === totalSteps - 1 ? 'Start Popping!' : 'Next'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
