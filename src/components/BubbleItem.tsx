import React from 'react';
import { motion } from 'motion/react';
import { BubbleEntity } from '../types';

interface BubbleItemProps {
  bubble: BubbleEntity;
  onPop: (bubble: BubbleEntity, e?: React.MouseEvent | React.TouchEvent) => void;
  reducedMotion?: boolean;
}

const THEME_STYLES = [
  // 0: Cyan / Sky
  {
    bg: 'from-cyan-400/35 via-sky-500/25 to-blue-600/40',
    border: 'border-cyan-300/60',
    shadow: 'shadow-[0_0_25px_rgba(34,211,238,0.35)]',
    text: 'text-white',
    rim: 'rgba(56, 189, 248, 0.9)',
    glow: 'rgba(34, 211, 238, 0.4)',
  },
  // 1: Candy Rose
  {
    bg: 'from-pink-400/35 via-rose-500/25 to-purple-600/40',
    border: 'border-pink-300/60',
    shadow: 'shadow-[0_0_25px_rgba(244,114,182,0.35)]',
    text: 'text-white',
    rim: 'rgba(251, 113, 133, 0.9)',
    glow: 'rgba(244, 114, 182, 0.4)',
  },
  // 2: Electric Violet
  {
    bg: 'from-violet-400/35 via-purple-500/25 to-indigo-600/40',
    border: 'border-violet-300/60',
    shadow: 'shadow-[0_0_25px_rgba(167,139,250,0.35)]',
    text: 'text-white',
    rim: 'rgba(192, 132, 252, 0.9)',
    glow: 'rgba(167, 139, 250, 0.4)',
  },
  // 3: Emerald Mint
  {
    bg: 'from-emerald-400/35 via-teal-500/25 to-green-600/40',
    border: 'border-emerald-300/60',
    shadow: 'shadow-[0_0_25px_rgba(52,211,153,0.35)]',
    text: 'text-white',
    rim: 'rgba(45, 212, 191, 0.9)',
    glow: 'rgba(52, 211, 153, 0.4)',
  },
  // 4: Sunset Amber
  {
    bg: 'from-amber-400/35 via-orange-500/25 to-red-600/40',
    border: 'border-amber-300/60',
    shadow: 'shadow-[0_0_25px_rgba(251,191,36,0.35)]',
    text: 'text-white',
    rim: 'rgba(251, 146, 60, 0.9)',
    glow: 'rgba(251, 191, 36, 0.4)',
  },
  // 5: Electric Indigo
  {
    bg: 'from-blue-400/35 via-indigo-500/25 to-sky-600/40',
    border: 'border-blue-300/60',
    shadow: 'shadow-[0_0_25px_rgba(96,165,250,0.35)]',
    text: 'text-white',
    rim: 'rgba(129, 140, 248, 0.9)',
    glow: 'rgba(96, 165, 250, 0.4)',
  },
];

export const BubbleItem: React.FC<BubbleItemProps> = ({ bubble, onPop, reducedMotion = false }) => {
  const theme = THEME_STYLES[bubble.colorIndex % THEME_STYLES.length];

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onPop(bubble, e);
  };

  const handleTouch = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onPop(bubble, e);
  };

  return (
    <div
      id={`bubble-${bubble.id}`}
      style={{
        position: 'absolute',
        left: `${bubble.x}%`,
        top: `${bubble.y}%`,
        width: `${bubble.size}px`,
        height: `${bubble.size}px`,
        transform: 'translate(-50%, -50%)',
        zIndex: 20,
        touchAction: 'none',
      }}
      className={`cursor-pointer transition-transform select-none ${
        bubble.isWarning && !reducedMotion ? 'animate-warning-shake' : ''
      } ${bubble.isWrongShake ? 'animate-screen-jitter' : ''}`}
      onClick={handleClick}
      onTouchStart={handleTouch}
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: bubble.isPopping ? 1.25 : 1,
          opacity: bubble.isPopping ? 0 : 1,
        }}
        transition={{
          duration: bubble.isPopping ? 0.15 : 0.35,
          ease: 'easeOut',
        }}
        whileHover={!reducedMotion ? { scale: 1.08 } : undefined}
        whileTap={{ scale: 0.92 }}
        className={`relative w-full h-full rounded-full flex items-center justify-center border-2 backdrop-blur-md bg-gradient-to-br ${theme.bg} ${theme.border} ${theme.shadow} ${
          !reducedMotion ? 'animate-bubble-wobble' : ''
        }`}
        style={{
          boxShadow: `inset -5px -5px 14px rgba(0,0,0,0.35), inset 4px 4px 14px rgba(255,255,255,0.7), 0 8px 24px ${theme.glow}`,
        }}
      >
        {/* Specular Highlight Gloss */}
        <div className="bubble-highlight opacity-90" />

        {/* Secondary Bottom Crescent Reflection */}
        <div 
          className="absolute bottom-2 right-4 w-1/3 h-1/6 rounded-full bg-white/25 blur-[1px] pointer-events-none transform -rotate-12"
        />

        {/* Equation Text */}
        <span
          className={`relative z-10 font-bold tracking-wide font-bubble drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ${theme.text} pointer-events-none whitespace-nowrap select-none text-center px-1.5`}
          style={{
            fontSize: bubble.size < 74 ? '0.92rem' : bubble.size < 86 ? '1.04rem' : bubble.size < 98 ? '1.2rem' : '1.36rem',
            textShadow: '0 2px 6px rgba(0,0,0,0.85), 0 0 10px rgba(255,255,255,0.3)',
          }}
        >
          {bubble.equation}
        </span>

        {/* Warning Indicator Ring */}
        {bubble.isWarning && (
          <div className="absolute inset-0 rounded-full border-2 border-amber-300/80 animate-ping pointer-events-none" />
        )}
      </motion.div>
    </div>
  );
};
