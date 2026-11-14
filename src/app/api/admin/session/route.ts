import { clearSessionCookie } from "../../../../lib/admin";

export const dynamic = "force-dynamic";

// Log out: clears the session cookie.
export async function DELETE(request: Request) {
  if (request.headers.get("x-admin-request") !== "1") {
    return new Response(JSON.stringify({ error: "Request blocked." }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }
  const headers = new Headers();
  headers.append("Set-Cookie", clearSessionCookie());
  headers.set("Cache-Control", "no-store");
  return new Response(null, { status: 204, headers });
}
