"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import SoundtrackCard from "@/src/components/SoundtrackCard";
import MoodSelector from "@/src/components/MoodSelector";
import { getSoundtracks } from "@/src/services/soundtracks";

/* =====================
   Types
===================== */

type Soundtrack = {
  _id: string;
  title: string;
  movie: string;
  composer: string;
  moods: string[];
  spotifyTrackId?: string;
};

/* =====================
   Page
===================== */

export default function ExplorePage() {
  const [soundtracks, setSoundtracks] = useState<Soundtrack[]>([]);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const emptyRef = useRef<HTMLDivElement>(null);

  /* Load soundtracks */
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

  /* Filter by mood */
  const filteredSoundtracks = selectedMood
    ? soundtracks.filter(
        (s) =>
          Array.isArray(s.moods) && s.moods.includes(selectedMood)
      )
    : soundtracks;

  /* Focus empty state when results disappear */
  useEffect(() => {
    if (!loading && filteredSoundtracks.length === 0) {
      emptyRef.current?.focus();
    }
  }, [loading, filteredSoundtracks.length]);

  /* =====================
     States
  ===================== */

  if (loading) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="p-8 text-center text-gray-400"
      >
        Loading soundtracks…
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="p-8 text-center text-red-400"
      >
        {error}
      </div>
    );
  }

  /* =====================
     UI
  ===================== */

  return (
    <main className="max-w-6xl mx-auto p-8 space-y-8">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-semibold mb-2">
          Explore Soundtracks
        </h1>
        <p className="text-gray-400">
          Discover movie soundtracks by mood.
        </p>
      </header>

      {/* Mood selector */}
      <MoodSelector
        selectedMood={selectedMood}
        onChange={setSelectedMood}
      />

      {/* Results */}
      {filteredSoundtracks.length === 0 ? (
        <div
          ref={emptyRef}
          tabIndex={-1}
          role="status"
          aria-live="polite"
          className="mt-12 text-center text-gray-400 outline-none"
        >
          <p className="text-lg font-medium">
            No soundtracks match this mood.
          </p>
          <p className="mt-2 text-sm">
            Try selecting a different mood.
          </p>
        </div>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSoundtracks.map((soundtrack) => (
            <Link
              key={soundtrack._id}
              href={`/soundtrack/${soundtrack._id}`}
              className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-xl"
            >
              <SoundtrackCard soundtrack={soundtrack} />
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}
