#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PDFParse } from 'pdf-parse';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const files = process.argv.slice(2);
if (!files.length) {
  console.error('Usage: node scripts/extract-pdf-text.mjs <pdf>...');
  process.exit(1);
}

mkdirSync(join(root, 'content', 'official', '_extracted'), { recursive: true });

for (const f of files) {
  const buf = readFileSync(f);
  const parser = new PDFParse({ data: buf });
  const data = await parser.getText();
  await parser.destroy();
  const out = join(root, 'content', 'official', '_extracted', `${basename(f, '.pdf')}.txt`);
  writeFileSync(out, data.text, 'utf8');
  console.log(out, `(${data.pages?.length ?? '?'} pages, ${data.text.length} chars)`);
}
