/**
 * @typedef {{ label: string, text: string, correct: boolean }} Option
 * @typedef {{ label: string, statement: string, isTrue: boolean, explanation?: string }} SubItem
 * @typedef {{
 *   id: string,
 *   part: 1|2|3,
 *   grade: number,
 *   topicCode: string,
 *   difficulty: string,
 *   matrixSlot: string,
 *   context?: string,
 *   stem: string,
 *   options?: Option[],
 *   subItems?: SubItem[],
 *   acceptedAnswers?: string[],
 *   tolerance?: number,
 *   explanation?: string,
 * }} Question
 */

/**
 * @param {{ questions: Question[] }} exam
 * @param {Record<string, unknown>} answers
 */
export function scoreExam(exam, answers) {
  let part1 = 0;
  let part2 = 0;
  let part3 = 0;
  const details = [];

  for (const q of exam.questions) {
    const raw = answers[q.id];
    if (q.part === 1) {
      const correct = q.options?.find((o) => o.correct)?.label;
      const ok = raw === correct;
      if (ok) part1 += 0.25;
      details.push({
        questionId: q.id,
        part: 1,
        correct: ok,
        points: ok ? 0.25 : 0,
        userAnswer: raw,
        correctAnswer: correct,
      });
    } else if (q.part === 2) {
      const subAns = /** @type {Record<string, boolean>} */ (raw || {});
      let correctCount = 0;
      for (const sub of q.subItems || []) {
        const user = subAns[sub.label];
        if (user === sub.isTrue) correctCount += 1;
      }
      const points = part2Points(correctCount);
      part2 += points;
      details.push({
        questionId: q.id,
        part: 2,
        correct: correctCount === 4,
        points,
        correctCount,
        userAnswer: subAns,
        subItems: q.subItems,
      });
    } else if (q.part === 3) {
      const ok = matchShortAnswer(raw, q);
      if (ok) part3 += 0.5;
      details.push({
        questionId: q.id,
        part: 3,
        correct: ok,
        points: ok ? 0.5 : 0,
        userAnswer: raw,
        correctAnswer: q.acceptedAnswers?.[0],
      });
    }
  }

  const total = roundScore(part1 + part2 + part3);
  return {
    part1: roundScore(part1),
    part2: roundScore(part2),
    part3: roundScore(part3),
    total,
    details,
  };
}

function part2Points(correctCount) {
  if (correctCount <= 0) return 0;
  if (correctCount === 1) return 0.1;
  if (correctCount === 2) return 0.25;
  if (correctCount === 3) return 0.5;
  return 1;
}

function roundScore(n) {
  return Math.round(n * 100) / 100;
}

/**
 * @param {unknown} raw
 * @param {Question} q
 */
function matchShortAnswer(raw, q) {
  if (raw == null || raw === '') return false;
  const userStr = String(raw).trim().replace(',', '.');
  const userNum = Number(userStr);
  const tolerance = q.tolerance ?? 0.01;

  for (const ans of q.acceptedAnswers || []) {
    const norm = String(ans).trim().replace(',', '.');
    if (norm === userStr) return true;
    const ref = Number(norm);
    if (!Number.isNaN(userNum) && !Number.isNaN(ref)) {
      if (Math.abs(userNum - ref) <= tolerance) return true;
    }
  }
  return false;
}

export { part2Points };
