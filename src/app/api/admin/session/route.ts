import {
  SESSION_COOKIE,
  SESSION_SECONDS,
  createSessionToken,
  isAdminConfigured,
  passwordMatches,
} from "@/lib/admin";

function cookieFlags() {
  return `Path=/; HttpOnly; SameSite=Strict${
    process.env.NODE_ENV === "production" ? "; Secure" : ""
  }`;
}

// Log in
export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return Response.json({ error: "Admin is not set up yet." }, { status: 500 });
  }

  let password = "";
  try {
    const body = await request.json();
    if (typeof body?.password === "string") {
      password = body.password;
    }
  } catch {
    // An unreadable body counts as a wrong password.
  }

  if (!passwordMatches(password)) {
    // A short pause makes guessing passwords slow.
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return Response.json({ error: "Wrong password." }, { status: 401 });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": `${SESSION_COOKIE}=${createSessionToken()}; ${cookieFlags()}; Max-Age=${SESSION_SECONDS}`,
    },
  });
}

// Log out
export async function DELETE() {
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": `${SESSION_COOKIE}=; ${cookieFlags()}; Max-Age=0`,
    },
  });
}
