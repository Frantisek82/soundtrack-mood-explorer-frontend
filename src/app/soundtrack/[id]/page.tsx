"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import SoundtrackCard from "@/src/components/SoundtrackCard";
import Button from "@/src/components/Button";
import {
  addFavorite,
  removeFavorite,
  isFavorite,
} from "@/src/services/favorites";
import { getSoundtrackById } from "@/src/services/soundtracks";
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

export default function SoundtrackDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [soundtrack, setSoundtrack] =
    useState<Soundtrack | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFav, setIsFav] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [authMessage, setAuthMessage] =
    useState<string | null>(null);

  const authRef = useRef<HTMLParagraphElement>(null);

  /* Load soundtrack */
  useEffect(() => {
    async function loadSoundtrack() {
      try {
        const data = await getSoundtrackById(id);
        setSoundtrack(data);

        // Safe favorites check
        try {
          const fav = await isFavorite(data._id);
          setIsFav(fav);
        } catch {
          setIsFav(false);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load soundtrack");
      } finally {
        setLoading(false);
      }
    }

    loadSoundtrack();
  }, [id]);

  /* Focus auth message when shown */
  useEffect(() => {
    if (authMessage) {
      authRef.current?.focus();
    }
  }, [authMessage]);

  /* Toggle favorites */
  async function toggleFavorite() {
    if (!soundtrack) return;

    if (!isAuthenticated()) {
      setAuthMessage(
        "You need to be logged in to save favorites."
      );
      return;
    }

    setAuthMessage(null);
    setFavLoading(true);

    try {
      if (isFav) {
        await removeFavorite(soundtrack._id);
        setIsFav(false);
      } else {
        await addFavorite(soundtrack._id);
        setIsFav(true);
      }
    } catch {
      setAuthMessage(
        "Something went wrong. Please try again."
      );
    } finally {
      setFavLoading(false);
    }
  }

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
        Loading soundtrack…
      </div>
    );
  }

  if (error || !soundtrack) {
    return (
      <div
        role="alert"
        className="p-8 text-center text-red-400"
      >
        {error || "Soundtrack not found"}
      </div>
    );
  }

  /* =====================
     UI
  ===================== */

  return (
    <main className="max-w-3xl mx-auto p-8 space-y-8">
      {/* Unified card */}
      <SoundtrackCard soundtrack={soundtrack} />

      {/* Favorite action */}
      <section>
        <Button
          onClick={toggleFavorite}
          disabled={favLoading}
          aria-disabled={favLoading}
          variant={isFav ? "danger" : "primary"}
        >
          {isFav
            ? "Remove from Favorites"
            : "Save to Favorites"}
        </Button>

        {/* Auth / error message */}
        {authMessage && (
          <p
            ref={authRef}
            tabIndex={-1}
            role="alert"
            className="mt-2 text-sm text-red-400 outline-none"
          >
            {authMessage}{" "}
            {!isAuthenticated() && (
              <Link
                href="/login"
                className="underline hover:text-red-300"
              >
                Login
              </Link>
            )}
          </p>
        )}
      </section>

      {/* Spotify preview */}
      <section className="pt-6 border-t border-zinc-800">
        <h3 className="text-sm uppercase tracking-wide text-gray-400 mb-3">
          Spotify Preview
        </h3>

        {soundtrack.spotifyTrackId ? (
          <iframe
            src={`https://open.spotify.com/embed/track/${soundtrack.spotifyTrackId}`}
            width="100%"
            height="80"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="rounded-lg border-none"
            title={`Spotify preview for ${soundtrack.title}`}
          />
        ) : (
          <p
            role="status"
            aria-live="polite"
            className="text-sm text-gray-400"
          >
            Spotify preview is not available for this soundtrack.
          </p>
        )}
      </section>
    </main>
  );
}
