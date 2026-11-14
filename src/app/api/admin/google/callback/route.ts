import { timingSafeEqual } from "crypto";
import { fetchGoogleProfile, siteUrl, type GoogleProfile } from "../../../../../lib/google";
import {
  createSessionToken,
  isAdminEmail,
  isAuthConfigured,
  readCookie,
  sessionCookie,
  supabaseRequest,
} from "../../../../../lib/admin";

export const dynamic = "force-dynamic";

const SUB = /^[A-Za-z0-9_-]{1,255}$/;
const CLEAR_STATE = "g_state=; Path=/api/admin/google; HttpOnly; Secure; SameSite=Lax; Max-Age=0";
const CLEAR_VERIFIER = "g_verifier=; Path=/api/admin/google; HttpOnly; Secure; SameSite=Lax; Max-Age=0";

function fail(code: string): Response {
  const headers = new Headers();
  headers.set("Location", siteUrl() + "/login?error=" + code);
  headers.append("Set-Cookie", CLEAR_STATE);
  headers.append("Set-Cookie", CLEAR_VERIFIER);
  headers.set("Cache-Control", "no-store");
  return new Response(null, { status: 302, headers });
}

function sameText(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

const FIELDS = "id,google_email,role";

async function findBySub(sub: string): Promise<{ id: string; google_email: string | null; role: string } | null> {
  const res = await supabaseRequest(
    "app_users?google_sub=eq." + encodeURIComponent(sub) + "&select=" + FIELDS + "&limit=1"
  );
  if (!res.ok) throw new Error("lookup failed");
  const rows = (await res.json()) as { id: string; google_email: string | null; role: string }[];
  return rows[0] || null;
}

async function findOrCreateUser(profile: GoogleProfile): Promise<string> {
  const wantedRole = isAdminEmail(profile.email) ? "admin" : "user";

  const existing = await findBySub(profile.sub);
  if (existing) {
    if (existing.google_email !== profile.email || existing.role !== wantedRole) {
      await supabaseRequest("app_users?id=eq." + existing.id, {
        method: "PATCH",
        body: JSON.stringify({
          google_email: profile.email,
          role: wantedRole,
          updated_at: new Date().toISOString(),
        }),
      });
    }
    return existing.id;
  }

  // First login: create the profile automatically from the Google account.
  const created = await supabaseRequest("app_users", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      google_sub: profile.sub,
      google_email: profile.email,
      email: profile.email,
      first_name: profile.givenName,
      last_name: profile.familyName,
      role: wantedRole,
    }),
  });
  if (created.ok) {
    const rows = (await created.json()) as { id: string }[];
    if (rows[0]) return rows[0].id;
  }
  // Two logins at once can collide on the unique key: look again.
  const again = await findBySub(profile.sub);
  if (again) return again.id;
  throw new Error("could not create user");
}

export async function GET(request: Request) {
  if (!isAuthConfigured()) return fail("config");

  const url = new URL(request.url);
  if (url.searchParams.get("error")) return fail("denied");

  const code = url.searchParams.get("code") || "";
  const state = url.searchParams.get("state") || "";
  const savedState = readCookie(request, "g_state");
  const verifier = readCookie(request, "g_verifier");
  if (!code || !state || !savedState || !verifier || !sameText(state, savedState)) {
    return fail("state");
  }

  let profile: GoogleProfile | null = null;
  try {
    profile = await fetchGoogleProfile(code, verifier);
  } catch {
    profile = null;
  }
  if (!profile || !SUB.test(profile.sub)) return fail("google");
  if (!profile.verified) return fail("unverified");

  let userId = "";
  try {
    userId = await findOrCreateUser(profile);
  } catch {
    return fail("database");
  }

  const target = isAdminEmail(profile.email) ? "/admin" : "/settings";
  const html =
    '<!doctype html><html lang="en"><head><meta charset="utf-8">' +
    '<meta http-equiv="refresh" content="0;url=' + target + '">' +
    "<title>Signing in</title></head><body>" +
    '<p>Signing you in... <a href="' + target + '">Continue</a></p></body></html>';

  const headers = new Headers();
  headers.set("Content-Type", "text/html; charset=utf-8");
  headers.set("Cache-Control", "no-store");
  headers.append("Set-Cookie", sessionCookie(createSessionToken(userId)));
  headers.append("Set-Cookie", CLEAR_STATE);
  headers.append("Set-Cookie", CLEAR_VERIFIER);
  return new Response(html, { status: 200, headers });
}
