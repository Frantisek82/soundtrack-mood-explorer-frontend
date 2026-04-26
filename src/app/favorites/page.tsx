"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import SoundtrackCard from "@/src/components/SoundtrackCard";
import SoundtrackCardSkeleton from "@/src/components/SoundtrackCardSkeleton";
import Button from "@/src/components/Button";

import {
  getFavorites,
  removeFavorite,
} from "@/src/services/favorites";
import { isAuthenticated } from "@/src/utils/auth";

type Soundtrack = {
  _id: string;
  title: string;
  movie: string;
  composer: string;
  moods: string[];
  spotifyTrackId?: string;
};

export default function FavoritesPage() {
  const router = useRouter();

  const [favorites, setFavorites] = useState<Soundtrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Auth state
  const [authChecked, setAuthChecked] = useState(false);

  // NEW: track which item is being removed
  const [removingId, setRemovingId] = useState<string | null>(null);

  const emptyStateRef = useRef<HTMLParagraphElement>(null);

  /* =====================
     Auth check
  ===================== */
  useEffect(() => {
    async function checkAuth() {
      const isAuth = await isAuthenticated();

      if (!isAuth) {
        router.push("/login");
        return;
      }

      setAuthChecked(true);
    }

    checkAuth();
  }, [router]);

  /* =====================
     Load favorites
  ===================== */
  useEffect(() => {
    if (!authChecked) return;

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
  }, [authChecked]);

  /* =====================
     Focus empty state
  ===================== */
  useEffect(() => {
    if (!loading && favorites.length === 0) {
      emptyStateRef.current?.focus();
    }
  }, [loading, favorites]);

  /* =====================
     Remove favorite
  ===================== */
  async function handleRemove(id: string) {
    try {
      setRemovingId(id);

      await removeFavorite(id);

      setFavorites((prev) =>
        prev.filter((s) => s._id !== id)
      );
    } catch {
      alert("Failed to remove favorite");
    } finally {
      setRemovingId(null);
    }
  }

  /* =====================
     Loading state
  ===================== */
  if (!authChecked || loading) {
    return (
      <main className="max-w-6xl mx-auto p-8" aria-busy="true">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ animationDelay: `${i * 100}ms` }}>
              <SoundtrackCardSkeleton />
            </div>
          ))}
        </div>
      </main>
    );
  }

  /* =====================
     Error state
  ===================== */
  if (error) {
    return (
      <main className="p-8 text-center text-red-400" role="alert">
        {error}
      </main>
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
          Soundtracks you’ve saved for later
        </p>
      </header>

      {/* Content */}
      {favorites.length === 0 ? (
        <p
          ref={emptyStateRef}
          tabIndex={-1}
          role="status"
          aria-live="polite"
          className="text-center text-gray-400 mt-12 outline-none"
        >
          You haven’t added any favorites yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((soundtrack) => (
            <div key={soundtrack._id} className="space-y-3">
              <Link
                href={`/soundtrack/${soundtrack._id}`}
                className="block focus:outline-none focus:ring-2 focus:ring-white/60 rounded-xl"
              >
                <SoundtrackCard soundtrack={soundtrack} />
              </Link>

              {/* Styled remove button */}
              <div className="flex justify-end">
                <Button
                  variant="danger"
                  loading={removingId === soundtrack._id}
                  onClick={() => handleRemove(soundtrack._id)}
                >
                  Remove from Favorites
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}