"use client";

import { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    `
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
    danger:
      "bg-zinc-900 border border-red-500/40 text-red-400 hover:bg-zinc-800",
  };

  return (
    <button
      {...props}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
