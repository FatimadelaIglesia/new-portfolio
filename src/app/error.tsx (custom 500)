"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      id="main-content"
      className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-6 py-20 text-center sm:px-8"
    >
      <p className="font-heading text-6xl font-bold text-primary-dark sm:text-7xl">500</p>
      <h1 className="mt-4 font-heading text-3xl font-bold text-text sm:text-4xl">
        Something went wrong
      </h1>
      <p className="mt-3 max-w-md text-sm text-text-muted">
        An unexpected error stopped this page from loading. You can try again or
        go back to the home page.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-full border border-primary px-6 py-2.5 text-sm font-semibold text-primary-dark hover:bg-primary/10"
        >
          Go to the home page
        </Link>
      </div>
    </main>
  );
}
