"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let observer: IntersectionObserver | null = null;

    const frame = window.requestAnimationFrame(() => {
      const targets = document.querySelectorAll<HTMLElement>(
        "main section, #newsletter"
      );

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.05, rootMargin: "0px 0px -8% 0px" }
      );

      targets.forEach((element) => {
        if (element.getBoundingClientRect().top < window.innerHeight * 0.9) {
          return;
        }
        element.classList.add("reveal");
        observer?.observe(element);
      });
    });

    return () => {
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [pathname]);

  return null;
}
