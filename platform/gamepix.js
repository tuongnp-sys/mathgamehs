import { loadPortalSdk } from './bootstrap.js';
import { bindCloudStorage, initCloudStorage } from './storage.js';

export function createGamePixPlatform() {
  const gp = () => window.GamePix;
  const pauseHandlers = [];
  const resumeHandlers = [];
  const muteHandlers = [];
  const unmuteHandlers = [];

  return {
    id: 'gamepix',
    isPortalHost: true,
    async init() {
      await loadPortalSdk('gamepix');
      const g = gp();
      if (g?.on) {
        g.on.pause = () => pauseHandlers.forEach((fn) => fn());
        g.on.resume = () => resumeHandlers.forEach((fn) => fn());
        g.on.soundOff = () => muteHandlers.forEach((fn) => fn());
        g.on.soundOn = () => unmuteHandlers.forEach((fn) => fn());
      }
      const ls = g?.localStorage;
      if (ls) {
        bindCloudStorage({
          async getItem(key) {
            const v = await ls.getItem(`mathgamehs_${key}`);
            return v ? JSON.parse(v) : null;
          },
          async setItem(key, value) {
            await ls.setItem(`mathgamehs_${key}`, JSON.stringify(value));
          },
        });
      }
      await initCloudStorage();
    },
    reportLoading(n) {
      gp()?.game?.gameLoading?.(n);
    },
    async loadingFinished() {
      return new Promise((resolve) => {
        const g = gp()?.game;
        if (g?.gameLoaded) g.gameLoaded(() => resolve());
        else resolve();
      });
    },
    gameplayStart() {},
    gameplayStop() {},
    async commercialBreak() {
      const g = gp();
      if (g?.interstitialAd) await g.interstitialAd();
    },
    pingGameOver() {
      gp()?.game?.ping?.('game_over');
    },
    happyTime() {},
    onPause(fn) {
      pauseHandlers.push(fn);
    },
    onResume(fn) {
      resumeHandlers.push(fn);
    },
    onMute(fn) {
      muteHandlers.push(fn);
    },
    onUnmute(fn) {
      unmuteHandlers.push(fn);
    },
  };
}
