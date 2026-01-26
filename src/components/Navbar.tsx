"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      pathname === path
        ? "bg-white text-black"
        : "text-gray-300 hover:text-white"
    }`;

  return (
    <nav className="w-full bg-zinc-900 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-white">
          🎬 Soundtrack
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-2">
          <Link href="/" className={linkClass("/")}>
            Home
          </Link>
          <Link href="/explore" className={linkClass("/explore")}>
            Explore
          </Link>
          <Link href="/contact" className={linkClass("/contact")}>
            Contact
          </Link>
          <Link href="/profile" className={linkClass("/profile")}>
            Profile
          </Link>
          <Link href="/login" className={linkClass("/login")}>
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
