import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GuestbookClient from "@/components/GuestbookClient";

export const metadata: Metadata = {
  title: "Guestbook",
  description: "Leave a message for Fatima. Log in with Google to post.",
};

export default function GuestbookPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12 sm:px-8">
        <h1 className="font-heading text-3xl font-bold text-text sm:text-4xl">Guestbook</h1>
        <p className="mt-2 mb-8 max-w-2xl text-sm text-text-muted">
          Say hello or leave feedback. Anyone can read the messages. You need to log
          in with Google to post, and you can edit or delete your own messages at any time.
        </p>
        <GuestbookClient />
      </main>
      <Footer />
    </>
  );
}
