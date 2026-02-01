import Link from "next/link";

export default function HomePage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-2">
        Soundtrack Mood Explorer
      </h1>

      <p className="text-gray-400 max-w-xl mb-8">
        Discover movie and game soundtracks by emotion instead of title.
      </p>

      <div className="flex gap-4">
        <Link
          href="/explore"
          className="px-6 py-3 rounded-lg bg-white text-black font-medium hover:bg-gray-200 transition"
        >
          Explore
        </Link>

        <Link
          href="/login"
          className="px-6 py-3 rounded-lg bg-white text-black font-medium hover:bg-gray-200 transition"
        >
          Login
        </Link>
      </div>
    </main>
  );
}
