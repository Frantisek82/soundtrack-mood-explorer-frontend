"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getSoundtrackById } from "@/src/services/soundtracks";
import { addFavorite, isFavorite } from "@/src/services/favorites";
import MoodTag from "@/src/components/MoodTag";

type Soundtrack = {
  _id: string;
  title: string;
  movie: string;
  composer: string;
  moods: string[];
  previewUrl?: string;
};

export default function SoundtrackDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [soundtrack, setSoundtrack] = useState<Soundtrack | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorited, setFavorited] = useState(false);


  useEffect(() => {
    if (!id) return;

    getSoundtrackById(id).then((data) => {
      setSoundtrack(data || null);
      setLoading(false);
    });
    async function checkFavorite() {
      if (soundtrack?._id) {
        const exists = await isFavorite(soundtrack._id);
        setFavorited(exists);
      }
    }

    checkFavorite();
  }, [id, soundtrack]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading soundtrack...</p>
      </main>
    );
  }

  if (!soundtrack) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Soundtrack not found.</p>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {soundtrack.title}
        </h1>
        <p className="text-gray-400">
          {soundtrack.movie} • {soundtrack.composer}
        </p>
      </header>

      {/* Audio Preview */}
      <section className="mb-8">
        <div className="bg-zinc-900 rounded-xl p-6 text-center text-gray-400">
          Audio preview coming soon
        </div>
      </section>

      {/* Mood Tags */}
      <section className="flex gap-2 mb-8 flex-wrap">
        {soundtrack.moods.map((m) => (
          <MoodTag key={m} label={m} />
        ))}
      </section>

      {/* Actions */}
      <section className="flex gap-4">
        <button
          disabled={favorited}
          onClick={async () => {
            try {
              await addFavorite(soundtrack._id);
              setFavorited(true);
            } catch (error: any) {
              alert(error.message || "Failed to add favorite");
            }
          }}
          className={`px-6 py-3 rounded-lg font-medium transition ${favorited
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-white text-black hover:bg-gray-200"
            }`}
        >
          {favorited ? "Favorited ❤️" : "Add to Favorites"}
        </button>


        <button className="px-6 py-3 rounded-lg border border-zinc-700">
          Add to Playlist
        </button>
      </section>
    </main>
  );
}
