import { REGIONS } from '../app/quest-regions.js';
import { renderQuestMapHtml, bindQuestMap } from './quest-map.js';
import { regionSceneBlock } from './quest-region-art.js';
import { unifiedLangButtonHtml } from './lang-button.js';

/**
 * @param {HTMLElement} root
 * @param {object} opts
 * @param {import('../app/scoring.js').Question[]} opts.questions
 * @param {(key: string) => string} opts.t
 * @param {'vi' | 'en'} [opts.contentLang]
 * @param {() => void} [opts.onToggleLang]
 * @param {() => void} opts.onStart
 */
export function renderQuestBriefing(root, { questions, t, contentLang, onToggleLang, onStart }) {
  const langBtn = onToggleLang ? unifiedLangButtonHtml(contentLang, 'btn-brief-lang') : '';

  const regions = REGIONS.map(
    (r) => `
    <div class="brief-region brief-region-${r.id}">
      ${regionSceneBlock(r.id, t, 'banner')}
      <span class="muted">${r.endOrder - r.startOrder + 1} ${t('questNodes')}</span>
    </div>`
  ).join('');

  const mapPreview = renderQuestMapHtml({
    questions,
    answers: {},
    flags: {},
    currentIndex: 0,
    t,
    showScene: false,
  });

  root.innerHTML = `
    <div class="panel quest-briefing-panel">
      <div class="brief-header">
        <h2 class="screen-title">${t('questBriefingTitle')}</h2>
        ${langBtn}
      </div>
      <p class="screen-sub">${t('questBriefingSub')}</p>
      <div class="brief-regions">${regions}</div>
      ${mapPreview}
      <p class="brief-hint muted" id="brief-skip-hint">${t('questBriefingSkip')}</p>
      <button type="button" class="btn btn-primary" id="btn-quest-start" disabled>${t('questStart')}</button>
    </div>`;

  root.querySelector('#btn-brief-lang')?.addEventListener('click', () => onToggleLang?.());

  const startBtn = root.querySelector('#btn-quest-start');
  let canStart = false;

  const enableStart = () => {
    if (canStart) return;
    canStart = true;
    if (startBtn) {
      startBtn.disabled = false;
      startBtn.focus();
    }
    const hint = root.querySelector('#brief-skip-hint');
    if (hint) hint.textContent = t('questBriefingReady');
  };

  setTimeout(enableStart, 1500);
  startBtn?.addEventListener('click', () => {
    if (canStart) onStart();
  });

  bindQuestMap(root, () => {}, () => {});
}
