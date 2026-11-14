import {
  clearSessionCookie,
  getUserFromRequest,
  requireUser,
  supabaseRequest,
  type AppUser,
} from "../../../lib/admin";
import { parseProfileInput } from "../../../lib/profile";

export const dynamic = "force-dynamic";

function json(status: number, body: unknown, extra?: Headers): Response {
  const headers = extra || new Headers();
  headers.set("Content-Type", "application/json");
  headers.set("Cache-Control", "no-store");
  return new Response(JSON.stringify(body), { status, headers });
}

function publicUser(u: AppUser) {
  return {
    id: u.id,
    email: u.email,
    first_name: u.first_name,
    last_name: u.last_name,
    isAdmin: u.isAdmin,
  };
}

export async function GET(request: Request) {
  const user = await getUserFromRequest(request);
  return json(200, { user: user ? publicUser(user) : null });
}

export async function PATCH(request: Request) {
  const result = await requireUser(request);
  if (result instanceof Response) return result;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json(400, { error: "Invalid request." });
  }
  // Only first_name, last_name and email are ever read: role cannot be changed here.
  const parsed = parseProfileInput(body);
  if (!parsed.ok) return json(400, { error: parsed.error });

  const res = await supabaseRequest("app_users?id=eq." + result.id, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ ...parsed.data, updated_at: new Date().toISOString() }),
  });
  if (!res.ok) return json(500, { error: "Could not save your changes." });
  const rows = (await res.json()) as AppUser[];
  const updated: AppUser = { ...result, ...(rows[0] || {}), isAdmin: result.isAdmin };
  return json(200, { user: publicUser(updated) });
}

export async function DELETE(request: Request) {
  const result = await requireUser(request);
  if (result instanceof Response) return result;

  const res = await supabaseRequest("app_users?id=eq." + result.id, {
    method: "DELETE",
  });
  if (!res.ok) return json(500, { error: "Could not delete your account." });
  const headers = new Headers();
  headers.append("Set-Cookie", clearSessionCookie());
  headers.set("Cache-Control", "no-store");
  return new Response(null, { status: 204, headers });
}
