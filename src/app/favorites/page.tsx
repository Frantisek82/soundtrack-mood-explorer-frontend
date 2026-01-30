"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SoundtrackCard from "@/src/components/SoundtrackCard";
import { getFavorites, removeFavorite } from "@/src/services/favorites";
import { isAuthenticated } from "@/src/utils/auth";

type Favorite = {
  _id: string;
  soundtrackId: {
    _id: string;
    title: string;
    movie: string;
    composer: string;
  };
};

export default function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔐 Protect page
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    async function loadFavorites() {
      try {
        const data = await getFavorites();
        setFavorites(data);
      } catch (error) {
        console.error("Failed to load favorites:", error);
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    }

    loadFavorites();
  }, [router]);

  if (loading) {
    return (
      <main className="p-6">
        <p className="text-gray-400">Loading favorites...</p>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Your Favorites</h1>

      {favorites.length === 0 ? (
        <p className="text-gray-400">You haven’t added any favorites yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {favorites.map((fav) => (
            <div key={fav._id} className="relative">
              <SoundtrackCard
                _id={fav.soundtrackId._id}
                title={fav.soundtrackId.title}
                movie={fav.soundtrackId.movie}
                composer={fav.soundtrackId.composer}
              />

              <button
                onClick={async () => {
                  try {
                    await removeFavorite(fav.soundtrackId._id);
                    setFavorites((prev) =>
                      prev.filter((f) => f._id !== fav._id)
                    );
                  } catch (error) {
                    alert("Failed to remove favorite");
                  }
                }}
                className="absolute top-3 right-3 text-xs text-red-400 hover:text-red-300"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
