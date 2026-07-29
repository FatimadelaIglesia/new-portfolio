import { navLinks, personalInfo } from "@/lib/data";
import { GitHubIcon, LeafIcon, MailIcon } from "./icons";

export default function Footer() {
  return (
    <footer className="border-t border-border/70 bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 sm:px-8 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs">
          <a
            href="#top"
            className="flex items-center gap-2 font-heading text-lg font-semibold text-primary-dark"
          >
            <LeafIcon className="size-6 text-primary" />
            Fatima de la Iglesia
          </a>
          <p className="mt-3 text-sm leading-relaxed text-text-muted">
            Junior Web Developer crafting clean, accessible, and user-friendly
            digital experiences.
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-col gap-2">
          <span className="font-heading text-sm font-semibold text-text">
            Navigate
          </span>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-text-muted transition-colors hover:text-primary"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex flex-col gap-2">
          <span className="font-heading text-sm font-semibold text-text">
            Connect
          </span>
          <a
            href={`mailto:${personalInfo.email}`}
            className="inline-flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-primary"
          >
            <MailIcon className="size-4" />
            {personalInfo.email}
          </a>
          <a
            href={personalInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-primary"
          >
            <GitHubIcon className="size-4" />
            GitHub
          </a>
        </div>
      </div>

      <div className="border-t border-border/70 px-6 py-5 text-center text-xs text-text-muted sm:px-8">
        © {new Date().getFullYear()} {personalInfo.name}. All rights reserved.
      </div>
    </footer>
  );
}
