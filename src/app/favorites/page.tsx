"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import SoundtrackCard from "@/src/components/SoundtrackCard";
import { getFavorites } from "@/src/services/favorites";
import { isAuthenticated } from "@/src/utils/auth";

/* =====================
   Types
===================== */

type Soundtrack = {
  _id: string;
  title: string;
  movie: string;
  composer: string;
  moods: string[];
  spotifyTrackId?: string;
};

/* =====================
   Page
===================== */

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Soundtrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const emptyRef = useRef<HTMLDivElement>(null);

  /* Load favorites */
  useEffect(() => {
    async function loadFavorites() {
      if (!isAuthenticated()) {
        setLoading(false);
        return;
      }

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

  /* Focus empty state */
  useEffect(() => {
    if (!loading && favorites.length === 0) {
      emptyRef.current?.focus();
    }
  }, [loading, favorites.length]);

  /* =====================
     States
  ===================== */

  if (loading) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="p-8 text-center text-gray-400"
      >
        Loading favorites…
      </div>
    );
  }

  if (!isAuthenticated()) {
    return (
      <div
        ref={emptyRef}
        tabIndex={-1}
        role="alert"
        className="p-8 text-center text-red-400 outline-none"
      >
        <p className="text-lg font-medium">
          You need to be logged in to view favorites.
        </p>
        <Link
          href="/login"
          className="inline-block mt-4 underline text-white"
        >
          Login
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="p-8 text-center text-red-400"
      >
        {error}
      </div>
    );
  }

  /* =====================
     UI
  ===================== */

  return (
    <main className="max-w-6xl mx-auto p-8 space-y-8">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-semibold mb-2">
          Your Favorites
        </h1>
        <p className="text-gray-400">
          Soundtracks you’ve saved for later.
        </p>
      </header>

      {/* Results */}
      {favorites.length === 0 ? (
        <div
          ref={emptyRef}
          tabIndex={-1}
          role="status"
          aria-live="polite"
          className="mt-12 text-center text-gray-400 outline-none"
        >
          <p className="text-lg font-medium">
            You don’t have any favorites yet.
          </p>
          <p className="mt-2 text-sm">
            Browse soundtracks and save the ones you love.
          </p>

          <Link
            href="/explore"
            className="inline-block mt-4 underline text-white"
          >
            Explore soundtracks
          </Link>
        </div>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((soundtrack) => (
            <Link
              key={soundtrack._id}
              href={`/soundtrack/${soundtrack._id}`}
              className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-xl"
            >
              <SoundtrackCard soundtrack={soundtrack} />
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}
