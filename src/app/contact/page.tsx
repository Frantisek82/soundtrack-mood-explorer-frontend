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
              <label className="block text-sm mb-1">Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 rounded-lg bg-black border border-zinc-700 focus:outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                required
                className="w-full px-4 py-2 rounded-lg bg-black border border-zinc-700 focus:outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Message</label>
              <textarea
                required
                rows={4}
                className="w-full px-4 py-2 rounded-lg bg-black border border-zinc-700 focus:outline-none focus:border-white resize-none"
              />
            </div>

            {/* Primary action */}
            <Button type="submit">
              Send message
            </Button>
          </form>
        ) : (
          <p className="text-center text-gray-300">
            Thanks for your message!  
            I’ll get back to you as soon as possible.
          </p>
        )}
      </section>
    </main>
  );
}
