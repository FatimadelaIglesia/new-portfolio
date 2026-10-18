import { requireAdmin, supabaseRequest } from "@/lib/admin";
import { parseMessageInput } from "@/lib/messages";

// Read: list all messages, newest first
export async function GET(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const response = await supabaseRequest(
    "contact_messages?select=*&order=created_at.desc&limit=500"
  );
  if (!response.ok) {
    console.error("Loading messages failed with status", response.status);
    return Response.json({ error: "Could not load messages." }, { status: 502 });
  }
  return Response.json({ messages: await response.json() });
}

// Create: add a message by hand
export async function POST(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const { data, error } = parseMessageInput(body, false);
  if (error || !data) {
    return Response.json({ error: error ?? "Invalid request." }, { status: 400 });
  }

  const response = await supabaseRequest("contact_messages", {
    method: "POST",
    body: JSON.stringify(data),
    prefer: "return=representation",
  });
  if (!response.ok) {
    console.error("Creating a message failed with status", response.status);
    return Response.json({ error: "Could not create the message." }, { status: 502 });
  }
  const rows = await response.json();
  return Response.json({ message: rows[0] }, { status: 201 });
}
