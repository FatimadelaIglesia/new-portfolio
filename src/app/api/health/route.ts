import { supabaseRequest } from "../../../lib/admin";

export const dynamic = "force-dynamic";

// A tiny database read. Calling this regularly keeps the free Supabase
// project from being paused for inactivity. On failure it says which
// part is wrong (never any secret values) so setup problems are easy to find.
export async function GET() {
  const url = process.env.SUPABASE_URL || "";
  const key = process.env.SUPABASE_SECRET_KEY || "";
  const missing: string[] = [];
  if (!url) missing.push("SUPABASE_URL");
  if (!key) missing.push("SUPABASE_SECRET_KEY");
  if (missing.length) {
    return Response.json({ ok: false, reason: "missing: " + missing.join(", ") }, { status: 503 });
  }
  if (!/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(url.trim())) {
    return Response.json(
      { ok: false, reason: "SUPABASE_URL should look like https://xxxx.supabase.co" },
      { status: 503 }
    );
  }
  try {
    const res = await supabaseRequest("app_users?select=id&limit=1");
    if (!res.ok) {
      return Response.json(
        { ok: false, reason: "database answered with status " + res.status },
        { status: 503 }
      );
    }
    return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ ok: false, reason: "could not reach the database" }, { status: 503 });
  }
}
