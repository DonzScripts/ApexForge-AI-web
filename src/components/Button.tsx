import React from "react";
import { motion } from "framer-motion";

type ButtonProps = {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  style?: React.CSSProperties;
  type?: "button" | "submit";
  disabled?: boolean;
};

export function Button({
  label,
  onClick,
  variant = "primary",
  style,
  type = "button",
  disabled = false,
}: ButtonProps) {
  const primary = variant === "primary";

  return (
    <motion.button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { y: -1 }}
      whileTap={disabled ? undefined : { scale: 0.985, y: 0 }}
      transition={{ type: "spring", stiffness: 420, damping: 30, mass: 0.7 }}
      style={{
        height: 52,
        width: "100%",
        padding: "0 18px",
        borderRadius: "var(--r-lg)",
        cursor: disabled ? "not-allowed" : "pointer",
        fontWeight: 900,
        letterSpacing: 0.2,
        border: `1px solid ${
          primary ? "rgba(255,255,255,0.12)" : "var(--border)"
        }`,
        background: primary ? "var(--red)" : "rgba(255,255,255,0.05)",
        color: primary ? "#fff" : "var(--text)",
        boxShadow: primary
          ? "0 14px 40px rgba(255,45,45,0.18)"
          : "none",
        opacity: disabled ? 0.55 : 1,
        outline: "none",
        ...style,
      }}
      aria-disabled={disabled}
    >
      {label}
    </motion.button>
  );
}