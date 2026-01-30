const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Helper to get JWT token from localStorage
 */
function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

/**
 * Add a soundtrack to favorites
 */
export async function addFavorite(soundtrackId: string) {
  const token = getToken();

  if (!token) {
    throw new Error("Not authenticated");
  }

  const res = await fetch(`${API_URL}/favorites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ soundtrackId }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to add favorite");
  }

  return res.json();
}

/**
 * Get all favorites for the logged-in user
 */
export async function getFavorites() {
  const token = getToken();

  if (!token) {
    throw new Error("Not authenticated");
  }

  const res = await fetch(`${API_URL}/favorites`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch favorites");
  }

  return res.json();
}

/**
 * Disable “Add to Favorites” if Already Favorited
 */
export async function isFavorite(soundtrackId: string): Promise<boolean> {
  const token = getToken();

  if (!token) return false;

  const res = await fetch(`${API_URL}/favorites`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) return false;

  const favorites = await res.json();

  return favorites.some(
    (fav: any) => fav.soundtrackId._id === soundtrackId
  );
}


/**
 * Remove a soundtrack from favorites
 */
export async function removeFavorite(soundtrackId: string) {
  const token = getToken();

  if (!token) {
    throw new Error("Not authenticated");
  }

  const res = await fetch(`${API_URL}/favorites`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ soundtrackId }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to remove favorite");
  }

  return res.json();
}