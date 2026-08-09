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
  };
}
