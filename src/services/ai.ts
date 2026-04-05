import { apiFetch } from "./api";

export type CheckinReviewPayload = {
  checkInDate: string;
  weight?: number;
  steps?: number;
  mood?: string;
  notes?: string;
};

export type CheckinReviewResponse = {
  success: boolean;
  checkInDate: string;
  summary: string;
  recommendation: string;
  tomorrowFocus: string;
  riskFlags: string[];
};

export async function reviewCheckin(payload: CheckinReviewPayload) {
  return apiFetch<CheckinReviewResponse>("/ai/checkin-review", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export type AnalyzeFoodPayload = {
  imageKey: string;
  analysisType: "meal_photo" | "nutrition_label";
  notes?: string;
};

export type AnalyzeFoodResponse = {
  success: boolean;
  summary?: string;
  recommendation?: string;
  nutritionFocus?: string;
  riskFlags?: string[];
};

export async function analyzeFood(payload: AnalyzeFoodPayload) {
  return apiFetch<AnalyzeFoodResponse>("/ai/analyze-food", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export type AnalyzePhysiquePayload = {
  frontImageKey: string;
  sideImageKey?: string;
  backImageKey?: string;
  notes?: string;
  goal?: string;
};

export type AnalyzePhysiqueResponse = {
  success: boolean;
  overallAssessment?: string;
  summary?: string;
  recommendation?: string;
  nutritionFocus?: string;
  trainingFocus?: string[];
  improvementAreas?: string[];
  strengths?: string[];
  recommendedPhase?: string;
};

export async function analyzePhysique(payload: AnalyzePhysiquePayload) {
  return apiFetch<AnalyzePhysiqueResponse>("/ai/analyze-physique", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}