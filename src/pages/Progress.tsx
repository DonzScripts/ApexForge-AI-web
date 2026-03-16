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

        <motion.div {...fade(0.08)}>
          <Card>
            <h2 className="h2">Check-In History</h2>
            <p className="p">
              Your saved physique and food check-ins will appear here once your
              history retrieval is connected to the backend.
            </p>
          </Card>
        </motion.div>

        <motion.div {...fade(0.14)}>
          <Card>
            <h2 className="h2">Trend Signals</h2>
            <p className="p">
              Weight trends, nutrition consistency, and training patterns can be
              summarized here after multiple check-ins are stored in DynamoDB.
            </p>
          </Card>
        </motion.div>

        <motion.div {...fade(0.2)}>
          <Card>
            <h2 className="h2">AI Insights</h2>
            <p className="p">
              Coach summaries and progress recommendations will be generated
              here after your check-in pipeline is fully wired.
            </p>
          </Card>
        </motion.div>
      </div>
    </MotionPage>
  );
}
