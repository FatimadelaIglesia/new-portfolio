import { createHash, randomBytes } from "crypto";

export function siteUrl(): string {
  return (process.env.SITE_URL || "").trim().replace(/\/+$/, "");
}

export function allowedEmails(): string[] {
  return (process.env.ADMIN_GOOGLE_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isGoogleConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      siteUrl()
  );
}

export function redirectUri(): string {
  return siteUrl() + "/api/admin/google/callback";
}

export function randomToken(bytes = 32): string {
  return randomBytes(bytes).toString("base64url");
}

function challengeFor(verifier: string): string {
  return createHash("sha256").update(verifier).digest("base64url");
}

export function buildAuthUrl(state: string, verifier: string): string {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID || "",
    redirect_uri: redirectUri(),
    response_type: "code",
    scope: "openid email profile",
    state,
    code_challenge: challengeFor(verifier),
    code_challenge_method: "S256",
    prompt: "select_account",
  });
  return "https://accounts.google.com/o/oauth2/v2/auth?" + params.toString();
}

export type GoogleProfile = {
  sub: string;
  email: string;
  verified: boolean;
  givenName: string;
  familyName: string;
};

export async function fetchGoogleProfile(
  code: string,
  verifier: string
): Promise<GoogleProfile | null> {
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID || "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
      redirect_uri: redirectUri(),
      grant_type: "authorization_code",
      code_verifier: verifier,
    }).toString(),
  });
  if (!tokenRes.ok) return null;
  const tokens = (await tokenRes.json()) as { access_token?: string };
  if (!tokens.access_token) return null;

  const infoRes = await fetch(
    "https://openidconnect.googleapis.com/v1/userinfo",
    { headers: { Authorization: "Bearer " + tokens.access_token } }
  );
  if (!infoRes.ok) return null;
  const info = (await infoRes.json()) as {
    sub?: string;
    email?: string;
    email_verified?: boolean;
    given_name?: string;
    family_name?: string;
  };
  if (!info.sub || !info.email) return null;
  return {
    sub: String(info.sub),
    email: String(info.email).toLowerCase(),
    verified: info.email_verified === true,
    givenName: String(info.given_name || "").slice(0, 100),
    familyName: String(info.family_name || "").slice(0, 100),
  };
}
