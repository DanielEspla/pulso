// Registro simple de ejercicios: id -> nombre. Compartido entre Full Body,
// EMOM y AMRAP (un mismo ejercicio puede aparecer en varias plantillas).
export const EXERCISES = {
  "pecho-maquina-unilateral-inclinado": { id: "pecho-maquina-unilateral-inclinado", name: "Pecho máquina unilateral inclinado" },
  "jalon-al-pecho": { id: "jalon-al-pecho", name: "Jalón al pecho" },
  "hombro-maquina-unilateral": { id: "hombro-maquina-unilateral", name: "Hombro máquina unilateral" },
  "prensa-plana-maquina": { id: "prensa-plana-maquina", name: "Prensa plana máquina" },
  "peso-muerto-rumano-mancuerna": { id: "peso-muerto-rumano-mancuerna", name: "Peso muerto rumano mancuerna" },

  burpees: { id: "burpees", name: "Burpees" },
  "kettlebell-swing": { id: "kettlebell-swing", name: "Kettlebell swing" },
  "mountain-climbers": { id: "mountain-climbers", name: "Mountain climbers" },
  "zancadas-salto": { id: "zancadas-salto", name: "Zancadas con salto" },

  "sentadilla-salto": { id: "sentadilla-salto", name: "Sentadilla con salto" },
  flexiones: { id: "flexiones", name: "Flexiones" },
  zancadas: { id: "zancadas", name: "Zancadas" },

  "peso-muerto-kettlebell": { id: "peso-muerto-kettlebell", name: "Peso muerto con kettlebell" },
  "sentadilla-kettlebell-frontal": { id: "sentadilla-kettlebell-frontal", name: "Sentadilla con kettlebell al pecho" },
  "remo-una-mano-kettlebell": { id: "remo-una-mano-kettlebell", name: "Remo a una mano con kettlebell" },
  "press-tumbado-kettlebell": { id: "press-tumbado-kettlebell", name: "Press tumbado con kettlebell" },
  "plancha-carga-lateral": { id: "plancha-carga-lateral", name: "Plancha de carga lateral (suitcase hold)" },
  "swing-kettlebell": { id: "swing-kettlebell", name: "Swing con kettlebell" },
  "press-cabeza-kettlebell": { id: "press-cabeza-kettlebell", name: "Press por encima de la cabeza con kettlebell" },
};

export function exerciseName(id, customNames) {
  return customNames?.[id] || EXERCISES[id]?.name || id;
}

