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
    "px-4 py-2 rounded font-medium transition disabled:opacity-50 disabled:cursor-not-allowed";

  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-emerald-600 text-white hover:bg-emerald-500 focus:ring-2 focus:ring-emerald-400",
    danger:
      "bg-red-600 text-white hover:bg-red-500 focus:ring-2 focus:ring-red-400",
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
