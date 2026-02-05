"use client";

import { useEffect, useState } from "react";
import SoundtrackCard from "@/src/components/SoundtrackCard";
import {
  getFavorites,
  removeFavorite,
  Soundtrack,
} from "@/src/services/favorites";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Soundtrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadFavorites() {
      try {
        const data = await getFavorites();
        setFavorites(data);
      } catch (err: any) {
        setError(err.message || "Failed to load favorites");
      } finally {
        setLoading(false);
      }
    }

    loadFavorites();
  }, []);

  async function handleRemove(soundtrackId: string) {
    try {
      await removeFavorite(soundtrackId);
      setFavorites((prev) =>
        prev.filter((s) => s._id !== soundtrackId)
      );
    } catch (err: any) {
      alert(err.message || "Failed to remove favorite");
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-400">
        Loading favorites…
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
          Your Favorites
        </h1>
        <p className="text-gray-400">
          Soundtracks you’ve saved for later
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center text-gray-400 mt-12">
          You haven’t added any favorites yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((soundtrack) => (
            <div key={soundtrack._id} className="relative">
              <SoundtrackCard
                soundtrack={soundtrack}
                href={`/soundtrack/${soundtrack._id}`}
              />

              {/* Remove button */}
              <button
                onClick={() => handleRemove(soundtrack._id)}
                className="absolute top-3 right-3 text-xs text-red-400 hover:text-red-300 bg-black/70 px-2 py-1 rounded"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
