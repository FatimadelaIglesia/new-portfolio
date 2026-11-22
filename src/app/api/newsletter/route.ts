import { supabaseRequest } from "../../../lib/admin";

export const dynamic = "force-dynamic";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function reply(body: Record<string, unknown>, status = 200) {
  return Response.json(body, { status });
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return reply({ error: "Invalid request." }, 400);
  }

  // Bots tend to fill hidden fields. Pretend it worked and store nothing.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return reply({ ok: true });
  }

  const firstName = typeof body.firstName === "string" ? body.firstName.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

  if (firstName.length < 1 || firstName.length > 100) {
    return reply({ error: "Please enter your first name." }, 400);
  }
  if (email.length > 254 || !emailPattern.test(email)) {
    return reply({ error: "Please enter a valid email address." }, 400);
  }

  try {
    // Signing up twice with the same email is not an error: the duplicate is ignored.
    const res = await supabaseRequest("newsletter_subscribers?on_conflict=email", {
      method: "POST",
      headers: { Prefer: "resolution=ignore-duplicates,return=minimal" },
      body: JSON.stringify({ first_name: firstName, email }),
    });
    if (!res.ok) {
      console.error("Newsletter insert failed with status", res.status);
      return reply({ error: "Your subscription could not be saved." }, 502);
    }
  } catch (error) {
    console.error("Newsletter request failed", error);
    return reply({ error: "Your subscription could not be saved." }, 502);
  }

  return reply({ ok: true });
}
