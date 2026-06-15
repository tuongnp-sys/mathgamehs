/**
 * @param {import('./scoring.js').Question} q
 * @param {Record<string, unknown>} answers
 */
export function isQuestionAnswered(q, answers) {
  const raw = answers[q.id];
  if (raw == null || raw === '') return false;
  if (q.part === 2 && typeof raw === 'object') {
    const subs = q.subItems || [];
    if (!subs.length) return Object.keys(raw).length > 0;
    return subs.every((s) => raw[s.label] === true || raw[s.label] === false);
  }
  if (q.part === 3) return String(raw).trim() !== '';
  return true;
}

/** @param {import('./scoring.js').Question[]} questions @param {Record<string, unknown>} answers */
export function countAnswered(questions, answers) {
  return questions.filter((q) => isQuestionAnswered(q, answers)).length;
}
