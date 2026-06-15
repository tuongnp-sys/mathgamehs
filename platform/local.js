import { initCloudStorage } from './storage.js';

export function createLocalPlatform() {
  return {
    id: 'local',
    isPortalHost: false,
    async init() {
      await initCloudStorage();
    },
    reportLoading() {},
    async loadingFinished() {},
    gameplayStart() {},
    gameplayStop() {},
    async commercialBreak() {},
    pingGameOver() {},
    happyTime() {},
    onPause() {},
    onResume() {},
    onMute() {},
    onUnmute() {},
  };
}
