import { regionSceneBlock } from './quest-region-art.js';

/** @typedef {import('../app/quest-regions.js').RegionId} RegionId */

/**
 * @param {HTMLElement} root
 * @param {object} opts
 * @param {RegionId} opts.regionId
 * @param {'complete' | 'enter'} [opts.mode]
 * @param {(key: string) => string} opts.t
 * @param {() => void} opts.onContinue
 */
export function renderRegionCutscene(root, { regionId, mode = 'complete', t, onContinue }) {
  const titleKey = mode === 'complete' ? `cutscene_complete_${regionId}` : `cutscene_enter_${regionId}`;

  root.innerHTML = `
    <div class="panel cutscene-panel cutscene-${regionId}">
      ${regionSceneBlock(regionId, t, 'banner')}
      <h2 class="cutscene-title">${t(titleKey)}</h2>
      <p class="cutscene-sub">${t(`region_desc_${regionId}`)}</p>
      <button type="button" class="btn btn-primary" id="btn-cutscene-continue">${t('cutsceneContinue')}</button>
    </div>`;

  const btn = root.querySelector('#btn-cutscene-continue');
  setTimeout(() => btn?.focus(), 100);
  btn?.addEventListener('click', onContinue);
}
