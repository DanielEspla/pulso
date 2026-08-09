// Evolución de peso de un ejercicio de Full Body: por cada sesión donde
// aparece, el peso máximo entre las series de trabajo (no aproximaciones).
// Última sesión de Full Body en la que aparece este ejercicio — para
// mostrarla como referencia mientras registras la sesión de hoy.
export function lastFullBodySessionSets(history, exerciseId) {
  const sessions = history
    .filter((s) => s.type === "fullbody")
    .filter((s) => s.exercises?.some((e) => e.exerciseId === exerciseId))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  if (sessions.length === 0) return null;
  const entry = sessions[0].exercises.find((e) => e.exerciseId === exerciseId);
  return { date: sessions[0].date, sets: entry.sets, deloadWeek: !!sessions[0].deloadWeek };
}

export function fullBodyWeightSeries(history, exerciseId) {
  return history
    .filter((s) => s.type === "fullbody")
    .map((s) => {
      const entry = s.exercises?.find((e) => e.exerciseId === exerciseId);
      if (!entry) return null;
      const workSets = entry.sets.filter((set) => set.kind === "trabajo");
      if (workSets.length === 0) return null;
      const maxWeight = Math.max(...workSets.map((set) => set.weight));
      return { date: s.date, weight: maxWeight, deloadWeek: !!s.deloadWeek };
    })
    .filter(Boolean)
    .sort((a, b) => (a.date < b.date ? -1 : 1));
}

// Reps totales del bloque EMOM por sesión de HIIT.
export function emomRepsSeries(history) {
  return history
    .filter((s) => s.type === "hiit" && s.emom)
    .map((s) => ({
      date: s.date,
      reps: (s.emom.rounds || []).reduce((sum, r) => sum + (r.reps || 0), 0),
      deloadWeek: !!s.deloadWeek,
    }))
    .sort((a, b) => (a.date < b.date ? -1 : 1));
}

// Rondas completas del bloque AMRAP por sesión de HIIT.
export function amrapRoundsSeries(history) {
  return history
    .filter((s) => s.type === "hiit" && s.amrap)
    .map((s) => ({
      date: s.date,
      rounds: s.amrap.roundsCompleted || 0,
      deloadWeek: !!s.deloadWeek,
    }))
    .sort((a, b) => (a.date < b.date ? -1 : 1));
}

export function listExercisesWithFullBodyData(history) {
  const ids = new Set();
  history
    .filter((s) => s.type === "fullbody")
    .forEach((s) => s.exercises?.forEach((e) => ids.add(e.exerciseId)));
  return [...ids];
}
