type Playlist = {
  _id: string;
  name: string;
  description?: string;
  soundtracks: string[];
};

type PlaylistCardProps = {
  playlist: Playlist;
  onDelete: (id: string) => void;
};

export default function PlaylistCard({
  playlist,
  onDelete,
}: PlaylistCardProps) {
  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">{playlist.name}</h2>

          {playlist.description && (
            <p className="mt-2 text-gray-300">{playlist.description}</p>
          )}
        </div>

        <button
          type="button"
          onClick={() => onDelete(playlist._id)}
          className="rounded-md border border-red-900 bg-red-950 px-3 py-1 text-sm text-red-300 transition hover:bg-red-900/50"
        >
          Delete
        </button>
      </div>

      <p className="mt-4 text-sm text-gray-400">
        {playlist.soundtracks.length} soundtracks
      </p>
    </div>
  );
}
