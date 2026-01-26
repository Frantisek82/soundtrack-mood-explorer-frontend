type Props = {
  label: string;
};

export default function MoodTag({ label }: Props) {
  return (
    <span className="px-3 py-1 rounded-full text-xs bg-zinc-800 text-gray-300">
      {label}
    </span>
  );
}
