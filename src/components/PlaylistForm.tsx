"use client";

import { useId } from "react";

type PlaylistFormProps = {
  name: string;
  description: string;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSubmit: (e?: React.FormEvent<HTMLFormElement>) => void;
  submitting: boolean;
  error?: string;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
};

export default function PlaylistForm({
  name,
  description,
  onNameChange,
  onDescriptionChange,
  onSubmit,
  submitting,
  error,
  submitLabel = "Create Playlist",
  cancelLabel = "Cancel",
  onCancel,
}: PlaylistFormProps) {
  const nameId = useId();
  const descriptionId = useId();
  const errorId = useId();
  return (
    <div className="mb-6 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      {error && (
        <p
          id={errorId}
          role="alert"
          className="mb-4 rounded-lg border border-red-900 bg-red-950/50 px-3 py-2 text-sm text-red-300"
        >
          {error}
        </p>
      )}

      <form
        onSubmit={onSubmit}
        aria-describedby={error ? errorId : undefined}
        className="space-y-4"
      >
        <div>
          <label
            htmlFor={nameId}
            className="mb-2 block text-sm font-medium text-gray-300"
          >
            Playlist name
          </label>

          <input
            id={nameId}
            required
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="My favorite soundtracks"
            className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-zinc-500"
          />
        </div>

        <div>
          <label
            htmlFor={descriptionId}
            className="mb-2 block text-sm font-medium text-gray-300"
          >
            Description (optional)
          </label>

          <textarea
            id={descriptionId}
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Optional description"
            rows={3}
            className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-zinc-500"
          />
        </div>

        <div className="flex justify-end gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-gray-200 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {cancelLabel}
            </button>
          )}

          <button
            type="submit"
            disabled={submitting || !name.trim()}
            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Saving..." : submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
