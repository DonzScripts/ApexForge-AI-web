export function Segmented<T extends string>(props: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 6,
        padding: 6,
        borderRadius: 999,
        border: "1px solid var(--border)",
        background: "rgba(255,255,255,0.05)",
      }}
    >
      {props.options.map((o) => {
        const active = props.value === o.value;
        return (
          <button
            key={o.value}
            onClick={() => props.onChange(o.value)}
            style={{
              flex: 1,
              height: 44,
              borderRadius: 999,
              border: `1px solid ${active ? "rgba(255,45,45,0.35)" : "transparent"}`,
              background: active ? "rgba(255,45,45,0.14)" : "transparent",
              color: active ? "var(--text)" : "var(--muted)",
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}