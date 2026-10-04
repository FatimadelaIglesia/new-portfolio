"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { personalInfo } from "@/lib/data";
import { CloseIcon, LeafIcon } from "./icons";

const pages = [
  { label: "Home", href: "/", description: "Back to the start" },
  {
    label: "About",
    href: "/about",
    description: "My background, education and languages",
  },
  {
    label: "Skills",
    href: "/skills",
    description: "The tools and technologies I build with",
  },
  {
    label: "Projects",
    href: "/projects",
    description: "Real projects from my GitHub",
  },
  {
    label: "Contact",
    href: "/contact",
    description: "Get in touch about junior roles",
  },
];

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M5 8l5 5 5-5" />
    </svg>
  );
}

function PanelLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18" />
    </svg>
  );
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-md">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-8"
      >
        <Link
          href="/"
          className="flex items-center gap-2 font-heading text-lg font-semibold text-primary-dark transition-colors hover:text-primary"
        >
          <LeafIcon className="size-6 text-primary" />
          Fatima de la Iglesia
        </Link>

        <div className="hidden items-center gap-4 md:flex">
          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
              aria-controls="pages-menu"
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-text-muted transition-colors hover:bg-primary/10 hover:text-primary"
            >
              Explore my site
              <ChevronDownIcon
                className={`size-4 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isDropdownOpen && (
              <ul
                id="pages-menu"
                className="absolute right-0 mt-3 w-80 rounded-2xl border border-border bg-surface p-2 shadow-lg"
              >
                {pages.map((page) => (
                  <li key={page.href}>
                    <Link
                      href={page.href}
                      onClick={() => setIsDropdownOpen(false)}
                      aria-current={isActive(page.href) ? "page" : undefined}
                      className={`block rounded-xl px-4 py-3 transition-colors hover:bg-primary/10 ${
                        isActive(page.href) ? "bg-primary/10" : ""
                      }`}
                    >
                      <span className="block text-sm font-semibold text-text">
                        {page.label}
                      </span>
                      <span className="block text-xs text-text-muted">
                        {page.description}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <a
            href={`mailto:${personalInfo.email}`}
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark hover:shadow-md"
          >
            Let&apos;s Talk
          </a>
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="inline-flex items-center justify-center rounded-md p-2 text-primary-dark transition-colors hover:bg-primary/10 md:hidden"
        >
          {isMenuOpen ? <CloseIcon /> : <PanelLeftIcon className="size-6" />}
        </button>
      </nav>

      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="max-h-[calc(100vh-4.5rem)] overflow-y-auto border-t border-border/70 bg-background px-6 pb-6 md:hidden"
        >
          <ul className="flex flex-col gap-1 pt-4">
            {pages.map((page) => (
              <li key={page.href}>
                <Link
                  href={page.href}
                  onClick={() => setIsMenuOpen(false)}
                  aria-current={isActive(page.href) ? "page" : undefined}
                  className={`block rounded-md px-3 py-2.5 transition-colors hover:bg-primary/10 ${
                    isActive(page.href) ? "bg-primary/10" : ""
                  }`}
                >
                  <span className="block text-base font-medium text-text">
                    {page.label}
                  </span>
                  <span className="block text-xs text-text-muted">
                    {page.description}
                  </span>
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <a
                href={`mailto:${personalInfo.email}`}
                onClick={() => setIsMenuOpen(false)}
                className="block rounded-full bg-primary px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
              >
                Let&apos;s Talk
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
