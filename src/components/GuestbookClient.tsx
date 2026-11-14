"use client";

import { useCallback, useEffect, useId, useState } from "react";
import Link from "next/link";
import { loadCurrentUser } from "@/lib/currentUser";
import type { PublicUser } from "@/lib/currentUser";

type Entry = {
  id: string;
  message: string;
  created_at: string;
  edited: boolean;
  author: string;
  mine: boolean;
  canDelete: boolean;
};

const MAX_LENGTH = 500;
const JSON_HEADERS = { "Content-Type": "application/json", "x-admin-request": "1" };

const fieldClass =
  "w-full rounded-lg border border-input-border bg-background px-4 py-2.5 text-sm text-text placeholder:text-text-muted focus:border-primary";
const smallButton =
  "rounded-full border border-primary px-4 py-1.5 text-xs font-semibold text-primary-dark hover:bg-primary/10 disabled:opacity-60";

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function GuestbookClient() {
  const uid = useId();
  const [user, setUser] = useState<PublicUser | null | undefined>(undefined);
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [loadError, setLoadError] = useState("");
  const [text, setText] = useState("");
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/guestbook", { cache: "no-store" });
      const json = await response.json().catch(() => ({}));
      if (!response.ok) {
        setLoadError(json.error ?? "Could not load the guestbook.");
        return;
      }
      setLoadError("");
      setEntries(json.entries as Entry[]);
    } catch {
      setLoadError("Could not reach the server. Please try again.");
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    loadCurrentUser().then((value) => {
      if (!cancelled) setUser(value);
    });
    load();
    return () => {
      cancelled = true;
    };
  }, [load]);

  async function handlePost(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = text.trim();
    if (!message) {
      setStatus({ ok: false, text: "Write a message first." });
      return;
    }
    setBusy(true);
    setStatus(null);
    try {
      const response = await fetch("/api/guestbook", {
        method: "POST",
        headers: JSON_HEADERS,
        body: JSON.stringify({ message }),
      });
      const json = await response.json().catch(() => ({}));
      if (response.status === 401) {
        window.location.assign("/login");
        return;
      }
      if (!response.ok) {
        setStatus({ ok: false, text: json.error ?? "Something went wrong." });
      } else {
        setText("");
        setStatus({ ok: true, text: "Thanks! Your message is now in the guestbook." });
        await load();
      }
    } catch {
      setStatus({ ok: false, text: "Could not reach the server. Please try again." });
    }
    setBusy(false);
  }

  async function handleSaveEdit(id: string) {
    const message = editText.trim();
    if (!message) {
      setStatus({ ok: false, text: "A message cannot be empty." });
      return;
    }
    setBusy(true);
    setStatus(null);
    try {
      const response = await fetch("/api/guestbook/" + id, {
        method: "PATCH",
        headers: JSON_HEADERS,
        body: JSON.stringify({ message }),
      });
      const json = await response.json().catch(() => ({}));
      if (!response.ok) {
        setStatus({ ok: false, text: json.error ?? "Could not save your changes." });
      } else {
        setEditingId(null);
        await load();
      }
    } catch {
      setStatus({ ok: false, text: "Could not reach the server. Please try again." });
    }
    setBusy(false);
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this message?")) return;
    setBusy(true);
    setStatus(null);
    try {
      const response = await fetch("/api/guestbook/" + id, {
        method: "DELETE",
        headers: JSON_HEADERS,
      });
      if (!response.ok) {
        setStatus({ ok: false, text: "Could not delete the message." });
      } else {
        await load();
      }
    } catch {
      setStatus({ ok: false, text: "Could not reach the server. Please try again." });
    }
    setBusy(false);
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      {user === null && (
        <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm sm:p-8">
          <h2 className="font-heading text-lg font-bold text-text">Leave a message</h2>
          <p className="mt-2 text-sm text-text-muted">
            Log in with Google to sign the guestbook. Anyone can read it.
          </p>
          <Link
            href="/login"
            className="mt-4 inline-block rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark"
          >
            Log in
          </Link>
        </div>
      )}

      {user && (
        <form
          onSubmit={handlePost}
          noValidate
          className="rounded-3xl border border-border bg-surface p-6 shadow-sm sm:p-8"
        >
          <label htmlFor={uid + "-message"} className="mb-1.5 block text-sm font-medium text-text">
            Your message
          </label>
          <textarea
            id={uid + "-message"}
            rows={4}
            maxLength={MAX_LENGTH}
            value={text}
            onChange={(event) => setText(event.target.value)}
            className={fieldClass}
          />
          <p className="mt-1.5 text-xs text-text-muted">
            {text.length}/{MAX_LENGTH} characters. Your first name is shown next to it.
          </p>
          <button
            type="submit"
            disabled={busy}
            className="mt-4 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark disabled:opacity-60"
          >
            {busy ? "Saving..." : "Post message"}
          </button>
        </form>
      )}

      {status && (
        <p
          role={status.ok ? "status" : "alert"}
          className={`mt-5 rounded-xl px-4 py-3 text-sm font-medium ${
            status.ok ? "bg-primary/10 text-primary-dark" : "bg-red-700/10 text-red-700"
          }`}
        >
          {status.text}
        </p>
      )}

      <div className="mt-10">
        {loadError && (
          <p role="alert" className="rounded-xl bg-red-700/10 px-4 py-3 text-sm font-medium text-red-700">
            {loadError}
          </p>
        )}
        {!loadError && entries === null && (
          <p className="text-sm text-text-muted">Loading messages...</p>
        )}
        {entries !== null && entries.length === 0 && (
          <p className="text-sm text-text-muted">
            No messages yet. Be the first to sign the guestbook.
          </p>
        )}
        {entries !== null && entries.length > 0 && (
          <ul className="flex flex-col gap-4">
            {entries.map((entry) => (
              <li
                key={entry.id}
                className="rounded-2xl border border-border bg-surface p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-sm font-semibold text-text">{entry.author}</p>
                  <p className="text-xs text-text-muted">
                    {formatDate(entry.created_at)}
                    {entry.edited ? " (edited)" : ""}
                  </p>
                </div>

                {editingId === entry.id ? (
                  <div className="mt-3">
                    <label htmlFor={uid + "-edit-" + entry.id} className="sr-only">
                      Edit your message
                    </label>
                    <textarea
                      id={uid + "-edit-" + entry.id}
                      rows={3}
                      maxLength={MAX_LENGTH}
                      value={editText}
                      onChange={(event) => setEditText(event.target.value)}
                      className={fieldClass}
                    />
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => handleSaveEdit(entry.id)}
                        className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
                      >
                        Save changes
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => setEditingId(null)}
                        className={smallButton}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-relaxed text-text">
                    {entry.message}
                  </p>
                )}

                {editingId !== entry.id && (entry.mine || entry.canDelete) && (
                  <div className="mt-4 flex gap-2">
                    {entry.mine && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => {
                          setEditingId(entry.id);
                          setEditText(entry.message);
                        }}
                        className={smallButton}
                      >
                        Edit
                      </button>
                    )}
                    {entry.canDelete && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => handleDelete(entry.id)}
                        className="rounded-full border border-red-700 px-4 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-700/10 disabled:opacity-60"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
