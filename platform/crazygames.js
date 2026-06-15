import { loadPortalSdk } from './bootstrap.js';
import { bindCloudStorage, initCloudStorage } from './storage.js';

export function createCrazyGamesPlatform() {
  const sdk = () => window.CrazyGames?.SDK;

  return {
    id: 'crazygames',
    isPortalHost: true,
    async init() {
      await loadPortalSdk('crazygames');
      if (sdk()) await sdk().init();
      const data = sdk()?.data;
      if (data) {
        bindCloudStorage({
          async getItem(key) {
            const v = await data.getItem(`mathgamehs_${key}`);
            return v ? JSON.parse(v) : null;
          },
          async setItem(key, value) {
            await data.setItem(`mathgamehs_${key}`, JSON.stringify(value));
          },
        });
      }
      await initCloudStorage();
    },
    reportLoading() {},
    async loadingFinished() {
      sdk()?.sdkGameLoadingStop?.();
    },
    gameplayStart() {
      sdk()?.gameplayStart?.();
    },
    gameplayStop() {
      sdk()?.gameplayStop?.();
    },
    async commercialBreak() {
      const ad = sdk()?.ad;
      if (ad?.requestAd) await ad.requestAd('midgame');
    },
    pingGameOver() {},
    happyTime() {
      sdk()?.happyTime?.();
    },
    onPause() {},
    onResume() {},
    onMute() {},
    onUnmute() {},
  };
}
