#!/usr/bin/env node
import { readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dist = join(__dirname, '..', 'dist');

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, files);
    else files.push({ path: p, size: st.size });
  }
  return files;
}

if (!statSync(dist, { throwIfNoEntry: false })?.isDirectory()) {
  console.log('Run npm run build first. dist/ not found.');
  process.exit(1);
}

const files = walk(dist);
const totalBytes = files.reduce((s, f) => s + f.size, 0);
const mb = (totalBytes / (1024 * 1024)).toFixed(2);

console.log(`Files: ${files.length}`);
console.log(`Total size: ${mb} MB`);
console.log(files.length < 1000 ? 'OK: under itch 1000 file limit' : 'WARN: over 1000 files');
console.log(totalBytes < 50 * 1024 * 1024 ? 'OK: under CrazyGames 50 MB' : 'WARN: over 50 MB');
console.log(totalBytes < 500 * 1024 * 1024 ? 'OK: under itch 500 MB' : 'WARN: over 500 MB');
