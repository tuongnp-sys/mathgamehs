import { storageGet, storageSet, syncCloudKey } from '../../platform/storage.js';

const QUEST_KEY = 'quest_draft';

/**
 * @typedef {{
 *   questId: string,
 *   examMode: string,
 *   questionIds: string[],
 *   answers: Record<string, unknown>,
 *   flags: Record<string, boolean>,
 *   currentIndex: number,
 *   secondsLeft: number,
 *   startedAt: number,
 *   status: 'in_progress' | 'completed',
 *   sessionGold?: number,
 *   regionsCelebrated?: string[],
 *   envelopeOpened?: boolean,
 *   examManifestCode?: string,
 *   treasureValueUsd?: number,
 *   playStarted?: boolean,
 * }} QuestSession
 */

export function createQuestId() {
  return `q-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/** @returns {QuestSession | null} */
export function loadQuestSession() {
  const data = storageGet(QUEST_KEY, null);
  if (!data || data.status !== 'in_progress') return null;
  return data;
}

/** @param {QuestSession | null} session */
export function saveQuestSession(session) {
  if (!session) {
    storageSet(QUEST_KEY, null);
    syncCloudKey(QUEST_KEY);
    return;
  }
  storageSet(QUEST_KEY, session);
  syncCloudKey(QUEST_KEY);
}

export function clearQuestSession() {
  saveQuestSession(null);
}

export function hasActiveQuest() {
  return loadQuestSession() != null;
}

/** @param {QuestSession} session */
export function questSessionNeedsResume(session) {
  return !!session.playStarted;
}
