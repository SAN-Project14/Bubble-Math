import { Difficulty } from '../types';

export interface GeneratedEquation {
  equation: string;
  answer: number;
  isCorrect: boolean;
  matchingTargetIndex?: number;
}

/**
 * Procedural math equation generator with difficulty scaling
 * and plausible distractor distribution.
 */

export function generateTargetNumber(difficulty: Difficulty, existingTargets: number[] = []): number {
  let min = 4;
  let max = 20;

  if (difficulty === 'NORMAL') {
    min = 6;
    max = 40;
  } else if (difficulty === 'HARD') {
    min = 8;
    max = 75;
  }

  let target: number;
  let attempts = 0;
  do {
    target = Math.floor(Math.random() * (max - min + 1)) + min;
    attempts++;
  } while (existingTargets.includes(target) && attempts < 20);

  return target;
}

export function generateEquationForTarget(
  target: number,
  shouldBeCorrect: boolean,
  difficulty: Difficulty
): GeneratedEquation {
  if (shouldBeCorrect) {
    const eq = buildCorrectEquation(target, difficulty);
    return {
      equation: eq,
      answer: target,
      isCorrect: true,
    };
  } else {
    // Generate a plausible distractor equation close to the target (+/- 1 to 4)
    let offset = Math.floor(Math.random() * 4) + 1;
    if (Math.random() < 0.5 && target - offset > 1) {
      offset = -offset;
    }
    const distractorTarget = Math.max(1, target + offset);
    const eq = buildCorrectEquation(distractorTarget, difficulty);
    return {
      equation: eq,
      answer: distractorTarget,
      isCorrect: false,
    };
  }
}

/**
 * Generate equation for Frenzy Blitz with 3 active targets.
 */
export function generateFrenzyEquation(
  targets: number[],
  shouldMatchAny: boolean,
  difficulty: Difficulty
): GeneratedEquation {
  if (shouldMatchAny && targets.length > 0) {
    const chosenIndex = Math.floor(Math.random() * targets.length);
    const chosenTarget = targets[chosenIndex];
    const eq = buildCorrectEquation(chosenTarget, difficulty);
    return {
      equation: eq,
      answer: chosenTarget,
      isCorrect: true,
      matchingTargetIndex: chosenIndex,
    };
  } else {
    // Generate an answer that matches NONE of the targets
    let candidate = generateTargetNumber(difficulty, targets);
    let attempts = 0;
    while (targets.includes(candidate) && attempts < 10) {
      candidate++;
      attempts++;
    }
    const eq = buildCorrectEquation(candidate, difficulty);
    return {
      equation: eq,
      answer: candidate,
      isCorrect: false,
      matchingTargetIndex: -1,
    };
  }
}

function buildCorrectEquation(value: number, difficulty: Difficulty): string {
  // Determine allowed operations based on difficulty and value
  const ops: ('+' | '-' | '×' | '÷')[] = ['+', '-'];

  if (difficulty === 'NORMAL') {
    ops.push('×');
    if (value > 2) ops.push('÷');
  } else if (difficulty === 'HARD') {
    ops.push('×', '×', '÷');
  }

  // Filter valid operations for this specific number
  const validOps: ('+' | '-' | '×' | '÷')[] = [];

  // Addition is always valid if value >= 2
  if (value >= 2) validOps.push('+');
  // Subtraction is always valid
  validOps.push('-');

  // Check if multiplication can form value with integers > 1
  const factors: number[] = [];
  for (let f = 2; f <= Math.min(12, Math.floor(Math.sqrt(value))); f++) {
    if (value % f === 0) {
      factors.push(f);
    }
  }
  if (factors.length > 0 && ops.includes('×')) {
    validOps.push('×');
  }

  // Division can always be formed: (value * d) ÷ d = value
  if (ops.includes('÷') && value <= 25) {
    validOps.push('÷');
  }

  const chosenOp = validOps[Math.floor(Math.random() * validOps.length)] || '+';

  switch (chosenOp) {
    case '+': {
      // a + b = value
      const a = Math.floor(Math.random() * (value - 1)) + 1;
      const b = value - a;
      return `${a} + ${b}`;
    }
    case '-': {
      // a - b = value => a = value + b
      let maxB = 10;
      if (difficulty === 'NORMAL') maxB = 20;
      if (difficulty === 'HARD') maxB = 30;

      const b = Math.floor(Math.random() * maxB) + 1;
      const a = value + b;
      return `${a} − ${b}`;
    }
    case '×': {
      if (factors.length > 0) {
        const f1 = factors[Math.floor(Math.random() * factors.length)];
        const f2 = value / f1;
        // Randomize order
        return Math.random() < 0.5 ? `${f1} × ${f2}` : `${f2} × ${f1}`;
      } else {
        // Fallback to addition
        const a = Math.floor(Math.random() * (value - 1)) + 1;
        return `${a} + ${value - a}`;
      }
    }
    case '÷': {
      // a ÷ b = value => a = value * b
      let maxDivisor = 4;
      if (difficulty === 'NORMAL') maxDivisor = 6;
      if (difficulty === 'HARD') maxDivisor = 8;

      const b = Math.floor(Math.random() * (maxDivisor - 1)) + 2;
      const a = value * b;
      return `${a} ÷ ${b}`;
    }
    default:
      return `${value} + 0`;
  }
}
