"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import Spinner from "@/src/components/Spinner";

import { getPlaylist } from "@/src/lib/playlists";
import type { Playlist } from "@/src/types/playlist";
import type { Soundtrack } from "@/src/types/soundtrack";

export default function PlaylistPage() {
  const params = useParams<{ id: string }>();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPlaylist() {
      try {
        setLoading(true);
        setError("");

        const data = await getPlaylist(params.id);

        setPlaylist(data);
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
      <main className="mx-auto max-w-4xl px-4 py-10">
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

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-4xl font-bold">{playlist.name}</h1>

      {playlist.description && (
        <p className="mt-3 text-gray-300">{playlist.description}</p>
      )}

      <p className="mt-4 text-sm text-gray-400">
        {soundtrackCount} {soundtrackCount === 1 ? "soundtrack" : "soundtracks"}
      </p>

      {soundtrackCount === 0 && (
        <p className="mt-4 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-gray-300">
          This playlist has no soundtracks yet.
        </p>
      )}

      {hasUnpopulatedSoundtracks && (
        <p
          role="status"
          className="mt-4 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-gray-300"
        >
          Soundtrack details are temporarily unavailable. Please try refreshing
          the page.
        </p>
      )}

      {soundtracks.length > 0 && (
        <div className="mt-8 space-y-4">
          <h2 className="text-2xl font-semibold">Soundtracks</h2>

          <div className="grid gap-4">
            {soundtracks.map((soundtrack) => (
              <div
                key={soundtrack._id}
                className="rounded-lg border border-zinc-800 bg-zinc-900 p-4"
              >
                <h3 className="text-lg font-semibold">{soundtrack.title}</h3>

                <p className="mt-1 text-sm text-gray-300">{soundtrack.movie}</p>

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
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
