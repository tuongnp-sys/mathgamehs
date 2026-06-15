import { loadPortalSdk } from './bootstrap.js';
import { bindCloudStorage, initCloudStorage } from './storage.js';

export function createPokiPlatform() {
  let paused = false;
  const pauseHandlers = [];
  const resumeHandlers = [];

  return {
    id: 'poki',
    isPortalHost: true,
    async init() {
      await loadPortalSdk('poki');
      if (window.PokiSDK) await window.PokiSDK.init();
      bindCloudStorage(null);
      await initCloudStorage();
    },
    reportLoading() {},
    async loadingFinished() {
      window.PokiSDK?.gameLoadingFinished?.();
    },
    gameplayStart() {
      if (!paused) window.PokiSDK?.gameplayStart?.();
    },
    gameplayStop() {
      window.PokiSDK?.gameplayStop?.();
    },
    async commercialBreak() {
      if (window.PokiSDK?.commercialBreak) {
        await window.PokiSDK.commercialBreak();
      }
    },
    pingGameOver() {},
    happyTime() {},
    onPause(fn) {
      pauseHandlers.push(fn);
    },
    onResume(fn) {
      resumeHandlers.push(fn);
    },
    onMute() {},
    onUnmute() {},
  };
}
