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
 * Get all soundtracks
 */
export async function getSoundtracks(): Promise<Soundtrack[]> {
  const res = await fetch(`${API_BASE}/soundtracks`);

  if (!res.ok) {
    throw new Error("Failed to load soundtracks");
  }

  return res.json();
}

/**
 * Get single soundtrack by ID
 */
export async function getSoundtrackById(
  id: string
): Promise<Soundtrack> {
  const res = await fetch(`${API_BASE}/soundtracks/${id}`);

  if (!res.ok) {
    throw new Error("Failed to load soundtrack");
  }

  return res.json();
}
