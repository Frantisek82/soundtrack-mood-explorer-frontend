"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Spinner from "@/src/components/Spinner";
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

  // ✅ Spotify fallback state
  const [spotifyLoaded, setSpotifyLoaded] = useState(false);
  const [spotifyError, setSpotifyError] = useState(false);

  const errorRef = useRef<HTMLDivElement>(null);
  const authRef = useRef<HTMLParagraphElement>(null);

  const loggedIn = isAuthenticated();

  /* =====================
     Load soundtrack
  ===================== */
  useEffect(() => {
    async function loadSoundtrack() {
      try {
        const data = await getSoundtrackById(id);
        setSoundtrack(data);

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

  /* =====================
     Spotify fallback logic
  ===================== */
  useEffect(() => {
    if (!soundtrack?.spotifyTrackId) return;

    const timeout = setTimeout(() => {
      if (!spotifyLoaded) {
        setSpotifyError(true);
      }
    }, 4000); // wait 4 seconds

    return () => clearTimeout(timeout);
  }, [spotifyLoaded, soundtrack?.spotifyTrackId]);

  /* =====================
     Focus management
  ===================== */
  useEffect(() => {
    if (error) {
      errorRef.current?.focus();
    }
  }, [error]);

  useEffect(() => {
    if (authMessage) {
      authRef.current?.focus();
    }
  }, [authMessage]);

  /* =====================
     Toggle favorites
  ===================== */
  async function toggleFavorite() {
    if (!soundtrack) return;

    if (!loggedIn) {
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
        className="p-12 flex justify-center"
        role="status"
        aria-live="polite"
      >
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !soundtrack) {
    return (
      <div
        ref={errorRef}
        tabIndex={-1}
        role="alert"
        className="p-8 text-center text-red-400 outline-none"
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
      <SoundtrackCard soundtrack={soundtrack} />

      {/* Favorite action */}
      <section>
        <Button
          onClick={toggleFavorite}
          loading={favLoading}
          variant={isFav ? "danger" : "primary"}
          aria-disabled={favLoading}
        >
          {isFav ? "Remove from Favorites" : "Save to Favorites"}
        </Button>

        {authMessage && (
          <p
            ref={authRef}
            tabIndex={-1}
            role="status"
            aria-live="polite"
            className="mt-2 text-sm text-red-400 outline-none"
          >
            {authMessage}{" "}
            {!loggedIn && (
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
          <>
            {!spotifyError && (
              <iframe
                src={`https://open.spotify.com/embed/track/${soundtrack.spotifyTrackId}`}
                width="100%"
                height="80"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="rounded-lg border-none"
                title={`Spotify preview for ${soundtrack.title}`}
                onLoad={() => setSpotifyLoaded(true)}
              />
            )}

            {spotifyError && (
              <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 text-sm text-gray-400">
                <p className="mb-2">
                  Spotify preview is unavailable on your current network.
                </p>
                <a
                  href={`https://open.spotify.com/track/${soundtrack.spotifyTrackId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white underline hover:text-gray-300 transition"
                >
                  Open in Spotify →
                </a>
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-gray-400">
            Spotify preview is not available for this soundtrack.
          </p>
        )}
      </section>
    </main>
  );
}
