const COGNITO_DOMAIN = import.meta.env.VITE_COGNITO_DOMAIN;
const CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID;

const REDIRECT_URI =
  window.location.hostname === "localhost"
    ? "http://localhost:5173/"
    : `${window.location.origin}/`;

const AUTHORIZE_ENDPOINT = `${COGNITO_DOMAIN}/oauth2/authorize`;
const TOKEN_ENDPOINT = `${COGNITO_DOMAIN}/oauth2/token`;
const LOGOUT_ENDPOINT = `${COGNITO_DOMAIN}/logout`;

function randomString(length: number) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  let result = "";
  for (let i = 0; i < array.length; i++) {
    result += chars[array[i] % chars.length];
  }
  return result;
}

async function sha256(value: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  return crypto.subtle.digest("SHA-256", encoder.encode(value));
}

function base64UrlEncode(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function generatePkce() {
  const verifier = randomString(64);
  const challenge = base64UrlEncode(await sha256(verifier));
  return { verifier, challenge };
}

export async function login() {
  const state = randomString(32);
  const { verifier, challenge } = await generatePkce();

  sessionStorage.setItem("oauth_state", state);
  sessionStorage.setItem("pkce_verifier", verifier);

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: "openid email profile",
    code_challenge_method: "S256",
    code_challenge: challenge,
    state,
  });

  window.location.href = `${AUTHORIZE_ENDPOINT}?${params.toString()}`;
}

export async function handleAuthCallback() {
  const url = new URL(window.location.href);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code) return false;

  const savedState = sessionStorage.getItem("oauth_state");
  const verifier = sessionStorage.getItem("pkce_verifier");

  if (!state || state !== savedState || !verifier) {
    throw new Error("Invalid auth callback state.");
  }

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: CLIENT_ID,
    code,
    redirect_uri: REDIRECT_URI,
    code_verifier: verifier,
  });

  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token exchange failed: ${text}`);
  }

  const data = await res.json();

  localStorage.setItem("access_token", data.access_token);
  localStorage.setItem("id_token", data.id_token);
  if (data.refresh_token) {
    localStorage.setItem("refresh_token", data.refresh_token);
  }

  sessionStorage.removeItem("oauth_state");
  sessionStorage.removeItem("pkce_verifier");

  window.history.replaceState({}, document.title, REDIRECT_URI);
  return true;
}

export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("id_token");
  localStorage.removeItem("refresh_token");

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    logout_uri: REDIRECT_URI,
  });

  window.location.href = `${LOGOUT_ENDPOINT}?${params.toString()}`;
}

export function isAuthenticated() {
  return !!localStorage.getItem("access_token");
}

export function getAccessToken() {
  return localStorage.getItem("access_token");
}