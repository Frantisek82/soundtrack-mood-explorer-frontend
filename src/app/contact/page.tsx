"use client";

import { useState } from "react";
import Button from "@/src/components/Button";
import { sendContactMessage } from "@/src/services/contact";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();

    try {
      setLoading(true);

      await sendContactMessage({
        name,
        email,
        subject,
        message,
      });

      setSubmitted(true);

      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Failed to send message.",
      );
    } finally {
      setLoading(false);
    }
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
              <label
                htmlFor="contact-name"
                className="block text-sm mb-1"
              >
                Name
              </label>
              <input
                id="contact-name"
                type="text"
                required
                placeholder="John Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="
    w-full px-4 py-2 rounded-lg
    bg-black border border-zinc-700
    text-white placeholder:text-gray-500
    focus:outline-none focus:border-white
  "
              />
            </div>

            <div>
              <label
                htmlFor="contact-email"
                className="block text-sm mb-1"
              >
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                required
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="
    w-full px-4 py-2 rounded-lg
    bg-black border border-zinc-700
    text-white placeholder:text-gray-500
    focus:outline-none focus:border-white
  "
              />
            </div>

            <div>
              <label
                htmlFor="contact-subject"
                className="block text-sm mb-1"
              >
                Subject
              </label>

              <input
                id="contact-subject"
                type="text"
                required
                placeholder="Project collaboration"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="
    w-full px-4 py-2 rounded-lg
    bg-black border border-zinc-700
    text-white placeholder:text-gray-500
    focus:outline-none focus:border-white
  "
              />
            </div>
            <div>
              <label
                htmlFor="contact-message"
                className="block text-sm mb-1"
              >
                Message
              </label>
              <textarea
                id="contact-message"
                required
                rows={6}
                placeholder="Tell me about your project..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
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
            <Button
              type="submit"
              loading={loading}
              disabled={loading}
              className="w-full"
            >
              Send Message
            </Button>
          </form>
        ) : (
          <div
            role="status"
            aria-live="polite"
            className="space-y-2 text-center"
          >
            <p className="text-lg font-semibold text-white">
              Message sent successfully!
            </p>

            <p className="text-gray-400">
              Thank you for your message. I've received it and will get back to you as soon as possible.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
