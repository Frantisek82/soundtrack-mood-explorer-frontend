"use cleint";

import Link from "next/link";

type Props = {
  _id: string;
  title: string;
  movie: string;
  composer: string;
};

export default function SoundtrackCard({
  _id,
  title,
  movie,
  composer,
}: Props) {
  return (
    <Link
      href={`/soundtrack/${_id}`}
      className="bg-zinc-900 p-4 rounded-xl hover:bg-zinc-800 transition"
    >
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-gray-400">{movie}</p>
      <p className="text-xs text-gray-500">{composer}</p>
    </Link>
  );
}
