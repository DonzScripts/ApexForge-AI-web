import { apiFetch } from "./api";

export type CheckInPayload = {
  type: "physique" | "food";
  notes?: string;
  imageUrl?: string;
  weight?: number;
  calories?: number;
  protein?: number;
};

export async function postCheckIn(payload: CheckInPayload) {
  return apiFetch("/checkin", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
