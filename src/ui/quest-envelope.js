import { formatTreasureUsdBillions } from '../app/exam-manifest.js';

/**
 * @param {object} opts
 * @param {boolean} opts.opened
 * @param {string} [opts.examManifestCode]
 * @param {number} [opts.treasureValueUsd]
 * @param {'vi' | 'en'} opts.contentLang
 * @param {(key: string) => string} opts.t
 */
export function renderQuestEnvelopeHtml({ opened, examManifestCode, treasureValueUsd, contentLang, t }) {
  const valueLabel =
    opened && treasureValueUsd != null
      ? formatTreasureUsdBillions(treasureValueUsd, contentLang)
      : '';

  const reveal = opened
    ? `
      <div class="envelope-reveal">
        <span class="envelope-code-label">${t('envelopeCodeLabel')}</span>
        <strong class="envelope-code">${examManifestCode || '------'}</strong>
        <span class="envelope-value-label">${t('envelopeValueLabel')}</span>
        <strong class="envelope-value">${valueLabel}</strong>
      </div>`
    : `<p class="envelope-hint">${t('envelopeSealedHint')}</p>`;

  return `
    <button
      type="button"
      class="quest-envelope ${opened ? 'quest-envelope-open' : 'quest-envelope-sealed'}"
      id="btn-quest-envelope"
      ${opened ? 'disabled aria-disabled="true"' : ''}
      aria-label="${opened ? t('envelopeOpenedAria') : t('envelopeSealedAria')}"
    >
      <span class="envelope-icon" aria-hidden="true">✉️</span>
      ${opened ? '' : '<span class="envelope-wax" aria-hidden="true"></span>'}
      <div class="envelope-body">
        <span class="envelope-title">${t('envelopeTitle')}</span>
        ${reveal}
      </div>
    </button>`;
}

/** @param {HTMLElement} root @param {() => void} onOpen */
export function bindQuestEnvelope(root, onOpen) {
  const btn = root.querySelector('#btn-quest-envelope');
  if (!btn || btn.disabled) return;
  btn.addEventListener('click', () => onOpen());
}
