import seedQuestions from '../../content/bank/questions.json';
import matrixData from '../../content/bank/matrix-764.json';
import official20260116 from '../../content/bank/official/2026-0116.json';
import official20250101 from '../../content/bank/official/2025-0101.json';

const OFFICIAL = {
  'official-2026-0116': official20260116,
  'official-2025-0101': official20250101,
};

/** @typedef {import('./scoring.js').Question} Question */

/** @returns {Promise<{ questions: Question[], matrix: typeof matrixData, official: typeof OFFICIAL }>} */
export async function loadBank() {
  return {
    questions: [...seedQuestions.questions],
    matrix: matrixData,
    official: OFFICIAL,
  };
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickForSlot(questions, slotCode) {
  const pool = questions.filter((q) => q.matrixSlot === slotCode && q.status !== 'retired');
  if (!pool.length) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * @param {{ questions: Question[], matrix: typeof matrixData, official: typeof OFFICIAL }} bank
 * @param {string} mode
 */
export function buildExam(bank, mode) {
  if (mode.startsWith('official-')) {
    const pack = bank.official[mode];
    if (!pack) throw new Error(`Unknown official exam: ${mode}`);
    const questions = pack.questions.map((q) => ({ ...q, order: q.order }));
    return {
      mode,
      label: pack.title,
      examCode: pack.examCode,
      year: pack.year,
      questions,
    };
  }

  const { questions, matrix } = bank;
  let slots = matrix.slots;

  if (mode === 'practice-1') slots = slots.filter((s) => s.part === 1);
  else if (mode === 'practice-2') slots = slots.filter((s) => s.part === 2);
  else if (mode === 'practice-3') slots = slots.filter((s) => s.part === 3);
  else if (mode === 'full') slots = [...slots];

  const picked = [];
  const used = new Set();
  for (const slot of shuffle(slots)) {
    const q = pickForSlot(questions, slot.slotCode);
    if (q && !used.has(q.id)) {
      used.add(q.id);
      picked.push({ ...q, order: slot.order, slotLabel: slot.slotCode });
    }
  }

  picked.sort((a, b) => a.order - b.order);

  const labels = {
    full: { vi: 'Đề ma trận QĐ 764', en: 'QĐ 764 Matrix Exam' },
    'practice-1': { vi: 'Luyện Phần I', en: 'Part I Practice' },
    'practice-2': { vi: 'Luyện Phần II', en: 'Part II Practice' },
    'practice-3': { vi: 'Luyện Phần III', en: 'Part III Practice' },
    notebook: { vi: 'Sổ tay sửa sai', en: 'Mistake Notebook' },
  };

  return {
    mode,
    label: labels[mode] || { vi: mode, en: mode },
    questions: picked,
  };
}

