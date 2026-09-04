import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameMode, Difficulty, BubbleEntity, FloatingFeedback, GameSessionResult, GameStatistics } from '../types';
import { soundEngine } from '../utils/audio';
import { generateTargetNumber, generateEquationForTarget, generateFrenzyEquation, GeneratedEquation } from '../utils/equationGenerator';
import { HUD } from './HUD';
import { TargetDisplay } from './TargetDisplay';
import { BubbleItem } from './BubbleItem';
import { PauseOverlay } from './PauseOverlay';

interface GameScreenProps {
  mode: GameMode;
  difficulty: Difficulty;
  reducedMotion?: boolean;
  onGameOver: (result: GameSessionResult) => void;
  onExitToMenu: () => void;
  stats: GameStatistics;
}

// Device metrics and safe arena calculations
function getDeviceMetrics(width: number, height: number, mode: GameMode) {
  const isLandscape = width > height;
  const isMobileLandscape = isLandscape && height <= 520;
  const isMobilePortrait = !isLandscape && width <= 480;
  const isTablet = (width <= 1024 && width > 480) || (height <= 1024 && height > 520 && !isMobilePortrait);

  let minSize: number;
  let maxSize: number;
  if (isMobileLandscape) {
    minSize = 68;
    maxSize = 78;
  } else if (isMobilePortrait) {
    minSize = 74;
    maxSize = 86;
  } else if (isTablet) {
    minSize = 84;
    maxSize = 98;
  } else {
    minSize = 92;
    maxSize = 110;
  }

  // Clearances in pixels for top HUD and bottom Target
  const hudHeightPx = isMobileLandscape ? 52 : isMobilePortrait ? 62 : 74;
  const targetHeightPx = isMobileLandscape
    ? (mode === 'FRENZY_BLITZ' ? 76 : 68)
    : isMobilePortrait
    ? (mode === 'FRENZY_BLITZ' ? 92 : 82)
    : (mode === 'FRENZY_BLITZ' ? 112 : 100);

  return {
    isMobileLandscape,
    isMobilePortrait,
    minSize,
    maxSize,
    hudHeightPx,
    targetHeightPx,
  };
}

function getSafeBounds(bubbleSize: number, width: number, height: number, mode: GameMode) {
  const { hudHeightPx, targetHeightPx } = getDeviceMetrics(width, height, mode);
  const r = bubbleSize / 2;
  const sidePad = width < 500 ? 10 : 20;

  const minXPx = r + sidePad;
  const maxXPx = width - (r + sidePad);

  const minYPx = hudHeightPx + r + 8;
  const maxYPx = height - (targetHeightPx + r + 8);

  const minX = Math.max(5, Math.min(30, (minXPx / width) * 100));
  const maxX = Math.max(70, Math.min(95, (maxXPx / width) * 100));

  const minY = Math.max(12, Math.min(35, (minYPx / height) * 100));
  const maxY = Math.max(65, Math.min(88, (maxYPx / height) * 100));

  return { minX, maxX, minY, maxY };
}

