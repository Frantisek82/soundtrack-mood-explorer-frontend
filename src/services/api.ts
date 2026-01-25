const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchSoundtracks(mood?: string) {
  const url = mood
    ? `${API_URL}/soundtracks?mood=${mood}`
    : `${API_URL}/soundtracks`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch soundtracks");
  return res.json();
}
