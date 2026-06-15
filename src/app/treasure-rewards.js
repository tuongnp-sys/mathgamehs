/**
 * @param {number} totalScore 0–10
 * @returns {{ tier: string, gold: number, stageBonus: number }}
 */
export function computeTreasureReward(totalScore) {
  const score = Math.max(0, Math.min(10, totalScore));
  let tier = 'bronze';
  if (score >= 9) tier = 'legendary';
  else if (score >= 7) tier = 'gold';
  else if (score >= 4) tier = 'silver';

  const baseGold = Math.floor(score * 100);
  const tierBonus = { bronze: 0, silver: 50, gold: 150, legendary: 300 }[tier] ?? 0;
  const stageBonus = 50 + 100 + 150;

  return {
    tier,
    gold: baseGold + tierBonus + stageBonus,
    stageBonus,
  };
}

/** @param {string} tier */
export function treasureTierIcon(tier) {
  const icons = {
    bronze: '📦',
    silver: '🥈',
    gold: '🏆',
    legendary: '💎',
  };
  return icons[tier] || '📦';
}