export const GameScreen: React.FC<GameScreenProps> = ({
  mode,
  difficulty,
  reducedMotion = false,
  onGameOver,
  onExitToMenu,
  stats,
}) => {
  // Game Play State
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [maxCombo, setMaxCombo] = useState(1);
  const [lives, setLives] = useState(3);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [survivalTime, setSurvivalTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [screenJitter, setScreenJitter] = useState(false);

  // Targets
  const [target, setTarget] = useState<number>(() => generateTargetNumber(difficulty));
  const [frenzyTargets, setFrenzyTargets] = useState<number[]>(() => {
    const t1 = generateTargetNumber(difficulty);
    const t2 = generateTargetNumber(difficulty, [t1]);
    const t3 = generateTargetNumber(difficulty, [t1, t2]);
    return [t1, t2, t3];
  });
  const [activeMatchedFrenzyIndex, setActiveMatchedFrenzyIndex] = useState<number | null>(null);

  // Bubbles & Feedback
  const [bubbles, setBubbles] = useState<BubbleEntity[]>([]);
  const [floatingFeedbacks, setFloatingFeedbacks] = useState<FloatingFeedback[]>([]);
  const [matches, setMatches] = useState(0);

  // Statistics counters
  const correctCountRef = useRef(0);
  const incorrectCountRef = useRef(0);
  const missedCountRef = useRef(0);

  // References to keep animation loop and interval clean
  const bubblesRef = useRef<BubbleEntity[]>([]);
  bubblesRef.current = bubbles;

  const animFrameIdRef = useRef<number | null>(null);
  const spawnTimerRef = useRef<number | null>(null);
  const clockIntervalRef = useRef<number | null>(null);
  const frenzyRefreshTimerRef = useRef<number | null>(null);
  const isGameOverRef = useRef(false);
  const isPausedRef = useRef(false);
  isPausedRef.current = isPaused;

  const targetRef = useRef(target);
  targetRef.current = target;
  const frenzyTargetsRef = useRef(frenzyTargets);
  frenzyTargetsRef.current = frenzyTargets;

  const survivalTimeRef = useRef(0);
  survivalTimeRef.current = survivalTime;

  // Viewport tracking for dynamic arena calculations
  const [viewport, setViewport] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });
  const viewportRef = useRef(viewport);
  viewportRef.current = viewport;

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setViewport({ width: w, height: h });
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // Lifespan definition: Normal mode (STANDARD) is 7000ms (7s); Zen is 10000ms; others remain 5000ms
  const bubbleLifespan = mode === 'STANDARD' ? 7000 : mode === 'ZEN' ? 10000 : 5000;

  // Background Music switch on mount
  useEffect(() => {
    if (mode === 'ZEN') {
      soundEngine.startMusic('zen');
    } else {
      soundEngine.startMusic('gameplay');
    }
    return () => {
      soundEngine.stopMusic();
    };
  }, [mode]);

  // End Game Handler
  const finishGame = useCallback(() => {
    if (isGameOverRef.current) return;
    isGameOverRef.current = true;

    soundEngine.playGameOver();

    // Calculate final stats
    const totalAnswers = correctCountRef.current + incorrectCountRef.current + missedCountRef.current;
    const accuracy = totalAnswers > 0 ? Math.round((correctCountRef.current / totalAnswers) * 100) : 0;

    const sessionResult: GameSessionResult = {
      mode,
      score,
      survivalTime: survivalTimeRef.current,
      correctCount: correctCountRef.current,
      incorrectCount: incorrectCountRef.current,
      missedCount: missedCountRef.current,
      accuracy,
      comboMax: maxCombo,
      livesUsed: mode === 'SURVIVAL' ? 3 - lives : undefined,
      isNewBest: false,
    };

    onGameOver(sessionResult);
  }, [mode, score, maxCombo, lives, onGameOver]);

  // Spawn a single bubble
  const spawnBubble = useCallback((forceCorrect?: boolean, targetOverride?: number) => {
    if (isGameOverRef.current || isPausedRef.current) return;

    const currentTarget = targetOverride !== undefined ? targetOverride : targetRef.current;

    // Determine correctness chance
    let shouldBeCorrect: boolean;
    if (forceCorrect !== undefined) {
      shouldBeCorrect = forceCorrect;
    } else if (mode === 'ZEN') {
      const activeCorrect = bubblesRef.current.filter(
        (b) => !b.isPopping && b.isCorrect && b.answer === currentTarget
      ).length;
      // In Zen mode, always guarantee at least 1 correct bubble is on screen for current target
      shouldBeCorrect = activeCorrect === 0 ? true : Math.random() < 0.65;
    } else {
      shouldBeCorrect = Math.random() < 0.6;
    }

    let eqData: GeneratedEquation;
    if (mode === 'FRENZY_BLITZ') {
      eqData = generateFrenzyEquation(frenzyTargetsRef.current, shouldBeCorrect, difficulty);
    } else {
      eqData = generateEquationForTarget(currentTarget, shouldBeCorrect, difficulty);
    }

    // Safe spawn area bounds dynamically calculated to avoid HUD and Target
    const metrics = getDeviceMetrics(viewportRef.current.width, viewportRef.current.height, mode);
    const size = Math.floor(Math.random() * (metrics.maxSize - metrics.minSize + 1)) + metrics.minSize;
    const bounds = getSafeBounds(size, viewportRef.current.width, viewportRef.current.height, mode);

    const innerPadX = Math.max(2, (bounds.maxX - bounds.minX) * 0.08);
    const innerPadY = Math.max(2, (bounds.maxY - bounds.minY) * 0.08);
    const minSpawnX = bounds.minX + innerPadX;
    const maxSpawnX = bounds.maxX - innerPadX;
    const minSpawnY = bounds.minY + innerPadY;
    const maxSpawnY = bounds.maxY - innerPadY;

    const x = Math.floor(minSpawnX + Math.random() * Math.max(1, maxSpawnX - minSpawnX));
    const y = Math.floor(minSpawnY + Math.random() * Math.max(1, maxSpawnY - minSpawnY));

    // Drift speed scaling
    let speedMult = 1;
    if (mode === 'SURVIVAL') {
      speedMult = 1 + Math.min(survivalTimeRef.current / 15, 6) * 0.18;
    } else if (mode === 'ZEN') {
      speedMult = 0.65; // Relaxed gentle floating for Zen
    } else if (difficulty === 'HARD') {
      speedMult = 1.3;
    }

    const vx = (Math.random() - 0.5) * 0.08 * speedMult;
    const vy = (Math.random() - 0.5) * 0.08 * speedMult;
    const colorIndex = Math.floor(Math.random() * 6);

    const newBubble: BubbleEntity = {
      id: `b-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      equation: eqData.equation,
      answer: eqData.answer,
      isCorrect: eqData.isCorrect,
      matchingTargetIndex: eqData.matchingTargetIndex,
      spawnTime: Date.now(),
      lifespan: bubbleLifespan,
      x,
      y,
      vx,
      vy,
      size,
      colorIndex,
      isWarning: false,
      isPopping: false,
      isWrongShake: false,
    };

    soundEngine.playBubbleSpawn();

    setBubbles((prev) => [...prev, newBubble]);
  }, [mode, difficulty, bubbleLifespan]);

  // Clamp existing bubbles on resize or orientation flip
  useEffect(() => {
    setBubbles((prev) =>
      prev.map((b) => {
        const bounds = getSafeBounds(b.size, viewport.width, viewport.height, mode);
        return {
          ...b,
          x: Math.max(bounds.minX, Math.min(bounds.maxX, b.x)),
          y: Math.max(bounds.minY, Math.min(bounds.maxY, b.y)),
        };
      })
    );
  }, [viewport.width, viewport.height, mode]);

  // Main game physics and lifespan update loop (requestAnimationFrame)
  useEffect(() => {
    let lastTime = performance.now();

    const updateLoop = (now: number) => {
      const dt = now - lastTime;
      lastTime = now;

      if (!isPausedRef.current && !isGameOverRef.current) {
        const currentTime = Date.now();

        setBubbles((currentBubbles) => {
          const nextBubbles: BubbleEntity[] = [];

          for (const b of currentBubbles) {
            if (b.isPopping) continue;

            const elapsed = currentTime - b.spawnTime;
            const remaining = b.lifespan - elapsed;

            // Check expiration
            if (remaining <= 0) {
              // Bubble expired naturally without click
              soundEngine.playBubblePop();

              // If it was a CORRECT bubble that player missed:
              if (b.isCorrect) {
                missedCountRef.current += 1;

                if (mode === 'SURVIVAL') {
                  soundEngine.playLifeLost();
                  setLives((prev) => {
                    const newLives = prev - 1;
                    if (newLives <= 0) {
                      setTimeout(() => finishGame(), 50);
                    }
                    return Math.max(0, newLives);
                  });
                } else if (mode === 'STANDARD') {
                  // Time penalty for missed correct bubble
                  setTimeRemaining((prev) => Math.max(0, prev - 3));
                } else if (mode === 'FRENZY_BLITZ') {
                  setTimeRemaining((prev) => Math.max(0, prev - 2));
                } else if (mode === 'ZEN') {
                  // In Zen mode: Relaxed practice, no penalty!
                  // If there are no other correct bubbles for the active target, spawn one immediately
                  setTimeout(() => {
                    const hasCorrect = bubblesRef.current.some(
                      (other) => other.id !== b.id && !other.isPopping && other.isCorrect && other.answer === targetRef.current
                    );
                    if (!hasCorrect) {
                      spawnBubble(true);
                    }
                  }, 80);
                }
              }
              continue; // Drop expired bubble
            }

            // Warning shake phase when remaining <= 850ms (or last 16%)
            const isWarningNow = remaining <= 850;
            if (isWarningNow && !b.isWarning) {
              soundEngine.playBubbleShake();
            }

            // Update position with dynamic bounds bounce
            let nx = b.x + b.vx * (dt / 16);
            let ny = b.y + b.vy * (dt / 16);
            let nvx = b.vx;
            let nvy = b.vy;

            const bounds = getSafeBounds(b.size, viewportRef.current.width, viewportRef.current.height, mode);

            // Horizontal bounds
            if (nx <= bounds.minX) {
              nx = bounds.minX;
              nvx = Math.abs(nvx);
            } else if (nx >= bounds.maxX) {
              nx = bounds.maxX;
              nvx = -Math.abs(nvx);
            }

            // Vertical bounds
            if (ny <= bounds.minY) {
              ny = bounds.minY;
              nvy = Math.abs(nvy);
            } else if (ny >= bounds.maxY) {
              ny = bounds.maxY;
              nvy = -Math.abs(nvy);
            }

            nextBubbles.push({
              ...b,
              x: nx,
              y: ny,
              vx: nvx,
              vy: nvy,
              isWarning: isWarningNow,
            });
          }

          return nextBubbles;
        });
      }

      animFrameIdRef.current = requestAnimationFrame(updateLoop);
    };

    animFrameIdRef.current = requestAnimationFrame(updateLoop);

    return () => {
      if (animFrameIdRef.current !== null) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [mode, finishGame]);

  // Bubble Spawning Timers & Waves
  useEffect(() => {
    const timers: number[] = [];

    if (mode === 'STANDARD') {
      // Normal Mode Timing:
      // 0 seconds: Initial bubble spawns
      spawnBubble(true);

      // Every 2 seconds: Another bubble spawns (bubbles stay 7s so multiple overlap)
      spawnTimerRef.current = window.setInterval(() => {
        if (isPausedRef.current || isGameOverRef.current) return;
        spawnBubble();
      }, 2000);
    } else {
      // Preserve other game modes' existing spawn waves and intervals
      timers.push(
        window.setTimeout(() => {
          spawnBubble(true); // Guaranteed correct answer for target
        }, 120)
      );

      timers.push(
        window.setTimeout(() => {
          spawnBubble(false); // Distractor
        }, 450)
      );

      timers.push(
        window.setTimeout(() => {
          spawnBubble(); // Additional equation
        }, 850)
      );

      if (mode === 'ZEN') {
        timers.push(
          window.setTimeout(() => {
            spawnBubble(true); // Extra correct equation for Zen richness
          }, 1250)
        );
      }

      const spawnIntervalMs = mode === 'ZEN' ? 3200 : mode === 'FRENZY_BLITZ' ? 2100 : 2700;

      spawnTimerRef.current = window.setInterval(() => {
        if (isPausedRef.current || isGameOverRef.current) return;

        // In Zen mode, maintain comfortable density without overcrowding
        if (mode === 'ZEN') {
          const activeCount = bubblesRef.current.filter((b) => !b.isPopping).length;
          if (activeCount >= 6) return;
        }

        spawnBubble();
      }, spawnIntervalMs);
    }

    return () => {
      timers.forEach((t) => clearTimeout(t));
      if (spawnTimerRef.current !== null) {
        clearInterval(spawnTimerRef.current);
        spawnTimerRef.current = null;
      }
    };
  }, [mode, difficulty, spawnBubble]);

  // Survival Mode Acceleration Timer (check every 15 seconds)
  useEffect(() => {
    if (mode !== 'SURVIVAL') return;

    const survCheck = window.setInterval(() => {
      if (isPausedRef.current || isGameOverRef.current) return;
      const speedBonus = Math.min(survivalTimeRef.current / 15, 6) * 220;
      const newInterval = Math.max(1400, 2700 - speedBonus);

      if (spawnTimerRef.current !== null) {
        clearInterval(spawnTimerRef.current);
      }
      spawnTimerRef.current = window.setInterval(() => {
        if (!isPausedRef.current && !isGameOverRef.current) {
          spawnBubble();
        }
      }, newInterval);
    }, 15000);

    return () => clearInterval(survCheck);
  }, [mode, spawnBubble]);

  // Periodic Frenzy Blitz Target Refresh (every 18 seconds)
  useEffect(() => {
    if (mode !== 'FRENZY_BLITZ') return;

    frenzyRefreshTimerRef.current = window.setInterval(() => {
      if (isPausedRef.current || isGameOverRef.current) return;
      soundEngine.playTargetRefresh();
      setFrenzyTargets(() => {
        const t1 = generateTargetNumber(difficulty);
        const t2 = generateTargetNumber(difficulty, [t1]);
        const t3 = generateTargetNumber(difficulty, [t1, t2]);
        return [t1, t2, t3];
      });
    }, 18000);

    return () => {
      if (frenzyRefreshTimerRef.current !== null) {
        clearInterval(frenzyRefreshTimerRef.current);
      }
    };
  }, [mode, difficulty]);

  // Main 1-second clock ticker (Handles 60s timer and Survival survivalTime counter)
  useEffect(() => {
    clockIntervalRef.current = window.setInterval(() => {
      if (isPausedRef.current || isGameOverRef.current) return;

      if (mode === 'SURVIVAL') {
        setSurvivalTime((prev) => prev + 1);
      } else if (mode === 'STANDARD' || mode === 'FRENZY_BLITZ') {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setTimeout(() => finishGame(), 50);
            return 0;
          }
          return prev - 1;
        });
      } else if (mode === 'ZEN') {
        setSurvivalTime((prev) => prev + 1);
      }
    }, 1000);

    return () => {
      if (clockIntervalRef.current !== null) {
        clearInterval(clockIntervalRef.current);
      }
    };
  }, [mode, finishGame]);

  // Add floating feedback popup
  const addFeedback = (x: number, y: number, text: string, type: 'correct' | 'wrong' | 'combo' | 'warning', scoreAdd?: number) => {
    const id = `fb-${Date.now()}-${Math.random()}`;
    setFloatingFeedbacks((prev) => [...prev, { id, x, y, text, type, scoreAdd }]);

    setTimeout(() => {
      setFloatingFeedbacks((prev) => prev.filter((f) => f.id !== id));
    }, 1100);
  };

  // Restart Game in place with clean state
  const restartCurrentGame = useCallback(() => {
    setIsPaused(false);
    setScore(0);
    setMatches(0);
    setCombo(1);
    setMaxCombo(1);
    setLives(3);
    setTimeRemaining(60);
    setSurvivalTime(0);
    survivalTimeRef.current = 0;
    setBubbles([]);
    bubblesRef.current = [];
    correctCountRef.current = 0;
    incorrectCountRef.current = 0;
    missedCountRef.current = 0;
    isGameOverRef.current = false;

    const newTarget = generateTargetNumber(difficulty);
    setTarget(newTarget);
    targetRef.current = newTarget;

    if (mode === 'FRENZY_BLITZ') {
      const t1 = generateTargetNumber(difficulty);
      const t2 = generateTargetNumber(difficulty, [t1]);
      const t3 = generateTargetNumber(difficulty, [t1, t2]);
      setFrenzyTargets([t1, t2, t3]);
      frenzyTargetsRef.current = [t1, t2, t3];
    }

    if (spawnTimerRef.current !== null) {
      clearInterval(spawnTimerRef.current);
      spawnTimerRef.current = null;
    }

    // Spawn fresh wave immediately
    if (mode === 'STANDARD') {
      spawnBubble(true, newTarget);
      spawnTimerRef.current = window.setInterval(() => {
        if (isPausedRef.current || isGameOverRef.current) return;
        spawnBubble();
      }, 2000);
    } else {
      setTimeout(() => spawnBubble(true, newTarget), 120);
      setTimeout(() => spawnBubble(false, newTarget), 450);
      setTimeout(() => spawnBubble(undefined, newTarget), 800);
      if (mode === 'ZEN') {
        setTimeout(() => spawnBubble(true, newTarget), 1200);
      }
      const spawnIntervalMs = mode === 'ZEN' ? 3200 : mode === 'FRENZY_BLITZ' ? 2100 : 2700;
      spawnTimerRef.current = window.setInterval(() => {
        if (isPausedRef.current || isGameOverRef.current) return;
        if (mode === 'ZEN') {
          const activeCount = bubblesRef.current.filter((b) => !b.isPopping).length;
          if (activeCount >= 6) return;
        }
        spawnBubble();
      }, spawnIntervalMs);
    }
  }, [difficulty, mode, spawnBubble]);

  // User taps/clicks a bubble
  const handlePopBubble = (bubble: BubbleEntity) => {
    if (isPaused || isGameOverRef.current || bubble.isPopping) return;

    let isActuallyCorrect = false;
    let matchedTargetIdx: number | null = null;

    if (mode === 'FRENZY_BLITZ') {
      // Check if equation answer equals ANY active frenzy target
      const idx = frenzyTargetsRef.current.indexOf(bubble.answer);
      if (idx !== -1) {
        isActuallyCorrect = true;
        matchedTargetIdx = idx;
      }
    } else {
      isActuallyCorrect = bubble.answer === targetRef.current;
    }

    if (isActuallyCorrect) {
      // ================= CORRECT POP =================
      soundEngine.playCorrect(combo);
      soundEngine.playBubblePop();
      correctCountRef.current += 1;
      setMatches((prev) => prev + 1);

      // Mark bubble as popping to animate burst
      setBubbles((prev) =>
        prev.map((b) => (b.id === bubble.id ? { ...b, isPopping: true } : b))
      );

      setTimeout(() => {
        setBubbles((prev) => prev.filter((b) => b.id !== bubble.id));
      }, 160);

      // Score calculation with combo multiplier
      const pointsEarned = 10 * combo;
      setScore((prev) => prev + pointsEarned);

      const newCombo = combo + 1;
      setCombo(newCombo);
      setMaxCombo((prev) => Math.max(prev, newCombo));

      const comboText = newCombo > 2 ? `+${pointsEarned} (x${newCombo} COMBO!)` : `+${pointsEarned}`;
      addFeedback(bubble.x, bubble.y, comboText, 'correct', pointsEarned);

      // Mode-specific reaction
      if (mode === 'SURVIVAL') {
        // Refresh target occasionally to keep variety high
        if (Math.random() < 0.6) {
          soundEngine.playTargetRefresh();
          setTarget(generateTargetNumber(difficulty));
        }
      } else if (mode === 'FRENZY_BLITZ' && matchedTargetIdx !== null) {
        // Flash target highlight and refresh the matched target slot
        setActiveMatchedFrenzyIndex(matchedTargetIdx);
        setTimeout(() => setActiveMatchedFrenzyIndex(null), 800);

        setFrenzyTargets((prev) => {
          const next = [...prev];
          next[matchedTargetIdx] = generateTargetNumber(difficulty, next);
          return next;
        });
      } else if (mode === 'STANDARD') {
        if (Math.random() < 0.5) {
          setTarget(generateTargetNumber(difficulty));
        }
      } else if (mode === 'ZEN') {
        // ZEN MODE CORRECT POP
        // 1. Advance to next target so practice stays dynamic and engaging
        const newTarget = generateTargetNumber(difficulty, [targetRef.current]);
        setTarget(newTarget);
        targetRef.current = newTarget;
        soundEngine.playTargetRefresh();

        // 2. Immediately spawn new bubbles corresponding to the new target
        setTimeout(() => {
          spawnBubble(true, newTarget);
        }, 120);

        setTimeout(() => {
          spawnBubble(false, newTarget);
        }, 500);
      }
    } else {
      // ================= INCORRECT POP =================
      soundEngine.playIncorrect();
      incorrectCountRef.current += 1;
      setCombo(1); // Reset combo

      // Screen jitter effect (only for non-zen modes)
      if (mode !== 'ZEN') {
        setScreenJitter(true);
        setTimeout(() => setScreenJitter(false), 350);
      }

      // Mark bubble with wrong shake
      setBubbles((prev) =>
        prev.map((b) => (b.id === bubble.id ? { ...b, isWrongShake: true } : b))
      );
      setTimeout(() => {
        setBubbles((prev) =>
          prev.map((b) => (b.id === bubble.id ? { ...b, isWrongShake: false } : b))
        );
      }, 350);

      addFeedback(bubble.x, bubble.y, `WRONG! (${bubble.equation} = ${bubble.answer})`, 'wrong');

      // Penalties by mode
      if (mode === 'SURVIVAL') {
        soundEngine.playLifeLost();
        setLives((prev) => {
          const newLives = prev - 1;
          if (newLives <= 0) {
            setTimeout(() => finishGame(), 50);
          }
          return Math.max(0, newLives);
        });
      } else if (mode === 'STANDARD') {
        // 5-second timer penalty
        setTimeRemaining((prev) => Math.max(0, prev - 5));
      } else if (mode === 'FRENZY_BLITZ') {
        // Score penalty and 3s time deduction
        setScore((prev) => Math.max(0, prev - 25));
        setTimeRemaining((prev) => Math.max(0, prev - 3));
      }
      // Zen mode has NO penalty!
    }
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.code === 'Space') {
        e.preventDefault();
        setIsPaused((prev) => !prev);
        soundEngine.playClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundEngine.setSettings(!nextMuted, !nextMuted);
  };

  return (
    <div
      id="gameplay-screen"
      className={`relative w-full h-full h-[100dvh] overflow-hidden select-none ${
        screenJitter && !reducedMotion ? 'animate-screen-jitter' : ''
      }`}
    >
      {/* HUD Header */}
      <HUD
        mode={mode}
        score={score}
        combo={combo}
        timeRemaining={timeRemaining}
        survivalTime={survivalTime}
        lives={lives}
        onPause={() => setIsPaused(true)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        matches={matches}
      />

      {/* Floating Equation Bubbles Field */}
      <div id="bubbles-field" className="absolute inset-0 pointer-events-auto">
        {bubbles.map((bubble) => (
          <BubbleItem
            key={bubble.id}
            bubble={bubble}
            onPop={handlePopBubble}
            reducedMotion={reducedMotion}
          />
        ))}

        {/* Floating Feedback Popups */}
        {floatingFeedbacks.map((fb) => (
          <div
            key={fb.id}
            style={{
              position: 'absolute',
              left: `${fb.x}%`,
              top: `${fb.y}%`,
              transform: 'translate(-50%, -100%)',
              zIndex: 40,
              pointerEvents: 'none',
            }}
            className={`font-bubble text-sm sm:text-base font-black px-3 py-1 rounded-full border shadow-xl backdrop-blur-md animate-bounce ${
              fb.type === 'correct'
                ? 'bg-emerald-500/90 text-slate-950 border-emerald-300 shadow-emerald-500/50'
                : fb.type === 'wrong'
                ? 'bg-rose-500/90 text-white border-rose-300 shadow-rose-500/50'
                : 'bg-amber-500/90 text-slate-950 border-amber-300 shadow-amber-500/50'
            }`}
          >
            {fb.text}
          </div>
        ))}
      </div>

      {/* Bottom Target Display */}
      <TargetDisplay
        mode={mode}
        target={target}
        frenzyTargets={frenzyTargets}
        activeMatchTargetIndex={activeMatchedFrenzyIndex}
      />

      {/* Zen Mode Manual Finish Button */}
      {mode === 'ZEN' && (
        <button
          id="btn-zen-finish"
          type="button"
          onClick={finishGame}
          className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] right-[max(0.75rem,env(safe-area-inset-right))] z-40 py-1.5 sm:py-2 px-3 sm:px-4 rounded-xl bg-slate-800/85 hover:bg-slate-750 border border-slate-700/80 text-[11px] sm:text-xs font-bold text-slate-300 hover:text-white transition-all shadow-md active:scale-95 cursor-pointer"
        >
          Finish Practice
        </button>
      )}

      {/* Pause Overlay */}
      {isPaused && (
        <PauseOverlay
          onResume={() => setIsPaused(false)}
          onRestart={restartCurrentGame}
          onQuit={onExitToMenu}
        />
      )}
    </div>
  );
};
