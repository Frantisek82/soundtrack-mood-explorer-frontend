"use client";

type SpinnerProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

export default function Spinner({
  size = "md",
  className = "",
}: SpinnerProps) {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-10 w-10 border-4",
  };

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className={`
        inline-block
        animate-spin
        rounded-full
        border-zinc-600
        border-t-white
        ${sizes[size]}
        ${className}
      `}
    />
  );
}
