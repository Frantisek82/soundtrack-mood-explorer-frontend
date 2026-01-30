"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isAuthenticated, logout } from "@/src/utils/auth";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  // ✅ Run only on client after hydration
  useEffect(() => {
    setMounted(true);
    setLoggedIn(isAuthenticated());
  }, []);

  const linkClass = (path: string) =>
    pathname === path
      ? "text-white font-semibold"
      : "text-gray-400 hover:text-white transition";

  // ⛔ Prevent rendering until mounted (avoids hydration mismatch)
  if (!mounted) {
    return null;
  }

  return (
    <nav className="border-b border-zinc-800 bg-black">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Left */}
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-bold text-white">
            Soundtrack Explorer
          </Link>

          <Link href="/explore" className={linkClass("/explore")}>
            Explore
          </Link>

          {loggedIn && (
            <Link href="/favorites" className={linkClass("/favorites")}>
              Favorites
            </Link>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          {loggedIn ? (
            <>
              <Link href="/profile" className={linkClass("/profile")}>
                Profile
              </Link>

              <button
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
                className="text-gray-400 hover:text-white transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={linkClass("/login")}>
                Login
              </Link>

              <Link href="/register" className={linkClass("/register")}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}