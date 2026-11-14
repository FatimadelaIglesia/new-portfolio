import { createHmac, timingSafeEqual } from "crypto";
import { allowedEmails } from "./google";

export const SESSION_COOKIE = "session";
const SESSION_SECONDS = 8 * 60 * 60;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type AppUser = {
  id: string;
  google_email: string | null;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  isAdmin: boolean;
};

export function isAuthConfigured(): boolean {
  return Boolean(
    process.env.SUPABASE_URL &&
      process.env.SUPABASE_SECRET_KEY &&
      process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.SITE_URL
  );
}

function signingKey(): string {
  return (
    (process.env.SUPABASE_SECRET_KEY || "") +
    ":" +
    (process.env.GOOGLE_CLIENT_SECRET || "")
  );
}

function sign(data: string): string {
  return createHmac("sha256", signingKey()).update(data).digest("base64url");
}

export function createSessionToken(userId: string): string {
  const payload = Buffer.from(
    JSON.stringify({ uid: userId, exp: Date.now() + SESSION_SECONDS * 1000 })
  ).toString("base64url");
  return payload + "." + sign(payload);
}

export function verifySessionToken(token: string): string | null {
  if (!token || !isAuthConfigured()) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payload, sig] = parts;
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (typeof data.uid !== "string" || !UUID.test(data.uid)) return null;
    if (typeof data.exp !== "number" || data.exp < Date.now()) return null;
    return data.uid;
  } catch {
    return null;
  }
}

export function readCookie(request: Request, name: string): string {
  const header = request.headers.get("cookie") || "";
  for (const part of header.split(";")) {
    const i = part.indexOf("=");
    if (i < 0) continue;
    if (part.slice(0, i).trim() === name) return part.slice(i + 1).trim();
  }
  return "";
}

export function sessionCookie(token: string): string {
  return (
    SESSION_COOKIE +
    "=" +
    token +
    "; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=" +
    SESSION_SECONDS
  );
}

export function clearSessionCookie(): string {
  return SESSION_COOKIE + "=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0";
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return allowedEmails().includes(email.toLowerCase());
}

export function supabaseRequest(path: string, init: RequestInit = {}): Promise<Response> {
  const base = (process.env.SUPABASE_URL || "").replace(/\/+$/, "");
  const key = process.env.SUPABASE_SECRET_KEY || "";
  const headers: Record<string, string> = {
    apikey: key,
    "Content-Type": "application/json",
    ...((init.headers as Record<string, string>) || {}),
  };
  if (key.startsWith("eyJ")) headers.Authorization = "Bearer " + key;
  return fetch(base + "/rest/v1/" + path, { ...init, headers, cache: "no-store" });
}

export async function getUserFromToken(token: string): Promise<AppUser | null> {
  const uid = verifySessionToken(token);
  if (!uid) return null;
  try {
    const res = await supabaseRequest(
      "app_users?id=eq." +
        uid +
        "&select=id,google_email,email,first_name,last_name,role&limit=1"
    );
    if (!res.ok) return null;
    const rows = (await res.json()) as Omit<AppUser, "isAdmin">[];
    if (!rows.length) return null;
    return { ...rows[0], isAdmin: isAdminEmail(rows[0].google_email) };
  } catch {
    return null;
  }
}

export function getUserFromRequest(request: Request): Promise<AppUser | null> {
  return getUserFromToken(readCookie(request, SESSION_COOKIE));
}

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

export async function requireUser(request: Request): Promise<AppUser | Response> {
  if (!isAuthConfigured()) return json(503, { error: "Login is not set up yet." });
  const method = request.method.toUpperCase();
  if (method !== "GET" && method !== "HEAD") {
    if (request.headers.get("x-admin-request") !== "1") {
      return json(403, { error: "Request blocked." });
    }
  }
  const user = await getUserFromRequest(request);
  if (!user) return json(401, { error: "Please log in." });
  return user;
}

export async function requireAdmin(request: Request): Promise<Response | null> {
  const result = await requireUser(request);
  if (result instanceof Response) return result;
  if (!result.isAdmin) return json(403, { error: "Admins only." });
  return null;
}
