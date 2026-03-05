import React from "react";
import logoUrl from "../assets/logo.svg";

export default function Logo({ size = 34 }: { size?: number }) {
  return (
    <object
      data={logoUrl}
      type="image/svg+xml"
      aria-label="ApexForge AI logo"
      style={{ width: size, height: size, display: "block" }}
    />
  );
}