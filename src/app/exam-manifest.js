/**
 * Deterministic manifest from quest + question set (stable per session).
 * @param {string} questId
 * @param {string[]} questionIds
 */
export function generateExamManifest(questId, questionIds) {
  const seed = hashString(`${questId}|${questionIds.join(',')}`);
  const examManifestCode = String(seed % 1_000_000).padStart(6, '0');
  const bucket = seed % 991;
  const treasureValueUsd = Math.round((1 + bucket * 0.1) * 10) / 10;
  return { examManifestCode, treasureValueUsd };
}

/** @param {number} valueB @param {'vi' | 'en'} lang */
export function formatTreasureUsdBillions(valueB, lang) {
  const n = Number(valueB).toFixed(1);
  return lang === 'vi' ? `$${n} tỷ` : `$${n}B`;
}

function hashString(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
