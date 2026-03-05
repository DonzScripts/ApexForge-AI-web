import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { page } from "./animations";

export function MotionPage({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;

  return (
    <motion.div
      initial={page.initial}
      animate={page.animate}
      exit={page.exit}
      transition={page.transition}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
}