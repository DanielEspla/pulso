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

  const slots = templates.fullBodyTemplate.exercises;

  const updateInput = (exerciseId, field, value) => {
    setInputs((prev) => ({ ...prev, [exerciseId]: { ...defaultInput(prev[exerciseId]), [field]: value } }));
  };

  const deloadSuggestion = (exerciseId) => {
    if (!cycle.deloadActive) return null;
    const series = fullBodyWeightSeries(history, exerciseId).filter((p) => !p.deloadWeek);
    if (series.length === 0) return null;
    const lastWeight = series[series.length - 1].weight;
    return roundKg(lastWeight * 0.8);
  };

  const addSet = (exerciseId, restSeconds) => {
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
  };

  const removeSet = (exerciseId, idx) => {
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
      exercises: Object.entries(draftSets).map(([exerciseId, sets]) => ({ exerciseId, sets })),
    };
    const ok = persistHistory([...history, session]);
    if (!ok) {
      setSaveError("No se pudo guardar en este dispositivo. Tus series siguen aquí, inténtalo de nuevo.");
      return;
    }
    setSaveError("");
    setDraftSets({});
    setInputs({});
    onSessionSaved();
    setSaveMsg("Entrenamiento guardado.");
    setTimeout(() => setSaveMsg(""), 3500);
  };

  return (
    <div>
      <div style={{ ...styles.card, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13, color: "#8A8F98" }}>Fecha</span>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={styles.textInput} />
      </div>

      {slots.map(({ exerciseId, restSeconds }) => {
        const sets = draftSets[exerciseId] || [];
        const input = defaultInput(inputs[exerciseId]);
        const suggestion = deloadSuggestion(exerciseId);
        const lastSession = lastFullBodySessionSets(history, exerciseId);
        return (
          <div key={exerciseId} style={styles.card}>
            <p style={styles.cardTitle}>{exerciseName(exerciseId, templates.customExerciseNames)}</p>
            {lastSession && (
              <p style={{ fontSize: 12, color: "#8A8F98", margin: "0 0 8px" }}>
                Última vez ({fmtDate(lastSession.date)}
                {lastSession.deloadWeek ? ", descarga" : ""}):{" "}
                {lastSession.sets.map((s, i) => `${s.weight}x${s.reps}${s.kind === "aproximacion" ? " aprox" : ""}`).join(", ")}
              </p>
            )}
            {suggestion !== null && (
              <p style={{ fontSize: 12, color: "#F2B705", margin: "0 0 8px" }}>
                Descarga: peso sugerido {suggestion} kg (−20%), 2 series de trabajo
              </p>
            )}

            {sets.map((s, idx) => (
              <div key={idx} style={styles.setRow}>
                <span style={{ ...styles.setBadge, ...(s.kind === "trabajo" ? styles.setBadgeWork : {}) }}>{s.kind === "trabajo" ? "trabajo" : "aprox"}</span>
                <span style={{ flex: 1, fontSize: 13.5 }}>
                  {s.weight}kg × {s.reps}
                </span>
                <button style={styles.smallBtn} onClick={() => removeSet(exerciseId, idx)}>
                  Quitar
                </button>
              </div>
            ))}

            <div style={styles.inputRow}>
              <input
                type="number"
                inputMode="decimal"
                placeholder="Kg"
                value={input.weight}
                onChange={(e) => updateInput(exerciseId, "weight", e.target.value)}
                style={styles.numInput}
              />
              <input
                type="number"
                inputMode="numeric"
                placeholder="Reps"
                value={input.reps}
                onChange={(e) => updateInput(exerciseId, "reps", e.target.value)}
                style={styles.numInput}
              />
              <select value={input.kind} onChange={(e) => updateInput(exerciseId, "kind", e.target.value)} style={styles.select}>
                <option value="trabajo">Trabajo</option>
                <option value="aproximacion">Aproximación</option>
              </select>
              <button style={styles.addBtn} onClick={() => addSet(exerciseId, restSeconds)}>
                +
              </button>
            </div>
          </div>
        );
      })}

      <div style={{ margin: "0 16px" }}>
        {saveMsg && <p style={styles.successText}>{saveMsg}</p>}
        {saveError && <p style={styles.errorText}>{saveError}</p>}
        <button
          style={{ ...styles.saveBtn, opacity: totalSets === 0 || blockedByRecovery ? 0.4 : 1 }}
          disabled={totalSets === 0 || blockedByRecovery}
          onClick={saveSession}
        >
          GUARDAR ENTRENAMIENTO {totalSets > 0 ? `(${totalSets} series)` : ""}
        </button>
      </div>
    </div>
  );
}
