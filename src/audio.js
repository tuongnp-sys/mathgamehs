/** @typedef {'hub' | 'result'} BgmTrack */

const BGM_SRC = {
  hub: './assets/audio/hub-upbeat.mp3',
  result: './assets/audio/result-calm.mp3',
};

let ctx = null;
let unlocked = false;
/** @type {HTMLAudioElement | null} */
let bgmEl = null;
/** @type {BgmTrack | null} */
let currentBgm = null;
let bgmUserEnabled = true;
let bgmPausedBySystem = false;

function getBgmEl() {
  if (!bgmEl) {
    bgmEl = new Audio();
    bgmEl.loop = true;
    bgmEl.preload = 'auto';
    bgmEl.volume = 0.42;
  }
  return bgmEl;
}

export function initAudio() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (Ctx) ctx = new Ctx();
  } catch {
    ctx = null;
  }
}

export function unlockAudio() {
  unlocked = true;
  if (!ctx) return;
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
}

export function pauseAudio() {
  if (ctx?.state === 'running') ctx.suspend().catch(() => {});
  const el = bgmEl;
  if (el && !el.paused) {
    el.pause();
    bgmPausedBySystem = true;
  }
}

export function resumeAudio() {
  if (unlocked && ctx?.state === 'suspended') ctx.resume().catch(() => {});
  if (!bgmPausedBySystem || !currentBgm) return;
  if (!bgmUserEnabled) {
    bgmPausedBySystem = false;
    return;
  }
  const el = bgmEl;
  if (el && el.paused) {
    el.play().catch(() => {});
  }
  bgmPausedBySystem = false;
}

export function playBellSound() {
  if (!ctx || !unlocked) return;
  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.4);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.65);
  } catch {
    /* ignore */
  }
}

/** @param {BgmTrack} track */
export function playBgm(track) {
  if (!unlocked) return;
  if (!bgmUserEnabled) {
    currentBgm = track;
    return;
  }
  const src = BGM_SRC[track];
  if (!src) return;

  const el = getBgmEl();
  if (currentBgm === track && !el.paused && !bgmPausedBySystem) return;

  if (currentBgm !== track) {
    el.pause();
    el.currentTime = 0;
    el.src = src;
    currentBgm = track;
  }

  bgmPausedBySystem = false;
  el.play().catch(() => {});
}

export function stopBgm() {
  const el = bgmEl;
  if (el) {
    el.pause();
    el.currentTime = 0;
  }
  currentBgm = null;
  bgmPausedBySystem = false;
}

export function resetBgmUserPreference() {
  bgmUserEnabled = true;
}

export function isBgmUserEnabled() {
  return bgmUserEnabled;
}

/** @param {boolean} enabled */
export function setBgmUserEnabled(enabled) {
  bgmUserEnabled = enabled;
  if (!enabled) {
    if (currentBgm && bgmEl) bgmEl.pause();
    return;
  }
  if (currentBgm && unlocked) {
    playBgm(currentBgm);
  }
}
