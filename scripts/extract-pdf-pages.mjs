#!/usr/bin/env node
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PDFParse } from 'pdf-parse';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const [pdfPath, outSlug] = process.argv.slice(2);
if (!pdfPath || !outSlug) {
  console.error('Usage: node scripts/extract-pdf-pages.mjs <pdf> <slug>');
  console.error('  slug example: 2026-0116');
  process.exit(1);
}

const buf = readFileSync(join(root, pdfPath));
const outDir = join(root, 'public', 'assets', 'exams', outSlug);
mkdirSync(outDir, { recursive: true });

const parser = new PDFParse({ data: buf });
const shots = await parser.getScreenshot({ scale: 2, imageDataUrl: false, imageBuffer: true });
await parser.destroy();

for (const page of shots.pages) {
  const num = page.pageNumber ?? page.num ?? 0;
  const name = `page-${String(num).padStart(2, '0')}.png`;
  const path = join(outDir, name);
  const bufOut = Buffer.isBuffer(page.data) ? page.data : Buffer.from(page.data);
  writeFileSync(path, bufOut);
  console.log('Wrote', path);
}

writeFileSync(
  join(outDir, 'manifest.json'),
  JSON.stringify(
    {
      slug: outSlug,
      sourcePdf: pdfPath,
      pages: shots.pages.map(
        (p) => `page-${String(p.pageNumber ?? p.num).padStart(2, '0')}.png`
      ),
    },
    null,
    2
  )
);
