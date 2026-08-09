import React, { useState, useEffect } from "react";
import { styles } from "../styles.js";
import { exerciseName } from "../lib/templates.js";
import { todayISO, formatMMSS } from "../lib/utils.js";
import { ensureAudioUnlocked, playBeep, vibrateShort } from "../lib/timer.js";
import TimerPanel from "./TimerPanel.jsx";

export default function HiitView({ templates, history, persistHistory, cycle, hiitSession, setHiitSession, now, timerPrefs, onSessionSaved }) {
  const [emomDurationChoice, setEmomDurationChoice] = useState(templates.emomTemplate.normal.durationOptionsMin[1] || 15);
  const [amrapDurationChoice, setAmrapDurationChoice] = useState(templates.amrapTemplate.normal.durationOptionsMin[1] || 15);
  const [repsInput, setRepsInput] = useState("");
  const [roundsCompletedInput, setRoundsCompletedInput] = useState("");
  const [partialExerciseId, setPartialExerciseId] = useState("");
  const [partialReps, setPartialReps] = useState("");
  const [saveMsg, setSaveMsg] = useState("");
  const [saveError, setSaveError] = useState("");

  const deloadActive = cycle.deloadActive;

  const startHiit = () => {
    ensureAudioUnlocked();
    const emomCfg = deloadActive ? templates.emomTemplate.deload : templates.emomTemplate.normal;
    const emomDurationMin = deloadActive ? templates.emomTemplate.deload.durationMin : emomDurationChoice;
    const amrapDurationMin = deloadActive ? templates.amrapTemplate.deload.durationMin : amrapDurationChoice;

    setHiitSession({
      phase: "emom",
      deloadWeek: deloadActive,
      emomDurationMin,
      workSeconds: emomCfg.workSeconds,
      restSeconds: emomCfg.restSeconds,
      exercisePool: templates.emomTemplate.exercisePool,
      emomEndTime: Date.now() + emomDurationMin * 60000,
      emomPaused: false,
      emomRemainingMsAtPause: null,
      emomRounds: [],
      emomLastCommittedMinuteIndex: -1,
      amrapDurationMin,
      amrapCircuit: templates.amrapTemplate.circuit,
      restBetween: null,
      amrapEndTime: null,
      amrapPaused: false,
      amrapRemainingMsAtPause: null,
      amrapFinished: false,
    });
    setRepsInput("");
    setRoundsCompletedInput("");
    setPartialExerciseId("");
    setPartialReps("");
    setSaveMsg("");
    setSaveError("");
  };

  const emomTotalMs = hiitSession && hiitSession.phase === "emom" ? hiitSession.emomDurationMin * 60000 : 0;
  const emomRemainingMs =
    hiitSession && hiitSession.phase === "emom"
      ? hiitSession.emomPaused
        ? hiitSession.emomRemainingMsAtPause
        : Math.max(0, hiitSession.emomEndTime - now)
      : 0;
  const emomElapsedMs = emomTotalMs - emomRemainingMs;
  const emomMinuteIndex = hiitSession && hiitSession.phase === "emom" ? Math.min(hiitSession.emomDurationMin - 1, Math.floor(emomElapsedMs / 60000)) : 0;
  const emomSecondsIntoMinute = (emomElapsedMs % 60000) / 1000;

  useEffect(() => {
    if (!hiitSession || hiitSession.phase !== "emom" || hiitSession.emomPaused) return;

    if (emomMinuteIndex > hiitSession.emomLastCommittedMinuteIndex) {
      const newRounds = [];
      let m = hiitSession.emomLastCommittedMinuteIndex + 1;
      while (m <= emomMinuteIndex) {
        const exId = hiitSession.exercisePool[m % hiitSession.exercisePool.length];
        const reps = m === hiitSession.emomLastCommittedMinuteIndex + 1 ? parseInt(repsInput, 10) || 0 : 0;
        newRounds.push({ minute: m + 1, exerciseId: exId, reps });
        m++;
      }
      setHiitSession((prev) =>
        prev && prev.phase === "emom" ? { ...prev, emomRounds: [...prev.emomRounds, ...newRounds], emomLastCommittedMinuteIndex: emomMinuteIndex } : prev
      );
      setRepsInput("");
    }

    if (emomRemainingMs <= 0 && hiitSession.emomLastCommittedMinuteIndex >= hiitSession.emomDurationMin - 1) {
      if (timerPrefs.sound) playBeep();
      if (timerPrefs.vibration) vibrateShort();
      const restSecondsBlock = templates.hiitTemplate.restBetweenBlocksSeconds;
      setHiitSession((prev) =>
        prev
          ? {
              ...prev,
              phase: "restBetween",
              restBetween: {
                totalSeconds: restSecondsBlock,
                endTime: Date.now() + restSecondsBlock * 1000,
                paused: false,
                remainingMsAtPause: null,
                finished: false,
              },
            }
          : prev
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [now, hiitSession]);

  const pauseEmom = () =>
    setHiitSession((prev) => (prev && !prev.emomPaused ? { ...prev, emomPaused: true, emomRemainingMsAtPause: Math.max(0, prev.emomEndTime - Date.now()) } : prev));
  const resumeEmom = () =>
    setHiitSession((prev) => (prev && prev.emomPaused ? { ...prev, emomPaused: false, emomEndTime: Date.now() + prev.emomRemainingMsAtPause, emomRemainingMsAtPause: null } : prev));
  const restartEmom = () =>
    setHiitSession((prev) =>
      prev ? { ...prev, emomPaused: false, emomEndTime: Date.now() + prev.emomDurationMin * 60000, emomRemainingMsAtPause: null, emomRounds: [], emomLastCommittedMinuteIndex: -1 } : prev
    );
  const skipEmom = () => {
    const restSecondsBlock = templates.hiitTemplate.restBetweenBlocksSeconds;
    setHiitSession((prev) => {
      if (!prev) return prev;
      const lastReps = parseInt(repsInput, 10) || 0;
      const alreadyCommitted = prev.emomLastCommittedMinuteIndex >= emomMinuteIndex;
      const exId = prev.exercisePool[emomMinuteIndex % prev.exercisePool.length];
      const rounds = alreadyCommitted ? prev.emomRounds : [...prev.emomRounds, { minute: emomMinuteIndex + 1, exerciseId: exId, reps: lastReps }];
      return {
        ...prev,
        emomRounds: rounds,
        phase: "restBetween",
        restBetween: { totalSeconds: restSecondsBlock, endTime: Date.now() + restSecondsBlock * 1000, paused: false, remainingMsAtPause: null, finished: false },
      };
    });
    setRepsInput("");
  };

  const startAmrapPhase = () =>
    setHiitSession((prev) => (prev ? { ...prev, phase: "amrap", amrapEndTime: Date.now() + prev.amrapDurationMin * 60000, amrapPaused: false, amrapRemainingMsAtPause: null, amrapFinished: false } : prev));

  const pauseRestBetween = () =>
    setHiitSession((prev) => (prev && prev.restBetween && !prev.restBetween.paused ? { ...prev, restBetween: { ...prev.restBetween, paused: true, remainingMsAtPause: Math.max(0, prev.restBetween.endTime - Date.now()) } } : prev));
  const resumeRestBetween = () =>
    setHiitSession((prev) => (prev && prev.restBetween && prev.restBetween.paused ? { ...prev, restBetween: { ...prev.restBetween, paused: false, endTime: Date.now() + prev.restBetween.remainingMsAtPause, remainingMsAtPause: null } } : prev));
  const restartRestBetween = () =>
    setHiitSession((prev) => (prev && prev.restBetween ? { ...prev, restBetween: { ...prev.restBetween, paused: false, finished: false, endTime: Date.now() + prev.restBetween.totalSeconds * 1000, remainingMsAtPause: null } } : prev));

  useEffect(() => {
    if (!hiitSession || hiitSession.phase !== "restBetween" || !hiitSession.restBetween) return;
    const rb = hiitSession.restBetween;
    if (rb.paused || rb.finished) return;
    if (rb.endTime - now <= 0) {
      if (timerPrefs.sound) playBeep();
      if (timerPrefs.vibration) vibrateShort();
      setHiitSession((prev) => (prev && prev.restBetween ? { ...prev, restBetween: { ...prev.restBetween, finished: true } } : prev));
    }
  }, [now, hiitSession, timerPrefs]);

  const pauseAmrap = () => setHiitSession((prev) => (prev && !prev.amrapPaused && !prev.amrapFinished ? { ...prev, amrapPaused: true, amrapRemainingMsAtPause: Math.max(0, prev.amrapEndTime - Date.now()) } : prev));
  const resumeAmrap = () => setHiitSession((prev) => (prev && prev.amrapPaused ? { ...prev, amrapPaused: false, amrapEndTime: Date.now() + prev.amrapRemainingMsAtPause, amrapRemainingMsAtPause: null } : prev));
  const restartAmrap = () => setHiitSession((prev) => (prev ? { ...prev, amrapPaused: false, amrapFinished: false, amrapEndTime: Date.now() + prev.amrapDurationMin * 60000, amrapRemainingMsAtPause: null } : prev));
  const finishAmrapNow = () => setHiitSession((prev) => (prev ? { ...prev, amrapFinished: true } : prev));

  useEffect(() => {
    if (!hiitSession || hiitSession.phase !== "amrap" || hiitSession.amrapPaused || hiitSession.amrapFinished) return;
    if (hiitSession.amrapEndTime - now <= 0) {
      if (timerPrefs.sound) playBeep();
      if (timerPrefs.vibration) vibrateShort();
      setHiitSession((prev) => (prev ? { ...prev, amrapFinished: true } : prev));
    }
  }, [now, hiitSession, timerPrefs]);

  const saveHiitSession = () => {
    const session = {
      id: `${todayISO()}-hiit-${Date.now()}`,
      date: todayISO(),
      type: "hiit",
      deloadWeek: hiitSession.deloadWeek,
      emom: { durationMin: hiitSession.emomDurationMin, workSeconds: hiitSession.workSeconds, restSeconds: hiitSession.restSeconds, rounds: hiitSession.emomRounds },
      amrap: {
        durationMin: hiitSession.amrapDurationMin,
        circuit: hiitSession.amrapCircuit,
        roundsCompleted: parseInt(roundsCompletedInput, 10) || 0,
        partialRound: partialExerciseId ? { exerciseId: partialExerciseId, repsCompleted: parseInt(partialReps, 10) || 0 } : null,
      },
    };
    const ok = persistHistory([...history, session]);
    if (!ok) {
      setSaveError("No se pudo guardar en este dispositivo. Tus datos siguen aquí, inténtalo de nuevo.");
      return;
    }
    setSaveError("");
    setHiitSession(null);
    onSessionSaved();
    setSaveMsg("Sesión HIIT guardada.");
    setTimeout(() => setSaveMsg(""), 3500);
  };

  if (!hiitSession) {
    return (
      <div>
        {saveMsg && <p style={{ ...styles.successText, margin: "0 16px" }}>{saveMsg}</p>}
        <div style={styles.card}>
          <p style={styles.cardTitle}>Nueva sesión HIIT</p>
          {deloadActive ? (
            <p style={{ fontSize: 13, color: "#F2B705" }}>Semana de descarga: EMOM 12' a 30"/30", AMRAP 12'. Duración fija esta semana.</p>
          ) : (
            <>
              <div style={{ marginBottom: 12 }}>
                <p style={{ fontSize: 13, color: "#8A8F98", margin: "0 0 6px" }}>Duración EMOM</p>
                <div style={styles.tabsRow}>
                  {templates.emomTemplate.normal.durationOptionsMin.map((m) => (
                    <button key={m} style={{ ...styles.tabChip, ...(m === emomDurationChoice ? styles.tabChipActive : {}) }} onClick={() => setEmomDurationChoice(m)}>
                      {m}'
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p style={{ fontSize: 13, color: "#8A8F98", margin: "0 0 6px" }}>Duración AMRAP</p>
                <div style={styles.tabsRow}>
                  {templates.amrapTemplate.normal.durationOptionsMin.map((m) => (
                    <button key={m} style={{ ...styles.tabChip, ...(m === amrapDurationChoice ? styles.tabChipActive : {}) }} onClick={() => setAmrapDurationChoice(m)}>
                      {m}'
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        <div style={{ margin: "0 16px" }}>
          <button style={styles.saveBtn} onClick={startHiit}>
            EMPEZAR EMOM
          </button>
        </div>
      </div>
    );
  }

  if (hiitSession.phase === "emom") {
    const currentExerciseId = hiitSession.exercisePool[emomMinuteIndex % hiitSession.exercisePool.length];
    const subPhase = emomSecondsIntoMinute < hiitSession.workSeconds ? "trabajo" : "descanso";
    return (
      <div>
        <div style={styles.timerBar}>
          <p style={styles.timerLabel}>
            Minuto {emomMinuteIndex + 1} de {hiitSession.emomDurationMin} · {subPhase}
          </p>
          <p style={styles.timerClock}>{formatMMSS(emomRemainingMs / 1000)}</p>
          <p style={styles.timerSub}>{exerciseName(currentExerciseId, templates.customExerciseNames)}</p>
          <div style={styles.timerButtonsRow}>
            {hiitSession.emomPaused ? (
              <button style={styles.smallBtn} onClick={resumeEmom}>
                Reanudar
              </button>
            ) : (
              <button style={styles.smallBtn} onClick={pauseEmom}>
                Pausar
              </button>
            )}
            <button style={styles.smallBtn} onClick={restartEmom}>
              Reiniciar
            </button>
            <button style={styles.smallBtn} onClick={skipEmom}>
              Terminar EMOM
            </button>
          </div>
        </div>
        <div style={styles.card}>
          <p style={{ fontSize: 13, color: "#8A8F98", margin: "0 0 6px" }}>Reps de este minuto ({exerciseName(currentExerciseId, templates.customExerciseNames)})</p>
          <input type="number" inputMode="numeric" value={repsInput} onChange={(e) => setRepsInput(e.target.value)} style={styles.numInput} />
        </div>
      </div>
    );
  }

  if (hiitSession.phase === "restBetween") {
    return (
      <div>
        <TimerPanel
          timer={hiitSession.restBetween}
          now={now}
          label="Descanso entre EMOM y AMRAP"
          onPause={pauseRestBetween}
          onResume={resumeRestBetween}
          onRestart={restartRestBetween}
          onSkip={startAmrapPhase}
          onDismissFinished={startAmrapPhase}
          finishedTitle="Descanso terminado — empieza el AMRAP"
        />
      </div>
    );
  }

  const amrapRemainingMs = hiitSession.amrapPaused ? hiitSession.amrapRemainingMsAtPause : Math.max(0, hiitSession.amrapEndTime - now);
  return (
    <div>
      <div style={styles.timerBar}>
        <p style={styles.timerLabel}>{hiitSession.amrapFinished ? "Tiempo terminado" : "AMRAP en curso"}</p>
        <p style={styles.timerClock}>{formatMMSS(amrapRemainingMs / 1000)}</p>
        <div style={styles.timerButtonsRow}>
          {!hiitSession.amrapFinished &&
            (hiitSession.amrapPaused ? (
              <button style={styles.smallBtn} onClick={resumeAmrap}>
                Reanudar
              </button>
            ) : (
              <button style={styles.smallBtn} onClick={pauseAmrap}>
                Pausar
              </button>
            ))}
          <button style={styles.smallBtn} onClick={restartAmrap}>
            Reiniciar
          </button>
          {!hiitSession.amrapFinished && (
            <button style={styles.smallBtn} onClick={finishAmrapNow}>
              Terminar ya
            </button>
          )}
        </div>
      </div>

      <div style={styles.card}>
        <p style={styles.cardTitle}>Circuito</p>
        {hiitSession.amrapCircuit.map((c) => (
          <p key={c.exerciseId} style={{ fontSize: 13, color: "#8A8F98", margin: "2px 0" }}>
            {exerciseName(c.exerciseId, templates.customExerciseNames)} × {c.targetReps}
          </p>
        ))}
      </div>

      <div style={styles.card}>
        <p style={styles.cardTitle}>Resultado</p>
        <p style={{ fontSize: 13, color: "#8A8F98", margin: "0 0 6px" }}>Rondas completas</p>
        <input type="number" inputMode="numeric" value={roundsCompletedInput} onChange={(e) => setRoundsCompletedInput(e.target.value)} style={styles.numInput} />
        <p style={{ fontSize: 13, color: "#8A8F98", margin: "12px 0 6px" }}>Ronda parcial — ejercicio en el que te quedaste</p>
        <div style={styles.inputRow}>
          <select value={partialExerciseId} onChange={(e) => setPartialExerciseId(e.target.value)} style={styles.select}>
            <option value="">Ninguna (ronda completa)</option>
            {hiitSession.amrapCircuit.map((c) => (
              <option key={c.exerciseId} value={c.exerciseId}>
                {exerciseName(c.exerciseId, templates.customExerciseNames)}
              </option>
            ))}
          </select>
          <input type="number" inputMode="numeric" placeholder="Reps" value={partialReps} onChange={(e) => setPartialReps(e.target.value)} style={styles.numInput} />
        </div>
      </div>

      <div style={{ margin: "0 16px" }}>
        {saveError && <p style={styles.errorText}>{saveError}</p>}
        <button style={styles.saveBtn} onClick={saveHiitSession}>
          GUARDAR SESIÓN HIIT
        </button>
      </div>
    </div>
  );
}
