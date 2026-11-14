import { buildAuthUrl, isGoogleConfigured, randomToken, siteUrl } from "../../../../lib/google";
import { isAuthConfigured } from "../../../../lib/admin";

export const dynamic = "force-dynamic";

function cookie(name: string, value: string): string {
  return (
    name +
    "=" +
    value +
    "; Path=/api/admin/google; HttpOnly; Secure; SameSite=Lax; Max-Age=600"
  );
}

export async function GET() {
  if (!isGoogleConfigured() || !isAuthConfigured()) {
    return new Response(null, {
      status: 302,
      headers: { Location: siteUrl() + "/login?error=config" },
    });
  }
  const state = randomToken(24);
  const verifier = randomToken(48);
  const headers = new Headers();
  headers.set("Location", buildAuthUrl(state, verifier));
  headers.append("Set-Cookie", cookie("g_state", state));
  headers.append("Set-Cookie", cookie("g_verifier", verifier));
  headers.set("Cache-Control", "no-store");
  return new Response(null, { status: 302, headers });
}
