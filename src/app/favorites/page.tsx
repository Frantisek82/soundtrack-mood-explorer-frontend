"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import SoundtrackCardSkeleton from "@/src/components/SoundtrackCardSkeleton";
import Button from "@/src/components/Button";
import EmptyState from "@/src/components/EmptyState";
import { StarIcon } from "@heroicons/react/24/outline";
import { getFavorites, removeFavorite } from "@/src/services/favorites";
import { isAuthenticated } from "@/src/utils/auth";
import type { Soundtrack } from "@/src/types/soundtrack";
import SpotifyPreview from "@/src/components/SpotifyPreview";

export default function FavoritesPage() {
  const router = useRouter();

  const [favorites, setFavorites] = useState<Soundtrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removeError, setRemoveError] = useState("");

  // Auth state
  const [authChecked, setAuthChecked] = useState(false);

  // Track which item is being removed
  const [removingId, setRemovingId] = useState<string | null>(null);

  const emptyStateRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

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
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load favorites",
        );
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
    if (loading) return;

    if (favorites.length === 0) {
      emptyStateRef.current?.focus();
    } else {
      headingRef.current?.focus();
    }
  }, [loading, favorites.length]);

  /* =====================
     Remove favorite
  ===================== */
  async function handleRemove(id: string) {
    try {
      setRemovingId(id);
      setRemoveError("");

      await removeFavorite(id);

      setFavorites((prev) => prev.filter((s) => s._id !== id));
      setRemoveError("");
    } catch {
      setRemoveError("Failed to remove favorite. Please try again.");
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
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="text-3xl font-semibold mb-2 focus:outline-none"
        >
          Your Favorites
        </h1>
        <p className="text-gray-400">Soundtracks you’ve saved for later</p>
      </header>

      {removeError && (
        <p
          role="alert"
          className="rounded-lg border border-red-900 bg-red-950/50 px-4 py-3 text-sm text-red-300"
        >
          {removeError}
        </p>
      )}

      {/* Content */}
      {favorites.length === 0 ? (
        <EmptyState
          ref={emptyStateRef}
          icon={StarIcon}
          title="No favorites yet"
          description="Start exploring soundtracks and save your favorites here."
          buttonText="Explore Soundtracks"
          buttonHref="/explore"
        />
      ) : (
        <div className="grid gap-4">
          {favorites.map((soundtrack) => (
            <div
              key={soundtrack._id}
              className="rounded-lg border border-zinc-800 bg-zinc-900 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <Link
                  href={`/soundtrack/${soundtrack._id}`}
                  className="min-w-0 flex-1 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      {soundtrack.title}
                    </h2>

                    <p className="mt-1 text-sm text-gray-300">
                      {soundtrack.movie}
                    </p>

                    <p className="mt-1 text-sm text-gray-400">
                      {soundtrack.composer}
                    </p>

                    {soundtrack.moods.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {soundtrack.moods.map((mood) => (
                          <span
                            key={mood}
                            className="rounded-full border border-zinc-700 px-2 py-1 text-xs text-gray-300"
                          >
                            {mood}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>

                <Button
                  variant="danger"
                  loading={removingId === soundtrack._id}
                  onClick={() => handleRemove(soundtrack._id)}
                >
                  Remove
                </Button>
              </div>

              {soundtrack.spotifyTrackId && (
                <div className="mt-4 border-t border-zinc-800 pt-4">
                  <SpotifyPreview
                    trackId={soundtrack.spotifyTrackId}
                    title={soundtrack.title}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
