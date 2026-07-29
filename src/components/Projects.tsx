import { personalInfo, projects } from "@/lib/data";
import ProjectCard from "./ProjectCard";
import { GitHubIcon } from "./icons";

export default function Projects() {
  return (
    <section id="projects" className="px-6 py-20 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-wider text-accent">
            Projects
          </span>
          <h2 className="mt-2 font-heading text-3xl font-bold text-text sm:text-4xl">
            Things I&apos;ve built
          </h2>
          <p className="mt-3 text-base leading-relaxed text-text-muted">
            A selection of real projects from my GitHub, built while learning
            and practicing front-end development.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href={personalInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-primary px-6 py-3 text-sm font-semibold text-primary-dark transition-colors hover:bg-primary/10"
          >
            <GitHubIcon className="size-4" />
            See more on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
