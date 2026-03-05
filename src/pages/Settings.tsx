import { motion } from "framer-motion";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { MotionPage } from "../motion/MotionPage";
import { fade } from "../motion/animations";

export default function Settings() {
  return (
    <MotionPage>
      <div className="grid">
        <motion.div {...fade(0)}>
          <h1 className="h1">Settings</h1>
          <p className="p">Profile, preferences, and authentication.</p>
        </motion.div>

        <motion.div {...fade(0.10)}>
          <Card>
            <h2 className="h2">Profile (placeholder)</h2>
            <p className="p">Height/weight/activity level/gym access will live here.</p>

            <div style={{ display: "grid", gap: 12, marginTop: 14 }}>
              <Button label="Sign In (Cognito later)" onClick={() => {}} />
              <Button label="Sign Out" variant="ghost" onClick={() => {}} />
            </div>
          </Card>
        </motion.div>
      </div>
    </MotionPage>
  );
}