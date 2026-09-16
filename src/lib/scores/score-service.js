import { SCORE_RULES } from '@/constants/draw';
import { validateScoreEntry } from './score-validation';

/**
 * Sorts scores in reverse chronological order (most recent date first)
 * If dates are identical (not allowed in normal flow), ties broken by createdAt.
 * @param {Array} scores
 * @returns {Array}
 */
export function sortScoresReverseChronological(scores) {
  return [...scores].sort((a, b) => {
    const dateDiff = new Date(b.playedAt).getTime() - new Date(a.playedAt).getTime();
    if (dateDiff !== 0) return dateDiff;
    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
  });
}

/**
 * Processes a list of scores and tags the latest 5 as rolling active
 * PRD § 05: "Only the latest 5 scores are retained at any time. A new score replaces the oldest stored score automatically. Scores display in reverse chronological order (most recent first)."
 * @param {Array} allScores - Complete list of user scores
 * @returns {{ activeScores: Array, archivedScores: Array, allProcessedScores: Array }}
 */
export function computeRollingScores(allScores) {
  const sorted = sortScoresReverseChronological(allScores);
  const activeScores = sorted.slice(0, SCORE_RULES.REQUIRED_SCORE_COUNT).map((s) => ({
    ...s,
    isRollingActive: true,
  }));
  const archivedScores = sorted.slice(SCORE_RULES.REQUIRED_SCORE_COUNT).map((s) => ({
    ...s,
    isRollingActive: false,
  }));

  const allProcessedScores = [...activeScores, ...archivedScores];

  return {
    activeScores,
    archivedScores,
    allProcessedScores,
  };
}

/**
 * Calculates score metrics for summary view
 * @param {Array} activeScores - The rolling 5 active scores
 * @returns {Object}
 */
export function calculateScoreMetrics(activeScores = []) {
  if (!activeScores || activeScores.length === 0) {
    return {
      count: 0,
      averageScore: 0,
      bestScore: 0,
      isEligibleForDraw: false,
      numbersForDraw: [],
    };
  }

  const numericScores = activeScores.map((s) => Number(s.score));
  const sum = numericScores.reduce((acc, val) => acc + val, 0);
  const average = Number((sum / numericScores.length).toFixed(1));
  const best = Math.max(...numericScores);
  const isEligible = activeScores.length === SCORE_RULES.REQUIRED_SCORE_COUNT;

  return {
    count: activeScores.length,
    averageScore: average,
    bestScore: best,
    isEligibleForDraw: isEligible,
    numbersForDraw: numericScores,
  };
}

/**
 * Adds a new score and computes the resulting rolling active set
 * @param {Object} newScoreInput
 * @param {Array} currentScores
 * @returns {{ success: boolean, error?: string, scores?: Array, replacedScore?: Object }}
 */
export function addScoreWithRollingWindow(newScoreInput, currentScores = []) {
  const validation = validateScoreEntry(newScoreInput, currentScores);
  if (!validation.isValid) {
    return { success: false, error: validation.error };
  }

  const newEntry = {
    id: `score-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    score: Number(newScoreInput.score),
    playedAt: newScoreInput.playedAt,
    courseName: newScoreInput.courseName?.trim() || 'Local Course',
    notes: newScoreInput.notes?.trim() || '',
    createdAt: new Date().toISOString(),
  };

  const updatedRaw = [...currentScores, newEntry];
  const { activeScores, archivedScores, allProcessedScores } = computeRollingScores(updatedRaw);

  // Identify if any score was rolled out of the active 5
  let replacedScore = null;
  if (currentScores.length >= SCORE_RULES.REQUIRED_SCORE_COUNT) {
    const previousActive = computeRollingScores(currentScores).activeScores;
    const currentActiveIds = new Set(activeScores.map((s) => s.id));
    replacedScore = previousActive.find((s) => !currentActiveIds.has(s.id)) || null;
  }

  return {
    success: true,
    newScore: newEntry,
    activeScores,
    archivedScores,
    allScores: allProcessedScores,
    replacedScore,
  };
}
