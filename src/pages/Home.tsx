import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { ScanReveal } from "../animations/ScanReveal";
import { MotionPage } from "../motion/MotionPage";
import { fade } from "../motion/animations";

export default function Home() {
  const navigate = useNavigate();

  return (
    <MotionPage>
      <div className="grid">
        <motion.div {...fade(0)}>
          <h1 className="h1">ApexForge AI</h1>
          <p className="p">
            Streak-first training, AI-driven feedback, clean execution.
          </p>
        </motion.div>

        <motion.div {...fade(0.06)}>
          <Card>
            <div className="kicker">SYSTEM STATUS</div>
            <h2 className="h2">Dashboard Ready</h2>
            <p className="p">
              Placeholder streak values have been removed. Next, we can connect
              real dashboard metrics from your Lambda functions and DynamoDB
              data.
            </p>
          </Card>
        </motion.div>

        <motion.div {...fade(0.12)}>
          <Card>
            <div className="kicker">AI COACH</div>
            <h2 className="h2">Today’s Focus</h2>
            <p className="p">
              Prioritize protein + steps. Strength session: upper push + core.
              Keep intensity high, volume controlled.
            </p>

            <div style={{ display: "grid", gap: 12, marginTop: 18 }}>
              <Button
                label="Quick Check-In (60 sec)"
                onClick={() => navigate("/checkin")}
              />
              <Button
                label="View Plans"
                variant="ghost"
                onClick={() => navigate("/plans")}
              />
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
              <span style={{ color: "var(--faint)", fontSize: 12 }}>
                Bedrock pipeline ready
              </span>
            </div>

            <ScanReveal height={190} />

            <div
              style={{
                color: "var(--faint)",
                fontSize: 13,
                marginTop: 10,
                lineHeight: 1.35,
              }}
            >
              Physique + food scans will run through AWS AI services
              (Bedrock + Textract/Rekognition).
            </div>
          </div>
        </motion.div>
      </div>
    </MotionPage>
  );
}
