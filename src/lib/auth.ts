const COGNITO_DOMAIN = import.meta.env.VITE_COGNITO_DOMAIN;
const CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID;

const REDIRECT_URI =
  window.location.hostname === "localhost"
    ? "http://localhost:5173/"
    : window.location.origin + "/";

const TOKEN_ENDPOINT = `${COGNITO_DOMAIN}/oauth2/token`;
const LOGOUT_ENDPOINT = `${COGNITO_DOMAIN}/logout`;
const AUTHORIZE_ENDPOINT = `${COGNITO_DOMAIN}/oauth2/authorize`;

function randomString(length: number) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  let result = "";
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < array.length; i++) {
    result += chars[array[i] % chars.length];
  }
  return result;
}

async function sha256(plain: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return await crypto.subtle.digest("SHA-256", data);
}

function base64UrlEncode(buffer: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function generatePkcePair() {
  const verifier = randomString(64);
  const digest = await sha256(verifier);
  const challenge = base64UrlEncode(digest);
  return { verifier, challenge };
}

export async function login() {
  const state = randomString(32);
  const { verifier, challenge } = await generatePkcePair();

  sessionStorage.setItem("pkce_verifier", verifier);
  sessionStorage.setItem("oauth_state", state);

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: "code",
    scope: "openid email profile",
    redirect_uri: REDIRECT_URI,
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
  const savedState = sessionStorage.getItem("oauth_state");
  const verifier = sessionStorage.getItem("pkce_verifier");

  if (!code) return false;

  if (!state || state !== savedState || !verifier) {
    throw new Error("Invalid OAuth state or missing PKCE verifier.");
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
  localStorage.setItem("refresh_token", data.refresh_token || "");

  sessionStorage.removeItem("pkce_verifier");
  sessionStorage.removeItem("oauth_state");

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

export function getAccessToken() {
  return localStorage.getItem("access_token");
}

export function getIdToken() {
  return localStorage.getItem("id_token");
}

export function isAuthenticated() {
  return !!localStorage.getItem("access_token");
}