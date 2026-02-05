"use client";

import { useEffect, useState } from "react";
import SoundtrackCard from "@/src/components/SoundtrackCard";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const filteredSoundtracks = selectedMood
    ? soundtracks.filter(
        (s) => Array.isArray(s.moods) && s.moods.includes(selectedMood)
      )
    : soundtracks;

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-400">
        Loading soundtracks…
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold mb-2">
          Explore Soundtracks
        </h1>
        <p className="text-gray-400">
          Discover movie soundtracks by mood
        </p>
      </div>

      {/* Mood selector */}
      <MoodSelector
        selectedMood={selectedMood}
        onChange={setSelectedMood}
      />

      {/* Results */}
      {filteredSoundtracks.length === 0 ? (
        <div className="text-center text-gray-400 mt-12">
          No soundtracks match this mood.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSoundtracks.map((soundtrack) => (
            <SoundtrackCard
              key={soundtrack._id}
              soundtrack={soundtrack}
              href={`/soundtrack/${soundtrack._id}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
