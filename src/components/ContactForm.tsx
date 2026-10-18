"use client";

import { useState } from "react";
import { personalInfo } from "@/lib/data";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type FieldErrors = { name?: string; email?: string; message?: string };

function validate(name: string, email: string, message: string): FieldErrors {
  const errors: FieldErrors = {};
  if (!name.trim()) {
    errors.name = "Please enter your name.";
  }
  if (!email.trim()) {
    errors.email = "Please enter your email address.";
  } else if (!emailPattern.test(email.trim())) {
    errors.email = "Please enter a valid email address, like name@example.com.";
  }
  if (!message.trim()) {
    errors.message = "Please write a message.";
  }
  return errors;
}

const fieldClass =
  "w-full rounded-lg border border-input-border bg-background px-4 py-2.5 text-sm text-text placeholder:text-text-muted focus:border-primary";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate(name, email, message);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const firstInvalidId = found.name
        ? "contact-name"
        : found.email
          ? "contact-email"
          : "contact-message";
      document.getElementById(firstInvalidId)?.focus();
      return;
    }

    setStatus("submitting");
    const honeypot = String(new FormData(event.currentTarget).get("website") ?? "");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          website: honeypot,
        }),
      });
      setStatus(response.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p
        role="status"
        className="mt-6 rounded-xl bg-primary/10 px-4 py-4 text-base font-semibold text-primary-dark"
      >
        Thank you, {name.trim()}! Your message has been sent. I will reply to{" "}
        {email.trim()} as soon as I can.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-4">
      <div className="hidden" aria-hidden="true">
        <label>
          Leave this field empty
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div>
        <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-text">
          Your name
        </label>
        <input
          id="contact-name"
          type="text"
          autoComplete="name"
          required
          maxLength={100}
          value={name}
          onChange={(event) => setName(event.target.value)}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "contact-name-error" : undefined}
          placeholder="Jane Smith"
          className={fieldClass}
        />
        {errors.name && (
          <p id="contact-name-error" className="mt-1.5 text-sm font-medium text-red-700">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-text">
          Your email
        </label>
        <input
          id="contact-email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
          placeholder="jane@company.com"
          className={fieldClass}
        />
        {errors.email && (
          <p id="contact-email-error" className="mt-1.5 text-sm font-medium text-red-700">
            {errors.email}
          </p>
        )}
      </div>
              <div>
        <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-text">
          Your message
        </label>
        <textarea
          id="contact-message"
          required
          rows={5}
          maxLength={5000}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          placeholder="Tell me about the role or project you have in mind."
          className={fieldClass}
        />
        {errors.message && (
          <p id="contact-message-error" className="mt-1.5 text-sm font-medium text-red-700">
            {errors.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark hover:shadow-md disabled:opacity-60"
      >
        {status === "submitting" ? "Sending..." : "Send message"}
      </button>

      {status === "error" && (
        <p role="alert" className="text-sm font-medium text-red-700">
          Something went wrong, so your message was not sent. Please try again
          in a moment, or email me directly at{" "}
          <a
            href={`mailto:${personalInfo.email}`}
            className="underline underline-offset-2"
          >
            {personalInfo.email}
          </a>
          .
        </p>
      )}

      <p className="text-xs text-text-muted">
        I only use your details to reply to your message.
      </p>
    </form>
  );
}
