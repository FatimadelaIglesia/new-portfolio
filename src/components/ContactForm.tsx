"use client";

import { useState } from "react";
import { personalInfo } from "@/lib/data";

const fieldClass =
  "w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-text placeholder:text-text-muted focus:border-primary";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const subject = `Hello from ${name}`;
    const body = `${message}\n\nFrom: ${name}\nReply to: ${email}`;
    window.location.href = `mailto:${personalInfo.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
      <div>
        <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-text">
          Your name
        </label>
        <input
          id="contact-name"
          type="text"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Jane Smith"
          className={fieldClass}
        />
      </div>
      <div>
        <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-text">
          Your email
        </label>
        <input
          id="contact-email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="jane@company.com"
          className={fieldClass}
        />
      </div>
      <div>
        <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-text">
          Your message
        </label>
        <textarea
          id="contact-message"
          required
          rows={5}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Tell me about the role or project you have in mind."
          className={fieldClass}
        />
      </div>
      <button
        type="submit"
        className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark hover:shadow-md"
      >
        Send message
      </button>
    </form>
  );
}
