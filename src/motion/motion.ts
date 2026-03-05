export const motionTokens = {
  spring: {
    soft: { type: "spring", stiffness: 220, damping: 26, mass: 0.7 },
    medium: { type: "spring", stiffness: 320, damping: 30, mass: 0.7 },
    snappy: { type: "spring", stiffness: 520, damping: 34, mass: 0.65 },
  },
  ease: {
    out: [0.16, 1, 0.3, 1] as const,
  },
  duration: {
    fast: 0.18,
    base: 0.28,
    slow: 0.42,
  },
};