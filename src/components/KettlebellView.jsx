import React, { useState, useEffect } from "react";
import { styles } from "../styles.js";
import { exerciseName } from "../lib/templates.js";
import { kettlebellPhaseIndex, kettlebellProgramComplete, TOTAL_PROGRAM_SESSIONS } from "../lib/templates.js";
import { todayISO } from "../lib/utils.js";
import { ensureAudioUnlocked } from "../lib/timer.js";

const DAY_LABELS = { martes: "Martes — Fuerza", jueves: "Jueves — Circuito", sabado: "Sábado — Fuerza + final" };

function todayDefaultDayType() {
  const day = new Date().getDay(); // 0=domingo ... 6=sábado
  if (day === 2) return "martes";
  if (day === 4) return "jueves";
  if (day === 6) return "sabado";
  return "martes"; // fuera de esos días, se puede elegir a mano igualmente
}

function formatExercise(ex, customNames) {
  const name = exerciseName(ex.exerciseId, customNames);
  const side = ex.perSide ? "/lado" : "";
  const qty = ex.seconds ? `${ex.seconds}s${side}` : `${ex.reps}${side}`;
  const note = ex.note ? ` (${ex.note})` : "";
  return `${name}: ${qty} · ${ex.weight}kg${note}`;
}

export default function KettlebellView({ templates, history, persistHistory, cycle, kettlebellProgress, persistKettlebellProgress, startRestTimer, onSessionSaved }) {
  const [dayType, setDayType] = useState(todayDefaultDayType());
  const [rounds, setRounds] = useState(0);
  const [finalRounds, setFinalRounds] = useState(0);
  const [saveMsg, setSaveMsg] = useState("");

  const program = templates.kettlebellProgram;
  const phaseIndex = kettlebellPhaseIndex(kettlebellProgress.sessionsCompleted);
  const complete = kettlebellProgramComplete(kettlebellProgress.sessionsCompleted);
  const phase = program.phases[phaseIndex];
  const dayPlan = phase[dayType];
  const restSeconds = program.restSecondsBetweenRounds;
  const weightCap = cycle.deloadActive ? program.weights.light : null; // en descarga, tope de 12kg

  useEffect(() => {
    setRounds(0);
    setFinalRounds(0);
    setSaveMsg("");
  }, [dayType]);

  const displayExercises = dayPlan.exercises.map((ex) => (weightCap && ex.weight > weightCap ? { ...ex, weight: weightCap } : ex));
  const displayFinalExercises = dayPlan.finalExercises?.map((ex) => (weightCap && ex.weight > weightCap ? { ...ex, weight: weightCap } : ex));

  const addRound = () => {
    ensureAudioUnlocked();
    setRounds((r) => r + 1);
    startRestTimer(`Descanso — ${DAY_LABELS[dayType]}`, restSeconds);
  };

  const startCircuito = () => {
    ensureAudioUnlocked();
    startRestTimer(`Circuito — ${DAY_LABELS[dayType]}`, dayPlan.durationMin * 60);
  };

  const startFinal = () => {
    ensureAudioUnlocked();
    startRestTimer(`Final corto — ${DAY_LABELS[dayType]}`, dayPlan.finalDurationMin * 60);
  };

  const saveSession = () => {
    const session = {
      id: `${todayISO()}-kettlebell-${Date.now()}`,
      date: todayISO(),
      type: "kettlebell",
      dayType,
      phaseIndex,
      sessionNumberInProgram: kettlebellProgress.sessionsCompleted + 1,
      roundsCompleted: rounds,
      finalRoundsCompleted: dayType === "sabado" ? finalRounds : null,
      deloadWeek: cycle.deloadActive,
    };
    const ok = persistHistory([...history, session]);
    if (!ok) {
      setSaveMsg("");
      return;
    }
    persistKettlebellProgress({ sessionsCompleted: kettlebellProgress.sessionsCompleted + 1 });
    onSessionSaved();
    setRounds(0);
    setFinalRounds(0);
    setSaveMsg("Sesión de kettlebell guardada.");
    setTimeout(() => setSaveMsg(""), 3500);
  };

  return (
    <div>
      <div style={styles.card}>
        <p style={styles.cardTitle}>
          {complete ? "Programa de 12 semanas completado" : `Sesión ${kettlebellProgress.sessionsCompleted + 1} de ${TOTAL_PROGRAM_SESSIONS}`}
        </p>
        <p style={{ fontSize: 13, color: "#F2B705", margin: 0 }}>
          {phase.name} · {phase.weekRange}
        </p>
        {complete && (
          <p style={{ fontSize: 12, color: "#8A8F98", margin: "6px 0 0" }}>
            Has completado las {TOTAL_PROGRAM_SESSIONS} sesiones. La app te sigue mostrando la Fase 3 hasta que decidas el siguiente programa
            (clean, push press, sentadilla en rack).
          </p>
        )}
        {cycle.deloadActive && <p style={{ fontSize: 12, color: "#F2B705", margin: "6px 0 0" }}>Descarga: peso máximo 12kg esta semana.</p>}
      </div>

      <div style={styles.dotsRow}>
        {Object.keys(DAY_LABELS).map((key) => (
          <button
            key={key}
            style={{ ...styles.dot, ...(dayType === key ? styles.dotCurrent : {}) }}
            onClick={() => setDayType(key)}
            aria-label={DAY_LABELS[key]}
          />
        ))}
      </div>
      <p style={styles.focusCounter}>Kettlebell</p>
      <p style={styles.focusExerciseName}>{DAY_LABELS[dayType]}</p>

      {dayType === "jueves" ? (
        <>
          <div style={styles.card}>
            <p style={styles.cardTitle}>
              Circuito — {dayPlan.durationMin} min{dayPlan.note ? ` (${dayPlan.note})` : ""}
            </p>
            {displayExercises.map((ex, i) => (
              <p key={i} style={{ fontSize: 13, color: "#F5F5F0", margin: "4px 0" }}>
                {formatExercise(ex, templates.customExerciseNames)}
              </p>
            ))}
            <button style={{ ...styles.smallBtn, marginTop: 10 }} onClick={startCircuito}>
              Empezar circuito
            </button>
          </div>
          <div style={styles.card}>
            <p style={styles.cardTitle}>Vueltas completadas</p>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button style={styles.smallBtn} onClick={() => setRounds((r) => Math.max(0, r - 1))}>
                −
              </button>
              <span style={{ fontSize: 22, fontFamily: "'Oswald', sans-serif", fontWeight: 700 }}>{rounds}</span>
              <button style={styles.smallBtn} onClick={() => setRounds((r) => r + 1)}>
                +
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div style={styles.card}>
            <p style={styles.cardTitle}>Primera parte — {dayPlan.rounds} vueltas</p>
            {displayExercises.map((ex, i) => (
              <p key={i} style={{ fontSize: 13, color: "#F5F5F0", margin: "4px 0" }}>
                {formatExercise(ex, templates.customExerciseNames)}
              </p>
            ))}
            <p style={{ fontSize: 12, color: "#8A8F98", margin: "8px 0 0" }}>Vueltas completadas: {rounds}</p>
            <button style={{ ...styles.addBtn, marginTop: 8 }} onClick={addRound}>
              + Vuelta completada (inicia descanso)
            </button>
          </div>

          {dayType === "sabado" && (
            <div style={styles.card}>
              <p style={styles.cardTitle}>Final corto — {dayPlan.finalDurationMin} min</p>
              {displayFinalExercises.map((ex, i) => (
                <p key={i} style={{ fontSize: 13, color: "#F5F5F0", margin: "4px 0" }}>
                  {formatExercise(ex, templates.customExerciseNames)}
                </p>
              ))}
              <button style={{ ...styles.smallBtn, marginTop: 8 }} onClick={startFinal}>
                Empezar final corto
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10 }}>
                <span style={{ fontSize: 12, color: "#8A8F98" }}>Vueltas del final:</span>
                <button style={styles.smallBtn} onClick={() => setFinalRounds((r) => Math.max(0, r - 1))}>
                  −
                </button>
                <span style={{ fontSize: 18, fontFamily: "'Oswald', sans-serif", fontWeight: 700 }}>{finalRounds}</span>
                <button style={styles.smallBtn} onClick={() => setFinalRounds((r) => r + 1)}>
                  +
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <div style={{ margin: "0 16px" }}>
        {saveMsg && <p style={styles.successText}>{saveMsg}</p>}
        <button style={styles.saveBtn} onClick={saveSession}>
          GUARDAR SESIÓN
        </button>
      </div>
    </div>
  );
}
