"use client";

import { useId, useMemo, useState } from "react";
import ProjectCard from "./ProjectCard";
import type { Project } from "@/lib/data";

function matches(project: Project, words: string[]) {
  const haystack = [project.title, project.description, ...project.tech]
    .join(" ")
    .toLowerCase();
  return words.every((word) => haystack.includes(word));
}

export default function ProjectSearch({ projects }: { projects: Project[] }) {
  const inputId = useId();
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    return words.length === 0
      ? projects
      : projects.filter((project) => matches(project, words));
  }, [projects, query]);

  const searching = query.trim() !== "";
  const summary = !searching
    ? `Showing all ${projects.length} projects`
    : results.length === 0
      ? `No projects found for "${query.trim()}"`
      : `Showing ${results.length} of ${projects.length} projects`;

  return (
    <div>
      <div className="mx-auto max-w-xl">
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-text">
          Search projects
        </label>
        <div className="relative">
          <input
            id={inputId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try React, weather or CSS"
            autoComplete="off"
            className="w-full rounded-full border border-input-border bg-background py-3 pr-24 pl-5 text-sm text-text placeholder:text-text-muted focus:border-primary [&::-webkit-search-cancel-button]:appearance-none"
          />
          {searching && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full px-4 py-1.5 text-sm font-semibold text-primary-dark hover:bg-primary/10"
            >
              Clear
            </button>
          )}
        </div>
        <p role="status" className="mt-2 text-sm text-text-muted">
          {summary}
        </p>
      </div>

      <h2 className="sr-only">Project list</h2>

      {results.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-border bg-surface p-8 text-center">
          <p className="text-base text-text-muted">
            Nothing matches that search. Try a different word, such as a
            technology like React or CSS.
          </p>
          <button
            type="button"
            onClick={() => setQuery("")}
            className="mt-4 rounded-full border border-primary px-6 py-2.5 text-sm font-semibold text-primary-dark hover:bg-primary/10"
          >
            Show all projects
          </button>
        </div>
      )}
    </div>
  );
}
