import { createHash, createHmac, timingSafeEqual } from "crypto";

export const SESSION_COOKIE = "admin_session";
export const SESSION_SECONDS = 60 * 60 * 8;

export function isAdminConfigured() {
  const password = process.env.ADMIN_PASSWORD;
  return Boolean(
    password &&
      password.length >= 12 &&
      process.env.SUPABASE_URL &&
      process.env.SUPABASE_SECRET_KEY
  );
}

function signingKey() {
  return `${process.env.SUPABASE_SECRET_KEY ?? ""}:${process.env.ADMIN_PASSWORD ?? ""}`;
}

function sign(payload: string) {
  return createHmac("sha256", signingKey()).update(payload).digest("base64url");
}

export function createSessionToken() {
  const expires = Date.now() + SESSION_SECONDS * 1000;
  const payload = Buffer.from(JSON.stringify({ exp: expires })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | null | undefined) {
  if (!token || !isAdminConfigured()) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const given = Buffer.from(signature);
  const expected = Buffer.from(sign(payload));
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) {
    return false;
  }

  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString());
    return typeof exp === "number" && exp > Date.now();
  } catch {
    return false;
  }
}

export function passwordMatches(input: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const a = createHash("sha256").update(input).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

export function readCookie(request: Request, name: string) {
  const header = request.headers.get("cookie") ?? "";
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return rest.join("=");
  }
  return null;
}

// Returns an error response when the request is not allowed, or null when it is fine.
export function requireAdmin(request: Request): Response | null {
  if (!isAdminConfigured()) {
    return Response.json({ error: "Admin is not set up yet." }, { status: 500 });
  }
  if (!verifySessionToken(readCookie(request, SESSION_COOKIE))) {
    return Response.json({ error: "Not signed in." }, { status: 401 });
  }
  if (request.method !== "GET" && request.headers.get("x-admin-request") !== "1") {
    return Response.json({ error: "Invalid request." }, { status: 403 });
  }
  return null;
}

export function supabaseRequest(
  path: string,
  init: { method?: string; body?: string; prefer?: string } = {}
) {
  const base = (process.env.SUPABASE_URL ?? "").replace(/\/+$/, "");
  const key = process.env.SUPABASE_SECRET_KEY ?? "";
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    apikey: key,
  };
  // Older JWT-style keys also need this header. The newer sb_ keys must not have it.
  if (key.startsWith("eyJ")) {
    headers.Authorization = `Bearer ${key}`;
  }
  if (init.prefer) {
    headers.Prefer = init.prefer;
  }
  return fetch(`${base}/rest/v1/${path}`, {
    method: init.method ?? "GET",
    headers,
    body: init.body,
    cache: "no-store",
  });
}
