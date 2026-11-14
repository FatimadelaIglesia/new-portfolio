import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SESSION_COOKIE, getUserFromToken } from "@/lib/admin";
import { isGoogleConfigured } from "@/lib/google";

export const metadata: Metadata = {
  title: "Log in",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const errorText: Record<string, string> = {
  config: "Google sign-in is not set up yet.",
  denied: "Google sign-in was cancelled.",
  state: "The sign-in was interrupted or took too long. Please try again.",
  google: "Google sign-in failed. Please try again.",
  unverified: "Your Google email address is not verified, so it cannot be used to log in.",
  database: "We could not save your profile. Please try again in a minute.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string | string[] }>;
}) {
  const params = await searchParams;
  const code = typeof params.error === "string" ? params.error : undefined;
  const cookieStore = await cookies();
  const user = await getUserFromToken(cookieStore.get(SESSION_COOKIE)?.value ?? "");
  if (user) {
    redirect(user.isAdmin ? "/admin" : "/settings");
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12 sm:px-8">
        <div className="mx-auto w-full max-w-md rounded-3xl border border-border bg-surface p-8 shadow-sm">
          <h1 className="font-heading text-3xl font-bold text-text">Log in</h1>
          <p className="mt-2 text-sm text-text-muted">
            Use your Google account. There is no password to remember.
          </p>

          {code && (
            <p role="alert" className="mt-4 rounded-xl bg-red-700/10 px-4 py-3 text-sm font-medium text-red-700">
              {errorText[code] ?? "Sign-in failed."}
            </p>
          )}

          {isGoogleConfigured() ? (
            <a
              href="/api/admin/google"
              className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-full border border-input-border bg-white px-6 py-3 text-sm font-semibold text-neutral-900 shadow-sm hover:shadow-md"
            >
              <svg viewBox="0 0 48 48" aria-hidden="true" className="size-5">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              Continue with Google
            </a>
          ) : (
            <p className="mt-6 text-sm text-text-muted">
              Logging in is not available yet.
            </p>
          )}

          <p className="mt-5 text-xs leading-relaxed text-text-muted">
            When you log in, this site stores your name and email address so you
            can manage them in Settings. You can delete your account there at any time.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
