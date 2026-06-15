import { storageGet, storageSet, syncCloudKey } from '../../platform/storage.js';

const MISTAKES_KEY = 'mistakes';
const STATS_KEY = 'stats';

export function loadMistakeNotebook(platform) {
  const data = storageGet(MISTAKES_KEY, { ids: [] });
  return data.ids || [];
}

export function saveMistakeNotebook(platform, ids) {
  const unique = [...new Set(ids)];
  storageSet(MISTAKES_KEY, { ids: unique, updatedAt: Date.now() });
  syncCloudKey(MISTAKES_KEY);
  return unique;
}

/**
 * @param {import('./scoring.js').Question[]} questions
 * @param {{ details: { questionId: string, correct: boolean }[] }} result
 */
export function addMistakesFromSession(platform, result) {
  const current = loadMistakeNotebook(platform);
  const wrong = result.details.filter((d) => !d.correct).map((d) => d.questionId);
  return saveMistakeNotebook(platform, [...current, ...wrong]);
}

export function loadStats(platform) {
  return storageGet(STATS_KEY, {
    examsTaken: 0,
    bestScore: 0,
    bestScoreAt: null,
    totalGold: 0,
    bestTreasureTier: null,
    history: [],
  });
}

const HISTORY_MAX = 20;

/**
 * @param {ReturnType<typeof loadStats>} stats
 * @param {{ total: number, mode?: string, timedOut?: boolean, finishedAt?: number }} result
 * @param {{ tier: string, gold: number }} reward
 */
export function recordQuestCompletion(stats, result, reward) {
  const entry = {
    questId: `h-${result.finishedAt || Date.now()}`,
    mode: result.mode || 'full',
    total: result.total,
    goldEarned: reward.gold,
    treasureTier: reward.tier,
    timedOut: !!result.timedOut,
    finishedAt: result.finishedAt || Date.now(),
  };

  stats.examsTaken = (stats.examsTaken || 0) + 1;
  stats.totalGold = (stats.totalGold || 0) + reward.gold;

  const newBest = !stats.bestScore || result.total > stats.bestScore;
  if (newBest) {
    stats.bestScore = result.total;
    stats.bestScoreAt = entry.finishedAt;
  }

  const tierRank = { bronze: 1, silver: 2, gold: 3, legendary: 4 };
  const prev = tierRank[stats.bestTreasureTier] || 0;
  const cur = tierRank[reward.tier] || 0;
  if (cur > prev) stats.bestTreasureTier = reward.tier;

  const history = Array.isArray(stats.history) ? stats.history : [];
  history.unshift(entry);
  stats.history = history.slice(0, HISTORY_MAX);

  return { stats, newBest };
}

export function saveStats(platform, stats) {
  storageSet(STATS_KEY, stats);
  syncCloudKey(STATS_KEY);
}
