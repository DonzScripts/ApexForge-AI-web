import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Segmented } from "../components/Segmented";
import { ScanReveal } from "../animations/ScanReveal";
import { MotionPage } from "../motion/MotionPage";
import { fade } from "../motion/animations";

type Mode = "physique" | "food";

export default function CheckIn() {
  const [mode, setMode] = useState<Mode>("physique");

  return (
    <MotionPage>
      <div className="grid">
        <motion.div {...fade(0)}>
          <h1 className="h1">AI Check-In</h1>
          <p className="p">Upload physique or food/label images and get actionable feedback.</p>
        </motion.div>

        <motion.div {...fade(0.06)}>
          <Segmented
            value={mode}
            onChange={setMode}
            options={[
              { value: "physique", label: "Physique" },
              { value: "food", label: "Food / Label" },
            ]}
          />
        </motion.div>

        <motion.div {...fade(0.12)}>
          <Card>
            <h2 className="h2">{mode === "physique" ? "Physique Analysis" : "Food & Label Analysis"}</h2>
            <p className="p">
              {mode === "physique"
                ? "Upload a progress photo + stats to get a current standing and focus plan."
                : "Snap a meal or nutrition label for calories, ingredient quality, and smarter choices."}
            </p>

            <div style={{ marginTop: 16 }}>
              <ScanReveal height={170} />
            </div>

            <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
              <Button label="Upload Photo (placeholder)" onClick={() => {}} />
              <Button label="Run AI Analysis (placeholder)" variant="ghost" onClick={() => {}} />
            </div>
          </Card>
        </motion.div>
      </div>
    </MotionPage>
  );
}