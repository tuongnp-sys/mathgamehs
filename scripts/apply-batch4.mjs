#!/usr/bin/env node
/**
 * Apply batch 4 (plan A): insert bank-*-b08, bank-*-b09 into questions.json and update slot metadata.
 * Usage: node scripts/apply-batch4.mjs
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { qid } from './batch-helpers.mjs';
import { buildBatch4, BATCH4_NOTES } from './batch4-data.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const matrix = JSON.parse(readFileSync(join(root, 'content/bank/matrix-764.json'), 'utf8'));
const slotMeta = Object.fromEntries(matrix.slots.map((s) => [s.slotCode, s]));
const BATCH4 = buildBatch4(slotMeta);

function anchorFor(slot) {
  return qid(slot, 7);
}

function insertAfter(questions, afterId, newQs) {
  const idx = questions.findIndex((q) => q.id === afterId);
  if (idx === -1) throw new Error(`Anchor not found: ${afterId}`);
  questions.splice(idx + 1, 0, ...newQs);
}

function updateSlots() {
  const slotsDir = join(root, 'content/bank/slots');
  const bySlot = {};
  for (const q of BATCH4) {
    if (!bySlot[q.matrixSlot]) bySlot[q.matrixSlot] = [];
    bySlot[q.matrixSlot].push(q.id);
  }
  for (const file of readdirSync(slotsDir).filter((f) => f.endsWith('.json'))) {
    const path = join(slotsDir, file);
    const slot = JSON.parse(readFileSync(path, 'utf8'));
    const added = bySlot[slot.slotCode];
    if (!added) continue;
    if (slot.batch4?.added?.every((id) => slot.bankQuestionIds.includes(id))) {
      console.log(`[skip slot] ${slot.slotCode}: batch4 already in bankQuestionIds`);
      continue;
    }
    const merged = [...new Set([...slot.bankQuestionIds, ...added])];
    slot.bankQuestionIds = merged;
    slot.batch4 = {
      added,
      notes: Object.fromEntries(added.map((id) => [id, BATCH4_NOTES[id] ?? 'batch4 variant'])),
    };
    slot.status = 'enriched';
    writeFileSync(path, `${JSON.stringify(slot, null, 2)}\n`, 'utf8');
    console.log(`[slot] ${slot.slotCode}: +${added.length}`);
  }
}

const bankPath = join(root, 'content/bank/questions.json');
const bank = JSON.parse(readFileSync(bankPath, 'utf8'));

const bySlotInsert = {};
for (const q of BATCH4) {
  if (!bySlotInsert[q.matrixSlot]) bySlotInsert[q.matrixSlot] = [];
  bySlotInsert[q.matrixSlot].push(q);
}

let inserted = 0;
for (const slot of Object.keys(bySlotInsert)) {
  const anchor = anchorFor(slot);
  const existing = bank.questions.some((q) => bySlotInsert[slot].some((n) => n.id === q.id));
  if (existing) {
    console.log(`[skip] ${slot}: batch4 already present`);
    continue;
  }
  insertAfter(bank.questions, anchor, bySlotInsert[slot]);
  console.log(`[insert] ${slot}: ${bySlotInsert[slot].map((q) => q.id).join(', ')} after ${anchor}`);
  inserted += bySlotInsert[slot].length;
}

if (inserted) {
  writeFileSync(bankPath, `${JSON.stringify(bank, null, 2)}\n`, 'utf8');
}
updateSlots();
console.log(`\nDone — ${inserted || 'no new'} question(s) in batch 4 (${BATCH4.length} total defined).`);
