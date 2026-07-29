import type { Project } from "@/lib/data";
import { ExternalLinkIcon, GitHubIcon } from "./icons";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
      <h3 className="font-heading text-xl font-semibold text-text group-hover:text-primary-dark">
        {project.title}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-text-muted">
        {project.description}
      </p>

      <ul className="mt-5 flex flex-wrap gap-2">
        {project.tech.map((tech) => (
          <li
            key={tech}
            className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary-dark"
          >
            {tech}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center gap-4 border-t border-border pt-4">
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-dark transition-colors hover:text-primary"
        >
          <GitHubIcon className="size-4" />
          Code
        </a>
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-colors hover:text-accent/80"
          >
            <ExternalLinkIcon className="size-4" />
            Live Demo
          </a>
        )}
      </div>
    </article>
  );
}
