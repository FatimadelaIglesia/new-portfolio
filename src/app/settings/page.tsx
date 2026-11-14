import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SettingsForm from "@/components/SettingsForm";
import { SESSION_COOKIE, getUserFromToken } from "@/lib/admin";

export const metadata: Metadata = {
  title: "Settings",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const user = await getUserFromToken(cookieStore.get(SESSION_COOKIE)?.value ?? "");
  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12 sm:px-8">
        <SettingsForm
          user={{
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            google_email: user.google_email ?? "",
            isAdmin: user.isAdmin,
          }}
        />
      </main>
      <Footer />
    </>
  );
}
