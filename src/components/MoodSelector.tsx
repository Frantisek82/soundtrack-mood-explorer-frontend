"use client";

const moods = ["Epic", "Sad", "Calm", "Tense"];

type Props = {
  selected: string | null;
  onSelect: (mood: string | null) => void;
};

export default function MoodSelector({ selected, onSelect }: Props) {
  return (
    <div className="flex gap-3 flex-wrap mb-8">
      <button
        onClick={() => onSelect(null)}
        className={`px-4 py-2 rounded-full border ${
          selected === null
            ? "bg-white text-black"
            : "border-zinc-700 text-gray-300"
        }`}
      >
        All
      </button>

      {moods.map((mood) => (
        <button
          key={mood}
          onClick={() => onSelect(mood)}
          className={`px-4 py-2 rounded-full border ${
            selected === mood
              ? "bg-white text-black"
              : "border-zinc-700 text-gray-300 hover:text-white"
          }`}
        >
          {mood}
        </button>
      ))}
    </div>
  );
}
