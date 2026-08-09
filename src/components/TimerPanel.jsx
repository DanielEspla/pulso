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
      <p style={styles.timerLabel}>{label}</p>
      <p style={styles.timerClock}>{formatMMSS(remainingMs / 1000)}</p>
      <div style={styles.timerButtonsRow}>
        {timer.paused ? (
          <button style={styles.smallBtn} onClick={onResume}>
            Reanudar
          </button>
        ) : (
          <button style={styles.smallBtn} onClick={onPause}>
            Pausar
          </button>
        )}
        <button style={styles.smallBtn} onClick={onRestart}>
          Reiniciar
        </button>
        <button style={styles.smallBtn} onClick={onSkip}>
          Saltar
        </button>
      </div>
    </div>
  );
}
