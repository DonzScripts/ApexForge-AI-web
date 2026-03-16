import { apiFetch } from "./api";

export async function getMe() {
  return apiFetch("/me", {
    method: "GET",
  });
}
