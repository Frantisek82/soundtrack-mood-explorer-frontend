"use client";

export default function ContactPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <form className="bg-zinc-900 p-8 rounded-xl w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6">Contact Us</h2>

        <input
          placeholder="Name"
          className="w-full mb-4 p-3 rounded bg-black border border-zinc-700"
        />

        <input
          placeholder="Email"
          className="w-full mb-4 p-3 rounded bg-black border border-zinc-700"
        />

        <textarea
          placeholder="Message"
          className="w-full mb-6 p-3 rounded bg-black border border-zinc-700"
          rows={4}
        />

        <button className="w-full bg-white text-black py-3 rounded font-medium">
          Send Message
        </button>
      </form>
    </main>
  );
}
