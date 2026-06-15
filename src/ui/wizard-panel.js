/**
 * @param {string} hintText
 * @param {(key: string) => string} t
 */
export function wizardHintHtml(hintText, t) {
  return `
    <aside class="wizard-panel" aria-label="${t('wizardTitle')}">
      <div class="wizard-avatar" aria-hidden="true">🧙</div>
      <div class="wizard-body">
        <p class="wizard-label">${t('wizardHintLabel')}</p>
        <p class="wizard-text">${escapeHtml(hintText)}</p>
      </div>
    </aside>`;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
