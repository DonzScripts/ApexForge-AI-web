export function StatPill(props: { label: string; value: string; accent?: "red"|"green"|"warn" }) {
  const c = props.accent === "green" ? "var(--green)" : props.accent === "warn" ? "var(--warn)" : "var(--red)";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 14px",
        borderRadius: 999,
        border: "1px solid var(--border)",
        background: "rgba(255,255,255,0.05)",
        minWidth: 220,
        flex: "1 1 220px",
      }}
    >
      <span style={{ width: 8, height: 8, borderRadius: 99, background: c }} />
      <span style={{ color: "var(--muted)", fontSize: 13, fontWeight: 700 }}>{props.label}</span>
      <span style={{ marginLeft: "auto", fontSize: 13, fontWeight: 900 }}>{props.value}</span>
    </div>
  );
}