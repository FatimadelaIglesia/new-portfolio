import { personalInfo } from "@/lib/data";
import { DownloadIcon, GitHubIcon, MailIcon, PhoneIcon, PinIcon } from "./icons";

export default function Contact() {
  return (
    <section id="contact" className="bg-surface px-6 py-20 sm:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <span className="text-sm font-semibold uppercase tracking-wider text-accent">
          Contact
        </span>
        <h2 className="mt-2 font-heading text-3xl font-bold text-text sm:text-4xl">
          Let&apos;s work together
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-text-muted">
          I&apos;m currently open to junior front-end opportunities and
          remote-friendly roles. Feel free to reach out — I&apos;d love to
          hear from you.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <a
            href={`mailto:${personalInfo.email}`}
            className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-background p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
          >
            <MailIcon className="size-6 text-primary" />
            <span className="text-sm font-semibold text-text">Email</span>
            <span className="text-sm text-text-muted">{personalInfo.email}</span>
          </a>

          <a
            href={`tel:${personalInfo.phone.replace(/\s/g, "")}`}
            className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-background p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
          >
            <PhoneIcon className="size-6 text-primary" />
            <span className="text-sm font-semibold text-text">Phone</span>
            <span className="text-sm text-text-muted">{personalInfo.phone}</span>
          </a>

          <a
            href={personalInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-background p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
          >
            <GitHubIcon className="size-6 text-primary" />
            <span className="text-sm font-semibold text-text">GitHub</span>
            <span className="text-sm text-text-muted">
              @{personalInfo.github.split("/").pop()}
            </span>
          </a>
        </div>

        <p className="mt-8 inline-flex items-center justify-center gap-1.5 text-sm text-text-muted">
          <PinIcon className="size-4 text-accent" />
          {personalInfo.location}
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={`mailto:${personalInfo.email}`}
            className="inline-block rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark hover:shadow-md"
          >
            Say Hello
          </a>
          <a
            href={personalInfo.resumeUrl}
            download
            className="inline-flex items-center gap-2 rounded-full border border-primary px-8 py-3.5 text-sm font-semibold text-primary-dark transition-colors hover:bg-primary/10"
          >
            <DownloadIcon className="size-4" />
            Download Resume
          </a>
        </div>
      </div>
    </section>
  );
}
