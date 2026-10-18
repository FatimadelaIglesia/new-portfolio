import type { Metadata } from "next";
import { cookies } from "next/headers";
import AdminLogin from "@/components/AdminLogin";
import AdminDashboard from "@/components/AdminDashboard";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/admin";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const signedIn = verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);

  return (
    <main id="main-content" className="mx-auto w-full max-w-6xl flex-1 px-6 py-10 sm:px-8">
      {signedIn ? <AdminDashboard /> : <AdminLogin />}
    </main>
  );
}
