"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import Spinner from "@/src/components/Spinner";
import Button from "@/src/components/Button";
import SoundtrackCard from "@/src/components/SoundtrackCard";
import SpotifyPreview from "@/src/components/SpotifyPreview";

import { addSoundtrackToPlaylist, getPlaylists } from "@/src/lib/playlists";

import {
  addFavorite,
  removeFavorite,
  isFavorite,
} from "@/src/services/favorites";
import { getSoundtrackById } from "@/src/services/soundtracks";

import type { Soundtrack } from "@/src/types/soundtrack";
import type { Playlist } from "@/src/types/playlist";

import { isAuthenticated } from "@/src/utils/auth";

/* =====================
   Page
===================== */

export default function SoundtrackDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [soundtrack, setSoundtrack] = useState<Soundtrack | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFav, setIsFav] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState<string | null>(null);

  // NEW: auth state
  const [loggedIn, setLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState("");
  const [playlistLoading, setPlaylistLoading] = useState(false);
  const [playlistMessage, setPlaylistMessage] = useState("");

  const errorRef = useRef<HTMLDivElement>(null);
  const authRef = useRef<HTMLParagraphElement>(null);

  /* =====================
     Check authentication
  ===================== */

  useEffect(() => {
    async function checkAuth() {
      const isAuth = await isAuthenticated();
      setLoggedIn(isAuth);
      setAuthChecked(true);
    }

    checkAuth();
  }, []);

  useEffect(() => {
    async function loadPlaylists() {
      if (!loggedIn) return;

      try {
        const data = await getPlaylists();
        setPlaylists(data);
      } catch {
        setPlaylistMessage("Failed to load playlists.");
      }
    }

    loadPlaylists();
  }, [loggedIn]);

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
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Failed to load soundtrack",
        );
      } finally {
        setLoading(false);
      }
    }

    loadSoundtrack();
  }, [id]);

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
      setAuthMessage("You need to be logged in to save favorites.");
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
      setAuthMessage("Something went wrong. Please try again.");
    } finally {
      setFavLoading(false);
    }
  }

  async function handleAddToPlaylist() {
    if (!soundtrack || !selectedPlaylistId) return;

    try {
      setPlaylistLoading(true);
      setPlaylistMessage("");

      await addSoundtrackToPlaylist(selectedPlaylistId, soundtrack._id);

      setPlaylistMessage("Soundtrack added to playlist.");
    } catch (error: unknown) {
      setPlaylistMessage(
        error instanceof Error
          ? error.message
          : "Failed to add soundtrack to playlist.",
      );
    } finally {
      setPlaylistLoading(false);
    }
  }

  /* =====================
     States
  ===================== */

  if (loading || !authChecked) {
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
    <main className="mx-auto max-w-3xl p-8 space-y-8">
      {/* Unified card */}
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
              <Link href="/login" className="underline hover:text-red-300">
                Login
              </Link>
            )}
          </p>
        )}
      </section>

      {/* Playlist action */}
      {loggedIn && (
        <section className="space-y-3">
          <h2 className="text-lg font-medium">Add to Playlist</h2>

          {playlists.length === 0 ? (
            <p className="text-sm text-gray-400">
              You do not have any playlists yet.{" "}
              <Link href="/playlists" className="underline hover:text-gray-200">
                Create a playlist
              </Link>
            </p>
          ) : (
            <>
              <label htmlFor="playlist" className="block text-sm text-gray-400">
                Choose a playlist
              </label>

              <select
                id="playlist"
                value={selectedPlaylistId}
                disabled={playlistLoading}
                onChange={(event) => {
                  setSelectedPlaylistId(event.target.value);
                  setPlaylistMessage("");
                }}
                className="min-h-11 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select a playlist</option>

                {playlists.map((playlist) => (
                  <option key={playlist._id} value={playlist._id}>
                    {playlist.name}
                  </option>
                ))}
              </select>

              <Button
                type="button"
                onClick={handleAddToPlaylist}
                loading={playlistLoading}
                disabled={!selectedPlaylistId || playlistLoading}
              >
                Add to Playlist
              </Button>
            </>
          )}

          {playlistMessage && (
            <p
              role="status"
              aria-live="polite"
              className="text-sm text-gray-300"
            >
              {playlistMessage}
            </p>
          )}
        </section>
      )}

      {/* Spotify Preview */}
      <section className="pt-6 border-t border-zinc-800">
        <h3 className="text-sm uppercase tracking-wide text-gray-400 mb-3">
          Spotify Preview
        </h3>

        <SpotifyPreview
          trackId={soundtrack.spotifyTrackId}
          title={soundtrack.title}
        />
      </section>
    </main>
  );
}
