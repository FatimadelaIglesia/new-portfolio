import Image from "next/image";
import { personalInfo } from "@/lib/data";
import { DownloadIcon, LeafIcon, PinIcon } from "./icons";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden px-6 pt-16 pb-20 sm:px-8 sm:pt-24 sm:pb-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl sm:h-96 sm:w-96"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-16 h-64 w-64 rounded-full bg-accent/10 blur-3xl sm:h-80 sm:w-80"
      />

      <div className="relative mx-auto flex max-w-6xl flex-col-reverse items-center gap-12 md:flex-row md:justify-between">
        <div className="max-w-xl text-center md:text-left">
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-sm font-medium text-primary-dark">
            <LeafIcon className="size-4" />
            Available for junior front-end roles
          </p>

          <h1 className="mt-6 font-heading text-4xl font-bold tracking-tight text-text sm:text-5xl">
            Hi, I&apos;m {personalInfo.name.split(" ")[0]} —{" "}
            <span className="text-primary">{personalInfo.title}</span>
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-text-muted">
            {personalInfo.bio}
          </p>

          <p className="mt-4 inline-flex items-center justify-center gap-1.5 text-sm text-text-muted md:justify-start">
            <PinIcon className="size-4 text-accent" />
            {personalInfo.location}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
            <a
              href="#projects"
              className="rounded-full bg-primary px-6 py-3 text-center text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark hover:shadow-md"
            >
              View My Projects
            </a>
            <a
              href="#contact"
              className="rounded-full border border-primary px-6 py-3 text-center text-sm font-semibold text-primary-dark transition-colors hover:bg-primary/10"
            >
              Get In Touch
            </a>
            <a
              href={personalInfo.resumeUrl}
              download
              className="inline-flex items-center justify-center gap-2 rounded-full border border-transparent px-6 py-3 text-center text-sm font-semibold text-accent transition-colors hover:bg-accent/10"
            >
              <DownloadIcon className="size-4" />
              Download Resume
            </a>
          </div>
        </div>

        <div className="relative shrink-0">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 scale-110 rounded-[45%_55%_60%_40%/50%_45%_55%_50%] bg-gradient-to-br from-primary/25 via-secondary/15 to-accent/20"
          />
          <div className="relative size-44 overflow-hidden rounded-[45%_55%_60%_40%/50%_45%_55%_50%] border-2 border-primary/30 bg-surface shadow-lg sm:size-56">
            <Image
              src="/fatima.jpg"
              alt="Portrait of Fatima de la Iglesia"
              fill
              priority
              sizes="(min-width: 640px) 224px, 176px"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
