import { defaultTemplates } from "./templates.js";

// ===========================================================================
// CLAVES DE ALMACENAMIENTO
// ===========================================================================
export const TEMPLATES_KEY = "entreno-templates-v1";
export const HISTORY_KEY = "entreno-historial-v1";
export const DRAFT_KEY = "entreno-draft-v1";
export const BACKUPS_KEY = "entreno-backups-v1";
export const PREFERENCES_KEY = "entreno-preferences-v1";
export const CYCLE_KEY = "entreno-ciclo-v1";
const LAST_EXPORT_KEY = "entreno-ultima-exportacion-v1";
const MAX_BACKUPS = 20;

function readRaw(key) {
  try {
    return localStorage.getItem(key);
  } catch (err) {
    console.error(`storage: no se pudo leer la clave "${key}"`, err);
    return null;
  }
}
function writeRaw(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (err) {
    console.error(`storage: no se pudo escribir la clave "${key}"`, err);
    return false;
  }
}
function deleteRaw(key) {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error(`storage: no se pudo borrar la clave "${key}"`, err);
  }
}

// ---------------------------------------------------------------------------
// PLANTILLAS
// ---------------------------------------------------------------------------
export function loadTemplates() {
  try {
    const raw = readRaw(TEMPLATES_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.fullBodyTemplate || !parsed.emomTemplate || !parsed.amrapTemplate) return null;
    return parsed;
  } catch (err) {
    console.error("loadTemplates: error al leer/parsear", err);
    return null;
  }
}
export function saveTemplates(templates) {
  try {
    return writeRaw(TEMPLATES_KEY, JSON.stringify(templates));
  } catch (err) {
    console.error("saveTemplates: error al guardar", err);
    return false;
  }
}

