import { createLocalPlatform } from './local.js';
import { createPokiPlatform } from './poki.js';
import { createCrazyGamesPlatform } from './crazygames.js';
import { createGamePixPlatform } from './gamepix.js';

const HOST_MAP = [
  { match: /poki\.com/i, id: 'poki' },
  { match: /crazygames\.com/i, id: 'crazygames' },
  { match: /gamepix\.com/i, id: 'gamepix' },
];

export function detectPlatformId() {
  const params = new URLSearchParams(window.location.search);
  const forced = params.get('platform');
  if (forced) return forced.toLowerCase();
  const host = window.location.hostname;
  for (const { match, id } of HOST_MAP) {
    if (match.test(host)) return id;
  }
  return 'local';
}

export function createPlatform() {
  const id = detectPlatformId();
  switch (id) {
    case 'poki':
      return createPokiPlatform();
    case 'crazygames':
      return createCrazyGamesPlatform();
    case 'gamepix':
      return createGamePixPlatform();
    default:
      return createLocalPlatform();
  }
}
