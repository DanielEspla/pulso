// Cuenta sesiones de Full Body y HIIT entrenadas (no descanso activo, no
// fechas de calendario) — así una semana sin entrenar no adelanta el
// contador ni provoca una descarga fuera de sitio.

export function shouldOfferDeload(cycle) {
  return !cycle.deloadActive && cycle.sessionsSinceLastDeload >= cycle.targetSessions;
}

export function registerTrainedSession(cycle, sessionType) {
  if (sessionType !== "fullbody" && sessionType !== "hiit") return cycle;
  return { ...cycle, sessionsSinceLastDeload: cycle.sessionsSinceLastDeload + 1 };
}

export function startDeload(cycle) {
  return { ...cycle, deloadActive: true };
}

export function postponeDeload(cycle) {
  return { ...cycle, targetSessions: cycle.targetSessions + 6 };
}

export function finishDeload() {
  return { sessionsSinceLastDeload: 0, targetSessions: 24, deloadActive: false };
}

export function sessionsUntilDeload(cycle) {
  return Math.max(0, cycle.targetSessions - cycle.sessionsSinceLastDeload);
}
