import Link from "next/link";
import NewsletterForm from "./NewsletterForm";
import { personalInfo } from "@/lib/data";
import {
  DownloadIcon,
  GitHubIcon,
  LeafIcon,
  MailIcon,
  PinIcon,
} from "./icons";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Skills", href: "/skills" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
  { label: "Newsletter", href: "#newsletter" },
];

export default function Footer() {
  return (
    <>
    <NewsletterForm />
    <footer className="border-t border-border/70 bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12 sm:px-8 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs">
          <Link
            href="/"
            className="flex items-center gap-2 font-heading text-lg font-semibold text-primary-dark transition-colors hover:text-primary"
          >
            <LeafIcon className="size-6 text-primary" />
            Fatima de la Iglesia
          </Link>
          <p className="mt-3 text-sm leading-relaxed text-text-muted">
            Junior Web Developer crafting clean, accessible, and user-friendly
            digital experiences.
          </p>
          <p className="mt-4 inline-flex items-center gap-1.5 text-sm text-text-muted">
            <PinIcon className="size-4 text-accent" />
            {personalInfo.location}
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-col gap-2">
          <span className="font-heading text-sm font-semibold uppercase tracking-wider text-primary-dark">
            Navigate
          </span>
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-text-muted transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-2">
          <span className="font-heading text-sm font-semibold uppercase tracking-wider text-primary-dark">
            Connect
          </span>
          <a
            href={`mailto:${personalInfo.email}`}
            className="inline-flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-primary"
          >
            <MailIcon className="size-4 text-primary" />
            {personalInfo.email}
          </a>
          <a
            href={personalInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-primary"
          >
            <GitHubIcon className="size-4 text-primary" />
            GitHub
          </a>
          <a
            href={personalInfo.resumeUrl}
            download
            className="inline-flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-primary"
          >
            <DownloadIcon className="size-4 text-primary" />
            Download resume
          </a>
          <Link
            href="/contact"
            className="mt-3 inline-block w-fit rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark hover:shadow-md"
          >
            Say Hello
          </Link>
        </div>
      </div>

      <div className="border-t border-border/70 px-6 py-5 text-xs text-text-muted sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {personalInfo.name}. All rights
            reserved.
          </p>
          <a
            href="#top"
            className="font-medium transition-colors hover:text-primary"
          >
            Back to top
          </a>
        </div>
      </div>
    </footer>
    </>
  );
}
