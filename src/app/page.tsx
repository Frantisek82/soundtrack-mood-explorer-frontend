import Link from "next/link";

export default function HomePage() {
  return (
    <section className="min-h-[80vh] flex items-center justify-center bg-black text-white">
      <div className="max-w-3xl mx-auto px-6 text-center space-y-8">
        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
          Discover Movie Soundtracks <br />
          <span className="text-zinc-400">by Mood</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-gray-400">
          From epic and emotional to calm and mysterious.
          <br />
          Explore film music the way it makes you feel.
        </p>

        {/* CTA */}
        <div>
          <Link
            href="/explore"
            className="inline-block px-6 py-3 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition"
          >
            Explore by Mood →
          </Link>
        </div>

        {/* Mood preview (non-interactive) */}
        <div className="flex flex-wrap justify-center gap-3 pt-6">
          {["Epic", "Calm", "Dark", "Emotional", "Hopeful", "Romantic"].map((mood) => (
            <span
              key={mood}
              className="px-3 py-1 rounded-full border border-zinc-700 text-sm text-gray-300"
            >
              {mood}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
