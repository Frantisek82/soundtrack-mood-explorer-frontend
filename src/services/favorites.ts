import { getAuthHeaders } from "@/src/utils/auth";

export type Soundtrack = {
  _id: string;
  title: string;
  movie: string;
  composer: string;
  moods: string[];
  spotifyTrackId?: string;
};

const API_URL = "http://localhost:3000/api/favorites";

export async function getFavorites(): Promise<Soundtrack[]> {
  const res = await fetch(API_URL, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to load favorites");
  }

  return res.json();
}

export async function addFavorite(soundtrackId: string): Promise<void> {
  const res = await fetch(API_URL, {
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

export async function removeFavorite(soundtrackId: string): Promise<void> {
  const res = await fetch(`${API_URL}/${soundtrackId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to remove favorite");
  }
}

export async function isFavorite(
  soundtrackId: string
): Promise<boolean> {
  try {
    const favorites = await getFavorites();
    return favorites.some((s) => s._id === soundtrackId);
  } catch {
    return false;
  }
}
