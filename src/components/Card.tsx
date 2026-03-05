import React from "react";
import { motion } from "framer-motion";

type CardProps = {
  children: React.ReactNode;
  style?: React.CSSProperties;
  hover?: boolean; // allow disabling hover lift if needed
};

export function Card({ children, style, hover = true }: CardProps) {
  return (
    <motion.div
      whileHover={
        hover
          ? {
              y: -2,
              borderColor: "rgba(255,255,255,0.16)",
            }
          : undefined
      }
      transition={{ type: "spring", stiffness: 260, damping: 28, mass: 0.75 }}
      style={{
        borderRadius: "var(--r-lg)",
        border: "1px solid var(--border)",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.03))",
        boxShadow: "var(--shadow)",
        padding: "var(--s-xl)",
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
    >
      {/* subtle “glass” highlight */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(900px 260px at 20% 0%, rgba(255,45,45,0.10), transparent 55%)",
          opacity: 0.9,
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "relative" }}>{children}</div>
    </motion.div>
  );
}