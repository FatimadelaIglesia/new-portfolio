import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { personalInfo } from "@/lib/data";
import { DownloadIcon, GitHubIcon, MailIcon, PhoneIcon, PinIcon } from "@/components/icons";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-6 pt-6 sm:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-text-muted transition-colors hover:text-primary"
          >
            ← Back to home
          </Link>
        </div>

        <section className="relative overflow-hidden px-6 pt-10 pb-16 sm:px-8 sm:pt-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl sm:h-96 sm:w-96"
          />
          <div className="relative mx-auto flex max-w-6xl flex-col-reverse items-center gap-12 md:flex-row md:justify-between">
            <div className="max-w-xl text-center md:text-left">
              <span className="text-sm font-semibold uppercase tracking-wider text-accent">
                Contact
              </span>
              <h1 className="mt-2 font-heading text-4xl font-bold tracking-tight text-text sm:text-5xl">
                Say hello
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-text-muted">
                I am currently looking for my first junior front-end role,
                ideally somewhere remote-friendly, where I can keep learning
                while contributing to real projects. If that sounds like a
                good fit on your end, I would love to hear from you.
              </p>
            </div>
            <div className="relative shrink-0 overflow-hidden rounded-2xl border-2 border-primary/20 shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1763568258314-24ef37bb52e2?fm=jpg&q=80&w=480&h=360&auto=format&fit=crop"
                alt="Laptop screen displaying code with a small plush toy beside it"
                width={480}
                height={360}
                priority
                className="object-cover"
              />
            </div>
          </div>
        </section>

        <section className="bg-surface px-6 py-20 sm:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="grid gap-4 sm:grid-cols-3">
              <a href={`mailto:${personalInfo.email}`} className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-background p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-md">
                <MailIcon className="size-6 text-primary" />
                <span className="text-sm font-semibold text-text">Email</span>
                <span className="text-sm text-text-muted">{personalInfo.email}</span>
              </a>
              <a href={`tel:${personalInfo.phone.replace(/\s/g, "")}`} className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-background p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-md">
                <PhoneIcon className="size-6 text-primary" />
                <span className="text-sm font-semibold text-text">Phone</span>
                <span className="text-sm text-text-muted">{personalInfo.phone}</span>
              </a>
              <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-background p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-md">
                <GitHubIcon className="size-6 text-primary" />
                <span className="text-sm font-semibold text-text">GitHub</span>
                <span className="text-sm text-text-muted">@{personalInfo.github.split("/").pop()}</span>
              </a>
            </div>
            <p className="mt-8 inline-flex items-center justify-center gap-1.5 text-sm text-text-muted">
              <PinIcon className="size-4 text-accent" />
              {personalInfo.location}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href={`mailto:${personalInfo.email}`} className="inline-block rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark hover:shadow-md">
                Say Hello
              </a>
              <a href={personalInfo.resumeUrl} download className="inline-flex items-center gap-2 rounded-full border border-primary px-8 py-3.5 text-sm font-semibold text-primary-dark transition-colors hover:bg-primary/10">
                <DownloadIcon className="size-4" />
                Download Resume
              </a>
            </div>
          </div>
        </section>

        <section className="px-6 py-20 sm:px-8">
          <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-surface p-8 shadow-sm">
            <h2 className="font-heading text-2xl font-bold text-text">
              Send a message
            </h2>
            <p className="mt-2 text-sm text-text-muted">
              This form is not connected to anything yet, so for now the
              fastest way to reach me is by email or GitHub above.
            </p>
            <form className="mt-6 flex flex-col gap-4">
              <input
                type="text"
                placeholder="Your name"
                disabled
                className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-text placeholder:text-text-muted"
              />
              <input
                type="email"
                placeholder="Your email"
                disabled
                className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-text placeholder:text-text-muted"
              />
              <textarea
                placeholder="Your message"
                rows={4}
                disabled
                className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-text placeholder:text-text-muted"
              />
              <button
                type="button"
                disabled
                className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white opacity-60"
              >
                Send (not yet connected)
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
