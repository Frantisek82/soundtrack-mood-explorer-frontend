"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import SoundtrackCard from "@/src/components/SoundtrackCard";
import SoundtrackCardSkeleton from "@/src/components/SoundtrackCardSkeleton";
import { getFavorites } from "@/src/services/favorites";

type Soundtrack = {
  _id: string;
  title: string;
  movie: string;
  composer: string;
  moods: string[];
  spotifyTrackId?: string;
};

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Soundtrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const headingRef = useRef<HTMLHeadingElement>(null);

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

  // 🎯 Focus heading after load
  useEffect(() => {
    if (!loading && headingRef.current) {
      headingRef.current.focus();
    }
  }, [loading]);

  if (loading) {
    return (
      <main className="max-w-6xl mx-auto p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <SoundtrackCardSkeleton />
            </div>
          ))}
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-8 text-center text-red-400" role="alert">
        {error}
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto p-8 space-y-8">
      {/* Header */}
      <header>
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="text-3xl font-semibold mb-2 focus:outline-none"
        >
          Your Favorites
        </h1>
        <p className="text-gray-400">
          Soundtracks you’ve saved for later
        </p>
      </header>

      {/* Content */}
      {favorites.length === 0 ? (
        <p
          role="status"
          aria-live="polite"
          className="text-center text-gray-400 mt-12"
        >
          You haven’t added any favorites yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((soundtrack) => (
            <Link
              key={soundtrack._id}
              href={`/soundtrack/${soundtrack._id}`}
            >
              <SoundtrackCard soundtrack={soundtrack} />
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
