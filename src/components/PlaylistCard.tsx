"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import PlaylistForm from "@/src/components/PlaylistForm";
import type { Playlist } from "@/src/types/playlist";

type PlaylistCardProps = {
  playlist: Playlist;
  onDelete: (id: string) => void;
  onUpdate: (
    id: string,
    data: {
      name: string;
      description: string;
    },
  ) => Promise<void>;
};

export default function PlaylistCard({
  playlist,
  onDelete,
  onUpdate,
}: PlaylistCardProps) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(playlist.name);
  const [description, setDescription] = useState(playlist.description ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const soundtrackCount = playlist.soundtracks.length;

  function startEditing() {
    setName(playlist.name);
    setDescription(playlist.description ?? "");
    setError("");
    setEditing(true);
  }

  function cancelEditing() {
    setName(playlist.name);
    setDescription(playlist.description ?? "");
    setError("");
    setEditing(false);
  }

  async function handleSubmit(e?: FormEvent<HTMLFormElement>) {
    e?.preventDefault();

    if (!name.trim()) return;

    try {
      setSubmitting(true);
      setError("");

      await onUpdate(playlist._id, {
        name: name.trim(),
        description: description.trim(),
      });

      setEditing(false);
    } catch {
      setError("Failed to update playlist. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (editing) {
    return (
      <div className="rounded-lg border border-gray-700 bg-gray-800 p-4 sm:p-5">
        <PlaylistForm
          name={name}
          description={description}
          onNameChange={setName}
          onDescriptionChange={setDescription}
          onSubmit={handleSubmit}
          submitting={submitting}
          error={error}
          submitLabel="Save Changes"
          cancelLabel="Cancel"
          onCancel={cancelEditing}
        />
      </div>
    );
  }

  return (
    <article className="rounded-lg border border-gray-700 bg-gray-800 p-4 transition hover:border-zinc-500 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold">{playlist.name}</h2>

          {playlist.description && (
            <p className="mt-2 text-gray-300">{playlist.description}</p>
          )}
        </div>

        <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:flex-nowrap">
          <Link
            href={`/playlists/${playlist._id}`}
            aria-label={`Open playlist ${playlist.name}`}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-md border border-zinc-600 bg-zinc-900 px-3 py-1 text-sm text-gray-200 transition hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 sm:flex-none"
          >
            Open
          </Link>

          <button
            type="button"
            aria-label={`Edit playlist ${playlist.name}`}
            onClick={startEditing}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-md border border-zinc-600 bg-zinc-900 px-3 py-1 text-sm text-gray-200 transition hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 sm:flex-none"
          >
            Edit
          </button>

          <button
            type="button"
            aria-label={`Delete playlist ${playlist.name}`}
            onClick={() => onDelete(playlist._id)}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-md border border-red-900 bg-red-950 px-3 py-1 text-sm text-red-300 transition hover:bg-red-900/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 sm:flex-none"
          >
            Delete
          </button>
        </div>
      </div>

      <p className="mt-4 text-sm text-gray-400">
        {soundtrackCount} {soundtrackCount === 1 ? "soundtrack" : "soundtracks"}
      </p>
    </article>
  );
}
