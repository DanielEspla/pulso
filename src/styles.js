export const styles = {
  app: {
    fontFamily: "'Inter', -apple-system, sans-serif",
    background: "#12141A",
    color: "#F5F5F0",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    maxWidth: 480,
    margin: "0 auto",
    width: "100%",
    position: "relative",
  },
  header: { padding: "calc(env(safe-area-inset-top) + 18px) 16px 10px", position: "relative" },
  headerBar: { position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "#F2B705" },
  title: { fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 26, letterSpacing: 1, margin: 0 },
  subtitle: { color: "#8A8F98", fontSize: 13, margin: "4px 0 0" },

  main: { flex: 1, paddingBottom: 90 },
  loading: { textAlign: "center", padding: "60px 0", color: "#8A8F98" },

  nav: {
    position: "sticky",
    bottom: 0,
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    background: "#1C1F26",
    borderTop: "1px solid #2A2E38",
    paddingBottom: "env(safe-area-inset-bottom)",
  },
  navBtn: { background: "transparent", border: "none", color: "#8A8F98", padding: "14px 0", fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 10.5, letterSpacing: 0.4, cursor: "pointer", minHeight: 44 },
  navBtnActive: { color: "#F2B705", borderTop: "2px solid #F2B705", marginTop: -1 },

  card: { margin: "0 16px 12px", background: "#1C1F26", border: "1px solid #2A2E38", borderRadius: 12, padding: "14px 16px" },
  cardTitle: { fontSize: 15, fontWeight: 600, margin: "0 0 10px" },
  sectionLabel: { fontSize: 12, color: "#8A8F98", letterSpacing: 0.5, textTransform: "uppercase", margin: "0 16px 8px" },

  tabsRow: { display: "flex", gap: 8, margin: "0 16px 14px", overflowX: "auto", WebkitOverflowScrolling: "touch" },
  tabChip: { background: "transparent", border: "1px solid #2A2E38", color: "#8A8F98", borderRadius: 20, padding: "9px 16px", fontSize: 13, cursor: "pointer", whiteSpace: "nowrap", minHeight: 40 },
  tabChipActive: { background: "#F2B705", color: "#1A1400", border: "1px solid #F2B705", fontWeight: 600 },

  setRow: { display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: "1px solid #22252C" },
  setBadge: { fontSize: 10.5, padding: "2px 6px", borderRadius: 6, background: "#2A2E38", color: "#8A8F98" },
  setBadgeWork: { background: "#2A2410", color: "#F2B705" },

  inputRow: { display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" },
  numInput: { width: 76, background: "#12141A", border: "1px solid #2A2E38", borderRadius: 8, padding: "10px", color: "#F5F5F0", fontSize: 16, minHeight: 44 },
  textInput: { flex: 1, background: "#12141A", border: "1px solid #2A2E38", borderRadius: 8, padding: "10px", color: "#F5F5F0", fontSize: 16, minHeight: 44 },
  select: { background: "#12141A", border: "1px solid #2A2E38", borderRadius: 8, padding: "10px", color: "#F5F5F0", fontSize: 16, minHeight: 44 },

  addBtn: { background: "#2A2410", color: "#F2B705", border: "1px solid #F2B705", borderRadius: 8, padding: "10px 16px", fontSize: 14, fontWeight: 600, cursor: "pointer", minHeight: 44, minWidth: 44 },
  saveBtn: { width: "100%", background: "#F2B705", color: "#1A1400", border: "none", borderRadius: 10, padding: "15px", fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 15, letterSpacing: 0.5, cursor: "pointer", minHeight: 48 },
  smallBtn: { background: "#12141A", color: "#F5F5F0", border: "1px solid #2A2E38", borderRadius: 8, padding: "10px 14px", fontSize: 13, cursor: "pointer", minHeight: 44 },
  smallBtnDanger: { background: "#2A1414", color: "#E85D5D", border: "1px solid #E85D5D", borderRadius: 8, padding: "10px 14px", fontSize: 13, cursor: "pointer", minHeight: 44 },

  successText: { color: "#6FCF97", fontSize: 13, margin: "8px 0" },
  errorText: { color: "#E85D5D", fontSize: 13, margin: "8px 0" },
  helpText: { color: "#8A8F98", fontSize: 12.5, margin: "0 16px 14px", lineHeight: 1.5 },

  timerBar: { margin: "0 16px 12px", background: "#1C1F26", border: "1px solid #F2B705", borderRadius: 12, padding: "14px 16px" },
  timerLabel: { fontSize: 12, color: "#8A8F98", margin: "0 0 2px" },
  timerClock: { fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 40, color: "#F2B705", margin: 0, letterSpacing: 1, textAlign: "center" },
  timerSub: { fontSize: 12.5, color: "#F5F5F0", textAlign: "center", margin: "4px 0 10px" },
  timerButtonsRow: { display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" },
  timerFinishedWrap: { margin: "0 16px 12px", background: "#2A1F0A", border: "2px solid #F2B705", borderRadius: 14, padding: "20px 16px", textAlign: "center" },
  timerFinishedTitle: { fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 22, color: "#F2B705", margin: "0 0 4px" },
  timerFinishedSub: { fontSize: 13, color: "#F5F5F0", margin: "0 0 14px" },

  deloadBanner: { margin: "0 16px 12px", background: "#2A1F0A", border: "1px solid #F2B705", borderRadius: 12, padding: "14px 16px" },
  deloadTitle: { fontSize: 14, fontWeight: 600, color: "#F2B705", margin: "0 0 8px" },
  deloadButtons: { display: "flex", gap: 8, flexWrap: "wrap" },
  deloadIndicator: { margin: "0 16px 12px", background: "#1C1F26", border: "1px solid #2A2E38", borderRadius: 10, padding: "8px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 },
  deloadIndicatorText: { fontSize: 12, color: "#8A8F98", margin: 0 },

  recoveryBanner: { margin: "0 16px 12px", background: "#1C1F26", border: "1px solid #F2B705", borderRadius: 10, padding: "10px 12px" },
  recoveryText: { fontSize: 13, color: "#F5F5F0", margin: "0 0 10px" },
  recoveryButtons: { display: "flex", gap: 8 },

  historyCard: { margin: "0 16px 10px", background: "#1C1F26", border: "1px solid #2A2E38", borderRadius: 12, padding: "12px 14px" },
  historyHeader: { display: "flex", justifyContent: "space-between", marginBottom: 4 },
  historyDate: { fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 14 },
  historyType: { color: "#F2B705", fontSize: 12.5 },
  historySub: { color: "#8A8F98", fontSize: 12, margin: "2px 0 8px" },
  deloadTag: { display: "inline-block", fontSize: 10.5, color: "#F2B705", background: "#2A2410", borderRadius: 6, padding: "1px 6px", marginLeft: 6 },

  chartWrap: { margin: "0 16px 16px" },
  chartLabel: { fontSize: 12, color: "#8A8F98", margin: "0 0 8px" },

  settingsRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #22252C" },
  settingsLabel: { fontSize: 13.5 },
  toggleChip: { background: "#12141A", color: "#8A8F98", border: "1px solid #2A2E38", borderRadius: 8, padding: "8px 14px", fontSize: 13, cursor: "pointer", minHeight: 40 },
  toggleChipActive: { background: "#2A2410", color: "#F2B705", border: "1px solid #F2B705" },

  jsonTextarea: { width: "100%", minHeight: 100, background: "#12141A", border: "1px solid #2A2E38", borderRadius: 8, color: "#8A8F98", fontSize: 11, fontFamily: "monospace", padding: 10, marginBottom: 8 },
  dataRowButtons: { display: "flex", gap: 8, flexWrap: "wrap" },
  deviceNotice: { margin: "0 16px 16px", background: "#1C1F26", border: "1px solid #2A2E38", borderRadius: 10, padding: "8px 12px" },
  deviceNoticeText: { fontSize: 11.5, color: "#8A8F98", margin: 0 },
};
