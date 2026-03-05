import React from "react";

export default function Header(props: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 14 }}>
      <div style={{ flex: 1 }}>
        <h1 className="h1" style={{ marginBottom: 6 }}>{props.title}</h1>
        {!!props.subtitle && <p className="p" style={{ marginTop: 0 }}>{props.subtitle}</p>}
      </div>
      {props.right}
    </div>
  );
}