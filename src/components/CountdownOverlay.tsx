import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundEngine } from '../utils/audio';

interface CountdownOverlayProps {
  onComplete: () => void;
  reducedMotion?: boolean;
}

export const CountdownOverlay: React.FC<CountdownOverlayProps> = ({ onComplete, reducedMotion = false }) => {
  const [step, setStep] = useState<'3' | '2' | '1' | 'GO!' | 'DONE'>('3');

  useEffect(() => {
    soundEngine.playCountdown(false);

    const t1 = setTimeout(() => {
      setStep('2');
      soundEngine.playCountdown(false);
    }, 850);

    const t2 = setTimeout(() => {
      setStep('1');
      soundEngine.playCountdown(false);
    }, 1700);

    const t3 = setTimeout(() => {
      setStep('GO!');
      soundEngine.playCountdown(true);
    }, 2550);

    const t4 = setTimeout(() => {
      setStep('DONE');
      onComplete();
    }, 3350);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  if (step === 'DONE') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm select-none pointer-events-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ scale: 0.2, opacity: 0, rotate: -15 }}
          animate={{ scale: 1.25, opacity: 1, rotate: 0 }}
          exit={{ scale: 1.8, opacity: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="flex flex-col items-center justify-center"
        >
          <span
            className={`font-bubble text-8xl sm:text-9xl font-black drop-shadow-[0_10px_35px_rgba(0,0,0,0.9)] tracking-tight ${
              step === 'GO!'
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300'
                : 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300'
            }`}
          >
            {step}
          </span>
          <span className="text-slate-300 font-semibold tracking-widest text-sm uppercase mt-4">
            Get Ready to Pop!
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
