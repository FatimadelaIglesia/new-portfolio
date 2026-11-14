export type ProfileInput = {
  first_name?: string;
  last_name?: string;
  email?: string;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function parseProfileInput(
  body: unknown
): { ok: true; data: ProfileInput } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid request." };
  }
  const b = body as Record<string, unknown>;
  const data: ProfileInput = {};

  for (const key of ["first_name", "last_name"] as const) {
    if (b[key] === undefined) continue;
    if (typeof b[key] !== "string") return { ok: false, error: "Invalid name." };
    const value = (b[key] as string).trim();
    if (value.length > 100) {
      return { ok: false, error: "Names can be up to 100 characters." };
    }
    data[key] = value;
  }

  if (b.email !== undefined) {
    if (typeof b.email !== "string") return { ok: false, error: "Invalid email." };
    const email = b.email.trim();
    if (email.length < 3 || email.length > 254 || !EMAIL.test(email)) {
      return { ok: false, error: "Enter a valid email address." };
    }
    data.email = email;
  }

  if (Object.keys(data).length === 0) {
    return { ok: false, error: "Nothing to update." };
  }
  return { ok: true, data };
}
