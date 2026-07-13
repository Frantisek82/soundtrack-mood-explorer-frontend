"use client";

export default function SoundtrackCardSkeleton() {
  return (
    <div
      className="
        animate-pulse
        rounded-xl
        border border-zinc-700
        bg-zinc-900
        p-5
        shadow-sm
        space-y-4
      "
      aria-hidden="true"
      role="presentation"
    >
      {/* Title */}
      <div className="h-6 w-2/3 rounded bg-zinc-600" />

      {/* Meta */}
      <div className="h-4 w-1/2 rounded bg-zinc-700" />

      {/* Mood tags */}
      <div className="flex gap-2">
        <div className="h-6 w-14 rounded-full bg-zinc-700" />
        <div className="h-6 w-10 rounded-full bg-zinc-700" />
        <div className="h-6 w-12 rounded-full bg-zinc-700" />
      </div>
    </div>
  );
}