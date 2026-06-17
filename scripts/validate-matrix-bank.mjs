#!/usr/bin/env node
/**
 * Validate matrix bank: each slot has questions matching part/topic/difficulty.
 * Usage: node scripts/validate-matrix-bank.mjs
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const matrix = JSON.parse(readFileSync(join(root, 'content/bank/matrix-764.json'), 'utf8'));
const bank = JSON.parse(readFileSync(join(root, 'content/bank/questions.json'), 'utf8'));

const slotByCode = Object.fromEntries(matrix.slots.map((s) => [s.slotCode, s]));
let errors = 0;
let warnings = 0;

const bySlot = {};
for (const q of bank.questions) {
  if (!q.matrixSlot) continue;
  if (!bySlot[q.matrixSlot]) bySlot[q.matrixSlot] = [];
  bySlot[q.matrixSlot].push(q);
}

for (const slot of matrix.slots) {
  const pool = bySlot[slot.slotCode] || [];
  if (!pool.length) {
    console.error(`[MISSING] ${slot.slotCode}: no questions in bank`);
    errors += 1;
    continue;
  }

  const approved = pool.filter((q) => q.status !== 'retired');
  if (!approved.length) {
    console.error(`[MISSING] ${slot.slotCode}: no approved questions`);
    errors += 1;
  } else {
    console.log(`[OK] ${slot.slotCode}: ${approved.length} question(s)`);
  }

  for (const q of approved) {
    if (q.part !== slot.part) {
      console.error(`[PART] ${q.id}: part ${q.part} ≠ slot ${slot.part}`);
      errors += 1;
    }
    if (q.topicCode !== slot.topicCode) {
      console.warn(`[TOPIC] ${q.id}: ${q.topicCode} ≠ ${slot.topicCode}`);
      warnings += 1;
    }
    if (q.difficulty !== slot.difficulty) {
      console.warn(`[DIFF] ${q.id}: ${q.difficulty} ≠ ${slot.difficulty}`);
      warnings += 1;
    }
    if (!q.explanationLong && !q.explanation) {
      console.warn(`[EXPL] ${q.id}: no explanation`);
      warnings += 1;
    }
    if (!q.mistakeFeedback) {
      console.warn(`[HINT] ${q.id}: no mistakeFeedback`);
      warnings += 1;
    }
  }
}

console.log(`\nDone — ${errors} error(s), ${warnings} warning(s).`);
if (errors) process.exit(1);
