"use client";

import { useId, useState } from "react";
import { parseProfileInput } from "@/lib/profile";
import { resetCurrentUser } from "@/lib/currentUser";
import type { PublicUser } from "@/lib/currentUser";

const fieldClass =
  "w-full rounded-lg border border-input-border bg-background px-4 py-2.5 text-sm text-text placeholder:text-text-muted focus:border-primary";
const labelClass = "mb-1.5 block text-sm font-medium text-text";

export default function SettingsForm({ user }: { user: PublicUser }) {
  const uid = useId();
  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName, setLastName] = useState(user.last_name);
  const [email, setEmail] = useState(user.email);
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = parseProfileInput({
      first_name: firstName,
      last_name: lastName,
      email,
    });
    if (!parsed.ok) {
      setStatus({ ok: false, text: parsed.error });
      return;
    }
    const data = parsed.data;
    setBusy(true);
    setStatus(null);
    try {
      const response = await fetch("/api/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-request": "1" },
        body: JSON.stringify(data),
      });
      const json = await response.json().catch(() => ({}));
      if (response.status === 401) {
        window.location.assign("/login");
        return;
      }
      if (!response.ok) {
        setStatus({ ok: false, text: json.error ?? "Something went wrong." });
      } else {
        resetCurrentUser();
        setFirstName(firstName.trim());
        setLastName(lastName.trim());
        setEmail(email.trim());
        setStatus({ ok: true, text: "Your settings have been saved." });
      }
    } catch {
      setStatus({ ok: false, text: "Could not reach the server. Please try again." });
    }
    setBusy(false);
  }

  async function handleLogout() {
    await fetch("/api/admin/session", {
      method: "DELETE",
      headers: { "x-admin-request": "1" },
    }).catch(() => undefined);
    window.location.assign("/");
  }

  async function handleDelete() {
    if (
      !window.confirm(
        "Delete your account? Your name, email and settings will be removed for good."
      )
    ) {
      return;
    }
    setBusy(true);
    try {
      const response = await fetch("/api/me", {
        method: "DELETE",
        headers: { "x-admin-request": "1" },
      });
      if (response.ok) {
        window.location.assign("/");
        return;
      }
      setStatus({ ok: false, text: "Could not delete your account. Please try again." });
    } catch {
      setStatus({ ok: false, text: "Could not reach the server. Please try again." });
    }
    setBusy(false);
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      <h1 className="font-heading text-3xl font-bold text-text sm:text-4xl">Your settings</h1>
      <p className="mt-2 text-sm text-text-muted">
        Signed in with Google as {user.google_email ?? user.email}.
        {user.isAdmin && (
          <span className="ml-2 inline-block rounded-full bg-primary/15 px-3 py-0.5 text-xs font-semibold text-primary-dark">
            Admin
          </span>
        )}
      </p>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-8 rounded-3xl border border-border bg-surface p-6 shadow-sm sm:p-8"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`${uid}-first`} className={labelClass}>First name</label>
            <input id={`${uid}-first`} type="text" autoComplete="given-name" maxLength={100}
              value={firstName} onChange={(event) => setFirstName(event.target.value)}
              className={fieldClass} />
          </div>
          <div>
            <label htmlFor={`${uid}-last`} className={labelClass}>Last name</label>
            <input id={`${uid}-last`} type="text" autoComplete="family-name" maxLength={100}
              value={lastName} onChange={(event) => setLastName(event.target.value)}
              className={fieldClass} />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor={`${uid}-email`} className={labelClass}>Email address</label>
          <input id={`${uid}-email`} type="email" autoComplete="email" maxLength={254}
            value={email} onChange={(event) => setEmail(event.target.value)}
            className={fieldClass} />
          <p className="mt-1.5 text-xs text-text-muted">
            This is the address we use to contact you. It does not change how you log in.
          </p>
        </div>

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

        <div className="mt-6 flex flex-wrap gap-3">
          <button type="submit" disabled={busy}
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark disabled:opacity-60">
            {busy ? "Saving..." : "Save changes"}
          </button>
          <button type="button" onClick={handleLogout} disabled={busy}
            className="rounded-full border border-primary px-6 py-2.5 text-sm font-semibold text-primary-dark hover:bg-primary/10 disabled:opacity-60">
            Log out
          </button>
        </div>
      </form>

      <div className="mt-8 rounded-3xl border border-border p-6 sm:p-8">
        <h2 className="font-heading text-lg font-bold text-text">Delete my account</h2>
        <p className="mt-2 text-sm text-text-muted">
          This removes your name, email and settings from this site. You can log in
          with Google again at any time to start fresh.
        </p>
        <button type="button" onClick={handleDelete} disabled={busy}
          className="mt-4 rounded-full border border-red-700 px-6 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-700/10 disabled:opacity-60">
          Delete my account
        </button>
      </div>
    </div>
  );
}
