// ===========================================================================
// PALETA — inspirada en la referencia "Auréa Motion" que pasaste.
// ===========================================================================
const DEEP_PLUM = "#2B203A"; // fondo oscuro de cabecera/nav, acentos elegantes
const SAGE_MIST = "#9BB29A"; // acento secundario, categorías, positivo suave
const MUTED_TEAL = "#24565A"; // acento terciario, éxito, anillos de progreso
const BRUSHED_COPPER = "#B86C4E"; // acento principal — CTAs, activo, foco
const CHAMPAGNE_SAND = "#E7D6BE"; // superficies cálidas suaves, resaltados
const INK_TEXT = "#1A1E22"; // texto principal sobre fondo claro
const SOFT_STONE = "#F5F1EA"; // fondo principal de la app
const WARM_GRAY = "#6F6A67"; // texto secundario/muted
const BORDER = "#E3D8C8"; // bordes suaves derivados de champán
const CARD_BG = "#FFFFFF";
const DANGER = "#A8453A"; // rojo cálido, coherente con la paleta

const SERIF = "'Playfair Display', Georgia, serif";
const SANS = "'Sora', -apple-system, sans-serif";

export const styles = {
  app: {
    fontFamily: SANS,
    background: SOFT_STONE,
    color: INK_TEXT,
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    maxWidth: 480,
    margin: "0 auto",
    width: "100%",
    position: "relative",
  },
  header: { padding: "calc(env(safe-area-inset-top) + 18px) 16px 16px", position: "relative", background: DEEP_PLUM },
  headerBar: { position: "absolute", top: 0, left: 0, right: 0, height: 4, background: BRUSHED_COPPER },
  title: { fontFamily: SERIF, fontWeight: 700, fontSize: 28, letterSpacing: 0.5, margin: 0, color: SOFT_STONE },
  subtitle: { color: "#C9BFC2", fontSize: 13, margin: "4px 0 0" },

  main: { flex: 1, paddingBottom: 90 },
  loading: { textAlign: "center", padding: "60px 0", color: WARM_GRAY },

  nav: {
    position: "sticky",
    bottom: 0,
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    background: DEEP_PLUM,
    borderTop: `1px solid ${DEEP_PLUM}`,
    paddingBottom: "env(safe-area-inset-bottom)",
  },
  navBtn: { background: "transparent", border: "none", color: "#9A8FA0", padding: "14px 0", fontFamily: SANS, fontWeight: 600, fontSize: 10.5, letterSpacing: 0.4, cursor: "pointer", minHeight: 44 },
  navBtnActive: { color: BRUSHED_COPPER, borderTop: `2px solid ${BRUSHED_COPPER}`, marginTop: -1 },

  card: { margin: "0 16px 12px", background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "14px 16px", boxShadow: "0 1px 3px rgba(43,32,58,0.06)" },
  cardTitle: { fontFamily: SERIF, fontSize: 17, fontWeight: 700, margin: "0 0 10px", color: INK_TEXT },
  sectionLabel: { fontSize: 12, color: WARM_GRAY, letterSpacing: 0.5, textTransform: "uppercase", margin: "0 16px 8px" },

  tabsRow: { display: "flex", gap: 8, margin: "0 16px 14px", overflowX: "auto", WebkitOverflowScrolling: "touch" },
  tabChip: { background: CARD_BG, border: `1px solid ${BORDER}`, color: WARM_GRAY, borderRadius: 20, padding: "9px 16px", fontSize: 13, cursor: "pointer", whiteSpace: "nowrap", minHeight: 40 },
  tabChipActive: { background: BRUSHED_COPPER, color: "#FFFFFF", border: `1px solid ${BRUSHED_COPPER}`, fontWeight: 600 },

  setRow: { display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: `1px solid ${BORDER}` },
  setBadge: { fontSize: 10.5, padding: "2px 6px", borderRadius: 6, background: "#EFEAE0", color: WARM_GRAY },
  setBadgeWork: { background: "#F4E3D8", color: BRUSHED_COPPER },

  inputRow: { display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" },
  numInput: { width: 76, background: SOFT_STONE, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "10px", color: INK_TEXT, fontSize: 16, minHeight: 44 },
  textInput: { flex: 1, background: SOFT_STONE, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "10px", color: INK_TEXT, fontSize: 16, minHeight: 44 },
  select: { background: SOFT_STONE, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "10px", color: INK_TEXT, fontSize: 16, minHeight: 44 },

  addBtn: { background: "#F4E3D8", color: BRUSHED_COPPER, border: `1px solid ${BRUSHED_COPPER}`, borderRadius: 8, padding: "10px 16px", fontSize: 14, fontWeight: 600, cursor: "pointer", minHeight: 44, minWidth: 44 },
  saveBtn: { width: "100%", background: BRUSHED_COPPER, color: "#FFFFFF", border: "none", borderRadius: 30, padding: "15px", fontFamily: SANS, fontWeight: 700, fontSize: 15, letterSpacing: 0.3, cursor: "pointer", minHeight: 48 },
  smallBtn: { background: CARD_BG, color: INK_TEXT, border: `1px solid ${BORDER}`, borderRadius: 20, padding: "10px 14px", fontSize: 13, cursor: "pointer", minHeight: 44 },
  smallBtnDanger: { background: "#F5E3E0", color: DANGER, border: `1px solid ${DANGER}`, borderRadius: 20, padding: "10px 14px", fontSize: 13, cursor: "pointer", minHeight: 44 },

  successText: { color: MUTED_TEAL, fontSize: 13, margin: "8px 0" },
  errorText: { color: DANGER, fontSize: 13, margin: "8px 0" },
  helpText: { color: WARM_GRAY, fontSize: 12.5, margin: "0 16px 14px", lineHeight: 1.5 },

  timerBar: {
    position: "sticky",
    top: 0,
    zIndex: 50,
    margin: "0 0 12px",
    padding: "22px 20px",
    background: CARD_BG,
    borderBottom: `2px solid ${MUTED_TEAL}`,
    boxShadow: "0 4px 12px rgba(43,32,58,0.12)",
    textAlign: "center",
  },
  timerHeroLabel: { color: MUTED_TEAL, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 6px", fontWeight: 600 },
  timerHeroClock: { fontFamily: SERIF, fontWeight: 700, fontSize: 56, color: INK_TEXT, margin: 0, lineHeight: 1 },
  timerHeroSub: { color: WARM_GRAY, fontSize: 13, margin: "8px 0 0" },
  timerRingRow: { display: "flex", justifyContent: "center", gap: 16, marginTop: 18 },
  ringBtnCol: { display: "flex", flexDirection: "column", alignItems: "center", gap: 6 },
  ringBtnLabel: { color: WARM_GRAY, fontSize: 10.5 },
  ringBtn: { width: 46, height: 46, borderRadius: "50%", border: `1px solid ${BORDER}`, background: CARD_BG, color: INK_TEXT, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },

  dotsRow: { display: "flex", gap: 6, padding: "0 16px", marginBottom: 12 },
  dot: { flex: 1, height: 4, borderRadius: 2, background: BORDER, border: "none", padding: 0, cursor: "pointer" },
  dotDone: { background: BRUSHED_COPPER },
  dotCurrent: { background: BRUSHED_COPPER, opacity: 0.5 },

  focusCounter: { color: WARM_GRAY, fontSize: 12, letterSpacing: 1, textTransform: "uppercase", margin: "0 16px" },
  focusExerciseName: { fontFamily: SERIF, fontWeight: 700, fontSize: 26, color: INK_TEXT, margin: "4px 16px 16px", lineHeight: 1.15 },

  bigNumberGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "0 16px 12px" },
  bigNumberCard: { background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 16 },
  bigNumberVal: { fontFamily: SERIF, fontWeight: 700, fontSize: 30, color: DEEP_PLUM, margin: 0 },
  bigNumberLabel: { color: WARM_GRAY, fontSize: 12, marginTop: 2 },
  bigNumberTrend: { color: MUTED_TEAL, fontSize: 11, marginTop: 4 },

  streakBar: { margin: "0 16px 12px", background: "#F4E3D8", border: `1px solid ${BORDER}`, borderRadius: 14, padding: 16, display: "flex", alignItems: "center", gap: 12 },
  streakFlame: { fontSize: 26 },
  streakTextBig: { fontFamily: SERIF, fontWeight: 700, fontSize: 17, color: INK_TEXT },
  streakTextSub: { color: WARM_GRAY, fontSize: 12 },

  weekRow: { display: "flex", justifyContent: "space-between", margin: "0 16px 16px" },
  weekDay: { display: "flex", flexDirection: "column", alignItems: "center", gap: 6 },
  weekDayDot: { width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600 },
  weekDayDotDone: { background: BRUSHED_COPPER, color: "#FFFFFF" },
  weekDayDotRest: { background: "#EFEAE0", color: WARM_GRAY },
  weekDayDotToday: { border: `2px solid ${DEEP_PLUM}`, color: DEEP_PLUM, background: "transparent" },
  weekDayLabel: { color: WARM_GRAY, fontSize: 10 },

  timerFinishedWrap: {
    position: "sticky",
    top: 0,
    zIndex: 50,
    margin: "0 0 12px",
    background: "#F4E3D8",
    borderBottom: `3px solid ${BRUSHED_COPPER}`,
    padding: "20px 16px",
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(43,32,58,0.12)",
  },
  timerFinishedTitle: { fontFamily: SERIF, fontWeight: 700, fontSize: 22, color: BRUSHED_COPPER, margin: "0 0 4px" },
  timerFinishedSub: { fontSize: 13, color: INK_TEXT, margin: "0 0 14px" },

  deloadBanner: { margin: "0 16px 12px", background: "#F4E3D8", border: `1px solid ${BRUSHED_COPPER}`, borderRadius: 14, padding: "14px 16px" },
  deloadTitle: { fontFamily: SERIF, fontSize: 15, fontWeight: 700, color: BRUSHED_COPPER, margin: "0 0 8px" },
  deloadButtons: { display: "flex", gap: 8, flexWrap: "wrap" },
  deloadIndicator: { margin: "0 16px 12px", background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "8px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 },
  deloadIndicatorText: { fontSize: 12, color: WARM_GRAY, margin: 0 },

  recoveryBanner: { margin: "0 16px 12px", background: "#EFEDE3", border: `1px solid ${MUTED_TEAL}`, borderRadius: 10, padding: "10px 12px" },
  recoveryText: { fontSize: 13, color: INK_TEXT, margin: "0 0 10px" },
  recoveryButtons: { display: "flex", gap: 8 },

  historyCard: { margin: "0 16px 10px", background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "12px 14px" },
  historyHeader: { display: "flex", justifyContent: "space-between", marginBottom: 4 },
  historyDate: { fontFamily: SERIF, fontWeight: 600, fontSize: 14, color: INK_TEXT },
  historyType: { color: BRUSHED_COPPER, fontSize: 12.5, fontWeight: 600 },
  historySub: { color: WARM_GRAY, fontSize: 12, margin: "2px 0 8px" },
  deloadTag: { display: "inline-block", fontSize: 10.5, color: BRUSHED_COPPER, background: "#F4E3D8", borderRadius: 6, padding: "1px 6px", marginLeft: 6 },

  chartWrap: { margin: "0 16px 16px" },
  chartLabel: { fontSize: 12, color: WARM_GRAY, margin: "0 0 8px" },

  settingsRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${BORDER}` },
  settingsLabel: { fontSize: 13.5, color: INK_TEXT },
  toggleChip: { background: SOFT_STONE, color: WARM_GRAY, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "8px 14px", fontSize: 13, cursor: "pointer", minHeight: 40 },
  toggleChipActive: { background: "#F4E3D8", color: BRUSHED_COPPER, border: `1px solid ${BRUSHED_COPPER}` },

  jsonTextarea: { width: "100%", minHeight: 100, background: SOFT_STONE, border: `1px solid ${BORDER}`, borderRadius: 8, color: WARM_GRAY, fontSize: 11, fontFamily: "monospace", padding: 10, marginBottom: 8 },
  dataRowButtons: { display: "flex", gap: 8, flexWrap: "wrap" },
  deviceNotice: { margin: "0 16px 16px", background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "8px 12px" },
  deviceNoticeText: { fontSize: 11.5, color: WARM_GRAY, margin: 0 },
};

// Exportado para que las gráficas (recharts) y otros puntos con colores
// sueltos en los componentes usen exactamente esta misma paleta.
export const colors = {
  deepPlum: DEEP_PLUM,
  sageMist: SAGE_MIST,
  mutedTeal: MUTED_TEAL,
  brushedCopper: BRUSHED_COPPER,
  champagneSand: CHAMPAGNE_SAND,
  inkText: INK_TEXT,
  softStone: SOFT_STONE,
  warmGray: WARM_GRAY,
  border: BORDER,
  cardBg: CARD_BG,
  danger: DANGER,
};