// ---------------------------------------------------------------------------
// HISTORIAL
// ---------------------------------------------------------------------------
export function loadHistory() {
  try {
    const raw = readRaw(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("loadHistory: error al leer/parsear", err);
    return [];
  }
}
export function saveHistory(history) {
  try {
    return writeRaw(HISTORY_KEY, JSON.stringify(history));
  } catch (err) {
    console.error("saveHistory: error al guardar", err);
    return false;
  }
}

// ---------------------------------------------------------------------------
// BORRADOR
// ---------------------------------------------------------------------------
export function loadDraft() {
  try {
    const raw = readRaw(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error("loadDraft: error al leer/parsear", err);
    return null;
  }
}
export function saveDraft(draft) {
  try {
    return writeRaw(DRAFT_KEY, JSON.stringify(draft));
  } catch (err) {
    console.error("saveDraft: error al guardar", err);
    return false;
  }
}
export function clearDraft() {
  deleteRaw(DRAFT_KEY);
}

// ---------------------------------------------------------------------------
// COPIAS DE SEGURIDAD INTERNAS
// ---------------------------------------------------------------------------
export function loadBackups() {
  try {
    const raw = readRaw(BACKUPS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("loadBackups: error al leer/parsear", err);
    return [];
  }
}
export function createBackup(reason, templates, history) {
  try {
    const backups = loadBackups();
    const entry = { reason, timestamp: new Date().toISOString(), templates, history };
    const next = [...backups, entry].slice(-MAX_BACKUPS);
    return writeRaw(BACKUPS_KEY, JSON.stringify(next));
  } catch (err) {
    console.error("createBackup: error al guardar", err);
    return false;
  }
}

// ---------------------------------------------------------------------------
// EXPORTAR / IMPORTAR
// ---------------------------------------------------------------------------
export function exportAllData(templates, history, cycle) {
  return JSON.stringify({ exportedAt: new Date().toISOString(), templates, history, cycle }, null, 2);
}

function validateImportShape(obj) {
  if (!obj || typeof obj !== "object") return { valid: false, error: "El archivo no tiene el formato esperado." };
  if (!obj.templates || !obj.templates.fullBodyTemplate || !obj.templates.emomTemplate || !obj.templates.amrapTemplate) {
    return { valid: false, error: "Faltan las plantillas (Full Body, EMOM o AMRAP)." };
  }
  if (!Array.isArray(obj.history)) return { valid: false, error: "El historial no es una lista válida." };

  const seenIds = new Set();
  for (const session of obj.history) {
    if (!session.id || !session.date || !session.type) {
      return { valid: false, error: "Alguna sesión del historial no tiene la estructura esperada." };
    }
    if (seenIds.has(session.id)) {
      return { valid: false, error: `La sesión con id '${session.id}' está duplicada en el archivo importado.` };
    }
    seenIds.add(session.id);
    if (session.type === "fullbody") {
      if (!Array.isArray(session.exercises)) return { valid: false, error: `Sesión ${session.id}: falta la lista de ejercicios.` };
      for (const ex of session.exercises) {
        if (!ex.exerciseId || !Array.isArray(ex.sets)) return { valid: false, error: `Sesión ${session.id}: un ejercicio no tiene exerciseId o series válidas.` };
      }
    }
    if (session.type === "hiit") {
      if (!session.emom || !session.amrap) return { valid: false, error: `Sesión ${session.id}: falta el bloque EMOM o AMRAP.` };
    }
  }
  return { valid: true, error: "" };
}

export function importAllData(jsonText, current) {
  let parsed;
  try {
    parsed = JSON.parse(jsonText);
  } catch (err) {
    return { ok: false, error: "El texto no es un JSON válido." };
  }
  const validation = validateImportShape(parsed);
  if (!validation.valid) return { ok: false, error: validation.error };

  createBackup("antes de importar", current.templates, current.history);
  const okTemplates = saveTemplates(parsed.templates);
  const okHistory = saveHistory(parsed.history);
  if (parsed.cycle) saveCycle(parsed.cycle);
  if (!okTemplates || !okHistory) return { ok: false, error: "No se pudo escribir en el almacenamiento de este dispositivo." };
  return { ok: true, templates: parsed.templates, history: parsed.history, cycle: parsed.cycle || loadCycle() };
}

export function getLastExportDate() {
  return readRaw(LAST_EXPORT_KEY);
}
export function setLastExportDate(iso) {
  writeRaw(LAST_EXPORT_KEY, iso);
}

// ---------------------------------------------------------------------------
// PREFERENCIAS DEL CRONÓMETRO
// ---------------------------------------------------------------------------
const DEFAULT_TIMER_PREFS = { sound: true, vibration: true, autoStart: true };
export function loadTimerPrefs() {
  try {
    const raw = readRaw(PREFERENCES_KEY);
    if (raw) return { ...DEFAULT_TIMER_PREFS, ...JSON.parse(raw) };
  } catch (err) {
    console.error("loadTimerPrefs: error leyendo preferencias", err);
  }
  return { ...DEFAULT_TIMER_PREFS };
}
export function saveTimerPrefs(prefs) {
  writeRaw(PREFERENCES_KEY, JSON.stringify(prefs));
}

// ---------------------------------------------------------------------------
// CICLO DE DESCARGA
// ---------------------------------------------------------------------------
const DEFAULT_CYCLE = { sessionsSinceLastDeload: 0, targetSessions: 24, deloadActive: false };
export function loadCycle() {
  try {
    const raw = readRaw(CYCLE_KEY);
    if (raw) return { ...DEFAULT_CYCLE, ...JSON.parse(raw) };
  } catch (err) {
    console.error("loadCycle: error leyendo el ciclo de descarga", err);
  }
  return { ...DEFAULT_CYCLE };
}
export function saveCycle(cycle) {
  writeRaw(CYCLE_KEY, JSON.stringify(cycle));
}

// ---------------------------------------------------------------------------
// INICIALIZACIÓN
// ---------------------------------------------------------------------------
export function loadTemplatesOrDefault() {
  return loadTemplates() || defaultTemplates();
}
