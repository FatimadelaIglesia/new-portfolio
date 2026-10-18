"use client";

import { useEffect, useMemo, useState } from "react";
import MessageForm from "./MessageForm";
import { STATUSES } from "@/lib/messages";
import type { Message, MessageInput, Status } from "@/lib/messages";

const badgeClass: Record<Status, string> = {
  new: "bg-primary/15 text-primary-dark",
  read: "bg-text-muted/15 text-text-muted",
  replied: "bg-accent/15 text-accent",
  archived: "bg-border text-text-muted",
};

async function api(
  url: string,
  options: { method?: string; body?: unknown } = {}
) {
  const response = await fetch(url, {
    method: options.method ?? "GET",
    headers: { "Content-Type": "application/json", "x-admin-request": "1" },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });
  if (response.status === 401) {
    window.location.reload();
    throw new Error("You were signed out.");
  }
  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(json.error ?? "Something went wrong.");
  }
  return json;
}

export default function AdminDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null);
  const [filter, setFilter] = useState<"all" | Status>("all");
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api("/api/admin/messages")
      .then((json) => {
        if (!cancelled) setMessages(json.messages);
      })
      .catch((error: Error) => {
        if (!cancelled) setNotice({ ok: false, text: error.message });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return messages.filter((item) => {
      if (filter !== "all" && item.status !== filter) return false;
      if (!needle) return true;
      return [item.name, item.email, item.message, item.notes ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [messages, filter, query]);

  const newCount = messages.filter((item) => item.status === "new").length;

  async function handleCreate(data: MessageInput) {
    try {
      const json = await api("/api/admin/messages", { method: "POST", body: data });
      setMessages((current) => [json.message, ...current]);
      setCreating(false);
      setNotice({ ok: true, text: "Message added." });
      return null;
    } catch (error) {
      return (error as Error).message;
    }
  }

  async function handleUpdate(id: string, data: Partial<MessageInput>) {
    setBusyId(id);
    try {
      const json = await api(`/api/admin/messages/${id}`, { method: "PATCH", body: data });
      setMessages((current) => current.map((item) => (item.id === id ? json.message : item)));
      setEditingId(null);
      setNotice({ ok: true, text: "Changes saved." });
      return null;
    } catch (error) {
      return (error as Error).message;
    } finally {
      setBusyId(null);
    }
  }

  async function handleStatusChange(id: string, status: Status) {
    const failure = await handleUpdate(id, { status });
    if (failure) setNotice({ ok: false, text: failure });
  }

  async function handleDelete(item: Message) {
    if (!window.confirm(`Delete the message from ${item.name}? This cannot be undone.`)) {
      return;
    }
    setBusyId(item.id);
    try {
      await api(`/api/admin/messages/${item.id}`, { method: "DELETE" });
      setMessages((current) => current.filter((entry) => entry.id !== item.id));
      setNotice({ ok: true, text: "Message deleted." });
    } catch (error) {
      setNotice({ ok: false, text: (error as Error).message });
    } finally {
      setBusyId(null);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    window.location.reload();
  }
    return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-text">Messages</h1>
          <p className="mt-1 text-sm text-text-muted">
            {messages.length} in total, {newCount} new
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button"
            onClick={() => { setCreating(true); setEditingId(null); }}
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark">
            New message
          </button>
          <button type="button" onClick={handleLogout}
            className="rounded-full border border-primary px-5 py-2.5 text-sm font-semibold text-primary-dark hover:bg-primary/10">
            Log out
          </button>
        </div>
      </div>

      {notice && (
        <p role={notice.ok ? "status" : "alert"}
          className={`mt-4 rounded-xl px-4 py-3 text-sm font-medium ${
            notice.ok ? "bg-primary/10 text-primary-dark" : "bg-red-700/10 text-red-700"
          }`}>
          {notice.text}
        </p>
      )}

      {creating && (
        <div className="mt-6">
          <MessageForm heading="Add a message" onSave={handleCreate} onCancel={() => setCreating(false)} />
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-4">
        <div className="min-w-52 flex-1">
          <label htmlFor="admin-search" className="mb-1.5 block text-sm font-medium text-text">Search</label>
          <input id="admin-search" type="search" value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Name, email, message or notes"
            className="w-full rounded-lg border border-input-border bg-background px-4 py-2.5 text-sm text-text placeholder:text-text-muted focus:border-primary" />
        </div>
        <div>
          <label htmlFor="admin-filter" className="mb-1.5 block text-sm font-medium text-text">Status</label>
          <select id="admin-filter" value={filter}
            onChange={(event) => setFilter(event.target.value as "all" | Status)}
            className="rounded-lg border border-input-border bg-background px-4 py-2.5 text-sm text-text focus:border-primary">
            <option value="all">All</option>
            {STATUSES.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      <ul className="mt-6 flex flex-col gap-4">
        {loading && <li className="text-sm text-text-muted">Loading messages...</li>}
        {!loading && visible.length === 0 && (
          <li className="text-sm text-text-muted">
            {messages.length === 0 ? "No messages yet." : "No messages match your filters."}
          </li>
        )}
        {visible.map((item) =>
          editingId === item.id ? (
            <li key={item.id}>
              <MessageForm heading="Edit message" initial={item}
                onSave={(data) => handleUpdate(item.id, data)}
                onCancel={() => setEditingId(null)} />
            </li>
          ) : (
            <li key={item.id} className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-heading text-lg font-bold text-text">{item.name}</h2>
                  <a href={`mailto:${item.email}`}
                    className="text-sm font-medium text-primary underline-offset-2 hover:underline">
                    {item.email}
                  </a>
                </div>
                <div className="text-right">
                  <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${badgeClass[item.status]}`}>
                    {item.status}
                  </span>
                  <p className="mt-1 text-xs text-text-muted">
                    {new Date(item.created_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
                  </p>
                </div>
              </div>
              <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-relaxed text-text">{item.message}</p>
              {item.notes && (
                <p className="mt-3 whitespace-pre-wrap break-words rounded-lg bg-background px-3 py-2 text-sm text-text-muted">
                  <span className="font-semibold">Notes: </span>{item.notes}
                </p>
              )}
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <label htmlFor={`status-${item.id}`} className="sr-only">Status for {item.name}</label>
                <select id={`status-${item.id}`} value={item.status} disabled={busyId === item.id}
                  onChange={(event) => handleStatusChange(item.id, event.target.value as Status)}
                  className="rounded-lg border border-input-border bg-background px-3 py-2 text-sm text-text focus:border-primary">
                  {STATUSES.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <button type="button" disabled={busyId === item.id}
                  onClick={() => { setEditingId(item.id); setCreating(false); }}
                  className="rounded-full border border-primary px-5 py-2 text-sm font-semibold text-primary-dark hover:bg-primary/10 disabled:opacity-60">
                  Edit<span className="sr-only"> message from {item.name}</span>
                </button>
                <button type="button" disabled={busyId === item.id} onClick={() => handleDelete(item)}
                  className="rounded-full border border-red-700 px-5 py-2 text-sm font-semibold text-red-700 hover:bg-red-700/10 disabled:opacity-60">
                  Delete<span className="sr-only"> message from {item.name}</span>
                </button>
              </div>
            </li>
          )
        )}
      </ul>
    </div>
  );
}
