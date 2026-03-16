import { apiFetch } from "./api";

export async function getPlans() {
  return apiFetch("/plans", {
    method: "GET",
  });
}

export async function postPlan(planType: "workout" | "meal") {
  return apiFetch("/plan", {
    method: "POST",
    body: JSON.stringify({ planType }),
  });
}
