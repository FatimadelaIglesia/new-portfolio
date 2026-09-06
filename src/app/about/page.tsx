import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { personalInfo, education, spokenLanguages, skills, projects } from "@/lib/data";
import { PinIcon } from "@/components/icons";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* HERO */}
        <section
          id="about-top"
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
          <div className="relative mx-auto max-w-3xl text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-sm font-medium text-primary-dark">
              <PinIcon className="size-4 text-accent" />
              {personalInfo.location}
            </p>
            <h1 className="mt-6 font-heading text-4xl font-bold tracking-tight text-text sm:text-5xl">
              About {personalInfo.name}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-text-muted">
              {personalInfo.bio}
            </p>
          </div>
        </section>

        {/* BACKGROUND */}
        <section id="about-background" className="px-6 py-20 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <span className="text-sm font-semibold uppercase tracking-wider text-accent">
                Background
              </span>
              <h2 className="mt-2 font-heading text-3xl font-bold text-text sm:text-4xl">
                How I got here
              </h2>
            </div>
            <div className="mt-10 grid gap-10 md:grid-cols-3">
              <div className="md:col-span-2">
                <p className="text-base leading-relaxed text-text-muted">
                  {personalInfo.goal}
                </p>
              </div>
              <div className="flex flex-col gap-6">
                <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                  <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-primary-dark">
                    Education
                  </h3>
                  <p className="mt-2 text-base font-semibold text-text">
                    {education.school}
                  </p>
                  <p className="text-sm text-text-muted">{education.program}</p>
                  <p className="mt-1 text-sm text-text-muted">{education.period}</p>
                </div>
                <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                  <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-primary-dark">
                    Languages
                  </h3>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {spokenLanguages.map((lang) => (
                      <li
                        key={lang}
                        className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary-dark"
                      >
                        {lang}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SKILLS */}
        <section id="about-skills" className="px-6 py-20 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <span className="text-sm font-semibold uppercase tracking-wider text-accent">
                Skills
              </span>
              <h2 className="mt-2 font-heading text-3xl font-bold text-text sm:text-4xl">
                What I work with
              </h2>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {Object.entries(skills).map(([groupTitle, items]) => (
                <div
                  key={groupTitle}
                  className="rounded-2xl border border-border bg-surface p-6 shadow-sm"
                >
                  <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-primary-dark">
                    {groupTitle}
                  </h3>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {items.map((item) => (
                      <li
                        key={item}
                        className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary-dark"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section id="about-projects" className="px-6 py-20 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <span className="text-sm font-semibold uppercase tracking-wider text-accent">
                Projects
              </span>
              <h2 className="mt-2 font-heading text-3xl font-bold text-text sm:text-4xl">
                Things I&apos;ve built
              </h2>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <div
                  key={project.title}
                  className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6 shadow-sm"
                >
                  <h3 className="font-heading text-lg font-bold text-text">
                    {project.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-text-muted">
                    {project.description}
                  </p>
                  <ul className="flex flex-wrap gap-2">
                    {project.tech.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary-dark"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex gap-4">
                    <Link
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-primary hover:text-primary-dark"
                    >
                      Code →
                    </Link>
                    {project.liveUrl && (
                      <Link
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-primary hover:text-primary-dark"
                      >
                        Live demo →
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
