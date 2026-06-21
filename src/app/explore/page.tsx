"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import SoundtrackCard from "@/src/components/SoundtrackCard";
import SoundtrackCardSkeleton from "@/src/components/SoundtrackCardSkeleton";
import MoodSelector from "@/src/components/MoodSelector";
import { getSoundtracks } from "@/src/services/soundtracks";

type Soundtrack = {
  _id: string;
  title: string;
  movie: string;
  composer: string;
  moods: string[];
};

export default function ExplorePage() {
  const [soundtracks, setSoundtracks] = useState<Soundtrack[]>([]);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    async function loadSoundtracks() {
      try {
        const data = await getSoundtracks();
        setSoundtracks(data);
      } catch (err: any) {
        setError(err.message || "Failed to load soundtracks");
      } finally {
        setLoading(false);
      }
    }

    loadSoundtracks();
  }, []);

  // Filter by search + mood
  const filteredSoundtracks = soundtracks.filter((soundtrack) => {
    const matchesMood =
      !selectedMood ||
      (Array.isArray(soundtrack.moods) &&
        soundtrack.moods.some(
          (m) => m.toLowerCase() === selectedMood.toLowerCase()
        ));

    const search = searchTerm.toLowerCase().trim();

    const matchesSearch =
      !search ||
      soundtrack.title.toLowerCase().includes(search) ||
      soundtrack.movie.toLowerCase().includes(search) ||
      soundtrack.composer.toLowerCase().includes(search);

    return matchesMood && matchesSearch;
  });

  // Focus heading after load
  useEffect(() => {
    if (!loading && headingRef.current) {
      headingRef.current.focus();
    }
  }, [loading]);

  if (loading) {
    return (
      <main className="max-w-6xl mx-auto p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <SoundtrackCardSkeleton />
            </div>
          ))}
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-8 text-center text-red-400" role="alert">
        {error}
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto p-8 space-y-8">
      {/* Header */}
      <header>
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="text-3xl font-semibold mb-2 focus:outline-none"
        >
          Explore Soundtracks
        </h1>

        <p className="text-gray-400">
          Discover movie soundtracks by mood
        </p>
      </header>

      {/* Search */}
      <section className="space-y-2">
        <label
          htmlFor="search"
          className="block text-lg font-medium text-gray-400"
        >
          Search Soundtracks
        </label>

        <input
          id="search"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by title, movie, or composer..."
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-zinc-500"
        />
      </section>

      {/* Mood Selector Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-400">
            Filter by Mood
          </h2>
        </div>

        <MoodSelector
          selectedMood={selectedMood}
          onChange={setSelectedMood}
        />
      </section>

      {/* Results */}
      {filteredSoundtracks.length === 0 ? (
        <p
          role="status"
          aria-live="polite"
          className="text-center text-gray-400 mt-12"
        >
          No soundtracks found.
          <br />
          Try a different search term or mood.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSoundtracks.map((soundtrack) => (
            <Link
              key={soundtrack._id}
              href={`/soundtrack/${soundtrack._id}`}
            >
              <SoundtrackCard soundtrack={soundtrack} />
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}