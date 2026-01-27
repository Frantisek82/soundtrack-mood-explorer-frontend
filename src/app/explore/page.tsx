"use client";

import { useEffect, useState } from "react";
import MoodSelector from "@/src/components/MoodSelector";
import SoundtrackCard from "@/src/components/SoundtrackCard";
import { getSoundtracks } from "@/src/services/soundtracks";

type Soundtrack = {
  id: string;
  title: string;
  movie: string;
  composer: string;
  mood: string;
};

export default function ExplorePage() {
  const [mood, setMood] = useState<string | null>(null);
  const [soundtracks, setSoundtracks] = useState<Soundtrack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  let isMounted = true;

  async function loadSoundtracks() {
    setLoading(true);
    try {
      const data = await getSoundtracks(mood || undefined);
      if (isMounted) {
        setSoundtracks(data);
      }
    } catch (error) {
      console.error("Failed to load soundtracks:", error);
      if (isMounted) {
        setSoundtracks([]);
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  }

  loadSoundtracks();

  return () => {
    isMounted = false;
  };
}, [mood]);

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl font-bold mb-2">
          Explore Soundtracks
        </h1>
        <p className="text-gray-400">
          Discover movie and game soundtracks by emotion.
        </p>
      </header>

      {/* Mood Selector */}
      <MoodSelector selected={mood} onSelect={setMood} />

      {/* Content */}
      {loading ? (
        <p className="text-gray-400">Loading soundtracks...</p>
      ) : soundtracks.length === 0 ? (
        <p className="text-gray-400">
          No soundtracks found for this mood.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {soundtracks.map((track) => (
            <SoundtrackCard
              key={track.id}
              id={track.id}
              title={track.title}
              movie={track.movie}
              composer={track.composer}
            />
          ))}
        </div>
      )}
    </main>
  );
}
