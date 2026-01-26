export async function getSoundtracks(mood?: string) {
  // Temporary mock data
  const data = [
    {
      id: "1",
      title: "Time",
      movie: "Inception",
      composer: "Hans Zimmer",
      mood: "Epic",
    },
    {
      id: "2",
      title: "Cornfield Chase",
      movie: "Interstellar",
      composer: "Hans Zimmer",
      mood: "Calm",
    },
  ];

  return mood ? data.filter((s) => s.mood === mood) : data;
}

// This will later be replaced with a real fetch() call.