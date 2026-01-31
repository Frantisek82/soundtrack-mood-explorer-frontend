"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { isAuthenticated } from "@/src/utils/auth";
import {
  addFavorite,
  removeFavorite,
  isFavorite,
} from "@/src/services/favorites";

type Soundtrack = {
  _id: string;
  title: string;
  movie: string;
  composer: string;
  year?: number;
  description?: string;
  mood?: string[];
};

export default function SoundtrackDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [soundtrack, setSoundtrack] = useState<Soundtrack | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFav, setIsFav] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  /**
   * Fetch soundtrack details
   */
  useEffect(() => {
    async function fetchSoundtrack() {
      try {
        const res = await fetch(
          `http://localhost:3000/api/soundtracks/${id}`
        );

        if (!res.ok) {
          throw new Error("Soundtrack not found");
        }

        const data = await res.json();
        setSoundtrack(data);
      } catch {
        setError("Soundtrack not found");
      } finally {
        setLoading(false);
      }
    }

    fetchSoundtrack();
  }, [id]);

  /**
   * Check favorite status
   * (only when logged in)
   */
  useEffect(() => {
    if (!soundtrack || !isAuthenticated()) return;

    async function checkFavorite(soundtrackId: string) {
  const fav = await isFavorite(soundtrackId);
  setIsFav(fav);
}


    checkFavorite(soundtrack._id);
  }, [soundtrack]);

  /**
   * Add / remove favorite
   */
  async function handleFavorite() {
    if (!soundtrack) return;

    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    try {
      setFavLoading(true);

      if (isFav) {
        await removeFavorite(soundtrack._id);
        setIsFav(false);
      } else {
        await addFavorite(soundtrack._id);
        setIsFav(true);
      }
    } catch (err: any) {
      alert(err.message || "Action failed");
    } finally {
      setFavLoading(false);
    }
  }

  /* ---------- Render states ---------- */

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-12">
        <p className="text-gray-400">Loading soundtrack...</p>
      </main>
    );
  }

  if (error || !soundtrack) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-12">
        <p className="text-red-400">{error}</p>
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
          {soundtrack.year && ` • ${soundtrack.year}`}
        </p>
      </header>

      {/* Description */}
      {soundtrack.description && (
        <p className="mb-6 text-gray-300">
          {soundtrack.description}
        </p>
      )}

      {/* Mood tags */}
      {Array.isArray(soundtrack.mood) && soundtrack.mood.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {soundtrack.mood.map((mood) => (
            <span
              key={mood}
              className="px-3 py-1 text-sm rounded-full bg-zinc-800"
            >
              {mood}
            </span>
          ))}
        </div>
      )}

      {/* Favorite action */}
      {isAuthenticated() ? (
        <button
          onClick={handleFavorite}
          disabled={favLoading}
          className={`px-6 py-3 rounded-lg font-medium transition
            ${
              isFav
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-white hover:bg-gray-200 text-black"
            }
            ${favLoading ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          {favLoading
            ? "Saving..."
            : isFav
            ? "Remove from Favorites"
            : "Add to Favorites"}
        </button>
      ) : (
        <p className="text-gray-400 text-sm">
          Login to add this soundtrack to your favorites
        </p>
      )}
    </main>
  );
}