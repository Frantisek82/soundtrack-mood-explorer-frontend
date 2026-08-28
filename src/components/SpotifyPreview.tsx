"use client";

import { useState } from "react";
import Link from "next/link";

type SpotifyPreviewProps = {
  trackId?: string;
  title: string;
};

export default function SpotifyPreview({
  trackId,
  title,
}: SpotifyPreviewProps) {
  const [hasError, setHasError] = useState(false);

  if (!trackId) {
    return (
      <p role="status" aria-live="polite" className="text-sm text-gray-400">
        Spotify preview is not available for this soundtrack.
      </p>
    );
  }

  if (hasError) {
    return (
      <div
        role="alert"
        className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 text-sm text-gray-300 space-y-2"
      >
        <p>Spotify preview is currently unavailable.</p>

        <Link
          href={`https://open.spotify.com/track/${trackId}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${title} in Spotify (opens in a new tab)`}
          className="inline-flex min-h-11 items-center rounded text-green-400 underline transition hover:text-green-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
        >
          Open in Spotify
        </Link>
      </div>
    );
  }

  return (
    <iframe
      src={`https://open.spotify.com/embed/track/${trackId}`}
      width="100%"
      height="80"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
      className="rounded-lg border-none"
      title={`Spotify preview for ${title}`}
      onError={() => setHasError(true)}
    />
  );
}
