import { skills } from "@/lib/data";

export default function Skills() {
  return (
    <section id="skills" className="bg-surface px-6 py-20 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-wider text-accent">
            Skills
          </span>
          <h2 className="mt-2 font-heading text-3xl font-bold text-text sm:text-4xl">
            Tools I build with
          </h2>
          <p className="mt-3 text-base leading-relaxed text-text-muted">
            A growing toolkit focused on performance, usability, and
            accessibility.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {Object.entries(skills).map(([category, items]) => (
            <div
              key={category}
              className="rounded-2xl border border-border bg-background p-6 transition-shadow hover:shadow-md"
            >
              <h3 className="font-heading text-lg font-semibold text-primary-dark">
                {category}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-primary/30 bg-surface px-3.5 py-1.5 text-sm font-medium text-text transition-colors hover:border-primary hover:text-primary-dark"
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
  );
}
