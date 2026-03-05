import { motionTokens } from "./motion";

export const page = {
  initial: { opacity: 0, y: 10, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: 8, filter: "blur(6px)" },
  transition: { ...motionTokens.spring.soft },
};

export const card = {
  initial: { opacity: 0, y: 12, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { ...motionTokens.spring.soft },
};

export const press = {
  whileTap: { scale: 0.985 },
  whileHover: { y: -1 },
  transition: { duration: motionTokens.duration.fast, ease: motionTokens.ease.out },
};

export const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { type: "spring", stiffness: 220, damping: 26, mass: 0.7, delay },
});