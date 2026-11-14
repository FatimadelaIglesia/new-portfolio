"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { loadCurrentUser } from "@/lib/currentUser";
import type { PublicUser } from "@/lib/currentUser";

type Props = {
  variant: "desktop" | "mobile";
  onNavigate?: () => void;
};

function displayName(user: PublicUser) {
  return user.first_name.trim() || user.email;
}

export default function AccountMenu({ variant, onNavigate }: Props) {
  const [user, setUser] = useState<PublicUser | null | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    loadCurrentUser().then((value) => {
      if (!cancelled) setUser(value);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (variant !== "desktop") return;
    function handlePointerDown(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [variant]);

  async function handleLogout() {
    await fetch("/api/admin/session", {
      method: "DELETE",
      headers: { "x-admin-request": "1" },
    }).catch(() => undefined);
    window.location.assign("/");
  }

  // Still finding out who is signed in
  if (user === undefined) {
    return variant === "desktop" ? <div className="h-10 w-20" aria-hidden="true" /> : null;
  }

  const itemClass =
    "block w-full rounded-md px-3 py-2.5 text-left text-base font-medium text-text transition-colors hover:bg-primary/10";

  if (variant === "mobile") {
    if (user === null) {
      return (
        <li>
          <Link href="/login" onClick={onNavigate} className={itemClass}>
            Log in
            <span className="block text-xs font-normal text-text-muted">
              Sign in with Google
            </span>
          </Link>
        </li>
      );
    }
    return (
      <>
        <li>
          <p className="px-3 pt-2 text-xs text-text-muted">
            Signed in as {displayName(user)}
          </p>
        </li>
        <li>
          <Link href="/settings" onClick={onNavigate} className={itemClass}>
            Settings
          </Link>
        </li>
        {user.isAdmin && (
          <li>
            <Link href="/admin" onClick={onNavigate} className={itemClass}>
              Admin
            </Link>
          </li>
        )}
        <li>
          <button type="button" onClick={handleLogout} className={itemClass}>
            Log out
          </button>
        </li>
      </>
    );
  }

  if (user === null) {
    return (
      <Link
        href="/login"
        className="rounded-full border border-primary px-5 py-2.5 text-sm font-semibold text-primary-dark transition-colors hover:bg-primary/10"
      >
        Log in
      </Link>
    );
  }

  const initial = displayName(user).charAt(0).toUpperCase();

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        aria-expanded={open}
        aria-controls="account-menu"
        className="inline-flex items-center gap-2 rounded-full border border-primary px-3 py-1.5 text-sm font-semibold text-primary-dark hover:bg-primary/10"
      >
        <span
          aria-hidden="true"
          className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white"
        >
          {initial}
        </span>
        <span className="max-w-28 truncate">{displayName(user)}</span>
      </button>
      {open && (
        <ul
          id="account-menu"
          className="absolute right-0 mt-3 w-56 rounded-2xl border border-border bg-surface p-2 shadow-lg"
        >
          <li>
            <p className="truncate px-3 pt-1 pb-2 text-xs text-text-muted">{user.email}</p>
          </li>
          <li>
            <Link href="/settings" onClick={() => setOpen(false)} className={itemClass}>
              Settings
            </Link>
          </li>
          {user.isAdmin && (
            <li>
              <Link href="/admin" onClick={() => setOpen(false)} className={itemClass}>
                Admin
              </Link>
            </li>
          )}
          <li>
            <button type="button" onClick={handleLogout} className={itemClass}>
              Log out
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
