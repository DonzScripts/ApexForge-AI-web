import { apiFetch } from "./api";

export type CheckInMode = "physique" | "food";

export type CheckInPayload = {
  checkInDate: string;
  type?: CheckInMode;
  imageUrl?: string;
  weight?: number;
  steps?: number;
  mood?: string;
  notes?: string;
};

export type CheckInItem = {
  userId: string;
  checkInDate: string;
  type?: CheckInMode;
  imageUrl?: string;
  weight?: number;
  steps?: number;
  mood?: string;
  notes?: string;
};

export type GetCheckInsResponse = {
  success: boolean;
  items: CheckInItem[];
};

export async function postCheckIn(payload: CheckInPayload) {
  return apiFetch<{
    success: boolean;
    item: CheckInItem;
  }>("/checkin", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getCheckIns() {
  return apiFetch<GetCheckInsResponse>("/checkins", {
    method: "GET",
  });
}
