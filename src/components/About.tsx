import { education, personalInfo, spokenLanguages } from "@/lib/data";

export default function About() {
  return (
    <section id="about" className="px-6 py-20 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-wider text-accent">
            About Me
          </span>
          <h2 className="mt-2 font-heading text-3xl font-bold text-text sm:text-4xl">
            A little about my journey
          </h2>
        </div>

        <div className="mt-10 grid gap-10 md:grid-cols-3">
          <div className="md:col-span-2">
            <p className="text-base leading-relaxed text-text-muted">
              {personalInfo.bio}
            </p>
            <p className="mt-4 text-base leading-relaxed text-text-muted">
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
  );
}
