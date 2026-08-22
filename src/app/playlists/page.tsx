"use client";

import { useEffect, useState, type FormEvent } from "react";

import Spinner from "@/src/components/Spinner";
import EmptyState from "@/src/components/EmptyState";
import PlaylistCard from "@/src/components/PlaylistCard";
import ConfirmDialog from "@/src/components/ConfirmDialog";
import PlaylistForm from "@/src/components/PlaylistForm";

import {
  getPlaylists,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
} from "@/src/lib/playlists";
import { Playlist } from "@/src/types/playlist";

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [createError, setCreateError] = useState("");

  const [playlistToDelete, setPlaylistToDelete] = useState<Playlist | null>(
    null,
  );

  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

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

  async function handleCreatePlaylist(e?: FormEvent<HTMLFormElement>) {
    e?.preventDefault();

    if (!newName.trim()) return;

    try {
      setSubmitting(true);
      setCreateError("");

      const playlist = await createPlaylist({
        name: newName.trim(),
        description: newDescription.trim(),
      });

      setPlaylists((prev) => [playlist, ...prev]);

      setNewName("");
      setNewDescription("");
      setCreateError("");
      setShowForm(false);
    } catch {
      setCreateError("Failed to create playlist. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdatePlaylist(
    id: string,
    data: {
      name: string;
      description: string;
    },
  ) {
    const updatedPlaylist = await updatePlaylist(id, data);

    setPlaylists((prev) =>
      prev.map((playlist) =>
        playlist._id === updatedPlaylist._id ? updatedPlaylist : playlist,
      ),
    );
  }

  function handleDeletePlaylist(id: string) {
    const playlist = playlists.find((p) => p._id === id);

    if (playlist) {
      setDeleteError("");
      setPlaylistToDelete(playlist);
    }
  }

  async function confirmDeletePlaylist() {
    if (!playlistToDelete) return;

    try {
      setDeleting(true);

      await deletePlaylist(playlistToDelete._id);

      setPlaylists((prev) =>
        prev.filter((p) => p._id !== playlistToDelete._id),
      );

      setDeleteError("");
      setPlaylistToDelete(null);
    } catch {
      setDeleteError("Failed to delete playlist. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  function toggleCreateForm() {
    setCreateError("");

    if (showForm) {
      setNewName("");
      setNewDescription("");
    }

    setShowForm((prev) => !prev);
  }

  const header = (
    <div className="mb-8 flex items-center justify-between">
      <h1 className="text-4xl font-bold">My Playlists</h1>

      <button
        type="button"
        aria-expanded={showForm}
        aria-controls="new-playlist-form"
        onClick={toggleCreateForm}
        className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500"
      >
        {showForm ? "Cancel" : "New Playlist"}
      </button>
    </div>
  );

  const playlistForm = (
    <div id="new-playlist-form">
      <PlaylistForm
        name={newName}
        description={newDescription}
        onNameChange={setNewName}
        onDescriptionChange={setNewDescription}
        onSubmit={handleCreatePlaylist}
        submitting={submitting}
        error={createError}
      />
    </div>
  );

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <Spinner label="Loading playlists" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <p role="alert" className="text-center text-red-500">
          {error}
        </p>
      </main>
    );
  }

  if (playlists.length === 0) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        {header}

        {showForm && playlistForm}

        <EmptyState
          title="No playlists yet"
          description="Create your first custom playlist to organize your favorite soundtracks."
        />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      {header}

      {showForm && playlistForm}

      <div className="grid gap-4">
        {playlists.map((playlist) => (
          <PlaylistCard
            key={playlist._id}
            playlist={playlist}
            onDelete={handleDeletePlaylist}
            onUpdate={handleUpdatePlaylist}
          />
        ))}
      </div>

      <ConfirmDialog
        open={playlistToDelete !== null}
        title="Delete playlist"
        description={
          playlistToDelete
            ? `Are you sure you want to delete "${playlistToDelete.name}"? This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        loading={deleting}
        error={deleteError}
        onConfirm={confirmDeletePlaylist}
        onCancel={() => {
          setDeleteError("");
          setPlaylistToDelete(null);
        }}
      />
    </main>
  );
}
