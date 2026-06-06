const API_URL = `${
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
}/favorites`;

/* =====================
   Get favorites
===================== */

export async function getFavorites() {
  const res = await fetch(API_URL, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch favorites");
  }

  return res.json();
}

/* =====================
   Add favorite
===================== */

export async function addFavorite(soundtrackId: string) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ soundtrackId }),
  });

  if (!res.ok) {
    throw new Error("Failed to add favorite");
  }
}

/* =====================
   Remove favorite
===================== */

export async function removeFavorite(trackId: string) {
  const res = await fetch(`${API_URL}/${trackId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to remove favorite");
  }
}

/* =====================
   Check favorite
===================== */

export async function isFavorite(trackId: string) {
  const res = await fetch(`${API_URL}/${trackId}`, {
    credentials: "include",
  });

  if (!res.ok) {
    return false;
  }

  const data = await res.json();
  return data.isFavorite;
}
