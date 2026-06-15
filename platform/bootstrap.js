const SDK_URLS = {
  poki: 'https://game-cdn.poki.com/scripts/v2/poki-sdk.js',
  crazygames: 'https://sdk.crazygames.com/crazygames-sdk-v3.js',
  gamepix:
    'https://gamepix.blob.core.windows.net/gpxlib/dev/gamepix.js',
};

export async function loadPortalSdk(platformId) {
  const url = SDK_URLS[platformId];
  if (!url) return;
  if (platformId === 'gamepix' && window.GamePix) return;
  if (platformId === 'poki' && window.PokiSDK) return;
  if (platformId === 'crazygames' && window.CrazyGames) return;

  await new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-mathgamehs-sdk="${platformId}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('sdk load failed')), {
        once: true,
      });
      if (existing.dataset.loaded === '1') resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    script.dataset.mathgamehsSdk = platformId;
    script.addEventListener(
      'load',
      () => {
        script.dataset.loaded = '1';
        resolve();
      },
      { once: true }
    );
    script.addEventListener('error', () => reject(new Error('sdk load failed')), {
      once: true,
    });
    document.head.appendChild(script);
  });
}
