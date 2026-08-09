let sharedAudioContext = null;

export function ensureAudioUnlocked() {
  try {
    if (!sharedAudioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      sharedAudioContext = new AudioCtx();
    }
    if (sharedAudioContext.state === "suspended") {
      sharedAudioContext.resume().catch((err) => console.error("ensureAudioUnlocked: no se pudo reanudar el audio", err));
    }
  } catch (err) {
    console.error("ensureAudioUnlocked: error al crear/reanudar el contexto de audio", err);
  }
}

export function playBeep() {
  try {
    if (!sharedAudioContext) return;
    const ctx = sharedAudioContext;
    const now = ctx.currentTime;
    [0, 0.28, 0.56].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.0001, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.35, now + offset + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.2);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.22);
    });
  } catch (err) {
    console.error("playBeep: error al reproducir el sonido", err);
  }
}

export function vibrateShort() {
  try {
    if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 200]);
  } catch (err) {
    console.error("vibrateShort: error al vibrar", err);
  }
}

export function vibrateTick() {
  try {
    if (navigator.vibrate) navigator.vibrate(80);
  } catch (err) {
    console.error("vibrateTick: error al vibrar", err);
  }
}
