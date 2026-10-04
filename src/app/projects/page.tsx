import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import CtaBanner from "@/components/CtaBanner";
import { personalInfo, projects } from "@/lib/data";
import { GitHubIcon } from "@/components/icons";

export default function ProjectsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-6 pt-6 sm:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-text-muted transition-colors hover:text-primary"
          >
            {"\u2190"} Back to home
          </Link>
        </div>

        <section className="relative overflow-hidden px-6 pt-10 pb-16 text-center sm:px-8 sm:pt-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-accent/10 blur-3xl sm:h-96 sm:w-96"
          />
          <div className="relative mx-auto max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-wider text-accent">
              Projects
            </span>
            <h1 className="mt-2 font-heading text-4xl font-bold tracking-tight text-text sm:text-5xl">
              Things I have built
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-text-muted">
              Everything below started as a way to practice a specific
              skill: fetching data from an API, building a responsive
              layout without a framework, or just getting comfortable with
              the DOM. Each one is small, but each one taught me something
              I still use. Full code for all of them is on my GitHub.
            </p>
          </div>
          <div className="relative mx-auto mt-10 max-w-3xl overflow-hidden rounded-2xl border-2 border-primary/20 shadow-lg">
            <Image
              src="/seville-hero.jpg"
              alt="Welcome to Seville page from the Seville Travel Guide project, showing a bridge over the river"
              width={1400}
              height={678}
              priority
              className="h-auto w-full"
            />
          </div>
        </section>

        <section className="px-6 py-20 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project.title} project={project} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-primary px-6 py-3 text-sm font-semibold text-primary-dark transition-colors hover:bg-primary/10">
                <GitHubIcon className="size-4" />
                See more on GitHub
              </a>
            </div>
          </div>
        </section>

        <CtaBanner
          title="Have a project or role in mind?"
          text="I am open to junior front-end roles and remote-friendly opportunities. Tell me what you are building and how I could help."
          primary={{
            label: "Email me directly",
            href: `mailto:${personalInfo.email}?subject=Hello%20Fatima`,
            external: true,
          }}
          secondary={{ label: "More about me", href: "/about" }}
        />
      </main>
      <Footer />
    </>
  );
}
