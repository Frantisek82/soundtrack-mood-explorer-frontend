export async function getSoundtracks(mood?: string) {
  // Temporary mock data
  const data = [
  {
    id: "1",
    title: "Time",
    movie: "Inception",
    composer: "Hans Zimmer",
    mood: ["Epic", "Emotional"],
    previewUrl: "",
  },
  {
    id: "2",
    title: "Cornfield Chase",
    movie: "Interstellar",
    composer: "Hans Zimmer",
    mood: ["Calm"],
    previewUrl: "",
  },
];

export async function getSoundtracks(mood?: string) {
  return mood ? data.filter((s) => s.mood.includes(mood)) : data;
}

export async function getSoundtrackById(id: string) {
  return data.find((s) => s.id === id);
}


// This will later be replaced with a real fetch() call.