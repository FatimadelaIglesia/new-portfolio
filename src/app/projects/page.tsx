import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import { personalInfo, projects } from "@/lib/data";
import { GitHubIcon } from "@/components/icons";

export default function ProjectsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="relative overflow-hidden px-6 pt-16 pb-16 text-center sm:px-8 sm:pt-24">
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
          <div className="relative mx-auto mt-10 max-w-md overflow-hidden rounded-2xl border-2 border-primary/20 shadow-lg">
            <Image
              src="https://images.unsplash.com/photo-1760548425425-e42e77fa38f1?fm=jpg&q=80&w=640&h=360&auto=format&fit=crop"
              alt="Computer screen displaying colorful code snippets"
              width={640}
              height={360}
              priority
              className="object-cover"
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
      </main>
      <Footer />
    </>
  );
}
