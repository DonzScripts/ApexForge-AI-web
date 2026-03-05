import { motion } from "framer-motion";
import { Card } from "../components/Card";
import { MotionPage } from "../motion/MotionPage";
import { fade } from "../motion/animations";

export default function Progress() {
  return (
    <MotionPage>
      <div className="grid">
        <motion.div {...fade(0)}>
          <h1 className="h1">Progress</h1>
          <p className="p">Timeline of check-ins, trends, and AI insights.</p>
        </motion.div>

        <motion.div {...fade(0.10)}>
          <Card>
            <h2 className="h2">Timeline (placeholder)</h2>
            <p className="p">We’ll render physique + food check-ins here with deltas and AI summaries.</p>
          </Card>
        </motion.div>
      </div>
    </MotionPage>
  );
}