const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function reply(body: Record<string, unknown>, status = 200) {
  return Response.json(body, { status });
}

export async function POST(request: Request) {
  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/+$/, "");
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !secretKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_SECRET_KEY");
    return reply({ error: "The server is not set up yet." }, 500);
  }

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

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (name.length < 1 || name.length > 100) {
    return reply({ error: "Please enter your name." }, 400);
  }
  if (email.length > 254 || !emailPattern.test(email)) {
    return reply({ error: "Please enter a valid email address." }, 400);
  }
  if (message.length < 1 || message.length > 5000) {
    return reply({ error: "Please enter a message (up to 5000 characters)." }, 400);
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    apikey: secretKey,
    Prefer: "return=minimal",
  };
  // Older JWT-style keys also need this header. The newer sb_ keys must not have it.
  if (secretKey.startsWith("eyJ")) {
    headers.Authorization = `Bearer ${secretKey}`;
  }

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/contact_messages`, {
      method: "POST",
      headers,
      body: JSON.stringify({ name, email, message }),
    });
    if (!response.ok) {
      console.error("Supabase insert failed with status", response.status);
      return reply({ error: "Your message could not be saved." }, 502);
    }
  } catch (error) {
    console.error("Supabase request failed", error);
    return reply({ error: "Your message could not be saved." }, 502);
  }

  return reply({ ok: true });
}
