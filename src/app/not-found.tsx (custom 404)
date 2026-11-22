import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-6 py-20 text-center sm:px-8">
        <p className="font-heading text-6xl font-bold text-primary-dark sm:text-7xl">404</p>
        <h1 className="mt-4 font-heading text-3xl font-bold text-text sm:text-4xl">
          This page does not exist
        </h1>
        <p className="mt-3 max-w-md text-sm text-text-muted">
          The link may be broken or the page may have moved. Try one of these instead.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark"
          >
            Go to the home page
          </Link>
          <Link
            href="/projects"
            className="rounded-full border border-primary px-6 py-2.5 text-sm font-semibold text-primary-dark hover:bg-primary/10"
          >
            See my projects
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
