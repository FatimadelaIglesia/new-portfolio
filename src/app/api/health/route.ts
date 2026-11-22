import { supabaseRequest } from "../../../lib/admin";

export const dynamic = "force-dynamic";

// A tiny database read. Calling this regularly keeps the free Supabase
// project from being paused for inactivity.
export async function GET() {
  try {
    const res = await supabaseRequest("app_users?select=id&limit=1");
    if (!res.ok) {
      return Response.json({ ok: false }, { status: 503 });
    }
    return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ ok: false }, { status: 503 });
  }
}
