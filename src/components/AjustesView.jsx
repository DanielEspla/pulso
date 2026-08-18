import React, { useState } from "react";
import { styles } from "../styles.js";
import { exerciseName } from "../lib/templates.js";
import { slugify, todayISO } from "../lib/utils.js";
import { exportAllData, importAllData, getLastExportDate, setLastExportDate } from "../lib/storage.js";
import { ensureAudioUnlocked, playBeep, vibrateShort } from "../lib/timer.js";

function resolveOrCreateExerciseId(name, templates, persistTemplates) {
  const id = slugify(name);
  if (!templates.customExerciseNames[id]) {
    persistTemplates({ ...templates, customExerciseNames: { ...templates.customExerciseNames, [id]: name } });
  }
  return id;
}

export default function AjustesView({ templates, persistTemplates, timerPrefs, updateTimerPrefs, cycle, applyImportedCycle, sessionsUntilDeload, history, setHistory, persistHistory, kettlebellProgress }) {
  const [newFbName, setNewFbName] = useState("");
  const [newEmomName, setNewEmomName] = useState("");
  const [newAmrapName, setNewAmrapName] = useState("");
  const [newAmrapReps, setNewAmrapReps] = useState("10");

  const [restNote, setRestNote] = useState("");
  const [restDate, setRestDate] = useState(todayISO());
  const [restMsg, setRestMsg] = useState("");

  const [importText, setImportText] = useState("");
  const [importMsg, setImportMsg] = useState(null);
  const [lastExport, setLastExport] = useState(getLastExportDate());

  // ---------------- Full Body ----------------
  const updateFbRest = (exerciseId, restSeconds) => {
    const exercises = templates.fullBodyTemplate.exercises.map((e) => (e.exerciseId === exerciseId ? { ...e, restSeconds } : e));
    persistTemplates({ ...templates, fullBodyTemplate: { exercises } });
  };
  const removeFbExercise = (exerciseId) => {
    const exercises = templates.fullBodyTemplate.exercises.filter((e) => e.exerciseId !== exerciseId);
    persistTemplates({ ...templates, fullBodyTemplate: { exercises } });
  };
  const addFbExercise = () => {
    if (!newFbName.trim()) return;
    const id = resolveOrCreateExerciseId(newFbName.trim(), templates, persistTemplates);
    const exercises = [...templates.fullBodyTemplate.exercises, { exerciseId: id, restSeconds: 90 }];
    persistTemplates({ ...templates, fullBodyTemplate: { exercises } });
    setNewFbName("");
  };

  // ---------------- EMOM ----------------
  const removeEmomExercise = (exerciseId) => {
    const exercisePool = templates.emomTemplate.exercisePool.filter((id) => id !== exerciseId);
    persistTemplates({ ...templates, emomTemplate: { ...templates.emomTemplate, exercisePool } });
  };
  const addEmomExercise = () => {
    if (!newEmomName.trim()) return;
    const id = resolveOrCreateExerciseId(newEmomName.trim(), templates, persistTemplates);
    const exercisePool = [...templates.emomTemplate.exercisePool, id];
    persistTemplates({ ...templates, emomTemplate: { ...templates.emomTemplate, exercisePool } });
    setNewEmomName("");
  };

  // ---------------- AMRAP ----------------
  const updateAmrapReps = (exerciseId, targetReps) => {
    const circuit = templates.amrapTemplate.circuit.map((c) => (c.exerciseId === exerciseId ? { ...c, targetReps } : c));
    persistTemplates({ ...templates, amrapTemplate: { ...templates.amrapTemplate, circuit } });
  };
  const removeAmrapExercise = (exerciseId) => {
    const circuit = templates.amrapTemplate.circuit.filter((c) => c.exerciseId !== exerciseId);
    persistTemplates({ ...templates, amrapTemplate: { ...templates.amrapTemplate, circuit } });
  };
  const addAmrapExercise = () => {
    if (!newAmrapName.trim()) return;
    const id = resolveOrCreateExerciseId(newAmrapName.trim(), templates, persistTemplates);
    const circuit = [...templates.amrapTemplate.circuit, { exerciseId: id, targetReps: parseInt(newAmrapReps, 10) || 10 }];
    persistTemplates({ ...templates, amrapTemplate: { ...templates.amrapTemplate, circuit } });
    setNewAmrapName("");
    setNewAmrapReps("10");
  };

  // ---------------- Descanso activo ----------------
  const saveRestSession = () => {
    const session = { id: `${restDate}-descanso-${Date.now()}`, date: restDate, type: "descanso", note: restNote.trim() };
    const ok = persistHistory([...history, session]);
    if (ok) {
      setRestNote("");
      setRestMsg("Registrado.");
      setTimeout(() => setRestMsg(""), 2500);
    }
  };

  // ---------------- Exportar / Importar ----------------
  const exportJson = exportAllData(templates, history, cycle, kettlebellProgress);
  const markExported = () => {
    const iso = new Date().toISOString();
    setLastExportDate(iso);
    setLastExport(iso);
  };
  const downloadJson = () => {
    try {
      const blob = new Blob([exportJson], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pulso-backup-${todayISO()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      markExported();
    } catch (err) {
      console.error("downloadJson: error al descargar", err);
    }
  };
  const copyJson = async () => {
    try {
      await navigator.clipboard.writeText(exportJson);
      markExported();
      setImportMsg({ type: "ok", text: "Copiado al portapapeles." });
      setTimeout(() => setImportMsg(null), 2000);
    } catch (err) {
      setImportMsg({ type: "error", text: "No se pudo copiar automáticamente." });
    }
  };
  const runImport = () => {
    const result = importAllData(importText, { templates, history });
    if (!result.ok) {
      setImportMsg({ type: "error", text: `${result.error} No se han modificado tus datos.` });
      return;
    }
    persistTemplates(result.templates);
    setHistory(result.history);
    if (result.cycle) applyImportedCycle(result.cycle);
    setImportMsg({ type: "ok", text: "Importación completada. Se guardó copia de tus datos anteriores antes de importar." });
    setImportText("");
  };

  return (
    <div>
      <p style={styles.sectionLabel}>Plantillas — Full Body</p>
      <div style={styles.card}>
        {templates.fullBodyTemplate.exercises.map((e) => (
          <div key={e.exerciseId} style={styles.setRow}>
            <span style={{ flex: 1, fontSize: 13.5 }}>{exerciseName(e.exerciseId, templates.customExerciseNames)}</span>
            <input type="number" value={e.restSeconds} onChange={(ev) => updateFbRest(e.exerciseId, parseInt(ev.target.value, 10) || 0)} style={styles.numInput} />
            <span style={{ fontSize: 11, color: "#6F6A67" }}>seg</span>
            <button style={styles.smallBtnDanger} onClick={() => removeFbExercise(e.exerciseId)}>
              Quitar
            </button>
          </div>
        ))}
        <div style={styles.inputRow}>
          <input placeholder="Nuevo ejercicio" value={newFbName} onChange={(e) => setNewFbName(e.target.value)} style={styles.textInput} />
          <button style={styles.addBtn} onClick={addFbExercise}>
            Añadir
          </button>
        </div>
      </div>

      <p style={styles.sectionLabel}>Plantillas — pool de ejercicios EMOM</p>
      <div style={styles.card}>
        {templates.emomTemplate.exercisePool.map((id) => (
          <div key={id} style={styles.setRow}>
            <span style={{ flex: 1, fontSize: 13.5 }}>{exerciseName(id, templates.customExerciseNames)}</span>
            <button style={styles.smallBtnDanger} onClick={() => removeEmomExercise(id)}>
              Quitar
            </button>
          </div>
        ))}
        <div style={styles.inputRow}>
          <input placeholder="Nuevo ejercicio" value={newEmomName} onChange={(e) => setNewEmomName(e.target.value)} style={styles.textInput} />
          <button style={styles.addBtn} onClick={addEmomExercise}>
            Añadir
          </button>
        </div>
      </div>

      <p style={styles.sectionLabel}>Plantillas — circuito AMRAP</p>
      <div style={styles.card}>
        {templates.amrapTemplate.circuit.map((c) => (
          <div key={c.exerciseId} style={styles.setRow}>
            <span style={{ flex: 1, fontSize: 13.5 }}>{exerciseName(c.exerciseId, templates.customExerciseNames)}</span>
            <input type="number" value={c.targetReps} onChange={(ev) => updateAmrapReps(c.exerciseId, parseInt(ev.target.value, 10) || 0)} style={styles.numInput} />
            <span style={{ fontSize: 11, color: "#6F6A67" }}>reps</span>
            <button style={styles.smallBtnDanger} onClick={() => removeAmrapExercise(c.exerciseId)}>
              Quitar
            </button>
          </div>
        ))}
        <div style={styles.inputRow}>
          <input placeholder="Nuevo ejercicio" value={newAmrapName} onChange={(e) => setNewAmrapName(e.target.value)} style={styles.textInput} />
          <input type="number" value={newAmrapReps} onChange={(e) => setNewAmrapReps(e.target.value)} style={styles.numInput} />
          <button style={styles.addBtn} onClick={addAmrapExercise}>
            Añadir
          </button>
        </div>
      </div>

      <p style={styles.sectionLabel}>Cronómetro</p>
      <div style={styles.card}>
        <div style={styles.settingsRow}>
          <span style={styles.settingsLabel}>Inicio automático</span>
          <button style={{ ...styles.toggleChip, ...(timerPrefs.autoStart ? styles.toggleChipActive : {}) }} onClick={() => updateTimerPrefs({ autoStart: !timerPrefs.autoStart })}>
            {timerPrefs.autoStart ? "Activado" : "Desactivado"}
          </button>
        </div>
        <div style={styles.settingsRow}>
          <span style={styles.settingsLabel}>Sonido</span>
          <button style={{ ...styles.toggleChip, ...(timerPrefs.sound ? styles.toggleChipActive : {}) }} onClick={() => updateTimerPrefs({ sound: !timerPrefs.sound })}>
            {timerPrefs.sound ? "Activado" : "Desactivado"}
          </button>
        </div>
        <div style={{ ...styles.settingsRow, borderBottom: "none" }}>
          <span style={styles.settingsLabel}>Vibración</span>
          <button style={{ ...styles.toggleChip, ...(timerPrefs.vibration ? styles.toggleChipActive : {}) }} onClick={() => updateTimerPrefs({ vibration: !timerPrefs.vibration })}>
            {timerPrefs.vibration ? "Activada" : "Desactivada"}
          </button>
        </div>
        <p style={{ fontSize: 11.5, color: "#6F6A67", margin: "8px 0 0", lineHeight: 1.5 }}>
          En iPhone, Safari no permite vibrar desde una web — es una limitación de Apple, no de esta app. Solo funcionará el sonido.
        </p>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button
            style={styles.smallBtn}
            onClick={() => {
              ensureAudioUnlocked();
              playBeep();
            }}
          >
            Probar sonido
          </button>
          <button style={styles.smallBtn} onClick={vibrateShort}>
            Probar vibración
          </button>
        </div>
      </div>

      <p style={styles.sectionLabel}>Ciclo de descarga</p>
      <div style={styles.card}>
        <p style={{ fontSize: 13.5, margin: "0 0 4px" }}>
          Sesiones entrenadas: {cycle.sessionsSinceLastDeload} de {cycle.targetSessions}
        </p>
        <p style={{ fontSize: 12, color: "#6F6A67", margin: 0 }}>
          {cycle.deloadActive ? "Semana de descarga activa." : `Próxima descarga en ${sessionsUntilDeload} sesiones.`}
        </p>
      </div>

      <p style={styles.sectionLabel}>Programa de Kettlebell</p>
      <div style={styles.card}>
        <p style={{ fontSize: 13.5, margin: "0 0 4px" }}>
          Sesión {kettlebellProgress.sessionsCompleted} de 36 completadas
        </p>
        <p style={{ fontSize: 12, color: "#6F6A67", margin: 0 }}>
          {kettlebellProgress.sessionsCompleted >= 36
            ? "Programa completado."
            : `Fase actual: ${templates.kettlebellProgram.phases[Math.min(2, Math.floor(kettlebellProgress.sessionsCompleted / 12))].name}`}
        </p>
      </div>

      <p style={styles.sectionLabel}>Descanso activo</p>
      <div style={styles.card}>
        <div style={styles.inputRow}>
          <input type="date" value={restDate} onChange={(e) => setRestDate(e.target.value)} style={styles.textInput} />
        </div>
        <div style={{ marginTop: 8 }}>
          <input placeholder="Nota (opcional)" value={restNote} onChange={(e) => setRestNote(e.target.value)} style={{ ...styles.textInput, width: "100%" }} />
        </div>
        <div style={{ marginTop: 8 }}>
          <button style={styles.smallBtn} onClick={saveRestSession}>
            Registrar descanso
          </button>
          {restMsg && <span style={{ ...styles.successText, marginLeft: 10 }}>{restMsg}</span>}
        </div>
      </div>

      <p style={styles.sectionLabel}>Exportar</p>
      <div style={styles.card}>
        <p style={{ fontSize: 12, color: "#6F6A67", margin: "0 0 8px" }}>
          {lastExport ? `Última copia exportada: ${new Date(lastExport).toLocaleString("es-ES")}.` : "Todavía no has exportado ninguna copia."}
        </p>
        <textarea readOnly value={exportJson} style={styles.jsonTextarea} />
        <div style={styles.dataRowButtons}>
          <button style={styles.smallBtn} onClick={downloadJson}>
            Descargar archivo
          </button>
          <button style={styles.smallBtn} onClick={copyJson}>
            Copiar
          </button>
        </div>
      </div>

      <p style={styles.sectionLabel}>Importar</p>
      <div style={styles.card}>
        <p style={{ fontSize: 12, color: "#6F6A67", margin: "0 0 8px", lineHeight: 1.5 }}>
          Se crea copia de seguridad de tus datos actuales antes de importar. Si el archivo no es válido, no se cambia nada.
        </p>
        <textarea value={importText} onChange={(e) => setImportText(e.target.value)} placeholder="Pega aquí el JSON exportado…" style={styles.jsonTextarea} />
        <button style={{ ...styles.saveBtn, opacity: importText.trim() ? 1 : 0.4 }} disabled={!importText.trim()} onClick={runImport}>
          Importar
        </button>
        {importMsg && <p style={importMsg.type === "ok" ? styles.successText : styles.errorText}>{importMsg.text}</p>}
      </div>

      <div style={styles.deviceNotice}>
        <p style={styles.deviceNoticeText}>Los datos están guardados únicamente en este dispositivo.</p>
      </div>
    </div>
  );
}
