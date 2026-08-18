import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { styles } from "../styles.js";
import { exerciseName } from "../lib/templates.js";
import { fmtDate, todayISO } from "../lib/utils.js";
import {
  fullBodyWeightSeries,
  kettlebellRoundsSeries,
  listExercisesWithFullBodyData,
  currentStreak,
  longestStreak,
  sessionsInMonth,
  last7DaysStatus,
} from "../lib/metrics.js";

const KB_DAY_LABELS = { martes: "Martes", jueves: "Jueves", sabado: "Sábado" };
const WEEKDAY_LETTERS = ["D", "L", "M", "X", "J", "V", "S"];

export default function HistorialView({ history, templates }) {
  const [filter, setFilter] = useState("todos"); // todos | fullbody | kettlebell
  const fbExercisesWithData = listExercisesWithFullBodyData(history);
  const [selectedExercise, setSelectedExercise] = useState(fbExercisesWithData[0] || templates.fullBodyTemplate.exercises[0]?.exerciseId);
  const [kbDayType, setKbDayType] = useState("martes");

  const filtered = [...history].filter((s) => filter === "todos" || s.type === filter).sort((a, b) => (a.date < b.date ? 1 : -1));

  const weightData = selectedExercise ? fullBodyWeightSeries(history, selectedExercise).map((p) => ({ ...p, dateLabel: fmtDate(p.date) })) : [];
  const kbData = kettlebellRoundsSeries(history, kbDayType).map((p) => ({ ...p, dateLabel: fmtDate(p.date) }));

  const thisMonth = todayISO().slice(0, 7);
  const lastMonthDate = new Date();
  lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
  const lastMonth = lastMonthDate.toISOString().slice(0, 7);
  const sessionsThisMonth = sessionsInMonth(history, thisMonth);
  const sessionsLastMonth = sessionsInMonth(history, lastMonth);
  const monthDiff = sessionsThisMonth - sessionsLastMonth;

  const bestExerciseId = fbExercisesWithData[0];
  const bestSeries = bestExerciseId ? fullBodyWeightSeries(history, bestExerciseId) : [];
  const bestWeight = bestSeries.length > 0 ? Math.max(...bestSeries.map((p) => p.weight)) : null;
  const firstWeight = bestSeries.length > 0 ? bestSeries[0].weight : null;

  const streak = currentStreak(history);
  const best = longestStreak(history);
  const week = last7DaysStatus(history);

  return (
    <div>
      <p style={styles.sectionLabel}>Tu progreso</p>
      <div style={styles.bigNumberGrid}>
        <div style={styles.bigNumberCard}>
          <p style={styles.bigNumberVal}>{sessionsThisMonth}</p>
          <div style={styles.bigNumberLabel}>Sesiones este mes</div>
          {sessionsLastMonth > 0 && (
            <div style={styles.bigNumberTrend}>
              {monthDiff >= 0 ? "↑" : "↓"} {Math.abs(monthDiff)} vs mes pasado
            </div>
          )}
        </div>
        <div style={styles.bigNumberCard}>
          <p style={styles.bigNumberVal}>{bestWeight !== null ? `${bestWeight}kg` : "—"}</p>
          <div style={styles.bigNumberLabel}>{bestExerciseId ? exerciseName(bestExerciseId, templates.customExerciseNames) : "Sin datos de Full Body"}</div>
          {bestWeight !== null && firstWeight !== null && bestWeight !== firstWeight && (
            <div style={styles.bigNumberTrend}>↑ {(bestWeight - firstWeight).toFixed(1)}kg desde el inicio</div>
          )}
        </div>
      </div>

      {streak > 0 && (
        <div style={styles.streakBar}>
          <span style={styles.streakFlame}>🔥</span>
          <div>
            <div style={styles.streakTextBig}>{streak} sesiones seguidas</div>
            <div style={styles.streakTextSub}>Tu racha más larga: {best}</div>
          </div>
        </div>
      )}

      <div style={styles.weekRow}>
        {week.map((d) => {
          const weekday = WEEKDAY_LETTERS[new Date(d.date).getDay()];
          return (
            <div key={d.date} style={styles.weekDay}>
              <div style={{ ...styles.weekDayDot, ...(d.trained ? styles.weekDayDotDone : styles.weekDayDotRest), ...(d.isToday ? styles.weekDayDotToday : {}) }}>
                {d.trained ? "✓" : "–"}
              </div>
              <div style={styles.weekDayLabel}>{weekday}</div>
            </div>
          );
        })}
      </div>

      <div style={styles.tabsRow}>
        {[
          ["todos", "Todos"],
          ["fullbody", "Full Body"],
          ["kettlebell", "Kettlebell"],
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

      {(filter === "todos" || filter === "kettlebell") && (
        <div style={styles.card}>
          <p style={styles.cardTitle}>Vueltas completadas — Kettlebell</p>
          <div style={styles.tabsRow}>
            {Object.entries(KB_DAY_LABELS).map(([key, label]) => (
              <button key={key} style={{ ...styles.tabChip, ...(kbDayType === key ? styles.tabChipActive : {}) }} onClick={() => setKbDayType(key)}>
                {label}
              </button>
            ))}
          </div>
          {kbData.length > 0 ? (
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={kbData}>
                <CartesianGrid stroke="#2A2E38" strokeDasharray="3 3" />
                <XAxis dataKey="dateLabel" tick={{ fill: "#8A8F98", fontSize: 11 }} />
                <YAxis tick={{ fill: "#8A8F98", fontSize: 11 }} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "#1C1F26", border: "1px solid #2A2E38", fontSize: 12 }} labelStyle={{ color: "#F5F5F0" }} />
                <Line type="monotone" dataKey="rounds" stroke="#6FCF97" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ fontSize: 12, color: "#8A8F98" }}>Sin datos todavía para este día.</p>
          )}
        </div>
      )}

      <p style={styles.sectionLabel}>Sesiones ({filtered.length})</p>
      {filtered.length === 0 && <p style={{ ...styles.helpText, margin: "0 16px" }}>Todavía no hay sesiones de este tipo.</p>}
      {filtered.map((s) => (
        <div key={s.id} style={styles.historyCard}>
          <div style={styles.historyHeader}>
            <span style={styles.historyDate}>{fmtDate(s.date)}</span>
            <span style={styles.historyType}>
              {s.type === "fullbody" ? "Full Body" : s.type === "kettlebell" ? `Kettlebell — ${KB_DAY_LABELS[s.dayType] || s.dayType}` : "Descanso"}
              {s.deloadWeek && <span style={styles.deloadTag}>descarga</span>}
            </span>
          </div>
          {s.type === "fullbody" && <p style={styles.historySub}>{s.exercises.length} ejercicios</p>}
          {s.type === "kettlebell" && (
            <p style={styles.historySub}>
              Sesión {s.sessionNumberInProgram} de 36 · {s.roundsCompleted} vueltas
              {s.finalRoundsCompleted != null ? ` + ${s.finalRoundsCompleted} en el final` : ""}
            </p>
          )}
          {s.type === "descanso" && s.note && <p style={styles.historySub}>{s.note}</p>}
        </div>
      ))}
    </div>
  );
}
