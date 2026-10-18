export const STATUSES = ["new", "read", "replied", "archived"] as const;
export type Status = (typeof STATUSES)[number];

export type Message = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  message: string;
  status: Status;
  notes: string | null;
};

export type MessageInput = {
  name: string;
  email: string;
  message: string;
  status: Status;
  notes: string | null;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function parseMessageInput(
  body: unknown,
  partial: boolean
): { data?: Partial<MessageInput>; error?: string } {
  if (typeof body !== "object" || body === null) {
    return { error: "Invalid request." };
  }
  const input = body as Record<string, unknown>;
  const data: Partial<MessageInput> = {};

  if (!partial || "name" in input) {
    const name = typeof input.name === "string" ? input.name.trim() : "";
    if (name.length < 1 || name.length > 100) {
      return { error: "Name must be 1 to 100 characters." };
    }
    data.name = name;
  }

  if (!partial || "email" in input) {
    const email = typeof input.email === "string" ? input.email.trim() : "";
    if (email.length > 254 || !emailPattern.test(email)) {
      return { error: "Please enter a valid email address." };
    }
    data.email = email;
  }

  if (!partial || "message" in input) {
    const message = typeof input.message === "string" ? input.message.trim() : "";
    if (message.length < 1 || message.length > 5000) {
      return { error: "Message must be 1 to 5000 characters." };
    }
    data.message = message;
  }

  if ("status" in input) {
    if (!STATUSES.includes(input.status as Status)) {
      return { error: "Status must be new, read, replied or archived." };
    }
    data.status = input.status as Status;
  } else if (!partial) {
    data.status = "new";
  }

  if ("notes" in input) {
    const notes = typeof input.notes === "string" ? input.notes.trim() : "";
    if (notes.length > 2000) {
      return { error: "Notes can be up to 2000 characters." };
    }
    data.notes = notes === "" ? null : notes;
  }

  if (partial && Object.keys(data).length === 0) {
    return { error: "Nothing to update." };
  }
  return { data };
}
