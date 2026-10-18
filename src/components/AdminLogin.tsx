"use client";

import { useState } from "react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!password) {
      setError("Please enter the password.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (response.ok) {
        window.location.reload();
        return;
      }
      setError(
        response.status === 500
          ? "Admin is not set up yet. Check the Netlify settings."
          : "Wrong password."
      );
    } catch {
      setError("Could not reach the server. Please try again.");
    }
    setBusy(false);
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl border border-border bg-surface p-8 shadow-sm">
      <h1 className="font-heading text-3xl font-bold text-text">Admin sign in</h1>
      <p className="mt-2 text-sm text-text-muted">
        This area is only for the site owner.
      </p>
      <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-4">
        <div>
          <label htmlFor="admin-password" className="mb-1.5 block text-sm font-medium text-text">
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "admin-password-error" : undefined}
            className="w-full rounded-lg border border-input-border bg-background px-4 py-2.5 text-sm text-text focus:border-primary"
          />
        </div>
        {error && (
          <p id="admin-password-error" role="alert" className="text-sm font-medium text-red-700">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={busy}
          className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark hover:shadow-md disabled:opacity-60"
        >
          {busy ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
