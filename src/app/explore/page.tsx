"use client";

import { useEffect, useState } from "react";
import SoundtrackCard from "@/src/components/SoundtrackCard";
import { getSoundtracks } from "@/src/services/soundtracks";

type Soundtrack = {
  _id: string;
  title: string;
  movie: string;
  composer: string;
  moods: string[];
};

function SoundtrackSkeleton() {
  return (
    <div className="bg-zinc-900 p-4 rounded-xl animate-pulse">
      <div className="h-4 bg-zinc-700 rounded w-3/4 mb-2" />
      <div className="h-3 bg-zinc-700 rounded w-1/2 mb-1" />
      <div className="h-3 bg-zinc-700 rounded w-1/3" />
    </div>
  );
}

export default function ExplorePage() {
  const [soundtracks, setSoundtracks] = useState<Soundtrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadSoundtracks() {
      setLoading(true);
      setError(null);

      try {
        const data = await getSoundtracks();
        if (mounted) {
          setSoundtracks(data);
        }
      } catch (err) {
        console.error("Failed to load soundtracks:", err);
        if (mounted) {
          setError("Failed to load soundtracks. Please try again.");
          setSoundtracks([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadSoundtracks();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      {/* Page Header */}
      <header className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Explore Soundtracks</h1>
        <p className="text-gray-400">
          Discover iconic movie soundtracks and explore their moods.
        </p>
      </header>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SoundtrackSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <p className="text-red-400">{error}</p>
      )}

      {/* Empty State */}
      {!loading && !error && soundtracks.length === 0 && (
        <p className="text-gray-400">No soundtracks found.</p>
      )}

      {/* Soundtrack Grid */}
      {!loading && !error && soundtracks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {soundtracks.map((track) => (
            <SoundtrackCard
              key={track._id}
              _id={track._id}
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
