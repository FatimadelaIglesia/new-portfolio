import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { skills } from "@/lib/data";

export default function SkillsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-6 pt-6 sm:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-text-muted transition-colors hover:text-primary"
          >
            ← Back to home
          </Link>
        </div>

        <section className="relative overflow-hidden px-6 pt-10 pb-16 sm:px-8 sm:pt-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl sm:h-96 sm:w-96"
          />
          <div className="relative mx-auto flex max-w-6xl flex-col-reverse items-center gap-12 md:flex-row md:justify-between">
            <div className="max-w-xl text-center md:text-left">
              <span className="text-sm font-semibold uppercase tracking-wider text-accent">
                Skills
              </span>
              <h1 className="mt-2 font-heading text-4xl font-bold tracking-tight text-text sm:text-5xl">
                What I bring to the table
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-text-muted">
                I am building my front-end toolkit through She Codes'
                Junior Front-End Developer program, layering React and
                JavaScript on top of the HTML and CSS fundamentals I started
                with. I like understanding how things work under the hood,
                which is why Python and a growing curiosity about back-end
                development have found their way onto this list too.
              </p>
            </div>
            <div className="relative shrink-0 overflow-hidden rounded-2xl border-2 border-primary/20 shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1763568258330-039d2f3dfc76?fm=jpg&q=80&w=480&h=360&auto=format&fit=crop"
                alt="Laptop screen displaying lines of code"
                width={480}
                height={360}
                priority
                className="object-cover"
              />
            </div>
          </div>
        </section>

        <section className="bg-surface px-6 py-20 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <span className="text-sm font-semibold uppercase tracking-wider text-accent">
                Toolkit
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
      </main>
      <Footer />
    </>
  );
}
