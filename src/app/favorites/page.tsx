"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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

  /**
   * Redirect if not authenticated
   */
  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    async function loadFavorites() {
      const data = await getFavorites();
      setFavorites(data);
      setLoading(false);
    }

    loadFavorites();
  }, [router]);

  async function handleRemove(soundtrackId: string) {
    await removeFavorite(soundtrackId);

    // 🔁 Update local state immediately
    setFavorites((prev) =>
      prev.filter(
        (fav) => fav.soundtrackId._id !== soundtrackId
      )
    );
  }

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-12">
        <p className="text-gray-400">Loading favorites...</p>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-2">
        Your Favorites
      </h1>

      {favorites.length === 0 ? (
        <p className="text-gray-400">
          You don’t have any favorites yet.
        </p>
      
      ) : (
        <ul className="space-y-6">
          {favorites.map((fav) => (
            <li
              key={fav._id}
              className="flow-root bg-zinc-900 p-4 rounded-xl 
           hover:bg-zinc-700 
           hover:-translate-y-1 
           transition-all duration-200"
            >
              <div>
                <Link
                  href={`/soundtrack/${fav.soundtrackId._id}`}
                  className="text-lg font-semibold hover:underline"
                >
                  {fav.soundtrackId.title}
                </Link>
                <p className="text-gray-400 text-sm">
                  {fav.soundtrackId.movie} •{" "}
                  {fav.soundtrackId.composer}
                </p>
              </div>

              <button
                onClick={() =>
                  handleRemove(fav.soundtrackId._id)
                }
                className="float-right px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}