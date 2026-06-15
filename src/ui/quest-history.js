import { treasureTierIcon } from '../app/treasure-rewards.js';

/**
 * @param {Array<{ total: number, goldEarned?: number, treasureTier?: string, finishedAt?: number, timedOut?: boolean }>} history
 * @param {(key: string) => string} t
 */
export function renderQuestHistoryHtml(history, t) {
  const items = Array.isArray(history) ? history : [];
  if (!items.length) {
    return `
      <section class="quest-history-section">
        <h3 class="quest-history-title">${t('historyTitle')}</h3>
        <p class="muted quest-history-empty">${t('historyEmpty')}</p>
      </section>`;
  }

  const rows = items
    .slice(0, 20)
    .map((entry) => {
      const date = entry.finishedAt
        ? new Date(entry.finishedAt).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
        : '—';
      const icon = entry.treasureTier ? treasureTierIcon(entry.treasureTier) : '🗺️';
      const tierLabel = entry.treasureTier ? t(`treasureTier_${entry.treasureTier}`) : '';
      const timeout = entry.timedOut ? ` · ${t('timedOut')}` : '';

      return `
        <li class="quest-history-row">
          <span class="quest-history-icon">${icon}</span>
          <span class="quest-history-meta">
            <strong>${entry.total ?? '—'}/10</strong>
            ${entry.goldEarned != null ? `<span class="quest-history-gold">+${entry.goldEarned} 🪙</span>` : ''}
            ${tierLabel ? `<span class="quest-history-tier">${tierLabel}</span>` : ''}
          </span>
          <span class="quest-history-date">${date}${timeout}</span>
        </li>`;
    })
    .join('');

  return `
    <section class="quest-history-section">
      <h3 class="quest-history-title">${t('historyTitle')}</h3>
      <ul class="quest-history-list">${rows}</ul>
    </section>`;
}
