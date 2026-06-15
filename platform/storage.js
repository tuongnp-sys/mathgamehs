const STORAGE_PREFIX = 'mathgamehs_';

export function storageGet(key, fallback = null) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (raw == null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function storageSet(key, value) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function storageRemove(key) {
  try {
    localStorage.removeItem(STORAGE_PREFIX + key);
  } catch {
    /* ignore */
  }
}

let cloudReady = false;
let cloudAdapter = null;

export function bindCloudStorage(adapter) {
  cloudAdapter = adapter;
}

export async function initCloudStorage() {
  if (!cloudAdapter?.getItem) return;
  try {
    const keys = ['mistakes', 'stats', 'locale', 'content_lang', 'quest_draft'];
    for (const key of keys) {
      const cloud = await cloudAdapter.getItem(key);
      if (cloud != null && storageGet(key) == null) {
        storageSet(key, cloud);
      }
    }
    cloudReady = true;
  } catch {
    cloudReady = false;
  }
}

export async function syncCloudKey(key) {
  if (!cloudAdapter?.setItem) return;
  try {
    await cloudAdapter.setItem(key, storageGet(key));
  } catch {
    /* ignore */
  }
}

export function isCloudReady() {
  return cloudReady;
}
