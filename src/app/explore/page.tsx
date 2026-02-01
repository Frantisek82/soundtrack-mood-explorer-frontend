"use client";

import { useEffect, useState } from "react";
import { getSoundtracks } from "@/src/services/soundtracks";
import SoundtrackCard from "@/src/components/SoundtrackCard";
import MoodSelector from "@/src/components/MoodSelector";

type Soundtrack = {
  _id: string;
  title: string;
  artist: string;
  coverUrl?: string;
  mood?: string[]; // mood is optional (defensive)
};

export default function ExplorePage() {
  const [soundtracks, setSoundtracks] = useState<Soundtrack[]>([]);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  /* -----------------------------
     Extract unique moods safely
  ----------------------------- */
  const allMoods = Array.from(
    new Set(
      soundtracks.flatMap((s) =>
        Array.isArray(s.mood) ? s.mood : []
      )
    )
  );

  /* -----------------------------
     Filter by selected mood
  ----------------------------- */
  const filteredSoundtracks = selectedMood
    ? soundtracks.filter(
        (s) =>
          Array.isArray(s.mood) &&
          s.mood.includes(selectedMood)
      )
    : soundtracks;

  /* -----------------------------
     UI states
  ----------------------------- */
  if (loading) {
    return (
      <p className="text-center mt-12 text-gray-400">
        Loading soundtracks...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center mt-12 text-red-400">
        {error}
      </p>
    );
  }

  return (
    <main className="px-6 py-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">
        Explore Soundtracks
      </h1>

      <p className="text-gray-400 mb-6">
        Discover music by mood
      </p>

      {/* Mood selector */}
      <MoodSelector
        moods={allMoods}
        selectedMood={selectedMood}
        onChange={setSelectedMood}
      />

      {/* Empty state */}
      {filteredSoundtracks.length === 0 && (
        <p className="text-gray-400 mt-10">
          No soundtracks match this mood.
        </p>
      )}

      {/* Soundtracks grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSoundtracks.map((soundtrack) => (
          <SoundtrackCard
            key={soundtrack._id}
            soundtrack={soundtrack}
          />
        ))}
      </div>
    </main>
  );
}
