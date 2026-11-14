import { getUserFromRequest, requireUser, supabaseRequest } from "../../../lib/admin";

export const dynamic = "force-dynamic";

const MAX_LENGTH = 500;
const MAX_PER_USER = 50;

type Row = {
  id: string;
  user_id: string;
  message: string;
  created_at: string;
  updated_at: string;
  app_users: { first_name: string } | null;
};

function shape(row: Row, userId: string | null, isAdmin: boolean) {
  const mine = userId !== null && row.user_id === userId;
  return {
    id: row.id,
    message: row.message,
    created_at: row.created_at,
    edited: row.updated_at !== row.created_at,
    author: (row.app_users && row.app_users.first_name) || "Guest",
    mine,
    canDelete: mine || isAdmin,
  };
}

// Anyone can read the guestbook.
export async function GET(request: Request) {
  const user = await getUserFromRequest(request);
  const res = await supabaseRequest(
    "guestbook_entries?select=id,user_id,message,created_at,updated_at,app_users(first_name)&order=created_at.desc&limit=100"
  );
  if (!res.ok) {
    console.error("Loading guestbook failed with status", res.status);
    return Response.json({ error: "Could not load the guestbook." }, { status: 502 });
  }
  const rows = (await res.json()) as Row[];
  return Response.json(
    { entries: rows.map((r) => shape(r, user ? user.id : null, user ? user.isAdmin : false)) },
    { headers: { "Cache-Control": "no-store" } }
  );
}

// Logged-in users can add an entry.
export async function POST(request: Request) {
  const user = await requireUser(request);
  if (user instanceof Response) return user;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  const raw = body && typeof body === "object" ? (body as { message?: unknown }).message : undefined;
  if (typeof raw !== "string") {
    return Response.json({ error: "Write a message first." }, { status: 400 });
  }
  const message = raw.trim();
  if (message.length < 1) {
    return Response.json({ error: "Write a message first." }, { status: 400 });
  }
  if (message.length > MAX_LENGTH) {
    return Response.json({ error: "Messages can be up to 500 characters." }, { status: 400 });
  }

  const count = await supabaseRequest(
    "guestbook_entries?user_id=eq." + user.id + "&select=id&limit=" + MAX_PER_USER
  );
  if (count.ok) {
    const existing = (await count.json()) as unknown[];
    if (existing.length >= MAX_PER_USER) {
      return Response.json(
        { error: "You have reached the limit of 50 entries. Delete one to add another." },
        { status: 429 }
      );
    }
  }

  const res = await supabaseRequest("guestbook_entries", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ user_id: user.id, message }),
  });
  if (!res.ok) {
    console.error("Saving a guestbook entry failed with status", res.status);
    return Response.json({ error: "Could not save your message." }, { status: 502 });
  }
  const rows = (await res.json()) as Row[];
  const row = { ...rows[0], app_users: { first_name: user.first_name } };
  return Response.json({ entry: shape(row, user.id, user.isAdmin) }, { status: 201 });
}
