#!/usr/bin/env node
/**
 * Smoke test: matrix bank pool sizes + buildExam randomization (no Vite).
 * Usage: node scripts/test-exam-bank.mjs
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const matrix = JSON.parse(readFileSync(join(root, 'content/bank/matrix-764.json'), 'utf8'));
const bankJson = JSON.parse(readFileSync(join(root, 'content/bank/questions.json'), 'utf8'));

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

function buildFullExam(questions) {
  const picked = [];
  const used = new Set();
  for (const slot of shuffle(matrix.slots)) {
    const q = pickForSlot(questions, slot.slotCode);
    if (q && !used.has(q.id)) {
      used.add(q.id);
      picked.push(q);
    }
  }
  return picked;
}

let failed = 0;

const bySlot = {};
for (const q of bankJson.questions) {
  if (!q.matrixSlot || q.status === 'retired') continue;
  if (!bySlot[q.matrixSlot]) bySlot[q.matrixSlot] = [];
  bySlot[q.matrixSlot].push(q.id);
}

console.log('--- Pool sizes ---');
for (const slot of matrix.slots) {
  const n = (bySlot[slot.slotCode] || []).length;
  const min = 9;
  const ok = n >= min;
  console.log(`${ok ? '[OK]' : '[FAIL]'} ${slot.slotCode}: ${n} (min ${min})`);
  if (!ok) failed += 1;
}

const batch3 = bankJson.questions.filter((q) => q.source === 'matrix-bank-v3-variant');
console.log(`\n--- Batch 3 ---\n[OK] ${batch3.length} questions (matrix-bank-v3-variant)`);
if (batch3.length !== 44) {
  console.error(`[FAIL] expected 44, got ${batch3.length}`);
  failed += 1;
}

const batch4 = bankJson.questions.filter((q) => q.source === 'matrix-bank-v4-variant');
console.log(`\n--- Batch 4 ---\n[OK] ${batch4.length} questions (matrix-bank-v4-variant)`);
if (batch4.length !== 44) {
  console.error(`[FAIL] expected 44 batch4 questions, got ${batch4.length}`);
  failed += 1;
}

const seen4 = new Set();
for (let i = 0; i < 50; i += 1) {
  for (const q of buildFullExam(bankJson.questions)) {
    if (q.source === 'matrix-bank-v4-variant') seen4.add(q.id);
  }
}
console.log(`\n--- Random full exam (50 runs, batch4) ---\n[OK] batch4 ids seen: ${seen4.size}/44`);
if (seen4.size < 15) {
  console.error('[FAIL] too few batch4 variants in random exams');
  failed += 1;
}

const seen = new Set();
for (let i = 0; i < 50; i += 1) {
  for (const q of buildFullExam(bankJson.questions)) {
    if (q.source === 'matrix-bank-v3-variant') seen.add(q.id);
  }
}
console.log(`\n--- Random full exam (50 runs) ---\n[OK] batch3 ids seen: ${seen.size}/44`);
if (seen.size < 15) {
  console.error('[FAIL] too few batch3 variants in random exams');
  failed += 1;
}

const exam = buildFullExam(bankJson.questions);
if (exam.length !== 22) {
  console.error(`[FAIL] full exam has ${exam.length} questions, expected 22`);
  failed += 1;
} else {
  console.log('[OK] full exam builds 22 questions');
}

const parts = { 1: 0, 2: 0, 3: 0 };
for (const q of exam) parts[q.part] += 1;
if (parts[1] === 12 && parts[2] === 4 && parts[3] === 6) {
  console.log(`[OK] parts: I=${parts[1]}, II=${parts[2]}, III=${parts[3]}`);
} else {
  console.error(`[FAIL] parts I=${parts[1]} II=${parts[2]} III=${parts[3]}`);
  failed += 1;
}

console.log(failed ? `\nFAILED (${failed} checks)` : '\nAll checks passed.');
process.exit(failed ? 1 : 0);
