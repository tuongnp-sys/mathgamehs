/**
 * @param {boolean} enabled
 * @param {(key: string) => string} t
 * @param {string} [id]
 */
export function musicToggleButtonHtml(enabled, t, id = 'btn-music-toggle') {
  const label = enabled ? t('musicOn') : t('musicOff');
  const icon = enabled ? '🔊' : '🔇';
  return `<button type="button" class="btn btn-sm btn-music-toggle" id="${id}" aria-label="${label}" title="${label}">${icon}</button>`;
}
