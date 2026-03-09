import { motion } from "framer-motion";
import { useOutletContext } from "react-router-dom";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { MotionPage } from "../motion/MotionPage";
import { fade } from "../motion/animations";
import type { AppOutletContext } from "../app/App";
import { login, logout } from "../lib/auth";

export default function Settings() {
  const { signedIn, setSignedIn, authError, setAuthError } =
    useOutletContext<AppOutletContext>();

  return (
    <MotionPage>
      <div className="grid">
        <motion.div {...fade(0)}>
          <h1 className="h1">Settings</h1>
          <p className="p">Profile, preferences, and authentication.</p>
        </motion.div>

        <motion.div {...fade(0.1)}>
          <Card>
            <h2 className="h2">Profile (placeholder)</h2>
            <p className="p">
              Height/weight/activity level/gym access will live here.
            </p>

            <div style={{ display: "grid", gap: 12, marginTop: 14 }}>
              <Button
                label={signedIn ? "Signed In" : "Sign In"}
                onClick={async () => {
                  if (signedIn) return;
                  setAuthError("");
                  try {
                    await login();
                  } catch (err) {
                    setAuthError(
                      err instanceof Error
                        ? err.message
                        : "Unable to start sign-in."
                    );
                  }
                }}
              />

              <Button
                label="Sign Out"
                variant="ghost"
                onClick={() => {
                  setAuthError("");
                  setSignedIn(false);
                  logout();
                }}
              />
            </div>

            {authError ? (
              <p
                className="p"
                style={{
                  marginTop: 14,
                  color: "#ff8a8a",
                }}
              >
                {authError}
              </p>
            ) : null}

            <p
              className="p"
              style={{
                marginTop: 14,
                opacity: 0.75,
              }}
            >
              Status: {signedIn ? "Signed in" : "Not signed in"}
            </p>
          </Card>
        </motion.div>
      </div>
    </MotionPage>
  );
}