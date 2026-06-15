let ctx = null;
let unlocked = false;

export function initAudio() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (Ctx) ctx = new Ctx();
  } catch {
    ctx = null;
  }
}

export function unlockAudio() {
  if (!ctx || unlocked) return;
  unlocked = true;
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
}

export function pauseAudio() {
  if (ctx?.state === 'running') ctx.suspend().catch(() => {});
}

export function resumeAudio() {
  if (unlocked && ctx?.state === 'suspended') ctx.resume().catch(() => {});
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
