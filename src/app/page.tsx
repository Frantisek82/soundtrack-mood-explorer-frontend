import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-4xl font-bold mb-4">
        Soundtrack Mood Explorer
      </h1>

      <p className="text-gray-400 max-w-xl mb-8">
        Discover movie and game soundtracks by emotion instead of title.
      </p>

      <div className="flex gap-4">
        <Link
          href="/explore"
          className="px-6 py-3 bg-white text-black rounded-lg font-medium"
        >
          Explore
        </Link>

        <Link
          href="/login"
          className="px-6 py-3 border border-white rounded-lg"
        >
          Login
        </Link>
      </div>
    </main>
  );
}
