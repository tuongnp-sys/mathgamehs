import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'node:path';

const GAMEPIX_SDK =
  'https://gamepix.blob.core.windows.net/gpxlib/dev/gamepix.js';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const portalTarget = env.VITE_PORTAL_TARGET || '';
  const isPortal = env.VITE_PORTAL === '1';
  const gameTitle = env.VITE_GAME_TITLE || 'MathGameHS';

  return {
    base: './',
    resolve: {
      alias: {
        '@content': resolve(__dirname, 'content'),
      },
    },
    define: {
      __PORTAL_MODE__: JSON.stringify(isPortal),
      __GAME_TITLE__: JSON.stringify(gameTitle),
    },
    server: {
      port: 5180,
    },
    plugins: [
      {
        name: 'mathgamehs-html',
        transformIndexHtml(html) {
          let out = html.replace(/<title>.*?<\/title>/, `<title>${gameTitle}</title>`);
          if (portalTarget === 'gamepix') {
            const tag = `<script src="${GAMEPIX_SDK}" data-mathgamehs-sdk="gamepix"></script>`;
            out = out.replace('</head>', `  ${tag}\n  </head>`);
          }
          return out;
        },
      },
    ],
  };
});
