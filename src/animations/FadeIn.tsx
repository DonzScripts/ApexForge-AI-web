import { motion } from "framer-motion";
import React from "react";

export function FadeIn(props: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
}) {
  const delay = props.delay ?? 0;
  const y = props.y ?? 12;

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut", delay }}
    >
      {props.children}
    </motion.div>
  );
}