/**
 * Manages jackpot rollover state transitions between successive draws
 * @param {Array} drawHistory - Historical draws sorted chronologically
 * @returns {number} Current active jackpot rollover amount
 */
export function getCurrentJackpotRollover(drawHistory = []) {
  if (!drawHistory || drawHistory.length === 0) {
    return 0;
  }

  // Find the most recently completed/published draw
  const publishedDraws = drawHistory
    .filter((d) => d.status === 'published')
    .sort((a, b) => new Date(b.drawDate).getTime() - new Date(a.drawDate).getTime());

  if (publishedDraws.length === 0) {
    return 0;
  }

  const latestDraw = publishedDraws[0];
  return Number(latestDraw.jackpotCarriedForward) || 0;
}
