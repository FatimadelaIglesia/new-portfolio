import { requireAdmin, supabaseRequest } from "@/lib/admin";
import { parseMessageInput } from "@/lib/messages";

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Context = { params: Promise<{ id: string }> };

// Update: change any of the fields
export async function PATCH(request: Request, context: Context) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const { id } = await context.params;
  if (!uuidPattern.test(id)) {
    return Response.json({ error: "Invalid message id." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const { data, error } = parseMessageInput(body, true);
  if (error || !data) {
    return Response.json({ error: error ?? "Invalid request." }, { status: 400 });
  }

  const response = await supabaseRequest(`contact_messages?id=eq.${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
    prefer: "return=representation",
  });
  if (!response.ok) {
    console.error("Updating a message failed with status", response.status);
    return Response.json({ error: "Could not update the message." }, { status: 502 });
  }
  const rows = await response.json();
  if (!Array.isArray(rows) || rows.length === 0) {
    return Response.json({ error: "Message not found." }, { status: 404 });
  }
  return Response.json({ message: rows[0] });
}

// Delete: remove a message for good
export async function DELETE(request: Request, context: Context) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const { id } = await context.params;
  if (!uuidPattern.test(id)) {
    return Response.json({ error: "Invalid message id." }, { status: 400 });
  }

  const response = await supabaseRequest(`contact_messages?id=eq.${id}`, {
    method: "DELETE",
    prefer: "return=representation",
  });
  if (!response.ok) {
    console.error("Deleting a message failed with status", response.status);
    return Response.json({ error: "Could not delete the message." }, { status: 502 });
  }
  const rows = await response.json();
  if (!Array.isArray(rows) || rows.length === 0) {
    return Response.json({ error: "Message not found." }, { status: 404 });
  }
  return Response.json({ ok: true });
}
