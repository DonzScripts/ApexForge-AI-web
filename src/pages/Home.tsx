import { motion } from "framer-motion";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { StatPill } from "../components/StatPill";
import { ScanReveal } from "../animations/ScanReveal";
import { MotionPage } from "../motion/MotionPage";
import { fade } from "../motion/animations";

export default function Home() {
  return (
    <MotionPage>
      <div className="grid">
        <motion.div {...fade(0)}>
          <h1 className="h1">ApexForge AI</h1>
          <p className="p">Streak-first training, AI-driven feedback, clean execution.</p>
        </motion.div>

        <motion.div {...fade(0.06)}>
          <div className="row">
            <StatPill label="Current Streak" value="4 days" accent="red" />
            <StatPill label="Longest" value="11 days" accent="green" />
          </div>
        </motion.div>

        <motion.div {...fade(0.12)}>
          <Card>
            <div className="kicker">AI COACH</div>
            <h2 className="h2">Today’s Focus</h2>
            <p className="p">
              Prioritize protein + steps. Strength session: upper push + core. Keep intensity high, volume controlled.
            </p>
            <div style={{ display: "grid", gap: 12, marginTop: 18 }}>
              <Button label="Quick Check-In (60 sec)" onClick={() => {}} />
              <Button label="View Plans" variant="ghost" onClick={() => {}} />
            </div>
          </Card>
        </motion.div>

        <motion.div {...fade(0.18)}>
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <strong>AI Scan Preview</strong>
              <span style={{ color: "var(--faint)", fontSize: 12 }}>Bedrock pipeline ready</span>
            </div>

            <ScanReveal height={190} />

            <div style={{ color: "var(--faint)", fontSize: 13, marginTop: 10, lineHeight: 1.35 }}>
              Physique + food scans will run through AWS AI services (Bedrock + Textract/Rekognition).
            </div>
          </div>
        </motion.div>
      </div>
    </MotionPage>
  );
}