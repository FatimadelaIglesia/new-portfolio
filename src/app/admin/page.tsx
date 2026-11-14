import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdminDashboard from "@/components/AdminDashboard";
import { SESSION_COOKIE, getUserFromToken } from "@/lib/admin";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const user = await getUserFromToken(cookieStore.get(SESSION_COOKIE)?.value ?? "");
  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10 sm:px-8">
        {user.isAdmin ? (
          <AdminDashboard />
        ) : (
          <div className="mx-auto w-full max-w-md rounded-3xl border border-border bg-surface p-8 text-center shadow-sm">
            <h1 className="font-heading text-3xl font-bold text-text">No access</h1>
            <p className="mt-3 text-sm text-text-muted">
              This area is only for the site owner. You can still change your own
              details in Settings.
            </p>
            <Link
              href="/settings"
              className="mt-6 inline-block rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark"
            >
              Go to Settings
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
