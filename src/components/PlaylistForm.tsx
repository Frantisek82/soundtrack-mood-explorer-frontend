"use client";

type PlaylistFormProps = {
  name: string;
  description: string;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSubmit: (e?: React.FormEvent<HTMLFormElement>) => void;
  onDescriptionKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  submitting: boolean;
  error?: string;
};

export default function PlaylistForm({
  name,
  description,
  onNameChange,
  onDescriptionChange,
  onSubmit,
  onDescriptionKeyDown,
  submitting,
  error,
}: PlaylistFormProps) {
  return (
    <div className="mb-6 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      {error && (
        <p
          role="alert"
          className="mb-4 rounded-lg border border-red-900 bg-red-950/50 px-3 py-2 text-sm text-red-300"
        >
          {error}
        </p>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Playlist name
          </label>

          <input
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="My favorite soundtracks"
            className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-zinc-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Description
          </label>

          <textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            onKeyDown={onDescriptionKeyDown}
            placeholder="Optional description"
            rows={3}
            className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-zinc-500"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting || !name.trim()}
            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Creating..." : "Create Playlist"}
          </button>
        </div>
      </form>
    </div>
  );
}
