"use client";

type Props = {
  selectedMood: string | null;
  onChange: (mood: string | null) => void;
};

const moods = ["Epic", "Calm", "Dark", "Emotional", "Hopeful", "Romantic"];

export default function MoodSelector({
  selectedMood,
  onChange,
}: Props) {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Clear filter button */}
      <button
        type="button"
        onClick={() => onChange(null)}
        className={`
          px-4 py-2 rounded-full text-sm font-medium transition
          ${
            selectedMood === null
              ? "bg-white text-black"
              : "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
          }
        `}
      >
        All
      </button>

      {/* Mood buttons */}
      {moods.map((mood) => (
        <button
          key={mood}
          type="button"
          onClick={() => onChange(mood)}
          className={`
            px-4 py-2 rounded-full text-sm font-medium transition
            ${
              selectedMood === mood
                ? "bg-white text-black"
                : "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
            }
          `}
        >
          {mood}
        </button>
      ))}
    </div>
  );
}