// Plantillas por defecto — todo editable después desde Ajustes.
// Los ejercicios de Full Body y sus segundos de descanso son los que Dani
// pasó tal cual. Los de EMOM/AMRAP son un punto de partida razonable,
// pensados para poder cambiarlos sin tocar código.
export function defaultTemplates() {
  return {
    customExerciseNames: {},
    fullBodyTemplate: {
      exercises: [
        { exerciseId: "pecho-maquina-unilateral-inclinado", restSeconds: 90 },
        { exerciseId: "jalon-al-pecho", restSeconds: 90 },
        { exerciseId: "hombro-maquina-unilateral", restSeconds: 75 },
        { exerciseId: "prensa-plana-maquina", restSeconds: 120 },
        { exerciseId: "peso-muerto-rumano-mancuerna", restSeconds: 90 },
      ],
    },
    emomTemplate: {
      exercisePool: ["burpees", "kettlebell-swing", "mountain-climbers", "zancadas-salto"],
      normal: { workSeconds: 40, restSeconds: 20, durationOptionsMin: [12, 15, 18, 20] },
      deload: { workSeconds: 30, restSeconds: 30, durationMin: 12 },
    },
    amrapTemplate: {
      circuit: [
        { exerciseId: "sentadilla-salto", targetReps: 10 },
        { exerciseId: "flexiones", targetReps: 15 },
        { exerciseId: "zancadas", targetReps: 20 },
      ],
      normal: { durationOptionsMin: [12, 15, 18, 20] },
      deload: { durationMin: 12 },
    },
    hiitTemplate: {
      restBetweenBlocksSeconds: 120,
    },
    // Programa de kettlebell de 12 semanas / 3 fases, tal como lo definiste.
    // Reemplaza al EMOM/AMRAP en los días de martes, jueves y sábado.
    kettlebellProgram: {
      weights: { light: 12, heavy: 20 },
      restSecondsBetweenRounds: 60, // rango dado: 45-75s, se usa el punto medio
      phases: [
        {
          name: "Técnica y base",
          weekRange: "Semanas 1-4",
          martes: {
            rounds: 3,
            exercises: [
              { exerciseId: "peso-muerto-kettlebell", reps: 10, weight: 20 },
              { exerciseId: "sentadilla-kettlebell-frontal", reps: 8, weight: 12 },
              { exerciseId: "remo-una-mano-kettlebell", reps: 8, weight: 20, perSide: true },
              { exerciseId: "press-tumbado-kettlebell", reps: 8, weight: 12, perSide: true },
              { exerciseId: "plancha-carga-lateral", seconds: 30, weight: 20, perSide: true },
            ],
          },
          jueves: {
            durationMin: 12,
            exercises: [
              { exerciseId: "peso-muerto-kettlebell", reps: 8, weight: 20 },
              { exerciseId: "sentadilla-kettlebell-frontal", reps: 8, weight: 12 },
              { exerciseId: "remo-una-mano-kettlebell", reps: 6, weight: 20, perSide: true },
              { exerciseId: "press-cabeza-kettlebell", reps: 5, weight: 12, perSide: true },
              { exerciseId: "plancha-carga-lateral", seconds: 20, weight: 20, perSide: true },
            ],
          },
          sabado: {
            rounds: 3,
            exercises: [
              { exerciseId: "peso-muerto-kettlebell", reps: 8, weight: 20 },
              { exerciseId: "press-cabeza-kettlebell", reps: 5, weight: 12, perSide: true },
              { exerciseId: "remo-una-mano-kettlebell", reps: 8, weight: 20, perSide: true },
              { exerciseId: "sentadilla-kettlebell-frontal", reps: 8, weight: 12 },
            ],
            finalDurationMin: 5,
            finalExercises: [
              { exerciseId: "peso-muerto-kettlebell", reps: 8, weight: 20 },
              { exerciseId: "sentadilla-kettlebell-frontal", reps: 6, weight: 12 },
            ],
          },
        },
        {
          name: "Volumen",
          weekRange: "Semanas 5-8",
          martes: {
            rounds: 4,
            exercises: [
              { exerciseId: "peso-muerto-kettlebell", reps: 10, weight: 20 },
              { exerciseId: "sentadilla-kettlebell-frontal", reps: 8, weight: 20, note: "si sale limpia" },
              { exerciseId: "remo-una-mano-kettlebell", reps: 10, weight: 20, perSide: true },
              { exerciseId: "press-tumbado-kettlebell", reps: 10, weight: 12, perSide: true },
              { exerciseId: "plancha-carga-lateral", seconds: 40, weight: 20, perSide: true },
            ],
          },
          jueves: {
            durationMin: 15,
            exercises: [
              { exerciseId: "swing-kettlebell", reps: 10, weight: 12 },
              { exerciseId: "sentadilla-kettlebell-frontal", reps: 8, weight: 20 },
              { exerciseId: "remo-una-mano-kettlebell", reps: 8, weight: 20, perSide: true },
              { exerciseId: "press-cabeza-kettlebell", reps: 6, weight: 12, perSide: true },
              { exerciseId: "plancha-carga-lateral", seconds: 25, weight: 20, perSide: true },
            ],
          },
          sabado: {
            rounds: 4,
            exercises: [
              { exerciseId: "swing-kettlebell", reps: 10, weight: 12 },
              { exerciseId: "press-cabeza-kettlebell", reps: 6, weight: 12, perSide: true },
              { exerciseId: "remo-una-mano-kettlebell", reps: 10, weight: 20, perSide: true },
              { exerciseId: "sentadilla-kettlebell-frontal", reps: 8, weight: 20 },
            ],
            finalDurationMin: 6,
            finalExercises: [
              { exerciseId: "swing-kettlebell", reps: 10, weight: 12 },
              { exerciseId: "sentadilla-kettlebell-frontal", reps: 8, weight: 12 },
            ],
          },
        },
        {
          name: "Fuerza + acondicionamiento",
          weekRange: "Semanas 9-12",
          martes: {
            rounds: 4,
            exercises: [
              { exerciseId: "peso-muerto-kettlebell", reps: 12, weight: 20 },
              { exerciseId: "sentadilla-kettlebell-frontal", reps: 10, weight: 20 },
              { exerciseId: "remo-una-mano-kettlebell", reps: 10, weight: 20, perSide: true },
              { exerciseId: "press-tumbado-kettlebell", reps: 8, weight: 12, perSide: true, note: "8-10" },
              { exerciseId: "plancha-carga-lateral", seconds: 45, weight: 20, perSide: true },
            ],
          },
          jueves: {
            durationMin: 16,
            note: "15-18 min",
            exercises: [
              { exerciseId: "swing-kettlebell", reps: 10, weight: 20, note: "si ya dominas perfectamente el movimiento" },
              { exerciseId: "sentadilla-kettlebell-frontal", reps: 10, weight: 20 },
              { exerciseId: "remo-una-mano-kettlebell", reps: 8, weight: 20, perSide: true },
              { exerciseId: "press-cabeza-kettlebell", reps: 6, weight: 12, perSide: true },
              { exerciseId: "plancha-carga-lateral", seconds: 30, weight: 20, perSide: true },
            ],
          },
          sabado: {
            rounds: 4,
            exercises: [
              { exerciseId: "swing-kettlebell", reps: 10, weight: 20 },
              { exerciseId: "press-cabeza-kettlebell", reps: 7, weight: 12, perSide: true, note: "6-8" },
              { exerciseId: "remo-una-mano-kettlebell", reps: 10, weight: 20, perSide: true },
              { exerciseId: "sentadilla-kettlebell-frontal", reps: 10, weight: 20 },
            ],
            finalDurationMin: 8,
            finalExercises: [
              { exerciseId: "swing-kettlebell", reps: 10, weight: 20 },
              { exerciseId: "sentadilla-kettlebell-frontal", reps: 8, weight: 20 },
              { exerciseId: "press-cabeza-kettlebell", reps: 6, weight: 12, perSide: true, note: "alternando lados" },
            ],
          },
        },
      ],
    },
  };
}

export const SESSIONS_PER_PHASE = 12; // 3 sesiones/semana x 4 semanas
export const TOTAL_PHASES = 3;
export const TOTAL_PROGRAM_SESSIONS = SESSIONS_PER_PHASE * TOTAL_PHASES;

export function kettlebellPhaseIndex(sessionsCompleted) {
  return Math.min(TOTAL_PHASES - 1, Math.floor(sessionsCompleted / SESSIONS_PER_PHASE));
}

export function kettlebellProgramComplete(sessionsCompleted) {
  return sessionsCompleted >= TOTAL_PROGRAM_SESSIONS;
}
