#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const packagesDir = join(root, 'packages');

const portal = process.argv[2];
if (!portal) {
  console.error('Usage: node scripts/package-portal.mjs <itch|poki|gamepix|crazygames>');
  process.exit(1);
}

const configs = {
  itch: { portal: '0', target: '', zip: 'mathgamehs-itch.zip' },
  poki: { portal: '1', target: 'poki', zip: 'mathgamehs-poki.zip' },
  gamepix: { portal: '1', target: 'gamepix', zip: 'mathgamehs-gamepix.zip' },
  crazygames: { portal: '1', target: 'crazygames', zip: 'mathgamehs-crazygames.zip' },
};

const cfg = configs[portal];
if (!cfg) {
  console.error(`Unknown portal: ${portal}`);
  process.exit(1);
}

const env = {
  ...process.env,
  VITE_PORTAL: cfg.portal,
  VITE_PORTAL_TARGET: cfg.target,
  VITE_GAME_TITLE: 'MathGameHS',
};

console.log(`Building for ${portal} (VITE_PORTAL=${cfg.portal}, target=${cfg.target || 'none'})`);
execSync('npx vite build', { cwd: root, env, stdio: 'inherit' });

const dist = join(root, 'dist');
if (!existsSync(join(dist, 'index.html'))) {
  console.error('dist/index.html missing');
  process.exit(1);
}

mkdirSync(packagesDir, { recursive: true });

if (portal === 'crazygames') {
  const uploadDir = join(packagesDir, 'crazygames-upload');
  rmSync(uploadDir, { recursive: true, force: true });
  cpSync(dist, uploadDir, { recursive: true });
  console.log(`CrazyGames: drag-drop all files from:\n  ${uploadDir}`);
} else {
  const zipPath = join(packagesDir, cfg.zip);
  if (existsSync(zipPath)) rmSync(zipPath);
  const isWin = process.platform === 'win32';
  if (isWin) {
    execSync(`tar -a -cf "${zipPath}" *`, { cwd: dist, stdio: 'inherit', shell: true });
  } else {
    execSync(`zip -r "${zipPath}" .`, { cwd: dist, stdio: 'inherit' });
  }
  console.log(`Created ${zipPath}`);
}

if (portal === 'gamepix') {
  const html = readFileSync(join(dist, 'index.html'), 'utf8');
  if (!html.includes('gamepix.js')) {
    console.warn('WARN: dist/index.html does not contain gamepix.js script tag');
  } else {
    console.log('OK: gamepix.js found in index.html');
  }
}
