type MoodSelectorProps = {
  moods?: string[];
  selectedMood: string | null;
  onChange: (mood: string | null) => void;
};

export default function MoodSelector({
  moods = [],
  selectedMood,
  onChange,
}: MoodSelectorProps) {
  if (moods.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => onChange(null)}
        className={`px-4 py-2 rounded-full text-sm border transition
          ${
            selectedMood === null
              ? "bg-white text-black border-white"
              : "border-zinc-700 text-gray-300 hover:border-white"
          }`}
      >
        All
      </button>

      {moods.map((mood) => (
        <button
          key={mood}
          onClick={() => onChange(mood)}
          className={`px-4 py-2 rounded-full text-sm border transition
            ${
              selectedMood === mood
                ? "bg-white text-black border-white"
                : "border-zinc-700 text-gray-300 hover:border-white"
            }`}
        >
          {mood}
        </button>
      ))}
    </div>
  );
}
