import { getToken } from "@/src/utils/auth";

const API_URL = "http://localhost:3000/api";

export type FavoriteResponse = {
  _id: string;
  soundtrackId: {
    _id: string;
    title: string;
    movie: string;
    composer: string;
  };
};

/**
 * Get all favorites for the logged-in user
 * Returns empty array if not authenticated
 */
export async function getFavorites(): Promise<FavoriteResponse[]> {
  const token = getToken();

  // 🛡 Guard: user not logged in
  if (!token) {
    return [];
  }

  try {
    const res = await fetch(`${API_URL}/favorites`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (!res.ok) {
      return [];
    }

    return res.json();
  } catch {
    return [];
  }
}

/**
 * Add soundtrack to favorites
 * Throws if user is not authenticated
 */
export async function addFavorite(soundtrackId: string) {
  const token = getToken();

  if (!token) {
    throw new Error("You must be logged in to add favorites");
  }

  const res = await fetch(`${API_URL}/favorites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
    body: JSON.stringify({ soundtrackId }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to add favorite");
  }

  return res.json();
}

/**
 * Remove soundtrack from favorites
 * DELETE is idempotent on the backend
 */
export async function removeFavorite(soundtrackId: string) {
  const token = getToken();

  if (!token) return;

  await fetch(`${API_URL}/favorites/${soundtrackId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });
}

/**
 * Check if a soundtrack is favorited
 */
export async function isFavorite(
  soundtrackId: string
): Promise<boolean> {
  const token = getToken();

  // 🛡 Guard: logged out
  if (!token) return false;

  const favorites = await getFavorites();
  return favorites.some(
    (fav) => fav.soundtrackId._id === soundtrackId
  );
}
