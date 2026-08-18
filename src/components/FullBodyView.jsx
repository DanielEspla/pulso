import React, { useState } from "react";
import { styles } from "../styles.js";
import { exerciseName } from "../lib/templates.js";
import { fullBodyWeightSeries, lastFullBodySessionSets } from "../lib/metrics.js";
import { roundKg, fmtDate } from "../lib/utils.js";
import { ensureAudioUnlocked } from "../lib/timer.js";

function defaultInput(i) {
  return { weight: "", reps: "", kind: "trabajo", ...(i || {}) };
}

export default function FullBodyView({
  templates,
  history,
  persistHistory,
  cycle,
  date,
  setDate,
  draftSets,
  setDraftSets,
  blockedByRecovery,
  startRestTimer,
  onSessionSaved,
}) {
  const [inputs, setInputs] = useState({});
  const [saveMsg, setSaveMsg] = useState("");
  const [saveError, setSaveError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [justAdded, setJustAdded] = useState(false);

  const slots = templates.fullBodyTemplate.exercises;
  const current = slots[currentIndex];
  const exerciseId = current.exerciseId;
  const restSeconds = current.restSeconds;

  const updateInput = (field, value) => {
    setInputs((prev) => ({ ...prev, [exerciseId]: { ...defaultInput(prev[exerciseId]), [field]: value } }));
  };

  const deloadSuggestion = (id) => {
    if (!cycle.deloadActive) return null;
    const series = fullBodyWeightSeries(history, id).filter((p) => !p.deloadWeek);
    if (series.length === 0) return null;
    const lastWeight = series[series.length - 1].weight;
    return roundKg(lastWeight * 0.8);
  };

  const addSet = () => {
    ensureAudioUnlocked();
    const cur = defaultInput(inputs[exerciseId]);
    const weight = parseFloat(cur.weight);
    const reps = parseInt(cur.reps, 10);
    if (Number.isNaN(weight) || Number.isNaN(reps)) return;

    setDraftSets((prev) => {
      const existing = prev[exerciseId] || [];
      return { ...prev, [exerciseId]: [...existing, { weight, reps, kind: cur.kind }] };
    });
    setInputs((prev) => ({ ...prev, [exerciseId]: { weight: "", reps: "", kind: cur.kind } }));
    startRestTimer(exerciseName(exerciseId, templates.customExerciseNames), restSeconds);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  const removeSet = (idx) => {
    setDraftSets((prev) => {
      const updated = [...(prev[exerciseId] || [])];
      updated.splice(idx, 1);
      const next = { ...prev, [exerciseId]: updated };
      if (updated.length === 0) delete next[exerciseId];
      return next;
    });
  };

  const totalSets = Object.values(draftSets).reduce((sum, sets) => sum + sets.length, 0);

  const saveSession = () => {
    if (totalSets === 0) return;
    const session = {
      id: `${date}-fullbody-${Date.now()}`,
      date,
      type: "fullbody",
      deloadWeek: cycle.deloadActive,
      exercises: Object.entries(draftSets).map(([id, sets]) => ({ exerciseId: id, sets })),
    };
    const ok = persistHistory([...history, session]);
    if (!ok) {
      setSaveError("No se pudo guardar en este dispositivo. Tus series siguen aquí, inténtalo de nuevo.");
      return;
    }
    setSaveError("");
    setDraftSets({});
    setInputs({});
    setCurrentIndex(0);
    onSessionSaved();
    setSaveMsg("Entrenamiento guardado.");
    setTimeout(() => setSaveMsg(""), 3500);
  };

  const sets = draftSets[exerciseId] || [];
  const input = defaultInput(inputs[exerciseId]);
  const suggestion = deloadSuggestion(exerciseId);
  const lastSession = lastFullBodySessionSets(history, exerciseId);
  const isLast = currentIndex === slots.length - 1;

  return (
    <div>
      <div style={{ ...styles.card, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13, color: "#6F6A67" }}>Fecha</span>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={styles.textInput} />
      </div>

      <div style={styles.dotsRow}>
        {slots.map((s, i) => {
          const hasSets = (draftSets[s.exerciseId] || []).length > 0;
          return (
            <button
              key={s.exerciseId}
              style={{ ...styles.dot, ...(hasSets ? styles.dotDone : i === currentIndex ? styles.dotCurrent : {}) }}
              onClick={() => setCurrentIndex(i)}
              aria-label={`Ir a ${exerciseName(s.exerciseId, templates.customExerciseNames)}`}
            />
          );
        })}
      </div>
      <p style={styles.focusCounter}>
        Ejercicio {currentIndex + 1} de {slots.length}
      </p>
      <p style={styles.focusExerciseName}>{exerciseName(exerciseId, templates.customExerciseNames)}</p>

      <div style={styles.card}>
        {lastSession && (
          <p style={{ fontSize: 12, color: "#6F6A67", margin: "0 0 8px" }}>
            Última vez ({fmtDate(lastSession.date)}
            {lastSession.deloadWeek ? ", descarga" : ""}):{" "}
            {lastSession.sets.map((s, i) => `${s.weight}x${s.reps}${s.kind === "aproximacion" ? " aprox" : ""}`).join(", ")}
          </p>
        )}
        {suggestion !== null && (
          <p style={{ fontSize: 12, color: "#B86C4E", margin: "0 0 8px" }}>Descarga: peso sugerido {suggestion} kg (−20%), 2 series de trabajo</p>
        )}

        {sets.map((s, idx) => (
          <div key={idx} style={styles.setRow}>
            <span style={{ ...styles.setBadge, ...(s.kind === "trabajo" ? styles.setBadgeWork : {}) }}>{s.kind === "trabajo" ? "trabajo" : "aprox"}</span>
            <span style={{ flex: 1, fontSize: 13.5 }}>
              {s.weight}kg × {s.reps}
            </span>
            <button style={styles.smallBtn} onClick={() => removeSet(idx)}>
              Quitar
            </button>
          </div>
        ))}

        {justAdded && <p style={{ ...styles.successText, fontWeight: 600 }}>✓ Serie añadida</p>}
        <div style={styles.inputRow}>
          <input type="number" inputMode="decimal" placeholder="Kg" value={input.weight} onChange={(e) => updateInput("weight", e.target.value)} style={styles.numInput} />
          <input type="number" inputMode="numeric" placeholder="Reps" value={input.reps} onChange={(e) => updateInput("reps", e.target.value)} style={styles.numInput} />
          <select value={input.kind} onChange={(e) => updateInput("kind", e.target.value)} style={styles.select}>
            <option value="trabajo">Trabajo</option>
            <option value="aproximacion">Aproximación</option>
          </select>
          <button style={styles.addBtn} onClick={addSet}>
            +
          </button>
        </div>
      </div>

      <div style={{ margin: "0 16px", display: "flex", gap: 8 }}>
        {currentIndex > 0 && (
          <button style={styles.smallBtn} onClick={() => setCurrentIndex((i) => i - 1)}>
            ← Anterior
          </button>
        )}
        {!isLast && (
          <button style={{ ...styles.saveBtn, flex: 1 }} onClick={() => setCurrentIndex((i) => i + 1)}>
            SIGUIENTE EJERCICIO →
          </button>
        )}
      </div>

      {isLast && (
        <div style={{ margin: "12px 16px 0" }}>
          {saveMsg && <p style={styles.successText}>{saveMsg}</p>}
          {saveError && <p style={styles.errorText}>{saveError}</p>}
          <button
            style={{ ...styles.saveBtn, opacity: totalSets === 0 || blockedByRecovery ? 0.4 : 1 }}
            disabled={totalSets === 0 || blockedByRecovery}
            onClick={saveSession}
          >
            FINALIZAR Y GUARDAR {totalSets > 0 ? `(${totalSets} series)` : ""}
          </button>
        </div>
      )}
    </div>
  );
}
