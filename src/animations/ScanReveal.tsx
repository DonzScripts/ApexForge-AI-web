import { motion } from "framer-motion";

export function ScanReveal(props: { height?: number }) {
  const h = props.height ?? 180;

  return (
    <div
      style={{
        height: h,
        borderRadius: "var(--r-lg)",
        border: "1px solid var(--border)",
        background:
          "linear-gradient(135deg, rgba(255,45,45,0.22), rgba(11,11,13,0.0) 55%), rgba(255,255,255,0.03)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* subtle grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.25,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* scanning line */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: h - 14 }}
        transition={{ duration: 1.35, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          height: 12,
          background: "rgba(255,45,45,0.55)",
          boxShadow: "0 0 28px rgba(255,45,45,0.55)",
        }}
      />
    </div>
  );
}