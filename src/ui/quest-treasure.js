import { treasureTierIcon } from '../app/treasure-rewards.js';
import { treasureCaveSceneSvg } from './quest-region-art.js';
import { unifiedLangButtonHtml } from './lang-button.js';

/**
 * @param {HTMLElement} root
 * @param {object} opts
 * @param {import('../app/scoring.js').ReturnType<import('../app/scoring.js').scoreExam>} opts.result
 * @param {{ tier: string, gold: number }} opts.reward
 * @param {boolean} opts.newBest
 * @param {(key: string) => string} opts.t
 * @param {'vi' | 'en'} [opts.contentLang]
 * @param {() => void} [opts.onToggleLang]
 * @param {() => void} opts.onReview
 * @param {() => void} opts.onNotebook
 * @param {() => void} opts.onNewQuest
 * @param {() => void} opts.onMenu
 */
export function renderQuestTreasure(root, {
  result,
  reward,
  newBest,
  t,
  contentLang,
  onToggleLang,
  onReview,
  onNotebook,
  onNewQuest,
  onMenu,
}) {
  const icon = treasureTierIcon(reward.tier);
  const tierKey = `treasureTier_${reward.tier}`;
  const langBtn = onToggleLang ? unifiedLangButtonHtml(contentLang, 'btn-treasure-lang') : '';

  root.innerHTML = `
    <div class="panel treasure-panel">
      <div class="treasure-header">
        <h2 class="screen-title">${t('treasureTitle')}</h2>
        ${langBtn}
      </div>
      ${result.timedOut ? `<p class="warn">${t('timedOut')}</p>` : ''}
      <div class="treasure-cave-scene">${treasureCaveSceneSvg()}</div>
      <div class="treasure-chest treasure-${reward.tier}">
        <span class="treasure-icon">${icon}</span>
        <p class="treasure-tier">${t(tierKey)}</p>
      </div>
      <div class="score-grid">
        <div class="score-main">${t('scoreTotal')}: <strong>${result.total}</strong>/10</div>
        <div class="score-parts">
          <span>${t('scorePart1')}: ${result.part1}</span>
          <span>${t('scorePart2')}: ${result.part2}</span>
          <span>${t('scorePart3')}: ${result.part3}</span>
        </div>
      </div>
      <p class="treasure-gold">${t('goldEarned')}: <strong>+${reward.gold}</strong> 🪙</p>
      ${newBest ? `<p class="treasure-new-best">${t('newBestScore')}</p>` : ''}
      <div class="btn-stack">
        <button type="button" class="btn" data-review>${t('viewSolutions')}</button>
        <button type="button" class="btn btn-primary" data-new>${t('questNext')}</button>
        <button type="button" class="btn" data-notebook>${t('mistakeNotebook')}</button>
        <button type="button" class="btn btn-ghost" data-menu>${t('backMenu')}</button>
      </div>
    </div>`;

  root.querySelector('#btn-treasure-lang')?.addEventListener('click', () => onToggleLang?.());
  root.querySelector('[data-review]')?.addEventListener('click', onReview);
  root.querySelector('[data-new]')?.addEventListener('click', onNewQuest);
  root.querySelector('[data-notebook]')?.addEventListener('click', onNotebook);
  root.querySelector('[data-menu]')?.addEventListener('click', onMenu);
}
