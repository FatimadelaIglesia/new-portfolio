"use client";

import { useState } from "react";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type FieldErrors = { firstName?: string; email?: string };

function validate(firstName: string, email: string): FieldErrors {
  const errors: FieldErrors = {};
  if (!firstName.trim()) {
    errors.firstName = "Please enter your first name.";
  }
  if (!email.trim()) {
    errors.email = "Please enter your email address.";
  } else if (!emailPattern.test(email.trim())) {
    errors.email = "Please enter a valid email address, like name@example.com.";
  }
  return errors;
}

const inputClass =
  "w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-text placeholder:text-text-muted focus:border-primary";

export default function NewsletterForm() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const foundErrors = validate(firstName, email);
    setErrors(foundErrors);
    if (Object.keys(foundErrors).length > 0) {
      return;
    }

    setStatus("submitting");
    const data = new FormData(event.currentTarget);
    data.set("firstName", firstName.trim());
    data.set("email", email.trim());

    try {
      const response = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data as unknown as Record<string, string>).toString(),
      });
      setStatus(response.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section
      id="newsletter"
      className="scroll-mt-24 border-t border-border/70 bg-background px-6 py-16 sm:px-8"
    >
      <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-surface px-6 py-10 text-center shadow-sm sm:px-12">
        <span className="text-sm font-semibold uppercase tracking-wider text-accent">
          Newsletter
        </span>
        <h2 className="mt-2 font-heading text-2xl font-bold text-text sm:text-3xl">
          Join my newsletter
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-text-muted">
          Occasional updates on new projects and what I am learning as a
          junior web developer. No spam, and you can unsubscribe at any time.
        </p>

        {status === "success" ? (
          <p
            role="status"
            className="mt-8 rounded-xl bg-primary/10 px-4 py-4 text-base font-semibold text-primary-dark"
          >
            Thank you, {firstName.trim()}! You are on the list.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            name="newsletter"
            className="mt-8 text-left"
          >
            <input type="hidden" name="form-name" value="newsletter" />
            <div className="hidden" aria-hidden="true">
              <label>
                Leave this field empty
                <input type="text" name="bot-field" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="newsletter-first-name"
                  className="mb-1.5 block text-sm font-medium text-text"
                >
                  First name
                </label>
                <input
                  id="newsletter-first-name"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  aria-invalid={errors.firstName ? true : undefined}
                  aria-describedby={errors.firstName ? "newsletter-first-name-error" : undefined}
                  placeholder="Jane"
                  className={inputClass}
                />
                {errors.firstName && (
                  <p
                    id="newsletter-first-name-error"
                    className="mt-1.5 text-sm font-medium text-red-700"
                  >
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="newsletter-email"
                  className="mb-1.5 block text-sm font-medium text-text"
                >
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  aria-invalid={errors.email ? true : undefined}
                  aria-describedby={errors.email ? "newsletter-email-error" : undefined}
                  placeholder="jane@example.com"
                  className={inputClass}
                />
                {errors.email && (
                  <p
                    id="newsletter-email-error"
                    className="mt-1.5 text-sm font-medium text-red-700"
                  >
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={status === "submitting"}
              className="mt-6 w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark hover:shadow-md disabled:opacity-60 sm:w-auto sm:px-10"
            >
              {status === "submitting" ? "Subscribing..." : "Subscribe"}
            </button>

            {status === "error" && (
              <p role="alert" className="mt-4 text-sm font-medium text-red-700">
                Something went wrong, so your subscription was not saved.
                Please try again in a moment.
              </p>
            )}

            <p className="mt-4 text-xs text-text-muted">
              By subscribing you agree to receive occasional emails from me.
              I only use your details for this newsletter.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
