"use client";

import { ButtonHTMLAttributes } from "react";
import Spinner from "./Spinner";

type ButtonVariant = "primary" | "secondary" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  loading?: boolean;
};

export default function Button({
  children,
  variant = "primary",
  loading = false,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const baseStyles = `
    px-4 py-2 rounded
    transition
    disabled:opacity-50
    disabled:cursor-not-allowed

    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-white
    focus-visible:ring-offset-2
    focus-visible:ring-offset-black
  `;

  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-zinc-900 border border-zinc-700 text-white hover:bg-zinc-800",

    secondary:
      "bg-zinc-800 border border-zinc-600 text-gray-200 hover:bg-zinc-700",

    danger:
      "bg-zinc-900 border border-red-500/40 text-red-400 hover:bg-zinc-800",
  };

  return (
    <button
      {...props}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <Spinner size="sm" />
          <span>Loading</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
