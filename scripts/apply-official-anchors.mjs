#!/usr/bin/env node
/**
 * Map official exam questions to matrix slots (by topic) and add anchor bank items (b10).
 * Usage: node scripts/apply-official-anchors.mjs
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { qid } from './batch-helpers.mjs';
import { OFFICIAL_SLOT_REFS, buildOfficialAnchors } from './official-anchor-data.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const matrix = JSON.parse(readFileSync(join(root, 'content/bank/matrix-764.json'), 'utf8'));
const slotMeta = Object.fromEntries(matrix.slots.map((s) => [s.slotCode, s]));
const ANCHORS = buildOfficialAnchors(slotMeta);

function anchorFor(slot) {
  return qid(slot, 9);
}

function insertAfter(questions, afterId, newQs) {
  const idx = questions.findIndex((q) => q.id === afterId);
  if (idx === -1) throw new Error(`Anchor not found: ${afterId}`);
  questions.splice(idx + 1, 0, ...newQs);
}

function updateSlots() {
  const slotsDir = join(root, 'content/bank/slots');
  const bySlot = {};
  for (const q of ANCHORS) {
    if (!bySlot[q.matrixSlot]) bySlot[q.matrixSlot] = [];
    bySlot[q.matrixSlot].push(q.id);
  }

  for (const slotCode of Object.keys(OFFICIAL_SLOT_REFS)) {
    const path = join(slotsDir, `${slotCode}.json`);
    const slot = JSON.parse(readFileSync(path, 'utf8'));
    slot.officialReferences = OFFICIAL_SLOT_REFS[slotCode];

    const added = bySlot[slotCode] || [];
    if (added.length) {
      for (const id of added) {
        if (!slot.bankQuestionIds.includes(id)) slot.bankQuestionIds.push(id);
      }
      slot.officialAnchor = {
        added,
        notes: Object.fromEntries(
          added.map((id) => [id, 'official topical anchor — adapted from đề chính thức 2025/2026'])
        ),
      };
    }
    writeFileSync(path, `${JSON.stringify(slot, null, 2)}\n`);
    console.log(`[slot] ${slotCode}: ${slot.officialReferences.length} ref(s)${added.length ? `, +${added.length} anchor` : ''}`);
  }
}

function main() {
  const bankPath = join(root, 'content/bank/questions.json');
  const bank = JSON.parse(readFileSync(bankPath, 'utf8'));
  let inserted = 0;

  for (const q of ANCHORS) {
    if (bank.questions.some((existing) => existing.id === q.id)) {
      console.log(`[skip] ${q.id} already present`);
      continue;
    }
    insertAfter(bank.questions, anchorFor(q.matrixSlot), [q]);
    console.log(`[add] ${q.id} (${q.source})`);
    inserted += 1;
  }

  if (inserted) {
    writeFileSync(bankPath, `${JSON.stringify(bank, null, 2)}\n`);
  }

  updateSlots();
  console.log(`\nDone — ${inserted} question(s) inserted, ${Object.keys(OFFICIAL_SLOT_REFS).length} slots mapped.`);
}

main();
