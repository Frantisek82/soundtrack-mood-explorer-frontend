import { getAuthHeaders } from "@/src/utils/auth";

const API_BASE = "http://localhost:3000/api";

/**
 * Shared Soundtrack type
 */
export type Soundtrack = {
  _id: string;
  title: string;
  movie: string;
  composer: string;
  moods: string[];
  spotifyTrackId?: string;
};

/**
 * Get all favorite soundtracks
 */
export async function getFavorites(): Promise<Soundtrack[]> {
  const res = await fetch(`${API_BASE}/favorites`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to load favorites");
  }

  return res.json();
}

/**
 * Add soundtrack to favorites
 */
export async function addFavorite(
  soundtrackId: string
): Promise<void> {
  const res = await fetch(`${API_BASE}/favorites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ soundtrackId }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to add favorite");
  }
}

/**
 * Remove soundtrack from favorites
 */
export async function removeFavorite(
  soundtrackId: string
): Promise<void> {
  const res = await fetch(
    `${API_BASE}/favorites/${soundtrackId}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to remove favorite");
  }
}

/**
 * Check if soundtrack is favorite
 * Safe if user not logged in
 */
export async function isFavorite(
  soundtrackId: string
): Promise<boolean> {
  try {
    const favorites = await getFavorites();
    return favorites.some(
      (s) => s._id === soundtrackId
    );
  } catch {
    return false;
  }
}
