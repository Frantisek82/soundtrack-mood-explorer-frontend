"use client";

import Link from "next/link";
import { useState, type FormEvent, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";

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

  const router = useRouter();

  function openPlaylist() {
    router.push(`/playlists/${playlist._id}`);
  }

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

  function handleDescriptionKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  if (editing) {
    return (
      <div className="rounded-lg border border-gray-700 bg-gray-800 p-5">
        <PlaylistForm
          name={name}
          description={description}
          onNameChange={setName}
          onDescriptionChange={setDescription}
          onSubmit={handleSubmit}
          onDescriptionKeyDown={handleDescriptionKeyDown}
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
    <div
      role="link"
      tabIndex={0}
      onClick={openPlaylist}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openPlaylist();
        }
      }}
      className="cursor-pointer rounded-lg border border-gray-700 bg-gray-800 p-5 transition hover:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">{playlist.name}</h2>

          {playlist.description && (
            <p className="mt-2 text-gray-300">{playlist.description}</p>
          )}
        </div>

        <div className="flex gap-2">
          <Link
            href={`/playlists/${playlist._id}`}
            onClick={(e) => e.stopPropagation()}
            className="rounded-md border border-zinc-600 bg-zinc-900 px-3 py-1 text-sm text-gray-200 transition hover:bg-zinc-700"
          >
            Open
          </Link>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              startEditing();
            }}
            className="rounded-md border border-zinc-600 bg-zinc-900 px-3 py-1 text-sm text-gray-200 transition hover:bg-zinc-700"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(playlist._id);
            }}
            className="rounded-md border border-red-900 bg-red-950 px-3 py-1 text-sm text-red-300 transition hover:bg-red-900/50"
          >
            Delete
          </button>
        </div>
      </div>

      <p className="mt-4 text-sm text-gray-400">
        {soundtrackCount} {soundtrackCount === 1 ? "soundtrack" : "soundtracks"}
      </p>
    </div>
  );
}
