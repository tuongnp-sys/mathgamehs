#!/usr/bin/env node
/**
 * Bake figureSpec → SVG in public/assets/figures/
 *
 * Usage:
 *   node scripts/render-figures.mjs
 *   node scripts/render-figures.mjs --id seed-p1-03
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderFigure } from '../src/figures/render.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const bankPath = join(root, 'content/bank/questions.json');
const outDir = join(root, 'public/assets/figures');

const idFilter = process.argv.includes('--id')
  ? process.argv[process.argv.indexOf('--id') + 1]
  : null;

if (!existsSync(outDir)) {
  mkdirSync(outDir, { recursive: true });
}

const bank = JSON.parse(readFileSync(bankPath, 'utf8'));
let count = 0;

for (const q of bank.questions) {
  if (idFilter && q.id !== idFilter) continue;

  if (q.figureSpec) {
    const name = `${q.id}-stem.svg`;
    const svg = renderFigure(q.figureSpec);
    writeFileSync(join(outDir, name), svg);
    q.figureAsset = `/assets/figures/${name}`;
    console.log('Rendered', q.id, 'stem →', name);
    count += 1;
  }

  if (q.solutionFigureSpec) {
    const name = `${q.id}-solution.svg`;
    const svg = renderFigure(q.solutionFigureSpec);
    writeFileSync(join(outDir, name), svg);
    q.solutionFigureAsset = `/assets/figures/${name}`;
    console.log('Rendered', q.id, 'solution →', name);
    count += 1;
  }
}

writeFileSync(bankPath, `${JSON.stringify(bank, null, 2)}\n`);
console.log(`Done — ${count} figure file(s), bank updated.`);
