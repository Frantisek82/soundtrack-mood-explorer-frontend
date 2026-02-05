"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SoundtrackCard from "@/src/components/SoundtrackCard";
import {
  addFavorite,
  removeFavorite,
  isFavorite,
} from "@/src/services/favorites";
import { getSoundtrackById } from "@/src/services/soundtracks";

type Soundtrack = {
  _id: string;
  title: string;
  movie: string;
  composer: string;
  moods: string[];
  spotifyTrackId?: string;
};

export default function SoundtrackDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [soundtrack, setSoundtrack] = useState<Soundtrack | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFav, setIsFav] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    async function loadSoundtrack() {
      try {
        const data = await getSoundtrackById(id);
        setSoundtrack(data);

        // Safe favorites check (works when logged out)
        try {
          const fav = await isFavorite(data._id);
          setIsFav(fav);
        } catch {
          setIsFav(false);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load soundtrack");
      } finally {
        setLoading(false);
      }
    }

    loadSoundtrack();
  }, [id]);

  async function toggleFavorite() {
    if (!soundtrack) return;

    setFavLoading(true);
    try {
      if (isFav) {
        await removeFavorite(soundtrack._id);
        setIsFav(false);
      } else {
        await addFavorite(soundtrack._id);
        setIsFav(true);
      }
    } catch (err: any) {
      alert(err.message || "Failed to update favorites");
    } finally {
      setFavLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-400">
        Loading soundtrack…
      </div>
    );
  }

  if (error || !soundtrack) {
    return (
      <div className="p-8 text-center text-red-400">
        {error || "Soundtrack not found"}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-8">
      {/* Unified soundtrack card (same as Explore/Favorites) */}
      <SoundtrackCard soundtrack={soundtrack} />

      {/* Favorite action */}
      <button
        onClick={toggleFavorite}
        disabled={favLoading}
        className="px-4 py-2 rounded bg-zinc-800 hover:bg-zinc-700 transition disabled:opacity-50"
      >
        {isFav ? "Remove from Favorites" : "Save to Favorites"}
      </button>

      {/* Spotify embed */}
      {soundtrack.spotifyTrackId && (
        <section className="pt-6 border-t border-zinc-800">
          <h3 className="text-sm uppercase tracking-wide text-gray-400 mb-3">
            Spotify Preview
          </h3>

          <iframe
            src={`https://open.spotify.com/embed/track/${soundtrack.spotifyTrackId}`}
            width="100%"
            height="80"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="rounded-lg border-none"
          />
        </section>
      )}
    </div>
  );
}
