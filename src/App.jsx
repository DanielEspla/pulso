import React, { useState, useEffect } from "react";
import { styles } from "./styles.js";
import { todayISO } from "./lib/utils.js";
import {
  loadTemplatesOrDefault,
  saveTemplates,
  loadHistory,
  saveHistory,
  loadDraft,
  saveDraft,
  clearDraft,
  loadTimerPrefs,
  saveTimerPrefs,
  loadCycle,
  saveCycle,
  loadKettlebellProgress,
  saveKettlebellProgress,
} from "./lib/storage.js";
import { shouldOfferDeload, registerTrainedSession, startDeload, postponeDeload, finishDeload, sessionsUntilDeload } from "./lib/cycle.js";
import { ensureAudioUnlocked, playBeep, vibrateShort } from "./lib/timer.js";
import TimerPanel from "./components/TimerPanel.jsx";
import FullBodyView from "./components/FullBodyView.jsx";
import KettlebellView from "./components/KettlebellView.jsx";
import HistorialView from "./components/HistorialView.jsx";
import AjustesView from "./components/AjustesView.jsx";

export default function App() {
  const [screen, setScreen] = useState("fullbody"); // fullbody | kettlebell | historial | ajustes
  const [templates, setTemplates] = useState(null);
  const [history, setHistory] = useState(null);
  const [cycle, setCycle] = useState(null);
  const [timerPrefs, setTimerPrefs] = useState(() => loadTimerPrefs());

  // --- Borrador de Full Body (elevado para sobrevivir a cambiar de pestaña) ---
  const [draftDate, setDraftDate] = useState(todayISO());
  const [draftSets, setDraftSets] = useState({});
  const [draftAcknowledged, setDraftAcknowledged] = useState(false);
  const [draftRecoveryOffer, setDraftRecoveryOffer] = useState(null);

  // --- Cronómetro de descanso, compartido entre Full Body y Kettlebell ---
  const [restTimer, setRestTimer] = useState(null);

  // --- Progreso del programa de Kettlebell (12 semanas / 3 fases) ---
  const [kettlebellProgress, setKettlebellProgress] = useState(null);

  const [nowTick, setNowTick] = useState(Date.now());

  useEffect(() => {
    setTemplates(loadTemplatesOrDefault());
    setHistory(loadHistory());
    setCycle(loadCycle());
    setKettlebellProgress(loadKettlebellProgress());

    const storedDraft = loadDraft();
    const hasContent = storedDraft && storedDraft.draftSets && Object.values(storedDraft.draftSets).some((arr) => arr.length > 0);
    if (hasContent) {
      setDraftRecoveryOffer(storedDraft);
    } else {
      setDraftAcknowledged(true);
    }
  }, []);

  useEffect(() => {
    if (!draftAcknowledged) return;
    saveDraft({ date: draftDate, draftSets, savedAt: new Date().toISOString() });
  }, [draftAcknowledged, draftDate, draftSets]);

  const recoverDraft = () => {
    setDraftDate(draftRecoveryOffer.date || todayISO());
    setDraftSets(draftRecoveryOffer.draftSets || {});
    setDraftRecoveryOffer(null);
    setDraftAcknowledged(true);
  };
  const discardDraft = () => {
    clearDraft();
    setDraftRecoveryOffer(null);
    setDraftAcknowledged(true);
  };

  const persistTemplates = (next) => {
    const ok = saveTemplates(next);
    if (ok) setTemplates(next);
    return ok;
  };

  const persistHistory = (next) => {
    const ok = saveHistory(next);
    if (ok) {
      const check = loadHistory();
      if (Array.isArray(check) && check.length === next.length) {
        setHistory(next);
        return true;
      }
      return false;
    }
    return false;
  };

  const updateTimerPrefs = (patch) => {
    const next = { ...timerPrefs, ...patch };
    setTimerPrefs(next);
    saveTimerPrefs(next);
  };

  // ---------------------------------------------------------------------
  // Ciclo de descarga
  // ---------------------------------------------------------------------
  const persistCycle = (next) => {
    setCycle(next);
    saveCycle(next);
  };
  const onStartDeload = () => persistCycle(startDeload(cycle));
  const onPostponeDeload = () => persistCycle(postponeDeload(cycle));
  const onFinishDeload = () => persistCycle(finishDeload());

  const registerSessionInCycle = (sessionType) => {
    const next = registerTrainedSession(cycle, sessionType);
    persistCycle(next);
  };

  const persistKettlebellProgress = (next) => {
    setKettlebellProgress(next);
    saveKettlebellProgress(next);
  };

  // ---------------------------------------------------------------------
  // Cronómetro de descanso Full Body
  // ---------------------------------------------------------------------
  const startRestTimer = (label, totalSeconds) => {
    if (!timerPrefs.autoStart) return;
    setRestTimer({ label, totalSeconds, endTime: Date.now() + totalSeconds * 1000, paused: false, remainingMsAtPause: null, finished: false, originScreen: screen });
  };
  const pauseRestTimer = () =>
    setRestTimer((prev) => (prev && !prev.paused && !prev.finished ? { ...prev, paused: true, remainingMsAtPause: Math.max(0, prev.endTime - Date.now()) } : prev));
  const resumeRestTimer = () =>
    setRestTimer((prev) => (prev && prev.paused ? { ...prev, paused: false, endTime: Date.now() + prev.remainingMsAtPause, remainingMsAtPause: null } : prev));
  const restartRestTimer = () =>
    setRestTimer((prev) => (prev ? { ...prev, paused: false, finished: false, endTime: Date.now() + prev.totalSeconds * 1000, remainingMsAtPause: null } : prev));
  const skipRestTimer = () => setRestTimer(null);
  const dismissRestTimerFinished = () => setRestTimer(null);

  // ---------------------------------------------------------------------
  // Tics globales: cada segundo mientras el cronómetro compartido corra
  // (lo usan tanto Full Body como Kettlebell)
  // ---------------------------------------------------------------------
  useEffect(() => {
    const anythingRunning = restTimer && !restTimer.paused && !restTimer.finished;
    if (!anythingRunning) return;
    const id = setInterval(() => setNowTick(Date.now()), 1000);
    return () => clearInterval(id);
  }, [restTimer]);

  useEffect(() => {
    const handler = () => {
      if (document.visibilityState === "visible") {
        setNowTick(Date.now());
        ensureAudioUnlocked(); // iOS suspende el audio en segundo plano; lo reactivamos al volver
      }
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, []);

  // Fin del cronómetro de descanso Full Body
  useEffect(() => {
    if (!restTimer || restTimer.paused || restTimer.finished) return;
    if (restTimer.endTime - nowTick <= 0) {
      if (timerPrefs.sound) playBeep();
      if (timerPrefs.vibration) vibrateShort();
      setRestTimer((prev) => (prev && !prev.finished ? { ...prev, finished: true } : prev));
    }
  }, [nowTick, restTimer, timerPrefs]);

  const loading = templates === null || history === null || cycle === null || kettlebellProgress === null;

  return (
    <div style={styles.app}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Sora:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
      `}</style>

      <header style={styles.header}>
        <div style={styles.headerBar} />
        <h1 style={styles.title}>PULSO</h1>
        <p style={styles.subtitle}>Full Body · HIIT</p>
      </header>

      {draftRecoveryOffer && (
        <div style={styles.recoveryBanner}>
          <p style={styles.recoveryText}>Hay un entrenamiento de Full Body sin terminar. ¿Quieres recuperarlo?</p>
          <div style={styles.recoveryButtons}>
            <button style={styles.saveBtn} onClick={recoverDraft}>
              Recuperar
            </button>
            <button style={styles.smallBtn} onClick={discardDraft}>
              Descartar
            </button>
          </div>
        </div>
      )}

      {!loading && !cycle.deloadActive && shouldOfferDeload(cycle) && (
        <div style={styles.deloadBanner}>
          <p style={styles.deloadTitle}>Toca semana de descarga</p>
          <div style={styles.deloadButtons}>
            <button style={styles.saveBtn} onClick={onStartDeload}>
              Empezar descarga
            </button>
            <button style={styles.smallBtn} onClick={onPostponeDeload}>
              Retrasar 1 semana
            </button>
          </div>
        </div>
      )}

      {!loading && cycle.deloadActive && (
        <div style={styles.deloadIndicator}>
          <p style={styles.deloadIndicatorText}>Semana de descarga activa — pesos y tiempos ajustados automáticamente.</p>
          <button style={styles.smallBtn} onClick={onFinishDeload}>
            Descarga terminada
          </button>
        </div>
      )}

      {restTimer && restTimer.originScreen === screen && (
        <TimerPanel
          timer={restTimer}
          now={nowTick}
          label={restTimer.label}
          onPause={pauseRestTimer}
          onResume={resumeRestTimer}
          onRestart={restartRestTimer}
          onSkip={skipRestTimer}
          onDismissFinished={dismissRestTimerFinished}
        />
      )}

      <main style={styles.main}>
        {loading ? (
          <div style={styles.loading}>Cargando…</div>
        ) : screen === "fullbody" ? (
          <FullBodyView
            templates={templates}
            history={history}
            persistHistory={persistHistory}
            cycle={cycle}
            date={draftDate}
            setDate={setDraftDate}
            draftSets={draftSets}
            setDraftSets={setDraftSets}
            blockedByRecovery={!!draftRecoveryOffer}
            startRestTimer={startRestTimer}
            onSessionSaved={() => {
              clearDraft();
              registerSessionInCycle("fullbody");
            }}
          />
        ) : screen === "kettlebell" ? (
          <KettlebellView
            templates={templates}
            history={history}
            persistHistory={persistHistory}
            cycle={cycle}
            kettlebellProgress={kettlebellProgress}
            persistKettlebellProgress={persistKettlebellProgress}
            startRestTimer={startRestTimer}
            onSessionSaved={() => registerSessionInCycle("kettlebell")}
          />
        ) : screen === "historial" ? (
          <HistorialView history={history} templates={templates} />
        ) : (
          <AjustesView
            templates={templates}
            persistTemplates={persistTemplates}
            timerPrefs={timerPrefs}
            updateTimerPrefs={updateTimerPrefs}
            cycle={cycle}
            applyImportedCycle={persistCycle}
            sessionsUntilDeload={sessionsUntilDeload(cycle)}
            history={history}
            setHistory={setHistory}
            persistHistory={persistHistory}
            kettlebellProgress={kettlebellProgress}
          />
        )}
      </main>

      <nav style={styles.nav}>
        {[
          ["fullbody", "FULL BODY"],
          ["kettlebell", "KETTLEBELL"],
          ["historial", "HISTORIAL"],
          ["ajustes", "AJUSTES"],
        ].map(([key, label]) => (
          <button key={key} style={{ ...styles.navBtn, ...(screen === key ? styles.navBtnActive : {}) }} onClick={() => setScreen(key)}>
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}
