#!/usr/bin/env node
/**
 * Crop figure regions from exam page PNGs → examFigure on official questions.
 *
 * Usage:
 *   node scripts/crop-exam-figures.mjs content/bank/official/figures/2026-0116.crops.json
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createCanvas, loadImage } from 'canvas';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = process.argv[2];

if (!manifestPath) {
  console.error('Usage: node scripts/crop-exam-figures.mjs <crops-manifest.json>');
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(join(root, manifestPath), 'utf8'));
const {
  slug,
  examJson,
  pageDir,
  outDir,
  imagePathPrefix,
  imageField = 'examFigure',
  marginX = 0,
  cropWidth,
  figures = [],
} = manifest;

const absOut = join(root, outDir);
mkdirSync(absOut, { recursive: true });

const pageCache = new Map();

async function loadPage(name) {
  if (!pageCache.has(name)) {
    const path = join(root, pageDir, name);
    if (!existsSync(path)) {
      throw new Error(`Missing page image: ${path}\nRun: npm run extract:exam-pages`);
    }
    pageCache.set(name, await loadImage(path));
  }
  return pageCache.get(name);
}

const outputs = [];

for (const fig of figures) {
  const page = await loadPage(fig.page);
  const x = fig.x ?? marginX;
  const w = fig.w ?? cropWidth ?? page.width - x * 2;
  const { y, h } = fig;
  const outName = `${fig.id.replace(/[^a-z0-9-]/gi, '')}.png`;
  const outPath = join(absOut, outName);

  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(page, x, y, w, h, 0, 0, w, h);
  writeFileSync(outPath, canvas.toBuffer('image/png'));

  const rel = `${imagePathPrefix}/${outName}`;
  outputs.push({ id: fig.id, path: rel, file: outPath });
  console.log('Cropped', fig.id, '→', outName, `(${w}×${h} @ ${x},${y})`);
}

if (examJson) {
  const examPath = join(root, examJson);
  const exam = JSON.parse(readFileSync(examPath, 'utf8'));
  const byId = Object.fromEntries(outputs.map((o) => [o.id, o.path]));

  for (const question of exam.questions) {
    delete question.examImage;
    delete question.examFigure;
    if (byId[question.id]) {
      question[imageField] = byId[question.id];
    }
  }

  writeFileSync(examPath, `${JSON.stringify(exam, null, 2)}\n`);
  console.log('Updated', examPath);
}

writeFileSync(
  join(absOut, 'manifest.json'),
  JSON.stringify(
    {
      slug,
      source: basename(manifestPath),
      field: imageField,
      figures: outputs.map((o) => ({ id: o.id, [imageField]: o.path })),
    },
    null,
    2
  )
);

console.log(`Done — ${outputs.length} figures in ${outDir}`);
