import { REGIONS, regionForIndex } from '../app/quest-regions.js';
import { isQuestionAnswered } from '../app/quest-answer.js';
import { regionSceneBlock } from './quest-region-art.js';

const TOPIC_SHORT = {
  L11_TRIG: '∿',
  L11_SEQ: 'an',
  L11_SOLID: '◻',
  L11_EXPLOG: 'exp',
  L11_STATS: 'μ',
  L12_CALC: "f'",
  L12_INTEGRAL: '∫',
  L12_OXYZ: 'xyz',
  L12_PROB_COND: 'P',
  L10_LINEAR_PROG: 'LP',
  L10_COMBINATORICS: 'C',
  L11_PROB: 'P',
};

/**
 * @param {object} opts
 * @param {import('../app/scoring.js').Question[]} opts.questions
 * @param {Record<string, unknown>} opts.answers
 * @param {Record<string, boolean>} opts.flags
 * @param {number} opts.currentIndex
 * @param {number} [opts.sessionGold]
 * @param {(key: string) => string} opts.t
 * @param {boolean} [opts.showScene]
 */
export function renderQuestTrailHtml({
  questions,
  answers,
  flags,
  currentIndex,
  sessionGold = 0,
  t,
  showScene = true,
}) {
  const activeRegion = regionForIndex(currentIndex);
  const sceneHtml = showScene ? regionSceneBlock(activeRegion, t, 'banner') : '';

  const segments = REGIONS.map((region) => {
    const nodes = [];
    for (let i = region.startOrder - 1; i < region.endOrder; i += 1) {
      const q = questions[i];
      if (!q) continue;
      const num = i + 1;
      const answered = isQuestionAnswered(q, answers);
      const flagged = flags[q.id];
      const isCurrent = i === currentIndex;
      const visited = answered || isCurrent;
      const topic = TOPIC_SHORT[q.topicCode] || '·';
      let cls = `trail-node trail-node-${region.id}`;
      if (isCurrent) cls += ' current';
      if (answered) cls += ' answered';
      if (flagged) cls += ' flagged';
      if (!visited) cls += ' fog';

      const label = visited ? String(num) : '?';
      const title = visited
        ? `${t('question')} ${num}`
        : `${t('trailFogHint')} · ${topic}`;

      nodes.push(
        `<button type="button" class="${cls}" data-qindex="${i}" title="${title}">
          <span class="trail-node-num">${label}</span>
        </button>`
      );
      if (i < region.endOrder - 1) {
        nodes.push(`<span class="trail-connector trail-connector-${region.id}"></span>`);
      }
    }

    return `
      <div class="trail-segment trail-segment-${region.id} ${activeRegion === region.id ? 'active' : ''}">
        <div class="trail-seg-label">${t(`region_${region.id}`)}</div>
        <div class="trail-seg-nodes">${nodes.join('')}</div>
      </div>`;
  }).join('<div class="trail-region-gap"></div>');

  return `
    <div class="quest-trail-panel">
      ${sceneHtml}
      <div class="trail-gold-row">
        <span class="trail-progress">${countTrailProgress(questions, answers)} / ${questions.length}</span>
        ${sessionGold > 0 ? `<span class="trail-session-gold">🪙 ${sessionGold}</span>` : ''}
      </div>
      <div class="quest-trail" aria-label="${t('questMapLabel')}">${segments}</div>
    </div>`;
}

function countTrailProgress(questions, answers) {
  return questions.filter((q) => isQuestionAnswered(q, answers)).length;
}

export function bindQuestTrail(root, onGoToIndex, onGoToRegion) {
  root.querySelectorAll('[data-qindex]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.getAttribute('data-qindex'));
      if (!Number.isNaN(idx)) onGoToIndex(idx);
    });
  });
  root.querySelectorAll('[data-region]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-region');
      if (id) onGoToRegion(id);
    });
  });
}

/** @param {HTMLElement} container @param {number} amount */
export function spawnGoldFloat(container, amount) {
  const el = document.createElement('div');
  el.className = 'gold-float';
  el.textContent = `+${amount} 🪙`;
  container.appendChild(el);
  requestAnimationFrame(() => el.classList.add('gold-float-active'));
  setTimeout(() => el.remove(), 900);
}
