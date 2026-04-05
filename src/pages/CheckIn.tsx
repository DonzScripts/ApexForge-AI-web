import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Segmented } from "../components/Segmented";
import { ScanReveal } from "../animations/ScanReveal";
import { MotionPage } from "../motion/MotionPage";
import { fade } from "../motion/animations";
import { getPresignedUploadUrl, uploadFileToS3 } from "../services/uploads";
import { analyzeFood, analyzePhysique } from "../services/ai";

type Mode = "physique" | "food";

export default function CheckIn() {
  const [mode, setMode] = useState<Mode>("physique");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function handleRunAnalysis() {
    try {
      setIsSubmitting(true);
      setStatusMessage("");
      setErrorMessage("");
      setAiResult(null);

      if (!selectedFile) {
        setErrorMessage("Please upload an image first.");
        return;
      }

      const category = mode === "physique" ? "physique" : "food";

      const presign = await getPresignedUploadUrl({
        fileName: selectedFile.name,
        contentType: selectedFile.type || "image/jpeg",
        category,
      });

      await uploadFileToS3(presign.uploadUrl, selectedFile);

      if (mode === "physique") {
        const result = await analyzePhysique({
          frontImageKey: presign.key,
          notes,
          goal: "recomp",
        });

        setAiResult(result);
        setStatusMessage("Physique analysis complete.");
      } else {
        const result = await analyzeFood({
          imageKey: presign.key,
          analysisType: "meal_photo",
          notes,
        });

        setAiResult(result);
        setStatusMessage("Food analysis complete.");
      }
    } catch (error) {
      console.error("AI analysis failed:", error);
      setErrorMessage("Something went wrong while running AI analysis.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleUploadClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    setStatusMessage("");
    setErrorMessage("");
    setAiResult(null);
  }

  return (
    <MotionPage>
      <div className="grid">
        <motion.div {...fade(0)}>
          <h1 className="h1">AI Check-In</h1>
          <p className="p">
            Upload physique or food/label images and get actionable feedback.
          </p>
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
            <h2 className="h2">
              {mode === "physique"
                ? "Physique Analysis"
                : "Food & Label Analysis"}
            </h2>

            <p className="p">
              {mode === "physique"
                ? "Upload a progress photo + notes to track consistency and future coaching feedback."
                : "Upload a meal or nutrition label image and add notes for smarter food coaching."}
            </p>

            <div style={{ marginTop: 16 }}>
              <ScanReveal height={170} />
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />

            <div style={{ marginTop: 16 }}>
              <label
                style={{
                  display: "block",
                  color: "var(--faint)",
                  fontSize: 12,
                  marginBottom: 8,
                }}
              >
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={
                  mode === "physique"
                    ? "Example: morning physique check-in, felt leaner today, energy was good"
                    : "Example: chicken bowl and label scan, want macro and quality feedback"
                }
                style={{
                  width: "100%",
                  minHeight: 110,
                  resize: "vertical",
                  background: "var(--panel)",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                  borderRadius: 16,
                  padding: 14,
                  outline: "none",
                  font: "inherit",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div
              style={{
                marginTop: 12,
                color: "var(--faint)",
                fontSize: 13,
                lineHeight: 1.35,
              }}
            >
              {selectedFile
                ? `Selected file: ${selectedFile.name}`
                : "No file selected yet."}
            </div>

            {statusMessage ? (
              <div
                style={{
                  marginTop: 12,
                  color: "var(--faint)",
                  fontSize: 13,
                  lineHeight: 1.35,
                }}
              >
                {statusMessage}
              </div>
            ) : null}

            {errorMessage ? (
              <div
                style={{
                  marginTop: 12,
                  color: "#ff6b6b",
                  fontSize: 13,
                  lineHeight: 1.35,
                }}
              >
                {errorMessage}
              </div>
            ) : null}

            {aiResult ? (
              <div
                style={{
                  marginTop: 16,
                  padding: 16,
                  border: "1px solid var(--border)",
                  borderRadius: 16,
                  background: "var(--panel)",
                }}
              >
                <h3 style={{ marginTop: 0 }}>
                  {mode === "physique" ? "Physique AI Result" : "Food AI Result"}
                </h3>

                {aiResult.overallAssessment && (
                  <p><strong>Assessment:</strong> {aiResult.overallAssessment}</p>
                )}

                {aiResult.summary && (
                  <p><strong>Summary:</strong> {aiResult.summary}</p>
                )}

                {aiResult.recommendation && (
                  <p><strong>Recommendation:</strong> {aiResult.recommendation}</p>
                )}

                {aiResult.nutritionFocus && (
                  <p><strong>Nutrition Focus:</strong> {aiResult.nutritionFocus}</p>
                )}

                {aiResult.trainingFocus?.length > 0 && (
                  <div>
                    <strong>Training Focus:</strong>
                    <ul>
                      {aiResult.trainingFocus.map((item: string) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {aiResult.improvementAreas?.length > 0 && (
                  <div>
                    <strong>Improvement Areas:</strong>
                    <ul>
                      {aiResult.improvementAreas.map((item: string) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : null}

            <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
              <Button
                label={selectedFile ? "Replace Photo" : "Upload Photo"}
                onClick={handleUploadClick}
              />
              <Button
                label={isSubmitting ? "Running..." : "Run AI Analysis"}
                variant="ghost"
                onClick={handleRunAnalysis}
              />
            </div>
          </Card>
        </motion.div>
      </div>
    </MotionPage>
  );
}