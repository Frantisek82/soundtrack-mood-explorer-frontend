"use client";

import { useEffect, useState } from "react";

import Spinner from "@/src/components/Spinner";
import EmptyState from "@/src/components/EmptyState";

import { getPlaylists, createPlaylist } from "@/src/lib/playlists";
import { Playlist } from "@/src/types/playlist";

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadPlaylists() {
      try {
        setLoading(true);
        setError("");

        const data = await getPlaylists();
        setPlaylists(data);
      } catch {
        setError("Failed to load playlists.");
      } finally {
        setLoading(false);
      }
    }

    loadPlaylists();
  }, []);

  async function handleCreatePlaylist() {
    if (!newName.trim()) return;

    try {
      setSubmitting(true);

      const playlist = await createPlaylist({
        name: newName.trim(),
        description: newDescription.trim(),
      });

      setPlaylists((prev) => [playlist, ...prev]);

      setNewName("");
      setNewDescription("");
      setShowForm(false);
    } catch {
      alert("Failed to create playlist");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-center text-red-500">{error}</p>
      </main>
    );
  }

  if (playlists.length === 0) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold">My Playlists</h1>

          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500"
          >
            {showForm ? "Cancel" : "New Playlist"}
          </button>
        </div>

        {showForm && (
          <div className="mb-6 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Playlist name
                </label>

                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="My favorite soundtracks"
                  className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Description
                </label>

                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Optional description"
                  rows={3}
                  className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleCreatePlaylist}
                  disabled={submitting || !newName.trim()}
                  className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? "Creating..." : "Create Playlist"}
                </button>
              </div>
            </div>
          </div>
        )}

        <EmptyState
          title="No playlists yet"
          description="Create your first custom playlist to organize your favorite soundtracks."
        />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold">My Playlists</h1>

        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500"
        >
          {showForm ? "Cancel" : "New Playlist"}
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Playlist name
              </label>

              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="My favorite soundtracks"
                className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-zinc-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Description
              </label>

              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Optional description"
                rows={3}
                className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-zinc-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleCreatePlaylist}
                disabled={submitting || !newName.trim()}
                className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Creating..." : "Create Playlist"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {playlists.map((playlist) => (
          <div
            key={playlist._id}
            className="rounded-lg border border-gray-700 bg-gray-800 p-5"
          >
            <h2 className="text-xl font-semibold">{playlist.name}</h2>

            {playlist.description && (
              <p className="mt-2 text-gray-300">{playlist.description}</p>
            )}

            <p className="mt-4 text-sm text-gray-400">
              {playlist.soundtracks.length} soundtracks
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
