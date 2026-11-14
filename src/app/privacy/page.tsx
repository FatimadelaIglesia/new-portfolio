import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How this portfolio handles your data.",
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12 sm:px-8">
        <h1 className="font-heading text-3xl font-bold text-text sm:text-4xl">Privacy</h1>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-text">
          <p>
            This is a personal portfolio. You can browse it without an account.
            If you log in with Google, the site stores your name and email address
            so you can manage them in Settings and sign the Guestbook.
          </p>
          <p>
            Your Google password is never shared with this site. Your details are
            used only to run your account and are never sold or shared.
          </p>
          <p>
            Messages you post in the Guestbook are public and show your first name.
            You can edit or delete them at any time, and you can delete your account
            from Settings, which removes your name and email.
          </p>
          <p>
            If you send a message through the contact form, it is stored so I can
            reply to you.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
