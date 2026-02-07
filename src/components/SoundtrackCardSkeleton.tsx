"use client";

export default function SoundtrackCardSkeleton() {
  return (
    <div
      className="
        bg-zinc-900 rounded-xl p-5
        animate-pulse
        space-y-3
      "
      aria-hidden="true"
    >
      {/* Title */}
      <div className="h-5 w-3/4 bg-zinc-700 rounded" />

      {/* Meta */}
      <div className="h-4 w-1/2 bg-zinc-700 rounded" />

      {/* Mood tags */}
      <div className="flex gap-2">
        <div className="h-6 w-14 bg-zinc-700 rounded-full" />
        <div className="h-6 w-10 bg-zinc-700 rounded-full" />
        <div className="h-6 w-12 bg-zinc-700 rounded-full" />
      </div>
    </div>
  );
}
