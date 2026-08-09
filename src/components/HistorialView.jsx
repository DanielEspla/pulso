import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { styles } from "../styles.js";
import { exerciseName } from "../lib/templates.js";
import { fmtDate } from "../lib/utils.js";
import { fullBodyWeightSeries, emomRepsSeries, amrapRoundsSeries, listExercisesWithFullBodyData } from "../lib/metrics.js";

export default function HistorialView({ history, templates }) {
  const [filter, setFilter] = useState("todos"); // todos | fullbody | hiit
  const fbExercisesWithData = listExercisesWithFullBodyData(history);
  const [selectedExercise, setSelectedExercise] = useState(fbExercisesWithData[0] || templates.fullBodyTemplate.exercises[0]?.exerciseId);

  const filtered = [...history].filter((s) => filter === "todos" || s.type === filter).sort((a, b) => (a.date < b.date ? 1 : -1));

  const weightData = selectedExercise ? fullBodyWeightSeries(history, selectedExercise).map((p) => ({ ...p, dateLabel: fmtDate(p.date) })) : [];
  const emomData = emomRepsSeries(history).map((p) => ({ ...p, dateLabel: fmtDate(p.date) }));
  const amrapData = amrapRoundsSeries(history).map((p) => ({ ...p, dateLabel: fmtDate(p.date) }));

  return (
    <div>
      <div style={styles.tabsRow}>
        {[
          ["todos", "Todos"],
          ["fullbody", "Full Body"],
          ["hiit", "HIIT"],
        ].map(([key, label]) => (
          <button key={key} style={{ ...styles.tabChip, ...(filter === key ? styles.tabChipActive : {}) }} onClick={() => setFilter(key)}>
            {label}
          </button>
        ))}
      </div>

      {(filter === "todos" || filter === "fullbody") && fbExercisesWithData.length > 0 && (
        <div style={styles.card}>
          <p style={styles.cardTitle}>Evolución de peso — Full Body</p>
          <select value={selectedExercise} onChange={(e) => setSelectedExercise(e.target.value)} style={{ ...styles.select, width: "100%", marginBottom: 10 }}>
            {fbExercisesWithData.map((id) => (
              <option key={id} value={id}>
                {exerciseName(id, templates.customExerciseNames)}
              </option>
            ))}
          </select>
          {weightData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={weightData}>
                <CartesianGrid stroke="#2A2E38" strokeDasharray="3 3" />
                <XAxis dataKey="dateLabel" tick={{ fill: "#8A8F98", fontSize: 11 }} />
                <YAxis tick={{ fill: "#8A8F98", fontSize: 11 }} domain={["dataMin - 5", "dataMax + 5"]} />
                <Tooltip contentStyle={{ background: "#1C1F26", border: "1px solid #2A2E38", fontSize: 12 }} labelStyle={{ color: "#F5F5F0" }} />
                <Line type="monotone" dataKey="weight" stroke="#F2B705" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ fontSize: 12, color: "#8A8F98" }}>Sin datos todavía para este ejercicio.</p>
          )}
        </div>
      )}

      {(filter === "todos" || filter === "hiit") && emomData.length > 0 && (
        <div style={styles.card}>
          <p style={styles.cardTitle}>Reps totales EMOM por sesión</p>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={emomData}>
              <CartesianGrid stroke="#2A2E38" strokeDasharray="3 3" />
              <XAxis dataKey="dateLabel" tick={{ fill: "#8A8F98", fontSize: 11 }} />
              <YAxis tick={{ fill: "#8A8F98", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "#1C1F26", border: "1px solid #2A2E38", fontSize: 12 }} labelStyle={{ color: "#F5F5F0" }} />
              <Line type="monotone" dataKey="reps" stroke="#5AA9E6" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {(filter === "todos" || filter === "hiit") && amrapData.length > 0 && (
        <div style={styles.card}>
          <p style={styles.cardTitle}>Rondas completadas AMRAP por sesión</p>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={amrapData}>
              <CartesianGrid stroke="#2A2E38" strokeDasharray="3 3" />
              <XAxis dataKey="dateLabel" tick={{ fill: "#8A8F98", fontSize: 11 }} />
              <YAxis tick={{ fill: "#8A8F98", fontSize: 11 }} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "#1C1F26", border: "1px solid #2A2E38", fontSize: 12 }} labelStyle={{ color: "#F5F5F0" }} />
              <Line type="monotone" dataKey="rounds" stroke="#6FCF97" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <p style={styles.sectionLabel}>Sesiones ({filtered.length})</p>
      {filtered.length === 0 && <p style={{ ...styles.helpText, margin: "0 16px" }}>Todavía no hay sesiones de este tipo.</p>}
      {filtered.map((s) => (
        <div key={s.id} style={styles.historyCard}>
          <div style={styles.historyHeader}>
            <span style={styles.historyDate}>{fmtDate(s.date)}</span>
            <span style={styles.historyType}>
              {s.type === "fullbody" ? "Full Body" : s.type === "hiit" ? "HIIT" : "Descanso"}
              {s.deloadWeek && <span style={styles.deloadTag}>descarga</span>}
            </span>
          </div>
          {s.type === "fullbody" && <p style={styles.historySub}>{s.exercises.length} ejercicios</p>}
          {s.type === "hiit" && (
            <p style={styles.historySub}>
              EMOM {s.emom.durationMin}' + AMRAP {s.amrap.durationMin}' · {s.amrap.roundsCompleted} rondas
            </p>
          )}
          {s.type === "descanso" && s.note && <p style={styles.historySub}>{s.note}</p>}
        </div>
      ))}
    </div>
  );
}
