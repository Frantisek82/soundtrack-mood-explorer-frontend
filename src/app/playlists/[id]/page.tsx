"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { MusicalNoteIcon } from "@heroicons/react/24/outline";

import Spinner from "@/src/components/Spinner";
import Button from "@/src/components/Button";
import SpotifyPreview from "@/src/components/SpotifyPreview";
import EmptyState from "@/src/components/EmptyState";

import { getPlaylist, removeSoundtrackFromPlaylist } from "@/src/lib/playlists";

import type { Playlist } from "@/src/types/playlist";
import type { Soundtrack } from "@/src/types/soundtrack";

export default function PlaylistPage() {
  const params = useParams<{ id: string }>();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [removeError, setRemoveError] = useState("");

  useEffect(() => {
    async function loadPlaylist() {
      try {
        setLoading(true);
        setError("");

        const data = await getPlaylist(params.id);

        setPlaylist(data);
        setRemoveError("");
      } catch {
        setError("Failed to load playlist.");
      } finally {
        setLoading(false);
      }
    }

    loadPlaylist();
  }, [params.id]);

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </main>
    );
  }

  if (error || !playlist) {
    return (
      <main className="mx-auto max-w-6xl p-8 space-y-8">
        <p className="text-center text-red-500">
          {error || "Playlist not found."}
        </p>
      </main>
    );
  }

  const soundtrackCount = playlist.soundtracks.length;

  const soundtracks = playlist.soundtracks.filter(
    (soundtrack): soundtrack is Soundtrack => typeof soundtrack !== "string",
  );

  const hasUnpopulatedSoundtracks =
    soundtrackCount > 0 && soundtracks.length === 0;

  async function handleRemoveSoundtrack(soundtrackId: string) {
    if (!playlist) return;

    try {
      setRemovingId(soundtrackId);
      setRemoveError("");

      const updatedPlaylist = await removeSoundtrackFromPlaylist(
        playlist._id,
        soundtrackId,
      );

      setPlaylist(updatedPlaylist);
      setRemoveError("");
    } catch {
      setRemoveError("Failed to remove soundtrack. Please try again.");
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <main className="mx-auto max-w-6xl p-8 space-y-8">
      <div className="max-w-4xl">
        <h1 className="text-4xl font-bold">{playlist.name}</h1>

        {playlist.description && (
          <p className="mt-3 text-gray-300">{playlist.description}</p>
        )}

        <p className="mt-4 text-sm text-gray-400">
          {soundtrackCount}{" "}
          {soundtrackCount === 1 ? "soundtrack" : "soundtracks"}
        </p>
      </div>

      {soundtrackCount === 0 && (
        <EmptyState
          icon={MusicalNoteIcon}
          title="No soundtracks yet"
          description="Explore soundtracks and add them to this playlist."
          buttonText="Explore Soundtracks"
          buttonHref="/explore"
        />
      )}

      {hasUnpopulatedSoundtracks && (
        <p
          role="status"
          className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-gray-300"
        >
          Soundtrack details are temporarily unavailable. Please try refreshing
          the page.
        </p>
      )}

      {removeError && (
        <p
          role="alert"
          className="rounded-lg border border-red-900 bg-red-950/50 px-4 py-3 text-sm text-red-300"
        >
          {removeError}
        </p>
      )}

      {soundtracks.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Soundtracks</h2>

          <div className="grid gap-4">
            {soundtracks.map((soundtrack) => (
              <div
                key={soundtrack._id}
                className="rounded-lg border border-zinc-800 bg-zinc-900 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {soundtrack.title}
                    </h3>

                    <p className="mt-1 text-sm text-gray-300">
                      {soundtrack.movie}
                    </p>

                    <p className="mt-1 text-sm text-gray-400">
                      {soundtrack.composer}
                    </p>
                  </div>

                  <Button
                    variant="danger"
                    loading={removingId === soundtrack._id}
                    onClick={() => handleRemoveSoundtrack(soundtrack._id)}
                  >
                    Remove
                  </Button>
                </div>

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
        </div>
      )}
    </main>
  );
}
