import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { motionTokens } from "./motion";

export function Reveal(props: { children: React.ReactNode; delay?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{props.children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ ...motionTokens.spring.soft, delay: props.delay ?? 0 }}
    >
      {props.children}
    </motion.div>
  );
}