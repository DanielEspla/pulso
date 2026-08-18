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

// Fechas únicas entrenadas (Full Body o Kettlebell, no descanso), ordenadas.
function trainingDates(history) {
  const set = new Set(history.filter((s) => s.type === "fullbody" || s.type === "kettlebell").map((s) => s.date));
  return [...set].sort();
}
function daysBetween(a, b) {
  return Math.round((new Date(b) - new Date(a)) / 86400000);
}

// Racha actual: sesiones consecutivas permitiendo como máximo 1 día de
// descanso entre medias (2 días de hueco), rompe si hay más.
export function currentStreak(history) {
  const dates = trainingDates(history);
  if (dates.length === 0) return 0;
  let streak = 1;
  for (let i = dates.length - 1; i > 0; i--) {
    if (daysBetween(dates[i - 1], dates[i]) <= 2) streak++;
    else break;
  }
  return streak;
}

export function longestStreak(history) {
  const dates = trainingDates(history);
  if (dates.length === 0) return 0;
  let max = 1;
  let cur = 1;
  for (let i = 1; i < dates.length; i++) {
    if (daysBetween(dates[i - 1], dates[i]) <= 2) {
      cur++;
      max = Math.max(max, cur);
    } else {
      cur = 1;
    }
  }
  return max;
}

export function sessionsInMonth(history, yearMonth) {
  return history.filter((s) => (s.type === "fullbody" || s.type === "kettlebell") && s.date.startsWith(yearMonth)).length;
}

// Últimos 7 días (incluye hoy), marcando si hubo entreno ese día.
export function last7DaysStatus(history) {
  const days = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    const trained = history.some((s) => (s.type === "fullbody" || s.type === "kettlebell") && s.date === iso);
    days.push({ date: iso, trained, isToday: i === 0 });
  }
  return days;
}

// Vueltas completadas por sesión de Kettlebell, filtrado por tipo de día
// (martes/jueves/sábado) — la métrica de progreso que pediste tú mismo:
// "si la semana siguiente haces más vueltas con la misma técnica, progresas".
export function kettlebellRoundsSeries(history, dayType) {
  return history
    .filter((s) => s.type === "kettlebell" && s.dayType === dayType)
    .map((s) => ({ date: s.date, rounds: s.roundsCompleted || 0, deloadWeek: !!s.deloadWeek }))
    .sort((a, b) => (a.date < b.date ? -1 : 1));
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
