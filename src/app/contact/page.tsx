"use client";

import { useState } from "react";
import Button from "@/src/components/Button";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      {/* Page Header */}
      <header className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Contact</h1>
        <p className="text-gray-400">
          Get in touch if you’d like to discuss this project.
        </p>
      </header>

      {/* Contact Card */}
      <section className="bg-zinc-900 rounded-xl p-6">
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="contact-name" className="block text-sm mb-1">Name</label>
              <input
                id="contact-name"
                type="text"
                required
                placeholder="Your name"
                className="
    w-full px-4 py-2 rounded-lg
    bg-black border border-zinc-700
    text-white placeholder:text-gray-500
    focus:outline-none focus:border-white
  "
              />
            </div>

            <div>
              <label htmlFor="contact-email" className="block text-sm mb-1">Email</label>
              <input
                id="contact-email"
                type="email"
                required
                placeholder="Your email"
                className="
    w-full px-4 py-2 rounded-lg
    bg-black border border-zinc-700
    text-white placeholder:text-gray-500
    focus:outline-none focus:border-white
  "
              />
            </div>

            <div>
              <label htmlFor="contact-message" className="block text-sm mb-1">Message</label>
              <textarea
                id="contact-message"
                required
                rows={4}
                placeholder="Your message"
                className="
    w-full px-4 py-2 rounded-lg
    bg-black border border-zinc-700
    text-white placeholder:text-gray-500
    focus:outline-none focus:border-white
    resize-none
  "
              />
            </div>

            {/* Primary action */}
            <Button type="submit">
              Send message
            </Button>
          </form>
        ) : (
          <p
            role="status"
            aria-live="polite"
            className="text-center text-gray-300"
          >
            Thanks for your message!
            I’ll get back to you as soon as possible.
          </p>
        )}
      </section>
    </main>
  );
}
