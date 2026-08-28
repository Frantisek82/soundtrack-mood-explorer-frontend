"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { isAuthenticated, logout } from "@/src/utils/auth";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  /* =====================
  Check auth (ASYNC)
  ===================== */
  useEffect(() => {
    async function checkAuth() {
      const isAuth = await isAuthenticated();
      setLoggedIn(isAuth);
    }

    checkAuth();
  }, [pathname]);

  /* =====================
Close mobile menu with Escape
===================== */
  useEffect(() => {
    if (!menuOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  /* =====================
  Logout
  ===================== */
  async function handleLogout() {
    await logout();

    setLoggedIn(false);
    setMenuOpen(false);

    router.push("/login");
  }

  const linkClass = (path: string) => {
    const baseClass =
      "rounded-md px-3 py-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60";

    return pathname.startsWith(path)
      ? `${baseClass} font-semibold text-white`
      : `${baseClass} text-gray-400 hover:text-white`;
  };

  /* =====================
  Loading guard
  ===================== */
  if (loggedIn === null) {
    return null;
  }

  return (
    <nav className="border-b border-zinc-800 bg-black">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="rounded-md text-lg font-semibold text-zinc-200 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 md:text-xl"
          >
            Soundtrack Mood Explorer
          </Link>

          {/* Mobile Hamburger */}
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-md text-2xl text-zinc-200 transition hover:bg-zinc-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 lg:hidden"
            aria-label={
              menuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            <span aria-hidden="true">{menuOpen ? "✕" : "☰"}</span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex gap-6 items-center">
            <Link href="/explore" className={linkClass("/explore")}>
              Explore
            </Link>

            {loggedIn ? (
              <>
                <Link href="/favorites" className={linkClass("/favorites")}>
                  Favorites
                </Link>

                <Link href="/playlists" className={linkClass("/playlists")}>
                  Playlists
                </Link>

                <Link href="/profile" className={linkClass("/profile")}>
                  Profile
                </Link>

                <Link href="/contact" className={linkClass("/contact")}>
                  Contact
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="cursor-pointer rounded-md px-3 py-2 text-red-400 transition hover:text-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300/60"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/contact" className={linkClass("/contact")}>
                  Contact
                </Link>

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

        {/* Mobile Navigation */}
        {menuOpen && (
          <div
            id="mobile-navigation"
            className="mt-4 flex flex-col gap-2 border-t border-zinc-800 pt-4 text-center lg:hidden"
          >
            <Link
              href="/explore"
              className={linkClass("/explore")}
              onClick={() => setMenuOpen(false)}
            >
              Explore
            </Link>

            {loggedIn ? (
              <>
                <Link
                  href="/favorites"
                  className={linkClass("/favorites")}
                  onClick={() => setMenuOpen(false)}
                >
                  Favorites
                </Link>

                <Link
                  href="/playlists"
                  className={linkClass("/playlists")}
                  onClick={() => setMenuOpen(false)}
                >
                  Playlists
                </Link>

                <Link
                  href="/profile"
                  className={linkClass("/profile")}
                  onClick={() => setMenuOpen(false)}
                >
                  Profile
                </Link>

                <Link
                  href="/contact"
                  className={linkClass("/contact")}
                  onClick={() => setMenuOpen(false)}
                >
                  Contact
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="min-h-11 rounded-md px-3 py-2 text-red-400 transition hover:bg-zinc-900 hover:text-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300/60"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/contact"
                  className={linkClass("/contact")}
                  onClick={() => setMenuOpen(false)}
                >
                  Contact
                </Link>

                <Link
                  href="/login"
                  className={linkClass("/login")}
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className={linkClass("/register")}
                  onClick={() => setMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
