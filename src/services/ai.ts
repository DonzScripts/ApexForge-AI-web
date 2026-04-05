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