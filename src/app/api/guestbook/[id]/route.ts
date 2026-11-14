import { requireUser, supabaseRequest } from "../../../../lib/admin";

export const dynamic = "force-dynamic";

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Context = { params: Promise<{ id: string }> };

// Edit your own entry.
export async function PATCH(request: Request, context: Context) {
  const user = await requireUser(request);
  if (user instanceof Response) return user;

  const { id } = await context.params;
  if (!uuidPattern.test(id)) {
    return Response.json({ error: "Invalid entry id." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  const raw = body && typeof body === "object" ? (body as { message?: unknown }).message : undefined;
  const message = typeof raw === "string" ? raw.trim() : "";
  if (message.length < 1 || message.length > 500) {
    return Response.json({ error: "Messages must be 1 to 500 characters." }, { status: 400 });
  }

  // The user_id filter means you can only ever change your own entries.
  const res = await supabaseRequest(
    "guestbook_entries?id=eq." + id + "&user_id=eq." + user.id,
    {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ message, updated_at: new Date().toISOString() }),
    }
  );
  if (!res.ok) {
    console.error("Updating a guestbook entry failed with status", res.status);
    return Response.json({ error: "Could not save your changes." }, { status: 502 });
  }
  const rows = (await res.json()) as unknown[];
  if (!Array.isArray(rows) || rows.length === 0) {
    return Response.json({ error: "Entry not found." }, { status: 404 });
  }
  return Response.json({ ok: true });
}

// Delete your own entry. Admins can delete any entry.
export async function DELETE(request: Request, context: Context) {
  const user = await requireUser(request);
  if (user instanceof Response) return user;

  const { id } = await context.params;
  if (!uuidPattern.test(id)) {
    return Response.json({ error: "Invalid entry id." }, { status: 400 });
  }

  const filter = user.isAdmin
    ? "guestbook_entries?id=eq." + id
    : "guestbook_entries?id=eq." + id + "&user_id=eq." + user.id;
  const res = await supabaseRequest(filter, {
    method: "DELETE",
    headers: { Prefer: "return=representation" },
  });
  if (!res.ok) {
    console.error("Deleting a guestbook entry failed with status", res.status);
    return Response.json({ error: "Could not delete the entry." }, { status: 502 });
  }
  const rows = (await res.json()) as unknown[];
  if (!Array.isArray(rows) || rows.length === 0) {
    return Response.json({ error: "Entry not found." }, { status: 404 });
  }
  return Response.json({ ok: true });
}
