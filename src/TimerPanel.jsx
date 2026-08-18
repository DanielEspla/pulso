import React from "react";
import { styles } from "../styles.js";
import { formatMMSS } from "../lib/utils.js";

export default function TimerPanel({ timer, now, label, onPause, onResume, onRestart, onSkip, onDismissFinished, finishedTitle = "Descanso terminado" }) {
  if (!timer) return null;

  if (timer.finished) {
    return (
      <div style={styles.timerFinishedWrap}>
        <p style={styles.timerFinishedTitle}>{finishedTitle}</p>
        <p style={styles.timerFinishedSub}>{label}</p>
        <button style={styles.saveBtn} onClick={onDismissFinished}>
          Continuar
        </button>
      </div>
    );
  }

  const remainingMs = timer.paused ? timer.remainingMsAtPause : Math.max(0, timer.endTime - now);

  return (
    <div style={styles.timerBar}>
      <p style={styles.timerHeroLabel}>{timer.paused ? "En pausa" : "Descanso"}</p>
      <p style={styles.timerHeroClock}>{formatMMSS(remainingMs / 1000)}</p>
      <p style={styles.timerHeroSub}>{label}</p>
      <div style={styles.timerRingRow}>
        {timer.paused ? (
          <button style={styles.ringBtn} onClick={onResume} aria-label="Reanudar">
            ▶
          </button>
        ) : (
          <button style={styles.ringBtn} onClick={onPause} aria-label="Pausar">
            ❚❚
          </button>
        )}
        <button style={styles.ringBtn} onClick={onRestart} aria-label="Reiniciar">
          ↺
        </button>
        <button style={styles.ringBtn} onClick={onSkip} aria-label="Saltar">
          ⏭
        </button>
      </div>
    </div>
  );
}
