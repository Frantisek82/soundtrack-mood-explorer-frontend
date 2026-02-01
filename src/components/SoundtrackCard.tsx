import Link from "next/link";

type Soundtrack = {
  _id: string;
  title?: string;
  name?: string;
  artist?: string;
  composer?: string;
  coverUrl?: string;
  image?: string;
  mood?: string[];
};

type Props = {
  soundtrack: Soundtrack;
};

export default function SoundtrackCard({ soundtrack }: Props) {
  const title = soundtrack.title || soundtrack.name || "Untitled";
  const artist =
    soundtrack.artist || soundtrack.composer || "Unknown artist";
  const cover =
    soundtrack.coverUrl || soundtrack.image || null;

  return (
    <Link href={`/soundtrack/${soundtrack._id}`}>
      <div className="bg-zinc-900 rounded-xl overflow-hidden hover:scale-[1.02] transition cursor-pointer">
        <div className="aspect-square bg-black">
          {cover ? (
            <img
              src={cover}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
              No cover
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg truncate">
            {title}
          </h3>

          <p className="text-gray-400 text-sm truncate">
            {artist}
          </p>

          {Array.isArray(soundtrack.mood) &&
            soundtrack.mood.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {soundtrack.mood.map((m) => (
                  <span
                    key={m}
                    className="text-xs px-2 py-1 rounded-full border border-zinc-700 text-gray-300"
                  >
                    {m}
                  </span>
                ))}
              </div>
            )}
        </div>
      </div>
    </Link>
  );
}
