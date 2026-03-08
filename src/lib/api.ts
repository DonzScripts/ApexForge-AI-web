import { getAccessToken } from "./auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getAccessToken();

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }

  return res.json();
}

export function getMe() {
  return apiFetch("/me", { method: "GET" });
}

export function getPlans() {
  return apiFetch("/plans", { method: "GET" });
}

export function createPlan(payload: { title: string; goal?: string }) {
  return apiFetch("/plans", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function createCheckIn(payload: {
  checkInDate: string;
  weight?: number;
  steps?: number;
  mood?: string;
  notes?: string;
}) {
  return apiFetch("/checkins", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}