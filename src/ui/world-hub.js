import { regionSceneSvg } from './quest-region-art.js';
import { unifiedLangButtonHtml } from './lang-button.js';
import { renderQuestHistoryHtml } from './quest-history.js';
import { renderQuestEnvelopeHtml, bindQuestEnvelope } from './quest-envelope.js';
import { REGIONS } from '../app/quest-regions.js';

/**
 * @param {HTMLElement} root
 * @param {object} opts
 */
export function renderWorldHub(root, opts) {
  const {
    stats,
    officialExams,
    contentLang,
    questEnvelope,
    onOpenEnvelope,
    onFullExam,
    onResumeQuest,
    onOfficial,
    onNotebook,
    onToggleLang,
    t,
    tx: txUi,
  } = opts;

  const envelopeOpened = !!questEnvelope?.opened;
  const canResume = !!questEnvelope?.canResume;

  const zones = REGIONS.map((region) => {
    const id = region.id;
    const nodeCount = region.endOrder - region.startOrder + 1;
    const leds = Array.from(
      { length: nodeCount },
      (_, i) =>
        `<span class="led" style="animation-delay:${((i * 0.11) % 1.8).toFixed(2)}s"></span>`
    ).join('');
    return `
    <div class="world-zone world-zone-${id}">
      <div class="world-zone-art">${regionSceneSvg(/** @type any */ (id), 'thumb')}</div>
      <div class="world-zone-led-grid" aria-hidden="true">${leds}</div>
      <span class="world-zone-name">${t(`region_${id}`)}</span>
      <span class="world-zone-lock-badge" title="${t('worldHubBadgeHint')}">
        <span class="zone-lock-count">${nodeCount}</span>
        <span class="zone-lock-icon" aria-hidden="true">🔒</span>
      </span>
    </div>`;
  }).join('');

  const officialHtml = (officialExams || [])
    .map(
      (ex) =>
        `<button type="button" class="btn btn-sm btn-official" data-official="${ex.id}">${txUi(ex.title, contentLang)}</button>`
    )
    .join('');

  const envelopeHtml = renderQuestEnvelopeHtml({
    opened: envelopeOpened,
    examManifestCode: questEnvelope?.examManifestCode,
    treasureValueUsd: questEnvelope?.treasureValueUsd,
    contentLang,
    t,
  });

  root.innerHTML = `
    <div class="panel world-hub-panel">
      <div class="world-hub-header">
        <div class="world-hub-title-row">
          <h2 class="screen-title">${typeof __GAME_TITLE__ !== 'undefined' ? __GAME_TITLE__ : 'MathGameHS'}</h2>
          <span class="beta-badge" aria-label="${t('betaBadge')}">${t('betaBadge')}</span>
        </div>
        ${unifiedLangButtonHtml(contentLang, 'btn-hub-lang')}
      </div>
      <p class="beta-notice">${t('betaNotice')}</p>
      <div class="world-map world-map-led">${zones}</div>
      <div class="world-envelope-wrap">${envelopeHtml}</div>
      <div class="world-hub-actions">
        ${canResume ? `<button type="button" class="btn btn-primary btn-world-start" data-action="resume">${t('questResume')}</button>` : ''}
        <button
          type="button"
          class="btn ${canResume ? 'btn-world-start' : 'btn-primary btn-world-start'}"
          data-action="full"
          ${envelopeOpened ? '' : 'disabled'}
        >
          ${t('worldHubStart')}
        </button>
        ${!envelopeOpened ? `<p class="world-start-hint muted">${t('envelopeStartHint')}</p>` : ''}
      </div>
      <div class="world-hub-secondary">
        <span class="world-hub-sec-label">${t('worldHubMore')}</span>
        <div class="world-hub-sec-btns">${officialHtml}</div>
        <div class="world-hub-sec-btns">
          <button type="button" class="btn btn-sm btn-accent" data-action="notebook">${t('mistakeNotebook')}</button>
        </div>
      </div>
      <div class="stats-row world-stats">
        <span>${t('statsExams')}: <strong>${stats.examsTaken || 0}</strong></span>
        <span>${t('statsBest')}: <strong>${stats.bestScore ?? '—'}</strong>/10</span>
        <span>${t('statsGold')}: <strong>${stats.totalGold || 0}</strong> 🪙</span>
        ${stats.bestTreasureTier ? `<span>${t('statsBestTier')}: <strong>${t(`treasureTier_${stats.bestTreasureTier}`)}</strong></span>` : ''}
      </div>
      ${renderQuestHistoryHtml(stats.history, t)}
    </div>`;

  root.querySelector('#btn-hub-lang')?.addEventListener('click', onToggleLang);
  bindQuestEnvelope(root, onOpenEnvelope);
  root.querySelector('[data-action="full"]')?.addEventListener('click', () => {
    if (envelopeOpened) onFullExam();
  });
  root.querySelector('[data-action="resume"]')?.addEventListener('click', onResumeQuest);
  root.querySelectorAll('[data-official]').forEach((btn) => {
    btn.addEventListener('click', () => onOfficial(btn.getAttribute('data-official')));
  });
  root.querySelector('[data-action="notebook"]')?.addEventListener('click', onNotebook);
}
