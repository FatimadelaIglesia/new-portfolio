"use client";

import { useId, useState } from "react";
import { STATUSES, parseMessageInput } from "@/lib/messages";
import type { Message, MessageInput, Status } from "@/lib/messages";

type Props = {
  heading: string;
  initial?: Message;
  onSave: (data: MessageInput) => Promise<string | null>;
  onCancel: () => void;
};

const fieldClass =
  "w-full rounded-lg border border-input-border bg-background px-4 py-2.5 text-sm text-text placeholder:text-text-muted focus:border-primary";
const labelClass = "mb-1.5 block text-sm font-medium text-text";

export default function MessageForm({ heading, initial, onSave, onCancel }: Props) {
  const uid = useId();
  const [name, setName] = useState(initial?.name ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [message, setMessage] = useState(initial?.message ?? "");
  const [status, setStatus] = useState<Status>(initial?.status ?? "new");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const { data, error: problem } = parseMessageInput(
      { name, email, message, status, notes },
      false
    );
    if (problem || !data) {
      setError(problem ?? "Please check the fields.");
      return;
    }
    setBusy(true);
    setError("");
    const failure = await onSave(data as MessageInput);
    if (failure) {
      setError(failure);
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-primary/40 bg-surface p-6 shadow-sm"
    >
      <h2 className="font-heading text-xl font-bold text-text">{heading}</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${uid}-name`} className={labelClass}>Name</label>
          <input id={`${uid}-name`} type="text" maxLength={100} value={name}
            onChange={(event) => setName(event.target.value)} className={fieldClass} />
        </div>
        <div>
          <label htmlFor={`${uid}-email`} className={labelClass}>Email</label>
          <input id={`${uid}-email`} type="email" maxLength={254} value={email}
            onChange={(event) => setEmail(event.target.value)} className={fieldClass} />
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor={`${uid}-message`} className={labelClass}>Message</label>
        <textarea id={`${uid}-message`} rows={4} maxLength={5000} value={message}
          onChange={(event) => setMessage(event.target.value)} className={fieldClass} />
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor={`${uid}-status`} className={labelClass}>Status</label>
          <select id={`${uid}-status`} value={status}
            onChange={(event) => setStatus(event.target.value as Status)} className={fieldClass}>
            {STATUSES.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={`${uid}-notes`} className={labelClass}>Private notes</label>
          <textarea id={`${uid}-notes`} rows={2} maxLength={2000} value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Only you can see these" className={fieldClass} />
        </div>
      </div>
      {error && (
        <p role="alert" className="mt-4 text-sm font-medium text-red-700">{error}</p>
      )}
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="submit" disabled={busy}
          className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark disabled:opacity-60">
          {busy ? "Saving..." : "Save"}
        </button>
        <button type="button" onClick={onCancel} disabled={busy}
          className="rounded-full border border-primary px-6 py-2.5 text-sm font-semibold text-primary-dark hover:bg-primary/10 disabled:opacity-60">
          Cancel
        </button>
      </div>
    </form>
  );
}
