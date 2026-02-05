type Soundtrack = {
  _id: string;
  title: string;
  movie: string;
  composer: string;
  moods: string[];
};

export default function SoundtrackCard({
  soundtrack,
}: {
  soundtrack: Soundtrack;
}) {
  return (
    <div className="bg-zinc-900 rounded-xl p-5 transition hover:bg-zinc-800">
      {/* Title */}
      <h3 className="text-lg text-white font-semibold mb-1">
        {soundtrack.title}
      </h3>

      {/* Meta */}
      <p className="text-sm text-gray-400 mb-3">
        {soundtrack.movie} · {soundtrack.composer}
      </p>

      {/* Mood tags */}
      {Array.isArray(soundtrack.moods) && soundtrack.moods.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {soundtrack.moods.map((mood) => (
            <span
              key={mood}
              className="text-xs px-2 py-1 rounded-full border border-zinc-700 text-gray-300"
            >
              {mood}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
