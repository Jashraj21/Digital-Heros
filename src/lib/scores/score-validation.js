import { SCORE_RULES } from '@/constants/draw';

/**
 * Validates a Stableford golf score entry according to PRD § 05
 * @param {Object} input
 * @param {number} input.score - Stableford score between 1 and 45
 * @param {string} input.playedAt - YYYY-MM-DD date string
 * @param {Array} existingScores - User's existing scores
 * @param {string} [editingScoreId] - ID of score being edited (if any)
 * @returns {{ isValid: boolean, error?: string }}
 */
export function validateScoreEntry(input, existingScores = [], editingScoreId = null) {
  const { score, playedAt } = input;

  if (score === undefined || score === null || isNaN(Number(score))) {
    return { isValid: false, error: 'Please enter a valid numerical score.' };
  }

  const numericScore = Number(score);
  if (!Number.isInteger(numericScore)) {
    return { isValid: false, error: 'Stableford score must be a whole number.' };
  }

  if (numericScore < SCORE_RULES.MIN_SCORE || numericScore > SCORE_RULES.MAX_SCORE) {
    return {
      isValid: false,
      error: `Stableford score must be between ${SCORE_RULES.MIN_SCORE} and ${SCORE_RULES.MAX_SCORE}.`,
    };
  }

  if (!playedAt || typeof playedAt !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(playedAt)) {
    return { isValid: false, error: 'Please enter a valid date in YYYY-MM-DD format.' };
  }

  const playedDate = new Date(playedAt);
  if (isNaN(playedDate.getTime())) {
    return { isValid: false, error: 'Invalid date provided.' };
  }

  const today = new Date();
  today.setHours(23, 59, 59, 999);
  if (playedDate > today) {
    return { isValid: false, error: 'Score date cannot be in the future.' };
  }

  // Duplicate date check: Only one score entry is permitted per date (PRD § 05)
  const duplicate = existingScores.find((s) => {
    if (editingScoreId && s.id === editingScoreId) return false;
    return s.playedAt === playedAt;
  });

  if (duplicate) {
    return {
      isValid: false,
      error: `A score for ${playedAt} already exists. Only one score is permitted per date (edit or delete the existing entry).`,
    };
  }

  return { isValid: true };
}
